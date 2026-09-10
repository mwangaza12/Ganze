<?php

namespace App\Policies;

use App\Models\Student;
use App\Models\User;

class StudentPolicy
{
    /**
     * Determine whether the user can view this student's record — profile,
     * attendance, marks, fees, receipts, report card, etc.
     *
     * Admins and teachers can view any student (teachers may need to look
     * up any student for cross-class purposes, e.g. exams/attendance).
     * A parent can only view their own linked children. A student can
     * only view themselves.
     */
    public function view(User $user, Student $student): bool
    {
        return match ($user->role) {
            User::ROLE_ADMIN, User::ROLE_TEACHER => true,
            User::ROLE_STUDENT => $user->student?->id === $student->id,
            User::ROLE_PARENT => $user->guardian
                ?->students()
                ->where('students.id', $student->id)
                ->exists() ?? false,
            default => false,
        };
    }
}