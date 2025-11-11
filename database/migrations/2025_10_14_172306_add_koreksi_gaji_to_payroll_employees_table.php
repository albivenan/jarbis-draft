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
        Schema::table('payroll_employees', function (Blueprint $table) {
            $table->decimal('koreksi_gaji', 15, 2)->default(0)->after('total_gaji');
            $table->string('catatan_koreksi')->nullable()->after('koreksi_gaji');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payroll_employees', function (Blueprint $table) {
            $table->dropColumn(['koreksi_gaji', 'catatan_koreksi']);
        });
    }
};
