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
            $table->boolean('is_overtime_requested')->default(false)->after('waktu_lembur');
            $table->time('jam_lembur_mulai')->nullable()->after('is_overtime_requested');
            $table->time('jam_lembur_selesai')->nullable()->after('jam_lembur_mulai');
            $table->text('alasan_lembur')->nullable()->after('jam_lembur_selesai');
            $table->enum('status_lembur', ['pending', 'approved', 'rejected'])->nullable()->after('alasan_lembur');
            $table->text('catatan_lembur')->nullable()->after('status_lembur');
            $table->timestamp('tanggal_pengajuan_lembur')->nullable()->after('catatan_lembur');
            $table->unsignedBigInteger('approved_by')->nullable()->after('tanggal_pengajuan_lembur');
            $table->timestamp('tanggal_approval_lembur')->nullable()->after('approved_by');
            
            // Add foreign key for approved_by
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jadwal_kerja', function (Blueprint $table) {
            try {
                $table->dropForeign(['approved_by']);
            } catch (\Exception $e) {}
            
            $table->dropColumn([
                'is_overtime_requested',
                'jam_lembur_mulai',
                'jam_lembur_selesai',
                'alasan_lembur',
                'status_lembur',
                'catatan_lembur',
                'tanggal_pengajuan_lembur',
                'approved_by',
                'tanggal_approval_lembur'
            ]);
        });
    }
};
