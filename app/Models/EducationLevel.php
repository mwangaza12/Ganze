<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EducationLevel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'code', 'sequence', 'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function grades()
    {
        return $this->hasMany(Grade::class)->orderBy('sequence');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sequence');
    }
}