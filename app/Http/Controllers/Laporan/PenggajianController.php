<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\PayrollBatch;
use App\Models\PayrollEmployee;
use App\Models\IdentitasKaryawan;
use App\Models\Departemen;
use App\Models\PayrollSetting;
use App\Models\PayrollFixedComponent; // Added
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PenggajianController extends Controller
{
    /**
     * Display the payroll report page for HRD Manager.
     */
    public function index(Request $request): Response
    {
        $currentPeriod = $request->input('period', Carbon::now()->format('Y-m'));

        $payrollBatch = PayrollBatch::where('period', $currentPeriod)
                                    ->with(['employees.karyawan.directDepartemen'])
                                    ->first();

        // --- Fetch Payroll Settings ---
        $payrollSettings = PayrollSetting::whereNull('valid_to')
                                        ->orWhere('valid_to', '>', Carbon::now())
                                        ->pluck('setting_value', 'setting_key')
                                        ->toArray();
        // Provide default values if settings are not found
        $payrollSettings = array_merge([
            'tarif_per_jam' => 0,
            'upah_lembur_per_jam' => 0,
            'standar_jam_kerja' => 0,
            'tunjangan_makan_per_hari' => 0,
            'tunjangan_transport_per_hari' => 0,
            'potongan_per_10_menit' => 0,
            'periode_pembayaran' => 'bulanan',
            'tanggal_gajian' => 25,
            'hari_gajian_mingguan' => 'jumat',
        ], $payrollSettings);

        // --- Fetch Fixed Payroll Components ---
        $fixedPayrollComponents = PayrollFixedComponent::whereNull('valid_to')
                                                        ->orWhere('valid_to', '>', Carbon::now())
                                                        ->get();


        if (!$payrollBatch) {
            return Inertia::render('roles/manajer-hrd/laporan/penggajian/index', [
                'payrollSummary' => [
                    'period' => $currentPeriod,
                    'totalEmployees' => 0,
                    'totalGrossPay' => 0,
                    'totalNetPay' => 0,
                    'totalDeductions' => 0,
                    'totalBenefits' => 0,
                    'totalOvertime' => 0,
                    'avgSalary' => 0,
                    'payrollCost' => 0,
                ],
                'departmentPayroll' => [],
                'payrollSettings' => $payrollSettings,
                'fixedPayrollComponents' => $fixedPayrollComponents, // Pass fixed components
            ]);
        }

        $payrollEmployees = $payrollBatch->employees;

        // Calculate Payroll Summary
        $totalEmployees = $payrollEmployees->count();
        $totalGrossPay = $payrollEmployees->sum(function ($employee) {
            return $employee->gaji_pokok + $employee->tunjangan + $employee->upah_lembur;
        });
        $totalNetPay = $payrollEmployees->sum('total_gaji');
        $totalDeductions = $payrollEmployees->sum('potongan');
        $totalBenefits = $payrollEmployees->sum('tunjangan');
        $totalOvertime = $payrollEmployees->sum('upah_lembur');
        $avgSalary = $totalEmployees > 0 ? $totalNetPay / $totalEmployees : 0;
        $payrollCost = $totalGrossPay; // Assuming payroll cost is total gross pay for now

        $payrollSummary = [
            'period' => $currentPeriod,
            'totalEmployees' => $totalEmployees,
            'totalGrossPay' => round($totalGrossPay, 2),
            'totalNetPay' => round($totalNetPay, 2),
            'totalDeductions' => round($totalDeductions, 2),
            'totalBenefits' => round($totalBenefits, 2),
            'totalOvertime' => round($totalOvertime, 2),
            'avgSalary' => round($avgSalary, 2),
            'payrollCost' => round($payrollCost, 2),
        ];

        // Calculate Department Payroll
        $departmentPayroll = [];
        $departmentGroups = $payrollEmployees->groupBy(function ($employee) {
            return $employee->karyawan->directDepartemen->nama_departemen ?? 'Unknown Department';
        });

        foreach ($departmentGroups as $departmentName => $employeesInDept) {
            $deptEmployeesCount = $employeesInDept->count();
            $deptTotalPay = $employeesInDept->sum('total_gaji');
            $deptAvgSalary = $deptEmployeesCount > 0 ? $deptTotalPay / $deptEmployeesCount : 0;
            $deptOvertimePay = $employeesInDept->sum('upah_lembur');
            $deptBenefits = $employeesInDept->sum('tunjangan');
            $percentage = $totalNetPay > 0 ? ($deptTotalPay / $totalNetPay) * 100 : 0;

            $departmentPayroll[] = [
                'department' => $departmentName,
                'employees' => $deptEmployeesCount,
                'totalPay' => round($deptTotalPay, 2),
                'avgSalary' => round($deptAvgSalary, 2),
                'overtimePay' => round($deptOvertimePay, 2),
                'benefits' => round($deptBenefits, 2),
                'percentage' => round($percentage, 2),
            ];
        }

        return Inertia::render('roles/manajer-hrd/laporan/penggajian/index', [
            'payrollSummary' => $payrollSummary,
            'departmentPayroll' => $departmentPayroll,
            'payrollSettings' => $payrollSettings,
            'fixedPayrollComponents' => $fixedPayrollComponents, // Pass fixed components
        ]);
    }
}