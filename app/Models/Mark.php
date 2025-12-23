<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Mark extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id', 'student_id', 'subject_id', 'marks_obtained',
        'total_marks', 'grade', 'points', 'position', 'remarks', 'entered_by'
    ];

    protected $casts = [
        'marks_obtained' => 'decimal:2',
        'total_marks' => 'decimal:2',
    ];

    protected $appends = ['percentage'];

    // Accessor for percentage
    public function getPercentageAttribute()
    {
        if ($this->total_marks > 0) {
            return round(($this->marks_obtained / $this->total_marks) * 100, 2);
        }
        return 0;
    }

    // Relationships
    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function enteredBy()
    {
        return $this->belongsTo(Teacher::class, 'entered_by');
    }

    // Method to calculate grade based on Kenyan grading system
    public static function calculateGrade($percentage)
    {
        if ($percentage >= 80) return ['grade' => 'A', 'points' => 12];
        if ($percentage >= 75) return ['grade' => 'A-', 'points' => 11];
        if ($percentage >= 70) return ['grade' => 'B+', 'points' => 10];
        if ($percentage >= 65) return ['grade' => 'B', 'points' => 9];
        if ($percentage >= 60) return ['grade' => 'B-', 'points' => 8];
        if ($percentage >= 55) return ['grade' => 'C+', 'points' => 7];
        if ($percentage >= 50) return ['grade' => 'C', 'points' => 6];
        if ($percentage >= 45) return ['grade' => 'C-', 'points' => 5];
        if ($percentage >= 40) return ['grade' => 'D+', 'points' => 4];
        if ($percentage >= 35) return ['grade' => 'D', 'points' => 3];
        if ($percentage >= 30) return ['grade' => 'D-', 'points' => 2];
        return ['grade' => 'E', 'points' => 1];
    }
}