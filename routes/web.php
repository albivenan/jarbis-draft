<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\Shared\Attendance\PresensiController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\Hrd\PayrollController;
use App\Http\Controllers\Settings\ProfileController as SettingsProfileController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\SopController;
use App\Http\Controllers\Keuangan\Harian\PemasukanHarianController;
use App\Http\Controllers\Keuangan\Harian\PengeluaranHarianController;
use App\Http\Controllers\Keuangan\Harian\KasDanBankController;
use App\Http\Controllers\Keuangan\RekeningBankController;
use App\Http\Controllers\Keuangan\Harian\SumberDanaController; // Added

use App\Http\Controllers\Keuangan\PembelianBahanBakuController; // Added

use App\Http\Controllers\Keuangan\KeuanganProduk\TransaksiController; // Added
use App\Http\Controllers\Ppic\PesananController as PpicPesananController;
use App\Http\Controllers\Keuangan\ProdukHargaController;
use App\Http\Controllers\Marketing\PesananController as MarketingPesananController;


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
            'manajer_hrd' => 'hrd.index',
            'manajer_keuangan' => 'keuangan.index',
            'staf_keuangan' => 'keuangan.index',
            'manajer_marketing' => 'marketing.index',
            'staf_marketing' => 'staf-marketing.index',
            'manajer_ppic' => 'ppic.index',
            'staf_ppic' => 'ppic.index',
            'manajer_produksi_kayu' => 'produksi.index',
            'manajer_produksi_besi' => 'produksi.index',
            'supervisor_kayu' => 'supervisor.index',
            'supervisor_besi' => 'supervisor.index',
            'qc_kayu' => 'qc.index',
            'qc_besi' => 'qc.index',
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
    | QC Routes (Shared)
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/qc')->middleware(['auth', 'role.permission'])->name('qc.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.qc.dashboard'))->name('index');
        Route::get('schedule', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'showSchedulePage'])->name('schedule');
        
        Route::prefix('inspeksi')->name('inspeksi.')->group(function () {
            Route::get('antrean-inspeksi', fn() => Inertia::render('roles.qc.inspeksi.antrean-inspeksi'))->name('antrean-inspeksi');
            Route::get('detail-produksi', fn() => Inertia::render('roles.qc.inspeksi.detail-produksi'))->name('detail-produksi');
            Route::get('formulir-laporan', fn() => Inertia::render('roles.qc.inspeksi.formulir-laporan'))->name('formulir-laporan');
        });
        
        Route::prefix('dokumen')->name('dokumen.')->group(function () {
            Route::get('standar-kualitas', fn() => Inertia::render('roles.qc.dokumen.standar-kualitas'))->name('standar-kualitas');
            Route::get('riwayat-inspeksi', fn() => Inertia::render('roles.qc.dokumen.riwayat-inspeksi'))->name('riwayat-inspeksi');
            Route::get('analisis-reject', fn() => Inertia::render('roles.qc.dokumen.analisis-reject'))->name('analisis-reject');
        });
    });


    /*
    |--------------------------------------------------------------------------
    | Supervisor Routes (Shared: Supervisor Besi & Supervisor Kayu)
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/supervisor')->middleware(['auth', 'role.permission'])->name('supervisor.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.supervisor.dashboard'))->name('index');
        
        Route::prefix('tugas-saya')->name('tugas-saya.')->group(function () {
            Route::get('daftar-tugas', fn() => Inertia::render('roles.supervisor.tugas-saya.daftar-tugas'))->name('daftar-tugas');
            Route::get('instruksi-kerja', fn() => Inertia::render('roles.supervisor.tugas-saya.instruksi-kerja'))->name('instruksi-kerja');
            Route::get('lapor-progres', fn() => Inertia::render('roles.supervisor.tugas-saya.lapor-progres'))->name('lapor-progres');
            Route::get('lapor-kendala', fn() => Inertia::render('roles.supervisor.tugas-saya.lapor-kendala'))->name('lapor-kendala');
        });
        
        Route::prefix('kualitas')->name('kualitas.')->group(function () {
            Route::get('status-catatan-qc', fn() => Inertia::render('roles.supervisor.kualitas.status-catatan-qc'))->name('status-catatan-qc');
            Route::get('antrean-rework', fn() => Inertia::render('roles.supervisor.kualitas.antrean-rework'))->name('antrean-rework');
        });
        
        Route::prefix('kinerja')->name('kinerja.')->group(function () {
            Route::get('penilaian-crew', fn() => Inertia::render('roles.supervisor.kinerja.penilaian-crew'))->name('penilaian-crew');
            Route::get('riwayat-penilaian', fn() => Inertia::render('roles.supervisor.kinerja.riwayat-penilaian'))->name('riwayat-penilaian');
        });
    });


    /*
    |--------------------------------------------------------------------------
    | HRD Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/hrd')->middleware(['auth', 'role.permission'])->name('hrd.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.hrd.dashboard'))->name('index');
        
        // Data Karyawan
        Route::prefix('karyawan')->name('karyawan.')->group(function () {
            Route::get('daftar', [App\Http\Controllers\Hrd\KaryawanController::class, 'index'])->name('daftar');
            Route::get('demografi', [App\Http\Controllers\Hrd\DemografiController::class, 'index'])->name('demografi');
            Route::get('{id_karyawan}/detail', [App\Http\Controllers\Hrd\KaryawanController::class, 'show'])->name('detail');
            Route::get('kontrak', fn() => Inertia::render('roles.hrd.karyawan.kontrak'))->name('kontrak');
            Route::get('permintaan-perubahan-data', [App\Http\Controllers\Hrd\KaryawanController::class, 'showChangeRequests'])->name('permintaan-perubahan-data');
        });
        
        // Manajemen Absensi
        Route::prefix('manajemen-presensi')->name('manajemen-presensi.')->group(function () {
            Route::get('presensi', fn() => Inertia::render('roles/hrd/manajemen-presensi/presensi'))->name('presensi');
            Route::get('pengajuan', [LeaveRequestController::class, 'hrdPengajuanPage'])->name('pengajuan');
            Route::get('jadwal', fn() => Inertia::render('roles/hrd/manajemen-presensi/jadwal'))->name('jadwal');
        });
        
        // Manajemen Penggajian
        Route::prefix('penggajian')->name('penggajian.')->group(function () {
            Route::get('proses', [App\Http\Controllers\Hrd\PayrollController::class, 'index'])->name('proses');
            Route::post('proses/validate', [App\Http\Controllers\Hrd\PayrollController::class, 'validate'])->name('proses.validate');
            Route::post('proses/update-koreksi', [App\Http\Controllers\Hrd\PayrollController::class, 'updateKoreksi'])->name('proses.update-koreksi');
            Route::get('riwayat', fn() => Inertia::render('roles.hrd.penggajian.riwayat'))->name('riwayat');
            // Updated 'pengaturan' route to use the new controller
            Route::get('pengaturan', [App\Http\Controllers\Hrd\PengaturanGajiController::class, 'show'])->name('pengaturan');
            Route::post('pengaturan', [App\Http\Controllers\Hrd\PengaturanGajiController::class, 'update'])->name('pengaturan.update');
        });
        
        // Administrasi Perusahaan
        Route::prefix('administrasi')->name('administrasi.')->group(function () {
            Route::get('sk', fn() => Inertia::render('roles.hrd.administrasi.sk'))->name('sk');
            Route::get('dokumen', fn() => Inertia::render('roles.hrd.administrasi.dokumen'))->name('dokumen');
            Route::resource('sop', SopController::class);
            Route::get('profil-perusahaan', [App\Http\Controllers\Hrd\ProfilPerusahaanController::class, 'show'])->name('profil-perusahaan');
            Route::post('profil-perusahaan', [App\Http\Controllers\Hrd\ProfilPerusahaanController::class, 'update'])->name('profil-perusahaan.update');
        });
        
        // Laporan HRD
        Route::prefix('laporan')->name('laporan.')->group(function () {
            Route::get('kehadiran', fn() => Inertia::render('roles/hrd/laporan/kehadiran/index'))->name('kehadiran');
            Route::get('turnover', fn() => Inertia::render('roles/hrd/laporan/turnover/index'))->name('turnover');
            Route::get('penggajian', [App\Http\Controllers\Laporan\PenggajianController::class, 'index'])->name('penggajian');
            Route::get('direksi', [App\Http\Controllers\Laporan\DireksiController::class, 'index'])->name('direksi');
        });

        // Pengumuman
        Route::prefix('pengumuman')->name('pengumuman.')->group(function () {
            Route::get('buat', [App\Http\Controllers\Hrd\PengumumanController::class, 'create'])->name('buat');
            Route::post('store', [App\Http\Controllers\Hrd\PengumumanController::class, 'store'])->name('store');
            Route::prefix('riwayat')->name('riwayat.')->group(function () {
                Route::get('/', [App\Http\Controllers\Hrd\PengumumanController::class, 'index'])->name('index');
                Route::get('{pengumuman}', [App\Http\Controllers\Hrd\PengumumanController::class, 'show'])->name('show');
                Route::delete('{pengumuman}', [App\Http\Controllers\Hrd\PengumumanController::class, 'destroy'])->name('destroy');
            });
        });
        
        // Administrasi Pribadi
        Route::prefix('administrasi-pribadi')->name('administrasi-pribadi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.hrd.administrasi-pribadi.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.hrd.administrasi-pribadi.jadwal'))->name('jadwal');
            Route::get('pengajuan-cuti', fn() => Inertia::render('roles.hrd.administrasi-pribadi.pengajuan-cuti'))->name('pengajuan-cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.hrd.administrasi-pribadi.slip-gaji'))->name('slip-gaji');
            Route::get('kelola-rekening', fn() => Inertia::render('roles.hrd.administrasi-pribadi.kelola-rekening'))->name('kelola-rekening');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Keuangan Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/keuangan')->middleware(['auth', 'role.permission'])->name('keuangan.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles/keuangan/dashboard'))->name('index');
        
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
            Route::get('sumber-dana', fn() => Inertia::render('roles/keuangan/Harian/sumber-dana/index'))->name('sumber-dana');
            Route::get('sumber-dana/{sumberDana}', [SumberDanaController::class, 'show'])->name('sumber-dana.show'); // Added
            Route::resource('rekening-bank', RekeningBankController::class);
            Route::post('rekening-bank/{sumberDana}/set-main', [RekeningBankController::class, 'setMainAccount'])->name('rekening-bank.set-main'); // Added
        });
        
        Route::prefix('payroll')->name('payroll.')->group(function () {
            Route::get('approval', [\App\Http\Controllers\Hrd\PayrollController::class, 'showApprovalPage'])->name('approval');
            Route::get('history-data', fn() => Inertia::render('roles/keuangan/Payroll/history-data/index'))->name('history-data');
            Route::get('payment', [\App\Http\Controllers\Hrd\PayrollController::class, 'showPaymentPage'])->name('payment');
        });
        
        Route::prefix('budget')->name('budget.')->group(function () {
            Route::get('rencana', fn() => Inertia::render('roles/keuangan/Budget/rencana/index'))->name('rencana');
            Route::get('realisasi', fn() => Inertia::render('roles/keuangan/Budget/realisasi/index'))->name('realisasi');
            Route::get('monitoring', fn() => Inertia::render('roles/keuangan/Budget/monitoring/index'))->name('monitoring');
        });
        
        Route::prefix('laporan')->name('laporan.')->group(function () {
            Route::get('bulanan', fn() => Inertia::render('roles/keuangan/Laporan/bulanan/index'))->name('bulanan');
            Route::get('tahunan', fn() => Inertia::render('roles/keuangan/Laporan/tahunan/index'))->name('tahunan');
            Route::get('neraca', fn() => Inertia::render('roles/keuangan/Laporan/neraca/index'))->name('neraca');
            Route::get('direksi', fn() => Inertia::render('roles/keuangan/Laporan/direksi/index'))->name('direksi');
        });
        
        Route::prefix('pengaturan')->name('pengaturan.')->group(function () {
            Route::get('chart-account', fn() => Inertia::render('roles/keuangan/Pengaturan/chart-account/index'))->name('chart-account');
            Route::get('user-role', fn() => Inertia::render('roles/keuangan/Pengaturan/user-role/index'))->name('user-role');
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
            Route::get('transaksi-produk', [App\Http\Controllers\Keuangan\TransaksiProdukController::class, 'index'])->name('transaksi-produk.index');
        });
    });


    /*
    |--------------------------------------------------------------------------
    | PPIC Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/ppic')->middleware(['auth', 'role.permission'])->name('ppic.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.ppic.dashboard'))->name('index');
        
        Route::prefix('perencanaan')->name('perencanaan.')->group(function () {
            Route::get('pesanan', [PpicPesananController::class, 'index'])->name('pesanan.index');
            // Removed create and store routes for PPIC as Marketing will create
            // Route::get('pesanan/create', [App\Http\Controllers\Ppic\PpicPesananController::class, 'create'])->name('pesanan.create');
            // Route::post('pesanan', [App\Http\Controllers\Ppic\PpicPesananController::class, 'store'])->name('pesanan.store');
            Route::put('pesanan/{produkJual}/submit-price', [PpicPesananController::class, 'submitPrice'])->name('pesanan.submit-price');
            Route::put('pesanan/{produkJual}/approve-tenggat', [PpicPesananController::class, 'approveTenggat'])->name('pesanan.approve-tenggat');
            Route::put('pesanan/{produkJual}/reject-tenggat', [PpicPesananController::class, 'rejectTenggat'])->name('pesanan.reject-tenggat');
            Route::put('pesanan/{produkJual}/update-tenggat', [PpicPesananController::class, 'updateTenggat'])->name('pesanan.update-tenggat');
            Route::get('jadwal-induk-produksi', [App\Http\Controllers\Ppic\JadwalIndukProduksiController::class, 'index'])->name('jadwal-induk-produksi');
            Route::get('simulasi', fn() => Inertia::render('roles.ppic.perencanaan.simulasi'))->name('simulasi');
        });
        
        Route::prefix('inventaris')->name('inventaris.')->group(function () {
            Route::get('stok', fn() => Inertia::render('roles.ppic.inventaris.stok'))->name('stok');
            Route::get('mrp', fn() => Inertia::render('roles.ppic.inventaris.mrp'))->name('mrp');
            Route::get('pembelian/create', [App\Http\Controllers\Ppic\PpicPembelianBahanBakuController::class, 'create'])->name('pembelian.create');
            Route::get('pembelian', [App\Http\Controllers\Ppic\PpicPembelianBahanBakuController::class, 'index'])->name('pembelian.index');
            Route::post('pembelian', [App\Http\Controllers\Ppic\PpicPembelianBahanBakuController::class, 'store'])->name('pembelian.store');
        });
        
        Route::prefix('monitoring')->name('monitoring.')->group(function () {
            Route::get('status', fn() => Inertia::render('roles.ppic.monitoring.status'))->name('status');
            Route::get('kapasitas', fn() => Inertia::render('roles.ppic.monitoring.kapasitas'))->name('kapasitas');
            Route::get('laporan-direksi', fn() => Inertia::render('roles.ppic.monitoring.laporan-direksi'))->name('laporan-direksi');
        });
        
        Route::prefix('administrasi')->name('administrasi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.ppic.administrasi.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.ppic.administrasi.jadwal'))->name('jadwal');
            Route::get('cuti', fn() => Inertia::render('roles.ppic.administrasi.cuti'))->name('cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.ppic.administrasi.slip-gaji'))->name('slip-gaji');
            Route::get('rekening', fn() => Inertia::render('roles.ppic.administrasi.rekening'))->name('rekening');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Produksi Routes (Shared)
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/produksi')->middleware(['auth', 'role.permission'])->name('produksi.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.produksi.dashboard'))->name('index');
        
        Route::prefix('manajemen-produksi')->name('manajemen-produksi.')->group(function () {
            Route::get('perintah-kerja', fn() => Inertia::render('roles.produksi.manajemen-produksi.perintah-kerja'))->name('perintah-kerja');
            Route::get('alokasi-tugas', fn() => Inertia::render('roles.produksi.manajemen-produksi.alokasi-tugas'))->name('alokasi-tugas');
            Route::get('monitoring-progres', fn() => Inertia::render('roles.produksi.manajemen-produksi.monitoring-progres'))->name('monitoring-progres');
            Route::get('pengerjaan-ulang', fn() => Inertia::render('roles.produksi.manajemen-produksi.pengerjaan-ulang'))->name('pengerjaan-ulang');
        });
        
        Route::prefix('planning')->name('planning.')->group(function () {
            Route::get('/', fn() => Inertia::render('roles.produksi.planning.index'))->name('index');
        });
        
        Route::prefix('quality-control')->name('quality-control.')->group(function () {
            Route::get('/', fn() => Inertia::render('roles.produksi.quality-control.index'))->name('index');
        });
        
        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('/', fn() => Inertia::render('roles.produksi.reports.index'))->name('index');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Produksi Kayu Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/produksi-kayu')->middleware(['auth', 'role.permission'])->name('produksi-kayu.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.produksi-kayu.dashboard'))->name('index');
        
        Route::prefix('manajemen-produksi')->name('manajemen-produksi.')->group(function () {
            Route::get('perintah-kerja', fn() => Inertia::render('roles.produksi-kayu.manajemen-produksi.perintah-kerja'))->name('perintah-kerja');
            Route::get('alokasi-tugas', fn() => Inertia::render('roles.produksi-kayu.manajemen-produksi.alokasi-tugas'))->name('alokasi-tugas');
            Route::get('monitoring-progres', fn() => Inertia::render('roles.produksi-kayu.manajemen-produksi.monitoring-progres'))->name('monitoring-progres');
            Route::get('pengerjaan-ulang', fn() => Inertia::render('roles.produksi-kayu.manajemen-produksi.pengerjaan-ulang'))->name('pengerjaan-ulang');
        });
        
        Route::prefix('laporan')->name('laporan.')->group(function () {
            Route::get('output-harian', fn() => Inertia::render('roles.produksi-kayu.laporan.output-harian'))->name('output-harian');
            Route::get('analisis-kualitas', fn() => Inertia::render('roles.produksi-kayu.laporan.analisis-kualitas'))->name('analisis-kualitas');
            Route::get('kinerja-crew', fn() => Inertia::render('roles.produksi-kayu.laporan.kinerja-crew'))->name('kinerja-crew');
            Route::get('direksi', fn() => Inertia::render('roles.produksi-kayu.laporan.direksi'))->name('direksi');
        });
        
        Route::prefix('administrasi-pribadi')->name('administrasi-pribadi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.produksi-kayu.administrasi-pribadi.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.produksi-kayu.administrasi-pribadi.jadwal'))->name('jadwal');
            Route::get('cuti', fn() => Inertia::render('roles.produksi-kayu.administrasi-pribadi.cuti'))->name('cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.produksi-kayu.administrasi-pribadi.slip-gaji'))->name('slip-gaji');
            Route::get('rekening', fn() => Inertia::render('roles.produksi-kayu.administrasi-pribadi.rekening'))->name('rekening');
        });
    });

    Route::prefix('roles/produksi-besi')->middleware(['auth', 'role.permission'])->name('produksi-besi.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.produksi-besi.dashboard'))->name('index');
        
        Route::prefix('manajemen-produksi')->name('manajemen-produksi.')->group(function () {
            Route::get('perintah-kerja', fn() => Inertia::render('roles.produksi-besi.manajemen-produksi.perintah-kerja'))->name('perintah-kerja');
            Route::get('alokasi-tugas', fn() => Inertia::render('roles.produksi-besi.manajemen-produksi.alokasi-tugas'))->name('alokasi-tugas');
            Route::get('monitoring-progres', fn() => Inertia::render('roles.produksi-besi.manajemen-produksi.monitoring-progres'))->name('monitoring-progres');
            Route::get('pengerjaan-ulang', fn() => Inertia::render('roles.produksi-besi.manajemen-produksi.pengerjaan-ulang'))->name('pengerjaan-ulang');
        });
        
        Route::prefix('laporan')->name('laporan.')->group(function () {
            Route::get('output-harian', fn() => Inertia::render('roles.produksi-besi.laporan.output-harian'))->name('output-harian');
            Route::get('analisis-kualitas', fn() => Inertia::render('roles.produksi-besi.laporan.analisis-kualitas'))->name('analisis-kualitas');
            Route::get('kinerja-crew', fn() => Inertia::render('roles.produksi-besi.laporan.kinerja-crew'))->name('kinerja-crew');
            Route::get('direksi', fn() => Inertia::render('roles.produksi-besi.laporan.direksi'))->name('direksi');
        });
        
        Route::prefix('administrasi-pribadi')->name('administrasi-pribadi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.produksi-besi.administrasi-pribadi.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.produksi-besi.administrasi-pribadi.jadwal'))->name('jadwal');
            Route::get('cuti', fn() => Inertia::render('roles.produksi-besi.administrasi-pribadi.cuti'))->name('cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.produksi-besi.administrasi-pribadi.slip-gaji'))->name('slip-gaji');
            Route::get('rekening', fn() => Inertia::render('roles.produksi-besi.administrasi-pribadi.rekening'))->name('rekening');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Marketing Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/marketing')->middleware(['auth', 'role.permission'])->name('marketing.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.marketing.dashboard'))->name('index');
        Route::get('crm', [MarketingPesananController::class, 'index'])->name('crm.index');
        Route::get('analitik', fn() => Inertia::render('roles.marketing.analitik'))->name('analitik');
        
        Route::prefix('campaigns')->name('kampanye.')->group(function () {
            Route::get('email', fn() => Inertia::render('roles.marketing.campaigns.email'))->name('email');
            Route::get('sosial', fn() => Inertia::render('roles.marketing.campaigns.sosial'))->name('sosial');
        });
        
        Route::prefix('reports')->name('laporan.')->group(function () {
            Route::get('direksi', fn() => Inertia::render('roles.marketing.reports.direksi'))->name('direksi');
        });
        
        Route::prefix('administrasi-pribadi')->name('administrasi-pribadi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.marketing.administrasi-pribadi.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.marketing.administrasi-pribadi.jadwal'))->name('jadwal');
            Route::get('cuti', fn() => Inertia::render('roles.marketing.administrasi-pribadi.cuti'))->name('cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.marketing.administrasi-pribadi.slip-gaji'))->name('slip-gaji');
            Route::get('rekening', fn() => Inertia::render('roles.marketing.administrasi-pribadi.rekening'))->name('rekening');
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
    | Marketing Routes (Extended)
    |--------------------------------------------------------------------------
    */
    Route::prefix('roles/marketing')->middleware(['auth', 'role.permission'])->name('marketing.')->group(function () {
        Route::get('/', fn() => Inertia::render('roles.marketing.dashboard'))->name('index');
        
        Route::prefix('crm')->name('crm.')->group(function () {
            Route::get('/', [MarketingPesananController::class, 'index'])->name('index'); // Updated CRM index
            Route::get('leads', fn() => Inertia::render('roles.marketing.crm.leads'))->name('leads');
            Route::get('customers', fn() => Inertia::render('roles.marketing.crm.customers'))->name('customers');
            Route::get('opportunities', fn() => Inertia::render('roles.marketing.crm.opportunities'))->name('opportunities');
        });
        Route::post('pesanan', [MarketingPesananController::class, 'store'])->name('pesanan.store');
        Route::put('pesanan/{produkJual}/confirm', [MarketingPesananController::class, 'confirm'])->name('pesanan.confirm');
        Route::put('pesanan/{produkJual}/reject', [MarketingPesananController::class, 'reject'])->name('pesanan.reject');
        Route::put('pesanan/{produkJual}/cancel', [MarketingPesananController::class, 'cancel'])->name('pesanan.cancel');
        Route::put('pesanan/{produkJual}/banding', [MarketingPesananController::class, 'banding'])->name('pesanan.banding');
        Route::put('pesanan/{produkJual}/banding-tenggat', [MarketingPesananController::class, 'bandingTenggat'])->name('pesanan.banding-tenggat');        
        Route::prefix('analitik')->name('analitik.')->group(function () {
            Route::get('penjualan', fn() => Inertia::render('roles.marketing.analitik.penjualan'))->name('penjualan');
            Route::get('market-trends', fn() => Inertia::render('roles.marketing.analitik.market-trends'))->name('market-trends');
            Route::get('customer-behavior', fn() => Inertia::render('roles.marketing.analitik.customer-behavior'))->name('customer-behavior');
        });
        
        Route::prefix('kampanye')->name('kampanye.')->group(function () {
            Route::get('perencanaan', fn() => Inertia::render('roles.marketing.kampanye.perencanaan'))->name('perencanaan');
            Route::get('eksekusi', fn() => Inertia::render('roles.marketing.kampanye.eksekusi'))->name('eksekusi');
            Route::get('evaluasi', fn() => Inertia::render('roles.marketing.kampanye.evaluasi'))->name('evaluasi');
        });
        
        Route::prefix('laporan')->name('laporan.')->group(function () {
            Route::get('bulanan', fn() => Inertia::render('roles.marketing.laporan.bulanan'))->name('bulanan');
            Route::get('direksi', fn() => Inertia::render('roles.marketing.laporan.direksi'))->name('direksi');
        });
        
        Route::prefix('administrasi-pribadi')->name('administrasi-pribadi.')->group(function () {
            Route::get('profil', fn() => Inertia::render('roles.marketing.administrasi-pribadi.profil'))->name('profil');
            Route::get('jadwal', fn() => Inertia::render('roles.marketing.administrasi-pribadi.jadwal'))->name('jadwal');
            Route::get('cuti', fn() => Inertia::render('roles.marketing.administrasi-pribadi.cuti'))->name('cuti');
            Route::get('slip-gaji', fn() => Inertia::render('roles.marketing.administrasi-pribadi.slip-gaji'))->name('slip-gaji');
            Route::get('rekening', fn() => Inertia::render('roles.marketing.administrasi-pribadi.rekening'))->name('rekening');
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

    // Rute untuk Marketing
    Route::middleware(['auth'])->prefix('manajer-marketing')->name('manajer-marketing.')->group(function () {
        Route::get('crm', [MarketingPesananController::class, 'index'])->name('crm.index');
        Route::post('pesanan', [MarketingPesananController::class, 'store'])->name('pesanan.store');
        Route::put('pesanan/{produkJual}/confirm', [MarketingPesananController::class, 'confirm'])->name('pesanan.confirm');
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
        Route::get('/', [\App\Http\Controllers\Hrd\PayrollController::class, 'index'])->name('payroll.index');
        Route::post('/process', [\App\Http\Controllers\Hrd\PayrollController::class, 'process'])->name('payroll.process');
        Route::get('/batch/{batch}', [\App\Http\Controllers\Hrd\PayrollController::class, 'showBatch'])->name('payroll.batch.show');
        Route::post('/batch/{batch}/approve', [\App\Http\Controllers\Hrd\PayrollController::class, 'approveBatch'])->name('payroll.batch.approve');
        Route::get('/employee/{employee}/slip', [\App\Http\Controllers\Hrd\PayrollController::class, 'showSlip'])->name('payroll.slip.show');
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
        Route::get('/settings', [\App\Http\Controllers\Hrd\PayrollSettingsController::class, 'index'])->name('settings');
        Route::post('/settings', [\App\Http\Controllers\Hrd\PayrollSettingsController::class, 'update'])->name('settings.update');
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