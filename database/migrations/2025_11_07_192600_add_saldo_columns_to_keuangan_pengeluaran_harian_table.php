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
            $table->decimal('saldo_sebelum', 15, 2)->after('amount')->default(0.00);
            $table->decimal('saldo_setelah', 15, 2)->after('saldo_sebelum')->default(0.00);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('keuangan_pengeluaran_harian', function (Blueprint $table) {
            $table->dropColumn(['saldo_sebelum', 'saldo_setelah']);
        });
    }
};
