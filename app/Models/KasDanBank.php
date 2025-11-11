<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KasDanBank extends Model
{
    protected $table = 'kas_dan_bank';

    protected $fillable = [
        'nama_akun',
        'jenis_akun',
        'nomor_rekening',
        'nama_bank',
        'saldo',
    ];
}
