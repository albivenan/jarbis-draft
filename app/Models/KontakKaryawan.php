<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KontakKaryawan extends Model
{
    use HasFactory;

    protected $table = 'kontak_karyawan';
    protected $primaryKey = 'id_kontak';
    public $timestamps = false;

    protected $fillable = [
        'id_karyawan',
        'alamat_ktp',
        'alamat_domisili',
        'nomor_telepon',
        'email_pribadi',
        'email_perusahaan',
        'nama_kontak_darurat',
        'nomor_kontak_darurat',
        'nama_bank',
        'nomor_rekening',
        'nama_pemilik_rekening'
    ];

    // Relationships
    public function identitasKaryawan()
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_karyawan', 'id_karyawan');
    }
}