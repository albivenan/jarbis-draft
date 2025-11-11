<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\Shared\Attendance\PresensiController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\ManajerHrd\PayrollController;
use App\Http\Controllers\Settings\ProfileController as SettingsProfileController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\SopController;
use App\Http\Controllers\ManajerKeuangan\Harian\PemasukanHarianController;
use App\Http\Controllers\ManajerKeuangan\Harian\PengeluaranHarianController;
use App\Http\Controllers\ManajerKeuangan\Harian\KasDanBankController;
use App\Http\Controllers\ManajerKeuangan\RekeningBankController;
use App\Http\Controllers\Keuangan\Harian\SumberDanaController; // Added

use App\Http\Controllers\Keuangan\PembelianBahanBakuController; // Added

use App\Http\Controllers\Keuangan\KeuanganProduk\TransaksiController; // Added
use App\Http\Controllers\ManajerPpic\PesananController as PpicPesananController;
use App\Http\Controllers\ManajerKeuangan\ProdukHargaController;
use App\Http\Controllers\ManajerMarketing\PesananController as MarketingPesananController;


/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard Redirect
    Route::get('/dashboard', function () {
        $user = Auth::user();
        $role = $user->role;
        
        // Map role to route name
        $roleRouteMap = [
            'direktur' => 'direktur.index',
            'manajer_hrd' => 'manajer-hrd.index',
            'staf_hrd' => 'staf-hrd.index',
            'manajer_keuangan' => 'manajer-keuangan.index',
            'staf_keuangan' => 'staf-keuangan.index',
            'manajer_marketing' => 'manajer-marketing.index',
            'staf_marketing' => 'staf-marketing.index',
            'manajer_ppic' => 'manajer-ppic.index',
            'staf_ppic' => 'staf-ppic.index',
            'manajer_produksi_kayu' => 'manajer-produksi-kayu.index',
            'manajer_produksi_besi' => 'manajer-produksi-besi.index',
            'supervisor_kayu' => 'supervisor-kayu.index',
            'supervisor_besi' => 'supervisor-besi.index',
            'qc_kayu' => 'qc-kayu.index',
            'qc_besi' => 'qc-besi.index',
            'crew_kayu' => 'crew-kayu.index',
            'crew_besi' => 'crew-besi.index',
            'software_engineer' => 'software-engineer.index',
        ];
        
        $routeName = $roleRouteMap[$role] ?? 'login';
        
        return redirect()->route($routeName);
    })->name('dashboard');
    
    Route::get('/home', function () {
        return redirect()->route('dashboard');
    })->name('home');
});
    /*
    |--------------------------------------------------------------------------
    | Crew Kayu Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/crew-kayu')->middleware(['auth', 'role.permission'])->name('crew-kayu.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.crew.dashboard'))->name('index');
        Route::get('identitas-diri', [App\Http\Controllers\Crew\IdentitasDiriController::class, 'index'])->name('identitas-diri');
        Route::get('profile', [App\Http\Controllers\Crew\IdentitasDiriController::class, 'index'])->name('profile');
        Route::get('schedule', [PresensiController::class, 'showSchedulePage'])->name('schedule');
        Route::get('penggajian', [App\Http\Controllers\Crew\PenggajianController::class, 'index'])->name('penggajian');
        Route::get('history-perubahan-data', [App\Http\Controllers\Crew\IdentitasDiriController::class, 'showChangeRequestHistory'])->name('history-perubahan-data');
        
        Route::prefix('leave')->name('leave.')->middleware('role.permission:request_leave')->group(function () {
            Route::get('/', fn() => Inertia::render('roles.crew.izin.index'))->name('index');
            Route::get('history', fn() => Inertia::render('roles.crew.izin.history'))->name('history');
        });
        
        Route::prefix('accounts')->name('accounts.')->group(function () {
            Route::get('/', fn() => Inertia::render('roles.crew.accounts.index'))->name('index');
        });
        
        Route::get('penggajian/slip-gaji/{batchName}', [App\Http\Controllers\Crew\PenggajianController::class, 'show'])->name('penggajian.slip.show');

        // Profile Update Routes
        Route::prefix('profile')->name('profile.')->group(function () {
            Route::post('update-ktp', [App\Http\Controllers\Crew\IdentitasDiriController::class, 'updateKtp'])->name('update-ktp');
            Route::post('update-contact', [App\Http\Controllers\Crew\IdentitasDiriController::class, 'updateContact'])->name('update-contact');
            Route::post('update-tax', [App\Http\Controllers\Crew\IdentitasDiriController::class, 'updateTax'])->name('update-tax');
            Route::post('update-bank', [App\Http\Controllers\Crew\IdentitasDiriController::class, 'updateBank'])->name('update-bank');
        });
    });

    Route::prefix('roles/crew-besi')->middleware(['auth', 'role.permission'])->name('crew-besi.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.crew.dashboard'))->name('index');
        Route::get('identitas-diri', [App\Http\Controllers\Crew\IdentitasDiriController::class, 'index'])->name('identitas-diri');
        Route::get('profile', [App\Http\Controllers\Crew\IdentitasDiriController::class, 'index'])->name('profile');
        Route::get('schedule', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'showSchedulePage'])->name('schedule');
        Route::get('penggajian', [App\Http\Controllers\Crew\PenggajianController::class, 'index'])->name('penggajian');
        Route::get('history-perubahan-data', [App\Http\Controllers\Crew\IdentitasDiriController::class, 'showChangeRequestHistory'])->name('history-perubahan-data');
        
        Route::prefix('leave')->name('leave.')->middleware('role.permission:request_leave')->group(function () {
            Route::get('/', fn() => Inertia::render('roles.crew.izin.index'))->name('index');
            Route::get('history', fn() => Inertia::render('roles.crew.izin.history'))->name('history');
        });
        
        Route::prefix('accounts')->name('accounts.')->group(function () {
            Route::get('/', fn() => Inertia::render('roles.crew.accounts.index'))->name('index');
        });
        
        Route::get('penggajian/slip-gaji/{batchName}', [App\Http\Controllers\Crew\PenggajianController::class, 'show'])->name('penggajian.slip.show');

        // Profile Update Routes
        Route::prefix('profile')->name('profile.')->group(function () {
            Route::post('update-ktp', [App\Http\Controllers\Crew\IdentitasDiriController::class, 'updateKtp'])->name('update-ktp');
            Route::post('update-contact', [App\Http\Controllers\Crew\IdentitasDiriController::class, 'updateContact'])->name('update-contact');
            Route::post('update-tax', [App\Http\Controllers\Crew\IdentitasDiriController::class, 'updateTax'])->name('update-tax');
            Route::post('update-bank', [App\Http\Controllers\Crew\IdentitasDiriController::class, 'updateBank'])->name('update-bank');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | QC Kayu Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/qc-kayu')->middleware(['auth', 'role.permission'])->name('qc-kayu.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.qc-kayu.dashboard'))->name('index');
        Route::get('schedule', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'showSchedulePage'])->name('schedule');
        
        Route::prefix('inspeksi')->name('inspeksi.')->group(function () {
            Route::get('antrean-inspeksi', fn() => Inertia::render('roles.qc-kayu.inspeksi.antrean-inspeksi'))->name('antrean-inspeksi');
            Route::get('detail-produksi', fn() => Inertia::render('roles.qc-kayu.inspeksi.detail-produksi'))->name('detail-produksi');
            Route::get('formulir-laporan', fn() => Inertia::render('roles.qc-kayu.inspeksi.formulir-laporan'))->name('formulir-laporan');
        });
        
        Route::prefix('dokumen')->name('dokumen.')->group(function () {
            Route::get('standar-kualitas', fn() => Inertia::render('roles.qc-kayu.dokumen.standar-kualitas'))->name('standar-kualitas');
            Route::get('riwayat-inspeksi', fn() => Inertia::render('roles.qc-kayu.dokumen.riwayat-inspeksi'))->name('riwayat-inspeksi');
            Route::get('analisis-reject', fn() => Inertia::render('roles.qc-kayu.dokumen.analisis-reject'))->name('analisis-reject');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | QC Besi Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/qc-besi')->middleware(['auth', 'role.permission'])->name('qc-besi.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.qc-besi.dashboard'))->name('index');
        Route::get('schedule', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'showSchedulePage'])->name('schedule');
        
        Route::prefix('inspeksi')->name('inspeksi.')->group(function () {
            Route::get('antrean-inspeksi', fn() => Inertia::render('roles.qc-besi.inspeksi.antrean-inspeksi'))->name('antrean-inspeksi');
            Route::get('detail-produksi', fn() => Inertia::render('roles.qc-besi.inspeksi.detail-produksi'))->name('detail-produksi');
            Route::get('formulir-laporan', fn() => Inertia::render('roles.qc-besi.inspeksi.formulir-laporan'))->name('formulir-laporan');
        });
        
        Route::prefix('dokumen')->name('dokumen.')->group(function () {
            Route::get('standar-kualitas', fn() => Inertia::render('roles.qc-besi.dokumen.standar-kualitas'))->name('standar-kualitas');
            Route::get('riwayat-inspeksi', fn() => Inertia::render('roles.qc-besi.dokumen.riwayat-inspeksi'))->name('riwayat-inspeksi');
            Route::get('analisis-reject', fn() => Inertia::render('roles.qc-besi.dokumen.analisis-reject'))->name('analisis-reject');
        });
    });


    /*
    |--------------------------------------------------------------------------
    | Supervisor Kayu Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/supervisor-kayu')->middleware(['auth', 'role.permission'])->name('supervisor-kayu.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.supervisor-kayu.dashboard'))->name('index');
        
        Route::prefix('tugas-saya')->name('tugas-saya.')->group(function () {
            Route::get('daftar-tugas', fn() => Inertia::render('roles.supervisor-kayu.tugas-saya.daftar-tugas'))->name('daftar-tugas');
            Route::get('instruksi-kerja', fn() => Inertia::render('roles.supervisor-kayu.tugas-saya.instruksi-kerja'))->name('instruksi-kerja');
            Route::get('lapor-progres', fn() => Inertia::render('roles.supervisor-kayu.tugas-saya.lapor-progres'))->name('lapor-progres');
            Route::get('lapor-kendala', fn() => Inertia::render('roles.supervisor-kayu.tugas-saya.lapor-kendala'))->name('lapor-kendala');
        });
        
        Route::prefix('kualitas')->name('kualitas.')->group(function () {
            Route::get('status-catatan-qc', fn() => Inertia::render('roles.supervisor-kayu.kualitas.status-catatan-qc'))->name('status-catatan-qc');
            Route::get('antrean-rework', fn() => Inertia::render('roles.supervisor-kayu.kualitas.antrean-rework'))->name('antrean-rework');
        });
        
        Route::prefix('kinerja')->name('kinerja.')->group(function () {
            Route::get('penilaian-crew', fn() => Inertia::render('roles.supervisor-kayu.kinerja.penilaian-crew'))->name('penilaian-crew');
            Route::get('riwayat-penilaian', fn() => Inertia::render('roles.supervisor-kayu.kinerja.riwayat-penilaian'))->name('riwayat-penilaian');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Supervisor Besi Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/supervisor-besi')->middleware(['auth', 'role.permission'])->name('supervisor-besi.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.supervisor-besi.dashboard'))->name('index');
        
        Route::prefix('tugas-saya')->name('tugas-saya.')->group(function () {
            Route::get('daftar-tugas', fn() => Inertia::render('roles.supervisor-besi.tugas-saya.daftar-tugas'))->name('daftar-tugas');
            Route::get('instruksi-kerja', fn() => Inertia::render('roles.supervisor-besi.tugas-saya.instruksi-kerja'))->name('instruksi-kerja');
            Route::get('lapor-progres', fn() => Inertia::render('roles.supervisor-besi.tugas-saya.lapor-progres'))->name('lapor-progres');
            Route::get('lapor-kendala', fn() => Inertia::render('roles.supervisor-besi.tugas-saya.lapor-kendala'))->name('lapor-kendala');
        });
        
        Route::prefix('kualitas')->name('kualitas.')->group(function () {
            Route::get('status-catatan-qc', fn() => Inertia::render('roles.supervisor-besi.kualitas.status-catatan-qc'))->name('status-catatan-qc');
            Route::get('antrean-rework', fn() => Inertia::render('roles.supervisor-besi.kualitas.antrean-rework'))->name('antrean-rework');
        });
        
        Route::prefix('kinerja')->name('kinerja.')->group(function () {
            Route::get('penilaian-crew', fn() => Inertia::render('roles.supervisor-besi.kinerja.penilaian-crew'))->name('penilaian-crew');
            Route::get('riwayat-penilaian', fn() => Inertia::render('roles.supervisor-besi.kinerja.riwayat-penilaian'))->name('riwayat-penilaian');
        });
    });


    /*
    |--------------------------------------------------------------------------
    | Manajer HRD Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/manajer-hrd')->middleware(['auth', 'role.permission'])->name('manajer-hrd.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.manajer-hrd.dashboard'))->name('index');
        
        // Data Karyawan
        Route::prefix('karyawan')->name('karyawan.')->group(function () {
            Route::get('daftar', [App\Http\Controllers\ManajerHrd\KaryawanController::class, 'index'])->name('daftar');
            Route::get('demografi', [App\Http\Controllers\ManajerHrd\DemografiController::class, 'index'])->name('demografi');
            Route::get('{id_karyawan}/detail', [App\Http\Controllers\ManajerHrd\KaryawanController::class, 'show'])->name('detail');
            Route::get('kontrak', fn() => Inertia::render('roles.manajer-hrd.karyawan.kontrak'))->name('kontrak');
            Route::get('permintaan-perubahan-data', [App\Http\Controllers\ManajerHrd\KaryawanController::class, 'showChangeRequests'])->name('permintaan-perubahan-data');
        });
        
        // Manajemen Absensi
        Route::prefix('manajemen-presensi')->name('manajemen-presensi.')->group(function () {
            Route::get('presensi', fn() => Inertia::render('roles/manajer-hrd/manajemen-presensi/presensi'))->name('presensi');
            Route::get('pengajuan', [LeaveRequestController::class, 'hrdPengajuanPage'])->name('pengajuan');
            Route::get('jadwal', fn() => Inertia::render('roles/manajer-hrd/manajemen-presensi/jadwal'))->name('jadwal');
        });
        
        // Manajemen Penggajian
        Route::prefix('penggajian')->name('penggajian.')->group(function () {
            Route::get('proses', [App\Http\Controllers\ManajerHrd\PayrollController::class, 'index'])->name('proses');
            Route::post('proses/validate', [App\Http\Controllers\ManajerHrd\PayrollController::class, 'validate'])->name('proses.validate');
            Route::post('proses/update-koreksi', [App\Http\Controllers\ManajerHrd\PayrollController::class, 'updateKoreksi'])->name('proses.update-koreksi');
            Route::get('riwayat', fn() => Inertia::render('roles.manajer-hrd.penggajian.riwayat'))->name('riwayat');
            // Updated 'pengaturan' route to use the new controller
            Route::get('pengaturan', [App\Http\Controllers\ManajerHRD\PengaturanGajiController::class, 'show'])->name('pengaturan');
            Route::post('pengaturan', [App\Http\Controllers\ManajerHRD\PengaturanGajiController::class, 'update'])->name('pengaturan.update');
        });
        
        // Administrasi Perusahaan
        Route::prefix('administrasi')->name('administrasi.')->group(function () {
            Route::get('sk', fn() => Inertia::render('roles.manajer-hrd.administrasi.sk'))->name('sk');
            Route::get('dokumen', fn() => Inertia::render('roles.manajer-hrd.administrasi.dokumen'))->name('dokumen');
            Route::resource('sop', SopController::class);
            Route::get('profil-perusahaan', [App\Http\Controllers\ManajerHrd\ProfilPerusahaanController::class, 'show'])->name('profil-perusahaan');
            Route::post('profil-perusahaan', [App\Http\Controllers\ManajerHrd\ProfilPerusahaanController::class, 'update'])->name('profil-perusahaan.update');
        });
        
        // Laporan HRD
        Route::prefix('laporan')->name('laporan.')->group(function () {
            Route::get('kehadiran', fn() => Inertia::render('roles/manajer-hrd/laporan/kehadiran/index'))->name('kehadiran');
            Route::get('turnover', fn() => Inertia::render('roles/manajer-hrd/laporan/turnover/index'))->name('turnover');
            Route::get('penggajian', [App\Http\Controllers\Laporan\PenggajianController::class, 'index'])->name('penggajian');
            Route::get('direksi', [App\Http\Controllers\Laporan\DireksiController::class, 'index'])->name('direksi');
        });

        // Pengumuman
        Route::prefix('pengumuman')->name('pengumuman.')->group(function () {
            Route::get('buat', [App\Http\Controllers\ManajerHrd\PengumumanController::class, 'create'])->name('buat');
            Route::post('store', [App\Http\Controllers\ManajerHrd\PengumumanController::class, 'store'])->name('store');
            Route::prefix('riwayat')->name('riwayat.')->group(function () {
                Route::get('/', [App\Http\Controllers\ManajerHrd\PengumumanController::class, 'index'])->name('index');
                Route::get('{pengumuman}', [App\Http\Controllers\ManajerHrd\PengumumanController::class, 'show'])->name('show');
                Route::delete('{pengumuman}', [App\Http\Controllers\ManajerHrd\PengumumanController::class, 'destroy'])->name('destroy');
            });
        });
        
        // Administrasi Pribadi
        Route::prefix('administrasi-pribadi')->name('administrasi-pribadi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.manajer-hrd.administrasi-pribadi.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.manajer-hrd.administrasi-pribadi.jadwal'))->name('jadwal');
            Route::get('pengajuan-cuti', fn() => Inertia::render('roles.manajer-hrd.administrasi-pribadi.pengajuan-cuti'))->name('pengajuan-cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.manajer-hrd.administrasi-pribadi.slip-gaji'))->name('slip-gaji');
            Route::get('kelola-rekening', fn() => Inertia::render('roles.manajer-hrd.administrasi-pribadi.kelola-rekening'))->name('kelola-rekening');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Staf HRD Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/staf-hrd')->middleware(['auth', 'role.permission'])->name('staf-hrd.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.staf-hrd.dashboard'))->name('index');
        
        Route::prefix('karyawan')->name('karyawan.')->group(function () {
            Route::get('daftar', fn() => Inertia::render('roles.staf-hrd.karyawan.daftar'))->name('daftar');
            Route::get('absensi', fn() => Inertia::render('roles.staf-hrd.karyawan.absensi'))->name('absensi');
            Route::get('penggajian', fn() => Inertia::render('roles.staf-hrd.karyawan.penggajian'))->name('penggajian');
        });
        
        Route::prefix('administrasi')->name('administrasi.')->group(function () {
            Route::get('dokumen', fn() => Inertia::render('roles.staf-hrd.administrasi.dokumen'))->name('dokumen');
        });
        
        Route::prefix('administrasi-pribadi')->name('administrasi-pribadi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.staf-hrd.administrasi-pribadi.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.staf-hrd.administrasi-pribadi.jadwal'))->name('jadwal');
            Route::get('cuti', fn() => Inertia::render('roles.staf-hrd.administrasi-pribadi.cuti'))->name('cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.staf-hrd.administrasi-pribadi.slip-gaji'))->name('slip-gaji');
            Route::get('rekening', fn() => Inertia::render('roles.staf-hrd.administrasi-pribadi.rekening'))->name('rekening');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Manajer Keuangan Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/manajer-keuangan')->middleware(['auth', 'role.permission'])->name('manajer-keuangan.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles/Keuangan/dashboard'))->name('index');
        
        Route::prefix('harian')->name('harian.')->group(function () {
            // Pemasukan Routes
            Route::get('pemasukan', [PemasukanHarianController::class, 'index'])->name('pemasukan.index');
            Route::get('pemasukan/create', [PemasukanHarianController::class, 'create'])->name('pemasukan.create');
            Route::post('pemasukan', [PemasukanHarianController::class, 'store'])->name('pemasukan.store');
            Route::put('pemasukan/{pemasukan}', [PemasukanHarianController::class, 'update'])->name('pemasukan.update');
            Route::delete('pemasukan/{pemasukan}', [PemasukanHarianController::class, 'destroy'])->name('pemasukan.destroy');
            Route::get('pemasukan/{pemasukan}/edit', [PemasukanHarianController::class, 'edit'])->name('pemasukan.edit');

            // Pengeluaran Routes
            Route::get('pengeluaran', [PengeluaranHarianController::class, 'index'])->name('pengeluaran.index');
            Route::get('pengeluaran/create', [PengeluaranHarianController::class, 'create'])->name('pengeluaran.create');
            Route::post('pengeluaran', [PengeluaranHarianController::class, 'store'])->name('pengeluaran.store');
            Route::put('pengeluaran/{pengeluaran}', [PengeluaranHarianController::class, 'update'])->name('pengeluaran.update');
            Route::delete('pengeluaran/{pengeluaran}', [PengeluaranHarianController::class, 'destroy'])->name('pengeluaran.destroy');
            Route::get('pengeluaran/{pengeluaran}/edit', [PengeluaranHarianController::class, 'edit'])->name('pengeluaran.edit');
            Route::get('sumber-dana', fn() => Inertia::render('roles/Keuangan/Harian/sumber-dana/index'))->name('sumber-dana');
            Route::get('sumber-dana/{sumberDana}', [SumberDanaController::class, 'show'])->name('sumber-dana.show'); // Added
            Route::resource('rekening-bank', RekeningBankController::class);
            Route::post('rekening-bank/{sumberDana}/set-main', [RekeningBankController::class, 'setMainAccount'])->name('rekening-bank.set-main'); // Added
        });
        
        Route::prefix('payroll')->name('payroll.')->group(function () {
            Route::get('approval', [\App\Http\Controllers\ManajerHrd\PayrollController::class, 'showApprovalPage'])->name('approval');
            Route::get('history-data', fn() => Inertia::render('roles/Keuangan/Payroll/history-data/index'))->name('history-data');
            Route::get('payment', [\App\Http\Controllers\ManajerHrd\PayrollController::class, 'showPaymentPage'])->name('payment');
        });
        
        Route::prefix('budget')->name('budget.')->group(function () {
            Route::get('rencana', fn() => Inertia::render('roles/Keuangan/Budget/rencana/index'))->name('rencana');
            Route::get('realisasi', fn() => Inertia::render('roles/Keuangan/Budget/realisasi/index'))->name('realisasi');
            Route::get('monitoring', fn() => Inertia::render('roles/Keuangan/Budget/monitoring/index'))->name('monitoring');
        });
        
        Route::prefix('laporan')->name('laporan.')->group(function () {
            Route::get('bulanan', fn() => Inertia::render('roles/Keuangan/Laporan/bulanan/index'))->name('bulanan');
            Route::get('tahunan', fn() => Inertia::render('roles/Keuangan/Laporan/tahunan/index'))->name('tahunan');
            Route::get('neraca', fn() => Inertia::render('roles/Keuangan/Laporan/neraca/index'))->name('neraca');
            Route::get('direksi', fn() => Inertia::render('roles/Keuangan/Laporan/direksi/index'))->name('direksi');
        });
        
        Route::prefix('pengaturan')->name('pengaturan.')->group(function () {
            Route::get('chart-account', fn() => Inertia::render('roles/Keuangan/Pengaturan/chart-account/index'))->name('chart-account');
            Route::get('user-role', fn() => Inertia::render('roles/Keuangan/Pengaturan/user-role/index'))->name('user-role');
        });

        // Manajemen Keuangan Produk
        Route::prefix('keuangan-produk')->name('keuangan-produk.')->group(function () {
            Route::resource('transaksi', TransaksiController::class);
            Route::get('pembelian', [PembelianBahanBakuController::class, 'index'])->name('pembelian');
            
            // New routes for handling purchase request actions by Keuangan
            Route::put('pembelian/item/{item}/update-status', [PembelianBahanBakuController::class, 'updateItemStatus'])->name('pembelian.item.update-status');
            Route::put('pembelian/batch/{batch}/update-status', [PembelianBahanBakuController::class, 'updateBatchStatus'])->name('pembelian.batch.update-status');
            Route::post('pembelian/batch/{batch}/process-payment', [PembelianBahanBakuController::class, 'processPayment'])->name('pembelian.batch.process-payment');

            Route::resource('pembelian-bahan-baku', PembelianBahanBakuController::class); // Added resource route
            Route::get('persediaan', [App\Http\Controllers\Keuangan\KeuanganProduk\PersediaanController::class, 'index'])->name('persediaan');
            
            // Routes for Produk Harga
            Route::get('harga', [ProdukHargaController::class, 'index'])->name('harga.index');
            Route::put('harga/{produkJual}/approve', [ProdukHargaController::class, 'approve'])->name('harga.approve');
            Route::put('harga/{produkJual}/reject', [ProdukHargaController::class, 'reject'])->name('harga.reject');
            Route::put('harga/{produkJual}/approve-banding', [ProdukHargaController::class, 'approveBanding'])->name('harga.approve-banding');
            
            // Route for Transaksi Monitoring
            Route::get('transaksi-produk', [App\Http\Controllers\ManajerKeuangan\TransaksiProdukController::class, 'index'])->name('transaksi-produk.index');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Staf Keuangan Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/staf-keuangan')->middleware(['auth', 'role.permission'])->name('staf-keuangan.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles/Keuangan/dashboard'))->name('index');
        
        Route::prefix('harian')->name('harian.')->group(function () {
            Route::get('pemasukan', fn() => Inertia::render('roles/Keuangan/Harian/pemasukan/index'))->name('pemasukan');
            Route::get('pengeluaran', fn() => Inertia::render('roles/Keuangan/Harian/pengeluaran/index'))->name('pengeluaran');
        });
        
        Route::prefix('payroll')->name('payroll.')->group(function () {
            Route::get('data-gaji', fn() => Inertia::render('roles/Keuangan/Payroll/data-gaji/index'))->name('data-gaji');
        });
    });


    /*
    |--------------------------------------------------------------------------
    | PPIC Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/manajer-ppic')->middleware(['auth', 'role.permission'])->name('manajer-ppic.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.manajer-ppic.dashboard'))->name('index');
        
        Route::prefix('perencanaan')->name('perencanaan.')->group(function () {
            Route::get('pesanan', [PpicPesananController::class, 'index'])->name('pesanan.index');
            // Removed create and store routes for PPIC as Marketing will create
            // Route::get('pesanan/create', [App\Http\Controllers\Ppic\PpicPesananController::class, 'create'])->name('pesanan.create');
            // Route::post('pesanan', [App\Http\Controllers\Ppic\PpicPesananController::class, 'store'])->name('pesanan.store');
            Route::put('pesanan/{produkJual}/submit-price', [PpicPesananController::class, 'submitPrice'])->name('pesanan.submit-price');
            Route::put('pesanan/{produkJual}/approve-tenggat', [PpicPesananController::class, 'approveTenggat'])->name('pesanan.approve-tenggat');
            Route::put('pesanan/{produkJual}/reject-tenggat', [PpicPesananController::class, 'rejectTenggat'])->name('pesanan.reject-tenggat');
            Route::put('pesanan/{produkJual}/update-tenggat', [PpicPesananController::class, 'updateTenggat'])->name('pesanan.update-tenggat');
            Route::get('jadwal-induk-produksi', [App\Http\Controllers\ManajerPpic\JadwalIndukProduksiController::class, 'index'])->name('jadwal-induk-produksi');
            Route::get('simulasi', fn() => Inertia::render('roles.manajer-ppic.perencanaan.simulasi'))->name('simulasi');
        });
        
        Route::prefix('inventaris')->name('inventaris.')->group(function () {
            Route::get('stok', fn() => Inertia::render('roles.manajer-ppic.inventaris.stok'))->name('stok');
            Route::get('mrp', fn() => Inertia::render('roles.manajer-ppic.inventaris.mrp'))->name('mrp');
            Route::get('pembelian/create', [App\Http\Controllers\Ppic\PpicPembelianBahanBakuController::class, 'create'])->name('pembelian.create');
            Route::get('pembelian', [App\Http\Controllers\Ppic\PpicPembelianBahanBakuController::class, 'index'])->name('pembelian.index');
            Route::post('pembelian', [App\Http\Controllers\Ppic\PpicPembelianBahanBakuController::class, 'store'])->name('pembelian.store');
        });
        
        Route::prefix('monitoring')->name('monitoring.')->group(function () {
            Route::get('status', fn() => Inertia::render('roles.manajer-ppic.monitoring.status'))->name('status');
            Route::get('kapasitas', fn() => Inertia::render('roles.manajer-ppic.monitoring.kapasitas'))->name('kapasitas');
            Route::get('laporan-direksi', fn() => Inertia::render('roles.manajer-ppic.monitoring.laporan-direksi'))->name('laporan-direksi');
        });
        
        Route::prefix('administrasi')->name('administrasi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.manajer-ppic.administrasi.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.manajer-ppic.administrasi.jadwal'))->name('jadwal');
            Route::get('cuti', fn() => Inertia::render('roles.manajer-ppic.administrasi.cuti'))->name('cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.manajer-ppic.administrasi.slip-gaji'))->name('slip-gaji');
            Route::get('rekening', fn() => Inertia::render('roles.manajer-ppic.administrasi.rekening'))->name('rekening');
        });
    });

    Route::prefix('roles/staf-ppic')->middleware(['auth', 'role.permission'])->name('staf-ppic.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.staf-ppic.dashboard'))->name('index');
        
        Route::prefix('perencanaan')->name('perencanaan.')->group(function () {
            Route::get('pesanan', fn() => Inertia::render('roles.staf-ppic.perencanaan.pesanan'))->name('pesanan');
            Route::get('jadwal-induk-produksi', fn() => Inertia::render('roles.staf-ppic.perencanaan.jadwal-induk-produksi'))->name('jadwal-induk-produksi');
            Route::get('simulasi', fn() => Inertia::render('roles.staf-ppic.perencanaan.simulasi'))->name('simulasi');
        });
        
        Route::prefix('inventaris')->name('inventaris.')->group(function () {
            Route::get('stok', fn() => Inertia::render('roles.staf-ppic.inventaris.stok'))->name('stok');
            Route::get('mrp', fn() => Inertia::render('roles.staf-ppic.inventaris.mrp'))->name('mrp');
            Route::get('pembelian', fn() => Inertia::render('roles.staf-ppic.inventaris.pembelian'))->name('pembelian');
        });
        
        Route::prefix('monitoring')->name('monitoring.')->group(function () {
            Route::get('status', fn() => Inertia::render('roles.staf-ppic.monitoring.status'))->name('status');
            Route::get('kapasitas', fn() => Inertia::render('roles.staf-ppic.monitoring.kapasitas'))->name('kapasitas');
        });
        
        Route::prefix('administrasi')->name('administrasi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.staf-ppic.administrasi.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.staf-ppic.administrasi.jadwal'))->name('jadwal');
            Route::get('cuti', fn() => Inertia::render('roles.staf-ppic.administrasi.cuti'))->name('cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.staf-ppic.administrasi.slip-gaji'))->name('slip-gaji');
            Route::get('rekening', fn() => Inertia::render('roles.staf-ppic.administrasi.rekening'))->name('rekening');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Manajer Produksi Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/manajer-produksi-kayu')->middleware(['auth', 'role.permission'])->name('manajer-produksi-kayu.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.manajer-produksi-kayu.dashboard'))->name('index');
        
        Route::prefix('manajemen-produksi')->name('manajemen-produksi.')->group(function () {
            Route::get('perintah-kerja', fn() => Inertia::render('roles.manajer-produksi-kayu.manajemen-produksi.perintah-kerja'))->name('perintah-kerja');
            Route::get('alokasi-tugas', fn() => Inertia::render('roles.manajer-produksi-kayu.manajemen-produksi.alokasi-tugas'))->name('alokasi-tugas');
            Route::get('monitoring-progres', fn() => Inertia::render('roles.manajer-produksi-kayu.manajemen-produksi.monitoring-progres'))->name('monitoring-progres');
            Route::get('pengerjaan-ulang', fn() => Inertia::render('roles.manajer-produksi-kayu.manajemen-produksi.pengerjaan-ulang'))->name('pengerjaan-ulang');
        });
        
        Route::prefix('laporan')->name('laporan.')->group(function () {
            Route::get('output-harian', fn() => Inertia::render('roles.manajer-produksi-kayu.laporan.output-harian'))->name('output-harian');
            Route::get('analisis-kualitas', fn() => Inertia::render('roles.manajer-produksi-kayu.laporan.analisis-kualitas'))->name('analisis-kualitas');
            Route::get('kinerja-crew', fn() => Inertia::render('roles.manajer-produksi-kayu.laporan.kinerja-crew'))->name('kinerja-crew');
            Route::get('direksi', fn() => Inertia::render('roles.manajer-produksi-kayu.laporan.direksi'))->name('direksi');
        });
        
        Route::prefix('administrasi-pribadi')->name('administrasi-pribadi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.manajer-produksi-kayu.administrasi-pribadi.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.manajer-produksi-kayu.administrasi-pribadi.jadwal'))->name('jadwal');
            Route::get('cuti', fn() => Inertia::render('roles.manajer-produksi-kayu.administrasi-pribadi.cuti'))->name('cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.manajer-produksi-kayu.administrasi-pribadi.slip-gaji'))->name('slip-gaji');
            Route::get('rekening', fn() => Inertia::render('roles.manajer-produksi-kayu.administrasi-pribadi.rekening'))->name('rekening');
        });
    });

    Route::prefix('roles/manajer-produksi-besi')->middleware(['auth', 'role.permission'])->name('manajer-produksi-besi.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.manajer-produksi-besi.dashboard'))->name('index');
        
        Route::prefix('manajemen-produksi')->name('manajemen-produksi.')->group(function () {
            Route::get('perintah-kerja', fn() => Inertia::render('roles.manajer-produksi-besi.manajemen-produksi.perintah-kerja'))->name('perintah-kerja');
            Route::get('alokasi-tugas', fn() => Inertia::render('roles.manajer-produksi-besi.manajemen-produksi.alokasi-tugas'))->name('alokasi-tugas');
            Route::get('monitoring-progres', fn() => Inertia::render('roles.manajer-produksi-besi.manajemen-produksi.monitoring-progres'))->name('monitoring-progres');
            Route::get('pengerjaan-ulang', fn() => Inertia::render('roles.manajer-produksi-besi.manajemen-produksi.pengerjaan-ulang'))->name('pengerjaan-ulang');
        });
        
        Route::prefix('laporan')->name('laporan.')->group(function () {
            Route::get('output-harian', fn() => Inertia::render('roles.manajer-produksi-besi.laporan.output-harian'))->name('output-harian');
            Route::get('analisis-kualitas', fn() => Inertia::render('roles.manajer-produksi-besi.laporan.analisis-kualitas'))->name('analisis-kualitas');
            Route::get('kinerja-crew', fn() => Inertia::render('roles.manajer-produksi-besi.laporan.kinerja-crew'))->name('kinerja-crew');
            Route::get('direksi', fn() => Inertia::render('roles.manajer-produksi-besi.laporan.direksi'))->name('direksi');
        });
        
        Route::prefix('administrasi-pribadi')->name('administrasi-pribadi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.manajer-produksi-besi.administrasi-pribadi.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.manajer-produksi-besi.administrasi-pribadi.jadwal'))->name('jadwal');
            Route::get('cuti', fn() => Inertia::render('roles.manajer-produksi-besi.administrasi-pribadi.cuti'))->name('cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.manajer-produksi-besi.administrasi-pribadi.slip-gaji'))->name('slip-gaji');
            Route::get('rekening', fn() => Inertia::render('roles.manajer-produksi-besi.administrasi-pribadi.rekening'))->name('rekening');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Marketing Routes
    |--------------------------------------------------------------------------
    */
            Route::prefix('roles/manajer-marketing')->middleware(['auth', 'role.permission'])->name('manajer-marketing.')->group(function () {
                Route::get('/', fn() => Inertia::render('roles.manajer-marketing.dashboard'))->name('index');
                Route::get('crm', [MarketingPesananController::class, 'index'])->name('crm.index');
        Route::get('analitik', fn() => Inertia::render('roles.manajer-marketing.analitik'))->name('analitik');
        
        Route::prefix('campaigns')->name('kampanye.')->group(function () {
            Route::get('email', fn() => Inertia::render('roles.manajer-marketing.campaigns.email'))->name('email');
            Route::get('sosial', fn() => Inertia::render('roles.manajer-marketing.campaigns.sosial'))->name('sosial');
        });
        
        Route::prefix('reports')->name('laporan.')->group(function () {
            Route::get('direksi', fn() => Inertia::render('roles.manajer-marketing.reports.direksi'))->name('direksi');
        });
        
        Route::prefix('administrasi-pribadi')->name('administrasi-pribadi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.manajer-marketing.administrasi-pribadi.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.manajer-marketing.administrasi-pribadi.jadwal'))->name('jadwal');
            Route::get('cuti', fn() => Inertia::render('roles.manajer-marketing.administrasi-pribadi.cuti'))->name('cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.manajer-marketing.administrasi-pribadi.slip-gaji'))->name('slip-gaji');
            Route::get('rekening', fn() => Inertia::render('roles.manajer-marketing.administrasi-pribadi.rekening'))->name('rekening');
        });
    });

    Route::prefix('roles/staf-marketing')->middleware(['auth', 'role.permission'])->name('staf-marketing.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.marketing.index'))->name('index');
        Route::get('crm', fn() => Inertia::render('roles.marketing.crm'))->name('crm');
        Route::get('eksekusi-kampanye', fn() => Inertia::render('roles.marketing.eksekusi-kampanye'))->name('eksekusi-kampanye');
        
        Route::prefix('administrasi-pribadi')->name('administrasi-pribadi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.marketing.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.marketing.jadwal'))->name('jadwal');
            Route::get('cuti', fn() => Inertia::render('roles.marketing.cuti'))->name('cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.marketing.slip-gaji'))->name('slip-gaji');
            Route::get('rekening', fn() => Inertia::render('roles.marketing.rekening'))->name('rekening');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Direktur Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/direktur')->middleware(['auth', 'role.permission'])->name('direktur.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.direktur.dashboard'))->name('index');
        Route::get('meeting-management', fn() => Inertia::render('roles.direktur.meeting-management'))->name('meeting-management');
        Route::get('pesanan-notifications', fn() => Inertia::render('roles.direktur.pesanan-notifications'))->name('pesanan-notifications');
        
        Route::prefix('laporan')->name('laporan.')->group(function () {
            Route::get('integrasi-departemen', fn() => Inertia::render('roles.direktur.laporan.integrasi-departemen'))->name('integrasi-departemen');
            Route::get('produksi', fn() => Inertia::render('roles.direktur.laporan.produksi'))->name('produksi');
            Route::get('keuangan', fn() => Inertia::render('roles.direktur.laporan.keuangan'))->name('keuangan');
            Route::get('penjualan', fn() => Inertia::render('roles.direktur.laporan.penjualan'))->name('penjualan');
        });
        
        Route::get('analitik', fn() => Inertia::render('roles.direktur.analitik'))->name('analitik');
        
        Route::prefix('persetujuan')->name('persetujuan.')->group(function () {
            Route::get('anggaran', fn() => Inertia::render('roles.direktur.persetujuan.anggaran'))->name('anggaran');
            Route::get('proyek', fn() => Inertia::render('roles.direktur.persetujuan.proyek'))->name('proyek');
        });
        
        Route::prefix('administrasi-pribadi')->name('administrasi-pribadi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.direktur.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.direktur.jadwal'))->name('jadwal');
            Route::get('cuti', fn() => Inertia::render('roles.direktur.cuti'))->name('cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.direktur.slip-gaji'))->name('slip-gaji');
            Route::get('rekening', fn() => Inertia::render('roles.direktur.rekening'))->name('rekening');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Software Engineer Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/software-engineer')->middleware(['auth', 'role.permission'])->name('software-engineer.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.software-engineer.dashboard'))->name('index');
        
        Route::prefix('development')->name('development.')->group(function () {
            Route::get('projects', fn() => Inertia::render('roles.software-engineer.development.projects'))->name('projects');
            Route::get('tasks', fn() => Inertia::render('roles.software-engineer.development.tasks'))->name('tasks');
            Route::get('documentation', fn() => Inertia::render('roles.software-engineer.development.documentation'))->name('documentation');
        });
        
        Route::prefix('system')->name('system.')->group(function () {
            Route::get('monitoring', fn() => Inertia::render('roles.software-engineer.system.monitoring'))->name('monitoring');
            Route::get('logs', fn() => Inertia::render('roles.software-engineer.system.logs'))->name('logs');
            Route::get('database', fn() => Inertia::render('roles.software-engineer.system.database'))->name('database');
        });
    });


    /*
    |--------------------------------------------------------------------------
    | Manajer Marketing Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/manajer-marketing')->middleware(['auth', 'role.permission'])->name('manajer-marketing.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.manajer-marketing.dashboard'))->name('index');
        
                    Route::prefix('crm')->name('crm.')->group(function () {
                        Route::get('/', [MarketingPesananController::class, 'index'])->name('index'); // Updated CRM index
                        Route::get('leads', fn() => Inertia::render('roles.manajer-marketing.crm.leads'))->name('leads');
                        Route::get('customers', fn() => Inertia::render('roles.manajer-marketing.crm.customers'))->name('customers');
                        Route::get('opportunities', fn() => Inertia::render('roles.manajer-marketing.crm.opportunities'))->name('opportunities');
                    });
                    Route::post('pesanan', [MarketingPesananController::class, 'store'])->name('pesanan.store');
                    Route::put('pesanan/{produkJual}/confirm', [MarketingPesananController::class, 'confirm'])->name('pesanan.confirm');
                    Route::put('pesanan/{produkJual}/reject', [MarketingPesananController::class, 'reject'])->name('pesanan.reject');
                    Route::put('pesanan/{produkJual}/cancel', [MarketingPesananController::class, 'cancel'])->name('pesanan.cancel');
                    Route::put('pesanan/{produkJual}/banding', [MarketingPesananController::class, 'banding'])->name('pesanan.banding');
                    Route::put('pesanan/{produkJual}/banding-tenggat', [MarketingPesananController::class, 'bandingTenggat'])->name('pesanan.banding-tenggat');        
        Route::prefix('analitik')->name('analitik.')->group(function () {
            Route::get('penjualan', fn() => Inertia::render('roles.manajer-marketing.analitik.penjualan'))->name('penjualan');
            Route::get('market-trends', fn() => Inertia::render('roles.manajer-marketing.analitik.market-trends'))->name('market-trends');
            Route::get('customer-behavior', fn() => Inertia::render('roles.manajer-marketing.analitik.customer-behavior'))->name('customer-behavior');
        });
        
        Route::prefix('kampanye')->name('kampanye.')->group(function () {
            Route::get('perencanaan', fn() => Inertia::render('roles.manajer-marketing.kampanye.perencanaan'))->name('perencanaan');
            Route::get('eksekusi', fn() => Inertia::render('roles.manajer-marketing.kampanye.eksekusi'))->name('eksekusi');
            Route::get('evaluasi', fn() => Inertia::render('roles.manajer-marketing.kampanye.evaluasi'))->name('evaluasi');
        });
        
        Route::prefix('laporan')->name('laporan.')->group(function () {
            Route::get('bulanan', fn() => Inertia::render('roles.manajer-marketing.laporan.bulanan'))->name('bulanan');
            Route::get('direksi', fn() => Inertia::render('roles.manajer-marketing.laporan.direksi'))->name('direksi');
        });
        
        Route::prefix('administrasi-pribadi')->name('administrasi-pribadi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.manajer-marketing.administrasi-pribadi.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.manajer-marketing.administrasi-pribadi.jadwal'))->name('jadwal');
            Route::get('cuti', fn() => Inertia::render('roles.manajer-marketing.administrasi-pribadi.cuti'))->name('cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.manajer-marketing.administrasi-pribadi.slip-gaji'))->name('slip-gaji');
            Route::get('rekening', fn() => Inertia::render('roles.manajer-marketing.administrasi-pribadi.rekening'))->name('rekening');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Staf Marketing Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/staf-marketing')->middleware(['auth', 'role.permission'])->name('staf-marketing.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.staf-marketing.dashboard'))->name('index');
        
        Route::prefix('crm')->name('crm.')->group(function () {
            Route::get('leads', fn() => Inertia::render('roles.staf-marketing.crm.leads'))->name('leads');
            Route::get('customers', fn() => Inertia::render('roles.staf-marketing.crm.customers'))->name('customers');
            Route::get('follow-up', fn() => Inertia::render('roles.staf-marketing.crm.follow-up'))->name('follow-up');
        });
        
        Route::prefix('eksekusi-kampanye')->name('eksekusi-kampanye.')->group(function () {
            Route::get('tugas', fn() => Inertia::render('roles.staf-marketing.eksekusi-kampanye.tugas'))->name('tugas');
            Route::get('konten', fn() => Inertia::render('roles.staf-marketing.eksekusi-kampanye.konten'))->name('konten');
            Route::get('laporan-harian', fn() => Inertia::render('roles.staf-marketing.eksekusi-kampanye.laporan-harian'))->name('laporan-harian');
        });
        
        Route::prefix('administrasi-pribadi')->name('administrasi-pribadi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.staf-marketing.administrasi-pribadi.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.staf-marketing.administrasi-pribadi.jadwal'))->name('jadwal');
            Route::get('cuti', fn() => Inertia::render('roles.staf-marketing.administrasi-pribadi.cuti'))->name('cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.staf-marketing.administrasi-pribadi.slip-gaji'))->name('slip-gaji');
            Route::get('rekening', fn() => Inertia::render('roles.staf-marketing.administrasi-pribadi.rekening'))->name('rekening');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Shared Routes (All Authenticated Users)
    |--------------------------------------------------------------------------
    */
    
    // Logout
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    
    // Profile Routes
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', fn() => Inertia::render('Profile/Edit'))->name('edit');
        Route::patch('/', [SettingsProfileController::class, 'update'])->name('update');
        Route::delete('/', [SettingsProfileController::class, 'destroy'])->name('destroy');
    });

    // Settings Routes
    Route::prefix('settings')->name('settings.')->middleware('auth')->group(function () {
        Route::get('/profile', fn() => Inertia::render('settings/profile'))->name('profile');
        Route::get('/password', fn() => Inertia::render('settings/password'))->name('password');
        Route::get('/appearance', fn() => Inertia::render('settings/appearance'))->name('appearance');
    });

    // Password Update Route
    Route::put('/password', [SettingsProfileController::class, 'updatePassword'])->name('password.update');
    
    // Under Development Route
    Route::get('/under-development', fn() => Inertia::render('UnderDevelopment'))->name('under-development');
    
    // Under Development Route
    Route::get('/under-development', fn() => Inertia::render('UnderDevelopment'))->name('under-development');
    
    // Leave/Izin Request Routes (Pengajuan Izin - Cuti, Sakit, Izin Tidak Masuk)
    Route::prefix('leave-requests')->name('leave-requests.')->group(function () {
        Route::get('/', [LeaveRequestController::class, 'index'])->name('index');
        Route::get('/requests', [LeaveRequestController::class, 'getLeaveRequests'])->name('requests');
        Route::post('/submit', [LeaveRequestController::class, 'submitRequest'])->name('submit');
        Route::put('/{pengajuan}', [LeaveRequestController::class, 'updateRequest'])->name('update');
        Route::delete('/{id}', [LeaveRequestController::class, 'destroy'])->name('destroy');
        Route::delete('/{pengajuan}/cancel', [LeaveRequestController::class, 'cancelRequest'])->name('cancel');
    });
    
    // Shared Crew Routes (for all crew types)
    Route::prefix('shared')->name('shared.')->group(function () {
        Route::prefix('administrasi-pribadi')->name('administrasi-pribadi.')->group(function () {
            Route::get('identitas-diri', fn() => Inertia::render('Crew.IdentitasDiri.Index'))->name('identitas-diri');
            Route::get('jadwal', fn() => Inertia::render('shared.administrasi-pribadi.jadwal'))->name('jadwal');
        });
    });
    
    /*
    |--------------------------------------------------------------------------
    | Presensi Routes (Main)
    |--------------------------------------------------------------------------
    */
    Route::prefix('presensi')->middleware('auth')->group(function () {
        Route::get('/schedule', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'showSchedulePage'])->name('presensi.schedule');
        
        // User Actions (POST with redirect)
        Route::post('/checkin', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'checkIn'])->name('presensi.checkin');
        Route::post('/checkout', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'checkOut'])->name('presensi.checkout');
        Route::post('/submit-request', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'submitRequest'])->name('presensi.submit-request');
        Route::post('/cancel-request', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'cancelRequest'])->name('presensi.cancel-request');
    });
    
    /*
    |--------------------------------------------------------------------------
    | Jadwal Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('jadwal')->middleware('auth')->group(function () {
        Route::post('/harian/store', [JadwalController::class, 'storeHarian'])->name('jadwal.harian.store');
        Route::post('/pola/store', [JadwalController::class, 'storePola'])->name('jadwal.pola.store');
        Route::post('/pola/terapkan', [JadwalController::class, 'terapkanPola'])->name('jadwal.pola.terapkan');
    });
    
    /*
    |--------------------------------------------------------------------------
    | Payroll Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('payroll')->middleware(['auth', 'role.permission'])->group(function () {
        Route::get('/', [\App\Http\Controllers\ManajerHrd\PayrollController::class, 'index'])->name('payroll.index');
        Route::post('/process', [\App\Http\Controllers\ManajerHrd\PayrollController::class, 'process'])->name('payroll.process');
        Route::get('/batch/{batch}', [\App\Http\Controllers\ManajerHrd\PayrollController::class, 'showBatch'])->name('payroll.batch.show');
        Route::post('/batch/{batch}/approve', [\App\Http\Controllers\ManajerHrd\PayrollController::class, 'approveBatch'])->name('payroll.batch.approve');
        Route::get('/employee/{employee}/slip', [\App\Http\Controllers\ManajerHrd\PayrollController::class, 'showSlip'])->name('payroll.slip.show');
    });


    /*
|--------------------------------------------------------------------------
| API Routes (JSON Responses)
|--------------------------------------------------------------------------
*/

