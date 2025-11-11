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
        // Table: pemasok
        Schema::create('pemasok', function (Blueprint $table) {
            $table->id();
            $table->string('nama_pemasok')->unique();
            $table->text('alamat')->nullable();
            $table->string('telepon')->nullable();
            $table->string('email')->nullable();
            $table->timestamps();
        });

        // Table: bahan_baku
        Schema::create('bahan_baku', function (Blueprint $table) {
            $table->id();
            $table->string('nama_bahan_baku')->unique();
            $table->text('deskripsi')->nullable();
            $table->string('satuan_dasar');
            $table->decimal('harga_standar', 15, 2)->nullable();
            $table->foreignId('pemasok_id')->nullable()->constrained('pemasok')->onDelete('set null'); // Optional primary supplier
            $table->timestamps();
        });

        // Table: pembelian_bahan_baku
        Schema::create('pembelian_bahan_baku', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_batch')->unique();
            $table->date('tanggal_batch');
            $table->enum('status_batch', ['Pending', 'Diajukan', 'Disetujui', 'Ditolak'])->default('Pending');
            $table->enum('metode_pembayaran', ['Tunai', 'Transfer', 'Rekening Bank'])->nullable();
            $table->enum('status_pembayaran', ['Belum Dibayar', 'Sudah Dibayar', 'Pembayaran Ditolak'])->default('Belum Dibayar');
            $table->decimal('total_harga_batch', 15, 2)->default(0.00);
            $table->text('catatan')->nullable();
            $table->foreignId('dibuat_oleh_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('disetujui_oleh_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('tanggal_disetujui')->nullable();
            $table->foreignId('sumber_dana_id')->nullable()->constrained('sumber_dana')->onDelete('set null');
            $table->timestamps();
        });

        // Table: pembelian_bahan_baku_item
        Schema::create('pembelian_bahan_baku_item', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pembelian_bahan_baku_id')->constrained('pembelian_bahan_baku')->onDelete('cascade');
            $table->foreignId('bahan_baku_id')->constrained('bahan_baku')->onDelete('cascade');
            $table->string('nama_item'); // For historical data
            $table->decimal('jumlah', 15, 2);
            $table->string('satuan');
            $table->decimal('harga_satuan', 15, 2);
            $table->decimal('total_harga_item', 15, 2);
            $table->enum('status_item', ['Pending', 'Diterima', 'Ditolak', 'Diterima & Dibayar'])->default('Pending');
            $table->text('catatan_item')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembelian_bahan_baku_item');
        Schema::dropIfExists('pembelian_bahan_baku');
        Schema::dropIfExists('bahan_baku');
        Schema::dropIfExists('pemasok');
    }
};
