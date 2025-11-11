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
        Schema::table('pemasukan_harian', function (Blueprint $table) {
            // Add foreign key column
            $table->unsignedBigInteger('sumber_dana_id')->nullable()->after('tanggal');
            // Drop old 'sumber' column
            $table->dropColumn('sumber');
            // Add foreign key constraint
            $table->foreign('sumber_dana_id')->references('id')->on('sumber_dana')->onDelete('set null');
        });

        Schema::table('pengeluaran_harian', function (Blueprint $table) {
            // Add foreign key column
            $table->unsignedBigInteger('sumber_dana_id')->nullable()->after('tanggal');
            // Add foreign key constraint
            $table->foreign('sumber_dana_id')->references('id')->on('sumber_dana')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pemasukan_harian', function (Blueprint $table) {
            // Drop foreign key constraint
            $table->dropForeign(['sumber_dana_id']);
            // Drop new column
            $table->dropColumn('sumber_dana_id');
            // Re-add old 'sumber' column (if needed for rollback, though data will be lost)
            $table->string('sumber')->nullable()->after('tanggal');
        });

        Schema::table('pengeluaran_harian', function (Blueprint $table) {
            // Drop foreign key constraint
            $table->dropForeign(['sumber_dana_id']);
            // Drop new column
            $table->dropColumn('sumber_dana_id');
        });
    }
};