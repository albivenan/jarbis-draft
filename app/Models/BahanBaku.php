<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BahanBaku extends Model
{
    use HasFactory;

    protected $table = 'bahan_baku'; // Explicitly define table name
    protected $primaryKey = 'id'; // Assuming 'id' is the primary key

    protected $fillable = [
        'nama_bahan_baku',
        'deskripsi',
        'satuan_dasar',
        'harga_standar',
        'pemasok_id',
        'stok', // Added stok
        'kategori', // Added kategori
    ];

    protected $casts = [
        'harga_standar' => 'decimal:15,2',
        'stok' => 'integer', // Cast stok to integer
    ];

    // Define relationship to Pemasok
    public function pemasok()
    {
        return $this->belongsTo(Pemasok::class);
    }
}
