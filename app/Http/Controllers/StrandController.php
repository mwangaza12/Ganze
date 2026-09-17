<?php

namespace App\Http\Controllers;

use App\Models\LearningArea;
use App\Models\Grade;
use App\Models\Strand;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StrandController extends Controller
{
    public function index($learningAreaId, $gradeId)
    {
        $learningArea = LearningArea::findOrFail($learningAreaId);
        $grade = Grade::findOrFail($gradeId);

        $strands = Strand::where('learning_area_id', $learningAreaId)
            ->where('grade_id', $gradeId)
            ->ordered()
            ->with('subStrands.learningOutcomes')
            ->get();

        return Inertia::render('Strands/Index', [
            'learningArea' => $learningArea,
            'grade' => $grade,
            'strands' => $strands,
        ]);
    }

    public function store(Request $request, $learningAreaId, $gradeId)
    {
        LearningArea::findOrFail($learningAreaId);
        Grade::findOrFail($gradeId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:30',
            'sequence' => 'nullable|integer|min:0',
        ]);

        $validated['learning_area_id'] = $learningAreaId;
        $validated['grade_id'] = $gradeId;

        Strand::create($validated);

        return back()->with('success', 'Strand added successfully');
    }

    public function update(Request $request, $learningAreaId, $gradeId, $id)
    {
        $strand = Strand::where('learning_area_id', $learningAreaId)
            ->where('grade_id', $gradeId)
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'nullable|string|max:30',
            'sequence' => 'sometimes|integer|min:0',
        ]);

        $strand->update($validated);

        return back()->with('success', 'Strand updated successfully');
    }

    public function destroy($learningAreaId, $gradeId, $id)
    {
        $strand = Strand::where('learning_area_id', $learningAreaId)
            ->where('grade_id', $gradeId)
            ->findOrFail($id);

        $strand->delete();

        return back()->with('success', 'Strand deleted successfully');
    }
}