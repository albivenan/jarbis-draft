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
        Schema::table('identitas_karyawan', function (Blueprint $table) {
            $table->unsignedBigInteger('id_departemen')->nullable()->after('id_karyawan');
            $table->foreign('id_departemen')->references('id_departemen')->on('departemen')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('identitas_karyawan', function (Blueprint $table) {
            $table->dropForeign(['id_departemen']);
            $table->dropColumn('id_departemen');
        });
    }
};
