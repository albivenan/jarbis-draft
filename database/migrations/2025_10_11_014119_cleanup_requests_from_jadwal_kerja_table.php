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
            $columns_to_drop = [
                'is_overtime_requested',
                'jam_lembur_mulai',
                'jam_lembur_selesai',
                'alasan_lembur',
                'status_lembur',
                'catatan_lembur',
                'tanggal_pengajuan_lembur',
                'approved_by',
                'tanggal_approval_lembur',
                'is_permission_requested',
                'permission_type',
                'permission_time',
                'permission_reason',
                'permission_status',
                'permission_notes',
                'permission_requested_at',
                'permission_approved_by',
                'permission_approved_at'
            ];

            // Drop foreign keys first to avoid errors
            // Note: Foreign key constraint names can vary. Manually check if this fails.
            // Usually it's table_column_foreign
            if (Schema::hasColumn($table->getTable(), 'approved_by')) {
                try {
                    $table->dropForeign(['approved_by']);
                } catch (\Exception $e) {
                    // Ignore if it fails, might not exist
                }
            }
            if (Schema::hasColumn($table->getTable(), 'permission_approved_by')) {
                 try {
                    $table->dropForeign(['permission_approved_by']);
                } catch (\Exception $e) {
                    // Ignore if it fails, might not exist
                }
            }

            $table->dropColumn($columns_to_drop);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jadwal_kerja', function (Blueprint $table) {
            $table->boolean('is_overtime_requested')->default(false);
            $table->time('jam_lembur_mulai')->nullable();
            $table->time('jam_lembur_selesai')->nullable();
            $table->text('alasan_lembur')->nullable();
            $table->enum('status_lembur', ['pending', 'approved', 'rejected'])->nullable();
            $table->text('catatan_lembur')->nullable();
            $table->timestamp('tanggal_pengajuan_lembur')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('tanggal_approval_lembur')->nullable();
            
            $table->boolean('is_permission_requested')->default(false);
            $table->enum('permission_type', ['terlambat', 'pulang_awal', 'tidak_masuk'])->nullable();
            $table->time('permission_time')->nullable();
            $table->text('permission_reason')->nullable();
            $table->enum('permission_status', ['pending', 'approved', 'rejected'])->nullable();
            $table->text('permission_notes')->nullable();
            $table->timestamp('permission_requested_at')->nullable();
            $table->unsignedBigInteger('permission_approved_by')->nullable();
            $table->timestamp('permission_approved_at')->nullable();

            // Re-add foreign keys
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('permission_approved_by')->references('id')->on('users')->onDelete('set null');
        });
    }
};