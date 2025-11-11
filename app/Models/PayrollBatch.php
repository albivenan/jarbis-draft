<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollBatch extends Model
{
    use HasFactory;

    protected $table = 'payroll_batches';

    protected $fillable = [
        'batch_code',
        'period',
        'period_type',
        'total_employees',
        'total_amount',
        'status',
        'submitted_at',
        'submitted_by',
        'approved_at',
        'approved_by',
        'approved_by',
        'rejection_reason',
        'paid_at'
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',
        'paid_at' => 'datetime',
        'total_amount' => 'decimal:2',
        'total_employees' => 'integer'
    ];

    /**
     * Get the employees for this payroll batch.
     */
    public function employees(): HasMany
    {
        return $this->hasMany(PayrollEmployee::class, 'batch_id');
    }

    /**
     * Get the user who submitted this batch.
     */
    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    /**
     * Get the user who approved this batch.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
