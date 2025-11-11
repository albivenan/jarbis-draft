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
        Schema::table('jadwal_kerja', function (Blueprint $table) {
            // Permission fields
            $table->boolean('is_permission_requested')->default(false)->after('tanggal_approval_lembur');
            $table->enum('permission_type', ['terlambat', 'pulang_awal', 'tidak_masuk'])->nullable()->after('is_permission_requested');
            $table->time('permission_time')->nullable()->after('permission_type');
            $table->text('permission_reason')->nullable()->after('permission_time');
            $table->enum('permission_status', ['pending', 'approved', 'rejected'])->nullable()->after('permission_reason');
            $table->text('permission_notes')->nullable()->after('permission_status');
            $table->timestamp('permission_requested_at')->nullable()->after('permission_notes');
            $table->unsignedBigInteger('permission_approved_by')->nullable()->after('permission_requested_at');
            $table->timestamp('permission_approved_at')->nullable()->after('permission_approved_by');
            
            // Add foreign key for permission_approved_by
            $table->foreign('permission_approved_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jadwal_kerja', function (Blueprint $table) {
            try {
                $table->dropForeign(['permission_approved_by']);
            } catch (\Exception $e) {}

            $table->dropColumn([
                'is_permission_requested',
                'permission_type',
                'permission_time',
                'permission_reason',
                'permission_status',
                'permission_notes',
                'permission_requested_at',
                'permission_approved_by',
                'permission_approved_at'
            ]);
        });
    }
};
