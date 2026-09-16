<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pathway extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'code', 'description', 'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function gradeLearningAreas()
    {
        return $this->hasMany(GradeLearningArea::class);
    }

    public function studentPathways()
    {
        return $this->hasMany(StudentPathway::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}