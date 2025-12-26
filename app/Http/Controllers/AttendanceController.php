<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\ClassModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display attendance records
     */
    public function index(Request $request)
    {
        $query = Attendance::with(['student', 'class', 'markedBy']);

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $attendance = $query->latest('date')->paginate($request->per_page ?? 50);
        $classes = ClassModel::all();

        return Inertia::render('Attendance/Index', [
            'attendance' => $attendance,
            'classes' => $classes,
            'filters' => $request->only(['date', 'class_id', 'status'])
        ]);
    }

    /**
     * Show form to mark attendance
     */
    public function create(Request $request)
    {
        $classes = ClassModel::with('streams')->get();
        $selectedClass = null;
        $students = [];

        if ($request->has('class_id')) {
            $selectedClass = ClassModel::with('streams')->findOrFail($request->class_id);
            $students = Student::where('class_id', $request->class_id)
                ->where('status', 'active')
                ->with(['attendance' => function($query) use ($request) {
                    if ($request->has('date')) {
                        $query->whereDate('date', $request->date);
                    }
                }])
                ->get();
        }

        return Inertia::render('Attendance/Create', [
            'classes' => $classes,
            'selectedClass' => $selectedClass,
            'students' => $students,
            'date' => $request->date ?? today()->format('Y-m-d')
        ]);
    }

    /**
     * Mark attendance for a class
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'date' => 'required|date',
            'attendance' => 'required|array',
            'attendance.*.student_id' => 'required|exists:students,id',
            'attendance.*.status' => 'required|in:present,absent,late,excused',
            'attendance.*.remarks' => 'nullable|string',
        ]);

        dd($validated);

        // DB::beginTransaction();
        // try {
        //     $marked_by = auth()->user()->teacher->id ?? null;

        //     foreach ($validated['attendance'] as $record) {
        //         Attendance::updateOrCreate(
        //             [
        //                 'student_id' => $record['student_id'],
        //                 'date' => $validated['date'],
        //             ],
        //             [
        //                 'class_id' => $validated['class_id'],
        //                 'status' => $record['status'],
        //                 'remarks' => $record['remarks'] ?? null,
        //                 'marked_by' => $marked_by,
        //                 'check_in_time' => now(),
        //             ]
        //         );
        //     }

        //     DB::commit();

        //     return redirect()->route('attendance.index')
        //         ->with('success', 'Attendance marked successfully');

        // } catch (\Exception $e) {
        //     DB::rollBack();
        //     return back()->withErrors(['error' => 'Failed to mark attendance: ' . $e->getMessage()])
        //         ->withInput();
        // }
    }

    /**
     * Show attendance report for a class
     */
    public function classReport(Request $request, $classId)
    {
        $class = ClassModel::with('streams')->findOrFail($classId);
        $date = $request->date ?? today();

        $students = Student::where('class_id', $classId)
            ->where('status', 'active')
            ->with(['attendance' => function($query) use ($date) {
                $query->whereDate('date', $date);
            }])
            ->get();

        return Inertia::render('Attendance/ClassReport', [
            'class' => $class,
            'students' => $students,
            'date' => $date
        ]);
    }

    /**
     * Show attendance summary for a student
     */
    public function studentSummary($studentId, Request $request)
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