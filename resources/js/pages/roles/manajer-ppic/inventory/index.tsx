import React, { useMemo, useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { StatCard } from '@/components/stat-card';
import { SimpleTable } from '@/components/simple-table';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HelpCircle, X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'PPIC', href: '/roles/ppic' },
    { title: 'Stok', href: '/roles/ppic/inventory' },
];

export default function PPICInventoryPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [adjustingId, setAdjustingId] = useState<number | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(0);
  const [showHelp, setShowHelp] = useState(false);

  const kpi = [
    { id: 1, title: 'Item Total', value: 540 },
    { id: 2, title: 'Item Kritikal', value: 12 },
    { id: 3, title: 'Nilai Stok', value: 'Rp 2,1M' },
    { id: 4, title: 'Perputaran (DOH)', value: '28 hari' },
  ];
  const [items, setItems] = useState<Array<{
    id: number;
    code: string;
    item: string;
    category: string;
    onhand: number;
    uom: string;
    min: number;
    location: string;
    cost: number;
    updatedAt: string;
  }>>([
    { id: 1, code: 'BA-001', item: 'Bahan A', category: 'Bahan Baku', onhand: 65, uom: 'kg', min: 100, location: 'WH-A1', cost: 15000, updatedAt: '2025-08-01' },
    { id: 2, code: 'BA-002', item: 'Bahan B', category: 'Bahan Baku', onhand: 20, uom: 'kg', min: 50, location: 'WH-A2', cost: 12000, updatedAt: '2025-08-02' },
    { id: 3, code: 'SP-010', item: 'Sparepart X', category: 'Sparepart', onhand: 4, uom: 'pcs', min: 10, location: 'WH-S1', cost: 45000, updatedAt: '2025-08-03' },
    { id: 4, code: 'AK-101', item: 'Aksesoris Handle', category: 'Aksesoris', onhand: 120, uom: 'pcs', min: 60, location: 'WH-AK1', cost: 8000, updatedAt: '2025-08-03' },
    { id: 5, code: 'FN-PLY', item: 'Plywood 12mm', category: 'Bahan Baku', onhand: 35, uom: 'lembar', min: 40, location: 'WH-W1', cost: 98000, updatedAt: '2025-08-04' },
  ]);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchQuery = `${it.code} ${it.item}`.toLowerCase().includes(query.toLowerCase());
      const matchCat = category === 'all' ? true : it.category === category;
      return matchQuery && matchCat;
    });
  }, [items, query, category]);

  const isCritical = (onhand: number, min: number) => onhand < min;

  const doAdjust = (id: number, delta: number) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, onhand: Math.max(0, it.onhand + delta) } : it)));
    setAdjustDelta(0);
    setAdjustingId(null);
  };
  return (
    <AuthenticatedLayout>
      <Head title="PPIC • Stok" />
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Stok & Persediaan</h1>
          <button aria-label="Bantuan" onClick={() => setShowHelp(true)} className="p-2 rounded-md hover:bg-gray-100">
            <HelpCircle className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpi.map((c) => (
            <StatCard key={c.id} title={c.title} value={c.value} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">Navigasi Cepat:</span>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/planning')}>Perencanaan</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/production')}>Produksi</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/movements')}>Pergerakan</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/reports')}>Laporan</Button>
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Item Kritikal</h3>
          <SimpleTable
            data={items.filter((i) => isCritical(i.onhand, i.min))}
            columns={[
              { header: 'Item', accessor: (r) => r.item },
              { header: 'On Hand', accessor: (r) => String(r.onhand) },
              { header: 'Satuan', accessor: (r) => r.uom },
              { header: 'Min', accessor: (r) => String(r.min) },
            ]}
          />
        </div>

        {/* Manajemen Stok */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Manajemen Stok</h3>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari kode/nama item..."
                className="w-64 rounded-md border px-3 py-2 text-sm"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-md border px-3 py-2 text-sm"
              >
                <option value="all">Semua Kategori</option>
                <option value="Bahan Baku">Bahan Baku</option>
                <option value="Sparepart">Sparepart</option>
                <option value="Aksesoris">Aksesoris</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCategory('all')}>Reset</Button>
              <Button size="sm" onClick={() => {
                // contoh penambahan dummy item cepat
                const nextId = items.length + 1;
                setItems((prev) => ([
                  ...prev,
                  { id: nextId, code: `NEW-${nextId}`, item: `Item Baru ${nextId}`, category: 'Aksesoris', onhand: 10, uom: 'pcs', min: 5, location: 'WH-N1', cost: 5000, updatedAt: '2025-08-05' }
                ]));
              }}>Tambah Item Dummy</Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Kode</th>
                  <th className="px-3 py-2 font-medium">Nama</th>
                  <th className="px-3 py-2 font-medium">Kategori</th>
                  <th className="px-3 py-2 font-medium">Lokasi</th>
                  <th className="px-3 py-2 font-medium">On Hand</th>
                  <th className="px-3 py-2 font-medium">Min</th>
                  <th className="px-3 py-2 font-medium">Satuan</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-2 whitespace-nowrap">{row.code}</td>
                    <td className="px-3 py-2">{row.item}</td>
                    <td className="px-3 py-2">{row.category}</td>
                    <td className="px-3 py-2">{row.location}</td>
                    <td className="px-3 py-2">{row.onhand.toLocaleString('id-ID')}</td>
                    <td className="px-3 py-2">{row.min.toLocaleString('id-ID')}</td>
                    <td className="px-3 py-2">{row.uom}</td>
                    <td className="px-3 py-2">
                      {isCritical(row.onhand, row.min) ? (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Kritikal</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aman</Badge>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setAdjustingId(row.id); setAdjustDelta(0); }}>Sesuaikan</Button>
                        <Button size="sm" onClick={() => doAdjust(row.id, +1)}>+ IN</Button>
                        <Button size="sm" variant="destructive" onClick={() => doAdjust(row.id, -1)}>- OUT</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-3 py-6 text-center text-muted-foreground">Tidak ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {adjustingId !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
                <h4 className="mb-3 text-base font-semibold">Penyesuaian Stok</h4>
                <div className="space-y-3">
                  <label className="block text-sm">Jumlah (+ untuk masuk, - untuk keluar)</label>
                  <input
                    type="number"
                    value={adjustDelta}
                    onChange={(e) => setAdjustDelta(Number(e.target.value))}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => { setAdjustingId(null); setAdjustDelta(0); }}>Batal</Button>
                    <Button onClick={() => doAdjust(adjustingId, adjustDelta)}>Simpan</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showHelp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-semibold">Tentang Halaman Stok</h4>
                  <button onClick={() => setShowHelp(false)} aria-label="Tutup" className="p-1 rounded hover:bg-gray-100">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Halaman ini digunakan untuk:</p>
                  <ul className="list-disc pl-5">
                    <li>Memantau KPI stok dan item kritikal.</li>
                    <li>Mencari dan memfilter item berdasarkan kategori.</li>
                    <li>Melakukan penyesuaian stok (IN/OUT) dan koreksi jumlah.</li>
                    <li>Melihat lokasi, satuan, minimum, dan status persediaan.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

