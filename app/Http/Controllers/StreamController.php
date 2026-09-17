<?php

namespace App\Http\Controllers;

use App\Models\Stream;
use App\Models\Grade;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StreamController extends Controller
{
    public function index($gradeId)
    {
        $grade = Grade::with('streams.classTeacher')->findOrFail($gradeId);

        return Inertia::render('Grades/Streams/Index', [
            'grade' => $grade
        ]);
    }

    public function create($gradeId)
    {
        $grade = Grade::findOrFail($gradeId);
        $teachers = Teacher::all();

        return Inertia::render('Grades/Streams/Create', [
            'gradeItem' => $grade,
            'teachers' => $teachers
        ]);
    }

    public function store(Request $request, $gradeId)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'teacher_id' => 'nullable|exists:teachers,id',
            'capacity' => 'required|integer|min:1',
        ]);

        $validated['grade_id'] = $gradeId;
        Stream::create($validated);

        return redirect()->route('grades.show', $gradeId)
            ->with('success', 'Stream created successfully');
    }

    public function show($gradeId, $id)
    {
        $stream = Stream::with(['grade', 'classTeacher', 'students'])
            ->findOrFail($id);

        return Inertia::render('Grades/Streams/Show', [
            'stream' => $stream
        ]);
    }

    public function edit($gradeId, $id)
    {
        $stream = Stream::findOrFail($id);
        $grade = Grade::findOrFail($gradeId);
        $teachers = Teacher::all();

        return Inertia::render('Grades/Streams/Edit', [
            'stream' => $stream,
            'grade' => $grade,
            'teachers' => $teachers
        ]);
    }

    public function update(Request $request, $gradeId, $id)
    {
        $stream = Stream::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'teacher_id' => 'nullable|exists:teachers,id',
            'capacity' => 'sometimes|integer|min:1',
        ]);

        $stream->update($validated);

        return redirect()->route('grades.show', $gradeId)
            ->with('success', 'Stream updated successfully');
    }

    public function destroy($gradeId, $id)
    {
        $stream = Stream::findOrFail($id);
        $stream->delete();

        return redirect()->route('grades.show', $gradeId)
            ->with('success', 'Stream deleted successfully');
    }
}