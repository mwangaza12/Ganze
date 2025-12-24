<?php

namespace App\Http\Controllers;

use App\Models\Guardian;
use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class GuardianController extends Controller
{
    public function index(Request $request)
    {
        $query = Guardian::with(['students']);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('id_number', 'like', "%{$search}%");
            });
        }

        $guardians = $query->latest()->paginate($request->per_page ?? 15);

        return Inertia::render('Guardians/Index', [
            'guardians' => $guardians,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        $students = Student::active()->get();

        return Inertia::render('Guardians/Create', [
            'students' => $students
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_number' => 'required|string|unique:guardians',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string',
            'alt_phone' => 'nullable|string',
            'email' => 'nullable|email|unique:users',
            'relationship' => 'required|in:father,mother,guardian,other',
            'occupation' => 'nullable|string',
            'address' => 'nullable|string',
            'student_ids' => 'nullable|array',
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'] ?? $validated['phone'] . '@guardian.school.ke',
                'phone' => $validated['phone'],
                'password' => Hash::make('password123'),
                'role' => 'parent',
                'is_active' => true,
            ]);

            $validated['user_id'] = $user->id;
            $guardian = Guardian::create($validated);

            if (!empty($validated['student_ids'])) {
                $guardian->students()->attach($validated['student_ids']);
            }

            DB::commit();

            return redirect()->route('guardians.index')
                ->with('success', 'Guardian created successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create guardian'])
                ->withInput();
        }
    }

    public function show($id)
    {
        $guardian = Guardian::with(['students.class', 'students.stream'])->findOrFail($id);

        return Inertia::render('Guardians/Show', [
            'guardian' => $guardian
        ]);
    }

    public function edit($id)
    {
        $guardian = Guardian::with('students')->findOrFail($id);
        $students = Student::active()->get();

        return Inertia::render('Guardians/Edit', [
            'guardian' => $guardian,
            'students' => $students
        ]);
    }

    public function update(Request $request, $id)
    {
        $guardian = Guardian::findOrFail($id);

        $validated = $request->validate([
            'id_number' => ['sometimes', 'string', Rule::unique('guardians')->ignore($guardian->id)],
            'first_name' => 'sometimes|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string',
            'alt_phone' => 'nullable|string',
            'relationship' => 'sometimes|in:father,mother,guardian,other',
            'occupation' => 'nullable|string',
            'address' => 'nullable|string',
            'student_ids' => 'nullable|array',
        ]);

        DB::beginTransaction();
        try {
            $guardian->update($validated);

            if (isset($validated['student_ids'])) {
                $guardian->students()->sync($validated['student_ids']);
            }

            DB::commit();

            return redirect()->route('guardians.index')
                ->with('success', 'Guardian updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update guardian'])
                ->withInput();
        }
    }

    public function destroy($id)
    {
        $guardian = Guardian::findOrFail($id);
        $guardian->delete();

        return redirect()->route('guardians.index')
            ->with('success', 'Guardian deleted successfully');
    }

    public function attachToStudent($studentId, $guardianId)
    {
        $student = Student::findOrFail($studentId);
        $student->guardians()->attach($guardianId);

        return back()->with('success', 'Guardian attached to student successfully');
    }

    public function detachFromStudent($studentId, $guardianId)
    {
        $student = Student::findOrFail($studentId);
        $student->guardians()->detach($guardianId);

        return back()->with('success', 'Guardian detached from student successfully');
    }

    public function setPrimary($studentId, $guardianId)
    {
        $student = Student::findOrFail($studentId);
        
        DB::beginTransaction();
        try {
            // Set all to non-primary
            DB::table('student_guardians')
                ->where('student_id', $studentId)
                ->update(['is_primary' => false]);
            
            // Set this one as primary
            DB::table('student_guardians')
                ->where('student_id', $studentId)
                ->where('guardian_id', $guardianId)
                ->update(['is_primary' => true]);

            DB::commit();

            return back()->with('success', 'Primary guardian set successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to set primary guardian']);
        }
    }
}
