<?php

namespace App\Models;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PpicDetail extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id',
        'employee_type',
        'ppic_level',
        'responsibility_area',
        'has_inventory_access',
        'has_production_planning_access',
        'has_purchasing_access',
        'notes'
    ];

    protected $casts = [
        'has_inventory_access' => 'boolean',
        'has_production_planning_access' => 'boolean',
        'has_purchasing_access' => 'boolean'
    ];

    // Relationships
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
