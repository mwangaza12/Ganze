<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id', 'student_fee_id', 'receipt_number', 'amount',
        'payment_date', 'payment_method', 'transaction_reference',
        'remarks', 'received_by'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
    ];

    // Relationships
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function studentFee()
    {
        return $this->belongsTo(StudentFee::class);
    }

    public function receivedBy()
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    // Scopes
    public function scopeByMethod($query, $method)
    {
        return $query->where('payment_method', $method);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('payment_date', [$startDate, $endDate]);
    }

    // Generate receipt number
    public static function generateReceiptNumber()
    {
        $lastPayment = self::latest('id')->first();
        $nextId = $lastPayment ? $lastPayment->id + 1 : 1;
        return 'RCT-' . date('Y') . '-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }
}
