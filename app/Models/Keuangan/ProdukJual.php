<?php

namespace App\Models\Keuangan;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class ProdukJual extends Model
{
    use HasFactory;

    protected $table = 'produk_jual';

    protected $fillable = [
        'nama_produk',
        'deskripsi',
        'harga_usulan_ppic',
        'harga_disetujui_keuangan',
        'margin_keuangan',
        'status',
        'diajukan_oleh_id',
        'disetujui_oleh_id',
        'diajukan_pada',
        'direspon_pada',
    ];

    protected $casts = [
        'harga_usulan_ppic' => 'decimal:2',
        'harga_disetujui_keuangan' => 'decimal:2',
        'margin_keuangan' => 'decimal:2',
        'diajukan_pada' => 'datetime',
        'direspon_pada' => 'datetime',
    ];

    /**
     * Get the user who proposed the product price.
     */
    public function diajukanOleh()
    {
        return $this->belongsTo(User::class, 'diajukan_oleh_id');
    }

    /**
     * Get the user who approved/rejected the product price.
     */
    public function disetujuiOleh()
    {
        return $this->belongsTo(User::class, 'disetujui_oleh_id');
    }
}
