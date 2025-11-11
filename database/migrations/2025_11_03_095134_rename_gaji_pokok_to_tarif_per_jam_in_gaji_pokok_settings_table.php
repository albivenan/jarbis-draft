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
        Schema::table('gaji_pokok_settings', function (Blueprint $table) {
            $table->renameColumn('gaji_pokok', 'tarif_per_jam');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gaji_pokok_settings', function (Blueprint $table) {
            $table->renameColumn('tarif_per_jam', 'gaji_pokok');
        });
    }
};
