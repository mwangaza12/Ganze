<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Attendance;
use App\Models\StudentFee;
use App\Models\Payment;
use App\Models\Event;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $data = match($user->role) {
            'admin', 'principal' => $this->adminDashboard(),
            'teacher' => $this->teacherDashboard($user),
            'parent' => $this->parentDashboard($user),
            'student' => $this->studentDashboard($user),
            default => []
        };

        return Inertia::render('dashboard', [
            'stats' => $data,
            'role' => $user->role
        ]);
    }

    private function adminDashboard()
    {
        return [
            'total_students' => Student::active()->count(),
            'total_teachers' => Teacher::count(),
            'present_today' => Attendance::whereDate('date', today())
                ->where('status', 'present')
                ->count(),
            'absent_today' => Attendance::whereDate('date', today())
                ->where('status', 'absent')
                ->count(),
            'fees_collected_this_month' => Payment::whereMonth('payment_date', now()->month)
                ->whereYear('payment_date', now()->year)
                ->sum('amount'),
            'outstanding_fees' => StudentFee::sum('balance'),
            'upcoming_events' => Event::where('event_date', '>=', today())
                ->orderBy('event_date')
                ->limit(5)
                ->get(),
        ];
    }

    private function teacherDashboard($user)
    {
        $teacher = $user->teacher;
        
        return [
            'my_classes' => $teacher->streams()->with('class')->get(),
            'my_subjects' => $teacher->subjects,
            'attendance_marked_today' => Attendance::whereDate('date', today())
                ->where('marked_by', $teacher->id)
                ->count(),
            'upcoming_events' => Event::where('event_date', '>=', today())
                ->orderBy('event_date')
                ->limit(5)
                ->get(),
        ];
    }

    private function parentDashboard($user)
    {
        $guardian = $user->guardian;
        $students = $guardian->students;
        
        return [
            'children' => $students,
            'attendance_summary' => $students->map(function($student) {
                $today = Attendance::where('student_id', $student->id)
                    ->whereDate('date', today())
                    ->first();
                return [
                    'student' => $student,
                    'today_status' => $today->status ?? 'not_marked'
                ];
            }),
            'fees_summary' => $students->map(function($student) {
                return [
                    'student' => $student,
                    'balance' => $student->fees()->sum('balance')
                ];
            }),
            'upcoming_events' => Event::where('event_date', '>=', today())
                ->orderBy('event_date')
                ->limit(5)
                ->get(),
        ];
    }

    private function studentDashboard($user)
    {
        $student = $user->student;
        
        return [
            'student_info' => $student->load(['class', 'stream']),
            'attendance_this_month' => [
                'present' => Attendance::where('student_id', $student->id)
                    ->whereMonth('date', now()->month)
                    ->where('status', 'present')
                    ->count(),
                'absent' => Attendance::where('student_id', $student->id)
                    ->whereMonth('date', now()->month)
                    ->where('status', 'absent')
                    ->count(),
            ],
            'fees_balance' => $student->fees()->sum('balance'),
            'upcoming_events' => Event::where('event_date', '>=', today())
                ->orderBy('event_date')
                ->limit(5)
                ->get(),
        ];
    }
}