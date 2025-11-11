<?php

namespace App\Http\Controllers\Crew;

use App\Http\Controllers\Controller;
use App\Models\IdentitasKaryawan;
use App\Models\KontakKaryawan;
use App\Models\PermintaanPerubahanData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\CrewProfile\UpdateKtpRequest;
use App\Http\Requests\CrewProfile\UpdateContactRequest;
use App\Http\Requests\CrewProfile\UpdateTaxRequest;
use App\Http\Requests\CrewProfile\UpdateBankRequest;

class IdentitasDiriController extends Controller
{
    /**
     * Display the user's identity page.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();

        // Fetch the employee data from the database
        $employeeData = IdentitasKaryawan::with([
            'user',
            'kontakKaryawan',
            'rincianPekerjaan.jabatan',
            'rincianPekerjaan.departemen',
            'rincianPekerjaan.bagianKerja',
            'dokumen',
            'kontakDarurat',
            'education'
        ])->find($user->id_karyawan);

        if (!$employeeData) {
            // Handle case where employee data is not found
            return Inertia::render('Error', ['status' => 404, 'message' => 'Data karyawan tidak ditemukan.']);
        }

        Log::info('Employee Data:', ['data' => $employeeData]);

        return Inertia::render('roles/crew/identitasDiri/index', [
            'employeeData' => $employeeData->toArray(),
            'documents' => $employeeData->dokumen->toArray(),
            'emergencyContacts' => $employeeData->kontakDarurat->toArray(),
            'userEmail' => $user->email,
        ]);
    }

    /**
     * Handle KTP data update request.
     */
    public function updateKtp(UpdateKtpRequest $request)
    {
        $user = Auth::user();
        $identitasKaryawan = IdentitasKaryawan::find($user->id_karyawan);

        if (!$identitasKaryawan) {
            return back()->withErrors(['message' => 'Data karyawan tidak ditemukan.']);
        }

        DB::beginTransaction();
        try {
            foreach ($request->validated() as $field => $newValue) {
                $oldValue = $identitasKaryawan->$field;
                if ($oldValue != $newValue) {
                    PermintaanPerubahanData::create([
                        'id_karyawan' => $user->id_karyawan,
                        'tipe_perubahan' => 'identitas_ktp',
                        'field_name' => $field,
                        'nilai_lama' => $oldValue,
                        'nilai_baru' => $newValue,
                        'status' => 'pending',
                    ]);
                }
            }
            DB::commit();
            return back()->with('success', 'Pengajuan perubahan identitas KTP berhasil dikirim!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error submitting KTP data change request:', ['error' => $e->getMessage()]);
            return back()->withErrors(['message' => 'Gagal mengajukan perubahan identitas KTP.']);
        }
    }

    /**
     * Handle Contact data update request.
     */
    public function updateContact(UpdateContactRequest $request)
    {
        $user = Auth::user();
        $identitasKaryawan = IdentitasKaryawan::find($user->id_karyawan);
        $kontakKaryawan = KontakKaryawan::where('id_karyawan', $user->id_karyawan)->first();

        if (!$identitasKaryawan || !$kontakKaryawan) {
            return back()->withErrors(['message' => 'Data karyawan atau kontak tidak ditemukan.']);
        }

        DB::beginTransaction();
        try {
            foreach ($request->validated() as $field => $newValue) {
                // Determine if the field belongs to IdentitasKaryawan or KontakKaryawan
                if (in_array($field, ['alamat_domisili'])) {
                    $oldValue = $identitasKaryawan->$field;
                    if ($oldValue != $newValue) {
                        PermintaanPerubahanData::create([
                            'id_karyawan' => $user->id_karyawan,
                            'tipe_perubahan' => 'kontak',
                            'field_name' => $field,
                            'nilai_lama' => $oldValue,
                            'nilai_baru' => $newValue,
                            'status' => 'pending',
                        ]);
                    }
                } elseif (in_array($field, ['email_pribadi', 'nomor_telepon'])) {
                    $oldValue = $kontakKaryawan->$field;
                    if ($oldValue != $newValue) {
                        PermintaanPerubahanData::create([
                            'id_karyawan' => $user->id_karyawan,
                            'tipe_perubahan' => 'kontak',
                            'field_name' => $field,
                            'nilai_lama' => $oldValue,
                            'nilai_baru' => $newValue,
                            'status' => 'pending',
                        ]);
                    }
                }
            }
            DB::commit();
            return back()->with('success', 'Pengajuan perubahan informasi kontak berhasil dikirim!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error submitting contact data change request:', ['error' => $e->getMessage()]);
            return back()->withErrors(['message' => 'Gagal mengajukan perubahan informasi kontak.']);
        }
    }

