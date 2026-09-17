<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Term;
use App\Models\Grade;
use App\Models\Mark;
use App\Models\Student;
use App\Models\LearningArea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function index(Request $request)
    {
        $query = Exam::with(['term.academicYear', 'grade']);

        if ($request->has('term_id')) {
            $query->where('term_id', $request->term_id);
        }

        if ($request->has('grade_id')) {
            $query->where('grade_id', $request->grade_id);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $exams = $query->latest()->paginate($request->per_page ?? 15);
        $terms = Term::with('academicYear')->get();
        $grades = Grade::ordered()->get();

        return Inertia::render('Exams/Index', [
            'exams' => $exams,
            'terms' => $terms,
            'grades' => $grades,
            'filters' => $request->only(['term_id', 'grade_id', 'type'])
        ]);
    }

    public function create()
    {
        $terms = Term::with('academicYear')->get();
        $grades = Grade::ordered()->get();

        return Inertia::render('Exams/Create', [
            'terms' => $terms,
            'grades' => $grades
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'term_id' => 'required|exists:terms,id',
            'grade_id' => 'required|exists:grades,id',
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

    public function show($id)
    {
        $exam = Exam::with([
            'term.academicYear',
            'grade',
            'marks.student',
            'marks.learningArea'
        ])->findOrFail($id);

        return Inertia::render('Exams/Show', [
            'exam' => $exam
        ]);
    }

    public function edit($id)
    {
        $exam = Exam::findOrFail($id);
        $terms = Term::with('academicYear')->get();
        $grades = Grade::ordered()->get();

        return Inertia::render('Exams/Edit', [
            'exam' => $exam,
            'terms' => $terms,
            'grades' => $grades
        ]);
    }

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

    public function destroy($id)
    {
        $exam = Exam::findOrFail($id);
        $exam->delete();

        return redirect()->route('exams.index')
            ->with('success', 'Exam deleted successfully');
    }

    public function enterMarks($examId)
    {
        $exam = Exam::with(['grade', 'term'])->findOrFail($examId);
        $students = Student::where('grade_id', $exam->grade_id)
            ->where('status', 'active')
            ->get();
        $learningAreas = LearningArea::active()->get();

        $existingMarks = Mark::where('exam_id', $examId)
            ->with('student', 'learningArea')
            ->get()
            ->groupBy('student_id');

        return Inertia::render('Exams/EnterMarks', [
            'exam' => $exam,
            'students' => $students,
            'learningAreas' => $learningAreas,
            'existingMarks' => $existingMarks
        ]);
    }

    public function storeMarks(Request $request, $examId)
    {
        $validated = $request->validate([
            'marks' => 'required|array',
            'marks.*.student_id' => 'required|exists:students,id',
            'marks.*.learning_area_id' => 'required|exists:learning_areas,id',
            'marks.*.marks_obtained' => 'required|numeric|min:0',
            'marks.*.total_marks' => 'required|numeric|min:1',
            'marks.*.remarks' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $entered_by = auth()->user()->teacher->id ?? null;

            foreach ($validated['marks'] as $markData) {
                Mark::updateOrCreate(
                    [
                        'exam_id' => $examId,
                        'student_id' => $markData['student_id'],
                        'learning_area_id' => $markData['learning_area_id'],
                    ],
                    [
                        'marks_obtained' => $markData['marks_obtained'],
                        'total_marks' => $markData['total_marks'],
                        'remarks' => $markData['remarks'] ?? null,
                        'entered_by' => $entered_by,
                    ]
                );
            }

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

    private function calculatePositions($examId)
    {
        $marks = Mark::where('exam_id', $examId)
            ->select('student_id', 'learning_area_id', 'marks_obtained')
            ->get()
            ->groupBy('learning_area_id');

        foreach ($marks as $learningAreaId => $areaMarks) {
            $sorted = $areaMarks->sortByDesc('marks_obtained')->values();

            foreach ($sorted as $index => $mark) {
                Mark::where('exam_id', $examId)
                    ->where('student_id', $mark->student_id)
                    ->where('learning_area_id', $learningAreaId)
                    ->update(['position' => $index + 1]);
            }
        }
    }

    public function studentReport($examId, $studentId)
    {
        $exam = Exam::with('term.academicYear', 'grade')->findOrFail($examId);
        $student = Student::with(['grade', 'stream'])->findOrFail($studentId);

        $this->authorize('view', $student);

        $marks = Mark::where('exam_id', $examId)
            ->where('student_id', $studentId)
            ->with('learningArea')
            ->get();

        return Inertia::render('Exams/StudentReport', [
            'exam' => $exam,
            'student' => $student,
            'marks' => $marks,
        ]);
    }
}