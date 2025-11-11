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
        \App\Models\SumberDana::where('nama_sumber', 'Kas Utama')->delete();
    }

    public function down(): void
    {
        // Recreate the 'Kas Utama' entry if it was deleted, for rollback purposes
        // Assuming default values if not explicitly known
        \App\Models\SumberDana::firstOrCreate(
            ['nama_sumber' => 'Kas Utama'],
            ['tipe_sumber' => 'Tunai', 'saldo' => 0.00, 'deskripsi' => 'Sumber dana kas utama yang dihapus.']
        );
    }
};
