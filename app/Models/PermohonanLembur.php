<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PermohonanLembur extends Model
{
    use HasFactory;

    protected $table = 'permohonan_lembur';
    protected $primaryKey = 'id_permohonan_lembur';

    protected $fillable = [
        'id_karyawan',
        'id_jadwal',
        'tanggal_permohonan',
        'jam_mulai_lembur',
        'jam_selesai_lembur',
        'durasi_lembur',
        'alasan_lembur',
        'status_pengajuan',
        'tanggal_pengajuan',
        'approved_by',
        'tanggal_approval',
        'catatan_approval',
        'lokasi_lembur',
        'latitude',
        'longitude',
        'catatan',
        'attachment_path',
        'attachment_type',
        'attachment_uploaded_at',
        'jenis_lembur',
        'shift_lembur',
    ];

    protected $casts = [
        'tanggal_permohonan' => 'date',
        'jam_mulai_lembur' => 'datetime:H:i:s',
        'jam_selesai_lembur' => 'datetime:H:i:s',
        'durasi_lembur' => 'decimal:2',
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
     * Calculate duration based on start and end times
     */
    public function calculateDuration()
    {
        if (!$this->jam_mulai_lembur || !$this->jam_selesai_lembur) {
            return 0;
        }

        $startTime = \Carbon\Carbon::parse($this->jam_mulai_lembur);
        $endTime = \Carbon\Carbon::parse($this->jam_selesai_lembur);
        
        // If end time is next day (for overnight shifts)
        if ($endTime->lt($startTime)) {
            $endTime->addDay();
        }

        return round($endTime->diffInMinutes($startTime) / 60, 2);
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
     * Get formatted jam mulai lembur
     */
    public function getFormattedJamMulaiLemburAttribute(): string
    {
        if (!$this->jam_mulai_lembur) {
            return '-';
        }
        
        try {
            $time = \Carbon\Carbon::parse($this->jam_mulai_lembur);
            return $time->format('H:i');
        } catch (\Exception $e) {
            return $this->jam_mulai_lembur;
        }
    }

    /**
     * Get formatted jam selesai lembur
     */
    public function getFormattedJamSelesaiLemburAttribute(): string
    {
        if (!$this->jam_selesai_lembur) {
            return '-';
        }
        
        try {
            $time = \Carbon\Carbon::parse($this->jam_selesai_lembur);
            return $time->format('H:i');
        } catch (\Exception $e) {
            return $this->jam_selesai_lembur;
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

    /**
     * Get jenis lembur text
     */
    public function getJenisLemburTextAttribute(): string
    {
        return match($this->jenis_lembur) {
            'hari_kerja' => 'Lembur Hari Kerja',
            'hari_libur' => 'Lembur Hari Libur',
            'akhir_pekan' => 'Lembur Akhir Pekan',
            default => $this->jenis_lembur ?: 'Tidak Ditentukan'
        };
    }

    /**
     * Get shift lembur text
     */
    public function getShiftLemburTextAttribute(): string
    {
        return match($this->shift_lembur) {
            'pagi' => 'Shift Pagi',
            'siang_kayu' => 'Shift Siang Kayu',
            'siang_besi' => 'Shift Siang Besi',
            'malam' => 'Shift Malam',
            default => $this->shift_lembur ?: 'Tidak Ditentukan'
        };
    }
}