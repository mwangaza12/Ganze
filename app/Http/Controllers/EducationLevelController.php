<?php

namespace App\Http\Controllers;

use App\Models\EducationLevel;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EducationLevelController extends Controller
{
    public function index()
    {
        $educationLevels = EducationLevel::ordered()->withCount('grades')->get();

        return Inertia::render('EducationLevels/Index', [
            'educationLevels' => $educationLevels,
        ]);
    }

    public function create()
    {
        return Inertia::render('EducationLevels/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:education_levels',
            'sequence' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        EducationLevel::create($validated);

        return redirect()->route('education-levels.index')
            ->with('success', 'Education level created successfully');
    }

    public function show($id)
    {
        $educationLevel = EducationLevel::with(['grades' => fn ($q) => $q->ordered()])->findOrFail($id);

        return Inertia::render('EducationLevels/Show', [
            'educationLevel' => $educationLevel,
        ]);
    }

    public function edit($id)
    {
        $educationLevel = EducationLevel::findOrFail($id);

        return Inertia::render('EducationLevels/Create', [
            'educationLevel' => $educationLevel,
        ]);
    }

    public function update(Request $request, $id)
    {
        $educationLevel = EducationLevel::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => ['sometimes', 'string', 'max:20', Rule::unique('education_levels')->ignore($educationLevel->id)],
            'sequence' => 'sometimes|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $educationLevel->update($validated);

        return redirect()->route('education-levels.index')
            ->with('success', 'Education level updated successfully');
    }

    public function destroy($id)
    {
        $educationLevel = EducationLevel::findOrFail($id);
        $educationLevel->delete();

        return redirect()->route('education-levels.index')
            ->with('success', 'Education level deleted successfully');
    }
}