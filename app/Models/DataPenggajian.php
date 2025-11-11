<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataPenggajian extends Model
{
    use HasFactory;

    protected $table = 'data_penggajian';
    protected $primaryKey = 'id_penggajian';
    public $timestamps = false;

    protected $fillable = [
        'id_karyawan',
        'nama_bank',
        'nomor_rekening',
        'nama_pemilik_rekening',
        'nomor_npwp',
        'nomor_bpjs_ketenagakerjaan',
        'nomor_bpjs_kesehatan'
    ];

    // Relationships
    public function identitasKaryawan()
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_karyawan', 'id_karyawan');
    }
}