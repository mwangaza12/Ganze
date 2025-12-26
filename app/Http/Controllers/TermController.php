<?php

namespace App\Http\Controllers;

use App\Models\Term;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TermController extends Controller
{
    public function index()
    {
        $terms = Term::with('academicYear')->latest()->get();
        $academicYears = AcademicYear::all();

        return Inertia::render('Terms/Index', [
            'terms' => $terms,
            'academicYears' => $academicYears
        ]);
    }

    public function create()
    {
        $academicYears = AcademicYear::all();

        return Inertia::render('Terms/Create', [
            'academicYears' => $academicYears
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'term_number' => 'required|integer|min:1|max:3',
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_current' => 'boolean',
        ]);

        if ($validated['is_current'] ?? false) {
            Term::where('is_current', true)->update(['is_current' => false]);
        }

        Term::create($validated);

        return redirect()->route('terms.index')
            ->with('success', 'Term created successfully');
    }

    public function show($id)
    {
        $term = Term::with(['academicYear', 'exams', 'feeStructures'])->findOrFail($id);

        return Inertia::render('Terms/Show', [
            'term' => $term
        ]);
    }

    public function edit($id)
    {
        $term = Term::findOrFail($id);
        $academicYears = AcademicYear::all();

        return Inertia::render('Terms/Create', [
            'term' => $term,
            'academicYears' => $academicYears
        ]);
    }

    public function update(Request $request, $id)
    {
        $term = Term::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'is_current' => 'boolean',
        ]);

        if ($validated['is_current'] ?? false) {
            Term::where('is_current', true)
                ->where('id', '!=', $id)
                ->update(['is_current' => false]);
        }

        $term->update($validated);

        return redirect()->route('terms.index')
            ->with('success', 'Term updated successfully');
    }

    public function destroy($id)
    {
        $term = Term::findOrFail($id);
        $term->delete();

        return redirect()->route('terms.index')
            ->with('success', 'Term deleted successfully');
    }

    public function setCurrent($id)
    {
        DB::beginTransaction();
        try {
            Term::where('is_current', true)->update(['is_current' => false]);
            Term::where('id', $id)->update(['is_current' => true]);

            DB::commit();

            return back()->with('success', 'Current term set successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to set current term']);
        }
    }
}