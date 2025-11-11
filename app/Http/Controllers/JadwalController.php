<?php

namespace App\Http\Controllers;

use App\Models\JadwalKerja;
use App\Models\IdentitasKaryawan;
use App\Models\Presensi;
use App\Models\Jabatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class JadwalController extends Controller
{
    /**
     * Get employee schedule data for crew pages
     */
    public function getEmployeeSchedule(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'year' => 'required|integer|min:2000|max:2050',
            'month' => 'required|integer|min:1|max:12',
        ]);

        $year = $request->input('year');
        $month = $request->input('month');

        $schedules = JadwalKerja::where('jadwal_kerja.id_karyawan', $user->id_karyawan)
            ->whereYear('jadwal_kerja.tanggal', $year)
            ->whereMonth('jadwal_kerja.tanggal', $month)
            ->leftJoin('presensi', function ($join) {
                $join->on('jadwal_kerja.id_jadwal', '=', 'presensi.id_jadwal')
                     ->on('jadwal_kerja.tanggal', '=', 'presensi.tanggal');
            })
            ->select(
                'jadwal_kerja.id_jadwal',
                'jadwal_kerja.tanggal',
                'jadwal_kerja.jam_masuk',
                'jadwal_kerja.jam_keluar',
                'jadwal_kerja.shift',
                'jadwal_kerja.status_kehadiran',
                'presensi.jam_masuk_actual',
                'presensi.jam_keluar_actual'
            )
            ->get()
            ->map(function ($schedule) {
                // Parse jam_masuk as time only (H:i:s format)
                $jamMasukTime = is_string($schedule->jam_masuk) 
                    ? $schedule->jam_masuk 
                    : Carbon::parse($schedule->jam_masuk)->format('H:i:s');
                
                $jamMasuk = Carbon::parse($jamMasukTime);
                $checkinWindowStart = $jamMasuk->copy()->subHours(2); // CHECKIN_TOLERANCE_HOURS

                return [
                    'id_jadwal' => $schedule->id_jadwal,
                    'tanggal' => $schedule->tanggal->format('Y-m-d'),
                    'jam_masuk' => $jamMasukTime,
                    'jam_keluar' => is_string($schedule->jam_keluar) 
                        ? $schedule->jam_keluar 
                        : Carbon::parse($schedule->jam_keluar)->format('H:i:s'),
                    'shift' => $schedule->shift,
                    'status_kehadiran' => $schedule->status_kehadiran,
                    'checkin_window_start' => $checkinWindowStart->format('H:i:s'),
                    'actual_checkin' => $schedule->jam_masuk_actual ? Carbon::parse($schedule->jam_masuk_actual)->format('H:i:s') : null,
                    'actual_checkout' => $schedule->jam_keluar_actual ? Carbon::parse($schedule->jam_keluar_actual)->format('H:i:s') : null,
                ];
            });

        return response()->json(['success' => true, 'data' => $schedules]);
    }

    /**
     * Check if employee can attend for a specific schedule
     */
    private function canAttend($jadwal, $attendance)
    {
        // ... existing code ...
    }

    /**
     * Get today's schedule for authenticated user
     */
    public function getTodaySchedule()
    {
        // ... existing code ...
    }

    /**
     * Save daily schedule for an employee
     */
    public function saveDailySchedule(Request $request)
    {
        $request->validate([
            'id_karyawan' => 'required|exists:identitas_karyawan,id_karyawan',
            'tanggal' => 'required|date',
            'jam_masuk' => 'nullable|date_format:H:i:s',
            'jam_keluar' => 'nullable|date_format:H:i:s|after_or_equal:jam_masuk',
            'shift' => 'nullable|string',
            'status_kehadiran' => 'required|string',
        ]);

        JadwalKerja::updateOrCreate(
            [
                'id_karyawan' => $request->id_karyawan,
                'tanggal' => $request->tanggal,
            ],
            [
                'jam_masuk' => $request->jam_masuk,
                'jam_keluar' => $request->jam_keluar,
                'shift' => $request->shift,
                'status_kehadiran' => $request->status_kehadiran,
            ]
        );

        return response()->json(['success' => true, 'message' => 'Jadwal berhasil disimpan.']);
    }

    /**
     * Save schedule pattern for a position
     */
    public function savePolaJadwal(Request $request)
    {
        try {
            $request->validate([
                'id_jabatan' => 'required|exists:jabatan,id_jabatan',
                'pola_jadwal' => 'required|array',
                'pola_jadwal.*.hari' => 'required|string',
                'pola_jadwal.*.jam_masuk' => 'nullable|date_format:H:i:s',
                'pola_jadwal.*.jam_keluar' => 'nullable|date_format:H:i:s|after:pola_jadwal.*.jam_masuk',
                'pola_jadwal.*.shift' => 'nullable|string|max:255',
                'pola_jadwal.*.status_kehadiran' => 'required|in:hadir,izin,sakit,cuti,libur,lepas',
                'pola_jadwal.*.catatan' => 'nullable|string',
            ]);

            $jabatan = Jabatan::find($request->id_jabatan);
            $jabatan->pola_jadwal = $request->pola_jadwal;
            $jabatan->save();

            return response()->json([
                'success' => true,
                'message' => 'Pola jadwal berhasil disimpan.',
                'data' => $jabatan->pola_jadwal
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan pola jadwal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get schedule pattern for a position
     */
    public function getPolaJadwal(Jabatan $jabatan)
    {
        return response()->json([
            'success' => true,
            'data' => $jabatan->pola_jadwal ?? []
        ], 200);
    }

    /**
     * Apply schedule pattern to employees
     */
    public function terapkanPolaJadwal(Request $request)
    {
        try {
            $request->validate([
                'id_jabatan' => 'required|exists:jabatan,id_jabatan',
                'id_karyawan' => 'required|array',
                'id_karyawan.*' => 'exists:identitas_karyawan,id_karyawan',
                'tanggal_mulai' => 'required|date',
                'tanggal_akhir' => 'required|date|after_or_equal:tanggal_mulai',
            ]);

            $jabatan = Jabatan::find($request->id_jabatan);
            $polaJadwal = $jabatan->pola_jadwal;

            if (empty($polaJadwal)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pola jadwal tidak ditemukan untuk jabatan ini.'
                ], 404);
            }

            $startDate = Carbon::parse($request->tanggal_mulai);
            $endDate = Carbon::parse($request->tanggal_akhir);

            foreach ($request->id_karyawan as $idKaryawan) {
                $currentDate = $startDate->copy();
                while ($currentDate->lte($endDate)) {
                    $dayOfWeek = strtolower($currentDate->format('l')); // Monday, Tuesday, etc.

                    foreach ($polaJadwal as $pola) {
                        if (strtolower($pola['hari']) === $dayOfWeek) {
                            JadwalKerja::updateOrCreate(
                                [
                                    'id_karyawan' => $idKaryawan,
                                    'tanggal' => $currentDate->format('Y-m-d'),
                                ],
                                [
                                    'jam_masuk' => $pola['jam_masuk'] ?? null,
                                    'jam_keluar' => $pola['jam_keluar'] ?? null,
                                    'shift' => $pola['shift'] ?? null,
                                    'status_kehadiran' => $pola['status_kehadiran'] ?? 'hadir',
                                    'catatan' => $pola['catatan'] ?? null,
                                ]
                            );
                            break; // Found pattern for the day, move to next day
                        }
                    }
                    $currentDate->addDay();
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Pola jadwal berhasil diterapkan ke karyawan.'
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menerapkan pola jadwal: ' . $e->getMessage()
            ], 500);
        }
    }
}