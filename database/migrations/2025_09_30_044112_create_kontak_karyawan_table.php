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
        Schema::create('kontak_karyawan', function (Blueprint $table) {
            $table->id('id_kontak');
            $table->unsignedBigInteger('id_karyawan');
            $table->string('email_perusahaan')->unique();
            $table->string('email_pribadi')->nullable();
            $table->string('nomor_telepon')->nullable();
            $table->string('nomor_darurat')->nullable();
            $table->timestamps();
            
            // Foreign key will be added after identitas_karyawan table is created
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kontak_karyawan');
    }
};
