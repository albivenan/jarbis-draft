<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KpiResult extends Model
{
    use HasFactory;

    protected $table = 'kpi_results';

    protected $fillable = [
        'id_karyawan',
        'id_kpi',
        'periode',
        'hasil',
        'catatan',
    ];

    protected $casts = [
        'periode' => 'date',
    ];

    public function karyawan(): BelongsTo
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_karyawan', 'id_karyawan');
    }

    public function kpi(): BelongsTo
    {
        return $this->belongsTo(MasterKpi::class, 'id_kpi');
    }
}
