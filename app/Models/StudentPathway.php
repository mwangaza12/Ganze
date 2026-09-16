<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentPathway extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id', 'pathway_id', 'academic_year_id', 'track'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function pathway()
    {
        return $this->belongsTo(Pathway::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }
}