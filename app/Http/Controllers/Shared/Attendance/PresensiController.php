<?php

namespace App\Http\Controllers\Shared\Attendance;

use App\Models\Presensi;
use App\Models\JadwalKerja;
use App\Models\IdentitasKaryawan;
use App\Models\PermohonanIzin;
use App\Models\PermohonanLembur;
use App\Models\PengajuanIzin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Response;
use Inertia\Inertia;
use Exception;
use App\Http\Controllers\Controller;

class PresensiController extends Controller
{
    /**
     * Record attendance (check-in)
     */
    public function apiCheckIn(Request $request)
    {
        $request->validate([
            'id_jadwal' => 'required|exists:jadwal_kerja,id_jadwal',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'lokasi_presensi' => 'nullable|string|max:255'
        ]);

        // Get authenticated user's employee ID
        $user = Auth::user();
        if (!$user || !$user->id_karyawan) {
            return back()->with('flash', [
                'error' => 'User tidak terautentikasi atau tidak memiliki ID karyawan'
            ]);
        }

        $idKaryawan = $user->id_karyawan;

        try {
            DB::beginTransaction();

            $today = Carbon::today();
            $now = Carbon::now();

            // Check if there's existing presensi record for today
            $existingPresensi = Presensi::where('id_karyawan', $idKaryawan)
                ->whereDate('tanggal', $today)
                ->first();

            // If already checked in, don't allow duplicate
            if ($existingPresensi && $existingPresensi->jam_masuk_actual) {
                return back()->with('flash', [
                    'error' => 'Anda sudah melakukan check-in hari ini'
                ]);
            }

            // Get schedule
            $jadwal = JadwalKerja::find($request->id_jadwal);
            if (!$jadwal) {
                return back()->with('flash', [
                    'error' => 'Jadwal tidak ditemukan'
                ]);
            }

            // Verify schedule belongs to user
            if ($jadwal->id_karyawan != $idKaryawan) {
                return back()->with('flash', [
                    'error' => 'Jadwal tidak sesuai dengan karyawan'
                ]);
            }

            // Determine status (on time or late)
            $isLate = false;
            $lateMinutes = 0;
            if ($jadwal->jam_masuk) {
                $scheduledTime = Carbon::today()->setTimeFromTimeString($jadwal->jam_masuk);
                $tolerance = 15; // 15 minutes tolerance
                $isLate = $now->gt($scheduledTime->copy()->addMinutes($tolerance));
                if ($isLate) {
                    $lateMinutes = $now->diffInMinutes($scheduledTime);
                }
            }

            // Create or update attendance record
            if ($existingPresensi) {
                // Update existing record (might be from a pending request)
                $existingPresensi->update([
                    'id_jadwal' => $request->id_jadwal,
                    'jam_masuk_actual' => $now->format('H:i:s'),
                    'status_presensi' => $isLate ? 'terlambat' : 'hadir',
                    'lokasi_presensi' => $request->lokasi_presensi ?? 'Lokasi Kerja',
                    'latitude' => $request->latitude,
                    'longitude' => $request->longitude,
                    'catatan' => $isLate ? "Terlambat {$lateMinutes} menit" : 'Hadir tepat waktu',
                    'jenis_pengajuan' => 'normal',
                    'status_pengajuan' => 'approved'
                ]);
                $presensi = $existingPresensi;
            } else {
                // Create new attendance record
                $presensi = Presensi::create([
                    'id_karyawan' => $idKaryawan,
                    'id_jadwal' => $request->id_jadwal,
                    'tanggal' => $today,
                    'jam_masuk_actual' => $now->format('H:i:s'),
                    'status_presensi' => $isLate ? 'terlambat' : 'hadir',
                    'lokasi_presensi' => $request->lokasi_presensi ?? 'Lokasi Kerja',
                    'latitude' => $request->latitude,
                    'longitude' => $request->longitude,
                    'catatan' => $isLate ? "Terlambat {$lateMinutes} menit" : 'Hadir tepat waktu',
                    'jenis_pengajuan' => 'normal',
                    'status_pengajuan' => 'approved'
                ]);
            }

            // Update schedule status
            $jadwal->update([
                'status_kehadiran' => $isLate ? 'Terlambat' : 'Hadir'
            ]);

            DB::commit();

            // Log for debugging
            Log::info('✅ Attendance check-in successful', [
                'id_karyawan' => $idKaryawan,
                'id_jadwal' => $request->id_jadwal,
                'id_presensi' => $presensi->id_presensi,
                'status' => $presensi->status_presensi,
                'jam_masuk' => $presensi->jam_masuk_actual,
                'is_late' => $isLate
            ]);

            $statusText = $isLate ? 'Terlambat' : 'Hadir';
            $message = "Presensi berhasil dicatat! Status: {$statusText}, Waktu: {$presensi->jam_masuk_actual}";
            if ($isLate) {
                $message .= " (Terlambat {$lateMinutes} menit)";
            }

            // Return with flash message for Inertia
            return back()->with('flash', [
                'success' => $message
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('❌ Attendance check-in failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'id_karyawan' => $idKaryawan ?? 'unknown',
                'id_jadwal' => $request->id_jadwal
            ]);

            return back()->with('flash', [
                'error' => 'Gagal mencatat presensi: ' . $e->getMessage()
            ]);
        }
    }

    public function apiCheckOut(Request $request)
    {
        // ... existing checkOut method ...
    }

    public function getAttendanceData(Request $request)
    {
        try {
            $date = $request->get('date', Carbon::today()->format('Y-m-d'));
            $department = $request->get('department');
            $search = $request->get('search');

            // Query jadwal with presensi and user
            $query = JadwalKerja::with(['user.identitasKaryawan.rincianPekerjaan.departemen', 'presensi'])
                ->whereDate('tanggal', $date);

            if ($department && $department !== 'all') {
                $query->whereHas('user.identitasKaryawan.rincianPekerjaan.departemen', function ($q) use ($department) {
                    $q->where('nama_departemen', $department);
                });
            }

            if ($search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('id_karyawan', 'like', "%{$search}%");
                });
            }

            $jadwals = $query->get()->map(function ($jadwal) {
                $presensi = $jadwal->presensi;
                $karyawan = $jadwal->user;

                // Skip if no user data
                if (!$karyawan) {
                    return null;
                }

                // Calculate status based on actual data
                $status = $this->calculateAttendanceStatus($jadwal, $presensi);

                // Get department safely
                $department = '-';
                if (
                    $karyawan->identitasKaryawan &&
                    $karyawan->identitasKaryawan->rincianPekerjaan &&
                    $karyawan->identitasKaryawan->rincianPekerjaan->departemen
                ) {
                    $department = $karyawan->identitasKaryawan->rincianPekerjaan->departemen->nama_departemen;
                }

                return [
                    'id' => $jadwal->id_jadwal,
                    'employeeId' => $karyawan->id_karyawan ?? '-',
                    'employeeName' => $karyawan->name ?? 'Unknown',
                    'department' => $department,
                    'checkIn' => $presensi ? ($presensi->jam_masuk_actual ?? '-') : '-',
                    'checkOut' => $presensi ? ($presensi->jam_keluar_actual ?? '-') : '-',
                    'status' => $status,
                    'notes' => $this->getAttendanceNotes($jadwal, $presensi),
                ];
            })->filter()->values(); // Remove null values and re-index

            return response()->json([
                'success' => true,
                'data' => $jadwals
            ]);
        } catch (\Exception $e) {
            Log::error('getAttendanceData failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data presensi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the main request management page for HRD.
     */
    public function showHrdPengajuanPage()
    {
        $request = new Request(['status' => 'pending']);
        $initialRequests = $this->getRequests($request)->getData()->data;

        return Inertia::render('roles/manajer-hrd/absensi/pengajuan', [
            'initialRequests' => $initialRequests,
        ]);
    }

    /**
     * Show the main attendance monitoring page for HRD.
     */
    public function showHrdPresensiPage()
    {
        try {
            // Get today's attendance data
            $date = Carbon::today()->format('Y-m-d');
            $jadwals = JadwalKerja::with(['user.identitasKaryawan.rincianPekerjaan.departemen', 'presensi'])
                ->whereDate('tanggal', $date)
                ->get()
                ->map(function ($jadwal) {
                    $presensi = $jadwal->presensi;
                    $karyawan = $jadwal->user;

                    if (!$karyawan) {
                        return null;
                    }

                    $status = $this->calculateAttendanceStatus($jadwal, $presensi);

                    $department = '-';
                    if (
                        $karyawan->identitasKaryawan &&
                        $karyawan->identitasKaryawan->rincianPekerjaan &&
                        $karyawan->identitasKaryawan->rincianPekerjaan->departemen
                    ) {
                        $department = $karyawan->identitasKaryawan->rincianPekerjaan->departemen->nama_departemen;
                    }

                    return [
                        'id' => $jadwal->id_jadwal,
                        'employeeId' => $karyawan->id_karyawan ?? '-',
                        'employeeName' => $karyawan->name ?? 'Unknown',
                        'department' => $department,
                        'checkIn' => $presensi ? ($presensi->jam_masuk_actual ?? '-') : '-',
                        'checkOut' => $presensi ? ($presensi->jam_keluar_actual ?? '-') : '-',
                        'status' => $status,
                        'notes' => $this->getAttendanceNotes($jadwal, $presensi),
                    ];
                })->filter()->values();

            // Get departments
            $departments = \App\Models\Departemen::orderBy('nama_departemen')
                ->get()
                ->pluck('nama_departemen');
            return Inertia::render('roles/manajer-hrd/absensi/presensi', [
                'initialAttendanceData' => $jadwals->toArray(),
                'departments' => $departments,
            ]);
        } catch (\Exception $e) {
            Log::error('showHrdPresensiPage failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('roles/manajer-hrd/absensi/presensi', [
                'initialAttendanceData' => [],
                'departments' => [],
                'error' => 'Gagal memuat data presensi'
            ]);
        }
    }

    /**
     * Get employee schedule and attendance status
     */
    public function getEmployeeSchedule(Request $request)
    {
        $user = Auth::user();
        $idKaryawan = $request->get('id_karyawan', $user->id_karyawan ?? null);

        if (!$idKaryawan) {
            return response()->json(['success' => false, 'message' => 'ID karyawan tidak ditemukan'], 400);
        }

        $year = $request->get('year', Carbon::now()->year);
        $month = $request->get('month', Carbon::now()->month);
        $date = Carbon::createFromDate($year, $month, 1);

        $startOfMonth = $date->copy()->startOfMonth();
        $endOfMonth = $date->copy()->endOfMonth();

        // --- OPTIMIZATION: Eager load all necessary data ---
        $schedules = JadwalKerja::where('id_karyawan', $idKaryawan)
            ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->orderBy('tanggal')
            ->get();

        $attendances = Presensi::where('id_karyawan', $idKaryawan)
            ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->get()
            ->keyBy(fn($p) => $p->tanggal->format('Y-m-d')); // Key by date for O(1) lookup

        $mappedSchedules = $schedules->map(function ($jadwal) use ($attendances) {
            $attendance = $attendances->get($jadwal->tanggal->format('Y-m-d'));

            return [
                'id_jadwal' => $jadwal->id_jadwal,
                'tanggal' => $jadwal->tanggal->format('Y-m-d'),
                'jam_masuk' => $jadwal->jam_masuk
                    ? (is_string($jadwal->jam_masuk) ? $jadwal->jam_masuk : Carbon::parse($jadwal->jam_masuk)->format('H:i:s'))
                    : null,
                'jam_keluar' => $jadwal->jam_keluar
                    ? (is_string($jadwal->jam_keluar) ? $jadwal->jam_keluar : Carbon::parse($jadwal->jam_keluar)->format('H:i:s'))
                    : null,
                'shift' => $jadwal->shift,
                'status_kehadiran' => $jadwal->status_kehadiran,
                'catatan' => $jadwal->catatan,
                'attendance_status' => $attendance ? $attendance->status_presensi : 'belum_hadir',
                'actual_checkin' => $attendance ? ($attendance->jam_masuk_actual ? Carbon::parse($attendance->jam_masuk_actual)->format('H:i:s') : null) : null,
                'actual_checkout' => $attendance && $attendance->jam_keluar_actual ? Carbon::parse($attendance->jam_keluar_actual)->format('H:i:s') : null,
                'can_attend' => $jadwal->canAttend()
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $mappedSchedules
        ]);
    }

    /**
     * Get today's attendance status for current user
     */
    public function getTodayStatus()
    {
        $user = Auth::user();
        if (!$user || !$user->id_karyawan) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak terautentikasi atau tidak memiliki ID karyawan'
            ], 401);
        }

