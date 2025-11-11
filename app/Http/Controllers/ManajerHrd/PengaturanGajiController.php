<?php

namespace App\Http\Controllers\ManajerHrd;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Jabatan;
use App\Models\BagianKerjaKaryawan;

class PengaturanGajiController extends Controller
{
    public function show()
    {
        $jabatans = Jabatan::with('bagianKerjaKaryawan')->get()->map(function ($jabatan) {
            return [
                'id' => $jabatan->id_jabatan,
                'nama' => $jabatan->nama_jabatan,
                'bagian_kerja' => $jabatan->bagianKerjaKaryawan->map(function ($bagian) {
                    return [
                        'id' => $bagian->id_bagian_kerja,
                        'nama' => $bagian->nama_bagian_kerja,
                    ];
                })->toArray(),
            ];
        });

        // Fetch existing tarif_per_jam_settings and format them for frontend
        $tarifPerJamRules = DB::table('gaji_pokok_settings')->get()->mapWithKeys(function ($setting) {
            $key = "{$setting->id_jabatan}-";
            $key .= $setting->id_bagian_kerja ? "{$setting->id_bagian_kerja}-" : "default-";
            $key .= $setting->senioritas ? "{$setting->senioritas}" : "default";
            return [$key => $setting->tarif_per_jam]; // Use tarif_per_jam
        })->toArray();

        // Fetch standar_jam_kerja from payroll_settings
        $standarJamKerja = DB::table('payroll_settings')->where('setting_key', 'standar_jam_kerja')->value('setting_value') ?? 8; // Default to 8 if not found

        return Inertia::render('roles/hrd/penggajian/pengaturan', [
            'jabatans' => $jabatans,
            'tarifPerJamRules' => $tarifPerJamRules, // Renamed prop
            'standarJamKerja' => (int)$standarJamKerja, // Pass as prop
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'tarifPerJamRules' => ['required', 'array'], // Renamed validation key
            'tarifPerJamRules.*' => ['nullable', 'integer', 'min:0'],
        ]);

        $rules = $request->input('tarifPerJamRules'); // Renamed input key

        DB::beginTransaction();
        try {
            foreach ($rules as $key => $tarif_per_jam) { // Renamed variable
                list($id_jabatan, $id_bagian_kerja, $senioritas) = explode('-', $key);

                if (is_null($tarif_per_jam)) {
                    DB::table('gaji_pokok_settings')
                        ->where('id_jabatan', $id_jabatan)
                        ->where('id_bagian_kerja', $id_bagian_kerja === 'default' ? null : $id_bagian_kerja)
                        ->where('senioritas', $senioritas === 'default' ? null : $senioritas)
                        ->delete();
                    continue;
                }

                DB::table('gaji_pokok_settings')->updateOrInsert(
                    [
                        'id_jabatan' => $id_jabatan,
                        'id_bagian_kerja' => $id_bagian_kerja === 'default' ? null : $id_bagian_kerja,
                        'senioritas' => $senioritas === 'default' ? null : $senioritas,
                    ],
                    [
                        'tarif_per_jam' => $tarif_per_jam, // Use tarif_per_jam
                        'updated_at' => now(),
                    ]
                );
            }

            DB::commit();
            return redirect()->back()->with('success', 'Pengaturan tarif per jam berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal memperbarui pengaturan tarif per jam: ' . $e->getMessage());
        }
    }
}
