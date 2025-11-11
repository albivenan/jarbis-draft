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
        Schema::table('identitas_karyawan', function (Blueprint $table) {
            // Add missing columns from SQL schema
            if (!Schema::hasColumn('identitas_karyawan', 'status_pernikahan')) {
                $table->string('status_pernikahan', 20)->nullable()->after('jenis_kelamin');
            }
            if (!Schema::hasColumn('identitas_karyawan', 'agama')) {
                $table->string('agama', 20)->nullable()->after('status_pernikahan');
            }
            if (!Schema::hasColumn('identitas_karyawan', 'golongan_darah')) {
                $table->string('golongan_darah', 5)->nullable()->after('agama');
            }
            
            // Update existing columns to match schema
            $table->string('nama_lengkap', 100)->change();
            $table->string('nik_perusahaan', 20)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('identitas_karyawan', function (Blueprint $table) {
            $table->dropColumn(['status_pernikahan', 'agama', 'golongan_darah']);
        });
    }
};