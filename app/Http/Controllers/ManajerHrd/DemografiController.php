<?php

namespace App\Http\Controllers\ManajerHrd;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\RincianPekerjaan;
use App\Models\IdentitasKaryawan;
use App\Models\Departemen;
use App\Models\Education;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DemografiController extends Controller
{
    public function index(Request $request)
    {
        $selectedPeriod = $request->input('period', Carbon::now()->format('Y-m'));
        $startOfMonth = Carbon::parse($selectedPeriod)->startOfMonth();
        $endOfMonth = Carbon::parse($selectedPeriod)->endOfMonth();
        $startOfYear = Carbon::parse($selectedPeriod)->startOfYear();
        $endOfYear = Carbon::parse($selectedPeriod)->endOfYear();

        // 1. overviewStats calculation
        $totalEmployees = User::count();
        $activeEmployees = User::where('employment_status', 'active')->count();

        $newHires = RincianPekerjaan::whereBetween('tanggal_bergabung', [$startOfMonth, $endOfMonth])->count();
        $resignations = RincianPekerjaan::whereBetween('termination_date', [$startOfMonth, $endOfMonth])->count();

        $avgAge = IdentitasKaryawan::selectRaw('AVG(YEAR(CURDATE()) - YEAR(tanggal_lahir) - (DATE_FORMAT(CURDATE(), "%m%d") < DATE_FORMAT(tanggal_lahir, "%m%d"))) as avg_age')->value('avg_age');
        $avgAge = round($avgAge, 1);

        $avgTenure = RincianPekerjaan::join('users', 'rincian_pekerjaan.id_karyawan', '=', 'users.id_karyawan')
            ->where('users.employment_status', 'active')
            ->selectRaw('AVG(DATEDIFF(CURDATE(), rincian_pekerjaan.tanggal_bergabung) / 365) as avg_tenure')
            ->value('avg_tenure');
        $avgTenure = round($avgTenure, 1);

        // Turnover Rate (simplified annual calculation for now)
        // This is a common simplified formula for annual turnover rate
        $totalEmployeesAtStartOfYear = User::where('created_at', '<', $startOfYear)->count();
        $totalEmployeesAtEndOfYear = User::where('created_at', '<=', $endOfYear)->count();
        $averageEmployees = ($totalEmployeesAtStartOfYear + $totalEmployeesAtEndOfYear) / 2;

        $annualResignations = RincianPekerjaan::whereBetween('termination_date', [$startOfYear, $endOfYear])->count();
        $turnoverRate = ($averageEmployees > 0) ? ($annualResignations / $averageEmployees) * 100 : 0;
        $turnoverRate = round($turnoverRate, 2);

        $retentionRate = 100 - $turnoverRate;
        $retentionRate = round($retentionRate, 2);


        $overviewStats = [
            'totalEmployees' => $totalEmployees,
            'activeEmployees' => $activeEmployees,
            'newHires' => $newHires,
            'resignations' => $resignations,
            'avgAge' => $avgAge,
            'avgTenure' => $avgTenure,
            'turnoverRate' => $turnoverRate,
            'retentionRate' => $retentionRate,
        ];

        // 2. departmentAnalysis calculation
        $departmentAnalysis = Departemen::all()->map(function ($department) use ($startOfMonth, $endOfMonth, $startOfYear, $endOfYear) {
            // totalEmployeesDept
            $totalEmployeesDept = RincianPekerjaan::where('id_departemen', $department->id_departemen)
                ->join('users', 'rincian_pekerjaan.id_karyawan', '=', 'users.id_karyawan')
                ->where('users.employment_status', 'active')
                ->count();

            // newHiresDept
            $newHiresDept = RincianPekerjaan::where('id_departemen', $department->id_departemen)
                ->whereBetween('tanggal_bergabung', [$startOfMonth, $endOfMonth])
                ->count();

            // resignationsDept
            $resignationsDept = RincianPekerjaan::where('id_departemen', $department->id_departemen)
                ->whereBetween('termination_date', [$startOfMonth, $endOfMonth])
                ->count();

            // avgTenureDept
            $avgTenureDept = RincianPekerjaan::where('id_departemen', $department->id_departemen)
                ->join('users', 'rincian_pekerjaan.id_karyawan', '=', 'users.id_karyawan')
                ->where('users.employment_status', 'active')
                ->selectRaw('AVG(DATEDIFF(CURDATE(), rincian_pekerjaan.tanggal_bergabung) / 365) as avg_tenure')
                ->value('avg_tenure');
            $avgTenureDept = round($avgTenureDept, 1);

            // Departmental Turnover Rate (annual)
            $deptEmployeesAtStartOfYear = RincianPekerjaan::where('id_departemen', $department->id_departemen)
                ->join('users', 'rincian_pekerjaan.id_karyawan', '=', 'users.id_karyawan')
                ->where('rincian_pekerjaan.tanggal_bergabung', '<', $startOfYear)
                ->count();
            $deptEmployeesAtEndOfYear = RincianPekerjaan::where('id_departemen', $department->id_departemen)
                ->join('users', 'rincian_pekerjaan.id_karyawan', '=', 'users.id_karyawan')
                ->where('rincian_pekerjaan.tanggal_bergabung', '<=', $endOfYear)
                ->count();
            $avgDeptEmployees = ($deptEmployeesAtStartOfYear + $deptEmployeesAtEndOfYear) / 2;

            $annualResignationsDept = RincianPekerjaan::where('id_departemen', $department->id_departemen)
                ->whereBetween('termination_date', [$startOfYear, $endOfYear])
                ->count();
            $turnoverRateDept = ($avgDeptEmployees > 0) ? ($annualResignationsDept / $avgDeptEmployees) * 100 : 0;
            $turnoverRateDept = round($turnoverRateDept, 2);

            return [
                'department' => $department->nama_departemen,
                'totalEmployees' => $totalEmployeesDept,
                'newHires' => $newHiresDept,
                'resignations' => $resignationsDept,
                'promotions' => 0, // Placeholder, as agreed to ignore for now
                'turnoverRate' => $turnoverRateDept,
                'avgTenure' => $avgTenureDept,
            ];
        });

        // 3. Demographic Data (Age Distribution)
        $employees = IdentitasKaryawan::all();
        $ageGroups = [
            '<25' => 0,
            '25-34' => 0,
            '35-44' => 0,
            '45-54' => 0,
            '55+' => 0,
        ];

        foreach ($employees as $employee) {
            $age = Carbon::parse($employee->tanggal_lahir)->age;
            if ($age < 25) {
                $ageGroups['<25']++;
            } elseif ($age >= 25 && $age <= 34) {
                $ageGroups['25-34']++;
            } elseif ($age >= 35 && $age <= 44) {
                $ageGroups['35-44']++;
            } elseif ($age >= 45 && $age <= 54) {
                $ageGroups['45-54']++;
            } else {
                $ageGroups['55+']++;
            }
        }

        $demographicData = [];
        foreach ($ageGroups as $category => $count) {
            $percentage = ($totalEmployees > 0) ? round(($count / $totalEmployees) * 100, 2) : 0;
            $demographicData[] = [
                'category' => $category,
                'value' => $count,
                'percentage' => $percentage,
                'trend' => 'stable', // Placeholder
                'trendValue' => 0,   // Placeholder
            ];
        }

        // 4. Education Data (Education Distribution)
        $educationLevels = Education::select('jenjang', DB::raw('count(*) as total'))
            ->groupBy('jenjang')
            ->get();

        $educationData = [];
        foreach ($educationLevels as $level) {
            $percentage = ($totalEmployees > 0) ? round(($level->total / $totalEmployees) * 100, 2) : 0;
            $educationData[] = [
                'category' => $level->jenjang,
                'value' => $level->total,
                'percentage' => $percentage,
                'trend' => 'stable', // Placeholder
                'trendValue' => 0,   // Placeholder
            ];
        }

        // 5. Trend Data (Last 6 Months)
        $trendData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::parse($selectedPeriod)->subMonths($i);
            $startOfMonthTrend = $month->startOfMonth();
            $endOfMonthTrend = $month->endOfMonth();

            $totalEmployeesMonth = User::where('created_at', '<=', $endOfMonthTrend)->count();
            $newHiresMonth = RincianPekerjaan::whereBetween('tanggal_bergabung', [$startOfMonthTrend, $endOfMonthTrend])->count();
            $resignationsMonth = RincianPekerjaan::whereBetween('termination_date', [$startOfMonthTrend, $endOfMonthTrend])->count();

            // Calculate average employees for turnover rate for the month
            $employeesAtStartOfMonth = User::where('created_at', '<', $startOfMonthTrend)->count();
            $employeesAtEndOfMonth = User::where('created_at', '<=', $endOfMonthTrend)->count();
            $averageEmployeesMonth = ($employeesAtStartOfMonth + $employeesAtEndOfMonth) / 2;

            $turnoverRateMonth = ($averageEmployeesMonth > 0) ? ($resignationsMonth / $averageEmployeesMonth) * 100 : 0;
            $turnoverRateMonth = round($turnoverRateMonth, 2);

            $retentionRateMonth = 100 - $turnoverRateMonth;
            $retentionRateMonth = round($retentionRateMonth, 2);

            $trendData[] = [
                'month' => $month->format('M Y'),
                'totalEmployees' => $totalEmployeesMonth,
                'newHires' => $newHiresMonth,
                'resignations' => $resignationsMonth,
                'turnoverRate' => $turnoverRateMonth,
                'retentionRate' => $retentionRateMonth,
            ];
        }


        return Inertia::render('roles/hrd/karyawan/demografi/index', [
            'overviewStats' => $overviewStats,
            'departmentAnalysis' => $departmentAnalysis,
            'selectedPeriod' => $selectedPeriod,
            'demographicData' => $demographicData,
            'educationData' => $educationData,
            'trendData' => $trendData,
        ]);
    }
}
