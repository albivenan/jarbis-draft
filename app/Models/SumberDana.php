<?php

namespace App\Models;

use App\Models\Keuangan\KeuanganPemasukanHarian;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SumberDana extends Model
{
    use HasFactory;

    protected $table = 'sumber_dana'; // Assuming table name is 'sumber_dana'

    protected $fillable = [
        'nama_sumber',
        'deskripsi',
        'saldo', // Added saldo to fillable
        'tipe_sumber',
        'nomor_rekening',
        'nama_bank',
        'nama_pemilik_rekening',
        'is_main_account',
    ];

    /**
     * Get all of the pemasukanHarian for the SumberDana
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function pemasukanHarian(): HasMany
    {
        return $this->hasMany(KeuanganPemasukanHarian::class, 'sumber_dana_id');
    }
}
