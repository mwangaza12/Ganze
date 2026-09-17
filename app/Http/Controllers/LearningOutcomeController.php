<?php

namespace App\Http\Controllers;

use App\Models\SubStrand;
use App\Models\LearningOutcome;
use Illuminate\Http\Request;

class LearningOutcomeController extends Controller
{
    public function store(Request $request, $subStrandId)
    {
        SubStrand::findOrFail($subStrandId);

        $validated = $request->validate([
            'description' => 'required|string',
            'sequence' => 'nullable|integer|min:0',
        ]);

        $validated['sub_strand_id'] = $subStrandId;

        LearningOutcome::create($validated);

        return back()->with('success', 'Learning outcome added successfully');
    }

    public function update(Request $request, $subStrandId, $id)
    {
        $outcome = LearningOutcome::where('sub_strand_id', $subStrandId)->findOrFail($id);

        $validated = $request->validate([
            'description' => 'sometimes|string',
            'sequence' => 'sometimes|integer|min:0',
        ]);

        $outcome->update($validated);

        return back()->with('success', 'Learning outcome updated successfully');
    }

    public function destroy($subStrandId, $id)
    {
        $outcome = LearningOutcome::where('sub_strand_id', $subStrandId)->findOrFail($id);
        $outcome->delete();

        return back()->with('success', 'Learning outcome deleted successfully');
    }
}