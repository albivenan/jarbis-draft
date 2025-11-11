<?php

namespace App\Http\Controllers\Crew;

use App\Http\Controllers\Controller;
use App\Models\IdentitasKaryawan;
use App\Models\PayrollEmployee;
use Illuminate\Http\Request;
use App\Models\PayrollBatch;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PenggajianController extends Controller
{
    /**
     * Display the unified payroll and bank account page.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();

        // Fetch employee data with contact info (for bank details)
        $employee = IdentitasKaryawan::with('kontakKaryawan')->find($user->id_karyawan);

        // Fetch payslip history
        $payslipHistory = PayrollEmployee::with('batch')->where('id_karyawan', $user->id_karyawan)
            ->latest()
            ->get()
            ->map(function ($payslip) {
                return [
                    'id' => $payslip->id,
                    'total_gaji' => $payslip->total_gaji,
                    'status' => $payslip->status,
                    'gaji_pokok' => $payslip->gaji_pokok,
                    'tunjangan' => $payslip->tunjangan,
                    'upah_lembur' => $payslip->upah_lembur,
                    'potongan' => $payslip->potongan,
                    'koreksi_gaji' => $payslip->koreksi_gaji,
                    'catatan_koreksi' => $payslip->catatan_koreksi,
                    'attendance_summary' => $payslip->attendance_summary,
                    'batch' => $payslip->batch ? [
                        'period' => $payslip->batch->period,
                    ] : null,
                ];
            });

        return Inertia::render('roles/crew/penggajian/index', [
            'bankAccount' => [
                'nama_bank' => $employee->kontakKaryawan->nama_bank ?? '-',
                'nomor_rekening' => $employee->kontakKaryawan->nomor_rekening ?? '-',
                'nama_pemilik_rekening' => $employee->kontakKaryawan->nama_pemilik_rekening ?? '-',
            ],
            'payslipHistory' => $payslipHistory,
        ]);
    }

    /**
     * Display a specific payslip by batch name for the logged-in user.
     */
    public function show(Request $request, string $batchName): Response
    {
        $user = Auth::user();

        // Find the batch by its period name
        $batch = PayrollBatch::where('period', $batchName)->firstOrFail();

        // Find the specific payslip for the logged-in user within that batch
        $payslip = PayrollEmployee::where('batch_id', $batch->id)
            ->where('id_karyawan', $user->id_karyawan)
            ->firstOrFail();

        // Eager load relationships for details
        $payslip->load(['batch', 'karyawan.user', 'karyawan.kontakKaryawan']);

        return Inertia::render('roles/crew/penggajian/show', [
            'payslip' => $payslip->toArray(),
        ]);
    }
}
