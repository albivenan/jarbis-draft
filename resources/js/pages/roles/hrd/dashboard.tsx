import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { StatCard } from '@/components/stat-card';
import { TrendSparkline } from '@/components/analytics/trend-sparkline';
import { hrdKpi, hrdLeaves } from '@/mock/hrd';
import { SimpleTable } from '@/components/simple-table';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, FileText, FileArchive, HelpCircle, X } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'HRD & Administration', href: '/roles/hrd' },
];

export default function HRDPage() {
  const [showHelp, setShowHelp] = useState(false);
  const cards = hrdKpi;
  const leaves = hrdLeaves;
  return (
    <AuthenticatedLayout
      title="Dashboard HRD"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/hrd' }
      ]}
    >
      <Head title="Dashboard HRD - Manajer HRD" />
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard HRD</h1>
          <button
            aria-label="Bantuan"
            onClick={() => setShowHelp(true)}
            className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm text-muted-foreground hover:bg-accent"
          >
            <HelpCircle className="h-4 w-4" /> Bantuan
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <StatCard key={c.id} title={c.title} value={c.value} rightSlot={<TrendSparkline points={c.trend} className="mt-1" />} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">Navigasi Cepat:</span>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/hrd/employees')}>Data Karyawan</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/hrd/attendance')}>Absensi</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/hrd/payroll')}>Payroll</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/hrd/archive')}>Arsip</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/hrd/recruitment')}>Rekrutmen</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/hrd/performance')}>Kinerja</Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow">
            <Link href="/roles/hrd/employees">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Data Karyawan</CardTitle>
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardDescription>Kelola data karyawan perusahaan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-muted-foreground">Total karyawan aktif</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <Link href="/roles/hrd/attendance">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Kehadiran</CardTitle>
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardDescription>Kelola data kehadiran karyawan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">Tingkat kehadiran hari ini</p>
              </CardContent>
            </Link>
          </Card>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Perijinan Aktif</h3>
            <Link href="#" className="text-sm text-primary hover:underline">Lihat Semua</Link>
          </div>
          <SimpleTable
            data={leaves}
            columns={[
              { header: 'Nama', accessor: (r) => r.name },
              { header: 'Jenis', accessor: (r) => r.type },
              { header: 'Tanggal', accessor: (r) => r.date },
            ]}
          />
        </div>
      </div>
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-background p-4 shadow">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Bantuan • Dashboard HRD</h2>
              <button aria-label="Tutup" onClick={() => setShowHelp(false)} className="rounded p-1 hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Halaman ini merangkum KPI HRD, pintasan ke modul HRD, dan daftar perizinan aktif.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Pantau KPI seperti jumlah karyawan, kehadiran, dan perizinan.</li>
                <li>Akses cepat ke Data Karyawan, Absensi, Payroll, Arsip, Rekrutmen, dan Kinerja.</li>
                <li>Gunakan tabel perizinan untuk tindak lanjut cepat.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}

