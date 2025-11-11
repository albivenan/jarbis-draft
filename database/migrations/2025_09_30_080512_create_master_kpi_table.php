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
        Schema::create('master_kpi', function (Blueprint $table) {
            $table->id('id_kpi');
            $table->string('nama_kpi', 100);
            $table->text('deskripsi_kpi')->nullable();
            $table->decimal('bobot_kpi', 5, 2)->default(0.00);
            $table->enum('area_penilaian', ['Produksi', 'Umum']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_kpi');
    }
};