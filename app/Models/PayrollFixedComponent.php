<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayrollFixedComponent extends Model
{
    use HasFactory;

    protected $table = 'payroll_fixed_components';

    protected $fillable = [
        'nama',
        'jenis',
        'tipe',
        'jumlah',
        'keterangan',
        'valid_from',
        'valid_to',
    ];

    protected $casts = [
        'jumlah' => 'decimal:2',
        'valid_from' => 'datetime',
        'valid_to' => 'datetime',
    ];
}