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
        Schema::table('sumber_dana', function (Blueprint $table) {
            $table->string('nomor_rekening')->nullable()->unique()->after('tipe_sumber');
            $table->string('nama_bank')->nullable()->after('nomor_rekening');
            $table->string('nama_pemilik_rekening')->nullable()->after('nama_bank');
            $table->string('kode_bank')->nullable()->after('nama_pemilik_rekening');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sumber_dana', function (Blueprint $table) {
            $table->dropColumn(['nomor_rekening', 'nama_bank', 'nama_pemilik_rekening', 'kode_bank']);
        });
    }
};