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
    { title: 'Kampanye', href: '/roles/marketing/campaigns' },
];

export default function MarketingCampaignsPage() {
  const [showHelp, setShowHelp] = useState(false);
  const kpi = [
    { id: 1, title: 'Kampanye Aktif', value: 6 },
    { id: 2, title: 'CTR Rata-rata', value: '3.4%' },
    { id: 3, title: 'Spend Bulan Ini', value: 'Rp 18jt' },
    { id: 4, title: 'Leads dari Kampanye', value: 42 },
  ];
  const campaigns = [
    { id: 1, name: 'Promo Ramadhan', ctr: '4.1%', spend: 'Rp 6jt' },
    { id: 2, name: 'Brand Awareness Q3', ctr: '2.8%', spend: 'Rp 8jt' },
    { id: 3, name: 'Remarketing', ctr: '3.7%', spend: 'Rp 4jt' },
  ];
  return (
    <AuthenticatedLayout>
      <Head title="Marketing • Kampanye" />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Kampanye</h1>
            <p className="text-sm text-muted-foreground">Pantau performa kampanye dan efisiensi spend</p>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Bantuan" onClick={() => setShowHelp(true)} className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm text-muted-foreground hover:bg-accent">
              <HelpCircle className="h-4 w-4" /> Bantuan
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">Navigasi Cepat:</span>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/marketing')}>Dashboard</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/marketing/crm')}>CRM</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/marketing/reports')}>Laporan</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/chat')}>Chat Atasan</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpi.map((c) => (
            <StatCard key={c.id} title={c.title} value={c.value} />
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Kampanye Aktif</h3>
          <SimpleTable
            data={campaigns}
            columns={[
              { header: 'Nama', accessor: (r) => r.name },
              { header: 'CTR', accessor: (r) => r.ctr },
              { header: 'Spend', accessor: (r) => r.spend },
            ]}
          />
        </div>
      </div>
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-background p-4 shadow">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Bantuan • Kampanye</h2>
              <button aria-label="Tutup" onClick={() => setShowHelp(false)} className="rounded p-1 hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Lihat KPI kampanye aktif, CTR, dan spend. Gunakan Navigasi Cepat untuk berpindah modul.</p>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}

