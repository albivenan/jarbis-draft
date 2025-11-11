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
        Schema::create('keuangan_transaksi_pembeli', function (Blueprint $table) {
            $table->id();
            $table->string('nama_pembeli');
            $table->string('email_pembeli')->nullable();
            $table->string('telepon_pembeli')->nullable();
            $table->text('alamat_pembeli')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keuangan_transaksi_pembeli');
    }
};