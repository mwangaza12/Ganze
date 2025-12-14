<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(){
        $students = [
            ['id' => 1, 'name' => 'Alice Johnson', 'email' => 'alice@gmail.com'],
            ['id' => 2, 'name' => 'Joseph Mwangaza', 'email' => 'joseph@gmail.com'],
            ['id' => 3, 'name' => 'Jacob Mokoli', 'email' => 'jacoob@gmail.com'],

        ];
        return Inertia::render('students/index', ['students'=>$students]);
    }
}
