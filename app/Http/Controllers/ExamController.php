<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Term;
use App\Models\ClassModel;
use App\Models\Mark;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExamController extends Controller
{
    /**
     * Display a listing of exams
     */
    public function index(Request $request)
    {
        $query = Exam::with(['term.academicYear', 'class']);

        if ($request->has('term_id')) {
            $query->where('term_id', $request->term_id);
        }

        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $exams = $query->latest()->paginate($request->per_page ?? 15);
        $terms = Term::with('academicYear')->get();
        $classes = ClassModel::all();

        return Inertia::render('Exams/Index', [
            'exams' => $exams,
            'terms' => $terms,
            'classes' => $classes,
            'filters' => $request->only(['term_id', 'class_id', 'type'])
        ]);
    }

    /**
     * Show the form for creating a new exam
     */
    public function create()
    {
        $terms = Term::with('academicYear')->get();
        $classes = ClassModel::all();

        return Inertia::render('Exams/Create', [
            'terms' => $terms,
            'classes' => $classes
        ]);
    }

    /**
     * Store a newly created exam
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'term_id' => 'required|exists:terms,id',
            'class_id' => 'required|exists:classes,id',
            'name' => 'required|string|max:255',
            'type' => 'required|in:cat,mid_term,end_term,mock,kcse',
            'exam_date' => 'required|date',
            'total_marks' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        Exam::create($validated);

        return redirect()->route('exams.index')
            ->with('success', 'Exam created successfully');
    }

    /**
     * Display the specified exam
     */
    public function show($id)
    {
        $exam = Exam::with([
            'term.academicYear', 
            'class',
            'marks.student',
            'marks.subject'
        ])->findOrFail($id);

        return Inertia::render('Exams/Show', [
            'exam' => $exam
        ]);
    }

    /**
     * Show the form for editing the specified exam
     */
    public function edit($id)
    {
        $exam = Exam::findOrFail($id);
        $terms = Term::with('academicYear')->get();
        $classes = ClassModel::all();

        return Inertia::render('Exams/Edit', [
            'exam' => $exam,
            'terms' => $terms,
            'classes' => $classes
        ]);
    }

    /**
     * Update the specified exam
     */
    public function update(Request $request, $id)
    {
        $exam = Exam::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:cat,mid_term,end_term,mock,kcse',
            'exam_date' => 'sometimes|date',
            'total_marks' => 'sometimes|integer|min:1',
            'description' => 'nullable|string',
        ]);

        $exam->update($validated);

        return redirect()->route('exams.index')
            ->with('success', 'Exam updated successfully');
    }

    /**
     * Remove the specified exam
     */
    public function destroy($id)
    {
        $exam = Exam::findOrFail($id);
        $exam->delete();

        return redirect()->route('exams.index')
            ->with('success', 'Exam deleted successfully');
    }

    /**
     * Show form to enter marks
     */
    public function enterMarks($examId)
    {
        $exam = Exam::with(['class', 'term'])->findOrFail($examId);
        $students = Student::where('class_id', $exam->class_id)
            ->where('status', 'active')
            ->get();
        $subjects = Subject::active()->get();

        // Get existing marks
        $existingMarks = Mark::where('exam_id', $examId)
            ->with('student', 'subject')
            ->get()
            ->groupBy('student_id');

        return Inertia::render('Exams/EnterMarks', [
            'exam' => $exam,
            'students' => $students,
            'subjects' => $subjects,
            'existingMarks' => $existingMarks
        ]);
    }

    /**
     * Store marks for an exam
     */
    public function storeMarks(Request $request, $examId)
    {
        $validated = $request->validate([
            'marks' => 'required|array',
            'marks.*.student_id' => 'required|exists:students,id',
            'marks.*.subject_id' => 'required|exists:subjects,id',
            'marks.*.marks_obtained' => 'required|numeric|min:0',
            'marks.*.total_marks' => 'required|numeric|min:1',
            'marks.*.remarks' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $entered_by = auth()->user()->teacher->id ?? null;

            foreach ($validated['marks'] as $markData) {
                $percentage = ($markData['marks_obtained'] / $markData['total_marks']) * 100;
                $gradeData = Mark::calculateGrade($percentage);

                Mark::updateOrCreate(
                    [
                        'exam_id' => $examId,
                        'student_id' => $markData['student_id'],
                        'subject_id' => $markData['subject_id'],
                    ],
                    [
                        'marks_obtained' => $markData['marks_obtained'],
                        'total_marks' => $markData['total_marks'],
                        'grade' => $gradeData['grade'],
                        'points' => $gradeData['points'],
                        'remarks' => $markData['remarks'] ?? null,
                        'entered_by' => $entered_by,
                    ]
                );
            }

            // Calculate positions
            $this->calculatePositions($examId);

            DB::commit();

            return redirect()->route('exams.show', $examId)
                ->with('success', 'Marks entered successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to enter marks: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Calculate positions for students in an exam
     */
    private function calculatePositions($examId)
    {
        $marks = Mark::where('exam_id', $examId)
            ->select('student_id', 'subject_id', 'marks_obtained')
            ->get()
            ->groupBy('subject_id');

        foreach ($marks as $subjectId => $subjectMarks) {
            $sorted = $subjectMarks->sortByDesc('marks_obtained')->values();
            
            foreach ($sorted as $index => $mark) {
                Mark::where('exam_id', $examId)
                    ->where('student_id', $mark->student_id)
                    ->where('subject_id', $subjectId)
                    ->update(['position' => $index + 1]);
            }
        }
    }

    /**
     * Show student report card
     */
    public function studentReport($examId, $studentId)
    {
        $exam = Exam::with('term.academicYear', 'class')->findOrFail($examId);
        $student = Student::with(['class', 'stream'])->findOrFail($studentId);
        
        $marks = Mark::where('exam_id', $examId)
            ->where('student_id', $studentId)
            ->with('subject')
            ->get();

        $totalPoints = $marks->sum('points');
        $totalSubjects = $marks->count();
        $meanGrade = $totalSubjects > 0 ? $totalPoints / $totalSubjects : 0;

        $summary = [
            'total_points' => $totalPoints,
            'total_subjects' => $totalSubjects,
            'mean_points' => round($meanGrade, 2),
            'mean_grade' => $this->getMeanGrade($meanGrade),
        ];

        return Inertia::render('Exams/StudentReport', [
            'exam' => $exam,
            'student' => $student,
            'marks' => $marks,
            'summary' => $summary
        ]);
    }

    /**
     * Convert mean points to mean grade
     */
    private function getMeanGrade($meanPoints)
    {
        if ($meanPoints >= 11) return 'A';
        if ($meanPoints >= 10) return 'A-';
        if ($meanPoints >= 9) return 'B+';
        if ($meanPoints >= 8) return 'B';
        if ($meanPoints >= 7) return 'B-';
        if ($meanPoints >= 6) return 'C+';
        if ($meanPoints >= 5) return 'C';
        if ($meanPoints >= 4) return 'C-';
        if ($meanPoints >= 3) return 'D+';
        if ($meanPoints >= 2) return 'D';
        if ($meanPoints >= 1) return 'D-';
        return 'E';
    }
}