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
            // Only add id_karyawan if it doesn't exist
            if (!Schema::hasColumn('users', 'id_karyawan')) {
                $table->unsignedInteger('id_karyawan')->nullable()->after('email');
            }
            
            // Check if nik column exists before dropping
            if (Schema::hasColumn('users', 'nik')) {
                $table->dropColumn('nik');
            }
            
            // Add foreign key constraint if identitas_karyawan table exists
            // $table->foreign('id_karyawan')->references('id_karyawan')->on('identitas_karyawan')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('id_karyawan');
            
            // Add nik column back if it doesn't exist
            if (!Schema::hasColumn('users', 'nik')) {
                $table->string('nik')->nullable()->after('email');
            }
        });
    }
};