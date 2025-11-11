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
        // 1. Update identitas_karyawan table
        Schema::table('identitas_karyawan', function (Blueprint $table) {
            if (Schema::hasColumn('identitas_karyawan', 'alamat') && !Schema::hasColumn('identitas_karyawan', 'alamat_ktp')) {
                $table->renameColumn('alamat', 'alamat_ktp');
            }
            if (!Schema::hasColumn('identitas_karyawan', 'kewarganegaraan')) {
                $table->string('kewarganegaraan')->nullable()->after('golongan_darah');
            }
            if (!Schema::hasColumn('identitas_karyawan', 'pekerjaan_ktp')) {
                $table->string('pekerjaan_ktp')->nullable()->after('kewarganegaraan');
            }
            if (!Schema::hasColumn('identitas_karyawan', 'nomor_npwp')) {
                $table->string('nomor_npwp')->nullable()->unique()->after('pekerjaan_ktp');
            }
            if (!Schema::hasColumn('identitas_karyawan', 'nomor_bpjs_kesehatan')) {
                $table->string('nomor_bpjs_kesehatan')->nullable()->unique()->after('nomor_npwp');
            }
            if (!Schema::hasColumn('identitas_karyawan', 'nomor_bpjs_ketenagakerjaan')) {
                $table->string('nomor_bpjs_ketenagakerjaan')->nullable()->unique()->after('nomor_bpjs_kesehatan');
            }
            if (!Schema::hasColumn('identitas_karyawan', 'alamat_domisili')) {
                $table->text('alamat_domisili')->nullable()->after('alamat_ktp');
            }
            if (!Schema::hasColumn('identitas_karyawan', 'foto_profil_url')) {
                $table->string('foto_profil_url')->nullable()->after('alamat_domisili');
            }
        });

        // 2. Update kontak_karyawan table
        Schema::table('kontak_karyawan', function (Blueprint $table) {
            if (!Schema::hasColumn('kontak_karyawan', 'nama_bank')) {
                $table->string('nama_bank')->nullable()->after('nomor_darurat');
            }
            if (!Schema::hasColumn('kontak_karyawan', 'nomor_rekening')) {
                $table->string('nomor_rekening')->nullable()->after('nama_bank');
            }
            if (!Schema::hasColumn('kontak_karyawan', 'nama_pemilik_rekening')) {
                $table->string('nama_pemilik_rekening')->nullable()->after('nomor_rekening');
            }
        });

        // 3. Create kontak_darurat table
        if (!Schema::hasTable('kontak_darurat')) {
            Schema::create('kontak_darurat', function (Blueprint $table) {
                $table->id();
                $table->foreignId('id_karyawan')->constrained('identitas_karyawan', 'id_karyawan')->onDelete('cascade');
                $table->string('nama');
                $table->string('hubungan');
                $table->string('nomor_telepon');
                $table->timestamps();
            });
        }

        // 4. Create dokumen_karyawan table
        if (!Schema::hasTable('dokumen_karyawan')) {
            Schema::create('dokumen_karyawan', function (Blueprint $table) {
                $table->id();
                $table->foreignId('id_karyawan')->constrained('identitas_karyawan', 'id_karyawan')->onDelete('cascade');
                $table->string('nama_dokumen');
                $table->string('jenis_dokumen');
                $table->date('tanggal_unggah')->nullable();
                $table->string('url');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokumen_karyawan');
        Schema::dropIfExists('kontak_darurat');

        Schema::table('kontak_karyawan', function (Blueprint $table) {
            $table->dropColumn(['nama_bank', 'nomor_rekening', 'nama_pemilik_rekening']);
        });

        Schema::table('identitas_karyawan', function (Blueprint $table) {
            if (Schema::hasColumn('identitas_karyawan', 'alamat_ktp') && !Schema::hasColumn('identitas_karyawan', 'alamat')) {
                $table->renameColumn('alamat_ktp', 'alamat');
            }
            $table->dropColumn([
                'kewarganegaraan',
                'pekerjaan_ktp',
                'nomor_npwp',
                'nomor_bpjs_kesehatan',
                'nomor_bpjs_ketenagakerjaan',
                'alamat_domisili',
                'foto_profil_url',
            ]);
        });
    }
};
