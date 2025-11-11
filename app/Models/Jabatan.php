<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jabatan extends Model
{
    use HasFactory;

    protected $table = 'jabatan';
    protected $primaryKey = 'id_jabatan';
    public $timestamps = false;

    protected $fillable = [
        'nama_jabatan',
        'id_departemen',
        'pola_jadwal',
    ];

    protected $casts = [
        'pola_jadwal' => 'array',
    ];

    // Relationships
    public function departemen()
    {
        return $this->belongsTo(Departemen::class, 'id_departemen', 'id_departemen');
    }

    public function rincianPekerjaan()
    {
        return $this->hasMany(RincianPekerjaan::class, 'id_jabatan', 'id_jabatan');
    }

    public function bagianKerjaKaryawan()
    {
        return $this->hasMany(BagianKerjaKaryawan::class, 'id_departemen', 'id_departemen');
    }
}