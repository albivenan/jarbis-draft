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
            // Check if id_karyawan column exists and is not already unsignedBigInteger
            if (Schema::hasColumn('users', 'id_karyawan')) {
                // Temporarily drop foreign key if it exists to change column type
                // This assumes no FK was successfully added, but good practice
                // if (Schema::hasTable('identitas_karyawan') && Schema::hasColumn('users', 'id_karyawan')) {
                //     $table->dropForeign(['id_karyawan']);
                // }

                // Change column type to unsignedBigInteger
                $table->unsignedBigInteger('id_karyawan')->nullable()->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Revert column type to unsignedInteger if needed
            if (Schema::hasColumn('users', 'id_karyawan')) {
                $table->unsignedInteger('id_karyawan')->nullable()->change();
            }
        });
    }
};