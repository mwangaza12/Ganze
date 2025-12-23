<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Teacher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'tsc_number', 'id_number', 'first_name', 'middle_name',
        'last_name', 'gender', 'date_of_birth', 'date_of_employment',
        'qualification', 'phone', 'alt_phone', 'address',
        'emergency_contact', 'emergency_contact_name'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'date_of_employment' => 'date',
    ];

    protected $appends = ['full_name'];

    public function getFullNameAttribute()
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->last_name}");
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'teacher_subjects')
                    ->withTimestamps();
    }

    public function classSubjects()
    {
        return $this->hasMany(ClassSubject::class);
    }

    public function streams()
    {
        return $this->hasMany(Stream::class);
    }

    public function attendanceMarked()
    {
        return $this->hasMany(Attendance::class, 'marked_by');
    }

    public function marksEntered()
    {
        return $this->hasMany(Mark::class, 'entered_by');
    }
}
