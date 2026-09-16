<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Stream extends Model
{
    use HasFactory;

    protected $fillable = [
        'grade_id', 'name', 'teacher_id', 'capacity'
    ];

    // Relationships
    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function classTeacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }
}