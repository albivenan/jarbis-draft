<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KontakDarurat extends Model
{
    use HasFactory;

    protected $table = 'kontak_darurat';

    protected $fillable = [
        'id_karyawan',
        'nama',
        'hubungan',
        'nomor_telepon',
    ];

    public function identitasKaryawan(): BelongsTo
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_karyawan', 'id_karyawan');
    }
}
