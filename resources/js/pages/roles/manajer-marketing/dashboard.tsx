import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { StatCard } from '@/components/stat-card';
import { SimpleTable } from '@/components/simple-table';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { HelpCircle, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Marketing', href: '/roles/marketing' },
];

export default function MarketingPage() {
  const [showHelp, setShowHelp] = useState(false);
  const cards = [
    { id: 1, title: 'Leads Baru (30 hari)', value: 56 },
    { id: 2, title: 'Conversion Rate', value: '12.4%' },
    { id: 3, title: 'CAC (est.)', value: 'Rp 210rb' },
    { id: 4, title: 'Open Rate Email', value: '28%' },
  ];
  const pipelines = [
    { id: 1, name: 'PT Alpha', stage: 'Negotiation', value: 'Rp 80jt' },
    { id: 2, name: 'CV Beta', stage: 'Proposal Sent', value: 'Rp 45jt' },
    { id: 3, name: 'PT Gamma', stage: 'Qualified', value: 'Rp 30jt' },
  ];
  return (
    <AuthenticatedLayout>
      <Head title="Marketing" />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Marketing</h1>
            <p className="text-sm text-muted-foreground">Ringkasan KPI dan pipeline aktif</p>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Bantuan" onClick={() => setShowHelp(true)} className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm text-muted-foreground hover:bg-accent">
              <HelpCircle className="h-4 w-4" /> Bantuan
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">Navigasi Cepat:</span>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/marketing/crm')}>CRM</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/marketing/campaigns')}>Kampanye</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/marketing/reports')}>Laporan</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/chat')}>Chat Atasan</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <StatCard key={c.id} title={c.title} value={c.value} />
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Pipeline Aktif</h3>
          <SimpleTable
            data={pipelines}
            columns={[
              { header: 'Nama', accessor: (r) => r.name },
              { header: 'Tahap', accessor: (r) => r.stage },
              { header: 'Nilai', accessor: (r) => r.value },
            ]}
          />
        </div>
      </div>
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-background p-4 shadow">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Bantuan • Dashboard Marketing</h2>
              <button aria-label="Tutup" onClick={() => setShowHelp(false)} className="rounded p-1 hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Lihat KPI utama marketing dan pipeline aktif. Gunakan Navigasi Cepat untuk menuju CRM, Kampanye, Laporan, dan Chat Atasan.</p>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
