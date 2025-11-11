<?php

namespace App\Models\Keuangan;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User; // Assuming User model is in App\Models
use App\Models\SumberDana; // Corrected namespace
use App\Models\Keuangan\KeuanganPengeluaranHarian; // Corrected namespace

/**
 * Model for PembelianBahanBaku (Purchase Batch)
 */
class PembelianBahanBaku extends Model
{
    use HasFactory;

    protected $table = 'pembelian_bahan_baku';

    protected $fillable = [
        'nomor_batch',
        'waktu_batch', // Changed from tanggal_batch
        'status_batch',
        'metode_pembayaran',
        'status_pembayaran',
        'total_harga_batch',
        'catatan',
        'dibuat_oleh_id',
        'disetujui_oleh_id',
        'tanggal_disetujui',
        'sumber_dana_id',
    ];

    protected $casts = [
        'waktu_batch' => 'datetime', // Changed from tanggal_batch to waktu_batch and type to datetime
        'tanggal_disetujui' => 'datetime',
    ];

    /**
     * Get the user who created the purchase batch.
     */
    public function dibuatOleh()
    {
        return $this->belongsTo(User::class, 'dibuat_oleh_id');
    }

    /**
     * Get the user who approved the purchase batch.
     */
    public function disetujuiOleh()
    {
        return $this->belongsTo(User::class, 'disetujui_oleh_id');
    }

    /**
     * Get the sumber dana for the purchase batch.
     */
    public function sumberDana()
    {
        return $this->belongsTo(SumberDana::class, 'sumber_dana_id');
    }

    /**
     * Get the pembelian bahan baku items for the purchase batch.
     */
    public function items()
    {
        return $this->hasMany(PembelianBahanBakuItem::class, 'pembelian_bahan_baku_id');
    }

    /**
     * Get the pengeluaran harian associated with the purchase batch.
     */
    public function pengeluaranHarian()
    {
        return $this->hasOne(KeuanganPengeluaranHarian::class, 'pembelian_bahan_baku_id');
    }
}
