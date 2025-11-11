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
  { title: 'Movements', href: '/roles/ppic/movements' },
];

export default function PPICMovementsPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'All' | 'IN' | 'OUT'>('All');
  const [showHelp, setShowHelp] = useState(false);
  const [moves, setMoves] = useState([
    { id: 1, ref: 'MV-0001', date: '2025-08-10', item: 'Plywood 12mm', qty: 10, uom: 'lembar', type: 'IN' },
    { id: 2, ref: 'MV-0002', date: '2025-08-11', item: 'Besi Hollow 20x20', qty: 5, uom: 'batang', type: 'OUT' },
  ] as Array<{ id: number; ref: string; date: string; item: string; qty: number; uom: string; type: 'IN' | 'OUT'; }>);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return moves.filter(m => (
      (m.ref + ' ' + m.item).toLowerCase().includes(q) && (type === 'All' ? true : m.type === type)
    ));
  }, [moves, query, type]);

  const addDummy = (t: 'IN' | 'OUT') => {
    const nextId = moves.length + 1;
    setMoves(prev => ([
      ...prev,
      { id: nextId, ref: `MV-${String(nextId).padStart(4, '0')}`, date: '2025-08-13', item: t === 'IN' ? 'Aksesoris Baut' : 'Plywood 12mm', qty: t === 'IN' ? 15 : 3, uom: t === 'IN' ? 'pcs' : 'lembar', type: t },
    ]));
  };

  return (
    <AuthenticatedLayout>
      <Head title="PPIC • Movements" />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Pergerakan Stok</h2>
            <button aria-label="Bantuan" onClick={() => setShowHelp(true)} className="p-2 rounded-md hover:bg-gray-100">
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => addDummy('IN')}>+ IN Dummy</Button>
            <Button size="sm" variant="destructive" onClick={() => addDummy('OUT')}>- OUT Dummy</Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">Navigasi Cepat:</span>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/inventory')}>Stok</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/planning')}>Perencanaan</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/production')}>Produksi</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/reports')}>Laporan</Button>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari Ref/Item..."
              className="w-64 rounded-md border px-3 py-2 text-sm"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="rounded-md border px-3 py-2 text-sm"
            >
              <option value="All">Semua Tipe</option>
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { setQuery(''); setType('All'); }}>Reset</Button>
          </div>
        </div>
        <SimpleTable
          data={filtered}
          columns={[
            { header: 'Ref', accessor: (r) => r.ref },
            { header: 'Tanggal', accessor: (r) => r.date },
            { header: 'Item', accessor: (r) => r.item },
            { header: 'Qty', accessor: (r) => `${r.qty} ${r.uom}` },
            { header: 'Tipe', accessor: (r) => (
              <Badge className={r.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {r.type}
              </Badge>
            ) },
          ]}
        />
        {filtered.length === 0 && (
          <div className="rounded-md border px-3 py-4 text-sm text-muted-foreground">Tidak ada pergerakan yang cocok.</div>
        )}

        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-semibold">Tentang Halaman Pergerakan</h4>
                <button onClick={() => setShowHelp(false)} aria-label="Tutup" className="p-1 rounded hover:bg-gray-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Halaman ini digunakan untuk:</p>
                <ul className="list-disc pl-5">
                  <li>Melihat riwayat pergerakan barang IN/OUT.</li>
                  <li>Memfilter berdasarkan tipe dan melakukan pencarian.</li>
                  <li>Menambahkan contoh pergerakan (dummy) untuk simulasi.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
