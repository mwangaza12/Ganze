<?php

namespace App\Http\Controllers;

use App\Models\Pathway;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PathwayController extends Controller
{
    public function index()
    {
        $pathways = Pathway::withCount('studentPathways')->get();

        return Inertia::render('Pathways/Index', [
            'pathways' => $pathways
        ]);
    }

    public function create()
    {
        return Inertia::render('Pathways/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:pathways',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Pathway::create($validated);

        return redirect()->route('pathways.index')
            ->with('success', 'Pathway created successfully');
    }

    public function show($id)
    {
        $pathway = Pathway::with(['gradeLearningAreas.grade', 'gradeLearningAreas.learningArea'])
            ->findOrFail($id);

        return Inertia::render('Pathways/Show', [
            'pathway' => $pathway
        ]);
    }

    public function edit($id)
    {
        $pathway = Pathway::findOrFail($id);

        return Inertia::render('Pathways/Create', [
            'pathway' => $pathway
        ]);
    }

    public function update(Request $request, $id)
    {
        $pathway = Pathway::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $pathway->update($validated);

        return redirect()->route('pathways.index')
            ->with('success', 'Pathway updated successfully');
    }

    public function destroy($id)
    {
        $pathway = Pathway::findOrFail($id);
        $pathway->delete();

        return redirect()->route('pathways.index')
            ->with('success', 'Pathway deleted successfully');
    }
}