<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Jabatan;
use App\Models\BagianKerja;
use App\Models\GajiPokokSetting;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            CompleteDatabaseSeeder::class,
            PayrollSettingSeeder::class,
            ProfilPerusahaanSeeder::class,
            PayrollFixedComponentSeeder::class,
            SopSeeder::class,
            // KeuanganPemasukanHarianSeeder::class,
            // KeuanganPengeluaranHarianSeeder::class,
            // KasDanBankSeeder::class, // Removed as SumberDanaFixSeeder handles funding sources
            // SumberDanaFixSeeder::class, // New seeder for fixed SumberDana entries
            // PembelianBahanBakuSeeder::class,
        ]);

        $this->call(InformasiPelangganSeeder::class);

        // Seeding for Gaji Pokok Settings
        $this->command->info('Seeding Gaji Pokok Settings...');

        $jabatanManajer = Jabatan::where('nama_jabatan', 'Manajer')->first();
        $jabatanSupervisor = Jabatan::where('nama_jabatan', 'Supervisor')->first();
        $jabatanCrew = Jabatan::where('nama_jabatan', 'Crew')->first();

        $bagianProduksi = BagianKerja::where('nama_bagian_kerja', 'Produksi')->first();
        $bagianFinishing = BagianKerja::where('nama_bagian_kerja', 'Finishing')->first();

        if ($jabatanManajer) {
            GajiPokokSetting::updateOrCreate(
                ['id_jabatan' => $jabatanManajer->id, 'id_bagian_kerja' => null, 'senioritas' => 'Senior'],
                ['tarif_per_jam' => 75000]
            );
        }

        if ($jabatanSupervisor) {
            GajiPokokSetting::updateOrCreate(
                ['id_jabatan' => $jabatanSupervisor->id, 'id_bagian_kerja' => null, 'senioritas' => 'Senior'],
                ['tarif_per_jam' => 50000]
            );
        }

        if ($jabatanCrew && $bagianProduksi) {
            GajiPokokSetting::updateOrCreate(
                ['id_jabatan' => $jabatanCrew->id, 'id_bagian_kerja' => $bagianProduksi->id, 'senioritas' => 'Senior'],
                ['tarif_per_jam' => 35000]
            );
            GajiPokokSetting::updateOrCreate(
                ['id_jabatan' => $jabatanCrew->id, 'id_bagian_kerja' => $bagianProduksi->id, 'senioritas' => 'Junior'],
                ['tarif_per_jam' => 30000]
            );
        }

        if ($jabatanCrew && $bagianFinishing) {
            GajiPokokSetting::updateOrCreate(
                ['id_jabatan' => $jabatanCrew->id, 'id_bagian_kerja' => $bagianFinishing->id, 'senioritas' => 'Senior'],
                ['tarif_per_jam' => 36000]
            );
            GajiPokokSetting::updateOrCreate(
                ['id_jabatan' => $jabatanCrew->id, 'id_bagian_kerja' => $bagianFinishing->id, 'senioritas' => 'Junior'],
                ['tarif_per_jam' => 31000]
            );
        }

        $this->command->info('Gaji Pokok Settings seeded.');
    }
}
