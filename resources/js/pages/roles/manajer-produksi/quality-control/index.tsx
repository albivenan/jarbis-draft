import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { StatCard } from '@/components/stat-card';
import { SimpleTable } from '@/components/simple-table';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Production', href: '/roles/production' },
    { title: 'QC Checklist', href: '/roles/production/qc' },
];

export default function ProductionQcPage() {
  const kpi = [
    { id: 1, title: 'Lot Diperiksa (7 hari)', value: 84 },
    { id: 2, title: 'Defect Rate', value: '0.9%' },
    { id: 3, title: 'Temuan Kritis', value: 1 },
    { id: 4, title: 'Rework', value: 3 },
  ];
  const checklist = [
    { id: 1, lot: 'LOT-0811-A1', inspector: 'Dewi', status: 'OK' },
    { id: 2, lot: 'LOT-0811-B2', inspector: 'Rama', status: 'Temuan Minor' },
  ];
  return (
    <AuthenticatedLayout>
      <Head title="Production • QC" />
      <div className="p-4 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpi.map((c) => (
            <StatCard key={c.id} title={c.title} value={c.value} />
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">QC Checklist Terbaru</h3>
          <SimpleTable
            data={checklist}
            columns={[
              { header: 'Lot', accessor: (r) => r.lot },
              { header: 'Inspector', accessor: (r) => r.inspector },
              { header: 'Status', accessor: (r) => r.status },
            ]}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

