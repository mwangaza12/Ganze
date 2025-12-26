<?php

namespace App\Http\Controllers;

use App\Models\ClassModel;
use App\Models\Stream;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassController extends Controller
{
    public function index()
    {
        $classes = ClassModel::withCount('students')
            ->with(['streams.classTeacher'])
            ->get();

        return Inertia::render('Classes/Index', [
            'classes' => $classes
        ]);
    }

    public function create()
    {
        return Inertia::render('Classes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'required|integer|min:1|max:4',
            'capacity' => 'required|integer|min:1',
        ]);

        ClassModel::create($validated);

        return redirect()->route('classes.index')
            ->with('success', 'Class created successfully');
    }

    public function show($id)
    {
        $class = ClassModel::with([
            'streams.classTeacher',
            'students.stream',
            'subjects',
            'classSubjects.teacher'
        ])->findOrFail($id);

        return Inertia::render('Classes/Show', [
            'classItem' => $class
        ]);
    }

    public function edit($id)
    {
        $class = ClassModel::findOrFail($id);

        return Inertia::render('Classes/Create', [
            'classItem' => $class
        ]);
    }

    public function update(Request $request, $id)
    {
        $class = ClassModel::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'capacity' => 'sometimes|integer|min:1',
        ]);

        $class->update($validated);

        return redirect()->route('classes.index')
            ->with('success', 'Class updated successfully');
    }

    public function destroy($id)
    {
        $class = ClassModel::findOrFail($id);
        $class->delete();

        return redirect()->route('classes.index')
            ->with('success', 'Class deleted successfully');
    }

    public function students($classId)
    {
        $class = ClassModel::with(['students.stream'])->findOrFail($classId);

        return Inertia::render('Classes/Students', [
            'class' => $class
        ]);
    }

    public function assignSubject($classId, $subjectId)
    {
        $class = ClassModel::findOrFail($classId);
        $class->subjects()->attach($subjectId);

        return back()->with('success', 'Subject assigned to class successfully');
    }
}
