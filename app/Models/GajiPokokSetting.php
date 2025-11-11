<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GajiPokokSetting extends Model
{
    use HasFactory;

    protected $table = 'gaji_pokok_settings';

    protected $fillable = [
        'id_jabatan',
        'id_bagian_kerja',
        'senioritas',
        'tarif_per_jam',
        'valid_from',
        'valid_to',
    ];

    protected $casts = [
        'tarif_per_jam' => 'decimal:2',
        'valid_from' => 'datetime',
        'valid_to' => 'datetime',
    ];

    // Relationships (if any, based on migration)
    public function jabatan()
    {
        return $this->belongsTo(Jabatan::class, 'id_jabatan');
    }

    public function bagianKerja()
    {
        return $this->belongsTo(BagianKerja::class, 'id_bagian_kerja');
    }
}
