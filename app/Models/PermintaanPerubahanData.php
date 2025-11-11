<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PermintaanPerubahanData extends Model
{
    protected $table = 'permintaan_perubahan_data';

    protected $fillable = [
        'id_karyawan',
        'tipe_perubahan',
        'field_name',
        'nilai_lama',
        'nilai_baru',
        'status',
        'ditinjau_oleh',
        'ditinjau_pada',
        'catatan_hrd',
        'waktu_direspon',
    ];

    protected $casts = [
        'diajukan_pada' => 'datetime',
        'ditinjau_pada' => 'datetime',
        'waktu_direspon' => 'datetime',
    ];

    /**
     * Get the employee that owns the change request.
     */
    public function karyawan(): BelongsTo
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Get the user who reviewed the change request.
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ditinjau_oleh', 'id');
    }
}