        $today = Carbon::today();
        $isNextSchedule = false;

        // Get today's schedule
        $jadwal = JadwalKerja::where('id_karyawan', $user->id_karyawan)
            ->whereDate('tanggal', $today)
            ->first();

        // If no schedule for today, find the next available one
        if (!$jadwal) {
            $jadwal = JadwalKerja::where('id_karyawan', $user->id_karyawan)
                ->where('tanggal', '>', $today)
                ->orderBy('tanggal', 'asc')
                ->first();
            if ($jadwal) {
                $isNextSchedule = true;
            }
        }

        // Get today's attendance only if the schedule is for today
        $presensi = null;
        if ($jadwal && !$isNextSchedule) {
            $presensi = Presensi::where('id_karyawan', $user->id_karyawan)
                ->whereDate('tanggal', $today)
                ->first();
        }

        $status = [
            'has_schedule' => $jadwal ? true : false,
            'can_checkin' => false,
            'can_checkout' => false,
            'has_checkedin' => false,
            'has_checkedout' => false,
            'schedule' => null,
            'attendance' => null
        ];

        if ($jadwal) {
            // Build complete schedule data
            $scheduleData = [
                'id_jadwal' => $jadwal->id_jadwal,
                'tanggal' => $jadwal->tanggal->format('Y-m-d'),
                'jam_masuk' => $jadwal->jam_masuk,
                'jam_keluar' => $jadwal->jam_keluar,
                'shift' => $jadwal->shift,
                'status_kehadiran' => $jadwal->status_kehadiran ?? 'belum_hadir',
                'is_next_schedule' => $isNextSchedule
            ];

            // Add attendance data if exists
            if ($presensi) {
                $scheduleData['actual_checkin'] = $presensi->jam_masuk_actual;
                $scheduleData['actual_checkout'] = $presensi->jam_keluar_actual;
                $scheduleData['attendance_status'] = $presensi->status_presensi;
            }

            $status['schedule'] = $scheduleData;

            if ($isNextSchedule) {
                // If it's a future schedule, user cannot check in or out
                $status['can_checkin'] = false;
                $status['can_checkout'] = false;
            } else if ($presensi) {
                // Logic for today's schedule with attendance
                $status['has_checkedin'] = $presensi->jam_masuk_actual ? true : false;
                $status['has_checkedout'] = $presensi->jam_keluar_actual ? true : false;
                $status['can_checkout'] = $presensi->jam_masuk_actual && !$presensi->jam_keluar_actual;

                $status['attendance'] = [
                    'jam_masuk_actual' => $presensi->jam_masuk_actual ? Carbon::parse($presensi->jam_masuk_actual)->format('H:i:s') : null,
                    'jam_keluar_actual' => $presensi->jam_keluar_actual ? Carbon::parse($presensi->jam_keluar_actual)->format('H:i:s') : null,
                    'status_presensi' => $presensi->status_presensi,
                    'jam_kerja' => $presensi->jam_kerja,
                    'catatan' => $presensi->catatan
                ];

                $status['checkin_time'] = $presensi->jam_masuk_actual ? Carbon::parse($presensi->jam_masuk_actual)->format('H:i:s') : null;
                $status['checkout_time'] = $presensi->jam_keluar_actual ? Carbon::parse($presensi->jam_keluar_actual)->format('H:i:s') : null;
                $status['attendance_status'] = $presensi->status_presensi;
            } else {
                // Logic for today's schedule without attendance
                $now = Carbon::now();
                $jamMasuk = Carbon::parse($jadwal->jam_masuk);
                $toleransiAwal = $jamMasuk->copy()->subHours(2);
                $toleransiAkhir = $jamMasuk->copy()->addHours(4);
                $status['can_checkin'] = $now->between($toleransiAwal, $toleransiAkhir);
                $status['attendance_status'] = 'belum_hadir';
            }
        }

