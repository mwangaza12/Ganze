<?php

namespace App\Services;

use App\Models\FeeStructure;
use App\Models\Student;
use App\Models\StudentFee;

class FeeGenerationService
{
    public function generateForStructure(FeeStructure $feeStructure): int
    {
        $students = Student::active()
            ->where('grade_id', $feeStructure->grade_id)
            ->get();

        $created = 0;

        foreach ($students as $student) {
            if ($this->createIfMissing($student, $feeStructure)) {
                $created++;
            }
        }

        return $created;
    }

    public function generateForStudent(Student $student): int
    {
        $structures = FeeStructure::where('grade_id', $student->grade_id)
            ->whereHas('academicYear', fn ($query) => $query->where('is_current', true))
            ->get();

        $created = 0;

        foreach ($structures as $structure) {
            if ($this->createIfMissing($student, $structure)) {
                $created++;
            }
        }

        return $created;
    }

    protected function createIfMissing(Student $student, FeeStructure $feeStructure): bool
    {
        $exists = StudentFee::where('student_id', $student->id)
            ->where('fee_structure_id', $feeStructure->id)
            ->exists();

        if ($exists) {
            return false;
        }

        StudentFee::create([
            'student_id' => $student->id,
            'fee_structure_id' => $feeStructure->id,
            'amount_due' => $feeStructure->amount,
            'amount_paid' => 0,
            'balance' => $feeStructure->amount,
            'due_date' => $feeStructure->term?->end_date,
            'status' => 'pending',
        ]);

        return true;
    }
}