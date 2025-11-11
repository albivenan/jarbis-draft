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
        Schema::create('riwayat_edukasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_karyawan')->constrained('identitas_karyawan', 'id_karyawan')->onDelete('cascade');
            $table->string('jenjang');
            $table->string('institusi');
            $table->string('jurusan');
            $table->string('kota');
            $table->string('negara');
            $table->integer('tahun_mulai');
            $table->integer('tahun_selesai');
            $table->decimal('ipk', 4, 2)->nullable();
            $table->string('nomor_ijazah')->nullable();
            $table->date('tanggal_ijazah')->nullable();
            $table->string('file_ijazah')->nullable();
            $table->boolean('is_lulus')->default(false);
            $table->text('catatan')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('riwayat_edukasi');
    }
};
