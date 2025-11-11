<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Remove redundant overtime fields from presensi table
     * Keep only actual attendance logging fields
     * All overtime requests are handled in jadwal_kerja table
     */
    public function up(): void
    {
        if (Schema::hasTable('presensi')) {
            // First, drop foreign key constraints
            Schema::table('presensi', function (Blueprint $table) {
                try {
                    $table->dropForeign(['permission_approved_by']);
                } catch (Exception $e) {
                    // Foreign key might not exist
                }
                
                try {
                    $table->dropForeign(['overtime_approved_by']);
                } catch (Exception $e) {
                    // Foreign key might not exist
                }
            });

            // Then drop redundant columns
            Schema::table('presensi', function (Blueprint $table) {
                $redundantColumns = [
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
                ];

                foreach ($redundantColumns as $column) {
                    if (Schema::hasColumn('presensi', $column)) {
                        $table->dropColumn($column);
                    }
                }
            });

            // Add performance indexes if they don't exist
            Schema::table('presensi', function (Blueprint $table) {
                // Add indexes for better query performance
                try {
                    if (!$this->indexExists('presensi', 'idx_presensi_karyawan_tanggal')) {
                        $table->index(['id_karyawan', 'tanggal'], 'idx_presensi_karyawan_tanggal');
                    }
                } catch (Exception $e) {
                    // Index might already exist
                }
                
                try {
                    if (!$this->indexExists('presensi', 'idx_presensi_tanggal_status')) {
                        $table->index(['tanggal', 'status_presensi'], 'idx_presensi_tanggal_status');
                    }
                } catch (Exception $e) {
                    // Index might already exist
                }
            });
        }
    }

    /**
     * Check if index exists
     */
    private function indexExists($table, $indexName)
    {
        $indexes = Schema::getConnection()->getDoctrineSchemaManager()
            ->listTableIndexes($table);
        return array_key_exists($indexName, $indexes);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('presensi')) {
            Schema::table('presensi', function (Blueprint $table) {
                // Only drop the indexes that were added in the `up()` method of this migration.
                $table->dropIndex('idx_presensi_karyawan_tanggal');
                $table->dropIndex('idx_presensi_tanggal_status');

                // Re-add the columns that were dropped in the up() method.
                // This makes the migration truly reversible.
                $table->unsignedBigInteger('permission_approved_by')->nullable();
                $table->text('permission_notes')->nullable();
                $table->boolean('is_overtime_requested')->default(false);
                $table->time('overtime_start')->nullable();
                $table->time('overtime_end')->nullable();
                $table->decimal('overtime_hours', 4, 2)->default(0);
                $table->text('overtime_reason')->nullable();
                $table->enum('overtime_status', ['pending', 'approved', 'rejected'])->nullable();
                $table->timestamp('overtime_requested_at')->nullable();
                $table->timestamp('overtime_approved_at')->nullable();
                $table->unsignedBigInteger('overtime_approved_by')->nullable();
                $table->text('overtime_notes')->nullable();

                // Re-add foreign keys if they were dropped in up()
                $table->foreign('permission_approved_by')->references('id')->on('users')->onDelete('set null');
                $table->foreign('overtime_approved_by')->references('id')->on('users')->onDelete('set null');
            });
        }
    }
};