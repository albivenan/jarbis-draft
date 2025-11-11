<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Log;

class JadwalKerja extends Model
{
    use HasFactory;

    protected $table = 'jadwal_kerja';
    protected $primaryKey = 'id_jadwal';
    public $timestamps = true;

    protected $fillable = [
        'id_karyawan',
        'tanggal',
        'jam_masuk',
        'jam_keluar',
        'waktu_lembur',
        'shift',
        'status_kehadiran',
        'catatan',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jam_masuk' => 'datetime',
        'jam_keluar' => 'datetime',
        'waktu_lembur' => 'datetime:H:i:s',
    ];

    /**
     * Get the employee that owns the schedule.
     */
    public function karyawan(): BelongsTo
    {
        return $this->belongsTo(IdentitasKaryawan::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Get the user that owns the schedule.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Get the attendance record for this schedule.
     */
    public function presensi(): HasOne
    {
        return $this->hasOne(Presensi::class, 'id_jadwal', 'id_jadwal');
    }

    /**
     * Get permission requests for this schedule.
     */
    public function permissionRequests()
    {
        return $this->hasMany(PermohonanIzin::class, 'id_jadwal', 'id_jadwal');
    }

    /**
     * Get overtime requests for this schedule.
     */
    public function overtimeRequests()
    {
        return $this->hasMany(PermohonanLembur::class, 'id_jadwal', 'id_jadwal');
    }

    /**
     * Get today's attendance for this schedule.
     */
    public function todayAttendance()
    {
        return $this->presensi()->whereDate('tanggal', today())->first();
    }

    /**
     * Check if attendance can be recorded for this schedule.
     */
        public function canAttend(): bool
        {
            // Can only attend on the scheduled date
            if (!$this->tanggal->isToday()) {
                return false;
            }
    
            // Check if already attended
            if ($this->todayAttendance()) {
                return false;
            }
    
            // Can attend from 2 hours before to 4 hours after scheduled time
            $now = now();
            $jamMasuk = $this->tanggal->copy()->setTimeFromTimeString($this->jam_masuk);
            $toleransiAwal = $jamMasuk->copy()->subHours(2);
            $toleransiAkhir = $jamMasuk->copy()->addHours(4);
    
            return $now->between($toleransiAwal, $toleransiAkhir);
        }
    
        /**
         * Get attendance summary for a specific employee and period.
         * This is the single source of truth for attendance calculation.
         */
        public static function getAttendanceSummaryForEmployee($idKaryawan, $startDate, $endDate)
        {
            $jadwals = self::where('id_karyawan', $idKaryawan)
                ->whereBetween('tanggal', [$startDate, $endDate])
                ->with('presensi')
                ->get();
    
            $summary = [
                'hari_hadir' => 0,
                'hari_sakit' => 0,
                'hari_izin' => 0,
                'hari_alpa' => 0,
                'hari_cuti' => 0,
                'hari_libur' => 0,
                'total_menit_terlambat' => 0,
                'total_jam_lembur' => 0,
                'detail_keterlambatan' => [],
                'detail_lembur' => [],
            ];
    
            foreach ($jadwals as $jadwal) {
                $status = self::calculateAttendanceStatus($jadwal, $jadwal->presensi);
    
                switch ($status) {
                    case 'hadir':
                        $summary['hari_hadir']++;
                        break;
                    case 'terlambat':
                        $summary['hari_hadir']++; // Still counted as present
                        $terlambat = self::calculateLateness($jadwal, $jadwal->presensi);
                        if ($terlambat > 0) {
                            $summary['detail_keterlambatan'][] = [
                                'tanggal' => $jadwal->tanggal->format('Y-m-d'),
                                'menit' => $terlambat,
                            ];
                        }
                        break;
                    case 'sakit':
                        $summary['hari_sakit']++;
                        break;
                    case 'izin':
                        $summary['hari_izin']++;
                        break;
                    case 'cuti':
                        $summary['hari_cuti']++;
                        break;
                    case 'alpha':
                        $summary['hari_alpa']++;
                        break;
                    case 'libur':
                        $summary['hari_libur']++;
                        break;
                }
            }
    
            // Get approved overtime
            $lemburApproved = \App\Models\PermohonanLembur::where('id_karyawan', $idKaryawan)
                ->where('status_pengajuan', 'approved')
                ->whereBetween('tanggal_permohonan', [$startDate, $endDate])
                ->get();
    
            foreach ($lemburApproved as $lembur) {
                $summary['total_jam_lembur'] += $lembur->durasi_lembur;
                $summary['detail_lembur'][] = [
                    'tanggal' => $lembur->tanggal_permohonan->format('Y-m-d'),
                    'jam' => $lembur->durasi_lembur,
                    'id_permohonan' => $lembur->id_permohonan_lembur,
                ];
            }
    
            return $summary;
        }
    
        /**
         * PRIVATE HELPER: Calculate attendance status based on schedule and attendance record.
         */
        private static function calculateAttendanceStatus($jadwal, $presensi)
        {
            if (!$presensi || !$presensi->jam_masuk_actual) {
                $izinTidakMasuk = \App\Models\PermohonanIzin::where('id_karyawan', $jadwal->id_karyawan)
                    ->whereDate('tanggal_permohonan', $jadwal->tanggal)
                    ->where('jenis_permohonan', 'izin_tidak_masuk')
                    ->where('status_pengajuan', 'approved')
                    ->exists();
                if ($izinTidakMasuk) return 'izin';
    
                $cuti = \App\Models\PengajuanIzin::where('id_karyawan', $jadwal->id_karyawan)
                    ->where('status', 'approved')
                    ->whereDate('tanggal_mulai', '<=', $jadwal->tanggal)
                    ->whereDate('tanggal_selesai', '>=', $jadwal->tanggal)
                    ->exists();
                if ($cuti) return 'cuti';
    
                if (in_array($jadwal->status_kehadiran, ['Libur', 'libur'])) return 'libur';
                if (in_array($jadwal->status_kehadiran, ['Sakit', 'sakit'])) return 'sakit';
                if (in_array($jadwal->status_kehadiran, ['Izin', 'izin'])) return 'izin';
                
                // If it's a past date and no record, it's alpha
                if ($jadwal->tanggal->isPast() && !$jadwal->tanggal->isToday()) return 'alpha';
    
                return 'belum_hadir';
            }
    
            $jamMasukSeharusnya = \Carbon\Carbon::parse($jadwal->jam_masuk);
            $jamMasukActual = \Carbon\Carbon::parse($presensi->jam_masuk_actual);
            
            // Check for lateness only if jam_masuk is defined
            if ($jamMasukSeharusnya && $jamMasukActual->isAfter($jamMasukSeharusnya)) {
                $izinTerlambat = \App\Models\PermohonanIzin::where('id_karyawan', $jadwal->id_karyawan)
                    ->whereDate('tanggal_permohonan', $jadwal->tanggal)
                    ->where('jenis_permohonan', 'izin_terlambat')
                    ->where('status_pengajuan', 'approved')
                    ->exists();
    
                if (!$izinTerlambat) {
                    return 'terlambat';
                }
            }
    
            return 'hadir';
        }

        /**
         * PRIVATE HELPER: Calculate lateness in minutes.
         * Moved from PresensiController to JadwalKerja model.
         */
        private static function calculateLateness($jadwal, $presensi)
        {
            if (!$presensi || !$presensi->jam_masuk_actual) {
                return 0;
            }

            $jamMasuk = \Carbon\Carbon::parse($jadwal->jam_masuk);
            $jamMasukActual = \Carbon\Carbon::parse($presensi->jam_masuk_actual);
            $terlambat = $jamMasukActual->diffInMinutes($jamMasuk, false);

            return max(0, $terlambat);
        }
}