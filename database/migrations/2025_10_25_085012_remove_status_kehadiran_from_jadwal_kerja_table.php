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
        Schema::table('jadwal_kerja', function (Blueprint $table) {
            $table->dropColumn('status_kehadiran');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jadwal_kerja', function (Blueprint $table) {
            $table->enum('status_kehadiran', ['Hadir', 'Terlambat', 'Cuti', 'Sakit', 'Izin', 'Libur', 'Alpha', 'Belum Hadir'])->default('Belum Hadir');
        });
    }
};
