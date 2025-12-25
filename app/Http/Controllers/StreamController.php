<?php

namespace App\Http\Controllers;

use App\Models\Stream;
use App\Models\ClassModel;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StreamController extends Controller
{
    public function index($classId)
    {
        $class = ClassModel::with('streams.classTeacher')->findOrFail($classId);

        return Inertia::render('Classes/Streams/Index', [
            'class' => $class
        ]);
    }

    public function create($classId)
    {
        $class = ClassModel::findOrFail($classId);
        $teachers = Teacher::all();

        return Inertia::render('Classes/Streams/Create', [
            'classItem' => $class,
            'teachers' => $teachers
        ]);
    }

    public function store(Request $request, $classId)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'teacher_id' => 'nullable|exists:teachers,id',
            'capacity' => 'required|integer|min:1',
        ]);

        $validated['class_id'] = $classId;
        Stream::create($validated);

        return redirect()->route('classes.show', $classId)
            ->with('success', 'Stream created successfully');
    }

    public function show($classId, $id)
    {
        $stream = Stream::with(['class', 'classTeacher', 'students'])
            ->findOrFail($id);

        return Inertia::render('Classes/Streams/Show', [
            'stream' => $stream
        ]);
    }

    public function edit($classId, $id)
    {
        $stream = Stream::findOrFail($id);
        $class = ClassModel::findOrFail($classId);
        $teachers = Teacher::all();

        return Inertia::render('Classes/Streams/Edit', [
            'stream' => $stream,
            'class' => $class,
            'teachers' => $teachers
        ]);
    }

    public function update(Request $request, $classId, $id)
    {
        $stream = Stream::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'teacher_id' => 'nullable|exists:teachers,id',
            'capacity' => 'sometimes|integer|min:1',
        ]);

        $stream->update($validated);

        return redirect()->route('classes.show', $classId)
            ->with('success', 'Stream updated successfully');
    }

    public function destroy($classId, $id)
    {
        $stream = Stream::findOrFail($id);
        $stream->delete();

        return redirect()->route('classes.show', $classId)
            ->with('success', 'Stream deleted successfully');
    }
}