<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfilPerusahaan extends Model
{
    use HasFactory;

    protected $table = 'profil_perusahaan';

    protected $fillable = [
        'nama_perusahaan',
        'alamat_perusahaan',
        'nomor_telepon',
        'email_perusahaan',
        'website',
        'npwp_perusahaan',
        'sejarah_singkat',
        'visi',
        'misi',
        'nilai_nilai',
        'sertifikasi',
        'nama_legal',
        'industri',
        'tahun_berdiri',
        'lisensi_bisnis',
        'media_sosial',
        'logo_url',
        'direktur',
        'komisaris',
    ];

    protected $casts = [
        'nilai_nilai' => 'array',
        'sertifikasi' => 'array',
        'media_sosial' => 'array',
        'direktur' => 'array',
        'komisaris' => 'array',
    ];
}
