<?php

namespace App\Models\Keuangan;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model for PembelianBahanBakuItem (Purchase Item)
 */
class PembelianBahanBakuItem extends Model
{
    use HasFactory;

    protected $table = 'pembelian_bahan_baku_item';

    protected $fillable = [
        'pembelian_bahan_baku_id',
        'bahan_baku_id',
        'nama_item',
        'jumlah',
        'satuan',
        'harga_satuan',
        'total_harga_item',
        'status_item',
        'catatan_item',
    ];

    /**
     * Get the pembelian bahan baku that owns the item.
     */
    public function pembelianBahanBaku()
    {
        return $this->belongsTo(PembelianBahanBaku::class, 'pembelian_bahan_baku_id');
    }

    /**
     * Get the bahan baku that owns the item.
     */
    public function bahanBaku()
    {
        return $this->belongsTo(BahanBaku::class, 'bahan_baku_id');
    }
}
