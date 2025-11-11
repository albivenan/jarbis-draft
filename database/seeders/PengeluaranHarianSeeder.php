<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PengeluaranHarianSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\PengeluaranHarian::create([
            'tanggal' => '2024-10-20',
            'deskripsi' => 'Pembelian ATK Kantor',
            'karyawan_id' => 1,
            'tujuan_biaya' => 'Operasional Kantor',
            'jenis_pengeluaran' => 'Perusahaan',
            'jumlah' => 150000,
            'status' => 'Approved',
            'approver_id' => 2,
            'lampiran_path' => 'attachments/atk.pdf',
        ]);
        \App\Models\PengeluaranHarian::create([
            'tanggal' => '2024-10-22',
            'deskripsi' => 'Biaya Listrik Bulan September',
            'karyawan_id' => 1,
            'tujuan_biaya' => 'Utilitas',
            'jenis_pengeluaran' => 'Perusahaan',
            'jumlah' => 750000,
            'status' => 'Pending',
            'approver_id' => null,
            'lampiran_path' => 'attachments/listrik.pdf',
        ]);
        \App\Models\PengeluaranHarian::create([
            'tanggal' => '2024-10-15',
            'deskripsi' => 'Reimbursement transport meeting klien',
            'karyawan_id' => 2,
            'tujuan_biaya' => 'Marketing & Penjualan',
            'jenis_pengeluaran' => 'Reimbursement',
            'jumlah' => 300000,
            'status' => 'Approved',
            'approver_id' => 1,
            'lampiran_path' => 'attachments/transport.jpg',
        ]);
        \App\Models\PengeluaranHarian::create([
            'tanggal' => '2024-10-18',
            'deskripsi' => 'Pembelian software desain',
            'karyawan_id' => 2,
            'tujuan_biaya' => 'Marketing & Penjualan',
            'jenis_pengeluaran' => 'Perusahaan',
            'jumlah' => 2500000,
            'status' => 'Rejected',
            'approver_id' => 1,
            'lampiran_path' => null,
        ]);
    }
}
