<?php

namespace App\Http\Controllers\Hrd;

use App\Http\Controllers\Controller;
use App\Models\IdentitasKaryawan;
use App\Models\PermintaanPerubahanData; // Import the new model
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class KaryawanController extends Controller
{
    /**
     * Display a listing of the employees.
     */
    public function index(Request $request): Response
    {
        $employees = IdentitasKaryawan::with([
            'rincianPekerjaan.jabatan',
            'rincianPekerjaan.departemen',
            'kontakKaryawan'
        ])->get();

        $pendingChangeRequestsCount = PermintaanPerubahanData::where('status', 'pending')->count();

        return Inertia::render('roles.hrd.karyawan.daftar', [
            'employees' => $employees->toArray(),
            'pendingChangeRequestsCount' => $pendingChangeRequestsCount,
        ]);
    }

    /**
     * Display the specified employee details.
     */
    public function show(string $id_karyawan): Response
    {
        $employee = User::where('id_karyawan', $id_karyawan)->with([
            'identitasKaryawan',
            'rincianPekerjaan.departemen',
            'rincianPekerjaan.jabatan',
            'identitasKaryawan.kontakKaryawan',
            'identitasKaryawan.kontakDarurat',
            'identitasKaryawan.dokumen',
            'identitasKaryawan.education',
        ])->firstOrFail();

        return Inertia::render('roles/hrd/karyawan/daftar/Detail', [
            'employee' => $employee->toArray(),
        ]);
    }

    /**
     * Display a listing of all data change requests.
     */
    public function showChangeRequests(Request $request): Response
    {
        $allRequests = PermintaanPerubahanData::with([
                'karyawan.kontakKaryawan',
                'karyawan.rincianPekerjaan.jabatan',
                'karyawan.rincianPekerjaan.departemen'
            ])
            ->orderByDesc('diajukan_pada')
            ->get();

        $allRequests->each(function ($request) {
            $request->tipe_perubahan = ucwords(str_replace(['_', '-'], ' ', $request->tipe_perubahan));
        });

        return Inertia::render('roles/hrd/karyawan/PermintaanPerubahanData', [
            'allRequests' => $allRequests->toArray(),
        ]);
    }

    /**
     * Approve a data change request.
     */
    public function approveDataChangeRequest(Request $request, $id)
    {
        $changeRequest = PermintaanPerubahanData::findOrFail($id);
        $employee = $changeRequest->karyawan;

        if (!$employee) {
            return response()->json(['message' => 'Karyawan tidak ditemukan.'], 404);
        }

        Log::info('Approve Data Change Request', [
            'changeRequest_id' => $changeRequest->id,
            'tipe_perubahan' => $changeRequest->tipe_perubahan,
            'field_name' => $changeRequest->field_name,
            'nilai_baru' => $changeRequest->nilai_baru,
        ]);

        // Apply the change based on tipe_perubahan
        switch ($changeRequest->tipe_perubahan) {
            case 'identitas_ktp':
                $employee->{$changeRequest->field_name} = $changeRequest->nilai_baru;
                $employee->save();
                break;
            case 'kontak':
                // Assuming field_name directly corresponds to a column in KontakKaryawan
                $employee->kontakKaryawan->{$changeRequest->field_name} = $changeRequest->nilai_baru;
                $employee->kontakKaryawan->save();
                break;
            case 'pajak_jaminan_sosial':
                // Assuming field_name directly corresponds to a column in IdentitasKaryawan
                $employee->{$changeRequest->field_name} = $changeRequest->nilai_baru;
                $employee->save();
                break;
            case 'bank':
                // Assuming field_name directly corresponds to a column in KontakKaryawan
                $employee->kontakKaryawan->{$changeRequest->field_name} = $changeRequest->nilai_baru;
                $employee->kontakKaryawan->save();
                break;
            case 'nomor_telepon': // This case is now redundant if 'kontak' handles it
                $employee->kontakKaryawan->nomor_telepon = $changeRequest->nilai_baru;
                $employee->kontakKaryawan->save();
                break;
            case 'alamat': // This case is now redundant if 'kontak' handles it
                $employee->alamatKaryawan->alamat_lengkap = $changeRequest->nilai_baru;
                $employee->alamatKaryawan->save();
                break;
            // Add more cases for other fields as needed
            default:
                // Handle unknown or unsupported change types
                return response()->json(['message' => 'Jenis perubahan tidak didukung.'], 400);
        }

        $changeRequest->status = 'disetujui';
        $changeRequest->waktu_direspon = now();
        $changeRequest->save();

        return redirect()->back()->with('success', 'Permintaan perubahan data disetujui.');
    }

    /**
     * Reject a data change request.
     */
    public function rejectDataChangeRequest(Request $request, $id)
    {
        $changeRequest = PermintaanPerubahanData::findOrFail($id);
        $changeRequest->status = 'ditolak';
        $changeRequest->waktu_direspon = now();
        $changeRequest->save();

        return redirect()->back()->with('success', 'Permintaan perubahan data ditolak.');
    }
}
