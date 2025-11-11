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
        Schema::create('keuangan_pemasukan_harian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('sumber_dana_id')->constrained('sumber_dana')->onDelete('restrict'); // Restrict deletion if there are associated transactions
            $table->date('tanggal');
            $table->string('description');
            $table->decimal('amount', 15, 2);
            $table->string('jenis_pemasukan');
            $table->text('catatan')->nullable();
            $table->string('invoice_path')->nullable();
            $table->string('status', 50);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keuangan_pemasukan_harian');
    }
};
