<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class Presensi extends Model
{
    use HasFactory;

    protected $table = 'presensi';
    protected $primaryKey = 'id_presensi';

    protected $fillable = [
        'id_karyawan',
        'id_jadwal',
        'tanggal',
        'jam_masuk_actual',
        'jam_keluar_actual',
        'status_presensi',
        'jam_kerja',
        'jam_lembur',
        'catatan',
        'lokasi_presensi',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jam_masuk_actual' => 'datetime:H:i:s',
        'jam_keluar_actual' => 'datetime:H:i:s',
        'jam_kerja' => 'decimal:2',
        'jam_lembur' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    /**
     * Relationship with IdentitasKaryawan
     */
    public function identitasKaryawan(): BelongsTo
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
     * Relationship with Permission Request
     */
    public function permissionRequest(): BelongsTo
    {
        return $this->belongsTo(PermohonanIzin::class, 'id_permission_request', 'id_permohonan');
    }

    /**
     * Relationship with Overtime Request
     */
    public function overtimeRequest(): BelongsTo
    {
        return $this->belongsTo(PermohonanLembur::class, 'id_overtime_request', 'id_permohonan_lembur');
    }

    /**
     * Scope for today's attendance
     */
    public function scopeToday($query)
    {
        return $query->whereDate('tanggal', today());
    }

    /**
     * Scope for specific employee
     */
    public function scopeForEmployee($query, $employeeId)
    {
        return $query->where('id_karyawan', $employeeId);
    }

    /**
     * Get status badge color
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status_presensi) {
            'hadir' => 'green',
            'terlambat' => 'yellow',
            'alpha' => 'red',
            'izin' => 'blue',
            'sakit' => 'purple',
            'cuti' => 'indigo',
            default => 'gray'
        };
    }

    /**
     * Calculate work hours based on check-in and check-out times
     */
    public function calculateWorkHours()
    {
        if (!$this->jam_masuk_actual || !$this->jam_keluar_actual) {
            return 0;
        }

        $checkIn = \Carbon\Carbon::parse($this->jam_masuk_actual);
        $checkOut = \Carbon\Carbon::parse($this->jam_keluar_actual);
        
        // If check out is next day (for overnight shifts)
        if ($checkOut->lt($checkIn)) {
            $checkOut->addDay();
        }

        return round($checkOut->diffInMinutes($checkIn) / 60, 2);
    }

    /**
     * Check if employee can attend (check-in) based on schedule
     */
    public function canAttend(): bool
    {
        // Cannot attend if already checked in
        if ($this->jam_masuk_actual) {
            return false;
        }

        // Cannot attend if no schedule
        if (!$this->jadwal || !$this->jadwal->jam_masuk) {
            return false;
        }

        $now = \Carbon\Carbon::now();
        $jamMasuk = \Carbon\Carbon::today()->setTimeFromTimeString($this->jadwal->jam_masuk);
        $toleransiAwal = $jamMasuk->copy()->subHours(2);
        $toleransiAkhir = $jamMasuk->copy()->addHours(4);

        return $now->between($toleransiAwal, $toleransiAkhir);
    }

    /**
     * Check if employee can checkout based on check-in time
     */
    public function canCheckout(): bool
    {
        // Cannot checkout if not checked in
        if (!$this->jam_masuk_actual) {
            return false;
        }

        // Cannot checkout if already checked out
        if ($this->jam_keluar_actual) {
            return false;
        }

        $now = \Carbon\Carbon::now();
        $checkInTime = \Carbon\Carbon::parse($this->jam_masuk_actual);
        $minCheckoutTime = $checkInTime->copy()->addMinutes(15); // Minimal 15 minutes after check-in

        return $now->gte($minCheckoutTime);
    }

    /**
     * Get attendance data for HRD reporting.
     */
    public static function getAttendanceReport($date, $department = 'all', $search = null)
    {
        $query = DB::table('presensi')
            ->join('identitas_karyawan', 'presensi.id_karyawan', '=', 'identitas_karyawan.id_karyawan')
            ->leftJoin('rincian_pekerjaan', 'identitas_karyawan.id_karyawan', '=', 'rincian_pekerjaan.id_karyawan')
            ->leftJoin('departemen', 'rincian_pekerjaan.id_departemen', '=', 'departemen.id_departemen')
            ->leftJoin('jabatan', 'rincian_pekerjaan.id_jabatan', '=', 'jabatan.id_jabatan')
            ->whereDate('presensi.tanggal', $date)
            ->select(
                'presensi.id_presensi as id',
                'identitas_karyawan.nik_perusahaan as employeeId',
                'identitas_karyawan.nama_lengkap as employeeName',
                'departemen.nama_departemen as department',
                'jabatan.nama_jabatan as position',
                'presensi.tanggal as date',
                'presensi.jam_masuk_actual as checkIn',
                'presensi.jam_keluar_actual as checkOut',
                'presensi.jam_kerja as workHours',
                'presensi.status_presensi as status',
                'presensi.catatan as notes'
            );

        if ($department !== 'all') {
            $query->where('departemen.nama_departemen', $department);
        }

        if ($search) {
            $query->where('identitas_karyawan.nama_lengkap', 'like', '%' . $search . '%');
        }

        return $query->get()->map(function ($row) {
            // Format times after fetching
            $row->checkIn = $row->checkIn ? \Carbon\Carbon::parse($row->checkIn)->format('H:i') : '-';
            $row->checkOut = $row->checkOut ? \Carbon\Carbon::parse($row->checkOut)->format('H:i') : '-';
            return $row;
        });
    }

    /**
     * Get formatted check-in time
     */
    public function getFormattedCheckInAttribute(): string
    {
        if (!$this->jam_masuk_actual) {
            return '-';
        }
        
        try {
            $time = \Carbon\Carbon::parse($this->jam_masuk_actual);
            return $time->format('H:i');
        } catch (\Exception $e) {
            return $this->jam_masuk_actual;
        }
    }

    /**
     * Get formatted check-out time
     */
    public function getFormattedCheckOutAttribute(): string
    {
        if (!$this->jam_keluar_actual) {
            return '-';
        }
        
        try {
            $time = \Carbon\Carbon::parse($this->jam_keluar_actual);
            return $time->format('H:i');
        } catch (\Exception $e) {
            return $this->jam_keluar_actual;
        }
    }

    /**
     * Get formatted work hours
     */
    public function getFormattedWorkHoursAttribute(): string
    {
        if (!$this->jam_kerja) {
            return '0.00';
        }
        
        return number_format($this->jam_kerja, 2);
    }

    /**
     * Get formatted overtime hours
     */
    public function getFormattedOvertimeHoursAttribute(): string
    {
        if (!$this->jam_lembur) {
            return '0.00';
        }
        
        return number_format($this->jam_lembur, 2);
    }

    /**
     * Get formatted date
     */
    public function getFormattedDateAttribute(): string
    {
        if (!$this->tanggal) {
            return '-';
        }
        
        try {
            return $this->tanggal->format('d/m/Y');
        } catch (\Exception $e) {
            return $this->tanggal;
        }
    }

    /**
     * Get formatted day name
     */
    public function getFormattedDayAttribute(): string
    {
        if (!$this->tanggal) {
            return '-';
        }
        
        try {
            return $this->tanggal->format('l');
        } catch (\Exception $e) {
            return '-';
        }
    }

    /**
     * Get attendance status text
     */
    public function getStatusTextAttribute(): string
    {
        return match($this->status_presensi) {
            'hadir' => 'Hadir',
            'terlambat' => 'Terlambat',
            'alpha' => 'Alpha',
            'izin' => 'Izin',
            'sakit' => 'Sakit',
            'cuti' => 'Cuti',
            default => $this->status_presensi ?: 'Belum Hadir'
        };
    }

    /**
     * Check if attendance is incomplete (checked in but not checked out)
     */
    public function isIncomplete(): bool
    {
        return $this->jam_masuk_actual && !$this->jam_keluar_actual;
    }

    /**
     * Check if attendance is complete (both checked in and checked out)
     */
    public function isComplete(): bool
    {
        return $this->jam_masuk_actual && $this->jam_keluar_actual;
    }

    /**
     * Check if attendance is absent
     */
    public function isAbsent(): bool
    {
        return !$this->jam_masuk_actual && !$this->jam_keluar_actual;
    }

    /**
     * Get check-in time difference from scheduled time
     */
    public function getCheckInDifferenceAttribute(): ?string
    {
        if (!$this->jadwal || !$this->jadwal->jam_masuk || !$this->jam_masuk_actual) {
            return null;
        }

        try {
            $scheduledTime = \Carbon\Carbon::today()->setTimeFromTimeString($this->jadwal->jam_masuk);
            $actualTime = \Carbon\Carbon::parse($this->jam_masuk_actual);
            
            $difference = $actualTime->diffInMinutes($scheduledTime, false); // false = return negative if actual is later
            
            if ($difference == 0) {
                return 'Tepat Waktu';
            } elseif ($difference > 0) {
                return "Terlambat {$difference} menit";
            } else {
                return "Lebih Awal " . abs($difference) . " menit";
            }
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get check-out time difference from scheduled time
     */
    public function getCheckOutDifferenceAttribute(): ?string
    {
        if (!$this->jadwal || !$this->jadwal->jam_keluar || !$this->jam_keluar_actual) {
            return null;
        }

        try {
            $scheduledTime = \Carbon\Carbon::today()->setTimeFromTimeString($this->jadwal->jam_keluar);
            $actualTime = \Carbon\Carbon::parse($this->jam_keluar_actual);
            
            $difference = $actualTime->diffInMinutes($scheduledTime, false); // false = return negative if actual is later
            
            if ($difference == 0) {
                return 'Tepat Waktu';
            } elseif ($difference > 0) {
                return "Terlambat {$difference} menit";
            } else {
                return "Lebih Awal " . abs($difference) . " menit";
            }
        } catch (\Exception $e) {
            return null;
        }
    }
}