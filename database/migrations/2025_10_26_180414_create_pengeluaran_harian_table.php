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
        Schema::create('pengeluaran_harian', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->string('deskripsi');
            $table->foreignId('karyawan_id')->constrained('users');
            $table->string('tujuan_biaya');
            $table->enum('jenis_pengeluaran', ['Perusahaan', 'Reimbursement']);
            $table->decimal('jumlah', 15, 2);
            $table->enum('status', ['Approved', 'Pending', 'Rejected']);
            $table->foreignId('approver_id')->nullable()->constrained('users');
            $table->string('lampiran_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengeluaran_harian');
    }
};
