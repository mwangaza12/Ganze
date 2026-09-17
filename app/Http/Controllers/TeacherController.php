<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\User;
use App\Models\LearningArea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $query = Teacher::with(['user', 'learningAreas']);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('tsc_number', 'like', "%{$search}%");
            });
        }

        $teachers = $query->latest()->paginate($request->per_page ?? 15);

        return Inertia::render('Teachers/Index', [
            'teachers' => $teachers,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        $learningAreas = LearningArea::active()->get();

        return Inertia::render('Teachers/Create', [
            'learningAreas' => $learningAreas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tsc_number' => 'required|string|unique:teachers',
            'id_number' => 'required|string|unique:teachers',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'date_of_birth' => 'required|date',
            'date_of_employment' => 'required|date',
            'qualification' => 'required|string',
            'phone' => 'required|string|unique:users,phone',
            'alt_phone' => 'nullable|string',
            'address' => 'nullable|string',
            'emergency_contact' => 'required|string',
            'emergency_contact_name' => 'required|string',
            'email' => 'required|email|unique:users',
            'learning_area_ids' => 'nullable|array',
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'password' => Hash::make('password123'),
                'role' => 'teacher',
                'is_active' => true,
            ]);

            $validated['user_id'] = $user->id;
            $teacher = Teacher::create($validated);

            if (!empty($validated['learning_area_ids'])) {
                $teacher->learningAreas()->attach($validated['learning_area_ids']);
            }

            DB::commit();

            return redirect()->route('teachers.index')
                ->with('success', 'Teacher created successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create teacher: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function show($id)
    {
        $teacher = Teacher::with([
            'learningAreas',
            'streams.grade',
            'gradeLearningAreas.grade',
            'gradeLearningAreas.learningArea',
        ])->findOrFail($id);

        return Inertia::render('Teachers/Show', [
            'teacher' => $teacher
        ]);
    }

    public function edit($id)
    {
        $teacher = Teacher::with('learningAreas')->findOrFail($id);
        $learningAreas = LearningArea::active()->get();

        return Inertia::render('Teachers/Create', [
            'teacher' => $teacher,
            'learningAreas' => $learningAreas
        ]);
    }

    public function update(Request $request, $id)
    {
        $teacher = Teacher::findOrFail($id);

        $validated = $request->validate([
            'tsc_number' => ['sometimes', 'string', Rule::unique('teachers')->ignore($teacher->id)],
            'id_number' => ['sometimes', 'string', Rule::unique('teachers')->ignore($teacher->id)],
            'first_name' => 'sometimes|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'gender' => 'sometimes|in:male,female',
            'date_of_birth' => 'sometimes|date',
            'qualification' => 'sometimes|string',
            'phone' => 'sometimes|string',
            'alt_phone' => 'nullable|string',
            'address' => 'nullable|string',
            'emergency_contact' => 'sometimes|string',
            'emergency_contact_name' => 'sometimes|string',
            'learning_area_ids' => 'nullable|array',
        ]);

        DB::beginTransaction();
        try {
            $teacher->update($validated);

            if (isset($validated['learning_area_ids'])) {
                $teacher->learningAreas()->sync($validated['learning_area_ids']);
            }

            DB::commit();

            return redirect()->route('teachers.index')
                ->with('success', 'Teacher updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update teacher'])
                ->withInput();
        }
    }

    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);
        $teacher->delete();

        return redirect()->route('teachers.index')
            ->with('success', 'Teacher deleted successfully');
    }

    public function assignLearningArea($teacherId, $learningAreaId)
    {
        $teacher = Teacher::findOrFail($teacherId);
        $teacher->learningAreas()->attach($learningAreaId);

        return back()->with('success', 'Learning area assigned successfully');
    }

    public function unassignLearningArea($teacherId, $learningAreaId)
    {
        $teacher = Teacher::findOrFail($teacherId);
        $teacher->learningAreas()->detach($learningAreaId);

        return back()->with('success', 'Learning area unassigned successfully');
    }
}