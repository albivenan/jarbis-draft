<?php

namespace Database\Seeders;

use App\Models\Keuangan\KeuanganPengeluaranHarian;
use App\Models\Keuangan\SumberDana;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Carbon\Carbon;

class KeuanganPengeluaranHarianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $users = User::all();

        if ($users->isEmpty()) {
            $this->call(UserSeeder::class);
            $users = User::all();
        }

        // Ensure SumberDana exists (can be created by KeuanganPemasukanHarianSeeder)
        if (SumberDana::count() === 0) {
            $this->call(SumberDanaSeeder::class); // Assuming you have a SumberDanaSeeder or it's created elsewhere
        }

        $sumberDanaIds = SumberDana::pluck('id')->toArray();

        $startDate = Carbon::now()->subMonths(2)->startOfDay();
        $endDate = Carbon::now()->endOfMonth()->endOfDay();

        $jenisPengeluaranOptions = ['Pengeluaran Operasional (Utama)', 'Pengeluaran Non-Operasional (Tambahan)', 'Pengeluaran Internal / Koreksi'];
        $statusOptions = ['Draft', 'Final'];

        for ($date = $startDate; $date->lte($endDate); $date->addDay()) {
            $numberOfEntries = $faker->numberBetween(1, 5);

            for ($i = 0; $i < $numberOfEntries; $i++) {
                $sumberDanaId = $faker->randomElement($sumberDanaIds);
                $status = $faker->randomElement($statusOptions);

                $pengeluaran = KeuanganPengeluaranHarian::create([
                    'user_id' => $faker->randomElement($users->pluck('id')->toArray()),
                    'sumber_dana_id' => $sumberDanaId,
                    'waktu' => $date->copy()->addHours($faker->numberBetween(0, 23))->addMinutes($faker->numberBetween(0, 59))->toDateTimeString(),
                    'description' => $faker->sentence(3),
                    'amount' => $amount = $faker->randomFloat(2, 50000, 2000000),
                    'jenis_pengeluaran' => $faker->randomElement($jenisPengeluaranOptions),
                    'catatan' => $faker->boolean(70) ? $faker->paragraph(2) : null,
                    'invoice_path' => $faker->boolean(50) ? 'invoices/' . $faker->uuid() . '.pdf' : null,
                    'status' => $status,
                    'created_at' => $date->copy()->addHours($faker->numberBetween(0, 23))->addMinutes($faker->numberBetween(0, 59)),
                    'updated_at' => $date->copy()->addHours($faker->numberBetween(0, 23))->addMinutes($faker->numberBetween(0, 59)),
                ]);

                // Update saldo SumberDana jika status Final
                if ($status === 'Final') {
                    $sumberDana = SumberDana::find($sumberDanaId);
                    if ($sumberDana) {
                        $sumberDana->decrement('saldo', $amount);
                    }
                }
            }
        }
    }
}