    /**
     * Handle Tax data update request.
     */
    public function updateTax(UpdateTaxRequest $request)
    {
        $user = Auth::user();
        $identitasKaryawan = IdentitasKaryawan::find($user->id_karyawan);

        if (!$identitasKaryawan) {
            return back()->withErrors(['message' => 'Data karyawan tidak ditemukan.']);
        }

        DB::beginTransaction();
        try {
            foreach ($request->validated() as $field => $newValue) {
                $oldValue = $identitasKaryawan->$field;
                if ($oldValue != $newValue) {
                    PermintaanPerubahanData::create([
                        'id_karyawan' => $user->id_karyawan,
                        'tipe_perubahan' => 'pajak_jaminan_sosial',
                        'field_name' => $field,
                        'nilai_lama' => $oldValue,
                        'nilai_baru' => $newValue,
                        'status' => 'pending',
                    ]);
                }
            }
            DB::commit();
            return back()->with('success', 'Pengajuan perubahan data pajak & jaminan sosial berhasil dikirim!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error submitting tax data change request:', ['error' => $e->getMessage()]);
            return back()->withErrors(['message' => 'Gagal mengajukan perubahan data pajak & jaminan sosial.']);
        }
    }

    /**
     * Handle Bank data update request.
     */
    public function updateBank(UpdateBankRequest $request)
    {
        $user = Auth::user();
        $kontakKaryawan = KontakKaryawan::where('id_karyawan', $user->id_karyawan)->first();

        if (!$kontakKaryawan) {
            return back()->withErrors(['message' => 'Data kontak karyawan tidak ditemukan.']);
        }

        DB::beginTransaction();
        try {
            foreach ($request->validated() as $field => $newValue) {
                $oldValue = $kontakKaryawan->$field;
                if ($oldValue != $newValue) {
                    PermintaanPerubahanData::create([
                        'id_karyawan' => $user->id_karyawan,
                        'tipe_perubahan' => 'bank',
                        'field_name' => $field,
                        'nilai_lama' => $oldValue,
                        'nilai_baru' => $newValue,
                        'status' => 'pending',
                    ]);
                }
            }
            DB::commit();
            return back()->with('success', 'Pengajuan perubahan informasi bank berhasil dikirim!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error submitting bank data change request:', ['error' => $e->getMessage()]);
            return back()->withErrors(['message' => 'Gagal mengajukan perubahan informasi bank.']);
        }
    }

    /**
     * Display the history of data change requests for the authenticated user.
     */
    public function showChangeRequestHistory(Request $request): Response
    {
        $user = Auth::user();

        $historyRequests = PermintaanPerubahanData::where('id_karyawan', $user->id_karyawan)
            ->orderByDesc('diajukan_pada')
            ->get();

        $historyRequests->each(function ($req) {
            $req->tipe_perubahan = ucwords(str_replace(['_', '-'], ' ', $req->tipe_perubahan));
        });

        return Inertia::render('roles/crew/identitasDiri/history', [
            'historyRequests' => $historyRequests->toArray(),
        ]);
    }
}