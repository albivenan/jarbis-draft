<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Shared\Attendance\PresensiController;
use App\Http\Controllers\ManajerHrd\PayrollController;
use App\Http\Controllers\ManajerHrd\PayrollSettingsController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\Keuangan\Harian\SumberDanaController;
use App\Models\Departemen;
use App\Models\Jabatan;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Crew Schedule API Routes - accessible by all authenticated users
Route::middleware(['web', 'auth'])->group(function () {
    // Keuangan Harian Sumber Dana
    Route::get('keuangan/harian/sumber-dana', [SumberDanaController::class, 'index']);
    Route::get('keuangan/harian/sumber-dana/{id}', [SumberDanaController::class, 'show']);
    Route::post('keuangan/harian/sumber-dana/pemasukan', [SumberDanaController::class, 'storePemasukan']);
    Route::post('keuangan/harian/sumber-dana/pengeluaran', [SumberDanaController::class, 'storePengeluaran']);
    Route::post('keuangan/harian/sumber-dana/transfer', [SumberDanaController::class, 'storeTransfer']);

    // Today's status for crew schedule page
    Route::get('presensi/today-status', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'getTodayStatus']);

    // Employee schedule data
    Route::get('jadwal/employee-schedule', [JadwalController::class, 'getEmployeeSchedule']);

    // Get all departments
    Route::get('departments', function () {
        return response()->json(Departemen::all());
    });

    // Get all positions
    Route::get('positions', function () {
        return response()->json(Jabatan::all());
    });

    // Get all employees
    Route::get('employees', function () {
        return response()->json(User::with('identitasKaryawan.rincianPekerjaan.departemen', 'identitasKaryawan.rincianPekerjaan.jabatan')->get());
    });

    // User requests (permissions and overtime)
    Route::get('presensi/permission-requests', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'getPermissionRequests']);
    Route::get('presensi/overtime-requests', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'getOvertimeRequests']);
    Route::get('/user-requests', [\App\Http\Controllers\Shared\Attendance\PresensiController::class, 'getUserRequests'])->name('api.presensi.user-requests');
    Route::get('/user-leave-requests', [\App\Http\Controllers\Shared\Attendance\PresensiController::class, 'getUserLeaveRequests'])->name('api.presensi.user-leave-requests');

    // User attendance history
    Route::get('presensi/history', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'getUserHistory']);
    Route::get('/rekap', [\App\Http\Controllers\Shared\Attendance\PresensiController::class, 'getMonthlyRekap'])->name('api.presensi.rekap');
    Route::get('/karyawan/rekap', [\App\Http\Controllers\Shared\Attendance\PresensiController::class, 'getKaryawanRekap'])->name('api.presensi.karyawan-rekap');
    Route::post('/update-attendance', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'updateAttendance'])->name('api.presensi.update-attendance');
});

// Payroll Settings API Routes
Route::prefix('payroll')->middleware(['web', 'auth'])->group(function () {
    Route::get('settings', [\App\Http\Controllers\ManajerHrd\PayrollSettingsController::class, 'index'])->name('api.payroll.settings.index');
    Route::post('settings', [\App\Http\Controllers\ManajerHrd\PayrollSettingsController::class, 'update'])->name('api.payroll.settings.update');
    Route::get('status', [\App\Http\Controllers\ManajerHrd\PayrollController::class, 'getPayrollStatus'])->name('api.payroll.status');
});

    // Check-in and Check-out endpoints
    Route::post('presensi/checkin', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'apiCheckIn'])->name('presensi.checkin');
    Route::post('presensi/checkout', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'apiCheckOut'])->name('presensi.checkout');

    // Submit requests (permissions and overtime)
    Route::post('presensi/submit-request', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'apiSubmitRequest'])->name('api.presensi.submit-request');
    Route::post('presensi/request', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'apiSubmitRequest']);
    Route::post('presensi/request-permission', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'apiSubmitRequest']);
    Route::post('presensi/request-overtime', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'apiSubmitRequest']);
    
    // Cancel request
    Route::post('presensi/cancel-request/{id}', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'cancelRequest']);

// HRD API Routes
Route::prefix('hrd')->middleware(['web', 'auth', 'role.permission'])->group(function () {
    // Permission & Overtime Requests
    Route::get('requests', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'getRequests']);
    Route::post('approve-request', [App\Http\Controllers\Shared\Attendance\PresensiController::class, 'approveRequest']);

    // Data Change Requests
    Route::prefix('data-change-requests')->group(function () {
        Route::post('approve/{id}', [App\Http\Controllers\ManajerHrd\KaryawanController::class, 'approveDataChangeRequest'])->name('manajer-hrd.karyawan.approve-data-change-request');
        Route::post('reject/{id}', [App\Http\Controllers\ManajerHrd\KaryawanController::class, 'rejectDataChangeRequest'])->name('manajer-hrd.karyawan.reject-data-change-request');
    });

    // Laporan HRD
    Route::prefix('laporan')->name('laporan.')->group(function () {
        Route::get('kehadiran', [App\Http\Controllers\Laporan\KehadiranController::class, 'index'])->name('kehadiran');
    });


    // Payroll Routes
    Route::prefix('payroll')->group(function () {
        // View operations - accessible by HRD staff
        Route::middleware('payroll.permission:view')->group(function () {
            Route::get('employees', [\App\Http\Controllers\ManajerHrd\PayrollController::class, 'getEmployees']);
            Route::post('validate', [\App\Http\Controllers\ManajerHrd\PayrollController::class, 'validate']);
            Route::get('batches', [\App\Http\Controllers\ManajerHrd\PayrollController::class, 'getBatches']);
        });

        // Submit operations - accessible by HRD managers
        Route::middleware('payroll.permission:submit')->group(function () {
            Route::post('submit', [\App\Http\Controllers\ManajerHrd\PayrollController::class, 'submitBatch']);
        });

        // Approve operations - accessible by finance staff
        Route::middleware('payroll.permission:approve')->group(function () {
            Route::post('approve-employee', [\App\Http\Controllers\ManajerHrd\PayrollController::class, 'approveEmployee']);
            Route::post('batch/{batch}/update-payment-method', [\App\Http\Controllers\ManajerHrd\PayrollController::class, 'updatePaymentMethod'])->name('api.payroll.batch.update-payment-method');
        });
    });
});
