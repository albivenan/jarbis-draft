<?php

namespace App\Models\Keuangan;

use App\Models\User;
use App\Models\Keuangan\SumberDana;
use App\Models\Keuangan\KeuanganTransaksiPembeli;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KeuanganPemasukanHarian extends Model
{
    protected $table = 'keuangan_pemasukan_harian';

    protected $fillable = [
        'user_id',
        'sumber_dana_id', // Added
        'waktu',
        'description',
        'amount',
        'jenis_pemasukan',
        'catatan',
        'invoice_path',
        'status',
        'saldo_sebelum',
        'saldo_setelah',
        'keuangan_transaksi_pembeli_id', // Added for buyer relationship
    ];

    protected $casts = [
        'waktu' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sumberDana()
    {
        return $this->belongsTo(SumberDana::class, 'sumber_dana_id');
    }

    /**
     * Get the pembeli that owns the KeuanganPemasukanHarian
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function pembeli(): BelongsTo
    {
        return $this->belongsTo(KeuanganTransaksiPembeli::class, 'keuangan_transaksi_pembeli_id');
    }
}
