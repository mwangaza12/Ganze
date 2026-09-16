<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Strand extends Model
{
    use HasFactory;

    protected $fillable = [
        'learning_area_id', 'grade_id', 'name', 'code', 'sequence'
    ];

    public function learningArea()
    {
        return $this->belongsTo(LearningArea::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function subStrands()
    {
        return $this->hasMany(SubStrand::class)->orderBy('sequence');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sequence');
    }
}