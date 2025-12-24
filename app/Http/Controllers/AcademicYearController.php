<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AcademicYearController extends Controller
{
    public function index()
    {
        $academicYears = AcademicYear::with('terms')->latest()->get();

        return Inertia::render('AcademicYears/Index', [
            'academicYears' => $academicYears
        ]);
    }

    public function create()
    {
        return Inertia::render('AcademicYears/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|string|max:20|unique:academic_years',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_current' => 'boolean',
        ]);

        if ($validated['is_current'] ?? false) {
            AcademicYear::where('is_current', true)->update(['is_current' => false]);
        }

        AcademicYear::create($validated);

        return redirect()->route('academic-years.index')
            ->with('success', 'Academic year created successfully');
    }

    public function show($id)
    {
        $academicYear = AcademicYear::with(['terms', 'feeStructures'])->findOrFail($id);

        return Inertia::render('AcademicYears/Show', [
            'academicYear' => $academicYear
        ]);
    }

    public function edit($id)
    {
        $academicYear = AcademicYear::findOrFail($id);

        return Inertia::render('AcademicYears/Edit', [
            'academicYear' => $academicYear
        ]);
    }

    public function update(Request $request, $id)
    {
        $academicYear = AcademicYear::findOrFail($id);

        $validated = $request->validate([
            'year' => 'sometimes|string|max:20',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'is_current' => 'boolean',
        ]);

        if ($validated['is_current'] ?? false) {
            AcademicYear::where('is_current', true)
                ->where('id', '!=', $id)
                ->update(['is_current' => false]);
        }

        $academicYear->update($validated);

        return redirect()->route('academic-years.index')
            ->with('success', 'Academic year updated successfully');
    }

    public function destroy($id)
    {
        $academicYear = AcademicYear::findOrFail($id);
        $academicYear->delete();

        return redirect()->route('academic-years.index')
            ->with('success', 'Academic year deleted successfully');
    }

    public function setCurrent($id)
    {
        DB::beginTransaction();
        try {
            AcademicYear::where('is_current', true)->update(['is_current' => false]);
            AcademicYear::where('id', $id)->update(['is_current' => true]);

            DB::commit();

            return back()->with('success', 'Current academic year set successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to set current academic year']);
        }
    }
}