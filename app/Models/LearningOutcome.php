<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LearningOutcome extends Model
{
    use HasFactory;

    protected $fillable = [
        'sub_strand_id', 'description', 'sequence'
    ];

    public function subStrand()
    {
        return $this->belongsTo(SubStrand::class);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sequence');
    }
}