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
        Schema::dropIfExists('master_kpi');
        Schema::create('master_kpi', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kpi');
            $table->text('deskripsi')->nullable();
            $table->string('target');
            $table->string('satuan');
            $table->enum('tipe_kpi', ['kuantitatif', 'kualitatif']);
            $table->boolean('is_active')->default(true);
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
