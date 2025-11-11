<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProfilPerusahaan;

class ProfilPerusahaanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProfilPerusahaan::truncate();

        ProfilPerusahaan::create([
            'nama_perusahaan' => 'PT. Jarbis Indonesia',
            'nama_legal' => 'PT. Jarbis Indonesia Tbk',
            'industri' => 'Manufaktur & Konstruksi',
            'tahun_berdiri' => '2015',
            'alamat_perusahaan' => 'Jl. Industri Raya No. 123, Kawasan Industri Pulogadung, Jakarta Timur, 13260, Indonesia',
            'nomor_telepon' => '+62 21 5555-0123',
            'email_perusahaan' => 'info@jarbisindonesia.com',
            'website' => 'https://www.jarbisindonesia.com',
            'npwp_perusahaan' => '01.234.567.8-901.000',
            'lisensi_bisnis' => '0123456789012345',
            'sejarah_singkat' => 'PT. Jarbis Indonesia adalah perusahaan manufaktur terkemuka yang bergerak di bidang produksi besi dan kayu berkualitas tinggi untuk industri konstruksi dan furniture. Dengan pengalaman lebih dari 8 tahun, kami telah melayani berbagai proyek besar di Indonesia.',
            'visi' => 'Menjadi perusahaan manufaktur besi dan kayu terdepan di Indonesia yang dikenal karena kualitas produk, inovasi, dan komitmen terhadap keberlanjutan lingkungan.',
            'misi' => 'Menyediakan produk besi dan kayu berkualitas tinggi dengan standar internasional, memberikan solusi terbaik untuk kebutuhan konstruksi dan furniture, serta berkontribusi pada pembangunan infrastruktur Indonesia.',
            'nilai_nilai' => [
                'Kualitas Terjamin',
                'Inovasi Berkelanjutan',
                'Integritas Tinggi',
                'Kepuasan Pelanggan',
                'Tanggung Jawab Lingkungan',
                'Pengembangan SDM'
            ],
            'sertifikasi' => [
                [
                    'name' => 'ISO 9001:2015',
                    'issuer' => 'BSI Group',
                    'date' => '2022-03-15',
                    'expiryDate' => '2025-03-15',
                    'url' => 'https://example.com/iso9001.pdf'
                ],
                [
                    'name' => 'ISO 14001:2015',
                    'issuer' => 'TUV Rheinland',
                    'date' => '2022-06-20',
                    'expiryDate' => '2025-06-20',
                    'url' => 'https://example.com/iso14001.pdf'
                ],
            ],
            'media_sosial' => [
                'linkedin' => 'https://linkedin.com/company/jarbis-indonesia',
                'facebook' => 'https://facebook.com/jarbisindonesia',
                'instagram' => 'https://instagram.com/jarbisindonesia',
                'twitter' => 'https://twitter.com/jarbisindonesia'
            ],
            'logo_url' => 'https://example.com/logo.png',
            'direktur' => [
                'nama' => 'Budi Santoso',
                'foto_url' => 'https://example.com/budi_santoso.jpg',
            ],
            'komisaris' => [
                'nama' => 'Siti Aminah',
                'foto_url' => 'https://example.com/siti_aminah.jpg',
            ],
        ]);
    }
}
