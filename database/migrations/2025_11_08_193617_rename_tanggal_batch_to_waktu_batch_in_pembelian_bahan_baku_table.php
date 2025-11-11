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
        Schema::table('pembelian_bahan_baku', function (Blueprint $table) {
            $table->renameColumn('tanggal_batch', 'waktu_batch');
            $table->dateTime('waktu_batch')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pembelian_bahan_baku', function (Blueprint $table) {
            $table->renameColumn('waktu_batch', 'tanggal_batch');
            $table->date('tanggal_batch')->change();
        });
    }
};
