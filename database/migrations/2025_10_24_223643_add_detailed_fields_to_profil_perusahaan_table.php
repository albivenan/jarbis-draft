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
        Schema::table('profil_perusahaan', function (Blueprint $table) {
            $table->text('visi')->nullable()->after('sejarah_singkat');
            $table->text('misi')->nullable()->after('visi');
            $table->json('nilai_nilai')->nullable()->after('misi');
            $table->json('sertifikasi')->nullable()->after('nilai_nilai');
            $table->string('nama_legal')->nullable()->after('nama_perusahaan');
            $table->string('industri')->nullable()->after('nama_legal');
            $table->string('tahun_berdiri')->nullable()->after('industri');
            $table->string('lisensi_bisnis')->nullable()->after('npwp_perusahaan');
            $table->json('media_sosial')->nullable()->after('lisensi_bisnis');
            $table->string('logo_url')->nullable()->after('media_sosial');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profil_perusahaan', function (Blueprint $table) {
            $table->dropColumn([
                'visi',
                'misi',
                'nilai_nilai',
                'sertifikasi',
                'nama_legal',
                'industri',
                'tahun_berdiri',
                'lisensi_bisnis',
                'media_sosial',
                'logo_url',
            ]);
        });
    }
};
