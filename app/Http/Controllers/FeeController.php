<?php

namespace App\Http\Controllers;

use App\Models\StudentFee;
use App\Models\FeeStructure;
use App\Models\Payment;
use App\Models\Student;
use App\Models\AcademicYear;
use App\Models\Term;
use App\Models\Grade;
use App\Services\FeeGenerationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FeeController extends Controller
{
    public function __construct(protected FeeGenerationService $feeGenerationService)
    {
    }

    public function index(Request $request)
    {
        $query = FeeStructure::with(['academicYear', 'term', 'grade'])
            ->withCount('studentFees');

        if ($request->has('term_id')) {
            $query->where('term_id', $request->term_id);
        }

        if ($request->has('grade_id')) {
            $query->where('grade_id', $request->grade_id);
        }

        $feeStructures = $query->get();
        $terms = Term::with('academicYear')->get();
        $grades = Grade::withCount(['students' => fn ($q) => $q->where('status', 'active')])->ordered()->get();

        return Inertia::render('Fees/Index', [
            'feeStructures' => $feeStructures,
            'terms' => $terms,
            'grades' => $grades,
            'filters' => $request->only(['term_id', 'grade_id'])
        ]);
    }

    public function create()
    {
        $academicYears = AcademicYear::all();
        $terms = Term::with('academicYear')->get();
        $grades = Grade::ordered()->get();

        return Inertia::render('Fees/Create', [
            'academicYears' => $academicYears,
            'terms' => $terms,
            'grades' => $grades
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'term_id' => 'required|exists:terms,id',
            'grade_id' => 'required|exists:grades,id',
            'fee_type' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $feeStructure = FeeStructure::create($validated);

        $billed = $this->feeGenerationService->generateForStructure($feeStructure);

        return redirect()->route('fees.index')
            ->with('success', "Fee structure created. {$billed} student(s) billed.");
    }

    public function generateMissing(FeeStructure $feeStructure)
    {
        $billed = $this->feeGenerationService->generateForStructure($feeStructure);

        return back()->with(
            'success',
            $billed > 0
                ? "Billed {$billed} additional student(s)."
                : 'Every active student in this grade is already billed.'
        );
    }

    public function studentFees($studentId)
    {
        $student = Student::with(['grade', 'stream'])->findOrFail($studentId);
        $this->authorize('view', $student);

        $fees = StudentFee::where('student_id', $studentId)
            ->with(['feeStructure', 'payments'])
            ->get();

        $summary = [
            'total_due' => $fees->sum('amount_due'),
            'total_paid' => $fees->sum('amount_paid'),
            'total_balance' => $fees->sum('balance'),
        ];

        return Inertia::render('Fees/StudentFees', [
            'student' => $student,
            'fees' => $fees,
            'summary' => $summary
        ]);
    }

    public function createPayment($studentId)
    {
        $student = Student::with(['grade'])->findOrFail($studentId);
        $pendingFees = StudentFee::where('student_id', $studentId)
            ->where('balance', '>', 0)
            ->with('feeStructure')
            ->get();

        return Inertia::render('Fees/CreatePayment', [
            'student' => $student,
            'pendingFees' => $pendingFees
        ]);
    }

    public function storePayment(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'student_fee_id' => 'required|exists:student_fees,id',
            'amount' => 'required|numeric|min:1',
            'payment_date' => 'required|date',
            'payment_method' => 'required|in:cash,mpesa,bank_transfer,cheque,other',
            'transaction_reference' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $studentFee = StudentFee::findOrFail($validated['student_fee_id']);

            if (bccomp((string) $validated['amount'], (string) $studentFee->balance, 2) > 0) {
                DB::rollBack();
                return back()->withErrors([
                    'amount' => 'Payment amount cannot exceed the outstanding balance of KSh ' . number_format($studentFee->balance, 2) . '.',
                ])->withInput();
            }

            $receiptNumber = Payment::generateReceiptNumber();

            $payment = Payment::create([
                'student_id' => $validated['student_id'],
                'student_fee_id' => $validated['student_fee_id'],
                'receipt_number' => $receiptNumber,
                'amount' => $validated['amount'],
                'payment_date' => $validated['payment_date'],
                'payment_method' => $validated['payment_method'],
                'transaction_reference' => $validated['transaction_reference'] ?? null,
                'remarks' => $validated['remarks'] ?? null,
                'received_by' => auth()->id(),
            ]);

            $studentFee->amount_paid += $validated['amount'];
            $studentFee->balance = $studentFee->amount_due - $studentFee->amount_paid;

            if ($studentFee->balance <= 0) {
                $studentFee->status = 'paid';
            } elseif ($studentFee->amount_paid > 0) {
                $studentFee->status = 'partial';
            }

            $studentFee->save();

            DB::commit();

            return redirect()->route('fees.student', $validated['student_id'])
                ->with('success', 'Payment recorded successfully. Receipt: ' . $receiptNumber);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to record payment: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function receipt($receiptNumber)
    {
        $payment = Payment::where('receipt_number', $receiptNumber)
            ->with(['student.grade', 'studentFee.feeStructure', 'receivedBy'])
            ->firstOrFail();

        $this->authorize('view', $payment->student);

        return Inertia::render('Fees/Receipt', [
            'payment' => $payment
        ]);
    }

    public function receiptPdf($receiptNumber)
    {
        $payment = Payment::where('receipt_number', $receiptNumber)
            ->with(['student.grade', 'studentFee.feeStructure', 'receivedBy'])
            ->firstOrFail();

        $this->authorize('view', $payment->student);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.receipt', [
            'payment' => $payment,
        ]);

        return $pdf->download("receipt-{$payment->receipt_number}.pdf");
    }
}