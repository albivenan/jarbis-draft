<?php

namespace Database\Seeders;

use App\Models\Keuangan\KeuanganPemasukanHarian;
use App\Models\Keuangan\SumberDana;
use App\Models\Keuangan\KeuanganTransaksiPembeli; // Added import for KeuanganTransaksiPembeli
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Carbon\Carbon;

class KeuanganPemasukanHarianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID'); // Menggunakan Faker dengan lokal Indonesia
        $users = User::all(); // Ambil semua user yang ada

        // Pastikan ada user di database, jika tidak, buat satu
        if ($users->isEmpty()) {
            $this->call(UserSeeder::class); // Panggil UserSeeder jika belum ada user
            $users = User::all(); // Ambil user lagi setelah seeder dijalankan
        }

        // Pastikan ada SumberDana, jika tidak, buat satu (misalnya Tunai)
        if (SumberDana::count() === 0) {
            SumberDana::create(
                [
                    'nama_sumber' => 'Kas Tunai Utama',
                    'tipe_sumber' => 'Tunai',
                    'saldo' => 1000000, // Saldo awal
                    'deskripsi' => 'Sumber dana tunai utama untuk transaksi harian.',
                    'is_main_account' => true,
                ]
            );
            SumberDana::create(
                [
                    'nama_sumber' => 'Bank BCA',
                    'tipe_sumber' => 'Bank',
                    'nomor_rekening' => '1234567890',
                    'nama_bank' => 'BCA',
                    'nama_pemilik_rekening' => 'PT JARBIS INDONESIA',
                    'saldo' => 5000000, // Saldo awal
                    'deskripsi' => 'Rekening bank utama BCA.',
                    'is_main_account' => false,
                ]
            );
        }

        $sumberDanaIds = SumberDana::pluck('id')->toArray(); // Ambil semua ID SumberDana yang ada

        // --- Start: Create KeuanganTransaksiPembeli entries ---
        if (KeuanganTransaksiPembeli::count() === 0) {
            for ($i = 0; $i < 10; $i++) { // Create 10 dummy buyers
                KeuanganTransaksiPembeli::create([
                    'nama_pembeli' => $faker->name,
                    'email_pembeli' => $faker->unique()->safeEmail,
                    'telepon_pembeli' => $faker->phoneNumber,
                    'alamat_pembeli' => $faker->address,
                ]);
            }
        }
        $pembeliIds = KeuanganTransaksiPembeli::pluck('id')->toArray();
        // --- End: Create KeuanganTransaksiPembeli entries ---


        // Hitung tanggal mulai (2 bulan lalu) dan tanggal akhir (akhir bulan ini)
        $startDate = Carbon::now()->subMonths(2)->startOfDay();
        $endDate = Carbon::now()->endOfMonth()->endOfDay();

        // Jenis pemasukan yang mungkin (sesuai dengan enum di controller)
        $jenisPemasukanOptions = ['Pemasukan Operasional (Utama)', 'Pemasukan Non-Operasional (Tambahan)', 'Pemasukan Internal / Koreksi'];
        // Status yang mungkin (sesuai dengan enum di controller)
        $statusOptions = ['Draft', 'Final'];

        // Loop dari tanggal mulai hingga tanggal akhir
        for ($date = $startDate; $date->lte($endDate); $date->addDay()) {
            // Untuk setiap hari, buat antara 1 hingga 5 entri pemasukan acak
            $numberOfEntries = $faker->numberBetween(1, 5);

            for ($i = 0; $i < $numberOfEntries; $i++) {
                $sumberDanaId = $faker->randomElement($sumberDanaIds);
                $status = $faker->randomElement($statusOptions);
                
                $pembeliId = null;
                $jenisPemasukan = null;
                $description = null;
                $status = $faker->randomElement($statusOptions); // Default status

                // Decide if this should be a 'Penjualan Produk' entry
                if ($faker->boolean(40)) { // 40% chance to be a product sale
                    $pembeliId = $faker->randomElement($pembeliIds);
                    $pembeli = KeuanganTransaksiPembeli::find($pembeliId);
                    if ($pembeli) {
                        $description = 'Penjualan pesanan: ' . $pembeli->nama_pembeli;
                        $jenisPemasukan = 'Pemasukan Penjualan Produk';
                        // For sales, status can be 'DP' or 'Final' (Lunas)
                        $status = $faker->randomElement(['DP', 'Final']);
                    }
                } 
                
                // If not a product sale, assign other types
                if (is_null($jenisPemasukan)) {
                    $jenisPemasukan = $faker->randomElement($jenisPemasukanOptions);
                    $description = $faker->sentence(3);
                    // For non-sales, status remains 'Draft' or 'Final'
                    $status = $faker->randomElement($statusOptions);
                }

                $amount = $faker->randomFloat(2, 100000, 5000000);

                $pemasukan = KeuanganPemasukanHarian::create([
                    'user_id' => $faker->randomElement($users->pluck('id')->toArray()),
                    'sumber_dana_id' => $sumberDanaId,
                    'keuangan_transaksi_pembeli_id' => $pembeliId,
                    'waktu' => $date->copy()->addHours($faker->numberBetween(0, 23))->addMinutes($faker->numberBetween(0, 59))->toDateTimeString(),
                    'description' => $description,
                    'amount' => $amount,
                    'jenis_pemasukan' => $jenisPemasukan,
                    'catatan' => $faker->boolean(70) ? $faker->paragraph(2) : null,
                    'invoice_path' => $faker->boolean(50) ? 'invoices/' . $faker->uuid() . '.pdf' : null,
                    'status' => $status,
                    'created_at' => $date->copy()->addHours($faker->numberBetween(0, 23))->addMinutes($faker->numberBetween(0, 59)),
                    'updated_at' => $date->copy()->addHours($faker->numberBetween(0, 23))->addMinutes($faker->numberBetween(0, 59)),
                ]);
                \Illuminate\Support\Facades\Log::debug('Seeded Pemasukan: ' . $pemasukan->toJson());

                // Update saldo SumberDana jika status Final
                if ($status === 'Final') {
                    $sumberDana = SumberDana::find($sumberDanaId);
                    if ($sumberDana) {
                        $sumberDana->increment('saldo', $amount);
                    }
                }
            }
        }
    }
}
