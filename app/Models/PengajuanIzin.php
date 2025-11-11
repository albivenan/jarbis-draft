<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class PengajuanIzin extends Model
{
    use HasFactory;

    protected $table = 'pengajuan_izin';

    protected $fillable = [
        'id_karyawan',
        'jenis_pengajuan',
        'tanggal_mulai',
        'tanggal_selesai',
        'jumlah_hari',
        'alasan',
        'status',
        'file_dokumen',
        'approved_by',
        'approved_at',
        'catatan_penolakan',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'approved_at' => 'datetime',
    ];

    /**
     * Boot method untuk auto-calculate jumlah_hari
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if ($model->tanggal_mulai && $model->tanggal_selesai) {
                $model->jumlah_hari = Carbon::parse($model->tanggal_mulai)
                    ->diffInDays(Carbon::parse($model->tanggal_selesai)) + 1;
            }
        });

        static::updating(function ($model) {
            if ($model->isDirty(['tanggal_mulai', 'tanggal_selesai'])) {
                $model->jumlah_hari = Carbon::parse($model->tanggal_mulai)
                    ->diffInDays(Carbon::parse($model->tanggal_selesai)) + 1;
            }
        });
    }

    /**
     * Relationship dengan IdentitasKaryawan
     */
    public function karyawan()
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Relationship dengan User yang approve
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Scope untuk filter by status
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Scope untuk filter by jenis
     */
    public function scopeCuti($query)
    {
        return $query->where('jenis_pengajuan', 'cuti');
    }

    public function scopeSakit($query)
    {
        return $query->where('jenis_pengajuan', 'sakit');
    }

    public function scopeIzin($query)
    {
        return $query->where('jenis_pengajuan', 'izin');
    }

    /**
     * Check if can be edited
     */
    public function canBeEdited()
    {
        return $this->status === 'pending';
    }

    /**
     * Check if can be cancelled
     */
    public function canBeCancelled()
    {
        return $this->status === 'pending';
    }
}
