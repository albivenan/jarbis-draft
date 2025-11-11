<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departemen extends Model
{
    use HasFactory;

    protected $table = 'departemen';
    protected $primaryKey = 'id_departemen';
    public $timestamps = false;

    protected $fillable = [
        'nama_departemen'
    ];

    // Relationships
    public function jabatan()
    {
        return $this->hasMany(Jabatan::class, 'id_departemen', 'id_departemen');
    }

    public function bagianKerja()
    {
        return $this->hasMany(BagianKerja::class, 'id_departemen', 'id_departemen');
    }

    public function rincianPekerjaan()
    {
        return $this->hasMany(RincianPekerjaan::class, 'id_departemen', 'id_departemen');
    }
}