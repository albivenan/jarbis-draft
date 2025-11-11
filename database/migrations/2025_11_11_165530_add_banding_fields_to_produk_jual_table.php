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
            $table->decimal('harga_banding_marketing', 15, 2)->nullable()->after('margin_keuangan');
            $table->text('alasan_banding')->nullable()->after('harga_banding_marketing');
            $table->text('alasan_penolakan')->nullable()->after('alasan_banding');
            $table->enum('status', [
                'Pending', 
                'Menunggu Persetujuan Keuangan', 
                'Disetujui', 
                'Ditolak', 
                'Dikonfirmasi Marketing',
                'Banding Harga',
                'Dibatalkan'
            ])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produk_jual', function (Blueprint $table) {
            $table->dropColumn(['harga_banding_marketing', 'alasan_banding', 'alasan_penolakan']);
            $table->enum('status', [
                'Pending', 
                'Menunggu Persetujuan Keuangan', 
                'Disetujui', 
                'Ditolak', 
                'Dikonfirmasi Marketing'
            ])->change();
        });
    }
};
