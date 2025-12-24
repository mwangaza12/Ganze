<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\User;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $query = Teacher::with(['user', 'subjects']);

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
        $subjects = Subject::active()->get();

        return Inertia::render('Teachers/Create', [
            'subjects' => $subjects
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
            'phone' => 'required|string',
            'alt_phone' => 'nullable|string',
            'address' => 'nullable|string',
            'emergency_contact' => 'required|string',
            'emergency_contact_name' => 'required|string',
            'email' => 'required|email|unique:users',
            'subject_ids' => 'nullable|array',
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

            if (!empty($validated['subject_ids'])) {
                $teacher->subjects()->attach($validated['subject_ids']);
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
        $teacher = Teacher::with(['subjects', 'streams.class', 'classSubjects.class', 'classSubjects.subject'])
            ->findOrFail($id);

        return Inertia::render('Teachers/Show', [
            'teacher' => $teacher
        ]);
    }

    public function edit($id)
    {
        $teacher = Teacher::with('subjects')->findOrFail($id);
        $subjects = Subject::active()->get();

        return Inertia::render('Teachers/Edit', [
            'teacher' => $teacher,
            'subjects' => $subjects
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
            'subject_ids' => 'nullable|array',
        ]);

        DB::beginTransaction();
        try {
            $teacher->update($validated);

            if (isset($validated['subject_ids'])) {
                $teacher->subjects()->sync($validated['subject_ids']);
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

    public function assignSubject($teacherId, $subjectId)
    {
        $teacher = Teacher::findOrFail($teacherId);
        $teacher->subjects()->attach($subjectId);

        return back()->with('success', 'Subject assigned successfully');
    }

    public function unassignSubject($teacherId, $subjectId)
    {
        $teacher = Teacher::findOrFail($teacherId);
        $teacher->subjects()->detach($subjectId);

        return back()->with('success', 'Subject unassigned successfully');
    }
}
