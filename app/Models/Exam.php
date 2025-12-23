<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'term_id', 'class_id', 'name', 'type',
        'exam_date', 'total_marks', 'description'
    ];

    protected $casts = [
        'exam_date' => 'date',
    ];

    // Relationships
    public function term()
    {
        return $this->belongsTo(Term::class);
    }

    public function class()
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    public function marks()
    {
        return $this->hasMany(Mark::class);
    }

    // Scopes
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('exam_date', '>=', today());
    }
}
