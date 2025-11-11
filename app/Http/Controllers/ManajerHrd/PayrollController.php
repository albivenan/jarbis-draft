<?php

namespace App\Http\Controllers\ManajerHrd;

use App\Models\PayrollBatch;
use App\Models\PayrollEmployee;
use App\Models\IdentitasKaryawan;
use App\Models\JadwalKerja;
use App\Models\PermohonanIzin;
use App\Models\PermohonanLembur;
use App\Models\PengajuanIzin;
use App\Models\GajiPokokSetting;
use App\Services\PayrollAttendanceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class PayrollController extends Controller
{
    /**
     * Show payroll processing page
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['manajer_hrd', 'staf_hrd'])) {
            abort(403, 'Unauthorized access');
        }

        // --- Get Payroll Status (Logic moved from getPayrollStatus) ---
        $currentSettings = $this->getPayrollSettingsForDate(Carbon::now());
        $today = Carbon::now();
        $openPeriods = [];
        $periodePembayaran = $currentSettings->get('periode_pembayaran', 'bulanan');

        if ($periodePembayaran === 'bulanan') {
            // Check current and 2 previous months
            for ($i = 0; $i <= 2; $i++) {
                $periodDate = $today->copy()->subMonthsNoOverflow($i);
                $periodIdentifier = $periodDate->format('Y-m');

                // Get settings valid for this specific period
                $periodSettings = $this->getPayrollSettingsForDate($periodDate);
                $paydayDate = (int)$periodSettings->get('tanggal_gajian', 25);

                // Determine if this period is open based on its own settings
                $paydayCarbon = Carbon::create($periodDate->year, $periodDate->month, $paydayDate);
                if ($today->day > $paydayDate && $periodDate->month === $today->month) {
                    // If current month and payday passed, consider it for next month's processing window
                    // But for historical check, we check if it was processed for its own month
                }

                if (!PayrollBatch::where('period', $periodIdentifier)->where('period_type', 'bulanan')->exists()) {
                    $openPeriods[] = [
                        'value' => $periodIdentifier,
                        'label' => $periodDate->isoFormat('MMMM YYYY') . ($i > 0 ? ' (Terlewat)' : ''),
                        'is_missed' => $i > 0,
                    ];
                }
            }
        } else { // Weekly logic
            // Assume week starts on Monday for now, can be made configurable
            $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);

            // Check current week and a few previous weeks (e.g., 4 weeks)
            for ($i = 0; $i <= 4; $i++) {
                $periodStart = $startOfWeek->copy()->subWeeks($i);
                $periodEnd = $periodStart->copy()->endOfWeek(Carbon::SUNDAY); // Assuming week ends on Sunday

                $periodIdentifier = $periodStart->format('Y-m-d') . ' to ' . $periodEnd->format('Y-m-d');
                $periodLabel = $periodStart->isoFormat('D MMM') . ' - ' . $periodEnd->isoFormat('D MMM YYYY');

                if (!PayrollBatch::where('period', $periodIdentifier)->where('period_type', 'mingguan')->exists()) {
                    $openPeriods[] = [
                        'value' => $periodIdentifier,
                        'label' => $periodLabel . ($i > 0 ? ' (Terlewat)' : ''),
                        'is_missed' => $i > 0,
                    ];
                }
            }
        }

        $payrollStatus = [
            'is_window_open' => count($openPeriods) > 0,
            'message' => count($openPeriods) > 0 ? "Terdapat periode penggajian yang siap diproses." : "Semua periode penggajian telah diproses.",
            'open_periods' => array_reverse($openPeriods), // Show oldest first
            'periode_pembayaran' => $periodePembayaran,
        ];

        // --- Get Employees (if period is selected) ---
        $employees = [];
        if ($request->has('period')) {
            $period = trim($request->get('period'));
            Log::debug('PayrollController@index: Received period', ['period' => $period]);
            
            // Support both Y-m and Y-m-d format
            if (strlen($period) === 10) {
                $period = substr($period, 0, 7);
            }

            // Validate and parse period
            if (preg_match('/^\d{4}-\d{2}$/', $period)) {
                try {
                    $startDate = Carbon::createFromFormat('Y-m', $period)->startOfMonth();
                    $endDate = Carbon::createFromFormat('Y-m', $period)->endOfMonth();
                    Log::debug('PayrollController@index: Period date range', ['startDate' => $startDate->toDateString(), 'endDate' => $endDate->toDateString()]);

                    // Get employee IDs that are already in submitted batches for this period
                    $submittedEmployeeIds = PayrollEmployee::whereHas('batch', function ($q) use ($period) {
                        $q->where('period', $period)->where('status', 'submitted');
                    })->pluck('id_karyawan')->toArray();
                    Log::debug('PayrollController@index: submittedEmployeeIds for ' . $period, $submittedEmployeeIds);

                    // Eager load necessary relationships for payroll calculation
                    $query = \App\Models\User::with([
                        'identitasKaryawan.rincianPekerjaan.departemen',
                        'identitasKaryawan.rincianPekerjaan.jabatan',
                        'identitasKaryawan.rincianPekerjaan.bagianKerja', // Assuming this relationship exists
                        'identitasKaryawan.kontakKaryawan'
                    ])
                    ->whereHas('identitasKaryawan')
                    ->where('status', 'Aktif');

                    Log::debug('PayrollController@index: Initial active users count', ['count' => $query->count()]);

                    $query->whereNotIn('id', $submittedEmployeeIds);

                    Log::debug('PayrollController@index: Active users count after filtering submitted', ['count' => $query->count()]);

                    // Get general settings for the selected period
                    $periodSettings = $this->getPayrollSettingsForDate($startDate);
                    Log::debug('PayrollController@index: Period settings retrieved', ['settings_count' => $periodSettings->count(), 'settings_keys' => $periodSettings->keys()->toArray()]);

                    // Get all specific hourly rate rules
                    $gajiPokokRules = GajiPokokSetting::all()->keyBy(function ($item) {
                        return $item->id_jabatan . '-' . ($item->id_bagian_kerja ?? 'default') . '-' . ($item->senioritas ?? 'default');
                    });
                    Log::debug('PayrollController@index: Gaji Pokok Rules loaded', ['count' => $gajiPokokRules->count()]);


                    $fetchedUsers = $query->get();
                    Log::debug('PayrollController@index: Fetched users count before map', ['count' => $fetchedUsers->count()]);

                    $employees = $fetchedUsers->map(function ($user) use ($startDate, $endDate, $periodSettings, $gajiPokokRules) {
                        Log::debug('Processing employee for payroll', ['id_karyawan' => $user->id_karyawan, 'name' => $user->name, 'period' => $startDate->format('Y-m')]);
                        $identitas = $user->identitasKaryawan;
                        $rincian = $identitas->rincianPekerjaan ?? null;
                        $departemen = $rincian->departemen ?? null;
                        $jabatan = $rincian->jabatan ?? null;
                        $bagianKerja = $rincian->bagianKerja ?? null;
                        $senioritas = $rincian->senioritas ?? 'Junior'; // Default to Junior if not set
                        $kontak = $identitas->kontakKaryawan ?? null;

                        // --- Find the specific hourly rate for this employee ---
                        $jabatanId = $jabatan->id ?? null;
                        $bagianKerjaId = $bagianKerja->id ?? null;

                        // Create keys to check in order of specificity
                        $key1 = $jabatanId . '-' . $bagianKerjaId . '-' . $senioritas;
                        $key2 = $jabatanId . '-' . $bagianKerjaId . '-default';
                        $key3 = $jabatanId . '-default-default';

                        $rule = $gajiPokokRules->get($key1) ?? $gajiPokokRules->get($key2) ?? $gajiPokokRules->get($key3);
                        $specificTarifPerJam = $rule ? $rule->tarif_per_jam : 0;
                        
                        Log::debug('Tarif lookup for employee', [
                            'id_karyawan' => $user->id_karyawan,
                            'keys_checked' => [$key1, $key2, $key3],
                            'found_rate' => $specificTarifPerJam
                        ]);

                        // Create a temporary settings collection for this employee
                        $employeeSettings = clone $periodSettings;
                        $employeeSettings->put('tarif_per_jam', $specificTarifPerJam);
                        // --- End of specific rate logic ---

                        // Get enhanced attendance summary (with izin_terlambat validation)
                        $attendanceSummary = PayrollAttendanceService::getEnhancedAttendanceSummary(
                            $user->id_karyawan,
                            $startDate->format('Y-m-d'),
                            $endDate->format('Y-m-d')
                        );
                        Log::debug('Attendance summary for employee', ['id_karyawan' => $user->id_karyawan, 'summary' => $attendanceSummary]);

                        // Check pending requests
                        $pendingRequests = PayrollAttendanceService::getPendingRequests(
                            $user->id_karyawan,
                            $startDate->format('Y-m-d'),
                            $endDate->format('Y-m-d')
                        );

                        // Calculate payroll using the employee-specific settings
                        $payroll = $this->calculatePayrollForEmployee($attendanceSummary, $employeeSettings);
                        Log::debug('Payroll calculation for employee', ['id_karyawan' => $user->id_karyawan, 'payroll' => $payroll]);

                        // Transform attendance summary
                        $transformedAttendance = [
                            'hadir' => $attendanceSummary['hari_hadir'] ?? 0,
                            'terlambat' => count($attendanceSummary['detail_keterlambatan'] ?? []),
                            'total_menit_terlambat' => $attendanceSummary['total_menit_terlambat'] ?? 0,
                            'total_jam_lembur' => $attendanceSummary['total_jam_lembur'] ?? 0,
                        ];

                        return [
                            'id_karyawan' => $user->id,
                            'nik_perusahaan' => $user->id_karyawan,
                            'nama_lengkap' => $user->name,
                            'departemen' => $departemen->nama_departemen ?? 'Unknown',
                            'jabatan' => $jabatan->nama_jabatan ?? 'Unknown',
                            'senioritas' => $senioritas ?? 'Unknown',
                            'bagian_kerja' => $bagianKerja->nama_bagian_kerja ?? 'Unknown',
                            'gaji_pokok' => $payroll['upah_dasar'],
                            'tunjangan' => $payroll['tunjangan'],
                            'potongan' => $payroll['potongan'],
                            'upah_lembur' => $payroll['upah_lembur'],
                            'total_gaji' => $payroll['total_gaji'],
                            'koreksi_gaji' => 0,
                            'catatan_koreksi' => '',
                            'attendance_summary' => $transformedAttendance,
                            'pending_requests' => $pendingRequests,
                            'has_pending' => $pendingRequests['has_pending'],
                            'bank_info' => [
                                'nama_bank' => $kontak->nama_bank ?? null,
                                'nomor_rekening' => $kontak->nomor_rekening ?? null,
                                'nama_pemilik_rekening' => $kontak->nama_pemilik_rekening ?? null,
                            ],
                        ];
                    })->toArray();
                    Log::debug('PayrollController@index: Final employees count after mapping', ['count' => count($employees)]);

                } catch (\Exception $e) {
                    Log::error('Failed to fetch employees in index', [
                        'period' => $period,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString() // Add trace for more details
                    ]);
                }
            }
        }

        // --- Get Batches (submitted batches for approval or history) ---
        $batchQuery = PayrollBatch::with([
            'employees.karyawan.kontakKaryawan',
            'employees.karyawan.rincianPekerjaan.departemen',
            'employees.karyawan.rincianPekerjaan.jabatan',
            'submitter',
            'approver'
        ]);

        // Handle statuses filter - ensure it's an array
        $statuses = $request->input('statuses');
        if ($statuses && !is_array($statuses)) {
            $statuses = [$statuses];
        }

        Log::info('PayrollController@index: Request params', [
            'has_statuses' => $request->has('statuses'),
            'statuses_raw' => $request->statuses,
            'statuses_input' => $request->input('statuses'),
            'statuses_processed' => $statuses,
            'is_array' => is_array($statuses),
            'tab' => $request->tab
        ]);

        if ($statuses && is_array($statuses) && count($statuses) > 0) {
            Log::info('PayrollController@index: Filtering batches by statuses', ['statuses' => $statuses]);
            $batchQuery->whereIn('status', $statuses);
        } else {
            Log::info('PayrollController@index: No statuses filter, showing submitted and approved');
            // Show both submitted and approved batches in HRD view
            $batchQuery->whereIn('status', ['submitted', 'approved']);
        }

        $batches = $batchQuery->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($batch) {
                return [
                    'id' => $batch->id,
                    'batch_code' => $batch->batch_code,
                    'period' => $batch->period,
                    'period_type' => $batch->period_type,
                    'total_employees' => $batch->total_employees,
                    'total_amount' => $batch->total_amount,
                    'status' => $batch->status,
                    'metode_pembayaran' => $batch->metode_pembayaran,
                    'submitted_at' => $batch->submitted_at?->isoFormat('D MMMM YYYY, HH:mm'),
                    'submitted_by' => $batch->submitter?->name,
                    'approved_at' => $batch->approved_at?->isoFormat('D MMMM YYYY, HH:mm'),
                    'approved_by' => $batch->approver?->name,
                    'paid_at' => $batch->paid_at?->format('Y-m-d H:i:s'),
                    'rejection_reason' => $batch->rejection_reason,
                    'employees' => $batch->employees->map(function ($emp) {
                        if (!$emp->karyawan) return null;
                        $kontak = $emp->karyawan->kontakKaryawan ?? null;
                        return [
                            'id' => $emp->id,
                            'id_karyawan' => $emp->id_karyawan,
                            'nik_perusahaan' => $emp->karyawan->nik_perusahaan ?? null,
                            'nama_lengkap' => $emp->karyawan->nama_lengkap ?? null,
                            'departemen' => $emp->karyawan->rincianPekerjaan->departemen->nama_departemen ?? 'N/A',
                            'jabatan' => $emp->karyawan->rincianPekerjaan->jabatan->nama_jabatan ?? 'N/A',
                            'gaji_pokok' => $emp->gaji_pokok,
                            'tunjangan' => $emp->tunjangan,
                            'potongan' => $emp->potongan,
                            'upah_lembur' => $emp->upah_lembur ?? 0,
                            'koreksi_gaji' => $emp->koreksi_gaji ?? 0,
                            'catatan_koreksi' => $emp->catatan_koreksi ?? null,
                            'total_gaji' => $emp->total_gaji,
                            'status' => $emp->status,
                            'attendance_summary' => $emp->attendance_summary,
                            'bank_info' => [
                                'nama_bank' => $kontak->nama_bank ?? null,
                                'nomor_rekening' => $kontak->nomor_rekening ?? null,
                                'nama_pemilik_rekening' => $kontak->nama_pemilik_rekening ?? null,
                            ],
                        ];
                    })->filter()->values()->toArray(),
                ];
            })->toArray();

        Log::debug('HRD BATCHES BEFORE INERTIA RENDER', $batches);

        return Inertia::render('roles/manajer-hrd/penggajian/proses', [
            'employees' => $employees,
            'batches' => $batches,
            'payrollStatus' => $payrollStatus,
            'filters' => $request->only(['period', 'department', 'search'])
        ]);
    }

    /**
     * Get employees for payroll processing with attendance data
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEmployees(Request $request)
    {
        // Authorization Check
        $user = Auth::user();
        if (!in_array($user->role, ['manajer_hrd', 'staf_hrd'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $period = $request->get('period', date('Y-m'));
        $department = $request->get('department', 'all');
        $search = $request->get('search', '');

        // Log raw input for debugging
        Log::info('getEmployees called', [
            'raw_period' => $period,
            'period_length' => strlen($period),
            'period_type' => gettype($period),
            'user_id' => $user->id,
            'all_params' => $request->all()
        ]);

        // Clean and validate period
        $period = trim($period);
        
        // Support both Y-m and Y-m-d format
        if (strlen($period) === 10) { // Y-m-d format
            $period = substr($period, 0, 7); // Convert to Y-m
        }

        // Validate period format - be more lenient
        if (!preg_match('/^\d{4}-\d{1,2}$/', $period)) {
            Log::error('Invalid period format after cleaning', [
                'cleaned_period' => $period,
                'length' => strlen($period),
                'user_id' => $user->id
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Format periode tidak valid. Harap pilih periode yang benar.',
                'debug' => [
                    'received' => $request->get('period'),
                    'cleaned' => $period,
                    'expected' => 'YYYY-MM'
                ]
            ], 400);
        }
        
        // Normalize to Y-m format (pad month with zero if needed)
        if (preg_match('/^(\d{4})-(\d{1,2})$/', $period, $matches)) {
            $year = $matches[1];
            $month = str_pad($matches[2], 2, '0', STR_PAD_LEFT);
            $period = "$year-$month";
        }

        // Parse period
        try {
            $startDate = Carbon::createFromFormat('Y-m', $period)->startOfMonth();
            $endDate = Carbon::createFromFormat('Y-m', $period)->endOfMonth();
        } catch (\Exception $e) {
            Log::error('Failed to parse period', [
                'period' => $period,
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses periode. Silakan coba lagi.'
            ], 400);
        }

        // Get ALL active employees (not from payroll_employees)
        $query = \App\Models\User::with([
            'identitasKaryawan.rincianPekerjaan.departemen'
        ])
        ->whereHas('identitasKaryawan')
        ->where('status', 'aktif');

        if ($department !== 'all') {
            $query->whereHas('identitasKaryawan.rincianPekerjaan.departemen', function ($q) use ($department) {
                $q->where('nama_departemen', $department);
            });
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('id_karyawan', 'like', "%{$search}%");
            });
        }

        // Get settings once for all employees
        $settings = \App\Models\PayrollSetting::all()->pluck('setting_value', 'setting_key');

        $employees = $query->get()->map(function ($user) use ($startDate, $endDate, $settings) {
            $identitas = $user->identitasKaryawan;
            $rincian = $identitas->rincianPekerjaan ?? null;
            $departemen = $rincian->departemen ?? null;

            // Get enhanced attendance summary (with izin_terlambat validation)
            $attendanceSummary = PayrollAttendanceService::getEnhancedAttendanceSummary(
                $user->id_karyawan, 
                $startDate->format('Y-m-d'), 
                $endDate->format('Y-m-d')
            );

            // Check pending requests
            $pendingRequests = PayrollAttendanceService::getPendingRequests(
                $user->id_karyawan,
                $startDate->format('Y-m-d'),
                $endDate->format('Y-m-d')
            );

            // Calculate payroll
            $payroll = $this->calculatePayrollForEmployee($attendanceSummary, $settings);

            // Transform attendance summary to match frontend expectations
            $transformedAttendance = [
                'hadir' => $attendanceSummary['hari_hadir'] ?? 0,
                'sakit' => $attendanceSummary['hari_sakit'] ?? 0,
                'izin' => $attendanceSummary['hari_izin'] ?? 0,
                'alpa' => $attendanceSummary['hari_alpa'] ?? 0,
                'terlambat' => count($attendanceSummary['detail_keterlambatan'] ?? []),
                'lembur' => count($attendanceSummary['detail_lembur'] ?? []),
                'total_jam_lembur' => $attendanceSummary['total_jam_lembur'] ?? 0,
                'total_menit_terlambat' => $attendanceSummary['total_menit_terlambat'] ?? 0,
            ];

            return [
                'id_karyawan' => $user->id,
                'nik_perusahaan' => $user->id_karyawan,
                'nama_lengkap' => $user->name,
                'departemen' => $departemen->nama_departemen ?? 'Unknown',
                'jabatan' => $rincian->jabatan ?? 'Unknown',
                'gaji_pokok' => $payroll['upah_dasar'],
                'tunjangan' => $payroll['tunjangan'],
                'potongan' => $payroll['potongan'],
                'upah_lembur' => $payroll['upah_lembur'],
                'total_gaji' => $payroll['total_gaji'],
                'tarif_per_jam' => (float)$settings->get('tarif_per_jam', 0),
                'standar_jam_kerja' => (float)$settings->get('standar_jam_kerja', 8),
                'upah_lembur_per_jam' => (float)$settings->get('upah_lembur_per_jam', 0),
                'potongan_per_10_menit' => (float)$settings->get('potongan_per_10_menit', 0),
                'koreksi_gaji' => 0,
                'catatan_koreksi' => '',
                'attendance_summary' => $transformedAttendance,
                'pending_requests' => $pendingRequests,
                'has_pending' => $pendingRequests['has_pending'],
                'status' => 'draft', // Always draft for new calculation
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $employees
        ]);
    }

    private function calculatePayrollForEmployee($attendanceSummary, $settings)
    {
        Log::debug('Calculating payroll for employee', ['attendanceSummary' => $attendanceSummary, 'settings' => $settings->toArray()]);

        // Get values from settings and ensure they are non-negative
        $tarif_per_jam = max(0, (float)$settings->get('tarif_per_jam', 0));
        $standar_jam_kerja = max(0, (float)$settings->get('standar_jam_kerja', 8)); // Default to 8 if not set
        $upah_lembur_per_jam = max(0, (float)$settings->get('upah_lembur_per_jam', 0));
        $tunjangan_makan_per_hari = max(0, (float)$settings->get('tunjangan_makan_per_hari', 0));
        $tunjangan_transport_per_hari = max(0, (float)$settings->get('tunjangan_transport_per_hari', 0));
        $potongan_per_10_menit = max(0, (float)$settings->get('potongan_per_10_menit', 0));

        Log::debug('Payroll settings used', [
            'tarif_per_jam' => $tarif_per_jam,
            'standar_jam_kerja' => $standar_jam_kerja,
            'upah_lembur_per_jam' => $upah_lembur_per_jam,
            'tunjangan_makan_per_hari' => $tunjangan_makan_per_hari,
            'tunjangan_transport_per_hari' => $tunjangan_transport_per_hari,
            'potongan_per_10_menit' => $potongan_per_10_menit,
        ]);

        // Get attendance data and ensure it is non-negative
        $jumlah_hari_hadir = max(0, $attendanceSummary['hari_hadir'] ?? 0);
        $total_jam_lembur = max(0, $attendanceSummary['total_jam_lembur'] ?? 0);
        $total_menit_terlambat = max(0, $attendanceSummary['total_menit_terlambat'] ?? 0);

        Log::debug('Attendance data used', [
            'jumlah_hari_hadir' => $jumlah_hari_hadir,
            'total_jam_lembur' => $total_jam_lembur,
            'total_menit_terlambat' => $total_menit_terlambat,
        ]);

        // 1. Upah Dasar (Base Wage) - Corrected Logic
        $upah_dasar = $jumlah_hari_hadir * $standar_jam_kerja * $tarif_per_jam;

        // 2. Upah Lembur (Overtime Wage)
        $upah_lembur = $total_jam_lembur * $upah_lembur_per_jam;

        // 3. Tunjangan (Allowances)
        $tunjangan = $jumlah_hari_hadir * ($tunjangan_makan_per_hari + $tunjangan_transport_per_hari);

        // 4. Potongan (Deductions)
        $potongan = floor($total_menit_terlambat / 10) * $potongan_per_10_menit;

        // TODO: Add logic for fixed components (tunjangan tetap & potongan tetap) from a dedicated table if needed.

        // 5. Total Gaji (Total Salary)
        $total_gaji = $upah_dasar + $upah_lembur + $tunjangan - $potongan;
        $total_gaji = max(0, $total_gaji); // Ensure final salary is not negative

        Log::debug('Calculated payroll components', [
            'upah_dasar' => $upah_dasar,
            'tunjangan' => $tunjangan,
            'potongan' => $potongan,
            'upah_lembur' => $upah_lembur,
            'total_gaji' => $total_gaji,
        ]);

        $payrollResult = [
            'upah_dasar' => round($upah_dasar, 2),
            'tunjangan' => round($tunjangan, 2),
            'potongan' => round($potongan, 2),
            'upah_lembur' => round($upah_lembur, 2),
            'total_gaji' => round($total_gaji, 2),
        ];

        return $payrollResult;
    }

    /**
     * Get payroll settings valid for a specific date.
     *
     * @param Carbon $date
     * @return \Illuminate\Support\Collection
     */
    private function getPayrollSettingsForDate(Carbon $date)
    {
        Log::debug('getPayrollSettingsForDate called', ['date' => $date->format('Y-m-d H:i:s')]);

        $settingsQuery = \App\Models\PayrollSetting::where('valid_from', '<=', $date)
                                        ->where(function ($query) use ($date) {
                                            $query->whereNull('valid_to')
                                                  ->orWhere('valid_to', '>=', $date);
                                        });

        Log::debug('Payroll settings query SQL', ['sql' => $settingsQuery->toSql(), 'bindings' => $settingsQuery->getBindings()]);

        $rawSettings = $settingsQuery->get();
        Log::debug('Payroll settings raw results', ['count' => $rawSettings->count(), 'results' => $rawSettings->toArray()]);

        $pluckedSettings = $rawSettings->pluck('setting_value', 'setting_key');
        Log::debug('Payroll settings plucked results', ['plucked' => $pluckedSettings->toArray()]);

        return $pluckedSettings;
    }


    /**
     * Calculate attendance summary from presensi collection
     * 
     * @param \Illuminate\Database\Eloquent\Collection $presensiCollection
     * @return array
     */
    private function calculateAttendanceSummary($presensiCollection)
    {
        $summary = [
            'hadir' => 0,
            'sakit' => 0,
            'izin' => 0,
            'alpa' => 0,
            'terlambat' => 0,
            'total_jam_kerja_normal' => 0,
            'total_jam_lembur' => 0,
            'total_menit_terlambat' => 0,
        ];

        foreach ($presensiCollection as $presensi) {
            // Count by status
            switch ($presensi->status_presensi) {
                case 'hadir':
                    $summary['hadir']++;
                    break;
                case 'sakit':
                    $summary['sakit']++;
                    break;
                case 'izin':
                    $summary['izin']++;
                    break;
                case 'alpha':
                    $summary['alpa']++;
                    break;
                case 'terlambat':
                    $summary['terlambat']++;
                    // Calculate late minutes
                    if ($presensi->jadwal && $presensi->jam_masuk_actual) {
                        $jamMasukSeharusnya = Carbon::parse($presensi->jadwal->jam_masuk);
                        $jamMasukAktual = Carbon::parse($presensi->jam_masuk_actual);
                        if ($jamMasukAktual->isAfter($jamMasukSeharusnya)) {
                            $summary['total_menit_terlambat'] += $jamMasukAktual->diffInMinutes($jamMasukSeharusnya);
                        }
                    }
                    break;
            }

            // Sum normal work hours and overtime hours
            $summary['total_jam_kerja_normal'] += $presensi->jam_kerja ?? 0;
            $summary['total_jam_lembur'] += $presensi->jam_lembur ?? 0;
        }

        // Safeguard against negative values due to bad data
        $summary['total_jam_kerja_normal'] = max(0, $summary['total_jam_kerja_normal']);
        $summary['total_jam_lembur'] = max(0, $summary['total_jam_lembur']);
        $summary['total_menit_terlambat'] = max(0, $summary['total_menit_terlambat']);

        return $summary;
    }

    // /**
    //  * Validate payroll data before submission
    //  * 
    //  * @param Request $request
    //  * @return \Illuminate\Http\JsonResponse
    //  */
    // public function validate(Request $request)
    // {
    //     $employees = $request->get('employees', []);
    //     $errors = [];

    //     if (empty($employees)) {
    //         throw \Illuminate\Validation\ValidationException::withMessages([
    //             'employees' => 'Tidak ada data karyawan untuk divalidasi.'
    //         ]);
    //     }

    //     foreach ($employees as $index => $employee) {
    //         $employeeName = $employee['nama_lengkap'] ?? "Karyawan #" . ($index + 1);

    //         if (isset($employee['gaji_pokok']) && isset($employee['total_gaji'])) {
    //             $gaji_pokok = (float)($employee['gaji_pokok'] ?? 0);
    //             $tunjangan = (float)($employee['tunjangan'] ?? 0);
    //             $potongan = (float)($employee['potongan'] ?? 0);
    //             $upah_lembur = (float)($employee['upah_lembur'] ?? 0);
    //             $koreksi_gaji = (float)($employee['koreksi_gaji'] ?? 0);
    //             $total_gaji = (float)($employee['total_gaji'] ?? 0);

    //             $calculatedTotal = $gaji_pokok + $tunjangan + $upah_lembur - $potongan + $koreksi_gaji;
                
    //             if (abs($calculatedTotal - $total_gaji) > 0.01) {
    //                 $errors["employees.{$index}"] = "{$employeeName}: Total gaji tidak sesuai. Perhitungan sistem: " . number_format($calculatedTotal) . ", Data tabel: " . number_format($total_gaji);
    //             }
    //         }
    //     }

    //     if (count($errors) > 0) {
    //         throw \Illuminate\Validation\ValidationException::withMessages($errors);
    //     }

    //     return redirect()->back()->with('success', 'Data berhasil divalidasi dan siap untuk disubmit.');
    // }

    /**
     * Submit payroll batch to finance
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validate(Request $request)
    {
        $employees = $request->get('employees', []);
        $errors = [];

        if (empty($employees)) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'employees' => 'Tidak ada data karyawan untuk divalidasi.'
            ]);
        }

        foreach ($employees as $index => $employee) {
            $employeeName = $employee['nama_lengkap'] ?? "Karyawan #" . ($index + 1);

            $gaji_pokok = (float)($employee['gaji_pokok'] ?? 0);
            $tunjangan = (float)($employee['tunjangan'] ?? 0);
            $potongan = (float)($employee['potongan'] ?? 0);
            $upah_lembur = (float)($employee['upah_lembur'] ?? 0);
            $koreksi_gaji = (float)($employee['koreksi_gaji'] ?? 0);
            $total_gaji = (float)($employee['total_gaji'] ?? 0);

            $calculatedTotal = $gaji_pokok + $tunjangan + $upah_lembur - $potongan + $koreksi_gaji;
            
            if (abs($calculatedTotal - $total_gaji) > 0.01) {
                $errors["employees.{$index}"] = "{$employeeName}: Total gaji tidak sesuai. Perhitungan sistem: " . number_format($calculatedTotal) . ", Data tabel: " . number_format($total_gaji);
            }
        }

        if (count($errors) > 0) {
            throw \Illuminate\Validation\ValidationException::withMessages($errors);
        }

        Log::info('Payroll validation successful', [
            'employee_count' => count($employees),
            'employees' => array_map(fn($e) => $e['nama_lengkap'] ?? 'Unknown', $employees)
        ]);

        return redirect()->back()->with([
            'validated' => true,
            'success' => 'Validasi berhasil! ' . count($employees) . ' karyawan siap untuk disubmit ke keuangan.'
        ]);
    }

    public function submitBatch(Request $request)
    {
        // Standard Laravel validation will throw an exception handled by Inertia
        $validatedData = $request->validate([
            'period' => 'required|string',
            'period_type' => 'required|in:mingguan,bulanan',
            'employees' => 'required|array|min:1',
            'employees.*.id_karyawan' => 'required|exists:users,id',
            'employees.*.gaji_pokok' => 'required|numeric|min:0',
            'employees.*.tunjangan' => 'nullable|numeric|min:0',
            'employees.*.potongan' => 'nullable|numeric|min:0',
            'employees.*.upah_lembur' => 'nullable|numeric|min:0',
            'employees.*.total_gaji' => 'required|numeric|min:0',
            'employees.*.koreksi_gaji' => 'nullable|numeric',
            'employees.*.catatan_koreksi' => 'nullable|string|max:500',
        ]);

        // Authorization check
        $user = Auth::user();
        if (!in_array($user->role, ['admin', 'manajer_hrd'])) {
            return redirect()->back()->with('error', 'Anda tidak memiliki wewenang untuk melakukan aksi ini.');
        }

        DB::beginTransaction();
        try {
            $employees = $validatedData['employees'];
            $period = $validatedData['period'];
            $periodType = $validatedData['period_type'];
            
            // Cek apakah sudah ada batch untuk periode ini
            $batch = PayrollBatch::where('period', $period)
                ->where('period_type', $periodType)
                ->where('status', 'submitted')
                ->first();
            
            // Jika belum ada batch, buat baru
            if (!$batch) {
                $batchCode = 'BATCH-' . date('Ymd-His') . '-' . strtoupper(substr(md5(uniqid()), 0, 4));
                
                Log::debug('Attempting to create PayrollBatch with status', ['status' => 'submitted']);
                $batch = PayrollBatch::create([
                    'batch_code' => $batchCode,
                    'period' => $period,
                    'period_type' => $periodType,
                    'total_employees' => 0,
                    'total_amount' => 0,
                    'status' => 'submitted',
                    'submitted_by' => $user->id,
                    'submitted_at' => now(),
                ]);
            }

            // Tambahkan atau update employees ke batch
            foreach ($employees as $emp) {
                // Calculate period start and end dates for attendance summary
                $periodCarbon = Carbon::createFromFormat('Y-m', $period);
                $startDate = $periodCarbon->startOfMonth()->format('Y-m-d');
                $endDate = $periodCarbon->endOfMonth()->format('Y-m-d');

                // Get fresh attendance summary
                $attendanceSummary = JadwalKerja::getAttendanceSummaryForEmployee(
                    $emp['id_karyawan'],
                    $startDate,
                    $endDate
                );

                // Transform attendance summary to match frontend expectations (if needed, or just store raw)
                $transformedAttendance = [
                    'hadir' => $attendanceSummary['hari_hadir'] ?? 0,
                    'sakit' => $attendanceSummary['hari_sakit'] ?? 0,
                    'izin' => $attendanceSummary['hari_izin'] ?? 0,
                    'alpa' => $attendanceSummary['hari_alpa'] ?? 0,
                    'terlambat' => count($attendanceSummary['detail_keterlambatan'] ?? []),
                    'lembur' => count($attendanceSummary['detail_lembur'] ?? []),
                    'total_jam_lembur' => $attendanceSummary['total_jam_lembur'] ?? 0,
                    'total_menit_terlambat' => $attendanceSummary['total_menit_terlambat'] ?? 0,
                ];

                // Cek apakah karyawan sudah ada di batch ini (untuk re-submit yang ditolak)
                $existingEmployee = PayrollEmployee::where('batch_id', $batch->id)
                    ->where('id_karyawan', $emp['id_karyawan'])
                    ->first();
                
                if ($existingEmployee) {
                    // Update data jika sudah ada (re-submit)
                    $existingEmployee->update([
                        'gaji_pokok' => $emp['gaji_pokok'],
                        'tunjangan' => $emp['tunjangan'] ?? 0,
                        'potongan' => $emp['potongan'] ?? 0,
                        'upah_lembur' => $emp['upah_lembur'] ?? 0,
                        'total_gaji' => $emp['total_gaji'],
                        'koreksi_gaji' => $emp['koreksi_gaji'] ?? 0,
                        'catatan_koreksi' => $emp['catatan_koreksi'] ?? null,
                        'status' => 'submitted',
                        'attendance_summary' => $transformedAttendance, // Use the freshly calculated summary
                    ]);
                } else {
                    // Buat baru jika belum ada
                    PayrollEmployee::create([
                        'batch_id' => $batch->id,
                        'id_karyawan' => $emp['id_karyawan'],
                        'gaji_pokok' => $emp['gaji_pokok'],
                        'tunjangan' => $emp['tunjangan'] ?? 0,
                        'potongan' => $emp['potongan'] ?? 0,
                        'upah_lembur' => $emp['upah_lembur'] ?? 0,
                        'total_gaji' => $emp['total_gaji'],
                        'koreksi_gaji' => $emp['koreksi_gaji'] ?? 0,
                        'catatan_koreksi' => $emp['catatan_koreksi'] ?? null,
                        'status' => 'submitted',
                        'attendance_summary' => $transformedAttendance, // Use the freshly calculated summary
                    ]);
                }
            }
            
            // Update total batch
            $batch->total_employees = $batch->employees()->count();
            $batch->total_amount = $batch->employees()->sum('total_gaji');
            $batch->save();

            DB::commit();
            Log::info('Payroll batch submitted successfully', ['batch_id' => $batch->id]);

            // Redirect without period to clear employee list
            return redirect()->route('manajer-hrd.penggajian.proses')->with('success', "Batch penggajian ({$batch->batch_code}) berhasil dikirim ke keuangan.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in submitBatch', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Gagal mengirim batch penggajian: ' . $e->getMessage());
        }
    }

    /**
     * Update payroll correction for a specific employee.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateKoreksi(Request $request)
    {
        // Authorization Check
        $user = Auth::user();
        if (!in_array($user->role, ['manajer_hrd', 'staf_hrd'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        // Validate incoming request
        $validated = $request->validate([
            'employee_id' => 'required|exists:payroll_employees,id',
            'koreksi_gaji' => 'required|numeric',
            'catatan_koreksi' => 'nullable|string|max:500',
            'period' => 'required|string|regex:/^\d{4}-\d{2}$/',
        ]);

        DB::beginTransaction();
        try {
            // Find the specific PayrollEmployee record for the given period
            $payrollEmployee = PayrollEmployee::where('id', $validated['employee_id'])
                ->whereHas('batch', function ($query) use ($validated) {
                    $query->where('period', $validated['period']);
                })
                ->firstOrFail();

            // Update correction fields
            $payrollEmployee->koreksi_gaji = $validated['koreksi_gaji'];
            $payrollEmployee->catatan_koreksi = $validated['catatan_koreksi'];

            // Recalculate total_gaji to include the new correction
            $payrollEmployee->total_gaji = 
                $payrollEmployee->gaji_pokok +
                $payrollEmployee->tunjangan +
                $payrollEmployee->upah_lembur -
                $payrollEmployee->potongan +
                $payrollEmployee->koreksi_gaji;

            $payrollEmployee->save();

            DB::commit();

            Log::info('Payroll correction updated successfully', [
                'payroll_employee_id' => $payrollEmployee->id,
                'koreksi_gaji' => $payrollEmployee->koreksi_gaji,
                'catatan_koreksi' => $payrollEmployee->catatan_koreksi,
                'total_gaji' => $payrollEmployee->total_gaji,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Koreksi gaji berhasil diperbarui.',
                'data' => $payrollEmployee // Optionally return the updated model
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            Log::error('PayrollEmployee not found for correction update', [
                'employee_id' => $validated['employee_id'],
                'period' => $validated['period'],
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Data karyawan penggajian tidak ditemukan.'
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating payroll correction', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui koreksi gaji. Silakan coba lagi.'
            ], 500);
        }
    }

    /**
     * Get payroll batches with filters
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBatches(Request $request)
    {
        try {
            $status = $request->get('status', 'all');
            $periodType = $request->get('period_type');
            $period = $request->get('period');

            // Build query with eager loading
            $query = PayrollBatch::with([
                'employees.karyawan.kontakKaryawan',
                'employees.karyawan.rincianPekerjaan.departemen',
                'employees.karyawan.rincianPekerjaan.jabatan',
                'submitter',
                'approver'
            ]);

            // Filter by status
            if ($status !== 'all') {
                $query->where('status', $status);
            }

            // Filter by period type
            if ($periodType) {
                $query->where('period_type', $periodType);
            }

            // Filter by period
            if ($period) {
                $query->where('period', $period);
            }

            // Fetch all payroll settings once
            $settings = \App\Models\PayrollSetting::all()->pluck('setting_value', 'setting_key');

            // Get batches ordered by most recent
            $batches = $query->orderBy('created_at', 'desc')->get();

            // Transform data for response
            $batchesData = $batches->map(function ($batch) use ($settings) {
                return [
                    'id' => $batch->id,
                    'batch_code' => $batch->batch_code,
                    'period' => $batch->period,
                    'period_type' => $batch->period_type,
                    'total_employees' => $batch->total_employees,
                    'total_amount' => $batch->total_amount,
                    'status' => $batch->status,
                    'metode_pembayaran' => $batch->metode_pembayaran,
                    'submitted_at' => $batch->submitted_at?->format('Y-m-d H:i:s'),
                    'submitted_by' => $batch->submitter?->name,
                    'approved_at' => $batch->approved_at?->format('Y-m-d H:i:s'),
                    'approved_by' => $batch->approver?->name,
                    'paid_at' => $batch->paid_at?->format('Y-m-d H:i:s'),
                    'rejection_reason' => $batch->rejection_reason,
                    'employees' => $batch->employees->map(function ($emp) use ($settings) {
                        if (!$emp->karyawan) return null;
                        $kontak = $emp->karyawan->kontakKaryawan ?? null;
                        return [
                            'id' => $emp->id,
                            'id_karyawan' => $emp->id_karyawan,
                            'nik_perusahaan' => $emp->karyawan->nik_perusahaan ?? null,
                            'nama_lengkap' => $emp->karyawan->nama_lengkap ?? null,
                            'departemen' => $emp->karyawan->rincianPekerjaan->departemen->nama_departemen ?? 'N/A',
                            'jabatan' => $emp->karyawan->rincianPekerjaan->jabatan->nama_jabatan ?? 'N/A',
                            'gaji_pokok' => $emp->gaji_pokok,
                            'tunjangan' => $emp->tunjangan,
                            'potongan' => $emp->potongan,
                            'upah_lembur' => $emp->upah_lembur ?? 0,
                            'koreksi_gaji' => $emp->koreksi_gaji ?? 0,
                            'catatan_koreksi' => $emp->catatan_koreksi ?? null,
                            'total_gaji' => $emp->total_gaji,
                            'status' => $emp->status,
                            'attendance_summary' => $emp->attendance_summary,
                            'bank_info' => [
                                'nama_bank' => $kontak->nama_bank ?? null,
                                'nomor_rekening' => $kontak->nomor_rekening ?? null,
                                'nama_pemilik_rekening' => $kontak->nama_pemilik_rekening ?? null,
                            ],
                            // Add rate details for detail modal
                            'tarif_per_jam' => (float)$settings->get('tarif_per_jam', 0),
                            'standar_jam_kerja' => (float)$settings->get('standar_jam_kerja', 8),
                            'upah_lembur_per_jam' => (float)$settings->get('upah_lembur_per_jam', 0),
                            'potongan_per_10_menit' => (float)$settings->get('potongan_per_10_menit', 0),
                        ];
                    })->filter()->values()->toArray(),
                ];
            })->toArray();

            return response()->json([
                'success' => true,
                'data' => $batchesData
            ]);
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database error in getBatches', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan database saat mengambil data batch'
            ], 500);
        } catch (\Exception $e) {
            Log::error('Error in getBatches', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data batch. Silakan coba lagi.'
            ], 500);
        }
    }

    /**
     * Get payroll settings
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSettings(Request $request)
    {
        try {
            $user = Auth::user();
            if (!in_array($user->role, ['manajer_hrd', 'staf_hrd'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access'
                ], 403);
            }

            // Get all payroll settings
            $settings = \App\Models\PayrollSetting::all()->pluck('setting_value', 'setting_key');

            return response()->json([
                'success' => true,
                'data' => [
                    'tarif_per_jam' => (float)$settings->get('tarif_per_jam', 0),
                    'standar_jam_kerja' => (float)$settings->get('standar_jam_kerja', 8),
                    'upah_lembur_per_jam' => (float)$settings->get('upah_lembur_per_jam', 0),
                    'potongan_per_10_menit' => (float)$settings->get('potongan_per_10_menit', 0),
                    'tunjangan_transport' => (float)$settings->get('tunjangan_transport', 0),
                    'tunjangan_makan' => (float)$settings->get('tunjangan_makan', 0),
                    'bpjs_kesehatan_perusahaan' => (float)$settings->get('bpjs_kesehatan_perusahaan', 0),
                    'bpjs_kesehatan_karyawan' => (float)$settings->get('bpjs_kesehatan_karyawan', 0),
                    'bpjs_ketenagakerjaan_perusahaan' => (float)$settings->get('bpjs_ketenagakerjaan_perusahaan', 0),
                    'bpjs_ketenagakerjaan_karyawan' => (float)$settings->get('bpjs_ketenagakerjaan_karyawan', 0),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error in getSettings', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pengaturan penggajian'
            ], 500);
        }
    }

    /**
     * Approve or reject employee payroll
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function approveEmployee(Request $request)
    {
        try {
            // Validate request
            $request->validate([
                'id' => 'required|exists:payroll_employees,id',
                'action' => 'required|in:approve,reject',
                'notes' => 'nullable|string|max:500'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid',
                'errors' => $e->errors()
            ], 422);
        }

        try {
            // Check authorization - only finance or admin can approve
            /** @var \App\Models\User $user */
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak terautentikasi'
                ], 401);
            }

            // Check if user has permission - only finance or admin can approve
            $allowedRoles = ['admin', 'finance', 'manajer_keuangan', 'staf_keuangan'];
            $hasPermission = false;

            foreach ($allowedRoles as $role) {
                if ($user->hasRole($role)) {
                    $hasPermission = true;
                    break;
                }
            }

            if (!$hasPermission) {
                Log::warning('Unauthorized approval attempt', [
                    'user_id' => $user->id,
                    'payroll_employee_id' => $request->id
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki akses untuk approve/reject payroll'
                ], 403);
            }

            // Find the payroll employee record
            $payrollEmployee = PayrollEmployee::findOrFail($request->id);

            // Update status
            $newStatus = $request->action === 'approve' ? 'approved' : 'rejected';
            $payrollEmployee->update([
                'status' => $newStatus
            ]);

            // If all employees in batch are approved, update batch status
            if ($newStatus === 'approved') {
                $batch = $payrollEmployee->batch;
                $allApproved = $batch->employees()->where('status', '!=', 'approved')->count() === 0;

                if ($allApproved) {
                    $batch->update([
                        'status' => 'approved',
                        'approved_at' => now(),
                        'approved_by' => $user->id
                    ]);
                }
            }

            Log::info('Payroll employee approval processed', [
                'payroll_employee_id' => $payrollEmployee->id,
                'action' => $request->action,
                'approved_by' => $user->id
            ]);

            return redirect()->back()->with([
                'success' => $request->action === 'approve'
                    ? 'Payroll karyawan berhasil disetujui'
                    : 'Payroll karyawan ditolak',
                'data' => [
                    'id' => $payrollEmployee->id,
                    'status' => $newStatus
                ]
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Payroll employee not found', [
                'id' => $request->id
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Data payroll karyawan tidak ditemukan'
            ], 404);
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database error in approveEmployee', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan database. Silakan coba lagi.'
            ], 500);
        } catch (\Exception $e) {
            Log::error('Error in approveEmployee', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses approval. Silakan coba lagi.'
            ], 500);
        }
    }



    /**
     * Bulk approve or reject employee payrolls.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function bulkApproveReject(Request $request)
    {
        try {
            $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:payroll_employees,id',
                'action' => 'required|in:approve,reject',
                'notes' => 'nullable|string|max:500'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->with(['error' => 'Data tidak valid', 'errors' => $e->errors()]);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user) {
            return redirect()->back()->with('error', 'User tidak terautentikasi');
        }

        $allowedRoles = ['admin', 'finance', 'manajer_keuangan', 'staf_keuangan'];
        $hasPermission = false;
        foreach ($allowedRoles as $role) {
            if ($user->hasRole($role)) {
                $hasPermission = true;
                break;
            }
        }

        if (!$hasPermission) {
            Log::warning('Unauthorized bulk approval attempt', [
                'user_id' => $user->id,
                'payroll_employee_ids' => $request->ids
            ]);
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk approve/reject payroll secara massal');
        }

        DB::beginTransaction();
        try {
            Log::debug('bulkApproveReject: Starting transaction', ['employee_ids' => $request->ids, 'action' => $request->action]);

            $newStatus = $request->action === 'approve' ? 'approved' : 'rejected';
            $employeeIds = $request->ids;

            // Fetch all affected payroll employees
            $payrollEmployees = PayrollEmployee::whereIn('id', $employeeIds)->get();
            Log::debug('bulkApproveReject: Fetched payroll employees', ['count' => $payrollEmployees->count()]);

            // Group by batch_id to update parent batches efficiently
            $batchesToUpdate = [];

            foreach ($payrollEmployees as $payrollEmployee) {
                $payrollEmployee->update([
                    'status' => $request->action === 'approve' ? 'approved' : 'rejected',
                    'catatan_koreksi' => $request->notes ?? $payrollEmployee->catatan_koreksi
                ]);
                $batchesToUpdate[$payrollEmployee->batch_id] = true;
                Log::debug('bulkApproveReject: Updated employee status', ['employee_id' => $payrollEmployee->id, 'new_status' => $newStatus]);
            }

            // Update parent batch statuses
            foreach (array_keys($batchesToUpdate) as $batchId) {
                $batch = PayrollBatch::find($batchId);
                if ($batch) {
                    Log::debug('bulkApproveReject: Processing batch for status update', ['batch_id' => $batch->id, 'current_status' => $batch->status]);

                    // Check if there are any employees still in the 'submitted' state.
                    $hasPendingSubmissions = $batch->employees()->where('status', 'submitted')->exists();

                    // If all employees have been processed (none are 'submitted' anymore)
                    if (!$hasPendingSubmissions) {
                        $hasRejections = $batch->employees()->where('status', 'rejected')->exists();

                        if ($hasRejections) {
                            // If any employee was rejected, the whole batch is considered rejected for review.
                            $batch->update([
                                'status' => 'rejected',
                                'rejection_reason' => 'Satu atau lebih karyawan ditolak dalam proses approval massal.',
                                'approved_at' => null, // Clear approval info
                                'approved_by' => null,
                            ]);
                            Log::info('bulkApproveReject: Batch status updated to rejected', ['batch_id' => $batch->id]);
                        } else {
                            // If all were processed and none were rejected, the batch is approved.
                            $batch->update([
                                'status' => 'approved',
                                'approved_at' => now(),
                                'approved_by' => $user->id,
                                'rejection_reason' => null, // Clear rejection info
                            ]);
                            Log::info('bulkApproveReject: Batch status updated to approved', ['batch_id' => $batch->id]);
                        }
                    } else {
                        // If some employees are still pending, the batch remains 'submitted'.
                        Log::debug('bulkApproveReject: Batch has pending submissions, status remains unchanged.', ['batch_id' => $batch->id]);
                    }
                }
            }

            DB::commit();

            Log::info('Bulk payroll approval/rejection processed', [
                'payroll_employee_ids' => $employeeIds,
                'action' => $request->action,
                'approved_by' => $user->id
            ]);

            return redirect()->back()->with('success', "Berhasil " . ($request->action === 'approve' ? 'menyetujui' : 'menolak') . " " . count($employeeIds) . " karyawan.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in bulkApproveReject', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Gagal memproses aksi massal. Silakan coba lagi.');
        }
    }

    /**
     * Finalize approved payrolls, moving them to a 'finalized' status.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function finalizeApprovedBatch(Request $request)
    {
        try {
            $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:payroll_employees,id',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->with(['error' => 'Data tidak valid', 'errors' => $e->errors()]);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user) {
            return redirect()->back()->with('error', 'User tidak terautentikasi');
        }

        $allowedRoles = ['admin', 'manajer_keuangan', 'staf_keuangan'];
        $hasPermission = false;
        foreach ($allowedRoles as $role) {
            if ($user->hasRole($role)) {
                $hasPermission = true;
                break;
            }
        }

        if (!$hasPermission) {
            Log::warning('Unauthorized finalize attempt', [
                'user_id' => $user->id,
                'payroll_employee_ids' => $request->ids
            ]);
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk memfinalisasi penggajian.');
        }

        DB::beginTransaction();
        try {
            $employeeIds = $request->ids;

            // Fetch all affected payroll employees that are already approved
            $payrollEmployees = PayrollEmployee::whereIn('id', $employeeIds)
                                                ->where('status', 'approved')
                                                ->get();

            if ($payrollEmployees->isEmpty()) {
                DB::rollBack();
                return redirect()->back()->with('error', 'Tidak ada karyawan yang disetujui untuk difinalisasi.');
            }

            $batchesToUpdate = [];

            foreach ($payrollEmployees as $payrollEmployee) {
                // Keep status as 'approved' - no need to change
                // Status will be changed to 'paid' when payment is actually made
                $batchesToUpdate[$payrollEmployee->batch_id] = true;
            }

            // Update parent batch statuses
            foreach (array_keys($batchesToUpdate) as $batchId) {
                $batch = PayrollBatch::find($batchId);
                if ($batch) {
                    // Batch stays as 'approved' until payment is made
                    // No status change needed here
                }
            }

            DB::commit();

            Log::info('Bulk payroll finalized successfully', [
                'payroll_employee_ids' => $employeeIds,
                'finalized_by' => $user->id
            ]);

            return redirect()->back()->with('success', 'Berhasil memfinalisasi ' . count($employeeIds) . ' karyawan. Data siap untuk pembayaran.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in finalizeApprovedBatch', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Gagal memfinalisasi penggajian. Silakan coba lagi.');
        }
    }

    /**
     * Show the payroll payment page for Finance Manager.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function showPaymentPage(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['admin', 'manajer_keuangan', 'staf_keuangan'])) {
            abort(403, 'Unauthorized access');
        }

        // Fetch all approved batches (ready for payment)
        $batches = PayrollBatch::with([
            'employees.karyawan.rincianPekerjaan.departemen',
            'employees.karyawan.rincianPekerjaan.jabatan',
            'submitter',
            'approver'
        ])
        ->where('status', 'approved')
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($batch) {
            return [
                'id' => $batch->id,
                'batch_code' => $batch->batch_code,
                'period' => $batch->period,
                'period_type' => $batch->period_type,
                'total_employees' => $batch->total_employees,
                'total_amount' => $batch->total_amount,
                'status' => $batch->status,
                'submitted_at' => $batch->submitted_at?->format('Y-m-d H:i:s'),
                'submitted_by' => $batch->submitter ? [
                    'id' => $batch->submitter->id,
                    'name' => $batch->submitter->name
                ] : null,
                'approved_at' => $batch->approved_at?->format('Y-m-d H:i:s'),
                'approved_by' => $batch->approver ? [
                    'id' => $batch->approver->id,
                    'name' => $batch->approver->name
                ] : null,
                'rejection_reason' => $batch->rejection_reason,
                'employees' => $batch->employees->map(function ($emp) {
                    return [
                        'id' => $emp->id,
                        'id_karyawan' => $emp->id_karyawan,
                        'nik_perusahaan' => $emp->karyawan->nik_perusahaan ?? null,
                        'nama_lengkap' => $emp->karyawan->nama_lengkap ?? null,
                        'departemen' => $emp->karyawan->rincianPekerjaan->departemen->nama_departemen ?? 'N/A',
                        'jabatan' => $emp->karyawan->rincianPekerjaan->jabatan->nama_jabatan ?? 'N/A',
                        'gaji_pokok' => $emp->gaji_pokok,
                        'tunjangan' => $emp->tunjangan,
                        'potongan' => $emp->potongan,
                        'upah_lembur' => $emp->upah_lembur ?? 0,
                        'koreksi_gaji' => $emp->koreksi_gaji ?? 0,
                        'catatan_koreksi' => $emp->catatan_koreksi ?? null,
                        'total_gaji' => $emp->total_gaji,
                        'status' => $emp->status,
                        'attendance_summary' => $emp->attendance_summary,
                    ];
                })
            ];
        });

        return Inertia::render('roles/Keuangan/Payroll/payment/index', [
            'batches' => $batches,
        ]);
    }

    /**
     * Bulk pay finalized payrolls.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function bulkPay(Request $request)
    {
        Log::debug('bulkPay method called.');
        try {
            $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:payroll_employees,id',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('bulkPay: Validation failed', ['errors' => $e->errors()]);
            return redirect()->back()->with(['error' => 'Data tidak valid', 'errors' => $e->errors()]);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user) {
            Log::warning('bulkPay: User not authenticated');
            return redirect()->back()->with('error', 'User tidak terautentikasi');
        }

        $allowedRoles = ['admin', 'manajer_keuangan', 'staf_keuangan'];
        $hasPermission = false;
        foreach ($allowedRoles as $role) {
            if ($user->hasRole($role)) {
                $hasPermission = true;
                break;
            }
        }

        if (!$hasPermission) {
            Log::warning('bulkPay: Unauthorized bulk pay attempt', [
                'user_id' => $user->id,
                'payroll_employee_ids' => $request->ids
            ]);
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk memproses pembayaran.');
        }

        DB::beginTransaction();
        try {
            $employeeIds = $request->ids;
            Log::debug('bulkPay: Received employee IDs for payment', ['employee_ids' => $employeeIds]);

            // Fetch all affected payroll employees that are already approved
            $payrollEmployees = PayrollEmployee::whereIn('id', $employeeIds)
                                                ->where('status', 'approved')
                                                ->get();
            Log::debug('bulkPay: Found payroll employees with status approved', ['count' => $payrollEmployees->count(), 'employee_ids' => $payrollEmployees->pluck('id')->toArray()]);

            if ($payrollEmployees->isEmpty()) {
                DB::rollBack();
                Log::warning('bulkPay: No approved employees found for payment', ['requested_ids' => $employeeIds]);
                return redirect()->back()->with('error', 'Tidak ada karyawan yang disetujui untuk dibayar.');
            }

            $batchesToUpdate = [];

            foreach ($payrollEmployees as $payrollEmployee) {
                $payrollEmployee->update([
                    'status' => 'paid',
                ]);
                $batchesToUpdate[$payrollEmployee->batch_id] = true;
                Log::debug('bulkPay: Updated payrollEmployee status', ['id' => $payrollEmployee->id, 'new_status' => 'paid']);
            }

            // Update parent batch statuses
            foreach (array_keys($batchesToUpdate) as $batchId) {
                $batch = PayrollBatch::find($batchId);
                if ($batch) {
                    Log::debug('bulkPay: Processing batch', ['batch_id' => $batch->id, 'current_status' => $batch->status, 'current_paid_at' => $batch->paid_at]);

                    // Check if all employees in this batch are now paid
                    $allPaid = $batch->employees()->where('status', '!=', 'paid')->count() === 0;
                    Log::debug('bulkPay: All employees in batch paid condition', ['batch_id' => $batch->id, 'allPaid' => $allPaid]);

                    if ($allPaid) {
                        // If all are paid, set batch status to paid and update paid_at
                        $batch->update([
                            'status' => 'paid',
                            'paid_at' => now(),
                        ]);
                        Log::debug('bulkPay: Batch status and paid_at updated (all paid)', ['batch_id' => $batch->id, 'new_status' => 'paid', 'new_paid_at' => $batch->paid_at]);
                    } else {
                        // If not all are paid, but some were just paid, ensure paid_at is set if not already
                        if ($batch->paid_at === null) {
                            $batch->update([
                                'paid_at' => now(),
                            ]);
                            Log::debug('bulkPay: Batch paid_at updated (partial payment)', ['batch_id' => $batch->id, 'new_paid_at' => $batch->paid_at]);
                        }
                    }
                }
            }

            DB::commit();

            Log::info('Bulk payroll paid successfully', [
                'payroll_employee_ids' => $employeeIds,
                'paid_by' => $user->id
            ]);

            return redirect()->back()->with('success', 'Berhasil membayar ' . count($employeeIds) . ' karyawan.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in bulkPay', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Gagal memproses pembayaran. Silakan coba lagi.');
        }
    }

    /**
     * Update the payment method for a specific payroll batch.
     *
     * @param Request $request
     * @param PayrollBatch $batch
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePaymentMethod(Request $request, PayrollBatch $batch)
    {
        $validated = $request->validate([
            'metode_pembayaran' => 'required|in:transfer,tunai',
        ]);

        try {
            $batch->update([
                'metode_pembayaran' => $validated['metode_pembayaran'],
            ]);

            Log::info('Payment method updated for batch', ['batch_id' => $batch->id, 'new_method' => $validated['metode_pembayaran']]);

            return response()->json([
                'success' => true,
                'message' => 'Metode pembayaran berhasil diperbarui.',
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to update payment method', ['batch_id' => $batch->id, 'error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui metode pembayaran.',
            ], 500);
        }
    }

    public function cancelSubmission(Request $request)
    {
        // Authorization Check
        $user = Auth::user();
        if (!in_array($user->role, ['manajer_hrd', 'staf_hrd'])) {
            abort(403, 'Tidak diizinkan.');
        }

        $validated = $request->validate([
            'type' => 'required|string|in:item,batch',
            'id' => 'required|integer',
        ]);

        DB::beginTransaction();
        try {
            if ($validated['type'] === 'item') {
                $payrollEmployee = PayrollEmployee::findOrFail($validated['id']);
                $id_karyawan = $payrollEmployee->id_karyawan;
                $batch = $payrollEmployee->batch;
                $period = $batch->period;
                $employeeName = $payrollEmployee->user->name ?? 'Karyawan';

                $payrollEmployee->delete();

                // If the batch is now empty, delete it
                $remainingCount = $batch->employees()->count();
                if ($remainingCount === 0) {
                    $batch->delete();
                }

                DB::commit();
                
                return redirect()
                    ->route('manajer-hrd.penggajian.proses', ['period' => $period])
                    ->with('success', "Pengajuan {$employeeName} berhasil dibatalkan dan dikembalikan ke Input Data Variabel.");
            } 
            
            if ($validated['type'] === 'batch') {
                $batch = PayrollBatch::with('employees')->findOrFail($validated['id']);
                $period = $batch->period;
                $totalEmployees = $batch->employees->count();
                $batchCode = $batch->batch_code;

                // Deleting the batch will cascade delete payroll_employees
                $batch->delete();

                DB::commit();
                
                return redirect()
                    ->route('manajer-hrd.penggajian.proses', ['period' => $period])
                    ->with('success', "Batch {$batchCode} berhasil dibatalkan. {$totalEmployees} karyawan dikembalikan ke Input Data Variabel.");
            }
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in cancelSubmission', ['error' => $e->getMessage()]);
            
            return redirect()
                ->back()
                ->with('error', 'Gagal membatalkan pengajuan: ' . $e->getMessage());
        }

        return redirect()->back()->with('error', 'Tipe tidak valid.');
    }

    /**
     * Show the payroll approval page for Finance Manager.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function showApprovalPage(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['admin', 'manajer_keuangan', 'staf_keuangan'])) {
            abort(403, 'Unauthorized access');
        }

        $activeTab = $request->get('tab', 'pending'); // Default to 'pending'

        $batchQuery = PayrollBatch::with([
            'employees.karyawan.kontakKaryawan',
            'employees.karyawan.rincianPekerjaan.departemen',
            'employees.karyawan.rincianPekerjaan.jabatan',
            'submitter',
            'approver'
        ]);

        if ($activeTab === 'pending') {
            $batchQuery->where('status', 'submitted');
        } elseif ($activeTab === 'payment') {
            $batchQuery->where('status', 'approved');
        } elseif ($activeTab === 'completed') {
            $batchQuery->whereIn('status', ['paid', 'rejected']);
        }

        $batches = $batchQuery->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($batch) {
                return [
                    'id' => $batch->id,
                    'batch_code' => $batch->batch_code,
                    'period' => $batch->period,
                    'period_type' => $batch->period_type,
                    'total_employees' => $batch->total_employees,
                    'total_amount' => $batch->total_amount,
                    'status' => $batch->status,
                    'metode_pembayaran' => $batch->metode_pembayaran,
                    'submitted_at' => $batch->submitted_at?->format('Y-m-d H:i:s'),
                    'submitted_by' => $batch->submitter?->name,
                    'approved_at' => $batch->approved_at?->format('Y-m-d H:i:s'),
                    'approved_by' => $batch->approver?->name,
                    'paid_at' => $batch->paid_at?->format('Y-m-d H:i:s'),
                    'rejection_reason' => $batch->rejection_reason,
                    'employees' => $batch->employees->map(function ($emp) {
                        $kontak = $emp->karyawan->kontakKaryawan ?? null;
                        return [
                            'id' => $emp->id,
                            'id_karyawan' => $emp->id_karyawan,
                            'nik_perusahaan' => $emp->karyawan->nik_perusahaan ?? null,
                            'nama_lengkap' => $emp->karyawan->nama_lengkap ?? null,
                            'departemen' => $emp->karyawan->rincianPekerjaan->departemen->nama_departemen ?? 'N/A',
                            'jabatan' => $emp->karyawan->rincianPekerjaan->jabatan->nama_jabatan ?? 'N/A',
                            'gaji_pokok' => $emp->gaji_pokok,
                            'tunjangan' => $emp->tunjangan,
                            'potongan' => $emp->potongan,
                            'upah_lembur' => $emp->upah_lembur ?? 0,
                            'koreksi_gaji' => $emp->koreksi_gaji ?? 0,
                            'catatan_koreksi' => $emp->catatan_koreksi ?? null,
                            'total_gaji' => $emp->total_gaji,
                            'status' => $emp->status,
                            'attendance_summary' => $emp->attendance_summary,
                            'bank_info' => [
                                'nama_bank' => $kontak->nama_bank ?? null,
                                'nomor_rekening' => $kontak->nomor_rekening ?? null,
                                'nama_pemilik_rekening' => $kontak->nama_pemilik_rekening ?? null,
                            ],
                        ];
                    })
                ];
            });

        return Inertia::render('roles/Keuangan/Payroll/approval/index', [
            'batches' => $batches,
            'activeTab' => $activeTab,
        ]);
    }
}