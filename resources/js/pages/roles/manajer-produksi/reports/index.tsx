import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { StatCard } from '@/components/stat-card';
import { SimpleTable } from '@/components/simple-table';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Production', href: '/roles/production' },
    { title: 'Laporan', href: '/roles/production/reports' },
];

export default function ProductionReportsPage() {
  const kpi = [
    { id: 1, title: 'Output (30 hari)', value: 34800 },
    { id: 2, title: 'Downtime (jam)', value: 68 },
    { id: 3, title: 'Scrap Rate', value: '1.4%' },
    { id: 4, title: 'Efisiensi', value: '88%' },
  ];
  const daily = [
    { id: 1, date: '2025-08-10', output: 1240, downtime: '2.4', scrap: '1.3%' },
    { id: 2, date: '2025-08-09', output: 1180, downtime: '1.1', scrap: '1.5%' },
  ];
  return (
    <AuthenticatedLayout>
      <Head title="Production • Laporan" />
      <div className="p-4 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpi.map((c) => (
            <StatCard key={c.id} title={c.title} value={c.value} />
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Laporan Harian</h3>
          <SimpleTable
            data={daily}
            columns={[
              { header: 'Tanggal', accessor: (r) => r.date },
              { header: 'Output', accessor: (r) => String(r.output) },
              { header: 'Downtime (jam)', accessor: (r) => r.downtime },
              { header: 'Scrap', accessor: (r) => r.scrap },
            ]}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

