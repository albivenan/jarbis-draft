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
        Schema::create('user_roles', function (Blueprint $table) {
            $table->id('id_user_role');
            $table->unsignedBigInteger('id_karyawan')->nullable();
            $table->unsignedBigInteger('id_role')->nullable();
            $table->timestamps();
            
            $table->foreign('id_karyawan')->references('id_karyawan')->on('identitas_karyawan')->onDelete('cascade');
            $table->foreign('id_role')->references('id_role')->on('roles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_roles');
    }
};