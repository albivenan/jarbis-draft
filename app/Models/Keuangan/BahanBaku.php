<?php

namespace App\Models\Keuangan;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model for BahanBaku (Raw Material)
 */
class BahanBaku extends Model
{
    use HasFactory;

    protected $table = 'bahan_baku';

    protected $fillable = [
        'nama_bahan_baku',
        'deskripsi',
        'satuan_dasar',
        'harga_standar',
        'pemasok_id',
    ];

    /**
     * Get the pemasok that owns the bahan baku.
     */
    public function pemasok()
    {
        return $this->belongsTo(Pemasok::class, 'pemasok_id');
    }

    /**
     * Get the pembelian bahan baku items for the bahan baku.
     */
    public function pembelianBahanBakuItems()
    {
        return $this->hasMany(PembelianBahanBakuItem::class, 'bahan_baku_id');
    }
}