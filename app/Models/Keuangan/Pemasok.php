<?php

namespace App\Models\Keuangan;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model for Pemasok (Supplier)
 */
class Pemasok extends Model
{
    use HasFactory;

    protected $table = 'pemasok';

    protected $fillable = [
        'nama_pemasok',
        'alamat',
        'telepon',
        'email',
    ];

    /**
     * Get the bahan baku for the pemasok.
     */
    public function bahanBaku()
    {
        return $this->hasMany(BahanBaku::class, 'pemasok_id');
    }
}