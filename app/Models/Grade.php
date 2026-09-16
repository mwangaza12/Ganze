<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'education_level_id', 'name', 'code', 'sequence', 'capacity', 'has_pathways'
    ];

    protected $casts = [
        'has_pathways' => 'boolean',
    ];

    // Relationships
    public function educationLevel()
    {
        return $this->belongsTo(EducationLevel::class);
    }

    public function streams()
    {
        return $this->hasMany(Stream::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function learningAreas()
    {
        return $this->belongsToMany(LearningArea::class, 'grade_learning_areas')
                    ->withPivot('id', 'pathway_id', 'teacher_id')
                    ->withTimestamps();
    }

    public function gradeLearningAreas()
    {
        return $this->hasMany(GradeLearningArea::class);
    }

    public function strands()
    {
        return $this->hasMany(Strand::class);
    }

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }

    public function feeStructures()
    {
        return $this->hasMany(FeeStructure::class);
    }

    // Scopes
    public function scopeOrdered($query)
    {
        return $query->orderBy('sequence');
    }
}