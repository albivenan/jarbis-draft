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
        Schema::create('jadwal_kerja', function (Blueprint $table) {
            $table->id('id_jadwal');
            $table->unsignedBigInteger('id_karyawan')->nullable();
            $table->date('tanggal');
            $table->time('jam_masuk')->nullable();
            $table->time('jam_keluar')->nullable();
            $table->time('waktu_lembur')->nullable();
            $table->string('shift', 20)->nullable();
            $table->enum('status_kehadiran', ['Hadir', 'Terlambat', 'Cuti', 'Sakit', 'Izin', 'Libur', 'Alpha', 'Belum Hadir']);
            $table->text('catatan')->nullable();
            
            // Foreign key constraint
            $table->foreign('id_karyawan')->references('id_karyawan')->on('identitas_karyawan')->onDelete('cascade');
            
            // Index for better performance
            $table->index(['id_karyawan', 'tanggal']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_kerja');
    }
};
