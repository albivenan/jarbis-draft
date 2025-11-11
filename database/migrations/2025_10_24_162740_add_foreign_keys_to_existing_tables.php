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


        Schema::table('rincian_pekerjaan', function (Blueprint $table) {


            // Add foreign key to departemen.id
            // Assuming id_departemen already exists in the rincian_pekerjaan table
            if (Schema::hasColumn('rincian_pekerjaan', 'id_departemen')) {
                $table->foreign('id_departemen')
                      ->references('id_departemen')->on('departemen') // Corrected: primary key of departemen table is 'id_departemen'
                      ->onDelete('cascade');
            }

            // Add foreign key to jabatan.id
            // Assuming id_jabatan already exists in the rincian_pekerjaan table
            if (Schema::hasColumn('rincian_pekerjaan', 'id_jabatan')) {
                $table->foreign('id_jabatan')
                      ->references('id_jabatan')->on('jabatan') // Corrected: primary key of jabatan table is 'id_jabatan'
                      ->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {


        Schema::table('rincian_pekerjaan', function (Blueprint $table) {

            if (Schema::hasColumn('rincian_pekerjaan', 'id_departemen')) {
                $table->dropForeign(['id_departemen']);
            }
            if (Schema::hasColumn('rincian_pekerjaan', 'id_jabatan')) {
                $table->dropForeign(['id_jabatan']);
            }
        });
    }
};