<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\SumberDana; // Added

class PengeluaranHarian extends Model
{
    protected $table = 'pengeluaran_harian';

    protected $fillable = [
        'tanggal',
        'sumber_dana_id', // Added
        'deskripsi',
        'karyawan_id',
        'tujuan_biaya',
        'jenis_pengeluaran',
        'jumlah',
        'status',
        'approver_id',
        'lampiran_path',
        'pembelian_bahan_baku_id', // Added to fix bug
    ];

    public function karyawan()
    {
        return $this->belongsTo(User::class, 'karyawan_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    public function sumberDana()
    {
        return $this->belongsTo(SumberDana::class, 'sumber_dana_id');
    }
}
