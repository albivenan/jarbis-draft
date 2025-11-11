<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Keuangan\Pemasok;
use App\Models\Keuangan\BahanBaku;
use App\Models\Keuangan\PembelianBahanBaku;
use App\Models\Keuangan\PembelianBahanBakuItem;
use App\Models\User;
use App\Models\Keuangan\SumberDana;
use App\Models\Keuangan\KeuanganPengeluaranHarian;
use Illuminate\Support\Facades\Hash;

class PembelianBahanBakuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure there's at least one user and sumber dana
        $user = User::firstOrCreate(
            ['email' => 'ppic@example.com'],
            [
                'name' => 'PPIC User',
                'password' => Hash::make('password'),
                'role' => 'manajer_ppic',
            ]
        );

        $keuanganUser = User::firstOrCreate(
            ['email' => 'keuangan@example.com'],
            [
                'name' => 'Keuangan User',
                'password' => Hash::make('password'),
                'role' => 'manajer_keuangan',
            ]
        );

        SumberDana::firstOrCreate(
            ['nama_sumber' => 'Tunai'],
            [
                'tipe_sumber' => 'Tunai',
                'deskripsi' => 'Kas tunai perusahaan',
                'saldo' => 50000000,
                'is_main_account' => false // Cash is not a 'main account' in the bank sense
            ]
        );
        $sumberDanaBankUtama = SumberDana::firstOrCreate(
            ['nama_sumber' => 'Bank BCA'],
            [
                'tipe_sumber' => 'Bank',
                'deskripsi' => 'Rekening bank utama perusahaan',
                'saldo' => 250000000,
                'is_main_account' => true
            ]
        );
        SumberDana::firstOrCreate(
            ['nama_sumber' => 'Bank Mandiri'],
            [
                'tipe_sumber' => 'Bank',
                'deskripsi' => 'Rekening bank sekunder',
                'saldo' => 75000000,
                'is_main_account' => false
            ]
        );

        // 1. Create Pemasok
        $pemasok1 = Pemasok::firstOrCreate(['nama_pemasok' => 'PT. Kayu Jaya'], [
            'alamat' => 'Jl. Raya Kayu No. 123',
            'telepon' => '081234567890',
            'email' => 'kayujaya@example.com',
        ]);
        $pemasok2 = Pemasok::firstOrCreate(['nama_pemasok' => 'CV. Besi Kuat'], [
            'alamat' => 'Jl. Baja No. 45',
            'telepon' => '087654321098',
            'email' => 'besikuat@example.com',
        ]);
        $pemasok3 = Pemasok::firstOrCreate(['nama_pemasok' => 'UD. Cat Warna'], [
            'alamat' => 'Jl. Warna Warni No. 78',
            'telepon' => '085000111222',
            'email' => 'catwarna@example.com',
        ]);

        // 2. Create BahanBaku
        $bahanBaku1 = BahanBaku::firstOrCreate(['nama_bahan_baku' => 'Kayu Jati'], [
            'deskripsi' => 'Kayu jati kualitas super',
            'satuan_dasar' => 'm3',
            'harga_standar' => 5000000,
            'pemasok_id' => $pemasok1->id,
        ]);
        $bahanBaku2 = BahanBaku::firstOrCreate(['nama_bahan_baku' => 'Besi Hollow'], [
            'deskripsi' => 'Besi hollow 4x4 tebal 1.8mm',
            'satuan_dasar' => 'batang',
            'harga_standar' => 75000,
            'pemasok_id' => $pemasok2->id,
        ]);
        $bahanBaku3 = BahanBaku::firstOrCreate(['nama_bahan_baku' => 'Cat Dasar Anti Karat'], [
            'deskripsi' => 'Cat dasar untuk besi anti karat',
            'satuan_dasar' => 'liter',
            'harga_standar' => 120000,
            'pemasok_id' => $pemasok3->id,
        ]);
        $bahanBaku4 = BahanBaku::firstOrCreate(['nama_bahan_baku' => 'Paku Beton'], [
            'deskripsi' => 'Paku beton ukuran 5cm',
            'satuan_dasar' => 'kg',
            'harga_standar' => 15000,
            'pemasok_id' => $pemasok2->id,
        ]);

        // 3. Create PembelianBahanBaku (Purchase Batches)
        // Batch 1: Pending (PPIC input)
        $batch1 = PembelianBahanBaku::firstOrCreate(['nomor_batch' => 'PB-20251108-001'], [
            'waktu_batch' => now()->subDays(5),
            'status_batch' => 'Pending',
            'status_pembayaran' => 'Belum Dibayar',
            'total_harga_batch' => 0, // Will be calculated from items
            'dibuat_oleh_id' => $user->id,
        ]);
        PembelianBahanBakuItem::firstOrCreate(['pembelian_bahan_baku_id' => $batch1->id, 'bahan_baku_id' => $bahanBaku1->id], [
            'nama_item' => $bahanBaku1->nama_bahan_baku,
            'jumlah' => 2,
            'satuan' => 'm3',
            'harga_satuan' => $bahanBaku1->harga_standar,
            'total_harga_item' => 2 * $bahanBaku1->harga_standar,
            'status_item' => 'Pending',
        ]);
        PembelianBahanBakuItem::firstOrCreate(['pembelian_bahan_baku_id' => $batch1->id, 'bahan_baku_id' => $bahanBaku4->id], [
            'nama_item' => $bahanBaku4->nama_bahan_baku,
            'jumlah' => 10,
            'satuan' => 'kg',
            'harga_satuan' => $bahanBaku4->harga_standar,
            'total_harga_item' => 10 * $bahanBaku4->harga_standar,
            'status_item' => 'Pending',
        ]);
        $batch1->total_harga_batch = $batch1->items->sum('total_harga_item');
        $batch1->save();

        // Batch 2: Diajukan (Submitted to Keuangan)
        $batch2 = PembelianBahanBaku::firstOrCreate(['nomor_batch' => 'PB-20251107-002'], [
            'waktu_batch' => now()->subDays(3),
            'status_batch' => 'Diajukan',
            'status_pembayaran' => 'Belum Dibayar',
            'total_harga_batch' => 0,
            'dibuat_oleh_id' => $user->id,
        ]);
        PembelianBahanBakuItem::firstOrCreate(['pembelian_bahan_baku_id' => $batch2->id, 'bahan_baku_id' => $bahanBaku2->id], [
            'nama_item' => $bahanBaku2->nama_bahan_baku,
            'jumlah' => 50,
            'satuan' => 'batang',
            'harga_satuan' => $bahanBaku2->harga_standar,
            'total_harga_item' => 50 * $bahanBaku2->harga_standar,
            'status_item' => 'Diterima',
        ]);
        PembelianBahanBakuItem::firstOrCreate(['pembelian_bahan_baku_id' => $batch2->id, 'bahan_baku_id' => $bahanBaku3->id], [
            'nama_item' => $bahanBaku3->nama_bahan_baku,
            'jumlah' => 5,
            'satuan' => 'liter',
            'harga_satuan' => $bahanBaku3->harga_standar,
            'total_harga_item' => 5 * $bahanBaku3->harga_standar,
            'status_item' => 'Diterima',
        ]);
        PembelianBahanBakuItem::firstOrCreate(['pembelian_bahan_baku_id' => $batch2->id, 'bahan_baku_id' => $bahanBaku4->id], [
            'nama_item' => $bahanBaku4->nama_bahan_baku,
            'jumlah' => 20,
            'satuan' => 'kg',
            'harga_satuan' => $bahanBaku4->harga_standar,
            'total_harga_item' => 20 * $bahanBaku4->harga_standar,
            'status_item' => 'Ditolak', // Example of a rejected item
        ]);
        $batch2->total_harga_batch = $batch2->items->where('status_item', 'Diterima')->sum('total_harga_item');
        $batch2->save();

        // Batch 3: Disetujui & Sudah Dibayar
        $batch3 = PembelianBahanBaku::firstOrCreate(['nomor_batch' => 'PB-20251106-003'], [
            'waktu_batch' => now()->subDays(7),
            'status_batch' => 'Disetujui',
            'metode_pembayaran' => 'Transfer',
            'status_pembayaran' => 'Sudah Dibayar',
            'total_harga_batch' => 0,
            'dibuat_oleh_id' => $user->id,
            'disetujui_oleh_id' => $keuanganUser->id,
            'tanggal_disetujui' => now()->subDays(6),
            'sumber_dana_id' => $sumberDanaBankUtama->id,
        ]);
        PembelianBahanBakuItem::firstOrCreate(['pembelian_bahan_baku_id' => $batch3->id, 'bahan_baku_id' => $bahanBaku1->id, 'status_item' => 'Diterima & Dibayar'], [
            'nama_item' => $bahanBaku1->nama_bahan_baku,
            'jumlah' => 1,
            'satuan' => 'm3',
            'harga_satuan' => $bahanBaku1->harga_standar,
            'total_harga_item' => 1 * $bahanBaku1->harga_standar,
        ]);
        $batch3->total_harga_batch = $batch3->items->where('status_item', 'Diterima & Dibayar')->sum('total_harga_item');
        $batch3->save();

        // Create the corresponding expense history record for the seeded paid batch
        KeuanganPengeluaranHarian::create([
            'waktu' => $batch3->tanggal_disetujui,
            'description' => 'pembayaran (' . $batch3->nomor_batch . ')',
            'user_id' => $batch3->dibuat_oleh_id,
            'jenis_pengeluaran' => 'Pembelian Bahan Baku',
            'amount' => $batch3->total_harga_batch,
            'status' => 'Final',
            'sumber_dana_id' => $batch3->sumber_dana_id,
            'pembelian_bahan_baku_id' => $batch3->id,
            'saldo_sebelum' => $sumberDanaBankUtama->saldo + $batch3->total_harga_batch, // Assuming balance was deducted
            'saldo_setelah' => $sumberDanaBankUtama->saldo,
        ]);

        // Create the corresponding expense history record for the seeded paid batch
        KeuanganPengeluaranHarian::create([
            'waktu' => $batch3->tanggal_disetujui,
            'description' => 'pembayaran (' . $batch3->nomor_batch . ')',
            'user_id' => $batch3->dibuat_oleh_id,
            'jenis_pengeluaran' => 'Perusahaan',
            'amount' => $batch3->total_harga_batch,
            'status' => 'Final',
            'sumber_dana_id' => $batch3->sumber_dana_id,
            'pembelian_bahan_baku_id' => $batch3->id,
            'saldo_sebelum' => $sumberDanaBankUtama->saldo + $batch3->total_harga_batch, // Assuming balance was deducted
            'saldo_setelah' => $sumberDanaBankUtama->saldo,
        ]);

        // Batch 4: Ditolak
        $batch4 = PembelianBahanBaku::firstOrCreate(['nomor_batch' => 'PB-20251105-004'], [
            'waktu_batch' => now()->subDays(10),
            'status_batch' => 'Ditolak',
            'status_pembayaran' => 'Pembayaran Ditolak',
            'total_harga_batch' => 0,
            'dibuat_oleh_id' => $user->id,
            'disetujui_oleh_id' => $keuanganUser->id,
            'tanggal_disetujui' => now()->subDays(9),
        ]);
        PembelianBahanBakuItem::firstOrCreate(['pembelian_bahan_baku_id' => $batch4->id, 'bahan_baku_id' => $bahanBaku2->id, 'status_item' => 'Ditolak'], [
            'nama_item' => $bahanBaku2->nama_bahan_baku,
            'jumlah' => 10,
            'satuan' => 'batang',
            'harga_satuan' => $bahanBaku2->harga_standar,
            'total_harga_item' => 10 * $bahanBaku2->harga_standar,
        ]);
        $batch4->total_harga_batch = $batch4->items->where('status_item', 'Diterima')->sum('total_harga_item'); // Should be 0
        $batch4->save();
    }
}
