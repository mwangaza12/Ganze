<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\EducationLevel;
use App\Models\Pathway;
use App\Models\LearningArea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeController extends Controller
{
    public function index()
    {
        $grades = Grade::withCount('students')
            ->with(['educationLevel', 'streams.classTeacher'])
            ->ordered()
            ->get();

        return Inertia::render('Grades/Index', [
            'grades' => $grades
        ]);
    }

    public function create()
    {
        $educationLevels = EducationLevel::active()->ordered()->get();

        return Inertia::render('Grades/Create', [
            'educationLevels' => $educationLevels,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'education_level_id' => 'required|exists:education_levels,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:grades',
            'sequence' => 'required|integer|min:0',
            'capacity' => 'required|integer|min:1',
            'has_pathways' => 'boolean',
        ]);

        Grade::create($validated);

        return redirect()->route('grades.index')
            ->with('success', 'Grade created successfully');
    }

    public function show($id)
    {
        $grade = Grade::with([
            'educationLevel',
            'streams.classTeacher',
            'students.stream',
            'learningAreas',
            'gradeLearningAreas.learningArea',
            'gradeLearningAreas.teacher',
            'gradeLearningAreas.pathway',
        ])->findOrFail($id);

        $pathways = $grade->has_pathways ? Pathway::active()->get() : collect();

        return Inertia::render('Grades/Show', [
            'grade' => $grade,
            'pathways' => $pathways,
            'availableLearningAreas' => LearningArea::active()->get(),
        ]);
    }

    public function edit($id)
    {
        $grade = Grade::findOrFail($id);
        $educationLevels = EducationLevel::active()->ordered()->get();

        return Inertia::render('Grades/Create', [
            'grade' => $grade,
            'educationLevels' => $educationLevels,
        ]);
    }

    public function update(Request $request, $id)
    {
        $grade = Grade::findOrFail($id);

        $validated = $request->validate([
            'education_level_id' => 'sometimes|exists:education_levels,id',
            'name' => 'sometimes|string|max:255',
            'capacity' => 'sometimes|integer|min:1',
            'has_pathways' => 'boolean',
        ]);

        $grade->update($validated);

        return redirect()->route('grades.index')
            ->with('success', 'Grade updated successfully');
    }

    public function destroy($id)
    {
        $grade = Grade::findOrFail($id);
        $grade->delete();

        return redirect()->route('grades.index')
            ->with('success', 'Grade deleted successfully');
    }

    public function students($gradeId)
    {
        $grade = Grade::with(['students.stream'])->findOrFail($gradeId);

        return Inertia::render('Grades/Students', [
            'grade' => $grade
        ]);
    }

    /**
     * Attach a learning area to a grade. Omit pathway_id for a compulsory
     * learning area every student in the grade takes; pass it to make the
     * learning area specific to one Senior School pathway.
     */
    public function assignLearningArea(Request $request, $gradeId)
    {
        $grade = Grade::findOrFail($gradeId);

        $validated = $request->validate([
            'learning_area_id' => 'required|exists:learning_areas,id',
            'pathway_id' => 'nullable|exists:pathways,id',
            'teacher_id' => 'nullable|exists:teachers,id',
        ]);

        $exists = $grade->gradeLearningAreas()
            ->where('learning_area_id', $validated['learning_area_id'])
            ->where('pathway_id', $validated['pathway_id'] ?? null)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'learning_area_id' => 'This learning area is already assigned to this grade'
                    . (empty($validated['pathway_id']) ? '.' : ' for this pathway.'),
            ]);
        }

        $grade->gradeLearningAreas()->create($validated);

        return back()->with('success', 'Learning area assigned to grade successfully');
    }

    public function unassignLearningArea($gradeId, $gradeLearningAreaId)
    {
        $grade = Grade::findOrFail($gradeId);
        $grade->gradeLearningAreas()->where('id', $gradeLearningAreaId)->firstOrFail()->delete();

        return back()->with('success', 'Learning area removed from grade successfully');
    }
}