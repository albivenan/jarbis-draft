<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DokumenKaryawan extends Model
{
    use HasFactory;

    protected $table = 'dokumen_karyawan';

    protected $fillable = [
        'id_karyawan',
        'nama_dokumen',
        'jenis_dokumen',
        'tanggal_unggah',
        'url',
    ];

    protected $casts = [
        'tanggal_unggah' => 'date',
    ];

    public function identitasKaryawan(): BelongsTo
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_karyawan', 'id_karyawan');
    }
}
