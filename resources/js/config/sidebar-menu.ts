import {
  LayoutGrid,
  Settings,
  Package,
  BarChart2,
  ClipboardList,
  Search,
  Folder,
  TrendingUp,
  User,
  Calendar,
  FileText,
  DollarSign,
  Users,
  Target,
  CheckCircle,
  AlertTriangle,
  Briefcase,
  CreditCard,
  Mail,
  Share2,
  Database,
  Code,
  Monitor,
  Bell,
  Clock,
  LayoutDashboard,
  UserCircle2,
  CalendarDays,
  FilePlus2,
  Wallet,
  ShoppingCart,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href?: string;
  icon: any;
  children?: NavItem[];
}

export function getMenuItems(role: string): NavItem[] {
  const roleMenus: Record<string, NavItem[]> = {
    // Direktur
    direktur: [
      {
        title: 'Dashboard',
        href: '/roles/direktur',
        icon: LayoutGrid,
      },
      {
        title: 'Meeting Management',
        href: '/roles/direktur/meeting-management',
        icon: Calendar,
      },
      {
        title: 'Pesanan & Notifikasi',
        href: '/roles/direktur/pesanan-notifications',
        icon: Bell,
      },
      {
        title: 'Laporan Strategis',
        icon: BarChart2,
        children: [
          {
            title: 'Integrasi Departemen',
            href: '/roles/direktur/laporan/integrasi-departemen',
            icon: Users,
          },
          {
            title: 'Laporan Produksi Total',
            href: '/roles/direktur/laporan/produksi',
            icon: Package,
          },
          {
            title: 'Laporan Keuangan',
            href: '/roles/direktur/laporan/keuangan',
            icon: DollarSign,
          },
          {
            title: 'Laporan Penjualan',
            href: '/roles/direktur/laporan/penjualan',
            icon: TrendingUp,
          },
          {
            title: 'Analitik Bisnis',
            href: '/roles/direktur/analitik',
            icon: BarChart2,
          },
        ],
      },
      {
        title: 'Persetujuan Final',
        icon: CheckCircle,
        children: [
          {
            title: 'Persetujuan Anggaran',
            href: '/roles/direktur/persetujuan/anggaran',
            icon: DollarSign,
          },
          {
            title: 'Persetujuan Proyek',
            href: '/roles/direktur/persetujuan/proyek',
            icon: Briefcase,
          },
        ],
      },
      {
        title: 'Administrasi Pribadi',
        icon: User,
        children: [
          {
            title: 'Profil',
            href: '/roles/direktur/profil',
            icon: User,
          },
          {
            title: 'Jadwal',
            href: '/roles/direktur/jadwal',
            icon: Calendar,
          },
          {
            title: 'Pengajuan Cuti',
            href: '/roles/direktur/cuti',
            icon: FileText,
          },
          {
            title: 'Slip Gaji',
            href: '/roles/direktur/slip-gaji',
            icon: CreditCard,
          },
          {
            title: 'Kelola Rekening',
            href: '/roles/direktur/rekening',
            icon: CreditCard,
          },
        ],
      },
    ],

    // Manajer HRD
    manajer_hrd: [
      {
        title: 'Dashboard',
        href: '/roles/manajer-hrd',
        icon: LayoutGrid,
      },
      {
        title: 'Data Karyawan',
        icon: Users,
        children: [
          {
            title: 'Daftar Karyawan',
            href: '/roles/manajer-hrd/karyawan/daftar',
            icon: Users,
          },
          {
            title: 'Demografi',
            href: '/roles/manajer-hrd/karyawan/demografi',
            icon: BarChart2,
          },
          {
            title: 'Kontrak & Status Kerja',
            href: '/roles/manajer-hrd/karyawan/kontrak',
            icon: Briefcase,
          },
          {
            title: 'Laporan KPI',
            href: '/roles/manajer-hrd/karyawan/laporan-kpi',
            icon: Target,
          },
        ],
      },
      {
        title: 'Manajemen Presensi',
        icon: Calendar,
        children: [
          {
            title: 'Presensi',
            href: '/roles/manajer-hrd/manajemen-presensi/presensi',
            icon: Clock,
          },
          {
            title: 'Pengajuan Izin & Lembur',
            href: '/roles/manajer-hrd/manajemen-presensi/pengajuan',
            icon: FileText,
          },
          {
            title: 'Pengaturan Jadwal',
            href: '/roles/manajer-hrd/manajemen-presensi/jadwal',
            icon: Calendar,
          },
        ],
      },
      {
        title: 'Manajemen Penggajian',
        icon: DollarSign,
        children: [
          {
            title: 'Proses Penggajian',
            href: '/roles/manajer-hrd/penggajian/proses',
            icon: Settings,
          },
          {
            title: 'Riwayat Penggajian',
            href: '/roles/manajer-hrd/penggajian/riwayat',
            icon: FileText,
          },
          {
            title: 'Pengaturan Penggajian',
            href: '/roles/manajer-hrd/penggajian/pengaturan',
            icon: Settings,
          },
        ],
      },
      {
        title: 'Administrasi Perusahaan',
        icon: ClipboardList,
        children: [
          {
            title: 'Surat Keputusan (SK)',
            href: '/roles/manajer-hrd/administrasi/sk',
            icon: FileText,
          },
          {
            title: 'Dokumen & Arsip Digital',
            href: '/roles/manajer-hrd/administrasi/dokumen',
            icon: Folder,
          },
          {
            title: 'Peraturan & SOP',
            href: '/roles/manajer-hrd/administrasi/sop',
            icon: Settings,
          },
            {
            title: 'Profil Perusahaan',
            href: '/roles/manajer-hrd/administrasi/profil-perusahaan',
            icon: Briefcase,
          },
        ],
      },
      {
        title: 'Laporan HRD',
        icon: BarChart2,
        children: [
          {
            title: 'Laporan Kehadiran',
            href: '/roles/manajer-hrd/laporan/kehadiran',
            icon: Calendar,
          },
          {
            title: 'Laporan Turnover',
            href: '/roles/manajer-hrd/laporan/turnover',
            icon: TrendingUp,
          },
          {
            title: 'Laporan Penggajian',
            href: '/roles/manajer-hrd/laporan/penggajian',
            icon: DollarSign,
          },
          {
            title: 'Laporan ke Direksi',
            href: '/roles/manajer-hrd/laporan/direksi',
            icon: FileText,
          },
        ],
      },
      {
        title: 'Pengumuman',
        icon: Bell,
        children: [
          {
            title: 'Buat Pengumuman',
            href: '/roles/manajer-hrd/pengumuman/buat',
            icon: FilePlus2,
          },
          {
            title: 'Riwayat Pengumuman',
            href: '/roles/manajer-hrd/pengumuman/riwayat',
            icon: ClipboardList,
          },
        ],
      },
      {
        title: 'Administrasi Pribadi',
        icon: User,
        children: [
          {
            title: 'Profil',
            href: '/roles/manajer-hrd/administrasi-pribadi/profil',
            icon: User,
          },
          {
            title: 'Jadwal',
            href: '/roles/manajer-hrd/administrasi-pribadi/jadwal',
            icon: Calendar,
          },
          {
            title: 'Pengajuan Cuti',
            href: '/roles/manajer-hrd/administrasi-pribadi/pengajuan-cuti',
            icon: FileText,
          },
          {
            title: 'Slip Gaji',
            href: '/roles/manajer-hrd/administrasi-pribadi/slip-gaji',
            icon: CreditCard,
          },
          {
            title: 'Kelola Rekening',
            href: '/roles/manajer-hrd/administrasi-pribadi/kelola-rekening',
            icon: CreditCard,
          },
        ],
      },
    ],

    // Staf HRD
    staf_hrd: [
      {
        title: 'Dashboard',
        href: '/roles/staf-hrd',
        icon: LayoutGrid,
      },
      {
        title: 'Data Karyawan',
        icon: Users,
        children: [
          {
            title: 'Daftar Karyawan',
            href: '/roles/staf-hrd/karyawan/daftar',
            icon: Users,
          },
          {
            title: 'Absensi & Kehadiran',
            href: '/roles/staf-hrd/karyawan/absensi',
            icon: Calendar,
          },
          {
            title: 'Penggajian Crew',
            href: '/roles/staf-hrd/karyawan/penggajian',
            icon: DollarSign,
          },
        ],
      },
      {
        title: 'Administrasi Perusahaan',
        icon: ClipboardList,
        children: [
          {
            title: 'Dokumen & Arsip Digital',
            href: '/roles/staf-hrd/administrasi/dokumen',
            icon: Folder,
          },
        ],
      },
      {
        title: 'Administrasi Pribadi',
        icon: User,
        children: [
          {
            title: 'Profil',
            href: '/roles/staf-hrd/administrasi-pribadi/profil',
            icon: User,
          },
          {
            title: 'Jadwal',
            href: '/roles/staf-hrd/administrasi-pribadi/jadwal',
            icon: Calendar,
          },
          {
            title: 'Pengajuan Cuti',
            href: '/roles/staf-hrd/administrasi-pribadi/cuti',
            icon: FileText,
          },
          {
            title: 'Slip Gaji',
            href: '/roles/staf-hrd/administrasi-pribadi/slip-gaji',
            icon: CreditCard,
          },
          {
            title: 'Kelola Rekening',
            href: '/roles/staf-hrd/administrasi-pribadi/rekening',
            icon: CreditCard,
          },
        ],
      },
    ],

    // Manajer Keuangan
    manajer_keuangan: [
      {
        title: 'Dashboard',
        href: '/roles/manajer-keuangan',
        icon: LayoutGrid,
      },
      {
        title: 'Manajemen Keuangan Produk',
        icon: ShoppingCart,
        children: [
          {
            title: 'Transaksi Penjualan',
            href: '/roles/manajer-keuangan/keuangan-produk/transaksi',
            icon: ClipboardList,
          },
          {
            title: 'Pembelian Bahan Baku',
            href: '/roles/manajer-keuangan/keuangan-produk/pembelian',
            icon: Package,
          },
          {
            title: 'Pengelolaan Persediaan & HPP',
            href: '/roles/manajer-keuangan/keuangan-produk/persediaan',
            icon: ClipboardList,
          },
          {
            title: 'Penyesuaian Harga & Margin Laba',
            href: '/roles/manajer-keuangan/keuangan-produk/harga',
            icon: TrendingUp,
          },
        ],
      },
      {
        title: 'Keuangan Harian',
        icon: DollarSign,
        children: [
          {
            title: 'Pemasukan',
            href: '/roles/manajer-keuangan/harian/pemasukan',
            icon: TrendingUp,
          },
          {
            title: 'Pengeluaran',
            href: '/roles/manajer-keuangan/harian/pengeluaran',
            icon: DollarSign,
          },
          {
            title: 'Sumber Dana',
            href: '/roles/manajer-keuangan/harian/sumber-dana',
            icon: CreditCard,
          },
        ],
      },
      {
        title: 'Penggajian (Payroll)',
        icon: Wallet,
        children: [
          {
            title: 'Persetujuan Penggajian',
            href: '/roles/manajer-keuangan/payroll/approval',
            icon: CheckCircle,
          },
          {
            title: 'Riwayat & Data Penggajian',
            href: '/roles/manajer-keuangan/payroll/history-data',
            icon: FileText,
          },
        ],
      },
      {
        title: 'Anggaran (Budgeting)',
        icon: Target,
        children: [
          {
            title: 'Rencana Anggaran',
            href: '/roles/manajer-keuangan/budget/rencana',
            icon: Target,
          },
          {
            title: 'Realisasi Anggaran',
            href: '/roles/manajer-keuangan/budget/realisasi',
            icon: BarChart2,
          },
          {
            title: 'Monitoring Budget',
            href: '/roles/manajer-keuangan/budget/monitoring',
            icon: TrendingUp,
          },
        ],
      },
      {
        title: 'Laporan Keuangan',
        icon: BarChart2,
        children: [
          {
            title: 'Laporan Bulanan',
            href: '/roles/manajer-keuangan/laporan/bulanan',
            icon: Calendar,
          },
          {
            title: 'Laporan Tahunan',
            href: '/roles/manajer-keuangan/laporan/tahunan',
            icon: FileText,
          },
          {
            title: 'Neraca & Arus Kas',
            href: '/roles/manajer-keuangan/laporan/neraca',
            icon: BarChart2,
          },
          {
            title: 'Laporan ke Direksi',
            href: '/roles/manajer-keuangan/laporan/direksi',
            icon: FileText,
          },
        ],
      },
      {
        title: 'Pengaturan',
        icon: Settings,
        children: [
          {
            title: 'Kode Akun & Chart of Account',
            href: '/roles/manajer-keuangan/pengaturan/chart-account',
            icon: Settings,
          },
          {
            title: 'User Role (keuangan)',
            href: '/roles/manajer-keuangan/pengaturan/user-role',
            icon: Users,
          },
        ],
      }
    ],

    // Staf Keuangan
    staf_keuangan: [
      {
        title: 'Dashboard',
        href: '/roles/staf-keuangan',
        icon: LayoutGrid,
      },
      {
        title: 'Keuangan Harian',
        icon: DollarSign,
        children: [
          {
            title: 'Pemasukan',
            href: '/roles/staf-keuangan/harian/pemasukan',
            icon: TrendingUp,
          },
          {
            title: 'Pengeluaran',
            href: '/roles/staf-keuangan/harian/pengeluaran',
            icon: DollarSign,
          },
        ],
      },
      {
        title: 'Penggajian (Payroll)',
        icon: Users,
        children: [
          {
            title: 'Data Gaji Karyawan',
            href: '/roles/staf-keuangan/payroll/data-gaji',
            icon: DollarSign,
          },
        ],
      },
    ],

    // Manajer Marketing
    manajer_marketing: [
      {
        title: 'Dashboard Marketing',
        href: '/roles/marketing',
        icon: LayoutGrid,
      },
      {
        title: 'Manajemen Pelanggan (CRM)',
        href: '/roles/manajer-marketing/crm',
        icon: Users,
      },
      {
        title: 'Kampanye Pemasaran',
        icon: Share2,
        children: [
          {
            title: 'Email Marketing',
            href: '/roles/marketing/kampanye/email',
            icon: Mail,
          },
          {
            title: 'Media Sosial',
            href: '/roles/marketing/kampanye/sosial',
            icon: Share2,
          },
        ],
      },
      {
        title: 'Analitik & Laporan',
        href: '/roles/marketing/analitik',
        icon: BarChart2,
      },
      {
        title: 'Laporan ke Direksi',
        href: '/roles/marketing/laporan/direksi',
        icon: FileText,
      },
      {
        title: 'Administrasi Pribadi',
        icon: User,
        children: [
          {
            title: 'Profil',
            href: '/roles/marketing/profil',
            icon: User,
          },
          {
            title: 'Jadwal',
            href: '/roles/marketing/jadwal',
            icon: Calendar,
          },
          {
            title: 'Pengajuan Cuti',
            href: '/roles/marketing/cuti',
            icon: FileText,
          },
          {
            title: 'Slip Gaji',
            href: '/roles/marketing/slip-gaji',
            icon: CreditCard,
          },
          {
            title: 'Kelola Rekening',
            href: '/roles/marketing/rekening',
            icon: CreditCard,
          },
        ],
      },
    ],

    // Staf Marketing
    staf_marketing: [
      {
        title: 'Dashboard Marketing',
        href: '/roles/marketing',
        icon: LayoutGrid,
      },
      {
        title: 'Manajemen Pelanggan (CRM)',
        href: '/roles/marketing/crm',
        icon: Users,
      },
      {
        title: 'Eksekusi Kampanye',
        href: '/roles/marketing/eksekusi-kampanye',
        icon: Share2,
      },
      {
        title: 'Administrasi Pribadi',
        icon: User,
        children: [
          {
            title: 'Profil',
            href: '/roles/marketing/profil',
            icon: User,
          },
          {
            title: 'Jadwal',
            href: '/roles/marketing/jadwal',
            icon: Calendar,
          },
          {
            title: 'Pengajuan Cuti',
            href: '/roles/marketing/cuti',
            icon: FileText,
          },
          {
            title: 'Slip Gaji',
            href: '/roles/marketing/slip-gaji',
            icon: CreditCard,
          },
          {
            title: 'Kelola Rekening',
            href: '/roles/marketing/rekening',
            icon: CreditCard,
          },
        ],
      },
    ],

    // Manajer PPIC
    manajer_ppic: [
      {
        title: 'Dashboard',
        href: '/roles/manajer-ppic',
        icon: LayoutGrid,
      },
      {
        title: 'Perencanaan Produksi',
        icon: Target,
        children: [
          {
            title: 'Antrean Pesanan Masuk',
            href: '/roles/manajer-ppic/perencanaan/pesanan',
            icon: ClipboardList,
          },
          {
            title: 'Jadwal Induk Produksi',
            href: '/roles/manajer-ppic/perencanaan/jadwal-induk-produksi',
            icon: Calendar,
          },
          {
            title: 'Simulasi Jadwal',
            href: '/roles/manajer-ppic/perencanaan/simulasi',
            icon: Target,
          },
        ],
      },
      {
        title: 'Manajemen Inventaris',
        icon: Package,
        children: [
          {
            title: 'Stok Bahan Baku',
            href: '/roles/manajer-ppic/inventaris/stok',
            icon: Package,
          },
          {
            title: 'Kebutuhan Material (MRP)',
            href: '/roles/manajer-ppic/inventaris/mrp',
            icon: ClipboardList,
          },
          {
            title: 'Permintaan Pembelian',
            href: '/roles/manajer-ppic/inventaris/pembelian',
            icon: FileText,
          },
        ],
      },
      {
        title: 'Monitoring & Laporan',
        icon: BarChart2,
        children: [
          {
            title: 'Status Jadwal Produksi',
            href: '/roles/manajer-ppic/monitoring/status',
            icon: TrendingUp,
          },
          {
            title: 'Analisis Kapasitas',
            href: '/roles/manajer-ppic/monitoring/kapasitas',
            icon: BarChart2,
          },
          {
            title: 'Laporan ke Direksi',
            href: '/roles/manajer-ppic/monitoring/laporan-direksi',
            icon: FileText,
          },
        ],
      },
      {
        title: 'Administrasi Pribadi',
        icon: User,
        children: [
          {
            title: 'Profil',
            href: '/roles/manajer-ppic/administrasi/profil',
            icon: User,
          },
          {
            title: 'Jadwal',
            href: '/roles/manajer-ppic/administrasi/jadwal',
            icon: Calendar,
          },
          {
            title: 'Pengajuan Cuti',
            href: '/roles/manajer-ppic/administrasi/cuti',
            icon: FileText,
          },
          {
            title: 'Slip Gaji',
            href: '/roles/manajer-ppic/administrasi/slip-gaji',
            icon: CreditCard,
          },
          {
            title: 'Kelola Rekening',
            href: '/roles/manajer-ppic/administrasi/rekening',
            icon: CreditCard,
          },
        ],
      },
    ],

    // Staf PPIC
    staf_ppic: [
      {
        title: 'Dashboard',
        href: '/roles/staf-ppic',
        icon: LayoutGrid,
      },
      {
        title: 'Perencanaan Produksi',
        icon: Target,
        children: [
          {
            title: 'Antrean Pesanan Masuk',
            href: '/roles/staf-ppic/perencanaan/pesanan',
            icon: ClipboardList,
          },
          {
            title: 'Jadwal Induk Produksi',
            href: '/roles/staf-ppic/perencanaan/jadwal-induk-produksi',
            icon: Calendar,
          },
          {
            title: 'Simulasi Jadwal',
            href: '/roles/staf-ppic/perencanaan/simulasi',
            icon: Target,
          },
        ],
      },
      {
        title: 'Manajemen Inventaris',
        icon: Package,
        children: [
          {
            title: 'Stok Bahan Baku',
            href: '/roles/staf-ppic/inventaris/stok',
            icon: Package,
          },
          {
            title: 'Kebutuhan Material (MRP)',
            href: '/roles/staf-ppic/inventaris/mrp',
            icon: ClipboardList,
          },
          {
            title: 'Permintaan Pembelian',
            href: '/roles/staf-ppic/inventaris/pembelian',
            icon: FileText,
          },
        ],
      },
      {
        title: 'Monitoring & Laporan',
        icon: BarChart2,
        children: [
          {
            title: 'Status Jadwal Produksi',
            href: '/roles/staf-ppic/monitoring/status',
            icon: TrendingUp,
          },
          {
            title: 'Analisis Kapasitas',
            href: '/roles/staf-ppic/monitoring/kapasitas',
            icon: BarChart2,
          },
        ],
      },
      {
        title: 'Administrasi Pribadi',
        icon: User,
        children: [
          {
            title: 'Profil',
            href: '/roles/staf-ppic/administrasi/profil',
            icon: User,
          },
          {
            title: 'Jadwal',
            href: '/roles/staf-ppic/administrasi/jadwal',
            icon: Calendar,
          },
          {
            title: 'Pengajuan Cuti',
            href: '/roles/staf-ppic/administrasi/cuti',
            icon: FileText,
          },
          {
            title: 'Slip Gaji',
            href: '/roles/staf-ppic/administrasi/slip-gaji',
            icon: CreditCard,
          },
          {
            title: 'Kelola Rekening',
            href: '/roles/staf-ppic/administrasi/rekening',
            icon: CreditCard,
          },
        ],
      },
    ],
    // Manajer Produksi Besi
    manajer_produksi_besi: [
      {
        title: 'Dashboard',
        href: '/roles/manajer-produksi-besi',
        icon: LayoutGrid,
      },
      {
        title: 'Manajemen Produksi',
        icon: ClipboardList,
        children: [
          {
            title: 'Perintah Kerja dari PPIC',
            href: '/roles/manajer-produksi-besi/manajemen-produksi/perintah-kerja',
            icon: ClipboardList,
          },
          {
            title: 'Alokasi Tugas Operator',
            href: '/roles/manajer-produksi-besi/manajemen-produksi/alokasi-tugas',
            icon: Users,
          },
          {
            title: 'Monitoring Progres Lapangan',
            href: '/roles/manajer-produksi-besi/manajemen-produksi/monitoring-progres',
            icon: TrendingUp,
          },
          {
            title: 'Permintaan Pengerjaan Ulang (Rework)',
            href: '/roles/manajer-produksi-besi/manajemen-produksi/pengerjaan-ulang',
            icon: Settings,
          },
        ],
      },
      {
        title: 'Laporan',
        icon: FileText,
        children: [
          {
            title: 'Laporan Output Harian',
            href: '/roles/manajer-produksi-besi/laporan/output-harian',
            icon: BarChart2,
          },
          {
            title: 'Laporan Analisis Kualitas',
            href: '/roles/manajer-produksi-besi/laporan/analisis-kualitas',
            icon: Search,
          },
          {
            title: 'Laporan Kinerja Crew',
            href: '/roles/manajer-produksi-besi/laporan/kinerja-crew',
            icon: TrendingUp,
          },
          {
            title: 'Laporan ke Direksi',
            href: '/roles/manajer-produksi-besi/laporan/direksi',
            icon: FileText,
          },
        ],
      },
      {
        title: 'Administrasi Pribadi',
        icon: User,
        children: [
          {
            title: 'Profil',
            href: '/roles/manajer-produksi-besi/administrasi-pribadi/profil',
            icon: User,
          },
          {
            title: 'Jadwal',
            href: '/roles/manajer-produksi-besi/administrasi-pribadi/jadwal',
            icon: Calendar,
          },
          {
            title: 'Pengajuan Cuti',
            href: '/roles/manajer-produksi-besi/administrasi-pribadi/cuti',
            icon: FileText,
          },
          {
            title: 'Slip Gaji',
            href: '/roles/manajer-produksi-besi/administrasi-pribadi/slip-gaji',
            icon: CreditCard,
          },
          {
            title: 'Kelola Rekening',
            href: '/roles/manajer-produksi-besi/administrasi-pribadi/rekening',
            icon: CreditCard,
          },
        ],
      },
    ],

    // Staf Produksi Besi
    staf_produksi_besi: [
      {
        title: 'Dashboard',
        href: '/roles/staf-produksi-besi',
        icon: LayoutGrid,
      },
      {
        title: 'Tugas Produksi',
        icon: ClipboardList,
        children: [
          {
            title: 'Daftar Tugas Harian',
            href: '/roles/staf-produksi-besi/tugas/daftar-tugas',
            icon: ClipboardList,
          },
          {
            title: 'Instruksi Kerja',
            href: '/roles/staf-produksi-besi/tugas/instruksi-kerja',
            icon: FileText,
          },
          {
            title: 'Lapor Progres',
            href: '/roles/staf-produksi-besi/tugas/lapor-progres',
            icon: TrendingUp,
          },
        ],
      },
      {
        title: 'Kualitas',
        icon: Search,
        children: [
          {
            title: 'Checklist QC',
            href: '/roles/staf-produksi-besi/kualitas/checklist-qc',
            icon: CheckCircle,
          },
          {
            title: 'Lapor Kendala',
            href: '/roles/staf-produksi-besi/kualitas/lapor-kendala',
            icon: AlertTriangle,
          },
        ],
      },
      {
        title: 'Administrasi Pribadi',
        icon: User,
        children: [
          {
            title: 'Profil',
            href: '/roles/staf-produksi-besi/administrasi-pribadi/profil',
            icon: User,
          },
          {
            title: 'Jadwal',
            href: '/roles/staf-produksi-besi/administrasi-pribadi/jadwal',
            icon: Calendar,
          },
          {
            title: 'Pengajuan Cuti',
            href: '/roles/staf-produksi-besi/administrasi-pribadi/cuti',
            icon: FileText,
          },
          {
            title: 'Slip Gaji',
            href: '/roles/staf-produksi-besi/administrasi-pribadi/slip-gaji',
            icon: CreditCard,
          },
          {
            title: 'Kelola Rekening',
            href: '/roles/staf-produksi-besi/administrasi-pribadi/rekening',
            icon: CreditCard,
          },
        ],
      },
    ],

    // Supervisor Besi
    supervisor_besi: [
      {
        title: 'Dashboard',
        href: '/roles/supervisor-besi',
        icon: LayoutGrid,
      },
      {
        title: 'Tugas Saya',
        icon: ClipboardList,
        children: [
          {
            title: 'Daftar Tugas Produksi',
            href: '/roles/supervisor-besi/tugas-saya/daftar-tugas',
            icon: ClipboardList,
          },
          {
            title: 'Instruksi Kerja',
            href: '/roles/supervisor-besi/tugas-saya/instruksi-kerja',
            icon: FileText,
          },
          {
            title: 'Lapor Progres Fabrikasi',
            href: '/roles/supervisor-besi/tugas-saya/lapor-progres',
            icon: TrendingUp,
          },
          {
            title: 'Lapor Kendala',
            href: '/roles/supervisor-besi/tugas-saya/lapor-kendala',
            icon: AlertTriangle,
          },
        ],
      },
      {
        title: 'Umpan Balik Kualitas',
        icon: TrendingUp,
        children: [
          {
            title: 'Status & Catatan QC',
            href: '/roles/supervisor-besi/kualitas/status-catatan-qc',
            icon: Search,
          },
          {
            title: 'Antrean Pengerjaan Ulang (Rework)',
            href: '/roles/supervisor-besi/kualitas/antrean-rework',
            icon: ClipboardList,
          },
        ],
      },
      {
        title: 'Kinerja (KPI)',
        icon: BarChart2,
        children: [
          {
            title: 'Penilaian Crew',
            href: '/roles/supervisor-besi/kinerja/penilaian-crew',
            icon: User,
          },
          {
            title: 'Riwayat Penilaian',
            href: '/roles/supervisor-besi/kinerja/riwayat-penilaian',
            icon: FileText,
          },
        ],
      },
      {
        title: 'Administrasi Pribadi',
        icon: User,
        children: [
          {
            title: 'Profil',
            href: '/roles/supervisor-besi/profil',
            icon: User,
          },
          {
            title: 'Jadwal',
            href: '/roles/supervisor-besi/jadwal',
            icon: Calendar,
          },
          {
            title: 'Pengajuan Cuti',
            href: '/roles/supervisor-besi/cuti',
            icon: FileText,
          },
          {
            title: 'Slip Gaji',
            href: '/roles/supervisor-besi/slip-gaji',
            icon: CreditCard,
          },
          {
            title: 'Kelola Rekening',
            href: '/roles/supervisor-besi/rekening',
            icon: CreditCard,
          },
        ],
      },
    ],

    // QC Besi
    qc_besi: [
      {
        title: 'Dashboard',
        href: '/roles/qc-besi',
        icon: LayoutGrid,
      },
      {
        title: 'Inspeksi QC',
        icon: Search,
        children: [
          {
            title: 'Antrean Inspeksi',
            href: '/roles/qc-besi/inspeksi/antrean-inspeksi',
            icon: ClipboardList,
          },
          {
            title: 'Detail Produksi Item',
            href: '/roles/qc-besi/inspeksi/detail-produksi',
            icon: Package,
          },
          {
            title: 'Formulir Laporan QC',
            href: '/roles/qc-besi/inspeksi/formulir-laporan',
            icon: FileText,
          },
        ],
      },
      {
        title: 'Dokumen & Laporan',
        icon: Folder,
        children: [
          {
            title: 'Standar Kualitas Produk',
            href: '/roles/qc-besi/dokumen/standar-kualitas',
            icon: FileText,
          },
          {
            title: 'Riwayat Inspeksi',
            href: '/roles/qc-besi/dokumen/riwayat-inspeksi',
            icon: ClipboardList,
          },
          {
            title: 'Analisis Reject',
            href: '/roles/qc-besi/dokumen/analisis-reject',
            icon: BarChart2,
          },
        ],
      },
      {
        title: 'Administrasi Pribadi',
        icon: User,
        children: [
          {
            title: 'Profil',
            href: '/roles/qc-besi/profil',
            icon: User,
          },
          {
            title: 'Jadwal',
            href: '/roles/qc-besi/jadwal',
            icon: Calendar,
          },
          {
            title: 'Pengajuan Cuti',
            href: '/roles/qc-besi/cuti',
            icon: FileText,
          },
          {
            title: 'Slip Gaji',
            href: '/roles/qc-besi/slip-gaji',
            icon: CreditCard,
          },
          {
            title: 'Kelola Rekening',
            href: '/roles/qc-besi/rekening',
            icon: CreditCard,
          },
        ],
      },
    ],

    // Manajer Produksi Kayu
    manajer_produksi_kayu: [
      {
        title: 'Dashboard',
        href: '/roles/manajer-produksi-kayu',
        icon: LayoutGrid,
      },
      {
        title: 'Manajemen Produksi',
        icon: ClipboardList,
        children: [
          {
            title: 'Perintah Kerja dari PPIC',
            href: '/roles/manajer-produksi-kayu/manajemen-produksi/perintah-kerja',
            icon: ClipboardList,
          },
          {
            title: 'Alokasi Tugas Operator',
            href: '/roles/manajer-produksi-kayu/manajemen-produksi/alokasi-tugas',
            icon: Users,
          },
          {
            title: 'Monitoring Progres Lapangan',
            href: '/roles/manajer-produksi-kayu/manajemen-produksi/monitoring-progres',
            icon: TrendingUp,
          },
          {
            title: 'Permintaan Pengerjaan Ulang (Rework)',
            href: '/roles/manajer-produksi-kayu/manajemen-produksi/pengerjaan-ulang',
            icon: Settings,
          },
        ],
      },
      {
        title: 'Laporan',
        icon: FileText,
        children: [
          {
            title: 'Laporan Output Harian',
            href: '/roles/manajer-produksi-kayu/laporan/output-harian',
            icon: BarChart2,
          },
          {
            title: 'Laporan Analisis Kualitas',
            href: '/roles/manajer-produksi-kayu/laporan/analisis-kualitas',
            icon: Search,
          },
          {
            title: 'Laporan Kinerja Crew',
            href: '/roles/manajer-produksi-kayu/laporan/kinerja-crew',
            icon: TrendingUp,
          },
          {
            title: 'Laporan ke Direksi',
            href: '/roles/manajer-produksi-kayu/laporan/direksi',
            icon: FileText,
          },
        ],
      },
      {
        title: 'Administrasi Pribadi',
        icon: User,
        children: [
          {
            title: 'Profil',
            href: '/roles/manajer-produksi-kayu/administrasi-pribadi/profil',
            icon: User,
          },
          {
            title: 'Jadwal',
            href: '/roles/manajer-produksi-kayu/administrasi-pribadi/jadwal',
            icon: Calendar,
          },
          {
            title: 'Pengajuan Cuti',
            href: '/roles/manajer-produksi-kayu/administrasi-pribadi/cuti',
            icon: FileText,
          },
          {
            title: 'Slip Gaji',
            href: '/roles/manajer-produksi-kayu/administrasi-pribadi/slip-gaji',
            icon: CreditCard,
          },
          {
            title: 'Kelola Rekening',
            href: '/roles/manajer-produksi-kayu/administrasi-pribadi/rekening',
            icon: CreditCard,
          },
        ],
      },
    ],

    // Staf Produksi Kayu
    staf_produksi_kayu: [
      {
        title: 'Dashboard',
        href: '/roles/staf-produksi-kayu',
        icon: LayoutGrid,
      },
      {
        title: 'Tugas Produksi',
        icon: ClipboardList,
        children: [
          {
            title: 'Daftar Tugas Harian',
            href: '/roles/staf-produksi-kayu/tugas/daftar-tugas',
            icon: ClipboardList,
          },
          {
            title: 'Instruksi Kerja',
            href: '/roles/staf-produksi-kayu/tugas/instruksi-kerja',
            icon: FileText,
          },
          {
            title: 'Lapor Progres',
            href: '/roles/staf-produksi-kayu/tugas/lapor-progres',
            icon: TrendingUp,
          },
        ],
      },
      {
        title: 'Kualitas',
        icon: Search,
        children: [
          {
            title: 'Checklist QC',
            href: '/roles/staf-produksi-kayu/kualitas/checklist-qc',
            icon: CheckCircle,
          },
          {
            title: 'Lapor Kendala',
            href: '/roles/staf-produksi-kayu/kualitas/lapor-kendala',
            icon: AlertTriangle,
          },
        ],
      },
      {
        title: 'Administrasi Pribadi',
        icon: User,
        children: [
          {
            title: 'Profil',
            href: '/roles/staf-produksi-kayu/administrasi-pribadi/profil',
            icon: User,
          },
          {
            title: 'Jadwal',
            href: '/roles/staf-produksi-kayu/administrasi-pribadi/jadwal',
            icon: Calendar,
          },
          {
            title: 'Pengajuan Cuti',
            href: '/roles/staf-produksi-kayu/administrasi-pribadi/cuti',
            icon: FileText,
          },
          {
            title: 'Slip Gaji',
            href: '/roles/staf-produksi-kayu/administrasi-pribadi/slip-gaji',
            icon: CreditCard,
          },
          {
            title: 'Kelola Rekening',
            href: '/roles/staf-produksi-kayu/administrasi-pribadi/rekening',
            icon: CreditCard,
          },
        ],
      },
    ],

    // Supervisor Kayu
    supervisor_kayu: [
      {
        title: 'Dashboard',
        href: '/roles/supervisor-kayu',
        icon: LayoutGrid,
      },
      {
        title: 'Tugas Saya',
        icon: ClipboardList,
        children: [
          {
            title: 'Daftar Tugas Produksi',
            href: '/roles/supervisor-kayu/tugas-saya/daftar-tugas',
            icon: ClipboardList,
          },
          {
            title: 'Instruksi Kerja',
            href: '/roles/supervisor-kayu/tugas-saya/instruksi-kerja',
            icon: FileText,
          },
          {
            title: 'Lapor Progres Fabrikasi',
            href: '/roles/supervisor-kayu/tugas-saya/lapor-progres',
            icon: TrendingUp,
          },
          {
            title: 'Lapor Kendala',
            href: '/roles/supervisor-kayu/tugas-saya/lapor-kendala',
            icon: AlertTriangle,
          },
        ],
      },
      {
        title: 'Umpan Balik Kualitas',
        icon: TrendingUp,
        children: [
          {
            title: 'Status & Catatan QC',
            href: '/roles/supervisor-kayu/kualitas/status-catatan-qc',
            icon: Search,
          },
          {
            title: 'Antrean Pengerjaan Ulang (Rework)',
            href: '/roles/supervisor-kayu/kualitas/antrean-rework',
            icon: ClipboardList,
          },
        ],
      },
      {
        title: 'Kinerja (KPI)',
        icon: BarChart2,
        children: [
          {
            title: 'Penilaian Crew',
            href: '/roles/supervisor-kayu/kinerja/penilaian-crew',
            icon: User,
          },
          {
            title: 'Riwayat Penilaian',
            href: '/roles/supervisor-kayu/kinerja/riwayat-penilaian',
            icon: FileText,
          },
        ],
      },
      {
        title: 'Administrasi Pribadi',
        icon: User,
        children: [
          {
            title: 'Profil',
            href: '/roles/supervisor-kayu/profil',
            icon: User,
          },
          {
            title: 'Jadwal',
            href: '/roles/supervisor-kayu/jadwal',
            icon: Calendar,
          },
          {
            title: 'Pengajuan Cuti',
            href: '/roles/supervisor-kayu/cuti',
            icon: FileText,
          },
          {
            title: 'Slip Gaji',
            href: '/roles/supervisor-kayu/slip-gaji',
            icon: CreditCard,
          },
          {
            title: 'Kelola Rekening',
            href: '/roles/supervisor-kayu/rekening',
            icon: CreditCard,
          },
        ],
      },
    ],

    // QC Kayu
    qc_kayu: [
      {
        title: 'Dashboard',
        href: '/roles/qc-kayu',
        icon: LayoutGrid,
      },
      {
        title: 'Inspeksi QC',
        icon: Search,
        children: [
          {
            title: 'Antrean Inspeksi',
            href: '/roles/qc-kayu/inspeksi/antrean-inspeksi',
            icon: ClipboardList,
          },
          {
            title: 'Detail Produksi Item',
            href: '/roles/qc-kayu/inspeksi/detail-produksi',
            icon: Package,
          },
          {
            title: 'Formulir Laporan QC',
            href: '/roles/qc-kayu/inspeksi/formulir-laporan',
            icon: FileText,
          },
        ],
      },
      {
        title: 'Dokumen & Laporan',
        icon: Folder,
        children: [
          {
            title: 'Standar Kualitas Produk',
            href: '/roles/qc-kayu/dokumen/standar-kualitas',
            icon: FileText,
          },
          {
            title: 'Riwayat Inspeksi',
            href: '/roles/qc-kayu/dokumen/riwayat-inspeksi',
            icon: ClipboardList,
          },
          {
            title: 'Analisis Reject',
            href: '/roles/qc-kayu/dokumen/analisis-reject',
            icon: BarChart2,
          },
        ],
      },
      {
        title: 'Administrasi Pribadi',
        icon: User,
        children: [
          {
            title: 'Profil',
            href: '/roles/qc-kayu/profil',
            icon: User,
          },
          {
            title: 'Jadwal',
            href: '/roles/qc-kayu/jadwal',
            icon: Calendar,
          },
          {
            title: 'Pengajuan Cuti',
            href: '/roles/qc-kayu/cuti',
            icon: FileText,
          },
          {
            title: 'Slip Gaji',
            href: '/roles/qc-kayu/slip-gaji',
            icon: CreditCard,
          },
          {
            title: 'Kelola Rekening',
            href: '/roles/qc-kayu/rekening',
            icon: CreditCard,
          },
        ],
      },
    ],

    // Crew Kayu Menu (role-specific paths)
    crew_kayu: [
      {
        title: 'Dashboard',
        href: '/roles/crew-kayu',
        icon: LayoutDashboard,
      },
      {
        title: 'Identitas Diri',
        href: route('crew-kayu.identitas-diri'),
        icon: UserCircle2,
      },
      {
        title: 'Jadwal',
        href: '/roles/crew-kayu/schedule',
        icon: CalendarDays,
      },
      {
        title: 'Pengajuan Izin',
        href: route('crew-kayu.leave.index'),
        icon: FilePlus2,
      },
      {
        title: 'Penggajian',
        href: '/roles/crew-kayu/penggajian',
        icon: Wallet,
      },
    ],

    // Crew Besi Menu (role-specific paths)
    crew_besi: [
      {
        title: 'Dashboard',
        href: '/roles/crew-besi',
        icon: LayoutDashboard,
      },
      {
        title: 'Identitas Diri',
        href: route('crew-besi.identitas-diri'),
        icon: UserCircle2,
      },
      {
        title: 'Jadwal',
        href: '/roles/crew-besi/schedule',
        icon: CalendarDays,
      },
      {
        title: 'Pengajuan Izin',
        href: route('crew-besi.leave.index'),
        icon: FilePlus2,
      },
      {
        title: 'Penggajian',
        href: '/roles/crew-besi/penggajian',
        icon: Wallet,
      },
    ],

    // Software Engineer
    software_engineer: [
      {
        title: 'Dashboard Sistem',
        href: '/roles/software-engineer',
        icon: Monitor,
      },
      {
        title: 'Manajemen Tugas',
        href: '/roles/software-engineer/tugas',
        icon: ClipboardList,
      },
      {
        title: 'Log & Monitoring',
        href: '/roles/software-engineer/monitoring',
        icon: Database,
      },
      {
        title: 'Dokumentasi API',
        href: '/roles/software-engineer/api-docs',
        icon: Code,
      },
      {
        title: 'Administrasi Pribadi',
        icon: User,
        children: [
          {
            title: 'Profil',
            href: '/roles/software-engineer/profil',
            icon: User,
          },
          {
            title: 'Jadwal',
            href: '/roles/software-engineer/jadwal',
            icon: Calendar,
          },
          {
            title: 'Pengajuan Cuti',
            href: '/roles/software-engineer/cuti',
            icon: FileText,
          },
          {
            title: 'Slip Gaji',
            href: '/roles/software-engineer/slip-gaji',
            icon: CreditCard,
          },
          {
            title: 'Kelola Rekening',
            href: '/roles/software-engineer/rekening',
            icon: CreditCard,
          },
        ],
      },
    ],
  };

  return roleMenus[role] || [];
}