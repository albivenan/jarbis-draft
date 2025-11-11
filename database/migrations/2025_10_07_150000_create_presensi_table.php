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
        Schema::create('presensi', function (Blueprint $table) {
            $table->id('id_presensi');
            $table->unsignedBigInteger('id_karyawan');
            $table->unsignedBigInteger('id_jadwal')->nullable();
            $table->date('tanggal');
            $table->time('jam_masuk_actual')->nullable();
            $table->time('jam_keluar_actual')->nullable();
            $table->enum('status_presensi', ['hadir', 'terlambat', 'izin', 'sakit', 'cuti', 'alpha']);
            $table->decimal('jam_kerja', 4, 2)->nullable()->default(0);
            $table->decimal('jam_lembur', 4, 2)->nullable()->default(0);
            $table->text('catatan')->nullable();
            $table->string('lokasi_presensi')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->timestamps();
            
            // Foreign key constraints
            $table->foreign('id_karyawan')->references('id_karyawan')->on('identitas_karyawan')->onDelete('cascade');
            $table->foreign('id_jadwal')->references('id_jadwal')->on('jadwal_kerja')->onDelete('set null');
            
            // Indexes for better performance
            $table->index(['id_karyawan', 'tanggal']);
            $table->index(['tanggal', 'status_presensi']);
            $table->unique(['id_karyawan', 'tanggal']); // One attendance per employee per day
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presensi');
    }
};