<?php

namespace App\Http\Controllers;

use App\Models\Strand;
use App\Models\SubStrand;
use Illuminate\Http\Request;

class SubStrandController extends Controller
{
    public function store(Request $request, $strandId)
    {
        Strand::findOrFail($strandId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sequence' => 'nullable|integer|min:0',
        ]);

        $validated['strand_id'] = $strandId;

        SubStrand::create($validated);

        return back()->with('success', 'Sub-strand added successfully');
    }

    public function update(Request $request, $strandId, $id)
    {
        $subStrand = SubStrand::where('strand_id', $strandId)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'sequence' => 'sometimes|integer|min:0',
        ]);

        $subStrand->update($validated);

        return back()->with('success', 'Sub-strand updated successfully');
    }

    public function destroy($strandId, $id)
    {
        $subStrand = SubStrand::where('strand_id', $strandId)->findOrFail($id);
        $subStrand->delete();

        return back()->with('success', 'Sub-strand deleted successfully');
    }
}