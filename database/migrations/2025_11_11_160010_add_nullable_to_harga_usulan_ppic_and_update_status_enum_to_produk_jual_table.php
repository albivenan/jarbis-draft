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
        Schema::table('produk_jual', function (Blueprint $table) {
            $table->decimal('harga_usulan_ppic', 15, 2)->nullable()->change();
            $table->enum('status', ['Pending', 'Menunggu Persetujuan Keuangan', 'Disetujui', 'Ditolak', 'Dikonfirmasi Marketing'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produk_jual', function (Blueprint $table) {
            $table->decimal('harga_usulan_ppic', 15, 2)->change(); // Revert to not nullable
            $table->enum('status', ['Pending', 'Disetujui', 'Ditolak'])->change(); // Revert enum
        });
    }
};
