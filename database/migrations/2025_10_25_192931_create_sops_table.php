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
        Schema::create('sops', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('title');
            $table->enum('category', ['hrd', 'produksi', 'keuangan', 'marketing', 'qc', 'umum']);
            $table->string('department');
            $table->string('version')->default('1.0');
            $table->enum('status', ['draft', 'review', 'approved', 'archived'])->default('draft');
            $table->date('effective_date')->nullable();
            $table->date('review_date')->nullable();
            $table->date('next_review_date')->nullable();
            $table->string('approved_by')->nullable();
            $table->string('created_by')->nullable();
            $table->text('description')->nullable();
            $table->text('objective')->nullable();
            $table->text('scope')->nullable();
            $table->json('steps')->nullable();
            $table->json('related_documents')->nullable();
            $table->json('attachments')->nullable();
            $table->integer('download_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sops');
    }
};