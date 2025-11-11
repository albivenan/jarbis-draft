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
        Schema::table('keuangan_pemasukan_harian', function (Blueprint $table) {
            $table->foreignId('keuangan_transaksi_pembeli_id')
                  ->nullable()
                  ->after('user_id') // Place it after user_id for logical grouping
                  ->constrained('keuangan_transaksi_pembeli')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('keuangan_pemasukan_harian', function (Blueprint $table) {
            $table->dropConstrainedForeignId('keuangan_transaksi_pembeli_id');
        });
    }
};