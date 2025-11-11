<?php

namespace App\Models\Keuangan;

use App\Models\User;
use App\Models\Keuangan\SumberDana;
use Illuminate\Database\Eloquent\Model;

class KeuanganPengeluaranHarian extends Model
{
    protected $table = 'keuangan_pengeluaran_harian';

    protected $fillable = [
        'user_id',
        'waktu',
        'description',
        'amount',
        'jenis_pengeluaran',
        'catatan',
        'invoice_path',
        'status',
        'sumber_dana_id',
        'saldo_sebelum',
        'saldo_setelah',
        'pembelian_bahan_baku_id', // Added as per user's request
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
}
