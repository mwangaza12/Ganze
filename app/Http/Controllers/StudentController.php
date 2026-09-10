<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use App\Models\ClassModel;
use App\Models\Stream;
use App\Services\FeeGenerationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function __construct(protected FeeGenerationService $feeGenerationService)
    {
    }

    /**
     * Display a listing of students
     */
    public function index(Request $request)
    {
        $query = Student::with(['class', 'stream', 'guardians']);

        // Filter by claEditss
        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        // Filter by stream
        if ($request->has('stream_id')) {
            $query->where('stream_id', $request->stream_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search by name or admission number
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('admission_number', 'like', "%{$search}%");
            });
        }

        $students = $query->paginate($request->per_page ?? 15);

        return Inertia::render('Students/Index', [
            'students' => $students,
            'filters' => $request->only(['class_id', 'stream_id', 'status', 'search'])
        ]);
    }

    /**
     * Show the form for creating a new student
     */
    public function create()
    {
        $classes = ClassModel::all();
        $streams = Stream::with('class')->get();

        return Inertia::render('Students/Create', [
            'classes' => $classes,
            'streams' => $streams
        ]);
    }

    /**
     * Store a newly created student
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'admission_number' => 'required|string|unique:students',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'date_of_birth' => 'required|date',
            'admission_date' => 'required|date',
            'class_id' => 'required|exists:classes,id',
            'stream_id' => 'nullable|exists:streams,id',
            'birth_certificate_number' => 'nullable|string|max:50',
            'medical_conditions' => 'nullable|string',
            'allergies' => 'nullable|string',
            'address' => 'nullable|string',
            'county' => 'nullable|string',
            'sub_county' => 'nullable|string',
            'email' => 'nullable|email|unique:users',
            'phone' => 'nullable|string|unique:users',
        ]);

        DB::beginTransaction();
        try {
            // Create user account
            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'] ?? $validated['admission_number'] . '@student.school.ke',
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make('password123'), // Default password
                'role' => 'student',
                'is_active' => true,
            ]);

            // Create student
            $validated['user_id'] = $user->id;
            $student = Student::create($validated);

            // Bill the student for whatever the rest of their class is
            // already being charged this academic year.
            $this->feeGenerationService->generateForStudent($student);

            DB::commit();

            return redirect()->route('students.index')
                ->with('success', 'Student created successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create student: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified student
     */
    public function show($id)
    {
        $student = Student::with([
            'class', 
            'stream', 
            'guardians',
            'attendance' => function($query) {
                $query->latest()->limit(30);
            },
            'marks.exam',
            'fees.feeStructure',
            'payments',
            'marks.subject'
        ])->findOrFail($id);

        $this->authorize('view', $student);

        return Inertia::render('Students/Show', [
            'student' => $student
        ]);
    }

    /**
     * Display a student's academic report card — all marks across all
     * exams, grouped by exam, so a parent/student/teacher can see the
     * full academic history in one place.
     */
    public function reportCard($id)
    {
        $student = Student::with([
            'class',
            'stream',
            'guardians',
            'attendance' => fn ($query) => $query->latest()->limit(30),
            'marks.exam',
            'marks.subject',
            'fees.feeStructure',
            'payments',
        ])->findOrFail($id);

        $this->authorize('view', $student);

        return Inertia::render('Students/Show', [
            'student' => $student,
            'reportCard' => $this->marksGroupedByExam($id),
        ]);
    }

    /**
     * Download the student's report card as a PDF.
     */
    public function reportCardPdf($id)
    {
        $student = Student::with(['class', 'stream'])->findOrFail($id);

        $this->authorize('view', $student);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.report-card', [
            'student' => $student,
            'marksByExam' => $this->marksGroupedByExam($id),
        ]);

        return $pdf->download("report-card-{$student->admission_number}.pdf");
    }

    /**
     * All of a student's marks, grouped by exam, with per-exam summary
     * stats. Shared by the on-screen report card and the PDF download.
     */
    private function marksGroupedByExam($studentId)
    {
        return \App\Models\Mark::where('student_id', $studentId)
            ->with(['exam.term.academicYear', 'subject'])
            ->get()
            ->groupBy('exam_id')
            ->map(function ($marks) {
                return [
                    'exam' => $marks->first()->exam,
                    'marks' => $marks->values(),
                    'total_points' => $marks->sum('points'),
                    'mean_points' => $marks->count() > 0 ? round($marks->sum('points') / $marks->count(), 2) : 0,
                ];
            })
            ->values();
    }

    /**
     * Show the form for editing the specified student
     */
    public function edit($id)
    {
        $student = Student::with(['class', 'stream'])->findOrFail($id);
        $classes = ClassModel::all();
        $streams = Stream::with('class')->get();

        return Inertia::render('Students/Create', [
            'student' => $student,
            'classes' => $classes,
            'streams' => $streams
        ]);
    }

    /**
     * Update the specified student
     */
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'admission_number' => ['sometimes', 'string', Rule::unique('students')->ignore($student->id)],
            'first_name' => 'sometimes|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'gender' => 'sometimes|in:male,female',
            'date_of_birth' => 'sometimes|date',
            'class_id' => 'sometimes|exists:classes,id',
            'stream_id' => 'nullable|exists:streams,id',
            'medical_conditions' => 'nullable|string',
            'allergies' => 'nullable|string',
            'address' => 'nullable|string',
            'county' => 'nullable|string',
            'sub_county' => 'nullable|string',
            'status' => 'sometimes|in:active,transferred,graduated,expelled,withdrawn',
        ]);

        $classChanged = isset($validated['class_id']) && $validated['class_id'] != $student->class_id;

        $student->update($validated);

        if ($classChanged) {
            // Moving classes (promotion/transfer) means new fee structures
            // may apply — bill for whatever's missing under the new class.
            $this->feeGenerationService->generateForStudent($student->fresh());
        }

        return redirect()->route('students.index')
            ->with('success', 'Student updated successfully');
    }

    /**
     * Remove the specified student
     */
    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete(); // Soft delete

        return redirect()->route('students.index')
            ->with('success', 'Student deleted successfully');
    }
}