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
        Schema::create('permohonan_izin', function (Blueprint $table) {
            $table->id('id_permohonan');
            $table->unsignedBigInteger('id_karyawan');
            $table->date('tanggal_permohonan');
            $table->enum('jenis_permohonan', ['izin_terlambat', 'izin_pulang_awal', 'izin_tidak_masuk']);
            $table->time('waktu_pengajuan')->nullable(); // untuk izin terlambat/pulang awal
            $table->text('alasan');
            $table->enum('status_pengajuan', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('tanggal_pengajuan')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('tanggal_approval')->nullable();
            $table->text('catatan_approval')->nullable();
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('id_karyawan')->references('id_karyawan')->on('identitas_karyawan')->onDelete('cascade');
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            
            // Indexes
            $table->index(['id_karyawan', 'tanggal_permohonan']);
            $table->index(['status_pengajuan']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permohonan_izin');
    }
};