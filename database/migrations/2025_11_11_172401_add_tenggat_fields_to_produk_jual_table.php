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
            // Tenggat dari Marketing
            $table->date('tenggat_barang_jadi_marketing')->nullable()->after('alasan_penolakan');
            $table->date('tenggat_pengiriman_marketing')->nullable()->after('tenggat_barang_jadi_marketing');
            
            // Tenggat dari PPIC (hasil review/ubah)
            $table->date('tenggat_barang_jadi_ppic')->nullable()->after('tenggat_pengiriman_marketing');
            $table->date('tenggat_pengiriman_ppic')->nullable()->after('tenggat_barang_jadi_ppic');
            
            // Status tenggat
            $table->enum('status_tenggat', [
                'Menunggu Review PPIC',
                'Disetujui PPIC',
                'Ditolak PPIC',
                'Diubah PPIC',
                'Banding Tenggat',
                'Final'
            ])->nullable()->after('tenggat_pengiriman_ppic');
            
            // Alasan dari PPIC
            $table->text('alasan_tenggat_ppic')->nullable()->after('status_tenggat');
            $table->text('alasan_banding_tenggat')->nullable()->after('alasan_tenggat_ppic');
            
            // Tracking
            $table->timestamp('tenggat_direspon_ppic_pada')->nullable()->after('alasan_banding_tenggat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produk_jual', function (Blueprint $table) {
            $table->dropColumn([
                'tenggat_barang_jadi_marketing',
                'tenggat_pengiriman_marketing',
                'tenggat_barang_jadi_ppic',
                'tenggat_pengiriman_ppic',
                'status_tenggat',
                'alasan_tenggat_ppic',
                'alasan_banding_tenggat',
                'tenggat_direspon_ppic_pada'
            ]);
        });
    }
};