        return response()->json([
            'success' => true,
            'data' => $status
        ]);
    }

    /**
     * Update jadwal_kerja status based on approved permission
     */
    private function updateJadwalStatusFromPermission($permission)
    {
        $jadwal = JadwalKerja::where('id_karyawan', $permission->id_karyawan)
            ->whereDate('tanggal', $permission->tanggal_permohonan)
            ->first();

        if ($jadwal) {
            $statusMap = [
                'izin_terlambat' => 'izin_terlambat',
                'izin_pulang_awal' => 'izin_pulang_awal',
                'izin_tidak_masuk' => 'izin',
            ];

            if (isset($statusMap[$permission->jenis_permohonan])) {
                $jadwal->update([
                    'status_kehadiran' => $statusMap[$permission->jenis_permohonan]
                ]);
            }
        }
    }

    /**
     * Calculate attendance status based on jadwal, presensi, and approved requests
     */
    private function calculateAttendanceStatus($jadwal, $presensi)
    {
        // If no presensi or no check-in
        if (!$presensi || !$presensi->jam_masuk_actual) {
            // Check for approved izin tidak masuk
            $izinTidakMasuk = PermohonanIzin::where('id_karyawan', $jadwal->id_karyawan)
                ->whereDate('tanggal_permohonan', $jadwal->tanggal)
                ->where('jenis_permohonan', 'izin_tidak_masuk')
                ->where('status_pengajuan', 'approved')
                ->exists();

            if ($izinTidakMasuk) return 'izin';

            // Check for approved cuti
            $cuti = PengajuanIzin::where('id_karyawan', $jadwal->id_karyawan)
                ->where('status', 'approved')
                ->whereDate('tanggal_mulai', '<=', $jadwal->tanggal)
                ->whereDate('tanggal_selesai', '>=', $jadwal->tanggal)
                ->exists();

            if ($cuti) return 'cuti';

            // Check status from jadwal
            if ($jadwal->status_kehadiran === 'libur') return 'libur';
            if ($jadwal->status_kehadiran === 'sakit') return 'sakit';
            if ($jadwal->status_kehadiran === 'izin') return 'izin';

            return 'alpha'; // Absent without permission
        }

        // Has presensi, check for lateness
        $terlambat = $this->calculateLateness($jadwal, $presensi);

        if ($terlambat > 0) {
            // Check for approved izin terlambat
            $izinTerlambat = PermohonanIzin::where('id_karyawan', $jadwal->id_karyawan)
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
     * Calculate lateness in minutes.
     * Returns 0 if not late or if data is invalid.
     */
    private function calculateLateness($jadwal, $presensi): int
    {
        if (!$jadwal->jam_masuk || !$presensi || !$presensi->jam_masuk_actual) {
            return 0;
        }

        $jamMasuk = Carbon::parse($jadwal->jam_masuk);
        $jamMasukActual = Carbon::parse($presensi->jam_masuk_actual);

        // Only calculate positive lateness (actual check-in after scheduled check-in)
        if ($jamMasukActual->greaterThan($jamMasuk)) {
            return $jamMasukActual->diffInMinutes($jamMasuk);
        }

        return 0;
    }

    /**
     * Get attendance notes with details
     */
    private function getAttendanceNotes($jadwal, $presensi)
    {
        $notes = [];

        // Check for approved izin
        $izin = PermohonanIzin::where('id_karyawan', $jadwal->id_karyawan)
            ->whereDate('tanggal_permohonan', $jadwal->tanggal)
            ->where('status_pengajuan', 'approved')
            ->first();

        if ($izin) {
            $jenisMap = [
                'izin_terlambat' => 'Izin Terlambat',
                'izin_pulang_awal' => 'Izin Pulang Awal',
                'izin_tidak_masuk' => 'Izin Tidak Masuk',
            ];
            $notes[] = ($jenisMap[$izin->jenis_permohonan] ?? 'Izin') . ': ' . $izin->alasan;
        }

        // Check for approved lembur
        $lembur = PermohonanLembur::where('id_karyawan', $jadwal->id_karyawan)
            ->whereDate('tanggal_permohonan', $jadwal->tanggal)
            ->where('status_pengajuan', 'approved')
            ->first();

        if ($lembur) {
            $notes[] = "Lembur: {$lembur->durasi_lembur} jam";
        }

        // Check for lateness
        if ($presensi && $presensi->jam_masuk_actual) {
            $jamMasuk = Carbon::parse($jadwal->jam_masuk);
            $jamMasukActual = Carbon::parse($presensi->jam_masuk_actual);
            $terlambat = $jamMasukActual->diffInMinutes($jamMasuk, false);

            if ($terlambat > 0) {
                $notes[] = "Terlambat: {$terlambat} menit";
            }
        }

        return implode(' | ', $notes) ?: '-';
    }

    /**
     * API: Get employee attendance recap (for daftar karyawan tab)
     * Used for daftar karyawan tab in presensi page
     */
    public function getKaryawanRekap(Request $request)
    {
        try {
            $department = $request->get('department');
            $search = $request->get('search');
            $startDate = Carbon::now()->startOfMonth();
            $endDate = Carbon::now()->endOfMonth();

            // Get all employees with their department, applying filters
            $karyawanQuery = IdentitasKaryawan::with(['rincianPekerjaan.departemen']);

            if ($search) {
                $karyawanQuery->where('nama_lengkap', 'like', '%' . $search . '%');
            }

            if ($department && $department !== 'all') {
                $karyawanQuery->whereHas('rincianPekerjaan.departemen', function ($q) use ($department) {
                    $q->where('nama_departemen', $department);
                });
            }

            $karyawan = $karyawanQuery->get()->keyBy('id_karyawan');
            $karyawanIds = $karyawan->keys();

            // Get all attendance stats for all filtered employees in one query
            $allStats = Presensi::whereIn('id_karyawan', $karyawanIds)
                ->whereBetween('tanggal', [$startDate, $endDate])
                ->select(
                    'id_karyawan',
                    DB::raw('SUM(CASE WHEN status_presensi = "hadir" THEN 1 ELSE 0 END) as hadir'),
                    DB::raw('SUM(CASE WHEN status_presensi = "terlambat" THEN 1 ELSE 0 END) as terlambat'),
                    DB::raw('SUM(CASE WHEN status_presensi = "alpha" THEN 1 ELSE 0 END) as alpha'),
                    DB::raw('SUM(CASE WHEN status_presensi = "izin" THEN 1 ELSE 0 END) as izin'),
                    DB::raw('SUM(CASE WHEN status_presensi = "sakit" THEN 1 ELSE 0 END) as sakit')
                )
                ->groupBy('id_karyawan')
                ->get()
                ->keyBy('id_karyawan');

            // Get all scheduled work days for all filtered employees in one query
            $allJadwal = JadwalKerja::whereIn('id_karyawan', $karyawanIds)
                ->whereBetween('tanggal', [$startDate, $endDate])
                ->where('status_kehadiran', '!=', 'Libur')
                ->select('id_karyawan', DB::raw('COUNT(*) as total_jadwal'))
                ->groupBy('id_karyawan')
                ->get()
                ->pluck('total_jadwal', 'id_karyawan');

            // Combine data in memory
            $rekapData = $karyawan->map(function ($k) use ($allStats, $allJadwal) {
                $stats = $allStats->get($k->id_karyawan);
                $totalJadwal = $allJadwal->get($k->id_karyawan, 0);

                $hadir = $stats->hadir ?? 0;
                $terlambat = $stats->terlambat ?? 0;
                $totalHadir = $hadir + $terlambat;
                $tingkatKehadiran = $totalJadwal > 0 ? round(($totalHadir / $totalJadwal) * 100, 2) : 0;

                return [
                    'id' => $k->id_karyawan,
                    'name' => $k->nama_lengkap,
                    'nik' => $k->nik_perusahaan ?? 'N/A',
                    'department' => $k->rincianPekerjaan->departemen->nama_departemen ?? 'N/A',
                    'hadir' => $hadir,
                    'terlambat' => $terlambat,
                    'alpha' => $stats->alpha ?? 0,
                    'izin' => $stats->izin ?? 0,
                    'sakit' => $stats->sakit ?? 0,
                    'attendance_rate' => $tingkatKehadiran,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $rekapData->values()
            ]);
        } catch (\Exception $e) {
            Log::error('getKaryawanRekap failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil rekap karyawan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * API: Get monthly attendance recap (for all employees)
     * Used for rekap tab in presensi page
     */
    public function getMonthlyRekap(Request $request)
    {
        try {
            $year = $request->get('year', Carbon::now()->year);
            $month = $request->get('month', Carbon::now()->month);
            
            $startDate = Carbon::create($year, $month, 1)->startOfMonth();
            $endDate = Carbon::create($year, $month, 1)->endOfMonth();

            // Get all jadwal in period with presensi
            $jadwals = JadwalKerja::whereBetween('tanggal', [$startDate, $endDate])
                ->with('presensi')
                ->get();

            $rekap = [
                'hadir' => 0,
                'terlambat' => 0,
                'izin' => 0,
                'sakit' => 0,
                'alpha' => 0,
            ];

            $daily = [];

            foreach ($jadwals as $jadwal) {
                $status = $this->calculateAttendanceStatus($jadwal, $jadwal->presensi);
                $dateStr = $jadwal->tanggal->format('Y-m-d');

                // Initialize daily data if not exists
                if (!isset($daily[$dateStr])) {
                    $daily[$dateStr] = [
                        'hadir' => 0,
                        'terlambat' => 0,
                        'izin' => 0,
                        'sakit' => 0,
                        'alpha' => 0,
                    ];
                }

                // Count by status
                switch ($status) {
                    case 'hadir':
                        $rekap['hadir']++;
                        $daily[$dateStr]['hadir']++;
                        break;
                    case 'terlambat':
                        $rekap['terlambat']++;
                        $daily[$dateStr]['terlambat']++;
                        break;
                    case 'sakit':
                        $rekap['sakit']++;
                        $daily[$dateStr]['sakit']++;
                        break;
                    case 'izin':
                    case 'cuti':
                        $rekap['izin']++;
                        $daily[$dateStr]['izin']++;
                        break;
                    case 'alpha':
                        $rekap['alpha']++;
                        $daily[$dateStr]['alpha']++;
                        break;
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'rekap' => $rekap,
                    'daily' => $daily,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('getMonthlyRekap failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil rekap bulanan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * API: Get attendance summary for a period
     * Used for rekap and payroll calculation
     */
    public function getAttendanceSummary(Request $request)
    {
        $idKaryawan = $request->get('id_karyawan');
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', Carbon::now()->endOfMonth()->format('Y-m-d'));

        if (!$idKaryawan) {
            return response()->json([
                'success' => false,
                'message' => 'ID Karyawan harus diisi'
            ], 400);
        }

        // Get all jadwal in period with presensi
        $jadwals = JadwalKerja::where('id_karyawan', $idKaryawan)
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
            $status = $this->calculateAttendanceStatus($jadwal, $jadwal->presensi);

            // Count by status
            switch ($status) {
                case 'hadir':
                    $summary['hari_hadir']++;
                    break;
                case 'terlambat':
                    $summary['hari_hadir']++; // Still counted as present
                    // Calculate lateness
                    $terlambat = $this->calculateLateness($jadwal, $jadwal->presensi);
                    $summary['total_menit_terlambat'] += $terlambat;
                    $summary['detail_keterlambatan'][] = [
                        'tanggal' => $jadwal->tanggal,
                        'menit' => $terlambat,
                        'ada_izin' => false,
                    ];
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

        // Get approved lembur
        $lemburApproved = PermohonanLembur::where('id_karyawan', $idKaryawan)
            ->where('status_pengajuan', 'approved')
            ->whereBetween('tanggal_permohonan', [$startDate, $endDate])
            ->get();

        foreach ($lemburApproved as $lembur) {
            $summary['total_jam_lembur'] += $lembur->durasi_lembur;
            $summary['detail_lembur'][] = [
                'tanggal' => $lembur->tanggal_permohonan,
                'jam' => $lembur->durasi_lembur,
                'id_permohonan' => $lembur->id_permohonan_lembur,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }


    /**
     * API: Update attendance record.
     * Allows HRD to manually adjust check-in/out times, status, and notes.
     */
    public function updateAttendance(Request $request)
    {
        $request->validate([
            'id_karyawan' => 'required|exists:users,id_karyawan',
            'tanggal' => 'required|date',
            'id_jadwal' => 'required|exists:jadwal_kerja,id_jadwal',
            'jam_masuk_actual' => 'nullable|date_format:H:i:s',
            'jam_keluar_actual' => 'nullable|date_format:H:i:s|after:jam_masuk_actual',
            'status_presensi' => 'required|in:hadir,terlambat,izin,sakit,alpha',
            'catatan' => 'nullable|string|max:255',
        ]);

        try {
            DB::beginTransaction();

            $presensi = Presensi::where('id_karyawan', $request->id_karyawan)
                ->whereDate('tanggal', $request->tanggal)
                ->first();

            $data = [
                'id_jadwal' => $request->id_jadwal,
                'jam_masuk_actual' => $request->jam_masuk_actual,
                'jam_keluar_actual' => $request->jam_keluar_actual,
                'status_presensi' => $request->status_presensi,
                'catatan' => $request->catatan,
                'jenis_pengajuan' => 'manual_hrd', // Indicate manual HRD adjustment
                'status_pengajuan' => 'approved', // Always approved for manual HRD
            ];

            if ($presensi) {
                $presensi->update($data);
            } else {
                // If no presensi record exists, create one
                $data['id_karyawan'] = $request->id_karyawan;
                $data['tanggal'] = $request->tanggal;
                Presensi::create($data);
            }

            // Update JadwalKerja status if status_presensi changes
            $jadwal = JadwalKerja::find($request->id_jadwal);
            if ($jadwal) {
                $jadwal->update(['status_kehadiran' => ucfirst($request->status_presensi)]);
            }

            DB::commit();

            return back()->with('flash', [
                'success' => 'Presensi berhasil diperbarui.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update attendance', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);

            return back()->with('flash', [
                'error' => 'Gagal memperbarui presensi: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Placeholder for fetching requests (e.g., leave, overtime).
     * To be implemented with actual logic later.
     */
    private function getRequests(Request $request)
    {
        // For now, return an empty collection to prevent errors.
        // Actual logic to fetch requests will be added here.
        return collect([]);
    }

    /**
     * Show the crew's schedule page.
     */
    public function showSchedulePage(Request $request): Response
    {
        $user = Auth::user();
        $idKaryawan = $user->id_karyawan ?? null;

        if (!$idKaryawan) {
            return Inertia::render('Error', [
                'status' => 403,
                'message' => 'ID Karyawan tidak ditemukan untuk pengguna ini.'
            ]);
        }

        return Inertia::render('roles.crew.schedule.index', [
            'initialEmployeeId' => $idKaryawan,
            'initialYear' => Carbon::now()->year,
            'initialMonth' => Carbon::now()->month,
            'todayStatus' => $this->getTodayStatus()->getData()->data, // Pass today's attendance status
        ]);
    }
}
