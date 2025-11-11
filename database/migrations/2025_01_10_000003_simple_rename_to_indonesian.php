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
     * Simple approach: Just drop permission_requests and rename overtime_requests
     */
    public function up(): void
    {
        // Step 1: Drop permission_requests (duplicate, data already in pengajuan_izin)
        if (Schema::hasTable('permission_requests')) {
            // Check if there's important data
            $count = DB::table('permission_requests')->count();
            echo "Found {$count} records in permission_requests\n";

            if ($count > 0) {
                echo "⚠️  WARNING: permission_requests has data. Please backup first!\n";
                echo "Skipping drop. Please migrate data manually to pengajuan_izin.\n";
            } else {
                Schema::dropIfExists('permission_requests');
                echo "✅ Dropped empty table: permission_requests\n";
            }
        }

        // Step 2: Rename overtime_requests to pengajuan_lembur
        if (Schema::hasTable('overtime_requests') && !Schema::hasTable('pengajuan_lembur')) {
            Schema::rename('overtime_requests', 'pengajuan_lembur');
            echo "✅ Renamed: overtime_requests → pengajuan_lembur\n";
        }

        echo "\n=== MIGRATION COMPLETE ===\n";
        echo "Tables now use Indonesian names:\n";
        echo "- pengajuan_izin (for permission/leave requests)\n";
        echo "- pengajuan_lembur (for overtime requests)\n";
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

        // Note: We don't recreate permission_requests as it was a duplicate
    }
};
