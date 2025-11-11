<?php

namespace App\Models\Keuangan;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KeuanganTransaksiPembeli extends Model
{
    use HasFactory;

    protected $table = 'keuangan_transaksi_pembeli';

    protected $fillable = [
        'nama_pembeli',
        'email_pembeli',
        'telepon_pembeli',
        'alamat_pembeli',
    ];

    /**
     * Get all of the pemasukanHarian for the KeuanganTransaksiPembeli
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function pemasukanHarian(): HasMany
    {
        return $this->hasMany(KeuanganPemasukanHarian::class, 'keuangan_transaksi_pembeli_id');
    }
}