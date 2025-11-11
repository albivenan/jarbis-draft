<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Presensi;
use App\Models\IdentitasKaryawan;
use App\Models\Departemen;
use App\Models\JadwalKerja;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class KehadiranController extends Controller
{
    public function index(Request $request)
    {
        $currentPeriod = $request->input('period', Carbon::now()->format('Y-m'));
        $previousPeriod = Carbon::parse($currentPeriod)->subMonth()->format('Y-m');
        $departmentId = $request->input('department_id');

        // Fetch data for current period
        $currentData = $this->getAttendanceDataForPeriod($currentPeriod, $departmentId);

        // Fetch data for previous period
        $previousData = $this->getAttendanceDataForPeriod($previousPeriod, $departmentId);

        // Calculate trends for summary report
        $summaryTrends = $this->calculateSummaryTrends($currentData['summary'], $previousData['summary']);

        return response()->json([
            'summary' => array_merge($currentData['summary'], ['trends' => $summaryTrends]),
            'department' => $currentData['department'],
            'daily' => $currentData['daily'],
        ]);
    }

    private function getAttendanceDataForPeriod(string $period, ?string $departmentId): array
    {
        $startDate = Carbon::parse($period)->startOfMonth();
        $endDate = Carbon::parse($period)->endOfMonth();

        $allEmployees = IdentitasKaryawan::when($departmentId, function ($query) use ($departmentId) {
            $query->where('id_departemen', $departmentId);
        })->get();

        $totalEmployees = $allEmployees->count();
        if ($totalEmployees === 0) {
            return [
                'summary' => [],
                'department' => [],
                'daily' => []
            ];
        }

        $workingDaysInMonth = $startDate->diffInDaysFiltered(function (Carbon $date) {
            return $date->isWeekday();
        }, $endDate) + 1;

        $attendanceData = Presensi::whereBetween('tanggal', [$startDate, $endDate])
            ->when($departmentId, function ($query) use ($departmentId) {
                $query->whereHas('identitasKaryawan', function ($q) use ($departmentId) {
                    $q->where('id_departemen', $departmentId);
                });
            })
            ->with('identitasKaryawan.directDepartemen')
            ->get();

        // Summary Report
        $totalPresent = $attendanceData->whereIn('status_presensi', ['hadir', 'terlambat', 'izin', 'sakit', 'cuti'])->count();
        $totalAbsent = $attendanceData->where('status_presensi', 'alpha')->count();
        $totalLate = $attendanceData->where('status_presensi', 'terlambat')->count();
        $totalOvertimeHours = $attendanceData->sum('jam_lembur');

        $totalPossibleAttendances = $totalEmployees * $workingDaysInMonth;
        $attendanceRate = $totalPossibleAttendances > 0 ? ($totalPresent / $totalPossibleAttendances) * 100 : 0;
        $punctualityRate = $totalPresent > 0 ? (($totalPresent - $totalLate) / $totalPresent) * 100 : 0;
        $averageWorkingHours = $attendanceData->where('jam_kerja', '>=', 0)->avg('jam_kerja');

        $summaryReport = [
            'period' => $period,
            'department' => $departmentId ? Departemen::find($departmentId)->nama_departemen : 'All Departments',
            'totalEmployees' => $totalEmployees,
            'workingDays' => $workingDaysInMonth,
            'totalPresent' => $totalPresent,
            'totalAbsent' => $totalAbsent,
            'totalLate' => $totalLate,
            'totalOvertime' => round($totalOvertimeHours, 2),
            'attendanceRate' => round($attendanceRate, 2),
            'punctualityRate' => round($punctualityRate, 2),
            'averageWorkingHours' => round($averageWorkingHours, 2),
        ];

        // Department-wise Data
        $departmentReports = [];
        $departmentEmployeeCounts = IdentitasKaryawan::select('id_departemen', DB::raw('count(*) as total_employees'))
            ->when($departmentId, function ($query) use ($departmentId) {
                $query->where('id_departemen', $departmentId);
            })
            ->groupBy('id_departemen')
            ->get()->keyBy('id_departemen');

        foreach ($departmentEmployeeCounts as $deptId => $deptStats) {
            $departmentName = Departemen::find($deptId)->nama_departemen ?? 'Unknown Department';
            $employeesInDept = $deptStats->total_employees;
            $deptAttendance = $attendanceData->filter(function ($item) use ($departmentName) {
                return ($item->identitasKaryawan->directDepartemen->nama_departemen ?? 'Unknown Department') === $departmentName;
            });

            $deptTotalPresent = $deptAttendance->whereIn('status_presensi', ['hadir', 'terlambat', 'izin', 'sakit', 'cuti'])->count();
            $deptTotalLate = $deptAttendance->where('status_presensi', 'terlambat')->count();
            $deptTotalAbsent = $deptAttendance->where('status_presensi', 'alpha')->count();
            $deptTotalOvertimeHours = $deptAttendance->sum('jam_lembur');

            $deptPossibleAttendances = $employeesInDept * $workingDaysInMonth;
            $deptPresentRate = $deptPossibleAttendances > 0 ? ($deptTotalPresent / $deptPossibleAttendances) * 100 : 0;
            $deptLateRate = $deptPossibleAttendances > 0 ? ($deptTotalLate / $deptPossibleAttendances) * 100 : 0;
            $deptAbsentRate = $deptPossibleAttendances > 0 ? ($deptTotalAbsent / $deptPossibleAttendances) * 100 : 0;

            $departmentReports[] = [
                'department' => $departmentName,
                'employees' => $employeesInDept,
                'totalPresent' => $deptTotalPresent,
                'presentRate' => round($deptPresentRate, 2),
                'totalLate' => $deptTotalLate,
                'lateRate' => round($deptLateRate, 2),
                'totalAbsent' => $deptTotalAbsent,
                'absentRate' => round($deptAbsentRate, 2),
                'overtimeHours' => round($deptTotalOvertimeHours, 2),
                'trend' => 'stable', // Trend for department will be calculated on frontend or needs more complex backend logic
            ];
        }

        // Daily Data
        $dailyReports = [];
        for ($date = clone $startDate; $date->lte($endDate); $date->addDay()) {
            $dateString = $date->format('Y-m-d');
            $dayAttendance = $attendanceData->filter(function ($item) use ($date) {
                return $item->tanggal->isSameDay($date);
            });

            $dailyPresent = $dayAttendance->whereIn('status_presensi', ['hadir', 'terlambat', 'izin', 'sakit', 'cuti'])->count();
            $dailyLate = $dayAttendance->where('status_presensi', 'terlambat')->count();
            $dailyAbsent = $dayAttendance->where('status_presensi', 'alpha')->count();
            $dailyOvertime = $dayAttendance->sum('jam_lembur');

            $dailyReports[] = [
                'date' => $dateString,
                'present' => $dailyPresent,
                'late' => $dailyLate,
                'absent' => $dailyAbsent,
                'overtime' => round($dailyOvertime, 2),
                'totalEmployees' => $totalEmployees,
            ];
        }
        Log::info('Daily Reports Data:', $dailyReports);
        return [
            'summary' => $summaryReport,
            'department' => $departmentReports,
            'daily' => $dailyReports,
        ];
    }

    private function calculateSummaryTrends(array $currentSummary, array $previousSummary): array
    {
        $trends = [];

        // Attendance Rate Trend
        $currentAttendanceRate = $currentSummary['attendanceRate'] ?? 0;
        $previousAttendanceRate = $previousSummary['attendanceRate'] ?? 0;
        $trends['attendanceRate'] = $this->getTrend($currentAttendanceRate, $previousAttendanceRate);
        $trends['attendanceRateChange'] = $this->getPercentageChange($currentAttendanceRate, $previousAttendanceRate);

        // Punctuality Rate Trend
        $currentPunctualityRate = $currentSummary['punctualityRate'] ?? 0;
        $previousPunctualityRate = $previousSummary['punctualityRate'] ?? 0;
        $trends['punctualityRate'] = $this->getTrend($currentPunctualityRate, $previousPunctualityRate);
        $trends['punctualityRateChange'] = $this->getPercentageChange($currentPunctualityRate, $previousPunctualityRate);

        // Overtime Hours Trend
        $currentOvertime = $currentSummary['totalOvertime'] ?? 0;
        $previousOvertime = $previousSummary['totalOvertime'] ?? 0;
        $trends['totalOvertime'] = $this->getTrend($currentOvertime, $previousOvertime);
        $trends['totalOvertimeChange'] = $this->getPercentageChange($currentOvertime, $previousOvertime);

        return $trends;
    }

    private function getTrend(float $current, float $previous): string
    {
        if ($previous === 0.0 && $current > 0.0) {
            return 'up';
        } elseif ($previous === 0.0 && $current === 0.0) {
            return 'stable';
        } elseif ($current > $previous) {
            return 'up';
        }
        return 'stable';
    }

    private function getPercentageChange(float $current, float $previous): float
    {
        if ($previous === 0.0) {
            return $current > 0 ? 100.0 : 0.0; // If previous was 0 and current is > 0, it's a 100% increase (or infinite, but 100 is more practical)
        }
        return round((($current - $previous) / $previous) * 100, 2);
    }
}