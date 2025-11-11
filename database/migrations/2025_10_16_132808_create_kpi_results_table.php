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
        Schema::dropIfExists('kpi_results');
        Schema::create('kpi_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_karyawan')->constrained('identitas_karyawan', 'id_karyawan')->onDelete('cascade');
            $table->foreignId('id_kpi')->constrained('master_kpi')->onDelete('cascade');
            $table->date('periode');
            $table->string('hasil');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kpi_results');
    }
};
