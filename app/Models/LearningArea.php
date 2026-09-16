<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LearningArea extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'code', 'category', 'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relationships
    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'teacher_learning_areas')
                    ->withTimestamps();
    }

    public function grades()
    {
        return $this->belongsToMany(Grade::class, 'grade_learning_areas')
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

    public function marks()
    {
        return $this->hasMany(Mark::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}