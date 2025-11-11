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
        // Drop old permission_requests table
        Schema::dropIfExists('permission_requests');
        
        // Drop old overtime_requests table
        Schema::dropIfExists('overtime_requests');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Note: We cannot recreate the old tables as we don't have their original structure
        // This migration is meant to be one-way (forward only)
    }
};