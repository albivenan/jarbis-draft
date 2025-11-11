<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\SumberDana; // Added

class PemasukanHarian extends Model
{
    protected $table = 'pemasukan_harian';

    protected $fillable = [
        'tanggal',
        'sumber_dana_id', // Changed
        'jumlah',
        'deskripsi', // Added
        'status',
    ];

    public function sumberDana()
    {
        return $this->belongsTo(SumberDana::class, 'sumber_dana_id');
    }
}
