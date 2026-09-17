<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentPathway;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class StudentPathwayController extends Controller
{
    /**
     * Assign (or change) a Senior School student's pathway for the
     * current academic year.
     */
    public function store(Request $request, $studentId)
    {
        $student = Student::with('grade')->findOrFail($studentId);

        if (! $student->grade->has_pathways) {
            return back()->withErrors(['pathway_id' => "This student's grade does not use pathways."]);
        }

        $validated = $request->validate([
            'pathway_id' => 'required|exists:pathways,id',
            'track' => 'nullable|string|max:255',
        ]);

        $academicYear = AcademicYear::where('is_current', true)->firstOrFail();

        StudentPathway::updateOrCreate(
            ['student_id' => $student->id, 'academic_year_id' => $academicYear->id],
            ['pathway_id' => $validated['pathway_id'], 'track' => $validated['track'] ?? null]
        );

        return back()->with('success', 'Pathway assigned successfully');
    }
}