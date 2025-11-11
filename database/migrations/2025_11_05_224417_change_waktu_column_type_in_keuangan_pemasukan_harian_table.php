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
        // The user confirmed that the correct column name is 'waktu'
        // and it was previously a 'date' type. We are changing it to 'dateTime'.
        Schema::table('keuangan_pemasukan_harian', function (Blueprint $table) {
            if (Schema::hasColumn('keuangan_pemasukan_harian', 'waktu')) {
                $table->dateTime('waktu')->change();
            } elseif (Schema::hasColumn('keuangan_pemasukan_harian', 'tanggal')) {
                // Fallback in case the rename hasn't happened yet
                $table->renameColumn('tanggal', 'waktu');
                $table->dateTime('waktu')->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('keuangan_pemasukan_harian', function (Blueprint $table) {
            if (Schema::hasColumn('keuangan_pemasukan_harian', 'waktu')) {
                $table->date('waktu')->change();
            }
        });
    }
};
