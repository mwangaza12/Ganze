<?php

namespace App\Http\Controllers;

use App\Models\LearningArea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LearningAreaController extends Controller
{
    public function index()
    {
        $learningAreas = LearningArea::with('teachers')->get();

        return Inertia::render('LearningAreas/Index', [
            'learningAreas' => $learningAreas
        ]);
    }

    public function create()
    {
        return Inertia::render('LearningAreas/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:learning_areas',
            'category' => 'required|in:core,optional',
            'is_active' => 'boolean',
        ]);

        LearningArea::create($validated);

        return redirect()->route('learning-areas.index')
            ->with('success', 'Learning area created successfully');
    }

    public function show($id)
    {
        $learningArea = LearningArea::with([
            'teachers',
            'grades',
            'strands.grade',
            'strands.subStrands.learningOutcomes',
        ])->findOrFail($id);

        return Inertia::render('LearningAreas/Show', [
            'learningArea' => $learningArea
        ]);
    }

    public function edit($id)
    {
        $learningArea = LearningArea::findOrFail($id);

        return Inertia::render('LearningAreas/Create', [
            'learningArea' => $learningArea
        ]);
    }

    public function update(Request $request, $id)
    {
        $learningArea = LearningArea::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|in:core,optional',
            'is_active' => 'boolean',
        ]);

        $learningArea->update($validated);

        return redirect()->route('learning-areas.index')
            ->with('success', 'Learning area updated successfully');
    }

    public function destroy($id)
    {
        $learningArea = LearningArea::findOrFail($id);
        $learningArea->delete();

        return redirect()->route('learning-areas.index')
            ->with('success', 'Learning area deleted successfully');
    }
}