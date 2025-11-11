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
        Schema::table('permohonan_izin', function (Blueprint $table) {
            // Tambahkan kolom yang mungkin kurang
            $table->string('alasan_pengajuan')->nullable()->after('alasan');
            $table->string('lokasi_pengajuan')->nullable()->after('alasan_pengajuan');
            $table->decimal('latitude', 10, 8)->nullable()->after('lokasi_pengajuan');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            $table->text('catatan')->nullable()->after('longitude');
            $table->string('attachment_path')->nullable()->after('catatan');
            $table->string('attachment_type')->nullable()->after('attachment_path');
            $table->timestamp('attachment_uploaded_at')->nullable()->after('attachment_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permohonan_izin', function (Blueprint $table) {
            $table->dropColumn([
                'alasan_pengajuan',
                'lokasi_pengajuan',
                'latitude',
                'longitude',
                'catatan',
                'attachment_path',
                'attachment_type',
                'attachment_uploaded_at'
            ]);
        });
    }
};