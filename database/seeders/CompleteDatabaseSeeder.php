<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

// Import semua model yang dibutuhkan
use App\Models\Departemen;
use App\Models\Jabatan;
use App\Models\BagianKerja;
use App\Models\Role;
use App\Models\User;
use App\Models\IdentitasKaryawan;
use App\Models\KontakKaryawan;
use App\Models\RincianPekerjaan;
use App\Models\UserRole;
use App\Models\DokumenKaryawan;
use App\Models\KontakDarurat;
use App\Models\JadwalKerja;
use App\Models\MasterKpi;
use App\Models\KpiResult;
use App\Models\DashboardModule;
use App\Models\Presensi;
use App\Models\PayrollBatch;
use App\Models\PayrollEmployee;
use App\Models\Education;
use Carbon\Carbon;

class CompleteDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->command->info('Memulai proses seeding lengkap...');

        // --------------------------------------------------------------------
        // LANGKAH 1: KOSONGKAN SEMUA TABEL
        // --------------------------------------------------------------------
        $this->command->warn('Mengosongkan tabel...');
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        Departemen::truncate();
        Jabatan::truncate();
        BagianKerja::truncate();
        Role::truncate();
        User::truncate();
        IdentitasKaryawan::truncate();
        KontakKaryawan::truncate();
        RincianPekerjaan::truncate();
        UserRole::truncate();
        DokumenKaryawan::truncate();
        KontakDarurat::truncate();
        JadwalKerja::truncate();
        MasterKpi::truncate();
        KpiResult::truncate();
        Presensi::truncate();
        PayrollBatch::truncate();
        PayrollEmployee::truncate();
        Education::truncate();
        \App\Models\KasDanBank::truncate(); // Add this line to truncate kas_dan_bank


        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $this->command->info('Semua tabel berhasil dikosongkan.');

        // --------------------------------------------------------------------
        // LANGKAH 2: BUAT STRUKTUR PERUSAHAAN (SESUAI SQL)
        // --------------------------------------------------------------------
        $this->command->warn('Membuat struktur perusahaan (Departemen, Jabatan, Role)...');

        // Data Departemen (Disesuaikan agar lebih sederhana)
        Departemen::insert([
            ['id_departemen' => 1, 'nama_departemen' => 'Direksi'],
            ['id_departemen' => 2, 'nama_departemen' => 'HRD'],
            ['id_departemen' => 3, 'nama_departemen' => 'Marketing'],
            ['id_departemen' => 4, 'nama_departemen' => 'Keuangan'],
            ['id_departemen' => 5, 'nama_departemen' => 'PPIC'],
            ['id_departemen' => 6, 'nama_departemen' => 'Teknologi & Informasi'],
            ['id_departemen' => 7, 'nama_departemen' => 'Produksi Kayu'],
            ['id_departemen' => 8, 'nama_departemen' => 'Produksi Besi'],
        ]);

        // Data Jabatan (Disesuaikan agar cocok dengan role di ENUM)
        Jabatan::insert([
            ['id_jabatan' => 1, 'nama_jabatan' => 'Direktur', 'id_departemen' => 1],
            ['id_jabatan' => 2, 'nama_jabatan' => 'Manajer HRD', 'id_departemen' => 2],
            ['id_jabatan' => 3, 'nama_jabatan' => 'Staf HRD', 'id_departemen' => 2],
            ['id_jabatan' => 4, 'nama_jabatan' => 'Manajer Marketing', 'id_departemen' => 3],
            ['id_jabatan' => 5, 'nama_jabatan' => 'Staf Marketing', 'id_departemen' => 3],
            ['id_jabatan' => 6, 'nama_jabatan' => 'Manajer Keuangan', 'id_departemen' => 4],
            ['id_jabatan' => 7, 'nama_jabatan' => 'Staf Keuangan', 'id_departemen' => 4],
            ['id_jabatan' => 8, 'nama_jabatan' => 'Manajer PPIC', 'id_departemen' => 5],
            ['id_jabatan' => 9, 'nama_jabatan' => 'Staf PPIC', 'id_departemen' => 5],
            ['id_jabatan' => 10, 'nama_jabatan' => 'Software Engineer', 'id_departemen' => 6],
            ['id_jabatan' => 11, 'nama_jabatan' => 'Manajer Produksi Kayu', 'id_departemen' => 7],
            ['id_jabatan' => 12, 'nama_jabatan' => 'Supervisor Kayu', 'id_departemen' => 7],
            ['id_jabatan' => 13, 'nama_jabatan' => 'QC Kayu', 'id_departemen' => 7],
            ['id_jabatan' => 14, 'nama_jabatan' => 'Crew Kayu', 'id_departemen' => 7],
            ['id_jabatan' => 15, 'nama_jabatan' => 'Manajer Produksi Besi', 'id_departemen' => 8],
            ['id_jabatan' => 16, 'nama_jabatan' => 'Supervisor Besi', 'id_departemen' => 8],
            ['id_jabatan' => 17, 'nama_jabatan' => 'QC Besi', 'id_departemen' => 8],
            ['id_jabatan' => 18, 'nama_jabatan' => 'Crew Besi', 'id_departemen' => 8],
        ]);

        BagianKerja::insert([
            // Produksi Kayu
            ['id_bagian_kerja' => 1, 'nama_bagian_kerja' => 'Produksi', 'id_departemen' => 7],
            ['id_bagian_kerja' => 2, 'nama_bagian_kerja' => 'Finishing', 'id_departemen' => 7],

            // Produksi Besi
            ['id_bagian_kerja' => 3, 'nama_bagian_kerja' => 'Produksi', 'id_departemen' => 8],
            ['id_bagian_kerja' => 4, 'nama_bagian_kerja' => 'Finishing', 'id_departemen' => 8],
        ]);

        // Data Role (nama_role harus sama persis dengan daftar ENUM di tabel users)
        Role::insert([
            ['id_role' => 1, 'nama_role' => 'direktur', 'deskripsi_role' => 'Direktur Perusahaan'],
            ['id_role' => 2, 'nama_role' => 'manajer_hrd', 'deskripsi_role' => 'Manajer HRD'],
            ['id_role' => 3, 'nama_role' => 'staf_hrd', 'deskripsi_role' => 'Staf HRD'],
            ['id_role' => 4, 'nama_role' => 'manajer_marketing', 'deskripsi_role' => 'Manajer Marketing'],
            ['id_role' => 5, 'nama_role' => 'staf_marketing', 'deskripsi_role' => 'Staf Marketing'],
            ['id_role' => 6, 'nama_role' => 'manajer_keuangan', 'deskripsi_role' => 'Manajer Keuangan'],
            ['id_role' => 7, 'nama_role' => 'staf_keuangan', 'deskripsi_role' => 'Staf Keuangan'],
            ['id_role' => 8, 'nama_role' => 'manajer_ppic', 'deskripsi_role' => 'Manajer PPIC'],
            ['id_role' => 9, 'nama_role' => 'staf_ppic', 'deskripsi_role' => 'Staf PPIC'],
            ['id_role' => 10, 'nama_role' => 'software_engineer', 'deskripsi_role' => 'Software Engineer'],
            ['id_role' => 11, 'nama_role' => 'manajer_produksi_kayu', 'deskripsi_role' => 'Manajer Produksi Kayu'],
            ['id_role' => 12, 'nama_role' => 'supervisor_kayu', 'deskripsi_role' => 'Supervisor Kayu'],
            ['id_role' => 13, 'nama_role' => 'qc_kayu', 'deskripsi_role' => 'Quality Control Kayu'],
            ['id_role' => 14, 'nama_role' => 'crew_kayu', 'deskripsi_role' => 'Crew Produksi Kayu'],
            ['id_role' => 15, 'nama_role' => 'manajer_produksi_besi', 'deskripsi_role' => 'Manajer Produksi Besi'],
            ['id_role' => 16, 'nama_role' => 'supervisor_besi', 'deskripsi_role' => 'Supervisor Besi'],
            ['id_role' => 17, 'nama_role' => 'qc_besi', 'deskripsi_role' => 'Quality Control Besi'],
            ['id_role' => 18, 'nama_role' => 'crew_besi', 'deskripsi_role' => 'Crew Produksi Besi'],
        ]);

        $this->command->info('Struktur perusahaan berhasil dibuat.');

        // --------------------------------------------------------------------
        // LANGKAH 3: BUAT DATA KARYAWAN DAN PENGGUNA (USER)
        // --------------------------------------------------------------------
        $this->command->warn('Membuat data karyawan dan user...');

        $employeesData = [
            // Manajemen & Staf Kantor
            ['nama' => 'Baskara Wijaya', 'email_prefix' => 'baskara.wijaya', 'id_jabatan' => 1, 'id_role' => 1],
            ['nama' => 'Rina Astuti', 'email_prefix' => 'rina.astuti', 'id_jabatan' => 2, 'id_role' => 2],
            ['nama' => 'Agus Setiawan', 'email_prefix' => 'agus.setiawan', 'id_jabatan' => 3, 'id_role' => 3],
            ['nama' => 'Dewi Lestari', 'email_prefix' => 'dewi.lestari', 'id_jabatan' => 4, 'id_role' => 4],
            ['nama' => 'Indra Gunawan', 'email_prefix' => 'indra.gunawan', 'id_jabatan' => 5, 'id_role' => 5],
            ['nama' => 'Siti Aminah', 'email_prefix' => 'siti.aminah', 'id_jabatan' => 6, 'id_role' => 6],
            ['nama' => 'Bambang Susilo', 'email_prefix' => 'bambang.susilo', 'id_jabatan' => 7, 'id_role' => 7],
            ['nama' => 'Eka Putri', 'email_prefix' => 'eka.putri', 'id_jabatan' => 8, 'id_role' => 8],
            ['nama' => 'Joko Prasetyo', 'email_prefix' => 'joko.prasetyo', 'id_jabatan' => 9, 'id_role' => 9],
            ['nama' => 'Andi Wijaya', 'email_prefix' => 'andi.wijaya', 'id_jabatan' => 10, 'id_role' => 10],

            // Tim Produksi Kayu
            ['nama' => 'Heru Santoso', 'email_prefix' => 'heru.santoso', 'id_jabatan' => 11, 'id_role' => 11],
            ['nama' => 'Dian Purnomo', 'email_prefix' => 'dian.purnomo', 'id_jabatan' => 12, 'id_role' => 12],
            ['nama' => 'Teguh Pribadi', 'email_prefix' => 'teguh.pribadi', 'id_jabatan' => 13, 'id_role' => 13],
            ['nama' => 'Adi Nugroho', 'email_prefix' => 'adi.nugroho', 'id_jabatan' => 14, 'id_role' => 14], // Crew Kayu 1
            ['nama' => 'Wahyu Hidayat', 'email_prefix' => 'wahyu.hidayat', 'id_jabatan' => 14, 'id_role' => 14], // Crew Kayu 2

            // Tim Produksi Besi
            ['nama' => 'Zainal Arifin', 'email_prefix' => 'zainal.arifin', 'id_jabatan' => 15, 'id_role' => 15],
            ['nama' => 'Arif Rahman', 'email_prefix' => 'arif.rahman', 'id_jabatan' => 16, 'id_role' => 16],
            ['nama' => 'Surya Pratama', 'email_prefix' => 'surya.pratama', 'id_jabatan' => 17, 'id_role' => 17],
            ['nama' => 'Rudi Hartono', 'email_prefix' => 'rudi.hartono', 'id_jabatan' => 18, 'id_role' => 18], // Crew Besi 1
            ['nama' => 'Toni Saputra', 'email_prefix' => 'toni.saputra', 'id_jabatan' => 18, 'id_role' => 18], // Crew Besi 2
        ];

        foreach ($employeesData as $index => $data) {
            $nikCounter = $index + 1;
            $email = $data['email_prefix'] . '@company.com'; // Moved $email definition here

            $jabatan = Jabatan::find($data['id_jabatan']);

            // Ensure id_departemen is passed to IdentitasKaryawan::create
            $karyawan = IdentitasKaryawan::create([
                'nama_lengkap' => $data['nama'],
                'nik_ktp' => '123456789012' . str_pad($nikCounter, 4, '0', STR_PAD_LEFT),
                'nik_perusahaan' => 'EMP' . str_pad($nikCounter, 3, '0', STR_PAD_LEFT),
                'jenis_kelamin' => ($index % 2 == 0) ? 'Laki-laki' : 'Perempuan',
                'tanggal_lahir' => Carbon::create(1985 + ($index % 15), rand(1, 12), rand(1, 28)),
                'tempat_lahir' => 'Jakarta',
                'alamat_ktp' => 'Jl. Jenderal Sudirman No. ' . ($index + 1) . ', Jakarta',
                'alamat_domisili' => 'Jl. Gatot Subroto No. ' . ($index + 1) . ', Jakarta',
                'status_pernikahan' => ($index % 3 == 0) ? 'Menikah' : 'Belum Menikah',
                'agama' => 'Islam',
                'golongan_darah' => ['A', 'B', 'AB', 'O'][rand(0, 3)],
                'kewarganegaraan' => 'Indonesia',
                'pekerjaan_ktp' => 'Karyawan Swasta',
                'nomor_npwp' => '123456789012345' . $nikCounter,
                'nomor_bpjs_kesehatan' => '00012345678' . $nikCounter,
                'nomor_bpjs_ketenagakerjaan' => '1234567890' . $nikCounter,
                'foto_profil_url' => 'https://i.pravatar.cc/150?u=' . $data['email_prefix'],
                'id_departemen' => $jabatan->id_departemen, // THIS LINE IS CRUCIAL
            ]);

            KontakKaryawan::create([
                'id_karyawan' => $karyawan->id_karyawan,
                'email_perusahaan' => $email,
                'email_pribadi' => $data['email_prefix'] . '@gmail.com',
                'nomor_telepon' => '081234567' . str_pad($nikCounter, 3, '0', STR_PAD_LEFT),
                'nama_bank' => 'BCA',
                'nomor_rekening' => '12345678' . $nikCounter,
                'nama_pemilik_rekening' => $data['nama'],
            ]);

            $bagianKerjaId = null;
            if ($jabatan->id_departemen == 7) { // Produksi Kayu
                $bagianKerjaId = rand(1, 2);
            } else if ($jabatan->id_departemen == 8) { // Produksi Besi
                $bagianKerjaId = rand(3, 4);
            }

            $senioritasValue = 'Senior'; // Default value is now 'Senior'
            if (in_array($data['id_role'], [14, 18])) { // 14: crew_kayu, 18: crew_besi
                $senioritasValue = ($index % 2 == 0) ? 'Senior' : 'Junior';
            }

            RincianPekerjaan::create([
                'id_karyawan' => $karyawan->id_karyawan,
                'tanggal_bergabung' => now()->subMonths(6),
                'status_karyawan' => ($index % 4 == 0) ? 'Kontrak' : 'Tetap',
                'id_jabatan' => $data['id_jabatan'],
                'senioritas' => $senioritasValue,
                'id_departemen' => $jabatan->id_departemen,
                'id_bagian_kerja' => $bagianKerjaId,
                'lokasi_kerja' => 'Pabrik Cikarang',
            ]);

            UserRole::create([
                'id_karyawan' => $karyawan->id_karyawan,
                'id_role' => $data['id_role'],
            ]);

            $role = Role::find($data['id_role']);
            User::create([
                'id_karyawan' => $karyawan->id_karyawan,
                'name' => $data['nama'],
                'email' => $email,
                'role' => $role->nama_role,
                'password' => Hash::make('password'),
                'status' => 'Aktif',
                'email_verified_at' => now(),
            ]);
        }

        $this->command->info('Data karyawan dan user berhasil dibuat.');

        // --------------------------------------------------------------------
        // LANGKAH 3.5: BUAT DATA RIWAYAT EDUKASI
        // --------------------------------------------------------------------
        $this->command->warn('Membuat data riwayat edukasi...');
        $allKaryawan = IdentitasKaryawan::all();

        foreach ($allKaryawan as $karyawan) {
            // Contoh data pendidikan S1
            Education::create([
                'id_karyawan' => $karyawan->id_karyawan,
                'jenjang' => 'S1',
                'institusi' => 'Universitas Contoh',
                'jurusan' => 'Teknik Informatika',
                'kota' => 'Jakarta',
                'negara' => 'Indonesia',
                'tahun_mulai' => 2010,
                'tahun_selesai' => 2014,
                'ipk' => 3.50,
                'nomor_ijazah' => 'UC/TI/2014/001',
                'tanggal_ijazah' => '2014-08-20',
                'file_ijazah' => 'documents/ijazah_s1_' . $karyawan->id_karyawan . '.pdf',
                'is_lulus' => true,
                'catatan' => 'Lulus dengan predikat cumlaude',
            ]);

            // Contoh data pendidikan SMA
            Education::create([
                'id_karyawan' => $karyawan->id_karyawan,
                'jenjang' => 'SMA',
                'institusi' => 'SMA Negeri 1 Jakarta',
                'jurusan' => 'IPA',
                'kota' => 'Jakarta',
                'negara' => 'Indonesia',
                'tahun_mulai' => 2007,
                'tahun_selesai' => 2010,
                'ipk' => null,
                'nomor_ijazah' => 'SMA/IPA/2010/001',
                'tanggal_ijazah' => '2010-06-15',
                'file_ijazah' => 'documents/ijazah_sma_' . $karyawan->id_karyawan . '.pdf',
                'is_lulus' => true,
                'catatan' => null,
            ]);
        }
        $this->command->info('Data riwayat edukasi berhasil dibuat.');

        // --------------------------------------------------------------------
        // LANGKAH 4: BUAT DATA TAMBAHAN (DOKUMEN, KONTAK DARURAT, JADWAL)
        // --------------------------------------------------------------------
        $this->command->warn('Membuat data tambahan...');

        $allUsers = User::all();

        foreach ($allUsers as $user) {
            DokumenKaryawan::create([
                'id_karyawan' => $user->id_karyawan,
                'nama_dokumen' => 'KTP',
                'jenis_dokumen' => 'Identitas',
                'tanggal_unggah' => '2023-01-10',
                'url' => 'documents/ktp.pdf',
            ]);

            KontakDarurat::create([
                'id_karyawan' => $user->id_karyawan,
                'nama' => 'Keluarga ' . $user->name,
                'hubungan' => 'Keluarga',
                'nomor_telepon' => '081200001111',
            ]);

            $today = Carbon::today();
            $startPeriod = $today->copy()->subMonth()->startOfMonth();
            $endPeriod = $today->copy()->endOfMonth();

            for ($date = $startPeriod->copy(); $date->lte($endPeriod); $date->addDay()) {
                $isAdiNugroho = ($user->name === 'Adi Nugroho');

                if ($isAdiNugroho || $date->isWeekday()) { // Create for Adi every day, others only weekdays
                    if (!JadwalKerja::where('id_karyawan', $user->id_karyawan)->where('tanggal', $date)->exists()) {
                        JadwalKerja::create([
                            'id_karyawan' => $user->id_karyawan,
                            'tanggal' => $date,
                            'shift' => 'Pagi',
                            'jam_masuk' => '08:00:00',
                            'jam_keluar' => '17:00:00',

                        ]);
                    }
                }
            }
        }

        $this->command->info('Data tambahan berhasil dibuat.');

        // --------------------------------------------------------------------
        // LANGKAH 5: BUAT DATA KPI
        // --------------------------------------------------------------------
        $this->command->warn('Membuat data KPI...');
        // Create Master KPIs
        $kpiProduksi = MasterKpi::create([
            'nama_kpi' => 'Target Produksi Harian',
            'deskripsi' => 'Jumlah unit yang harus diproduksi per hari',
            'target' => '100',
            'satuan' => 'unit',
            'tipe_kpi' => 'kuantitatif',
        ]);

        $kpiKualitas = MasterKpi::create([
            'nama_kpi' => 'Tingkat Cacat Produk',
            'deskripsi' => 'Persentase produk cacat dari total produksi',
            'target' => '5%',
            'satuan' => '%',
            'tipe_kpi' => 'kuantitatif',
        ]);

        $kpiKehadiran = MasterKpi::create([
            'nama_kpi' => 'Tingkat Kehadiran',
            'deskripsi' => 'Persentase kehadiran karyawan',
            'target' => '95%',
            'satuan' => '%',
            'tipe_kpi' => 'kuantitatif',
        ]);

        // Create KPI Results for crew users
        $crewUsers = User::where('role', 'like', 'crew_%')->get();
        $today = Carbon::today();

        foreach ($crewUsers as $user) {
            KpiResult::create([
                'id_karyawan' => $user->id_karyawan,
                'id_kpi' => $kpiProduksi->id,
                'periode' => $today->copy()->subMonth(),
                'hasil' => '95 unit',
                'catatan' => 'Mencapai 95% dari target',
            ]);

            KpiResult::create([
                'id_karyawan' => $user->id_karyawan,
                'id_kpi' => $kpiKualitas->id,
                'periode' => $today->copy()->subMonth(),
                'hasil' => '3%',
                'catatan' => 'Di bawah target cacat',
            ]);

            KpiResult::create([
                'id_karyawan' => $user->id_karyawan,
                'id_kpi' => $kpiKehadiran->id,
                'periode' => $today->copy()->subMonth(),
                'hasil' => '98%',
                'catatan' => 'Kehadiran sangat baik',
            ]);
        }
        $this->command->info('Data KPI berhasil dibuat.');

        // --------------------------------------------------------------------
        // LANGKAH 6: BUAT DATA MODUL DASHBOARD
        // --------------------------------------------------------------------
        $this->command->warn('Membuat data modul dashboard...');
        DashboardModule::create([
            'nama_modul' => 'Jadwal Kerja',
            'deskripsi' => 'Lihat jadwal kerja Anda',
            'icon' => 'Calendar',
            'route' => 'crew.schedule',
            'role' => 'crew',
        ]);

        DashboardModule::create([
            'nama_modul' => 'Pengajuan Cuti',
            'deskripsi' => 'Ajukan cuti atau izin',
            'icon' => 'FilePlus2',
            'route' => 'crew-kayu.leave.index',
            'role' => 'crew_kayu',
        ]);

        DashboardModule::create([
            'nama_modul' => 'Pengajuan Cuti',
            'deskripsi' => 'Ajukan cuti atau izin',
            'icon' => 'FilePlus2',
            'route' => 'crew-besi.leave.index',
            'role' => 'crew_besi',
        ]);

        DashboardModule::create([
            'nama_modul' => 'Penggajian',
            'deskripsi' => 'Lihat slip gaji dan rekening',
            'icon' => 'Wallet',
            'route' => 'crew.penggajian',
            'role' => 'crew',
        ]);
        $this->command->info('Data modul dashboard berhasil dibuat.');

        // --------------------------------------------------------------------
        // LANGKAH 7: BUAT DATA PRESENSI (VERSI PERBAIKAN)
        // --------------------------------------------------------------------
        $this->command->warn('Membuat data presensi (versi perbaikan)...');
        $karyawans = IdentitasKaryawan::all();

        if ($karyawans->isEmpty()) {
            $this->command->error('Tidak ada karyawan untuk dibuatkan presensi. Lewati langkah ini.');
            return;
        }

        $currentMonthStart = Carbon::now()->startOfMonth();
        $currentMonthEnd = Carbon::now()->endOfMonth();
        $previousMonthStart = Carbon::now()->subMonth()->startOfMonth();
        $previousMonthEnd = Carbon::now()->subMonth()->endOfMonth();

        $periods = [
            ['start' => $previousMonthStart, 'end' => $previousMonthEnd],
            ['start' => $currentMonthStart, 'end' => $currentMonthEnd],
        ];

        $presensiData = [];

        foreach ($periods as $period) {
            $startDate = $period['start'];
            $endDate = $period['end'];

            foreach ($karyawans as $karyawan) {
                for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                    // Hanya proses hari kerja (Senin-Jumat)
                    if ($date->isWeekend()) {
                        continue;
                    }

                    $jadwal = JadwalKerja::where('id_karyawan', $karyawan->id_karyawan)
                        ->whereDate('tanggal', $date)
                        ->first();

                    // Jika tidak ada jadwal, buat jadwal default untuk hari itu agar presensi bisa dibuat
                    if (!$jadwal) {
                        $initialStatusKehadiran = 'Belum Hadir'; // Default
                        $scenario = rand(1, 100);
                        if ($scenario <= 80) {
                            $initialStatusKehadiran = 'Hadir';
                        } elseif ($scenario <= 90) {
                            $initialStatusKehadiran = 'Izin';
                        } else {
                            $initialStatusKehadiran = 'Alpha';
                        }

                        $jadwal = JadwalKerja::create([
                            'id_karyawan' => $karyawan->id_karyawan,
                            'tanggal' => $date,
                            'shift' => 'Pagi',
                            'jam_masuk' => '08:00:00',
                            'jam_keluar' => '17:00:00',

                        ]);
                    }

                    $data = [
                        'id_karyawan' => $karyawan->id_karyawan,
                        'id_jadwal' => $jadwal->id_jadwal,
                        'tanggal' => $date->format('Y-m-d'),
                        'jam_masuk_actual' => null,
                        'jam_keluar_actual' => null,
                        'status_presensi' => 'alpha', // Default jika tidak ada skenario lain
                        'jam_kerja' => null,
                        'jam_lembur' => null,
                        'catatan' => null,
                        'lokasi_presensi' => 'Kantor Pusat',
                        'latitude' => -6.200000,
                        'longitude' => 106.816666,
                        'created_at' => $date,
                        'updated_at' => $date,
                    ];

                    $scenario = rand(1, 100);

                    if ($scenario <= 80) { // 80% Hadir (tepat waktu atau terlambat)
                        $jamMasukScheduled = Carbon::parse($jadwal->jam_masuk);
                        $jamKeluarScheduled = Carbon::parse($jadwal->jam_keluar);

                        // Simulasikan keterlambatan (0-30 menit)
                        $keterlambatan = rand(0, 30);
                        $jamMasukActual = $jamMasukScheduled->copy()->addMinutes($keterlambatan);

                        // Simulasikan pulang lebih cepat atau lambat
                        $overtimeMinutes = rand(0, 120); // Simulate 0 to 120 minutes of overtime
                        $jamKeluarActual = $jamKeluarScheduled->copy()->addMinutes($overtimeMinutes);

                        if ($jamKeluarActual->lt($jamMasukActual)) {
                            $jamKeluarActual->addDay();
                        }

                        $data['jam_masuk_actual'] = $jamMasukActual->format('H:i:s');
                        $data['jam_keluar_actual'] = $jamKeluarActual->format('H:i:s');
                        $data['status_presensi'] = ($keterlambatan > 5) ? 'terlambat' : 'hadir';
                        $data['jam_kerja'] = round($jamKeluarActual->diffInMinutes($jamMasukActual) / 60, 2);
                        $data['jam_lembur'] = ($overtimeMinutes > 0) ? round($overtimeMinutes / 60, 2) : null; // Set jam_lembur
                    } elseif ($scenario <= 90) { // 10% Izin
                        $data['status_presensi'] = 'izin';
                        $data['catatan'] = 'Izin karena ada urusan pribadi.';
                    } else { // 10% Alpha (tidak melakukan apa-apa, status default sudah alpha)
                        $data['catatan'] = 'Tidak ada keterangan.';
                    }

                    // BUG FIX: Add the generated data to the array for insertion
                    $presensiData[] = $data;
                }
            }
        }

        // Insert data in chunks to avoid memory issues
        foreach (array_chunk($presensiData, 250) as $chunk) {
            Presensi::insert($chunk);
        }



        $this->command->info('Data presensi (perbaikan) berhasil dibuat untuk bulan ini.');

        // --------------------------------------------------------------------
        // LANGKAH 8: BUAT DATA PAYROLL
        // --------------------------------------------------------------------
        $this->command->warn('Membuat data payroll...');
        $payrollSettingsData = [
            'tarif_per_jam' => '35000',
            'standar_jam_kerja' => '8',
            'upah_lembur_per_jam' => '50000',
            'tunjangan_makan_per_hari' => '25000',
            'tunjangan_transport_per_hari' => '20000',
            'potongan_per_10_menit' => '10000',
            'tanggal_gajian' => '25',
            'periode_pembayaran' => 'bulanan',
            'hari_gajian_mingguan' => 'jumat',
        ];

        foreach ($payrollSettingsData as $key => $value) {
            \App\Models\PayrollSetting::updateOrCreate(
                ['setting_key' => $key, 'valid_from' => '2023-01-01'], // Use a fixed old date for initial seeding
                [
                    'setting_value' => $value,
                    'description' => ucfirst(str_replace('_', ' ', $key)) . ' setting',
                    'valid_from' => '2023-01-01',
                    'valid_to' => null,
                ]
            );
        }

        $this->command->info('Payroll settings berhasil dibuat. Periode: Bulanan, Tanggal Gajian: 25.');

        $this->command->info('================================================================');
        $this->command->info('Seeding selesai. Password default semua user adalah: "password"');
        $this->command->info('================================================================');
    }
}