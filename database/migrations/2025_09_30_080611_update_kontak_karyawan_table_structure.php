<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('kontak_karyawan', function (Blueprint $table) {
            // Add missing columns from SQL schema
            if (!Schema::hasColumn('kontak_karyawan', 'alamat_ktp')) {
                $table->text('alamat_ktp')->nullable()->after('id_karyawan');
            }
            if (!Schema::hasColumn('kontak_karyawan', 'alamat_domisili')) {
                $table->text('alamat_domisili')->nullable()->after('alamat_ktp');
            }
            if (!Schema::hasColumn('kontak_karyawan', 'nama_kontak_darurat')) {
                $table->string('nama_kontak_darurat', 100)->nullable()->after('email_perusahaan');
            }
            if (!Schema::hasColumn('kontak_karyawan', 'nomor_kontak_darurat')) {
                $table->string('nomor_kontak_darurat', 15)->nullable()->after('nama_kontak_darurat');
            }
            
            // Update existing columns
            $table->string('nomor_telepon', 15)->nullable()->change();
            $table->string('email_pribadi', 100)->nullable()->change();
            $table->string('email_perusahaan', 100)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kontak_karyawan', function (Blueprint $table) {
            $table->dropColumn(['alamat_ktp', 'alamat_domisili', 'nama_kontak_darurat', 'nomor_kontak_darurat']);
        });
    }
};