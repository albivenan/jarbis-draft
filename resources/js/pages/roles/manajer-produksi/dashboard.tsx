import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { StatCard } from '@/components/stat-card';
import { SimpleTable } from '@/components/simple-table';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Production', href: '/roles/production' },
];

export default function ProductionPage() {
  const cards = [
    { id: 1, title: 'Output Hari Ini', value: 1240 },
    { id: 2, title: 'Downtime (jam)', value: 2.4 },
    { id: 3, title: 'Scrap Rate', value: '1.3%' },
    { id: 4, title: 'WO Tertunda', value: 5 },
  ];
  const today = [
    { id: 1, wo: 'WO-2025-0811-01', line: 'A1', qty: 300, status: 'Selesai' },
    { id: 2, wo: 'WO-2025-0811-02', line: 'B2', qty: 240, status: 'Proses' },
    { id: 3, wo: 'WO-2025-0811-03', line: 'C1', qty: 180, status: 'Proses' },
  ];
  return (
    <AuthenticatedLayout>
      <Head title="Production" />
      <div className="p-4 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <StatCard key={c.id} title={c.title} value={c.value} />
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">WO Hari Ini</h3>
          <SimpleTable
            data={today}
            columns={[
              { header: 'WO', accessor: (r) => r.wo },
              { header: 'Line', accessor: (r) => r.line },
              { header: 'Qty', accessor: (r) => String(r.qty) },
              { header: 'Status', accessor: (r) => r.status },
            ]}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

