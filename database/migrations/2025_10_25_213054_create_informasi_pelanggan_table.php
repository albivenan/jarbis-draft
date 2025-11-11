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
        Schema::create('informasi_pelanggan', function (Blueprint $table) {
            $table->id();
            $table->string('nama_perusahaan');
            $table->enum('jenis_pelanggan', ['perorangan', 'perusahaan', 'instansi']);
            $table->string('npwp', 30)->nullable();
            $table->decimal('batas_kredit', 15, 2)->default(0.00);
            $table->integer('term_pembayaran')->default(0);
            $table->foreignId('sales_rep_id')->nullable()->constrained('users'); // Asumsi tabel users ada
            $table->enum('status', ['prospek', 'aktif', 'ditangguhkan', 'tidak_aktif'])->default('prospek');
            $table->string('alamat_utama_jalan')->nullable();
            $table->string('alamat_utama_kota', 100)->nullable();
            $table->string('alamat_utama_provinsi', 100)->nullable();
            $table->string('kode_pos_utama', 10)->nullable();
            $table->string('telepon_utama', 30)->nullable();
            $table->string('email_utama', 100)->nullable();
            $table->string('kontak_person_nama')->nullable();
            $table->string('kontak_person_jabatan', 100)->nullable();
            $table->string('kontak_person_hp', 30)->nullable();
            $table->text('catatan')->nullable();
            $table->string('tingkat_harga_nama')->nullable();
            $table->decimal('tingkat_harga_diskon', 5, 2)->nullable();
            $table->json('daftar_alamat_pengiriman')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users'); // Jika pelanggan bisa login
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('informasi_pelanggan');
    }
};
