<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Employee;

class Education extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'riwayat_edukasi';

    protected $fillable = [
        'id_karyawan',
        'jenjang',
        'institusi',
        'jurusan',
        'kota',
        'negara',
        'tahun_mulai',
        'tahun_selesai',
        'ipk',
        'nomor_ijazah',
        'tanggal_ijazah',
        'file_ijazah',
        'is_lulus',
        'catatan'
    ];

    protected $casts = [
        'tahun_mulai' => 'integer',
        'tahun_selesai' => 'integer',
        'ipk' => 'decimal:2',
        'tanggal_ijazah' => 'date',
        'is_lulus' => 'boolean'
    ];

    // Relationships
    public function identitasKaryawan()
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_karyawan', 'id_karyawan');
    }
}
