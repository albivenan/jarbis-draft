<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PayrollSetting;
use Carbon\Carbon;

class PayrollSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['setting_key' => 'tarif_per_jam', 'setting_value' => '50000', 'description' => 'Tarif gaji per jam', 'valid_from' => '2023-01-01', 'valid_to' => null],
            ['setting_key' => 'standar_jam_kerja', 'setting_value' => '8', 'description' => 'Standar jam kerja per hari', 'valid_from' => '2023-01-01', 'valid_to' => null],
            ['setting_key' => 'upah_lembur_per_jam', 'setting_value' => '75000', 'description' => 'Upah lembur per jam', 'valid_from' => '2023-01-01', 'valid_to' => null],
            ['setting_key' => 'tunjangan_makan_per_hari', 'setting_value' => '15000', 'description' => 'Tunjangan makan per hari', 'valid_from' => '2023-01-01', 'valid_to' => null],
            ['setting_key' => 'tunjangan_transport_per_hari', 'setting_value' => '10000', 'description' => 'Tunjangan transport per hari', 'valid_from' => '2023-01-01', 'valid_to' => null],
            ['setting_key' => 'potongan_per_10_menit', 'setting_value' => '5000', 'description' => 'Potongan keterlambatan per 10 menit', 'valid_from' => '2023-01-01', 'valid_to' => null],
            ['setting_key' => 'periode_pembayaran', 'setting_value' => 'bulanan', 'description' => 'Periode pembayaran gaji (bulanan/mingguan)', 'valid_from' => '2023-01-01', 'valid_to' => null],
            ['setting_key' => 'tanggal_gajian', 'setting_value' => '25', 'description' => 'Tanggal gajian bulanan', 'valid_from' => '2023-01-01', 'valid_to' => null],
            ['setting_key' => 'hari_gajian_mingguan', 'setting_value' => 'jumat', 'description' => 'Hari gajian mingguan', 'valid_from' => '2023-01-01', 'valid_to' => null],
            ['setting_key' => 'bpjs_kesehatan_perusahaan', 'setting_value' => '4', 'description' => 'Persentase BPJS Kesehatan ditanggung perusahaan', 'valid_from' => '2023-01-01', 'valid_to' => null],
            ['setting_key' => 'bpjs_kesehatan_karyawan', 'setting_value' => '1', 'description' => 'Persentase BPJS Kesehatan ditanggung karyawan', 'valid_from' => '2023-01-01', 'valid_to' => null],
            ['setting_key' => 'bpjs_ketenagakerjaan_perusahaan', 'setting_value' => '6.2', 'description' => 'Persentase BPJS Ketenagakerjaan ditanggung perusahaan', 'valid_from' => '2023-01-01', 'valid_to' => null],
            ['setting_key' => 'bpjs_ketenagakerjaan_karyawan', 'setting_value' => '2', 'description' => 'Persentase BPJS Ketenagakerjaan ditanggung karyawan', 'valid_from' => '2023-01-01', 'valid_to' => null],
        ];

        foreach ($settings as $setting) {
            PayrollSetting::updateOrCreate(
                ['setting_key' => $setting['setting_key'], 'valid_from' => $setting['valid_from']],
                $setting
            );
        }
    }
}
