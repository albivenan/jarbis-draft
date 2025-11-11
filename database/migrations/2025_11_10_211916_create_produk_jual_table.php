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
        Schema::create('produk_jual', function (Blueprint $table) {
            $table->id();
            $table->string('nama_produk');
            $table->text('deskripsi')->nullable();
            $table->decimal('harga_usulan_ppic', 15, 2);
            $table->decimal('harga_disetujui_keuangan', 15, 2)->nullable();
            $table->decimal('margin_keuangan', 5, 2)->nullable(); // e.g., 0.10 for 10%
            $table->enum('status', ['Pending', 'Disetujui', 'Ditolak'])->default('Pending');
            
            $table->foreignId('diajukan_oleh_id')->constrained('users'); // User who proposed the price
            $table->foreignId('disetujui_oleh_id')->nullable()->constrained('users'); // User who approved/rejected
            
            $table->dateTime('diajukan_pada')->nullable();
            $table->dateTime('direspon_pada')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produk_jual');
    }
};
