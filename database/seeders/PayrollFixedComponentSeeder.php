<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PayrollFixedComponent;
use Carbon\Carbon;

class PayrollFixedComponentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PayrollFixedComponent::create([
            'nama' => 'Tunjangan Jabatan Manajer',
            'jenis' => 'tunjangan',
            'tipe' => 'nominal',
            'jumlah' => 1500000,
            'keterangan' => 'Untuk level manajer ke atas',
            'valid_from' => Carbon::now()->subMonths(6),
            'valid_to' => null,
        ]);

        PayrollFixedComponent::create([
            'nama' => 'Potongan BPJS Kesehatan',
            'jenis' => 'potongan',
            'tipe' => 'persentase',
            'jumlah' => 1, // 1%
            'keterangan' => '1% dari Gaji Pokok (dihitung dari Upah Dasar)',
            'valid_from' => Carbon::now()->subMonths(6),
            'valid_to' => null,
        ]);

        PayrollFixedComponent::create([
            'nama' => 'Potongan BPJS Ketenagakerjaan',
            'jenis' => 'potongan',
            'tipe' => 'persentase',
            'jumlah' => 2, // 2%
            'keterangan' => '2% dari Gaji Pokok (dihitung dari Upah Dasar)',
            'valid_from' => Carbon::now()->subMonths(6),
            'valid_to' => null,
        ]);

        // Add more sample data if needed
    }
}