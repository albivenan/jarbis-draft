<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // Needed for data migration

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add the new employment_status column
            $table->enum('employment_status', [
                'active', 'on_leave', 'resigned', 'terminated', 'retired', 'other'
            ])->default('active')->after('status');
        });

        // Migrate existing 'status' data to 'employment_status' AFTER the column is added
        DB::table('users')->where('status', 'Aktif')->update(['employment_status' => 'active']);
        DB::table('users')->where('status', 'Tidak Aktif')->update(['employment_status' => 'resigned']); // Assuming 'Tidak Aktif' means resigned

        // Optionally, drop the old 'status' column after data migration and verification
        // Schema::table('users', function (Blueprint $table) {
        //     $table->dropColumn('status');
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // If 'status' column was dropped in up(), re-add it here
            // $table->enum('status', ['Aktif', 'Tidak Aktif'])->default('Aktif')->after('email');
            $table->dropColumn('employment_status');
        });
    }
};