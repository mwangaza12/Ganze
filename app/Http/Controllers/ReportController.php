<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\ClassModel;
use App\Models\Term;
use App\Models\StudentFee;
use App\Models\Mark;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function attendanceByClass(Request $request, $classId)
    {
        $class = ClassModel::findOrFail($classId);
        $startDate = $request->start_date ?? now()->startOfMonth();
        $endDate = $request->end_date ?? now()->endOfMonth();

        $students = Student::where('class_id', $classId)
            ->where('status', 'active')
            ->with(['attendance' => function($query) use ($startDate, $endDate) {
                $query->whereBetween('date', [$startDate, $endDate]);
            }])
            ->get();

        $report = $students->map(function($student) {
            $attendance = $student->attendance;
            return [
                'student' => $student,
                'total_days' => $attendance->count(),
                'present' => $attendance->where('status', 'present')->count(),
                'absent' => $attendance->where('status', 'absent')->count(),
                'late' => $attendance->where('status', 'late')->count(),
                'percentage' => $attendance->count() > 0 
                    ? round(($attendance->where('status', 'present')->count() / $attendance->count()) * 100, 2)
                    : 0
            ];
        });

        return Inertia::render('Reports/AttendanceByClass', [
            'class' => $class,
            'report' => $report,
            'startDate' => $startDate,
            'endDate' => $endDate
        ]);
    }

    public function attendanceByStudent($studentId, Request $request)
    {
        $student = Student::with(['class', 'stream'])->findOrFail($studentId);
        $startDate = $request->start_date ?? now()->startOfMonth();
        $endDate = $request->end_date ?? now()->endOfMonth();

        $attendance = Attendance::where('student_id', $studentId)
            ->whereBetween('date', [$startDate, $endDate])
            ->orderBy('date', 'desc')
            ->get();

        $summary = [
            'total_days' => $attendance->count(),
            'present' => $attendance->where('status', 'present')->count(),
            'absent' => $attendance->where('status', 'absent')->count(),
            'late' => $attendance->where('status', 'late')->count(),
            'excused' => $attendance->where('status', 'excused')->count(),
            'percentage' => $attendance->count() > 0 
                ? round(($attendance->where('status', 'present')->count() / $attendance->count()) * 100, 2)
                : 0
        ];

        return Inertia::render('Reports/AttendanceByStudent', [
            'student' => $student,
            'attendance' => $attendance,
            'summary' => $summary,
            'startDate' => $startDate,
            'endDate' => $endDate
        ]);
    }

    public function academicReport($classId, $termId)
    {
        $class = ClassModel::findOrFail($classId);
        $term = Term::with('academicYear')->findOrFail($termId);

        $students = Student::where('class_id', $classId)
            ->where('status', 'active')
            ->with(['marks' => function($query) use ($termId) {
                $query->whereHas('exam', function($q) use ($termId) {
                    $q->where('term_id', $termId);
                })->with(['subject', 'exam']);
            }])
            ->get();

        $report = $students->map(function($student) {
            $marks = $student->marks;
            $totalPoints = $marks->sum('points');
            $totalSubjects = $marks->count();
            $meanPoints = $totalSubjects > 0 ? $totalPoints / $totalSubjects : 0;

            return [
                'student' => $student,
                'total_points' => $totalPoints,
                'total_subjects' => $totalSubjects,
                'mean_points' => round($meanPoints, 2),
                'mean_grade' => $this->getMeanGrade($meanPoints),
                'marks' => $marks
            ];
        })->sortByDesc('total_points')->values();

        return Inertia::render('Reports/AcademicReport', [
            'class' => $class,
            'term' => $term,
            'report' => $report
        ]);
    }

    public function feesSummary(Request $request)
    {
        $termId = $request->term_id;
        $classId = $request->class_id;

        $query = StudentFee::with(['student.class', 'feeStructure']);

        if ($termId) {
            $query->whereHas('feeStructure', function($q) use ($termId) {
                $q->where('term_id', $termId);
            });
        }

        if ($classId) {
            $query->whereHas('student', function($q) use ($classId) {
                $q->where('class_id', $classId);
            });
        }

        $fees = $query->get();

        $summary = [
            'total_due' => $fees->sum('amount_due'),
            'total_paid' => $fees->sum('amount_paid'),
            'total_balance' => $fees->sum('balance'),
            'total_students' => $fees->pluck('student_id')->unique()->count(),
        ];

        return Inertia::render('Reports/FeesSummary', [
            'fees' => $fees,
            'summary' => $summary
        ]);
    }

    public function feesDefaulters(Request $request)
    {
        $fees = StudentFee::where('balance', '>', 0)
            ->with(['student.class', 'student.guardians', 'feeStructure'])
            ->orderBy('balance', 'desc')
            ->get();

        return Inertia::render('Reports/FeesDefaulters', [
            'fees' => $fees
        ]);
    }

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