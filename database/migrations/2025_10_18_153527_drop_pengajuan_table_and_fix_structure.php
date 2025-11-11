<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Migrate data dari pengajuan ke pengajuan_cuti jika ada
        if (Schema::hasTable('pengajuan') && Schema::hasTable('pengajuan_cuti')) {
            DB::statement("
                INSERT INTO pengajuan_cuti (id_karyawan, jenis_pengajuan, tanggal_mulai, tanggal_selesai, alasan, status, created_at, updated_at)
                SELECT id_karyawan, jenis_pengajuan, tanggal_mulai, tanggal_selesai, alasan, 
                       CASE 
                           WHEN status_pengajuan = 'pending' THEN 'pending'
                           WHEN status_pengajuan = 'approved' THEN 'approved'
                           WHEN status_pengajuan = 'rejected' THEN 'rejected'
                           ELSE 'pending'
                       END as status,
                       created_at, updated_at
                FROM pengajuan
                WHERE NOT EXISTS (
                    SELECT 1 FROM pengajuan_cuti pc 
                    WHERE pc.id_karyawan = pengajuan.id_karyawan 
                    AND pc.tanggal_mulai = pengajuan.tanggal_mulai
                )
            ");
        }

        // 2. Drop tabel pengajuan
        Schema::dropIfExists('pengajuan');
        
        // 3. Rename pengajuan_cuti menjadi pengajuan_izin (lebih umum)
        if (Schema::hasTable('pengajuan_cuti') && !Schema::hasTable('pengajuan_izin')) {
            Schema::rename('pengajuan_cuti', 'pengajuan_izin');
        }

        // 3. Create tabel kuota_cuti untuk tracking sisa cuti
        if (!Schema::hasTable('kuota_cuti')) {
            Schema::create('kuota_cuti', function (Blueprint $table) {
                $table->id();
                $table->foreignId('id_karyawan')->constrained('identitas_karyawan', 'id_karyawan')->onDelete('cascade');
                $table->year('tahun');
                $table->integer('kuota_tahunan')->default(12); // 12 hari per tahun
                $table->integer('kuota_terpakai')->default(0);
                $table->integer('kuota_tersisa')->default(12);
                $table->text('catatan')->nullable();
                $table->timestamps();
                
                $table->unique(['id_karyawan', 'tahun']);
                $table->index('tahun');
            });
        }

        // 4. Update pengajuan_izin table - tambah field yang hilang
        if (Schema::hasTable('pengajuan_izin')) {
            Schema::table('pengajuan_izin', function (Blueprint $table) {
                // Tambah catatan_penolakan jika belum ada
                if (!Schema::hasColumn('pengajuan_izin', 'catatan_penolakan')) {
                    $table->text('catatan_penolakan')->nullable()->after('approved_at');
                }
                
                // Tambah jumlah_hari jika belum ada
                if (!Schema::hasColumn('pengajuan_izin', 'jumlah_hari')) {
                    $table->integer('jumlah_hari')->default(1)->after('tanggal_selesai');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate pengajuan table
        Schema::create('pengajuan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_karyawan')->constrained('identitas_karyawan', 'id_karyawan')->onDelete('cascade');
            $table->string('jenis_pengajuan', 50);
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->text('alasan');
            $table->enum('status_pengajuan', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });

        // Drop kuota_cuti
        Schema::dropIfExists('kuota_cuti');

        // Rename back pengajuan_izin to pengajuan_cuti
        if (Schema::hasTable('pengajuan_izin')) {
            Schema::rename('pengajuan_izin', 'pengajuan_cuti');
        }
        
        // Remove added columns from pengajuan_cuti
        if (Schema::hasTable('pengajuan_cuti')) {
            Schema::table('pengajuan_cuti', function (Blueprint $table) {
                if (Schema::hasColumn('pengajuan_cuti', 'catatan_penolakan')) {
                    $table->dropColumn('catatan_penolakan');
                }
                if (Schema::hasColumn('pengajuan_cuti', 'jumlah_hari')) {
                    $table->dropColumn('jumlah_hari');
                }
            });
        }
    }
};
