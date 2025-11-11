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
        Schema::table('pengeluaran_harian', function (Blueprint $table) {
            $table->foreignId('pembelian_bahan_baku_id')->nullable()->constrained('pembelian_bahan_baku')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pengeluaran_harian', function (Blueprint $table) {
            $table->dropConstrainedForeignId('pembelian_bahan_baku_id');
        });
    }
};
