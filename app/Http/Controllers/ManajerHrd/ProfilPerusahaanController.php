<?php

namespace App\Http\Controllers\ManajerHrd;

use App\Http\Controllers\Controller;
use App\Models\ProfilPerusahaan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfilPerusahaanController extends Controller
{
    public function show()
    {
        $profilPerusahaan = ProfilPerusahaan::firstOrNew([]);

        // Calculate total employee count
        $totalEmployeeCount = User::whereNotIn('role', ['direktur', 'software_engineer'])->count();

        return Inertia::render('roles.hrd.administrasi.profil-perusahaan', [
            'profilPerusahaan' => $profilPerusahaan,
            'totalEmployeeCount' => $totalEmployeeCount,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'nama_perusahaan' => 'required|string|max:255',
            'alamat_perusahaan' => 'required|string',
            'nomor_telepon' => 'nullable|string|max:20',
            'email_perusahaan' => 'nullable|email|max:255|unique:profil_perusahaan,email_perusahaan,' . ($request->id ?? 'NULL') . ',id',
            'website' => 'nullable|url|max:255',
            'npwp_perusahaan' => 'nullable|string|max:25|unique:profil_perusahaan,npwp_perusahaan,' . ($request->id ?? 'NULL') . ',id',
            'sejarah_singkat' => 'nullable|string',
            'visi' => 'nullable|string',
            'misi' => 'nullable|string',
            'nilai_nilai' => 'nullable|array',
            'sertifikasi' => 'nullable|array',
            'nama_legal' => 'nullable|string|max:255',
            'industri' => 'nullable|string|max:255',
            'tahun_berdiri' => 'nullable|string|max:4',
            'lisensi_bisnis' => 'nullable|string|max:255',
            'media_sosial' => 'nullable|array',
            'logo_url' => 'nullable|url|max:255',
            'direktur' => 'nullable|array',
            'direktur.nama' => 'nullable|string|max:255',
            'direktur.foto_url' => 'nullable|url|max:255',
            'komisaris' => 'nullable|array',
            'komisaris.nama' => 'nullable|string|max:255',
            'komisaris.foto_url' => 'nullable|url|max:255',
        ]);

        $profilPerusahaan = ProfilPerusahaan::firstOrNew([]);
        $profilPerusahaan->fill($request->all());
        $profilPerusahaan->save();

        return redirect()->back()->with('success', 'Profil perusahaan berhasil diperbarui!');
    }
}
