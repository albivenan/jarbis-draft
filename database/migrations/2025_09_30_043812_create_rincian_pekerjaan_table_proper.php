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
        Schema::create('rincian_pekerjaan', function (Blueprint $table) {
            $table->id('id_rincian_pekerjaan');
            $table->unsignedBigInteger('id_karyawan');
            $table->date('tanggal_bergabung');
            $table->enum('status_karyawan', ['Tetap', 'Kontrak', 'Magang', 'Freelance']);
            $table->unsignedBigInteger('id_jabatan');
            $table->unsignedBigInteger('id_departemen');
            $table->unsignedBigInteger('id_bagian_kerja')->nullable();
            $table->string('lokasi_kerja')->default('Kantor Pusat');
            $table->unsignedBigInteger('id_atasan_langsung')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rincian_pekerjaan');
    }
};