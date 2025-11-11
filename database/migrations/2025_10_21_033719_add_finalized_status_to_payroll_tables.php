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
        // Add 'finalized' to payroll_batches status enum
        DB::statement("ALTER TABLE payroll_batches CHANGE status status ENUM('draft', 'submitted', 'approved', 'rejected', 'paid', 'finalized') DEFAULT 'draft'");

        // Add 'finalized' and 'paid' to payroll_employees status enum
        DB::statement("ALTER TABLE payroll_employees CHANGE status status ENUM('draft', 'submitted', 'approved', 'rejected', 'finalized', 'paid') DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert payroll_batches status enum
        DB::statement("ALTER TABLE payroll_batches CHANGE status status ENUM('draft', 'submitted', 'approved', 'rejected', 'paid') DEFAULT 'draft'");

        // Revert payroll_employees status enum
        DB::statement("ALTER TABLE payroll_employees CHANGE status status ENUM('draft', 'submitted', 'approved', 'rejected') DEFAULT 'draft'");
    }
};