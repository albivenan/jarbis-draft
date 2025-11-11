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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', [
                'admin',
                'direktur',
                'manajer_operasional',
                'manajer_hrd',
                'manajer_keuangan',
                'manajer_ppic',
                'manajer_marketing',
                'manajer_produksi',
                'staf_hrd',
                'staf_keuangan',
                'staf_ppic',
                'staf_marketing',
                'supervisor',
                'qc_produksi',
                'admin_produksi',
                'crew',
                'software_engineer',
                // Role baru untuk spesialisasi kayu dan besi
                'manajer_produksi_kayu',
                'manajer_produksi_besi',
                'supervisor_kayu',
                'supervisor_besi',
                'qc_kayu',
                'qc_besi',
                'crew_kayu',
                'crew_besi'
            ])->default('crew')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', [
                'admin',
                'direktur',
                'manajer_operasional',
                'manajer_hrd',
                'manajer_keuangan',
                'manajer_ppic',
                'manajer_marketing',
                'manajer_produksi',
                'staf_hrd',
                'staf_keuangan',
                'staf_ppic',
                'staf_marketing',
                'supervisor',
                'qc_produksi',
                'admin_produksi',
                'crew',
                'software_engineer'
            ])->default('crew')->change();
        });
    }
};
