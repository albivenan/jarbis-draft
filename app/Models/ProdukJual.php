<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProdukJual extends Model
{
    use HasFactory;

    protected $table = 'produk_jual';
    protected $guarded = ['id'];

    protected $fillable = [
        'nama_produk',
        'deskripsi',
        'harga_usulan_ppic',
        'harga_disetujui_keuangan',
        'margin_keuangan',
        'harga_banding_marketing',
        'alasan_banding',
        'alasan_penolakan',
        'tenggat_barang_jadi_marketing',
        'tenggat_pengiriman_marketing',
        'tenggat_barang_jadi_ppic',
        'tenggat_pengiriman_ppic',
        'status_tenggat',
        'alasan_tenggat_ppic',
        'alasan_banding_tenggat',
        'tenggat_direspon_ppic_pada',
        'status',
        'diajukan_oleh_id',
        'disetujui_oleh_id',
        'diajukan_pada',
        'direspon_pada',
    ];

    protected $casts = [
        'diajukan_pada' => 'datetime',
        'direspon_pada' => 'datetime',
        'tenggat_direspon_ppic_pada' => 'datetime',
        'tenggat_barang_jadi_marketing' => 'date',
        'tenggat_pengiriman_marketing' => 'date',
        'tenggat_barang_jadi_ppic' => 'date',
        'tenggat_pengiriman_ppic' => 'date',
    ];

    public function diajukanOleh()
    {
        return $this->belongsTo(User::class, 'diajukan_oleh_id');
    }

    public function disetujuiOleh()
    {
        return $this->belongsTo(User::class, 'disetujui_oleh_id');
    }
}
