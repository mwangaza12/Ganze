<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GradeLearningArea extends Model
{
    use HasFactory;

    protected $fillable = [
        'grade_id', 'learning_area_id', 'pathway_id', 'teacher_id'
    ];

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function learningArea()
    {
        return $this->belongsTo(LearningArea::class);
    }

    // Null pathway = compulsory for every student in the grade.
    public function pathway()
    {
        return $this->belongsTo(Pathway::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function scopeCompulsory($query)
    {
        return $query->whereNull('pathway_id');
    }

    public function scopeForPathway($query, $pathwayId)
    {
        return $query->where('pathway_id', $pathwayId);
    }
}