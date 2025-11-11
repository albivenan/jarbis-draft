<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class OvertimeRequest extends Model
{
    use HasFactory;

    protected $table = 'pengajuan_lembur';

    protected $fillable = [
        'id_karyawan',
        'id_jadwal',
        'tanggal_lembur',
        'jam_mulai',
        'jam_selesai',
        'durasi_jam',
        'alasan',
        'status',
        'requested_at',
        'approved_by',
        'approved_at',
        'notes',
        'approval_notes'
    ];

    protected $casts = [
        'tanggal_lembur' => 'date',
        'jam_mulai' => 'datetime:H:i',
        'jam_selesai' => 'datetime:H:i',
        'durasi_jam' => 'decimal:2',
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    /**
     * Relationship to IdentitasKaryawan
     */
    public function karyawan()
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Relationship to JadwalKerja
     */
    public function jadwal()
    {
        return $this->belongsTo(JadwalKerja::class, 'id_jadwal', 'id_jadwal');
    }

    /**
     * Relationship to approver (User)
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Scope: Only pending requests
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope: Only approved requests
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope: Only rejected requests
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Scope: For specific user
     */
    public function scopeForUser($query, $idKaryawan)
    {
        return $query->where('id_karyawan', $idKaryawan);
    }

    /**
     * Scope: Recent (within 7 days)
     */
    public function scopeRecent($query)
    {
        return $query->where('created_at', '>=', Carbon::now()->subDays(7));
    }

    /**
     * Auto-delete old records (older than 7 days)
     */
    public static function deleteOldRecords()
    {
        return static::where('created_at', '<', Carbon::now()->subDays(7))->delete();
    }

    /**
     * Check if can be cancelled
     */
    public function canBeCancelled()
    {
        return $this->status === 'pending';
    }

    /**
     * Calculate duration in hours
     */
    public function calculateDuration()
    {
        if ($this->jam_mulai && $this->jam_selesai) {
            $start = Carbon::parse($this->jam_mulai);
            $end = Carbon::parse($this->jam_selesai);
            
            // Handle overnight overtime
            if ($end->lt($start)) {
                $end->addDay();
            }
            
            return $end->diffInHours($start, true);
        }
        
        return 0;
    }

    /**
     * Approve the request
     */
    public function approve($approvedBy, $notes = null)
    {
        $this->update([
            'status' => 'approved',
            'approved_by' => $approvedBy,
            'approved_at' => now(),
            'notes' => $notes
        ]);
    }

    /**
     * Reject the request
     */
    public function reject($rejectedBy, $notes = null)
    {
        $this->update([
            'status' => 'rejected',
            'approved_by' => $rejectedBy,
            'approved_at' => now(),
            'notes' => $notes
        ]);
    }
}
