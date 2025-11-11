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
        Schema::table('keuangan_pengeluaran_harian', function (Blueprint $table) {
            // Check if 'tanggal' column exists before renaming
            if (Schema::hasColumn('keuangan_pengeluaran_harian', 'tanggal')) {
                $table->renameColumn('tanggal', 'waktu');
            }
            // Change column type to dateTime, ensuring it exists first
            if (Schema::hasColumn('keuangan_pengeluaran_harian', 'waktu')) {
                $table->dateTime('waktu')->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('keuangan_pengeluaran_harian', function (Blueprint $table) {
            // Revert type first, ensuring it exists
            if (Schema::hasColumn('keuangan_pengeluaran_harian', 'waktu')) {
                $table->date('waktu')->change();
            }
            // Rename back to 'tanggal', ensuring 'waktu' exists
            if (Schema::hasColumn('keuangan_pengeluaran_harian', 'waktu')) {
                $table->renameColumn('waktu', 'tanggal');
            }
        });
    }
};
