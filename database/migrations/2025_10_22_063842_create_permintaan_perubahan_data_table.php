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
        Schema::create('permintaan_perubahan_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_karyawan')->constrained('identitas_karyawan', 'id_karyawan')->onDelete('cascade');
            $table->string('tipe_perubahan'); // e.g., 'identitas_ktp', 'kontak', 'pajak', 'bank'
            $table->string('field_name'); // e.g., 'nama_lengkap', 'nik_ktp', 'nomor_telepon'
            $table->text('nilai_lama')->nullable();
            $table->text('nilai_baru');
            $table->enum('status', ['pending', 'disetujui', 'ditolak'])->default('pending');
            $table->timestamp('diajukan_pada')->useCurrent();
            $table->foreignId('ditinjau_oleh')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('ditinjau_pada')->nullable();
            $table->text('catatan_hrd')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permintaan_perubahan_data');
    }
};
