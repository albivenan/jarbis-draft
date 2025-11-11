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
            $table->dateTime('diajukan_pada')->nullable()->after('catatan');
            $table->dateTime('direspon_pada')->nullable()->after('diajukan_pada');
            $table->dateTime('dibayar_pada')->nullable()->after('direspon_pada');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pembelian_bahan_baku', function (Blueprint $table) {
            $table->dropColumn(['diajukan_pada', 'direspon_pada', 'dibayar_pada']);
        });
    }
};
