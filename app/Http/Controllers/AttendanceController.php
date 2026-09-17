<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\Grade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with(['student', 'grade', 'markedBy']);

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->has('grade_id')) {
            $query->where('grade_id', $request->grade_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $attendance = $query->latest('date')->paginate($request->per_page ?? 50);
        $grades = Grade::ordered()->get();

        return Inertia::render('Attendance/Index', [
            'attendance' => $attendance,
            'grades' => $grades,
            'filters' => $request->only(['date', 'grade_id', 'status'])
        ]);
    }

    public function create(Request $request)
    {
        $grades = Grade::with('streams')->ordered()->get();
        $selectedGrade = null;
        $students = [];

        if ($request->has('grade_id')) {
            $selectedGrade = Grade::with('streams')->findOrFail($request->grade_id);
            $students = Student::where('grade_id', $request->grade_id)
                ->where('status', 'active')
                ->with(['attendance' => function($query) use ($request) {
                    if ($request->has('date')) {
                        $query->whereDate('date', $request->date);
                    }
                }])
                ->get();
        }

        return Inertia::render('Attendance/Create', [
            'grades' => $grades,
            'selectedGrade' => $selectedGrade,
            'students' => $students,
            'date' => $request->date ?? today()->format('Y-m-d')
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'date' => 'required|date',
            'attendance' => 'required|array',
            'attendance.*.student_id' => 'required|exists:students,id',
            'attendance.*.status' => 'required|in:present,absent,late,excused',
            'attendance.*.remarks' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $marked_by = auth()->user()->teacher->id ?? null;

            foreach ($validated['attendance'] as $record) {
                Attendance::updateOrCreate(
                    [
                        'student_id' => $record['student_id'],
                        'date' => $validated['date'],
                    ],
                    [
                        'grade_id' => $validated['grade_id'],
                        'status' => $record['status'],
                        'remarks' => $record['remarks'] ?? null,
                        'marked_by' => $marked_by,
                        'check_in_time' => now(),
                    ]
                );
            }

            DB::commit();

            return redirect()->route('attendance.index')
                ->with('success', 'Attendance marked successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to mark attendance: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function classReport(Request $request, $gradeId)
    {
        $grade = Grade::with('streams')->findOrFail($gradeId);
        $date = $request->date ?? today();

        $students = Student::where('grade_id', $gradeId)
            ->where('status', 'active')
            ->with(['attendance' => function($query) use ($date) {
                $query->whereDate('date', $date);
            }])
            ->get();

        return Inertia::render('Attendance/ClassReport', [
            'grade' => $grade,
            'students' => $students,
            'date' => $date
        ]);
    }

    public function studentSummary($studentId, Request $request)
    {
        $student = Student::with(['grade', 'stream'])->findOrFail($studentId);
        $this->authorize('view', $student);
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
            'attendance_percentage' => $attendance->count() > 0 
                ? round(($attendance->where('status', 'present')->count() / $attendance->count()) * 100, 2)
                : 0
        ];

        return Inertia::render('Attendance/StudentSummary', [
            'student' => $student,
            'attendance' => $attendance,
            'summary' => $summary,
            'startDate' => $startDate,
            'endDate' => $endDate
        ]);
    }
}