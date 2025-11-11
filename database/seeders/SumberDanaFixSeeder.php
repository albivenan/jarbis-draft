<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SumberDana;
use Illuminate\Support\Facades\DB;

class SumberDanaFixSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->command->info('Seeding Sumber Dana (Fixed)...');

        // Clear existing SumberDana entries to prevent duplicates and remove unwanted ones
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        SumberDana::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Insert only the desired SumberDana entries
        SumberDana::create([
            'nama_sumber' => 'Tunai',
            'tipe_sumber' => 'Tunai',
            'saldo' => 5000000, // Realistic initial saldo
            'deskripsi' => 'Kas tunai perusahaan untuk transaksi harian.',
            'is_main_account' => 0,
        ]);

        SumberDana::create([
            'nama_sumber' => 'Bank BCA',
            'tipe_sumber' => 'Bank',
            'nomor_rekening' => '1234567890',
            'nama_bank' => 'BCA',
            'nama_pemilik_rekening' => 'PT JARBIS INDONESIA',
            'saldo' => 150000000, // Realistic initial saldo
            'deskripsi' => 'Rekening bank utama BCA.',
            'is_main_account' => 0,
        ]);

        SumberDana::create([
            'nama_sumber' => 'Bank Mandiri',
            'tipe_sumber' => 'Bank',
            'nomor_rekening' => '0987654321',
            'nama_bank' => 'Mandiri',
            'nama_pemilik_rekening' => 'PT JARBIS INDONESIA',
            'saldo' => 75000000, // Realistic initial saldo
            'deskripsi' => 'Rekening bank sekunder Mandiri.',
            'is_main_account' => 0,
        ]);

        $this->command->info('Sumber Dana (Fixed) seeded successfully.');
    }
}
