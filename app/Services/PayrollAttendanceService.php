<?php

namespace App\Services;

use App\Models\JadwalKerja;
use App\Models\PermohonanIzin;
use App\Models\PermohonanLembur;
use App\Models\PengajuanIzin;
use Carbon\Carbon;

/**
 * Service untuk menangani perhitungan attendance dan validasi penggajian
 */
class PayrollAttendanceService
{
    /**
     * Get enhanced attendance summary with lateness validation
     */
    public static function getEnhancedAttendanceSummary($idKaryawan, $startDate, $endDate)
    {
        // Get base summary from JadwalKerja model
        $summary = JadwalKerja::getAttendanceSummaryForEmployee($idKaryawan, $startDate, $endDate);
        
        // Enhance with lateness validation (check izin_terlambat)
        $totalMenitTerlambat = 0;
        $detailKeterlambatanEnhanced = [];
        
        foreach ($summary['detail_keterlambatan'] as $keterlambatan) {
            $tanggal = $keterlambatan['tanggal'];
            $menit = $keterlambatan['menit'];
            
            // Check if there's approved izin_terlambat for this date
            $izinTerlambat = PermohonanIzin::where('id_karyawan', $idKaryawan)
                ->whereDate('tanggal_permohonan', $tanggal)
                ->where('jenis_permohonan', 'izin_terlambat')
                ->where('status_pengajuan', 'approved')
                ->exists();
            
            if (!$izinTerlambat) {
                // Only count if no approved izin
                $totalMenitTerlambat += $menit;
                $detailKeterlambatanEnhanced[] = [
                    'tanggal' => $tanggal,
                    'menit' => $menit,
                    'ada_izin' => false,
                ];
            } else {
                $detailKeterlambatanEnhanced[] = [
                    'tanggal' => $tanggal,
                    'menit' => $menit,
                    'ada_izin' => true,
                ];
            }
        }
        
        // Override with enhanced data
        $summary['total_menit_terlambat'] = $totalMenitTerlambat;
        $summary['detail_keterlambatan'] = $detailKeterlambatanEnhanced;
        
        return $summary;
    }
    
    /**
     * Check if there are pending requests for an employee in a period
     */
    public static function getPendingRequests($idKaryawan, $startDate, $endDate)
    {
        $pendingIzin = PermohonanIzin::where('id_karyawan', $idKaryawan)
            ->where('status_pengajuan', 'pending')
            ->whereBetween('tanggal_permohonan', [$startDate, $endDate])
            ->count();

        $pendingLembur = PermohonanLembur::where('id_karyawan', $idKaryawan)
            ->where('status_pengajuan', 'pending')
            ->whereBetween('tanggal_permohonan', [$startDate, $endDate])
            ->count();

        $pendingCuti = PengajuanIzin::where('id_karyawan', $idKaryawan)
            ->where('status', 'pending')
            ->where(function($q) use ($startDate, $endDate) {
                $q->whereBetween('tanggal_mulai', [$startDate, $endDate])
                  ->orWhereBetween('tanggal_selesai', [$startDate, $endDate])
                  ->orWhere(function($q2) use ($startDate, $endDate) {
                      $q2->where('tanggal_mulai', '<=', $startDate)
                         ->where('tanggal_selesai', '>=', $endDate);
                  });
            })
            ->count();

        return [
            'pending_izin' => $pendingIzin,
            'pending_lembur' => $pendingLembur,
            'pending_cuti' => $pendingCuti,
            'total_pending' => $pendingIzin + $pendingLembur + $pendingCuti,
            'has_pending' => ($pendingIzin + $pendingLembur + $pendingCuti) > 0,
        ];
    }
    
    /**
     * Validate if payroll can be processed for a period
     */
    public static function validatePayrollPeriod($startDate, $endDate)
    {
        $errors = [];
        $warnings = [];
        
        // Get all active employees
        $employees = \App\Models\User::where('status', 'Aktif')
            ->whereHas('identitasKaryawan')
            ->get();
        
        foreach ($employees as $employee) {
            $pending = self::getPendingRequests($employee->id_karyawan, $startDate, $endDate);
            
            if ($pending['has_pending']) {
                $warnings[] = [
                    'employee' => $employee->name,
                    'nik' => $employee->id_karyawan,
                    'pending_izin' => $pending['pending_izin'],
                    'pending_lembur' => $pending['pending_lembur'],
                    'pending_cuti' => $pending['pending_cuti'],
                ];
            }
            
            // Check for anomalies
            $summary = self::getEnhancedAttendanceSummary($employee->id_karyawan, $startDate, $endDate);
            
            // Warning: Excessive overtime
            if ($summary['total_jam_lembur'] > 40) {
                $warnings[] = [
                    'employee' => $employee->name,
                    'nik' => $employee->id_karyawan,
                    'type' => 'excessive_overtime',
                    'message' => "Lembur {$summary['total_jam_lembur']} jam (melebihi 40 jam/bulan)",
                ];
            }
            
            // Warning: Excessive lateness
            if ($summary['total_menit_terlambat'] > 120) {
                $warnings[] = [
                    'employee' => $employee->name,
                    'nik' => $employee->id_karyawan,
                    'type' => 'excessive_lateness',
                    'message' => "Terlambat {$summary['total_menit_terlambat']} menit (melebihi 120 menit/bulan)",
                ];
            }
            
            // Warning: Excessive absence
            if ($summary['hari_alpa'] > 3) {
                $warnings[] = [
                    'employee' => $employee->name,
                    'nik' => $employee->id_karyawan,
                    'type' => 'excessive_absence',
                    'message' => "Alpa {$summary['hari_alpa']} hari (melebihi 3 hari/bulan)",
                ];
            }
        }
        
        return [
            'can_process' => count($errors) === 0,
            'errors' => $errors,
            'warnings' => $warnings,
            'total_warnings' => count($warnings),
        ];
    }
}
