<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'name',
        'date_of_birth',
        'parent_name',
        'parent_contact',
        'parent_email',
        'previous_school',
        'kcpe_marks',
        'form'
    ];
}
