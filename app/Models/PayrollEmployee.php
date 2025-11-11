<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollEmployee extends Model
{
    use HasFactory;

    protected $table = 'payroll_employees';

    protected $fillable = [
        'batch_id',
        'id_karyawan',
        'gaji_pokok',
        'tunjangan',
        'potongan',
        'upah_lembur',
        'total_gaji',
        'koreksi_gaji',
        'catatan_koreksi',
        'status',
        'attendance_summary'
    ];

    protected $casts = [
        'gaji_pokok' => 'decimal:2',
        'tunjangan' => 'decimal:2',
        'potongan' => 'decimal:2',
        'upah_lembur' => 'decimal:2',
        'total_gaji' => 'decimal:2',
        'koreksi_gaji' => 'decimal:2',
        'attendance_summary' => 'array'
    ];

    /**
     * Get the batch that this employee belongs to.
     */
    public function batch(): BelongsTo
    {
        return $this->belongsTo(PayrollBatch::class, 'batch_id');
    }

    /**
     * Get the employee details.
     */
    public function karyawan(): BelongsTo
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Get the user that this payroll employee belongs to.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_karyawan', 'id');
    }
}
