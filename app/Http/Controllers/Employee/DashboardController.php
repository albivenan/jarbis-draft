<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Helpers\RoleHelper;
use App\Models\JadwalKerja;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $today = Carbon::today();
        $role = is_string($user->role ?? null) ? strtolower(trim($user->role)) : 'crew';

        // Mengambil jadwal kerja hari ini
        $jadwalHariIni = JadwalKerja::where('id_karyawan', $user->id_karyawan)
            ->where('tanggal', $today->toDateString())
            ->first();

        // Placeholder data; replace with real queries later
        $kpi = [
            'labels' => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            'values' => [72, 75, 78, 80, 77, 82, 84, 83, 85, 86, 88, 90],
        ];

        $lastPayroll = [
            'period' => now()->subMonth()->translatedFormat('F Y'),
            'status' => 'paid',
            'totalEarnings' => 15000000,
            'totalDeductions' => 2000000,
            'netSalary' => 13000000,
        ];

        return Inertia::render('roles.crew.dashboard', [
            'kpi' => $kpi,
            'jadwalHariIni' => $jadwalHariIni,
            'lastPayroll' => $lastPayroll,
            'roleInfo' => RoleHelper::getRoleConfig($role),
            'dashboardModules' => RoleHelper::getDashboardModules($role),
        ]);
    }
}