Route::prefix('api')->middleware(['web', 'auth'])->name('api.')->group(function () {
    
    // Presensi API (Clock-in/out and Status)
    Route::prefix('presensi')->name('presensi.')->group(function () {
        Route::get('/today-status', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'getTodayStatus'])->name('today-status');
        Route::get('/attendance-data', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'getAttendanceData'])->name('attendance-data');
        Route::get('/employee-schedule', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'getEmployeeSchedule'])->name('employee-schedule');
        Route::post('/checkin', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'apiCheckIn'])->name('checkin');
        Route::post('/checkout', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'apiCheckOut'])->name('checkout');
    });

    // Requests API (Izin & Lembur)
    Route::prefix('requests')->name('requests.')->group(function () {
        Route::post('/submit', [LeaveRequestController::class, 'apiSubmitRequest'])->name('submit');
        Route::get('/hrd', [LeaveRequestController::class, 'getHrdRequests'])->name('hrd');
        Route::post('/hrd/approve', [LeaveRequestController::class, 'approveRequest'])->name('hrd.approve');
    });
    
    // Jadwal API
    Route::prefix('jadwal')->name('jadwal.')->group(function () {
        Route::get('/employee-schedule', [JadwalController::class, 'getEmployeeSchedule'])->name('employee-schedule');
        Route::get('/monthly-schedule', [JadwalController::class, 'getMonthlySchedule'])->name('monthly-schedule');
    });
    
    // Payroll API
    Route::prefix('payroll')->name('payroll.')->middleware('role.permission')->group(function () {

        Route::get('/batches', [PayrollController::class, 'getBatches'])->name('batches');
        Route::get('/employees', [PayrollController::class, 'getEmployees'])->name('employees');
        Route::get('/settings', [\App\Http\Controllers\ManajerHrd\PayrollSettingsController::class, 'index'])->name('settings');
        Route::post('/settings', [\App\Http\Controllers\ManajerHrd\PayrollSettingsController::class, 'update'])->name('settings.update');
        Route::post('/validate', [PayrollController::class, 'validate'])->name('validate');
        Route::post('/submit', [PayrollController::class, 'submitBatch'])->name('submit');
        Route::post('/cancel', [PayrollController::class, 'cancelSubmission'])->name('cancel');
        Route::post('/approve-employee', [PayrollController::class, 'approveEmployee'])->name('approve-employee');
        Route::post('/bulk-approve-reject', [PayrollController::class, 'bulkApproveReject'])->name('bulk-approve-reject');
        Route::post('/finalize-approved-batch', [PayrollController::class, 'finalizeApprovedBatch'])->name('finalize-approved-batch');
        Route::post('/bulk-pay', [PayrollController::class, 'bulkPay'])->name('bulk-pay');
    });
});

