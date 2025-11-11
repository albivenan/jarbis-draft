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
        Schema::table('permohonan_lembur', function (Blueprint $table) {
            // Tambahkan kolom yang mungkin kurang
            $table->string('lokasi_lembur')->nullable()->after('alasan_lembur');
            $table->decimal('latitude', 10, 8)->nullable()->after('lokasi_lembur');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            $table->text('catatan')->nullable()->after('longitude');
            $table->string('attachment_path')->nullable()->after('catatan');
            $table->string('attachment_type')->nullable()->after('attachment_path');
            $table->timestamp('attachment_uploaded_at')->nullable()->after('attachment_type');
            $table->string('jenis_lembur')->nullable()->after('attachment_uploaded_at');
            $table->string('shift_lembur')->nullable()->after('jenis_lembur');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permohonan_lembur', function (Blueprint $table) {
            $table->dropColumn([
                'lokasi_lembur',
                'latitude',
                'longitude',
                'catatan',
                'attachment_path',
                'attachment_type',
                'attachment_uploaded_at',
                'jenis_lembur',
                'shift_lembur'
            ]);
        });
    }
};