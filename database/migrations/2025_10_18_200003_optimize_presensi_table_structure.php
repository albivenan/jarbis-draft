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
        // Hapus foreign key constraints terlebih dahulu sebelum menghapus kolom
        Schema::table('presensi', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
        });

        // Migrasi data permohonan dari tabel presensi ke tabel permohonan_izin
        DB::transaction(function () {
            // Pindahkan data permohonan izin dari presensi ke permohonan_izin
            $izinRecords = DB::table('presensi')
                ->where('jenis_pengajuan', '!=', 'normal')
                ->where(function ($query) {
                    $query->where('jenis_pengajuan', 'izin_terlambat')
                          ->orWhere('jenis_pengajuan', 'izin_pulang_awal')
                          ->orWhere('jenis_pengajuan', 'izin_tidak_masuk');
                })
                ->get();

            foreach ($izinRecords as $record) {
                DB::table('permohonan_izin')->insert([
                    'id_karyawan' => $record->id_karyawan,
                    'tanggal_permohonan' => $record->tanggal,
                    'jenis_permohonan' => $record->jenis_pengajuan,
                    'waktu_pengajuan' => $record->waktu_pengajuan,
                    'alasan' => $record->alasan_pengajuan ?? '',
                    'status_pengajuan' => $record->status_pengajuan ?? 'pending',
                    'tanggal_pengajuan' => $record->tanggal_pengajuan,
                    'approved_by' => $record->approved_by,
                    'tanggal_approval' => $record->tanggal_approval,
                    'catatan_approval' => $record->catatan_approval,
                    'created_at' => $record->created_at,
                    'updated_at' => $record->updated_at,
                ]);
            }

            // Pindahkan data permohonan lembur dari presensi ke permohonan_lembur
            $lemburRecords = DB::table('presensi')
                ->where('jenis_pengajuan', 'lembur')
                ->get();

            foreach ($lemburRecords as $record) {
                DB::table('permohonan_lembur')->insert([
                    'id_karyawan' => $record->id_karyawan,
                    'tanggal_permohonan' => $record->tanggal,
                    'jam_mulai_lembur' => $record->jam_lembur_mulai,
                    'jam_selesai_lembur' => $record->jam_lembur_selesai,
                    'durasi_lembur' => $record->jam_lembur ?? 0,
                    'alasan_lembur' => $record->alasan_pengajuan ?? '',
                    'status_pengajuan' => $record->status_pengajuan ?? 'pending',
                    'tanggal_pengajuan' => $record->tanggal_pengajuan,
                    'approved_by' => $record->approved_by,
                    'tanggal_approval' => $record->tanggal_approval,
                    'catatan_approval' => $record->catatan_approval,
                    'created_at' => $record->created_at,
                    'updated_at' => $record->updated_at,
                ]);
            }
        });

        // Hapus kolom-kolom yang berkaitan dengan permohonan dari tabel presensi
        Schema::table('presensi', function (Blueprint $table) {
            // Hapus kolom permohonan izin
            $table->dropColumn([
                'jenis_pengajuan',
                'alasan_pengajuan',
                'waktu_pengajuan',
                'jam_lembur_mulai',
                'jam_lembur_selesai',
                'status_pengajuan',
                'tanggal_pengajuan',
                'approved_by',
                'tanggal_approval',
                'catatan_approval',
                'is_permission_requested',
                'permission_type',
                'permission_time',
                'permission_reason',
                'permission_status',
                'permission_requested_at',
                'permission_approved_at'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Tambahkan kembali kolom-kolom yang dihapus
        Schema::table('presensi', function (Blueprint $table) {
            $table->enum('jenis_pengajuan', ['normal', 'izin_terlambat', 'izin_pulang_awal', 'izin_tidak_masuk', 'lembur'])->default('normal');
            $table->text('alasan_pengajuan')->nullable();
            $table->time('waktu_pengajuan')->nullable();
            $table->time('jam_lembur_mulai')->nullable();
            $table->time('jam_lembur_selesai')->nullable();
            $table->enum('status_pengajuan', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('tanggal_pengajuan')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('tanggal_approval')->nullable();
            $table->text('catatan_approval')->nullable();
            $table->boolean('is_permission_requested')->default(false);
            $table->string('permission_type')->nullable();
            $table->time('permission_time')->nullable();
            $table->text('permission_reason')->nullable();
            $table->enum('permission_status', ['pending', 'approved', 'rejected'])->nullable();
            $table->timestamp('permission_requested_at')->nullable();
            $table->timestamp('permission_approved_at')->nullable();
            $table->text('permission_notes')->nullable();
        });

        // Tambahkan kembali foreign key constraints
        Schema::table('presensi', function (Blueprint $table) {
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
        });

        // Kembalikan data dari tabel permohonan ke tabel presensi
        DB::transaction(function () {
            // Pindahkan data dari permohonan_izin ke presensi
            $izinRecords = DB::table('permohonan_izin')->get();
            foreach ($izinRecords as $record) {
                DB::table('presensi')->where('id_karyawan', $record->id_karyawan)
                    ->where('tanggal', $record->tanggal_permohonan)
                    ->update([
                        'jenis_pengajuan' => $record->jenis_permohonan,
                        'alasan_pengajuan' => $record->alasan,
                        'waktu_pengajuan' => $record->waktu_pengajuan,
                        'status_pengajuan' => $record->status_pengajuan,
                        'tanggal_pengajuan' => $record->tanggal_pengajuan,
                        'approved_by' => $record->approved_by,
                        'tanggal_approval' => $record->tanggal_approval,
                        'catatan_approval' => $record->catatan_approval,
                        'updated_at' => $record->updated_at,
                    ]);
            }

            // Pindahkan data dari permohonan_lembur ke presensi
            $lemburRecords = DB::table('permohonan_lembur')->get();
            foreach ($lemburRecords as $record) {
                DB::table('presensi')->where('id_karyawan', $record->id_karyawan)
                    ->where('tanggal', $record->tanggal_permohonan)
                    ->update([
                        'jenis_pengajuan' => 'lembur',
                        'alasan_pengajuan' => $record->alasan_lembur,
                        'jam_lembur_mulai' => $record->jam_mulai_lembur,
                        'jam_lembur_selesai' => $record->jam_selesai_lembur,
                        'jam_lembur' => $record->durasi_lembur,
                        'status_pengajuan' => $record->status_pengajuan,
                        'tanggal_pengajuan' => $record->tanggal_pengajuan,
                        'approved_by' => $record->approved_by,
                        'tanggal_approval' => $record->tanggal_approval,
                        'catatan_approval' => $record->catatan_approval,
                        'updated_at' => $record->updated_at,
                    ]);
            }
        });
    }
};