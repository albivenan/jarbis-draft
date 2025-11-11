<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Employee;

class HrdDetail extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id',
        'employee_type',
        'hr_level',
        'responsibility_area',
        'has_recruitment_access',
        'has_attendance_access',
        'has_payroll_access',
        'notes'
    ];

    protected $casts = [
        'has_recruitment_access' => 'boolean',
        'has_attendance_access' => 'boolean',
        'has_payroll_access' => 'boolean'
    ];

    // Relationships
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
