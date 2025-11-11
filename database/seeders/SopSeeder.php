<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Sop;
use Illuminate\Support\Facades\DB;

class SopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('sops')->delete();

        Sop::create([
            'code' => 'HRD-SOP-001',
            'title' => 'Prosedur Rekrutmen Karyawan Baru',
            'category' => 'hrd',
            'department' => 'HRD',
            'version' => '2.1',
            'status' => 'approved',
            'effective_date' => '2024-01-01',
            'review_date' => '2023-12-15',
            'next_review_date' => '2024-12-15',
            'approved_by' => 'Direktur',
            'created_by' => 'Manajer HRD',
            'description' => 'Prosedur standar untuk proses rekrutmen karyawan baru mulai dari posting lowongan hingga onboarding',
            'objective' => 'Memastikan proses rekrutmen yang efektif, efisien, dan sesuai dengan kebutuhan perusahaan',
            'scope' => 'Berlaku untuk semua posisi karyawan baru di seluruh departemen',
            'steps' => [
                ['step_number' => 1, 'title' => 'Identifikasi Kebutuhan', 'description' => 'Analisis kebutuhan SDM berdasarkan permintaan departemen', 'responsible' => 'Manajer HRD', 'duration' => '1-2 hari'],
                ['step_number' => 2, 'title' => 'Posting Lowongan', 'description' => 'Publikasi lowongan kerja di berbagai platform', 'responsible' => 'Staff HRD', 'duration' => '3-5 hari'],
                ['step_number' => 3, 'title' => 'Seleksi CV', 'description' => 'Review dan seleksi CV kandidat sesuai kriteria', 'responsible' => 'Staff HRD', 'duration' => '5-7 hari'],
            ],
            'related_documents' => ['Form Permintaan Karyawan', 'Template Job Description', 'Checklist Onboarding'],
            'attachments' => ['sop-rekrutmen-v2.1.pdf', 'flowchart-rekrutmen.png'],
            'download_count' => 45,
        ]);

        Sop::create([
            'code' => 'PROD-SOP-001',
            'title' => 'Prosedur Keselamatan Kerja di Workshop',
            'category' => 'produksi',
            'department' => 'Produksi',
            'version' => '3.0',
            'status' => 'review',
            'effective_date' => '2024-02-01',
            'review_date' => '2024-01-15',
            'next_review_date' => '2025-01-15',
            'approved_by' => 'Pending',
            'created_by' => 'Manajer Produksi',
            'description' => 'Prosedur keselamatan kerja untuk semua aktivitas di area workshop produksi',
            'objective' => 'Memastikan keselamatan dan kesehatan kerja di lingkungan produksi',
            'scope' => 'Berlaku untuk semua karyawan yang bekerja di area workshop',
            'steps' => [
                ['step_number' => 1, 'title' => 'Persiapan APD', 'description' => 'Memastikan penggunaan APD lengkap sebelum memasuki area kerja', 'responsible' => 'Semua Karyawan', 'duration' => '5 menit'],
                ['step_number' => 2, 'title' => 'Safety Check', 'description' => 'Pemeriksaan kondisi mesin dan peralatan', 'responsible' => 'Operator', 'duration' => '10-15 menit'],
            ],
            'related_documents' => ['Checklist APD', 'Emergency Procedure', 'Incident Report Form'],
            'attachments' => ['sop-safety-v3.0.pdf', 'safety-checklist.xlsx'],
            'download_count' => 28,
        ]);

        Sop::create([
            'code' => 'FIN-SOP-001',
            'title' => 'Prosedur Pengajuan dan Persetujuan Anggaran',
            'category' => 'keuangan',
            'department' => 'Keuangan',
            'version' => '1.3',
            'status' => 'draft',
            'effective_date' => null,
            'review_date' => '2024-01-10',
            'next_review_date' => '2025-01-10',
            'approved_by' => 'Pending',
            'created_by' => 'Manajer Keuangan',
            'description' => 'Prosedur untuk pengajuan dan persetujuan anggaran departemen',
            'objective' => 'Memastikan proses pengajuan anggaran yang terstruktur dan terkontrol',
            'scope' => 'Berlaku untuk semua departemen yang mengajukan anggaran',
            'steps' => [
                ['step_number' => 1, 'title' => 'Pengajuan Anggaran', 'description' => 'Departemen mengajukan proposal anggaran', 'responsible' => 'Manajer Departemen', 'duration' => '5-7 hari'],
            ],
            'related_documents' => ['Form Pengajuan Anggaran', 'Budget Template', 'Approval Matrix'],
            'attachments' => ['sop-budget-draft-v1.3.pdf'],
            'download_count' => 12,
        ]);
    }
}