<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InformasiPelanggan extends Model
{
    use HasFactory;

    protected $table = 'informasi_pelanggan';

    protected $fillable = [
        'nama_perusahaan',
        'jenis_pelanggan',
        'npwp',
        'batas_kredit',
        'term_pembayaran',
        'sales_rep_id',
        'status',
        'alamat_utama_jalan',
        'alamat_utama_kota',
        'alamat_utama_provinsi',
        'kode_pos_utama',
        'telepon_utama',
        'email_utama',
        'kontak_person_nama',
        'kontak_person_jabatan',
        'kontak_person_hp',
        'catatan',
        'tingkat_harga_nama',
        'tingkat_harga_diskon',
        'daftar_alamat_pengiriman',
        'user_id',
    ];

    protected $casts = [
        'daftar_alamat_pengiriman' => 'array', // Cast JSON column to array
        'tingkat_harga_diskon' => 'decimal:2',
        'batas_kredit' => 'decimal:2',
        'status' => 'string',
    ];

    /**
     * Get the user (sales representative) that owns the InformasiPelanggan.
     */
    public function salesRep(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sales_rep_id');
    }

    /**
     * Get the user account associated with the customer (if they can log in).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
