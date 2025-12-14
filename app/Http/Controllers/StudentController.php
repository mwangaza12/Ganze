<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
}
