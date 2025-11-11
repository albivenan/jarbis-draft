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
        Schema::table('payroll_settings', function (Blueprint $table) {
            // Drop the existing unique index on setting_key if it exists
            // Use the exact name Laravel would generate for a single column unique index
            try {
                $table->dropUnique('payroll_settings_setting_key_unique');
            } catch (\Exception $e) {
                // Ignore if index doesn't exist, for robustness during development
            }

            // Add a new composite unique index on setting_key and valid_from
            $table->unique(['setting_key', 'valid_from'], 'payroll_settings_setting_key_valid_from_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // For migrate:refresh to work reliably, we will drop the table
        // This is a development-specific workaround for this problematic migration's down() method
        // In a production environment, a more careful rollback would be needed.
        Schema::dropIfExists('payroll_settings');
    }
};
