import React, { useMemo, useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { SimpleTable } from '@/components/simple-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HelpCircle, X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'PPIC', href: '/roles/ppic' },
  { title: 'Produksi', href: '/roles/ppic/production' },
];

export default function PPICProductionPage() {
  const [woQuery, setWoQuery] = useState('');
  const [woStatus, setWoStatus] = useState<'All' | 'Planned' | 'In Progress' | 'Done'>('All');
  const [showHelp, setShowHelp] = useState(false);

  const orders = [
    { id: 1, wo: 'WO-2025-001', product: 'Kursi Besi Kayu', qty: 50, due: '2025-08-30', status: 'In Progress' },
    { id: 2, wo: 'WO-2025-002', product: 'Meja Cafe', qty: 20, due: '2025-09-05', status: 'Planned' },
  ];
  const routes = [
    { id: 1, product: 'Kursi Besi Kayu', steps: 'Cutting → Welding → Assembly → Finishing' },
    { id: 2, product: 'Meja Cafe', steps: 'Cutting → Sanding → Assembly → Finishing' },
  ];
  const capacity = [
    { id: 1, line: 'Welding Line', capacity: 80, utilized: 60 },
    { id: 2, line: 'Finishing Kayu', capacity: 70, utilized: 50 },
  ];

  const filteredWO = useMemo(() => {
    const q = woQuery.toLowerCase();
    return orders.filter(o => (
      (o.wo + ' ' + o.product).toLowerCase().includes(q) &&
      (woStatus === 'All' ? true : o.status === woStatus)
    ));
  }, [woQuery, woStatus]);

  return (
    <AuthenticatedLayout>
      <Head title="PPIC • Produksi" />
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ringkasan Produksi</h2>
          <button aria-label="Bantuan" onClick={() => setShowHelp(true)} className="p-2 rounded-md hover:bg-gray-100">
            <HelpCircle className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">Navigasi Cepat:</span>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/inventory')}>Stok</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/planning')}>Perencanaan</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/movements')}>Pergerakan</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/reports')}>Laporan</Button>
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Work Orders</h3>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2">
              <input
                value={woQuery}
                onChange={(e) => setWoQuery(e.target.value)}
                placeholder="Cari WO/Produk..."
                className="w-64 rounded-md border px-3 py-2 text-sm"
              />
              <select
                value={woStatus}
                onChange={(e) => setWoStatus(e.target.value as any)}
                className="rounded-md border px-3 py-2 text-sm"
              >
                <option value="All">Semua Status</option>
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setWoQuery(''); setWoStatus('All'); }}>Reset</Button>
              <Button size="sm" onClick={() => {/* create dummy WO action */}}>Buat WO Dummy</Button>
            </div>
          </div>
          <SimpleTable
            data={filteredWO}
            columns={[
              { header: 'WO', accessor: (r) => r.wo },
              { header: 'Produk', accessor: (r) => r.product },
              { header: 'Qty', accessor: (r) => String(r.qty) },
              { header: 'Jatuh Tempo', accessor: (r) => r.due },
              {
                header: 'Status',
                accessor: (r) => (
                  <Badge className={r.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                    {r.status}
                  </Badge>
                ),
              },
            ]}
          />
          {filteredWO.length === 0 && (
            <div className="rounded-md border px-3 py-4 text-sm text-muted-foreground">Tidak ada WO yang cocok.</div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Routing</h3>
            <SimpleTable
              data={routes}
              columns={[
                { header: 'Produk', accessor: (r) => r.product },
                { header: 'Langkah', accessor: (r) => r.steps },
              ]}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold">Kapasitas Produksi</h3>
            <SimpleTable
              data={capacity}
              columns={[
                { header: 'Line', accessor: (r) => r.line },
                { header: 'Kapasitas (jam/hari)', accessor: (r) => String(r.capacity) },
                { header: 'Terpakai', accessor: (r) => `${r.utilized} jam` },
              ]}
            />
          </div>
        </div>
        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-semibold">Tentang Halaman Produksi</h4>
                <button onClick={() => setShowHelp(false)} aria-label="Tutup" className="p-1 rounded hover:bg-gray-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Halaman ini digunakan untuk:</p>
                <ul className="list-disc pl-5">
                  <li>Memantau dan memfilter Work Order berdasarkan status.</li>
                  <li>Melihat routing proses produksi per produk.</li>
                  <li>Meninjau kapasitas dan utilisasi lini produksi.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
