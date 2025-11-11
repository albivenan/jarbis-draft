<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use App\Models\PayrollBatch;
use App\Models\PayrollEmployee;
use App\Models\Presensi;
use App\Models\IdentitasKaryawan;
use App\Models\Departemen;
use Illuminate\Support\Facades\DB;

class DireksiController extends Controller
{
    /**
     * Display the director's report page.
     */
    public function index(Request $request): Response
    {
        $reportType = $request->input('report_type', 'quarterly'); // 'quarterly' or 'annual'
        $currentYear = Carbon::now()->year;
        $period = '';
        $startDate = null;
        $endDate = null;

        if ($reportType === 'quarterly') {
            $currentMonth = Carbon::now()->month;
            $currentQuarter = Carbon::now()->quarter;
            $period = 'Q' . $currentQuarter . '-' . $currentYear;
            $startDate = Carbon::create($currentYear, ($currentQuarter - 1) * 3 + 1, 1)->startOfMonth();
            $endDate = Carbon::create($currentYear, $currentQuarter * 3, 1)->endOfMonth();
        } else { // annual
            $period = (string)$currentYear;
            $startDate = Carbon::create($currentYear, 1, 1)->startOfMonth();
            $endDate = Carbon::create($currentYear, 12, 31)->endOfMonth();
        }

        // --- Fetch Payroll Data ---
        $payrollBatches = PayrollBatch::whereBetween('submitted_at', [$startDate, $endDate])
                                      ->with(['employees.karyawan.directDepartemen'])
                                      ->get();

        $payrollEmployees = collect();
        foreach ($payrollBatches as $batch) {
            $payrollEmployees = $payrollEmployees->merge($batch->employees);
        }

        $totalEmployees = $payrollEmployees->count();
        $totalGrossPay = $payrollEmployees->sum(function ($employee) {
            return $employee->gaji_pokok + $employee->tunjangan + $employee->upah_lembur;
        });
        $totalNetPay = $payrollEmployees->sum('total_gaji');
        $totalDeductions = $payrollEmployees->sum('potongan');
        $totalBenefits = $payrollEmployees->sum('tunjangan');
        $totalOvertimePay = $payrollEmployees->sum('upah_lembur');
        $avgSalary = $totalEmployees > 0 ? $totalNetPay / $totalEmployees : 0;
        $totalPayrollCost = $totalGrossPay; // Assuming payroll cost is total gross pay

        // --- Fetch Attendance Data ---
        $allEmployees = IdentitasKaryawan::count(); // Total employees in the system
        $workingDaysInPeriod = 0;
        if ($startDate && $endDate) {
            $workingDaysInPeriod = $startDate->diffInDaysFiltered(function (Carbon $date) {
                return $date->isWeekday();
            }, $endDate) + 1;
        }

        $attendanceData = Presensi::whereBetween('tanggal', [$startDate, $endDate])->get();
        $totalPresentAttendanceRecords = $attendanceData->whereIn('status_presensi', ['hadir', 'terlambat', 'izin', 'sakit', 'cuti'])->count();

        $totalPossibleAttendances = $allEmployees * $workingDaysInPeriod;
        $attendanceRate = $totalPossibleAttendances > 0 ? ($totalPresentAttendanceRecords / $totalPossibleAttendances) * 100 : 0;


        // --- Construct Executive Summary ---
        $executiveSummary = [
            'period' => $period,
            'totalEmployees' => $totalEmployees,
            'employeeGrowth' => 0, // KPI under development
            'turnoverRate' => 0, // KPI under development
            'retentionRate' => 0, // KPI under development
            'avgSalary' => round($avgSalary, 2),
            'totalPayrollCost' => round($totalPayrollCost, 2),
            'trainingInvestment' => 0, // KPI under development
            'recruitmentCost' => 0, // KPI under development
            'employeeSatisfaction' => 0, // KPI under development
            'productivityIndex' => 0, // KPI under development
            'attendanceRate' => round($attendanceRate, 2), // Added attendance rate
        ];

        // --- Empty KPI-related data ---
        $strategicInitiatives = [];
        $keyRecommendations = [];

        return Inertia::render('roles/manajer-hrd/laporan/direksi/index', [
            'executiveSummary' => $executiveSummary,
            'strategicInitiatives' => $strategicInitiatives,
            'keyRecommendations' => $keyRecommendations,
        ]);
    }
}
