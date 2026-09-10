<?php

namespace App\Services;

use App\Models\FeeStructure;
use App\Models\Student;
use App\Models\StudentFee;

class FeeGenerationService
{
    /**
     * Create a StudentFee for every active student in this fee structure's
     * class who doesn't already have one. Safe to call repeatedly — it
     * only ever fills in what's missing, never duplicates or overwrites.
     *
     * @return int number of StudentFee records created
     */
    public function generateForStructure(FeeStructure $feeStructure): int
    {
        $students = Student::active()
            ->where('class_id', $feeStructure->class_id)
            ->get();

        $created = 0;

        foreach ($students as $student) {
            if ($this->createIfMissing($student, $feeStructure)) {
                $created++;
            }
        }

        return $created;
    }

    /**
     * Create a StudentFee for this student for every fee structure that
     * applies to their class in the current academic year. Meant to be
     * called right after a student is admitted, so they're billed for
     * whatever the rest of their class is already being billed for.
     *
     * @return int number of StudentFee records created
     */
    public function generateForStudent(Student $student): int
    {
        $structures = FeeStructure::where('class_id', $student->class_id)
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