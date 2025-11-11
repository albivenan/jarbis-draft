<?php

namespace App\Models\Keuangan;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Keuangan\KeuanganPemasukanHarian; // Import the correct model
use App\Models\Keuangan\KeuanganPengeluaranHarian; // Import the correct model

class SumberDana extends Model
{
    use HasFactory;

    protected $table = 'sumber_dana';

    protected $fillable = [
        'nama_sumber',
        'tipe_sumber',
        'nomor_rekening',
        'nama_bank',
        'nama_pemilik_rekening',
        'saldo',
        'is_main_account', // Added
    ];

    protected $casts = [
        'saldo' => 'decimal:2',
        'updated_at' => 'datetime',
    ];

    public function pemasukan()
    {
        return $this->hasMany(KeuanganPemasukanHarian::class, 'sumber_dana_id');
    }

    public function pengeluaran()
    {
        return $this->hasMany(KeuanganPengeluaranHarian::class, 'sumber_dana_id');
    }
}