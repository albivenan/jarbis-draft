import React, { useMemo, useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { SimpleTable } from '@/components/simple-table';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/stat-card';
import { HelpCircle, X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'PPIC', href: '/roles/ppic' },
  { title: 'Perencanaan', href: '/roles/ppic/planning' },
];

export default function PPICPlanningPage() {
  const [bomQuery, setBomQuery] = useState('');
  const [mrpQuery, setMrpQuery] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const bom = [
    { id: 1, code: 'BOM-CHR-001', product: 'Kursi Besi Kayu', rev: 'A', items: 6 },
    { id: 2, code: 'BOM-TBL-002', product: 'Meja Cafe', rev: 'B', items: 9 },
  ];
  const requirements = [
    { id: 1, item: 'Plywood 12mm', need: 100, onhand: 35, release: '2025-08-20' },
    { id: 2, item: 'Besi Hollow 20x20', need: 200, onhand: 120, release: '2025-08-22' },
  ];

  const kpi = [
    { id: 1, title: 'Total BOM', value: bom.length },
    { id: 2, title: 'Kebutuhan Material Aktif', value: requirements.length },
    { id: 3, title: 'Rilis Terdekat', value: '2025-08-20' },
    { id: 4, title: 'Item Kurang Stok', value: requirements.filter(r => r.onhand < r.need).length },
  ];

  const filteredBOM = useMemo(() => {
    const q = bomQuery.toLowerCase();
    return bom.filter(b => `${b.code} ${b.product} ${b.rev}`.toLowerCase().includes(q));
  }, [bomQuery]);

  const filteredMRP = useMemo(() => {
    const q = mrpQuery.toLowerCase();
    return requirements.filter(r => `${r.item}`.toLowerCase().includes(q));
  }, [mrpQuery]);

  return (
    <AuthenticatedLayout>
      <Head title="PPIC • Perencanaan" />
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Perencanaan Produksi</h1>
          <button aria-label="Bantuan" onClick={() => setShowHelp(true)} className="p-2 rounded-md hover:bg-gray-100">
            <HelpCircle className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpi.map((c) => (
            <StatCard key={c.id} title={c.title} value={String(c.value)} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">Navigasi Cepat:</span>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/inventory')}>Stok</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/production')}>Produksi</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/movements')}>Pergerakan</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/reports')}>Laporan</Button>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ringkasan Perencanaan</h2>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => {/* regenerate MRP dummy */}}>Regenerasi MRP (Dummy)</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-base font-semibold">BOM Terbaru</h3>
            <div className="flex gap-2">
              <input
                value={bomQuery}
                onChange={(e) => setBomQuery(e.target.value)}
                placeholder="Cari kode/produk..."
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <Button variant="outline" size="sm" onClick={() => setBomQuery('')}>Reset</Button>
            </div>
            <SimpleTable
              data={filteredBOM}
              columns={[
                { header: 'Kode', accessor: (r) => r.code },
                { header: 'Produk', accessor: (r) => r.product },
                { header: 'Revisi', accessor: (r) => r.rev },
                { header: 'Komponen', accessor: (r) => String(r.items) },
              ]}
            />
            {filteredBOM.length === 0 && (
              <div className="rounded-md border px-3 py-4 text-sm text-muted-foreground">Tidak ada BOM yang cocok.</div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold">MRP - Kebutuhan Material</h3>
            <div className="flex gap-2">
              <input
                value={mrpQuery}
                onChange={(e) => setMrpQuery(e.target.value)}
                placeholder="Cari item material..."
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <Button variant="outline" size="sm" onClick={() => setMrpQuery('')}>Reset</Button>
            </div>
            <SimpleTable
              data={filteredMRP}
              columns={[
                { header: 'Item', accessor: (r) => r.item },
                { header: 'Kebutuhan', accessor: (r) => String(r.need) },
                { header: 'On Hand', accessor: (r) => String(r.onhand) },
                { header: 'Release', accessor: (r) => r.release },
              ]}
            />
            {filteredMRP.length === 0 && (
              <div className="rounded-md border px-3 py-4 text-sm text-muted-foreground">Tidak ada kebutuhan material yang cocok.</div>
            )}
          </div>
        </div>

        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-semibold">Tentang Halaman Perencanaan</h4>
                <button onClick={() => setShowHelp(false)} aria-label="Tutup" className="p-1 rounded hover:bg-gray-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Halaman ini digunakan untuk:</p>
                <ul className="list-disc pl-5">
                  <li>Melihat ringkasan BOM dan melakukan pencarian.</li>
                  <li>Meninjau kebutuhan material (MRP) dan status ketersediaan.</li>
                  <li>Melakukan regenerasi data MRP (dummy) untuk simulasi.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
