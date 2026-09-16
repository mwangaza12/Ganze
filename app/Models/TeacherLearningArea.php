<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TeacherLearningArea extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id', 'learning_area_id'
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function learningArea()
    {
        return $this->belongsTo(LearningArea::class);
    }
}