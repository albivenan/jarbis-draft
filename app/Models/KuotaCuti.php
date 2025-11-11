<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KuotaCuti extends Model
{
    use HasFactory;

    protected $table = 'kuota_cuti';

    protected $fillable = [
        'id_karyawan',
        'tahun',
        'kuota_tahunan',
        'kuota_terpakai',
        'kuota_tersisa',
        'catatan',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'kuota_tahunan' => 'integer',
        'kuota_terpakai' => 'integer',
        'kuota_tersisa' => 'integer',
    ];

    /**
     * Relationship dengan IdentitasKaryawan
     */
    public function karyawan()
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Update kuota setelah pengajuan disetujui
     */
    public function kurangiKuota($jumlahHari)
    {
        $this->kuota_terpakai += $jumlahHari;
        $this->kuota_tersisa = $this->kuota_tahunan - $this->kuota_terpakai;
        $this->save();
    }

    /**
     * Kembalikan kuota jika pengajuan dibatalkan/ditolak
     */
    public function kembalikanKuota($jumlahHari)
    {
        $this->kuota_terpakai -= $jumlahHari;
        $this->kuota_tersisa = $this->kuota_tahunan - $this->kuota_terpakai;
        $this->save();
    }
}
