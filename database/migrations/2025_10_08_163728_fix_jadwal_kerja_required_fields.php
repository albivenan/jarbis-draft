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
        Schema::table('jadwal_kerja', function (Blueprint $table) {
            // Make jam_masuk and jam_keluar NOT NULL since they are required for schedule templates
            $table->time('jam_masuk')->nullable(false)->change();
            $table->time('jam_keluar')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jadwal_kerja', function (Blueprint $table) {
            // Revert back to nullable
            $table->time('jam_masuk')->nullable()->change();
            $table->time('jam_keluar')->nullable()->change();
        });
    }
};
