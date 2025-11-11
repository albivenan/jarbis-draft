<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    use HasFactory;

    protected $table = 'produk';
    protected $primaryKey = 'id_produk';

    public $timestamps = false;

    protected $fillable = [
        'nama_produk',
        'kode_produk',
        'deskripsi_produk',
        'harga_standar'
    ];

    protected $casts = [
        'harga_standar' => 'decimal:2'
    ];
}
