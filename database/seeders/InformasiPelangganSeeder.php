<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\InformasiPelanggan; // Import the model
use App\Models\User; // Assuming User model exists for sales_rep_id and user_id

class InformasiPelangganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure there's at least one user for sales_rep_id and user_id
        $user = User::first();
        if (!$user) {
            $user = User::factory()->create(); // Create a dummy user if none exists
        }

        InformasiPelanggan::create([
            'nama_perusahaan' => 'PT. Jaya Abadi',
            'jenis_pelanggan' => 'perusahaan',
            'npwp' => '01.234.567.8-901.000',
            'batas_kredit' => 150000000.00,
            'term_pembayaran' => 30,
            'sales_rep_id' => $user->id,
            'status' => 'aktif',
            'alamat_utama_jalan' => 'Jl. Industri Raya No. 123',
            'alamat_utama_kota' => 'Jakarta Pusat',
            'alamat_utama_provinsi' => 'DKI Jakarta',
            'kode_pos_utama' => '10110',
            'telepon_utama' => '081234567890',
            'email_utama' => 'budi.santoso@jayaabadi.com',
            'kontak_person_nama' => 'Budi Santoso',
            'kontak_person_jabatan' => 'Manajer Pembelian',
            'kontak_person_hp' => '081234567890',
            'catatan' => 'Pelanggan loyal, sering order besi beton.',
            'tingkat_harga_nama' => 'Grosir',
            'tingkat_harga_diskon' => 5.00,
            'daftar_alamat_pengiriman' => [
                [
                    'nama_lokasi' => 'Proyek Gedung ABC',
                    'alamat_lengkap' => 'Jl. Gatot Subroto Kav. 45, Jakarta Selatan',
                    'kota' => 'Jakarta Selatan',
                    'provinsi' => 'DKI Jakarta',
                    'kode_pos' => '12710',
                    'penerima' => 'Bapak Budi',
                    'telepon' => '081122334455',
                ],
                [
                    'nama_lokasi' => 'Gudang Cikarang',
                    'alamat_lengkap' => 'Kawasan Industri MM2100, Blok C-1, Cikarang Barat',
                    'kota' => 'Bekasi',
                    'provinsi' => 'Jawa Barat',
                    'kode_pos' => '17520',
                    'penerima' => 'Bapak Joko',
                    'telepon' => '085566778899',
                ],
            ],
            'user_id' => $user->id, // If customer can login
        ]);

        InformasiPelanggan::create([
            'nama_perusahaan' => 'CV. Sinar Terang',
            'jenis_pelanggan' => 'perusahaan',
            'npwp' => '02.345.678.9-012.000',
            'batas_kredit' => 75000000.00,
            'term_pembayaran' => 15,
            'sales_rep_id' => $user->id,
            'status' => 'prospek',
            'alamat_utama_jalan' => 'Jl. Raya Bogor Km. 20',
            'alamat_utama_kota' => 'Depok',
            'alamat_utama_provinsi' => 'Jawa Barat',
            'kode_pos_utama' => '16411',
            'telepon_utama' => '087654321098',
            'email_utama' => 'siti.aminah@sinarterang.co.id',
            'kontak_person_nama' => 'Siti Aminah',
            'kontak_person_jabatan' => 'Direktur',
            'kontak_person_hp' => '087654321098',
            'catatan' => 'Potensi besar untuk proyek perumahan baru.',
            'tingkat_harga_nama' => 'Eceran',
            'tingkat_harga_diskon' => 0.00,
            'daftar_alamat_pengiriman' => [], // No additional shipping addresses
            'user_id' => null, // No login access
        ]);
    }
}
