<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RincianPekerjaan extends Model
{
    use HasFactory;

    protected $table = 'rincian_pekerjaan';
    protected $primaryKey = 'id_rincian_pekerjaan';
    public $timestamps = false;

    protected $fillable = [
        'id_karyawan',
        'tanggal_bergabung',
        'status_karyawan',
        'id_jabatan',
        'id_departemen',
        'id_bagian_kerja',
        'lokasi_kerja',
        'id_atasan_langsung',
        'termination_date'
    ];

    protected $casts = [
        'tanggal_bergabung' => 'date',
        'termination_date' => 'date',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'id_karyawan', 'id_karyawan');
    }

    public function identitasKaryawan()
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_karyawan', 'id_karyawan');
    }

    public function jabatan()
    {
        return $this->belongsTo(Jabatan::class, 'id_jabatan', 'id_jabatan');
    }

    public function departemen()
    {
        return $this->belongsTo(Departemen::class, 'id_departemen', 'id_departemen');
    }

    public function bagianKerja()
    {
        return $this->belongsTo(BagianKerja::class, 'id_bagian_kerja', 'id_bagian_kerja');
    }

    public function atasanLangsung()
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_atasan_langsung', 'id_karyawan');
    }
}