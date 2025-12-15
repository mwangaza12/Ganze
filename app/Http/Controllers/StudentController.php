<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use App\Models\Student;

class StudentController extends Controller
{
    public function index(){
        $students =  Student::all();
        return Inertia::render('students/index', ['students'=>$students]);
    }

    public function create(){
        return Inertia::render('students/create');
    }

    public function store(Request $request): RedirectResponse{
        $student = $request->all();

        // dd($student);
        Student::create($student);

        return redirect()->route('students.index');
    }
}
