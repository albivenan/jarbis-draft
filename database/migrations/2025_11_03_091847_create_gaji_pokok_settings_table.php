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
        Schema::create('gaji_pokok_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_jabatan');
            $table->unsignedBigInteger('id_bagian_kerja')->nullable(); // Corrected type to unsignedBigInteger
            $table->enum('senioritas', ['Junior', 'Senior'])->nullable();
            $table->unsignedBigInteger('gaji_pokok');
            $table->timestamps();

            $table->foreign('id_jabatan')->references('id_jabatan')->on('jabatan')->onDelete('cascade');
            $table->foreign('id_bagian_kerja')->references('id_bagian_kerja')->on('bagian_kerja_karyawan')->onDelete('set null'); // Corrected reference

            $table->unique(['id_jabatan', 'id_bagian_kerja', 'senioritas'], 'gaji_pokok_unique_setting');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gaji_pokok_settings');
    }
};
