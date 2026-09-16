<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'admission_number', 'first_name', 'middle_name', 'last_name',
        'gender', 'date_of_birth', 'admission_date', 'grade_id', 'stream_id',
        'birth_certificate_number', 'medical_conditions', 'allergies',
        'address', 'county', 'sub_county', 'status', 'photo'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'admission_date' => 'date',
    ];

    protected $appends = ['full_name', 'age'];

    public function getFullNameAttribute()
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->last_name}");
    }

    public function getAgeAttribute()
    {
        return $this->date_of_birth->age;
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function stream()
    {
        return $this->belongsTo(Stream::class);
    }

    public function guardians()
    {
        return $this->belongsToMany(Guardian::class, 'student_guardians')
                    ->withPivot('is_primary')
                    ->withTimestamps();
    }

    public function primaryGuardian()
    {
        return $this->belongsToMany(Guardian::class, 'student_guardians')
                    ->wherePivot('is_primary', true)
                    ->withTimestamps()
                    ->first();
    }

    public function attendance()
    {
        return $this->hasMany(Attendance::class);
    }

    public function marks()
    {
        return $this->hasMany(Mark::class);
    }

    public function fees()
    {
        return $this->hasMany(StudentFee::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function pathways()
    {
        return $this->hasMany(StudentPathway::class);
    }

    // Pathway for the current academic year (only meaningful for Senior School students).
    public function currentPathway()
    {
        return $this->hasOne(StudentPathway::class)
                    ->whereHas('academicYear', fn ($q) => $q->where('is_current', true));
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByGrade($query, $gradeId)
    {
        return $query->where('grade_id', $gradeId);
    }

    public function scopeByStream($query, $streamId)
    {
        return $query->where('stream_id', $streamId);
    }
}