/*
|--------------------------------------------------------------------------
| Legacy Route Redirects (Backward Compatibility)
|--------------------------------------------------------------------------
*/

// Legacy crew routes redirect
Route::get('roles/crew-besi/presensi', function () {
    return redirect()->route('crew-besi.schedule')->with('message', 'Presensi functionality has been integrated into the schedule page.');
})->middleware('auth')->name('crew-besi.presensi.redirect');

Route::get('roles/crew-kayu/presensi', function () {
    return redirect()->route('crew-kayu.schedule')->with('message', 'Presensi functionality has been integrated into the schedule page.');
})->middleware('auth')->name('crew-kayu.presensi.redirect');

// Legacy dashboard redirects
Route::get('/crew', function () {
    $user = Auth::user();
    if ($user->role === 'crew_kayu') {
        return redirect()->route('crew-kayu.index');
    } elseif ($user->role === 'crew_besi') {
        return redirect()->route('crew-besi.index');
    }
    return redirect()->route('dashboard');
})->middleware('auth');

/*
|--------------------------------------------------------------------------
| Public Routes (Unauthenticated)
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Auth Routes (Guest)
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    // Login
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    
    // Register
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| Fallback Routes (404 Handler)
|--------------------------------------------------------------------------
*/

Route::fallback(function () {
    return Inertia::render('Error', [
        'status' => 404,
        'message' => 'Page not found. Please check the URL or contact administrator.'
    ]);
});