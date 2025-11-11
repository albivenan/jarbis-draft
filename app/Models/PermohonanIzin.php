<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PermohonanIzin extends Model
{
    use HasFactory;

    protected $table = 'permohonan_izin';
    protected $primaryKey = 'id_permohonan';

    protected $fillable = [
        'id_karyawan',
        'id_jadwal',
        'tanggal_permohonan',
        'jenis_permohonan',
        'waktu_pengajuan',
        'alasan',
        'status_pengajuan',
        'tanggal_pengajuan',
        'approved_by',
        'tanggal_approval',
        'catatan_approval',
        'alasan_pengajuan',
        'lokasi_pengajuan',
        'latitude',
        'longitude',
        'catatan',
        'attachment_path',
        'attachment_type',
        'attachment_uploaded_at',
    ];

    protected $casts = [
        'tanggal_permohonan' => 'date',
        'waktu_pengajuan' => 'datetime:H:i:s',
        'tanggal_pengajuan' => 'datetime',
        'tanggal_approval' => 'datetime',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'attachment_uploaded_at' => 'datetime',
    ];

    /**
     * Relationship with IdentitasKaryawan
     */
    public function karyawan(): BelongsTo
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Relationship with User (employee)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Relationship with JadwalKerja
     */
    public function jadwal(): BelongsTo
    {
        return $this->belongsTo(JadwalKerja::class, 'id_jadwal', 'id_jadwal');
    }

    /**
     * Relationship with User (approver)
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by', 'id');
    }

    /**
     * Scope for pending requests
     */
    public function scopePending($query)
    {
        return $query->where('status_pengajuan', 'pending');
    }

    /**
     * Check if request is pending
     */
    public function isPending(): bool
    {
        return $this->status_pengajuan === 'pending';
    }

    /**
     * Check if request is approved
     */
    public function isApproved(): bool
    {
        return $this->status_pengajuan === 'approved';
    }

    /**
     * Check if request is rejected
     */
    public function isRejected(): bool
    {
        return $this->status_pengajuan === 'rejected';
    }

    /**
     * Get request type text
     */
    public function getRequestTypeTextAttribute(): string
    {
        return match($this->jenis_permohonan) {
            'izin_terlambat' => 'Izin Terlambat',
            'izin_pulang_awal' => 'Izin Pulang Awal',
            'izin_tidak_masuk' => 'Izin Tidak Masuk',
            default => $this->jenis_permohonan
        };
    }

    /**
     * Get status badge color
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status_pengajuan) {
            'pending' => 'yellow',
            'approved' => 'green',
            'rejected' => 'red',
            default => 'gray'
        };
    }

    /**
     * Get formatted waktu pengajuan
     */
    public function getFormattedWaktuPengajuanAttribute(): string
    {
        if (!$this->waktu_pengajuan) {
            return '-';
        }
        
        try {
            $time = \Carbon\Carbon::parse($this->waktu_pengajuan);
            return $time->format('H:i');
        } catch (\Exception $e) {
            return $this->waktu_pengajuan;
        }
    }

    /**
     * Get formatted tanggal pengajuan
     */
    public function getFormattedTanggalPengajuanAttribute(): string
    {
        if (!$this->tanggal_pengajuan) {
            return '-';
        }
        
        try {
            $date = \Carbon\Carbon::parse($this->tanggal_pengajuan);
            return $date->format('d/m/Y H:i');
        } catch (\Exception $e) {
            return $this->tanggal_pengajuan;
        }
    }

    /**
     * Get formatted tanggal approval
     */
    public function getFormattedTanggalApprovalAttribute(): string
    {
        if (!$this->tanggal_approval) {
            return '-';
        }
        
        try {
            $date = \Carbon\Carbon::parse($this->tanggal_approval);
            return $date->format('d/m/Y H:i');
        } catch (\Exception $e) {
            return $this->tanggal_approval;
        }
    }

    /**
     * Check if has attachment
     */
    public function hasAttachment(): bool
    {
        return !empty($this->attachment_path);
    }

    /**
     * Get attachment URL
     */
    public function getAttachmentUrlAttribute(): string
    {
        if (!$this->attachment_path) {
            return '';
        }
        
        return asset('storage/' . $this->attachment_path);
    }
}