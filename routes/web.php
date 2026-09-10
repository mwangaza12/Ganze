<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\GuardianController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\StreamController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\TermController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ReportController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard — content is scoped per-role inside the controller.
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ------------------------------------------------------------------
    // Admin + teacher: day-to-day school operations (attendance, marks).
    // ------------------------------------------------------------------
    Route::middleware(['role:admin,teacher'])->group(function () {
        // Students & guardians — viewing/searching is needed by teachers too.
        Route::get('students', [StudentController::class, 'index'])->name('students.index');
        Route::get('students/{student}', [StudentController::class, 'show'])->name('students.show');
        Route::get('students/{id}/report-card', [StudentController::class, 'reportCard'])->name('students.report-card');

        // Attendance
        Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
        Route::get('attendance/create', [AttendanceController::class, 'create'])->name('attendance.create');
        Route::post('attendance', [AttendanceController::class, 'store'])->name('attendance.store');
        Route::get('attendance/class/{classId}/report', [AttendanceController::class, 'classReport'])
            ->name('attendance.class-report');
        Route::get('attendance/student/{studentId}/summary', [AttendanceController::class, 'studentSummary'])
            ->name('attendance.student-summary');

        // Exams & marks entry
        Route::get('exams', [ExamController::class, 'index'])->name('exams.index');
        Route::get('exams/{exam}', [ExamController::class, 'show'])->name('exams.show');
        Route::get('exams/{examId}/enter-marks', [ExamController::class, 'enterMarks'])
            ->name('exams.enter-marks');
        Route::post('exams/{examId}/marks', [ExamController::class, 'storeMarks'])
            ->name('exams.store-marks');
        Route::get('exams/{examId}/students/{studentId}/report', [ExamController::class, 'studentReport'])
            ->name('exams.student-report');

        // Events (view only for teachers; creation restricted below)
        Route::get('events', [EventController::class, 'index'])->name('events.index');
        Route::get('events/upcoming', [EventController::class, 'upcoming'])->name('events.upcoming');
        Route::get('events/{event}', [EventController::class, 'show'])->name('events.show');

        // Reports
        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('attendance/class/{classId}', [ReportController::class, 'attendanceByClass'])
                ->name('attendance.class');
            Route::get('attendance/student/{studentId}', [ReportController::class, 'attendanceByStudent'])
                ->name('attendance.student');
            Route::get('academic/class/{classId}/term/{termId}', [ReportController::class, 'academicReport'])
                ->name('academic');
        });
    });

    // ------------------------------------------------------------------
    // Admin only: everything that changes the school's core setup, staff,
    // billing, and student records.
    // ------------------------------------------------------------------
    Route::middleware(['role:admin'])->group(function () {
        // Students — create/edit/delete
        Route::get('students/create', [StudentController::class, 'create'])->name('students.create');
        Route::post('students', [StudentController::class, 'store'])->name('students.store');
        Route::get('students/{student}/edit', [StudentController::class, 'edit'])->name('students.edit');
        Route::put('students/{student}', [StudentController::class, 'update'])->name('students.update');
        Route::patch('students/{student}', [StudentController::class, 'update']);
        Route::delete('students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');

        // Guardians
        Route::resource('guardians', GuardianController::class);
        Route::post('students/{studentId}/guardians/{guardianId}/attach', [GuardianController::class, 'attachToStudent'])
            ->name('students.guardians.attach');
        Route::delete('students/{studentId}/guardians/{guardianId}/detach', [GuardianController::class, 'detachFromStudent'])
            ->name('students.guardians.detach');
        Route::post('students/{studentId}/guardians/{guardianId}/set-primary', [GuardianController::class, 'setPrimary'])
            ->name('students.guardians.set-primary');

        // Teachers
        Route::resource('teachers', TeacherController::class);
        Route::post('teachers/{teacherId}/subjects/{subjectId}/assign', [TeacherController::class, 'assignSubject'])
            ->name('teachers.subjects.assign');
        Route::delete('teachers/{teacherId}/subjects/{subjectId}/unassign', [TeacherController::class, 'unassignSubject'])
            ->name('teachers.subjects.unassign');

        // Classes & Streams
        Route::resource('classes', ClassController::class);
        Route::get('classes/{classId}/students', [ClassController::class, 'students'])->name('classes.students');

        Route::get('classes/{classId}/streams/create', [StreamController::class, 'create'])->name('classes.streams.create');
        Route::post('classes/{classId}/streams', [StreamController::class, 'store'])->name('classes.streams.store');
        Route::get('classes/{classId}/streams/{id}/edit', [StreamController::class, 'edit'])->name('classes.streams.edit');
        Route::put('classes/{classId}/streams/{id}', [StreamController::class, 'update'])->name('classes.streams.update');
        Route::delete('classes/{classId}/streams/{id}', [StreamController::class, 'destroy'])->name('classes.streams.destroy');

        Route::post('classes/{classId}/subjects/{subjectId}/assign', [ClassController::class, 'assignSubject'])
            ->name('classes.subjects.assign');

        // Subjects
        Route::resource('subjects', SubjectController::class);

        // Academic Years & Terms
        Route::resource('academic-years', AcademicYearController::class);
        Route::post('academic-years/{id}/set-current', [AcademicYearController::class, 'setCurrent'])
            ->name('academic-years.set-current');

        Route::get('terms', [TermController::class, 'index'])->name('terms.index');
        Route::get('terms/create', [TermController::class, 'create'])->name('terms.create');
        Route::post('terms', [TermController::class, 'store'])->name('terms.store');
        Route::get('terms/{id}/edit', [TermController::class, 'edit'])->name('terms.edit');
        Route::put('terms/{id}', [TermController::class, 'update'])->name('terms.update');
        Route::delete('terms/{id}', [TermController::class, 'destroy'])->name('terms.destroy');
        Route::post('terms/{id}/set-current', [TermController::class, 'setCurrent'])
            ->name('terms.set-current');

        // Exams — creation/editing (marks entry is granted to teachers above)
        Route::get('exams/create', [ExamController::class, 'create'])->name('exams.create');
        Route::post('exams', [ExamController::class, 'store'])->name('exams.store');
        Route::get('exams/{exam}/edit', [ExamController::class, 'edit'])->name('exams.edit');
        Route::put('exams/{exam}', [ExamController::class, 'update'])->name('exams.update');
        Route::delete('exams/{exam}', [ExamController::class, 'destroy'])->name('exams.destroy');

        // Fee structures & payments
        Route::get('fees', [FeeController::class, 'index'])->name('fees.index');
        Route::get('fees/create', [FeeController::class, 'create'])->name('fees.create');
        Route::post('fees', [FeeController::class, 'store'])->name('fees.store');

        Route::get('students/{studentId}/fees', [FeeController::class, 'studentFees'])
            ->name('fees.student');
        Route::get('students/{studentId}/payments/create', [FeeController::class, 'createPayment'])
            ->name('payments.create');
        Route::post('payments', [FeeController::class, 'storePayment'])
            ->name('payments.store');
        Route::get('payments/{receiptNumber}/receipt', [FeeController::class, 'receipt'])
            ->name('payments.receipt');

        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('fees/summary', [ReportController::class, 'feesSummary'])
                ->name('fees.summary');
            Route::get('fees/defaulters', [ReportController::class, 'feesDefaulters'])
                ->name('fees.defaulters');
        });

        // Events — creation/editing
        Route::get('events/create', [EventController::class, 'create'])->name('events.create');
        Route::post('events', [EventController::class, 'store'])->name('events.store');
        Route::get('events/{event}/edit', [EventController::class, 'edit'])->name('events.edit');
        Route::put('events/{event}', [EventController::class, 'update'])->name('events.update');
        Route::delete('events/{event}', [EventController::class, 'destroy'])->name('events.destroy');
    });

    // ------------------------------------------------------------------
    // NOTE: parent/student self-service views (their own child's fees,
    // attendance, report card) intentionally are not wired up here yet.
    // Those need per-record ownership checks (e.g. a Policy verifying the
    // logged-in guardian/student actually owns the requested student_id)
    // rather than a role check alone, otherwise any parent could view any
    // other family's data by changing the ID in the URL. Add those as a
    // follow-up once StudentPolicy/GuardianPolicy exist.
    // ------------------------------------------------------------------
});

require __DIR__.'/settings.php';