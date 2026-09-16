<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubStrand extends Model
{
    use HasFactory;

    protected $fillable = [
        'strand_id', 'name', 'sequence'
    ];

    public function strand()
    {
        return $this->belongsTo(Strand::class);
    }

    public function learningOutcomes()
    {
        return $this->hasMany(LearningOutcome::class)->orderBy('sequence');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sequence');
    }
}