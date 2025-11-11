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
        Schema::table('presensi', function (Blueprint $table) {
            // Add missing scheduled time columns
            $table->time('jam_masuk_scheduled')->nullable()->after('tanggal');
            $table->time('jam_keluar_scheduled')->nullable()->after('jam_masuk_scheduled');
            
            // Add permission fields
            $table->boolean('is_permission_requested')->default(false)->after('catatan');
            $table->enum('permission_type', ['terlambat', 'pulang_awal', 'tidak_masuk'])->nullable()->after('is_permission_requested');
            $table->time('permission_time')->nullable()->after('permission_type');
            $table->text('permission_reason')->nullable()->after('permission_time');
            $table->enum('permission_status', ['pending', 'approved', 'rejected'])->nullable()->after('permission_reason');
            $table->timestamp('permission_requested_at')->nullable()->after('permission_status');
            $table->timestamp('permission_approved_at')->nullable()->after('permission_requested_at');
            $table->unsignedBigInteger('permission_approved_by')->nullable()->after('permission_approved_at');
            $table->text('permission_notes')->nullable()->after('permission_approved_by');
            
            // Add overtime fields
            $table->boolean('is_overtime_requested')->default(false)->after('permission_notes');
            $table->time('overtime_start')->nullable()->after('is_overtime_requested');
            $table->time('overtime_end')->nullable()->after('overtime_start');
            $table->decimal('overtime_hours', 4, 2)->default(0)->after('overtime_end');
            $table->text('overtime_reason')->nullable()->after('overtime_hours');
            $table->enum('overtime_status', ['pending', 'approved', 'rejected'])->nullable()->after('overtime_reason');
            $table->timestamp('overtime_requested_at')->nullable()->after('overtime_status');
            $table->timestamp('overtime_approved_at')->nullable()->after('overtime_requested_at');
            $table->unsignedBigInteger('overtime_approved_by')->nullable()->after('overtime_approved_at');
            $table->text('overtime_notes')->nullable()->after('overtime_approved_by');
            
            // Add foreign keys
            $table->foreign('permission_approved_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('overtime_approved_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('presensi')) {
            Schema::table('presensi', function (Blueprint $table) {
                if (Schema::hasColumn('presensi', 'permission_approved_by')) {
                    $table->dropForeign(['presensi_permission_approved_by_foreign']);
                }
                if (Schema::hasColumn('presensi', 'overtime_approved_by')) {
                    $table->dropForeign(['presensi_overtime_approved_by_foreign']);
                }
                
                $table->dropColumn([
                    'jam_masuk_scheduled',
                    'jam_keluar_scheduled',
                    'is_permission_requested',
                    'permission_type',
                    'permission_time',
                    'permission_reason',
                    'permission_status',
                    'permission_requested_at',
                    'permission_approved_at',
                    'permission_approved_by',
                    'permission_notes',
                    'is_overtime_requested',
                    'overtime_start',
                    'overtime_end',
                    'overtime_hours',
                    'overtime_reason',
                    'overtime_status',
                    'overtime_requested_at',
                    'overtime_approved_at',
                    'overtime_approved_by',
                    'overtime_notes'
                ]);
            });
        }
    }
};