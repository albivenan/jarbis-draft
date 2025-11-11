<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BagianKerja extends Model
{
    use HasFactory;

    protected $table = 'bagian_kerja_karyawan';
    protected $primaryKey = 'id_bagian_kerja';
    public $timestamps = false;

    protected $fillable = [
        'nama_bagian_kerja',
        'id_departemen'
    ];

    // Relationships
    public function departemen()
    {
        return $this->belongsTo(Departemen::class, 'id_departemen', 'id_departemen');
    }

    public function rincianPekerjaan()
    {
        return $this->hasMany(RincianPekerjaan::class, 'id_bagian_kerja', 'id_bagian_kerja');
    }
}