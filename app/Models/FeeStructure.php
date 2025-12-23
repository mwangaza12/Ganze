<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FeeStructure extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year_id', 'term_id', 'class_id',
        'fee_type', 'amount', 'description'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    // Relationships
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function term()
    {
        return $this->belongsTo(Term::class);
    }

    public function class()
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    public function studentFees()
    {
        return $this->hasMany(StudentFee::class);
    }
}
