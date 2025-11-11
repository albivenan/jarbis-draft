<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Consolidate duplicate tables and use Indonesian naming:
     * - Drop permission_requests (duplicate)
     * - Enhance pengajuan_izin with best features
     * - Rename overtime_requests to pengajuan_lembur
     */
    public function up(): void
    {
        // Step 1: Enhance pengajuan_izin if it exists
        if (Schema::hasTable('pengajuan_izin')) {
            // Fix id_karyawan type if needed
            DB::statement('ALTER TABLE pengajuan_izin MODIFY id_karyawan BIGINT UNSIGNED NOT NULL');
            
            // Add missing columns
            Schema::table('pengajuan_izin', function (Blueprint $table) {
                if (!Schema::hasColumn('pengajuan_izin', 'id_jadwal')) {
                    $table->unsignedBigInteger('id_jadwal')->nullable()->after('id_karyawan');
                }
                
                if (!Schema::hasColumn('pengajuan_izin', 'waktu_izin')) {
                    $table->time('waktu_izin')->nullable()->after('tanggal_selesai');
                }
            });
            
            // Add foreign keys and indexes
            Schema::table('pengajuan_izin', function (Blueprint $table) {
                // To ensure this migration is re-runnable, we drop the foreign key first if it exists.
                $foreignKeys = DB::select(
                    'SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_TYPE = \'FOREIGN KEY\' AND TABLE_SCHEMA = \'' . DB::connection()->getDatabaseName() . '\' AND TABLE_NAME = \'pengajuan_izin\' AND CONSTRAINT_NAME = \'pengajuan_izin_id_jadwal_foreign\''
                );
                if (!empty($foreignKeys)) {
                    $table->dropForeign('pengajuan_izin_id_jadwal_foreign');
                }
                $table->foreign('id_jadwal')->references('id_jadwal')->on('jadwal_kerja')->onDelete('set null');
                
                // Ensure idempotency by dropping indexes before creating them.
                if (Schema::hasIndex('pengajuan_izin', 'pengajuan_izin_id_karyawan_index')) { $table->dropIndex('pengajuan_izin_id_karyawan_index'); }
                if (Schema::hasIndex('pengajuan_izin', 'pengajuan_izin_status_index')) { $table->dropIndex('pengajuan_izin_status_index'); }
                if (Schema::hasIndex('pengajuan_izin', 'pengajuan_izin_created_at_index')) { $table->dropIndex('pengajuan_izin_created_at_index'); }
                if (Schema::hasIndex('pengajuan_izin', 'pengajuan_izin_id_karyawan_status_index')) { $table->dropIndex('pengajuan_izin_id_karyawan_status_index'); }

                $table->index('id_karyawan', 'pengajuan_izin_id_karyawan_index');
                $table->index('status', 'pengajuan_izin_status_index');
                $table->index('created_at', 'pengajuan_izin_created_at_index');
                $table->index(['id_karyawan', 'status'], 'pengajuan_izin_id_karyawan_status_index');
            });
        }
        
        // Step 2: Migrate data from permission_requests to pengajuan_izin (if needed)
        if (Schema::hasTable('permission_requests') && Schema::hasTable('pengajuan_izin')) {
            // Check if there's data to migrate
            $count = DB::table('permission_requests')->count();
            
            if ($count > 0) {
                echo "Migrating {$count} records from permission_requests to pengajuan_izin...\n";
                
                // Migrate data with proper jenis_izin mapping
                $records = DB::table('permission_requests')->get();
                foreach ($records as $record) {
                    // Map jenis_izin to valid ENUM values
                    $jenisIzinMap = [
                        'terlambat' => 'terlambat',
                        'pulang_awal' => 'pulang_awal',
                        'tidak_masuk' => 'tidak_masuk',
                        'sakit' => 'sakit',
                        'cuti' => 'cuti_tahunan',
                        'cuti_tahunan' => 'cuti_tahunan',
                        'cuti_darurat' => 'cuti_darurat'
                    ];
                    
                    $jenisIzin = strtolower($record->jenis_izin);
                    $mappedJenisIzin = $jenisIzinMap[$jenisIzin] ?? 'tidak_masuk'; // Default to tidak_masuk
                    
                    DB::table('pengajuan_izin')->insert([
                        'id_karyawan' => $record->id_karyawan,
                        'id_jadwal' => $record->id_jadwal ?? null,
                        'jenis_izin' => $mappedJenisIzin,
                        'tanggal_mulai' => $record->tanggal_izin,
                        'tanggal_selesai' => $record->tanggal_izin,
                        'waktu_izin' => $record->waktu_izin ?? null,
                        'jumlah_hari' => 1,
                        'alasan' => $record->alasan,
                        'lampiran' => null,
                        'status' => $record->status,
                        'tanggal_pengajuan' => $record->requested_at ?? $record->created_at,
                        'approved_by' => $record->approved_by,
                        'tanggal_approval' => $record->approved_at,
                        'catatan_approval' => $record->notes ?? $record->approval_notes,
                        'created_at' => $record->created_at,
                        'updated_at' => $record->updated_at
                    ]);
                }
                
                echo "Migration complete!\n";
            }
        }
        
        // Step 3: Drop permission_requests (duplicate table)
        if (Schema::hasTable('permission_requests')) {
            Schema::dropIfExists('permission_requests');
            echo "Dropped duplicate table: permission_requests\n";
        }
        
        // Step 4: Rename overtime_requests to pengajuan_lembur
        if (Schema::hasTable('overtime_requests') && !Schema::hasTable('pengajuan_lembur')) {
            Schema::rename('overtime_requests', 'pengajuan_lembur');
            echo "Renamed: overtime_requests → pengajuan_lembur\n";
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        
        // Rename back
        if (Schema::hasTable('pengajuan_lembur') && !Schema::hasTable('overtime_requests')) {
            Schema::rename('pengajuan_lembur', 'overtime_requests');
        }
        
        // Recreate permission_requests if needed
        if (!Schema::hasTable('permission_requests')) {
            Schema::create('permission_requests', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('id_karyawan');
                $table->unsignedBigInteger('id_jadwal')->nullable();
                $table->string('jenis_izin');
                $table->date('tanggal_izin');
                $table->time('waktu_izin')->nullable();
                $table->text('alasan');
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
                $table->timestamp('requested_at')->nullable();
                $table->unsignedBigInteger('approved_by')->nullable();
                $table->text('notes')->nullable();
                $table->text('approval_notes')->nullable();
                $table->timestamp('approved_at')->nullable();
                $table->timestamps();

                $table->foreign('id_karyawan')->references('id_karyawan')->on('identitas_karyawan')->onDelete('cascade');
                $table->foreign('id_jadwal')->references('id_jadwal')->on('jadwal_kerja')->onDelete('set null');
                $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            });
        }
        
        // Remove enhancements from pengajuan_izin
        if (Schema::hasTable('pengajuan_izin')) {
            Schema::table('pengajuan_izin', function (Blueprint $table) {
                if (Schema::hasColumn('pengajuan_izin', 'id_jadwal')) {
                    $foreignKeys = DB::select(
                        'SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_TYPE = \'FOREIGN KEY\' AND TABLE_SCHEMA = \'' . DB::connection()->getDatabaseName() . '\' AND TABLE_NAME = \'pengajuan_izin\' AND CONSTRAINT_NAME = \'pengajuan_izin_id_jadwal_foreign\''
                    );
                    if (!empty($foreignKeys)) {
                        $table->dropForeign('pengajuan_izin_id_jadwal_foreign');
                    }
                    $table->dropColumn('id_jadwal');
                }
                
                if (Schema::hasColumn('pengajuan_izin', 'waktu_izin')) {
                    $table->dropColumn('waktu_izin');
                }
                
                if (Schema::hasIndex('pengajuan_izin', 'pengajuan_izin_id_karyawan_index')) { $table->dropIndex('pengajuan_izin_id_karyawan_index'); }
                if (Schema::hasIndex('pengajuan_izin', 'pengajuan_izin_status_index')) { $table->dropIndex('pengajuan_izin_status_index'); }
                if (Schema::hasIndex('pengajuan_izin', 'pengajuan_izin_created_at_index')) { $table->dropIndex('pengajuan_izin_created_at_index'); }
                if (Schema::hasIndex('pengajuan_izin', 'pengajuan_izin_id_karyawan_status_index')) { $table->dropIndex('pengajuan_izin_id_karyawan_status_index'); }
            });
        }
        
    }
};
