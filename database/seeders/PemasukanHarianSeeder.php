<?php

namespace Database\Seeders;

use App\Models\Keuangan\KeuanganPemasukanHarian;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Carbon\Carbon;

class PemasukanHarianSeeder extends Seeder
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
            // Jika UserSeeder belum ada atau tidak membuat user, Anda mungkin perlu membuat user secara manual di sini
            // Untuk tujuan testing, kita bisa membuat satu user dummy jika tidak ada
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
            ]);
            $users = User::all(); // Ambil user lagi setelah user dummy dibuat
        }

        // Hitung tanggal mulai (2 bulan lalu) dan tanggal akhir (akhir bulan ini)
        $startDate = Carbon::now()->subMonths(2)->startOfDay();
        $endDate = Carbon::now()->endOfMonth()->endOfDay();

        // Jenis pemasukan yang mungkin
        $jenisPemasukanOptions = ['Pemasukan Operasional (Utama)', 'Pemasukan Non-Operasional (Tambahan)', 'Pemasukan Internal / Koreksi'];
        // Status yang mungkin
        $statusOptions = ['Draft', 'Final'];

        // Loop dari tanggal mulai hingga tanggal akhir
        for ($date = $startDate; $date->lte($endDate); $date->addDay()) {
            // Untuk setiap hari, buat antara 1 hingga 5 entri pemasukan acak
            $numberOfEntries = $faker->numberBetween(1, 5);

            for ($i = 0; $i < $numberOfEntries; $i++) {
                KeuanganPemasukanHarian::create([
                    'user_id' => $faker->randomElement($users->pluck('id')->toArray()), // Pilih user_id secara acak
                    'sumber_dana_id' => 1, // Dummy sumber_dana_id for compatibility
                    'waktu' => $date->copy()->addHours($faker->numberBetween(0, 23))->addMinutes($faker->numberBetween(0, 59))->toDateTimeString(), // Waktu acak pada tanggal saat ini
                    'description' => $faker->sentence(3), // Deskripsi acak
                    'amount' => $faker->randomFloat(2, 100000, 5000000), // Jumlah acak antara 100rb - 5jt
                    'jenis_pemasukan' => $faker->randomElement($jenisPemasukanOptions), // Jenis pemasukan acak
                    'catatan' => $faker->boolean(70) ? $faker->paragraph(2) : null, // Catatan acak (70% kemungkinan ada)
                    'invoice_path' => $faker->boolean(50) ? 'invoices/' . $faker->uuid() . '.pdf' : null, // Path invoice acak (50% kemungkinan ada)
                    'status' => $faker->randomElement($statusOptions), // Status acak
                    'created_at' => $date->copy()->addHours($faker->numberBetween(0, 23))->addMinutes($faker->numberBetween(0, 59)),
                    'updated_at' => $date->copy()->addHours($faker->numberBetween(0, 23))->addMinutes($faker->numberBetween(0, 59)),
                ]);
            }
        }
    }
}
