<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use App\Models\Grade;
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

    public function index(Request $request)
    {
        $query = Student::with(['grade', 'stream', 'guardians']);

        if ($request->has('grade_id')) {
            $query->where('grade_id', $request->grade_id);
        }

        if ($request->has('stream_id')) {
            $query->where('stream_id', $request->stream_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

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
            'filters' => $request->only(['grade_id', 'stream_id', 'status', 'search'])
        ]);
    }

    public function create()
    {
        $grades = Grade::ordered()->get();
        $streams = Stream::with('grade')->get();

        return Inertia::render('Students/Create', [
            'grades' => $grades,
            'streams' => $streams
        ]);
    }

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
            'grade_id' => 'required|exists:grades,id',
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
            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'] ?? $validated['admission_number'] . '@student.school.ke',
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make('password123'),
                'role' => 'student',
                'is_active' => true,
            ]);

            $validated['user_id'] = $user->id;
            $student = Student::create($validated);

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

    public function show($id)
    {
        $student = Student::with([
            'grade',
            'stream',
            'guardians',
            'attendance' => function($query) {
                $query->latest()->limit(30);
            },
            'marks.exam',
            'fees.feeStructure',
            'payments',
            'marks.learningArea',
            'pathways.pathway',
        ])->findOrFail($id);

        $this->authorize('view', $student);

        return Inertia::render('Students/Show', [
            'student' => $student
        ]);
    }

    public function reportCard($id)
    {
        $student = Student::with([
            'grade',
            'stream',
            'guardians',
            'attendance' => fn ($query) => $query->latest()->limit(30),
            'marks.exam',
            'marks.learningArea',
            'fees.feeStructure',
            'payments',
        ])->findOrFail($id);

        $this->authorize('view', $student);

        return Inertia::render('Students/Show', [
            'student' => $student,
            'reportCard' => $this->marksGroupedByExam($id),
        ]);
    }

    public function reportCardPdf($id)
    {
        $student = Student::with(['grade', 'stream'])->findOrFail($id);

        $this->authorize('view', $student);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.report-card', [
            'student' => $student,
            'marksByExam' => $this->marksGroupedByExam($id),
        ]);

        return $pdf->download("report-card-{$student->admission_number}.pdf");
    }

    private function marksGroupedByExam($studentId)
    {
        return \App\Models\Mark::where('student_id', $studentId)
            ->with(['exam.term.academicYear', 'learningArea'])
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

    public function edit($id)
    {
        $student = Student::with(['grade', 'stream'])->findOrFail($id);
        $grades = Grade::ordered()->get();
        $streams = Stream::with('grade')->get();

        return Inertia::render('Students/Create', [
            'student' => $student,
            'grades' => $grades,
            'streams' => $streams
        ]);
    }

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
            'grade_id' => 'sometimes|exists:grades,id',
            'stream_id' => 'nullable|exists:streams,id',
            'medical_conditions' => 'nullable|string',
            'allergies' => 'nullable|string',
            'address' => 'nullable|string',
            'county' => 'nullable|string',
            'sub_county' => 'nullable|string',
            'status' => 'sometimes|in:active,transferred,graduated,expelled,withdrawn',
        ]);

        $gradeChanged = isset($validated['grade_id']) && $validated['grade_id'] != $student->grade_id;

        $student->update($validated);

        if ($gradeChanged) {
            $this->feeGenerationService->generateForStudent($student->fresh());
        }

        return redirect()->route('students.index')
            ->with('success', 'Student updated successfully');
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return redirect()->route('students.index')
            ->with('success', 'Student deleted successfully');
    }
}