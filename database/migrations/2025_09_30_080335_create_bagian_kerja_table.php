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
        Schema::create('bagian_kerja', function (Blueprint $table) {
            $table->id('id_bagian_kerja');
            $table->string('nama_bagian_kerja', 100);
            $table->unsignedBigInteger('id_departemen')->nullable();
            $table->timestamps();
            
            $table->foreign('id_departemen')->references('id_departemen')->on('departemen')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bagian_kerja');
    }
};