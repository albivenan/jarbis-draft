<?php

return [
    'roles' => [
        'direktur' => [
            'id' => 1,
            'name' => 'Direktur',
            'description' => 'Hak akses tertinggi. Dapat melihat semua data strategis dan menyetujui pengajuan level manajer.',
            'route' => 'direktur',
            'permissions' => [
                'view_all_data',
                'approve_manager_requests',
                'access_strategic_reports',
                'manage_company_settings'
            ],
            'dashboard_modules' => [
                'reports', 'approvals', 'attachments', 'chat'
            ]
        ],
        'manajer_operasional' => [
            'id' => 2,
            'name' => 'Manajer Operasional',
            'description' => 'Akses manajerial untuk semua unit di bawahnya (Produksi, PPIC, Marketing).',
            'route' => 'manajer-operasional',
            'permissions' => [
                'manage_production',
                'manage_ppic',
                'manage_marketing',
                'view_operational_reports'
            ],
            'dashboard_modules' => [
                'production_overview', 'ppic_summary', 'marketing_summary'
            ]
        ],
        'manajer_hrd' => [
            'id' => 3,
            'name' => 'Manajer HRD',
            'description' => 'Akses penuh untuk mengelola (Create, Read, Update, Delete) data semua karyawan.',
            'route' => 'manajer-hrd',
            'permissions' => [
                'manage_employees',
                'manage_attendance',
                'manage_payroll',
                'manage_recruitment',
                'view_hr_reports'
            ],
            'dashboard_modules' => [
                'employees', 'attendance', 'payroll', 'recruitment', 'performance'
            ]
        ],
        'manajer_keuangan' => [
            'id' => 4,
            'name' => 'Manajer Keuangan',
            'description' => 'Akses penuh ke data finansial, penggajian, NPWP, BPJS, dan laporan keuangan.',
            'route' => 'manajer-keuangan',
            'permissions' => [
                'manage_finance',
                'manage_payroll_finance',
                'manage_tax_data',
                'manage_bpjs_data',
                'view_financial_reports'
            ],
            'dashboard_modules' => [
                'invoices', 'expenses', 'reports', 'budgeting', 'payroll'
            ]
        ],
        'manajer_ppic' => [
            'id' => 5,
            'name' => 'Manajer PPIC',
            'description' => 'Akses untuk mengelola perencanaan produksi, inventaris, dan jadwal.',
            'route' => 'manajer-ppic',
            'permissions' => [
                'manage_production_planning',
                'manage_inventory',
                'manage_schedules',
                'view_ppic_reports'
            ],
            'dashboard_modules' => [
                'inventory', 'planning', 'production', 'movements', 'reports'
            ]
        ],
        'manajer_marketing' => [
            'id' => 6,
            'name' => 'Manajer Marketing',
            'description' => 'Akses untuk mengelola data penjualan, pelanggan, dan laporan pemasaran.',
            'route' => 'manajer-marketing',
            'permissions' => [
                'manage_sales',
                'manage_customers',
                'manage_campaigns',
                'view_marketing_reports'
            ],
            'dashboard_modules' => [
                'crm', 'campaigns', 'reports'
            ]
        ],
        'manajer_produksi' => [
            'id' => 7,
            'name' => 'Manajer Produksi',
            'description' => 'Mengelola data produksi secara keseluruhan. Menyetujui pengajuan dari Supervisor dan melihat laporan produktivitas.',
            'route' => 'manajer-produksi',
            'permissions' => [
                'manage_production_data',
                'approve_supervisor_requests',
                'view_productivity_reports',
                'manage_quality_control'
            ],
            'dashboard_modules' => [
                'reports', 'quality-control'
            ]
        ],
        'staf_hrd' => [
            'id' => 8,
            'name' => 'Staf HRD',
            'description' => 'Akses operasional HR. Dapat mengelola data pribadi, absensi, tapi terbatas pada data sensitif seperti gaji.',
            'route' => 'manajer-hrd',
            'permissions' => [
                'manage_employee_data',
                'manage_attendance',
                'view_basic_reports'
            ],
            'dashboard_modules' => [
                'employees', 'attendance'
            ]
        ],
        'staf_keuangan' => [
            'id' => 9,
            'name' => 'Staf Keuangan',
            'description' => 'Akses operasional keuangan. Dapat memproses data gaji dan klaim.',
            'route' => 'manajer-keuangan',
            'permissions' => [
                'process_payroll_data',
                'process_claims',
                'view_basic_financial_data'
            ],
            'dashboard_modules' => [
                'invoices', 'expenses', 'payroll'
            ]
        ],
        'staf_ppic' => [
            'id' => 10,
            'name' => 'Staf PPIC',
            'description' => 'Akses operasional untuk input dan lihat data PPIC.',
            'route' => 'manajer-ppic',
            'permissions' => [
                'input_ppic_data',
                'view_ppic_data'
            ],
            'dashboard_modules' => [
                'inventory', 'planning', 'production'
            ]
        ],
        'staf_marketing' => [
            'id' => 11,
            'name' => 'Staf Marketing',
            'description' => 'Akses operasional untuk input data penjualan dan kampanye.',
            'route' => 'manajer-marketing',
            'permissions' => [
                'input_sales_data',
                'input_campaign_data'
            ],
            'dashboard_modules' => [
                'crm', 'campaigns'
            ]
        ],
        'supervisor' => [
            'id' => 12,
            'name' => 'Supervisor',
            'description' => 'Peran untuk Supervisor Lini (Kayu/Besi). Dapat menyetujui izin/lembur crew, menginput data hasil produksi, dan melihat data timnya.',
            'route' => 'supervisor',
            'permissions' => [
                'approve_crew_requests',
                'input_production_results',
                'view_team_data',
                'manage_team_schedule'
            ],
            'dashboard_modules' => [
                'team_management', 'production_input', 'approvals'
            ]
        ],
        'qc_produksi' => [
            'id' => 13,
            'name' => 'QC Produksi',
            'description' => 'Akses untuk memastikan bahwa produk yang dihasilkan memenuhi standar kualitas yang telah ditetapkan sebelum sampai ke tangan pelanggan.',
            'route' => 'qc-produksi',
            'permissions' => [
                'quality_inspection',
                'quality_reporting',
                'quality_approval'
            ],
            'dashboard_modules' => [
                'quality_control', 'inspection_reports'
            ]
        ],
        'admin_produksi' => [
            'id' => 14,
            'name' => 'Admin Produksi',
            'description' => 'Akses untuk input data operasional produksi seperti kehadiran dan hasil kerja, namun tidak memiliki hak persetujuan.',
            'route' => 'manajer-produksi', // redirect ke manajer produksi
            'permissions' => [
                'input_production_data',
                'input_attendance_data',
                'view_production_reports'
            ],
            'dashboard_modules' => [
                'data_input', 'reports'
            ]
        ],
        'crew' => [
            'id' => 15,
            'name' => 'Crew',
            'description' => 'Peran dasar untuk semua pelaksana produksi (Fabrikasi, Amplas, Finishing). Hanya dapat melihat data pribadi dan mengajukan izin/cuti.',
            'route' => 'under-development',
            'permissions' => [
                'view_personal_data',
                'request_leave',
                'request_overtime'
            ],
            'dashboard_modules' => []
        ],
        'software_engineer' => [
            'id' => 17,
            'name' => 'Software Engineer',
            'description' => 'Mengelola sistem IT, database, dan pengembangan aplikasi perusahaan.',
            'route' => 'software-engineer',
            'permissions' => [
                'manage_system',
                'manage_database',
                'develop_applications',
                'system_maintenance'
            ],
            'dashboard_modules' => [
                'system_monitoring', 'development', 'maintenance'
            ]
        ],
        'manajer_produksi_kayu' => [
            'id' => 18,
            'name' => 'Manajer Produksi Kayu',
            'description' => 'Mengelola produksi khusus lini kayu. Menyetujui pengajuan dari Supervisor Kayu dan melihat laporan produktivitas kayu.',
            'route' => 'produksi-kayu',
            'permissions' => [
                'manage_wood_production',
                'approve_wood_supervisor_requests',
                'view_wood_productivity_reports',
                'manage_wood_quality_control'
            ],
            'dashboard_modules' => [
                'wood_reports', 'wood_quality_control', 'wood_planning'
            ]
        ],
        'manajer_produksi_besi' => [
            'id' => 19,
            'name' => 'Manajer Produksi Besi',
            'description' => 'Mengelola produksi khusus lini besi. Menyetujui pengajuan dari Supervisor Besi dan melihat laporan produktivitas besi.',
            'route' => 'produksi-besi',
            'permissions' => [
                'manage_metal_production',
                'approve_metal_supervisor_requests',
                'view_metal_productivity_reports',
                'manage_metal_quality_control'
            ],
            'dashboard_modules' => [
                'metal_reports', 'metal_quality_control', 'metal_planning'
            ]
        ],
        'supervisor_kayu' => [
            'id' => 20,
            'name' => 'Supervisor Kayu',
            'description' => 'Supervisor khusus lini kayu. Dapat menyetujui izin/lembur crew kayu, menginput data hasil produksi kayu.',
            'route' => 'supervisor-kayu',
            'permissions' => [
                'approve_wood_crew_requests',
                'input_wood_production_results',
                'view_wood_team_data',
                'manage_wood_team_schedule'
            ],
            'dashboard_modules' => [
                'wood_team_management', 'wood_production_input', 'wood_approvals'
            ]
        ],
        'supervisor_besi' => [
            'id' => 21,
            'name' => 'Supervisor Besi',
            'description' => 'Supervisor khusus lini besi. Dapat menyetujui izin/lembur crew besi, menginput data hasil produksi besi.',
            'route' => 'supervisor-besi',
            'permissions' => [
                'approve_metal_crew_requests',
                'input_metal_production_results',
                'view_metal_team_data',
                'manage_metal_team_schedule'
            ],
            'dashboard_modules' => [
                'metal_team_management', 'metal_production_input', 'metal_approvals'
            ]
        ],
        'qc_kayu' => [
            'id' => 22,
            'name' => 'QC Kayu',
            'description' => 'Quality Control khusus produk kayu. Memastikan kualitas produk kayu sesuai standar.',
            'route' => 'qc-kayu',
            'permissions' => [
                'wood_quality_inspection',
                'wood_quality_reporting',
                'wood_quality_approval'
            ],
            'dashboard_modules' => [
                'wood_quality_control', 'wood_inspection_reports'
            ]
        ],
        'qc_besi' => [
            'id' => 23,
            'name' => 'QC Besi',
            'description' => 'Quality Control khusus produk besi. Memastikan kualitas produk besi sesuai standar.',
            'route' => 'qc-besi',
            'permissions' => [
                'metal_quality_inspection',
                'metal_quality_reporting',
                'metal_quality_approval'
            ],
            'dashboard_modules' => [
                'metal_quality_control', 'metal_inspection_reports'
            ]
        ],
        'crew_kayu' => [
            'id' => 24,
            'name' => 'Crew Kayu',
            'description' => 'Crew khusus lini kayu (Fabrikasi, Amplas, Finishing Kayu). Dapat melihat data pribadi dan mengajukan izin/cuti.',
            'route' => 'crew-kayu',
            'permissions' => [
                'view_personal_data',
                'request_leave',
                'request_overtime',
                'view_wood_schedule'
            ],
            'dashboard_modules' => [
                'wood_schedule', 'personal_data', 'wood_requests'
            ]
        ],
        'crew_besi' => [
            'id' => 25,
            'name' => 'Crew Besi',
            'description' => 'Crew khusus lini besi (Produksi Besi, Finishing Besi). Dapat melihat data pribadi dan mengajukan izin/cuti.',
            'route' => 'crew-besi',
            'permissions' => [
                'view_personal_data',
                'request_leave',
                'request_overtime',
                'view_metal_schedule'
            ],
            'dashboard_modules' => [
                'metal_schedule', 'personal_data', 'metal_requests'
            ]
        ]
    ],

    'departments' => [
        1 => 'Direksi',
        2 => 'Human Resources',
        3 => 'Keuangan',
        4 => 'Operasional',
        5 => 'Produksi',
        6 => 'PPIC',
        7 => 'Marketing',
        8 => 'Teknologi & Informasi'
    ],

    'work_sections' => [
        1 => 'Lini Produksi Kayu',
        2 => 'Lini Produksi Besi',
        3 => 'Produksi Kayu',
        4 => 'Amplas',
        5 => 'Finishing Kayu',
        6 => 'Service Kayu',
        7 => 'Produksi Besi',
        8 => 'Finishing Besi'
    ]
];