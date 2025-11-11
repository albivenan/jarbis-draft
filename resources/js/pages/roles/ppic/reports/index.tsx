import React, { useMemo, useRef, useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { SimpleTable } from '@/components/simple-table';
import { Button } from '@/components/ui/button';
import AppLogo from '@/components/app-logo';
import { AlertTriangle, BarChart2, Clock, Package, Dot, HelpCircle, X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'PPIC', href: '/roles/ppic' },
  { title: 'Laporan', href: '/roles/ppic/reports' },
];

export default function PPICReportsPage() {
  // Filter waktu (Harian/Bulanan/Tahunan)
  const [period, setPeriod] = useState<'harian' | 'bulanan' | 'tahunan'>('bulanan');

  // Dummy data (would be server-provided later)
  const orders = [
    { id: 1, project: 'Kursi Besi Kayu', date: '2025-08-05', status: 'done', leadTime: 3, late: false, reason: '' },
    { id: 2, project: 'Kursi Besi Kayu', date: '2025-08-07', status: 'done', leadTime: 4, late: true, reason: 'Keterlambatan material' },
    { id: 3, project: 'Meja Cafe', date: '2025-08-08', status: 'in_progress', leadTime: 2, late: false, reason: '' },
    { id: 4, project: 'Meja Cafe', date: '2025-08-09', status: 'done', leadTime: 5, late: true, reason: 'Mesin maintenance' },
  ];
  const lowStocks = [
    { id: 1, item: 'Plywood 12mm', onhand: 35, min: 40, uom: 'lembar' },
    { id: 2, item: 'Besi Hollow 20x20', onhand: 20, min: 50, uom: 'batang' },
  ];
  const usages = [
    { id: 1, item: 'Plywood 12mm', qty: 85, uom: 'lembar' },
    { id: 2, item: 'Cat Kayu', qty: 40, uom: 'liter' },
  ];
  const forecasts = [
    { id: 1, item: 'Plywood 12mm', nextNeed: 120, uom: 'lembar' },
    { id: 2, item: 'Besi Hollow 20x20', nextNeed: 180, uom: 'batang' },
  ];

  const filteredOrders = orders; // disederhanakan untuk contoh

  // KPIs
  const totalIn = filteredOrders.length; // asumsi total order masuk periode ini
  const totalDone = filteredOrders.filter(o => o.status === 'done').length;
  const totalLate = filteredOrders.filter(o => o.late).length;
  const avgLT = filteredOrders.length
    ? Math.round((filteredOrders.reduce((a, b) => a + b.leadTime, 0) / filteredOrders.length) * 10) / 10
    : 0;

  // Perbandingan periode sebelumnya (dummy)
  const prevLate: number = 1; // periode sebelumnya (dummy)
  const lateChangePct = prevLate <= 0 ? 100 : Math.round(((totalLate - prevLate) / prevLate) * 100);
  const plan = 100; // target 100%
  const actual = totalDone && totalIn ? Math.round((totalDone / totalIn) * 100) : 0; // efisiensi sederhana
  const efficiencyPct = actual; // plan vs realisasi
  const criticalCount = lowStocks.length;

  // Simple export handlers
  const printAreaRef = useRef<HTMLDivElement>(null);

  const exportPDF = () => {
    // Use print view as lightweight PDF export approach
    window.print();
  };

  const exportCSV = () => {
    // Build a CSV for high-level KPIs
    const rows = [
      ['Periode', period],
      ['Total Pesanan Masuk', String(totalIn)],
      ['Jumlah Selesai', String(totalDone)],
      ['Jumlah Terlambat', String(totalLate)],
      ['Rata-rata Waktu Produksi (hari)', String(avgLT)],
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `laporan-ppic-${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper indikator status warna
  const StatusDot = ({ status }: { status: 'green' | 'yellow' | 'red' }) => {
    const color = status === 'green' ? 'text-green-500' : status === 'yellow' ? 'text-yellow-500' : 'text-red-500';
    return <Dot className={`${color}`} />;
  };

  // Data list laporan per periode (dummy)
  type ReportItem = {
    id: number;
    label: string; // tanggal/bulan/tahun
    production: string; // ringkasan produksi
    stock: string; // ringkasan stok
    issues: string; // catatan masalah
    status: 'green' | 'yellow' | 'red';
    detail: {
      incoming: number;
      done: number;
      late: number;
      lateReasons: string[];
      materialUsage: Array<{ item: string; qty: string }>;
      forecast: Array<{ item: string; qty: string }>;
      fieldNotes: string;
    };
  };

  const listData: ReportItem[] = useMemo(() => {
    if (period === 'harian') {
      return [
        {
          id: 1,
          label: '2025-08-10',
          production: 'Masuk 5, Selesai 4, Terlambat 1',
          stock: '2 bahan kritis: Plywood, Hollow',
          issues: 'Keterlambatan material dari vendor',
          status: 'yellow',
          detail: {
            incoming: 5, done: 4, late: 1,
            lateReasons: ['Keterlambatan material'],
            materialUsage: [{ id: 1, item: 'Plywood 12mm', qty: '20 lembar' }],
            forecast: [{ id: 1, item: 'Besi Hollow 20x20', qty: '60 batang' }],
            fieldNotes: 'Perlu follow-up vendor plywood.'
          }
        },
        {
          id: 2,
          label: '2025-08-11',
          production: 'Masuk 6, Selesai 6, Terlambat 0',
          stock: '1 bahan kritis: Cat Kayu',
          issues: '-',
          status: 'green',
          detail: {
            incoming: 6, done: 6, late: 0,
            lateReasons: [],
            materialUsage: [{ id: 1, item: 'Cat Kayu', qty: '8 liter' }],
            forecast: [{ id: 1, item: 'Plywood 12mm', qty: '50 lembar' }],
            fieldNotes: 'Produksi berjalan sesuai rencana.'
          }
        },
      ];
    }
    if (period === 'bulanan') {
      return [
        {
          id: 1,
          label: 'Agustus 2025',
          production: 'Masuk 120, Selesai 110, Terlambat 6',
          stock: '3 bahan kritis: Plywood, Hollow, Baut',
          issues: 'Bottleneck di welding line',
          status: 'yellow',
          detail: {
            incoming: 120, done: 110, late: 6,
            lateReasons: ['Bottleneck welding', 'Maintenance mesin'],
            materialUsage: [{ id: 1, item: 'Plywood 12mm', qty: '380 lembar' }],
            forecast: [{ id: 1, item: 'Besi Hollow 20x20', qty: '200 batang' }],
            fieldNotes: 'Perlu penambahan shift sementara.'
          }
        },
        {
          id: 2,
          label: 'Juli 2025',
          production: 'Masuk 100, Selesai 98, Terlambat 2',
          stock: '1 bahan kritis: Cat Kayu',
          issues: '-',
          status: 'green',
          detail: {
            incoming: 100, done: 98, late: 2,
            lateReasons: ['Revisi desain mendadak'],
            materialUsage: [{ id: 1, item: 'Cat Kayu', qty: '120 liter' }],
            forecast: [{ id: 1, item: 'Plywood 12mm', qty: '300 lembar' }],
            fieldNotes: 'Perlu buffer lead time untuk desain.'
          }
        },
      ];
    }
    // tahunan
    return [
      {
        id: 1,
        label: '2025',
        production: 'Masuk 1.280, Selesai 1.240, Terlambat 28',
        stock: '4 bahan kritis Q4',
        issues: 'Lonjakan permintaan akhir tahun',
        status: 'yellow',
        detail: {
          incoming: 1280, done: 1240, late: 28,
          lateReasons: ['Lonjakan demand', 'Supply bahan terbatas'],
          materialUsage: [{ id: 1, item: 'Plywood 12mm', qty: '4.800 lembar' }],
          forecast: [{ id: 1, item: 'Besi Hollow 20x20', qty: '2.000 batang' }],
          fieldNotes: 'Rencanakan kontrak vendor jangka panjang.'
        }
      },
    ];
  }, [period]);

  const [expanded, setExpanded] = useState<number | null>(null);
  const toggleExpand = (id: number) => setExpanded(expanded === id ? null : id);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <AuthenticatedLayout>
      <Head title="PPIC • Laporan" />
      <div className="p-4 space-y-6 print:p-8" ref={printAreaRef}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold">Laporan PPIC</h1>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2">
              <select value={period} onChange={(e) => setPeriod(e.target.value as any)} className="rounded-md border px-3 py-2 text-sm w-40">
                <option value="harian">Harian</option>
                <option value="bulanan">Bulanan</option>
                <option value="tahunan">Tahunan</option>
              </select>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportCSV}>Ekspor Excel (CSV)</Button>
                <Button size="sm" onClick={exportPDF}>Ekspor PDF</Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden print:block text-right text-xs text-muted-foreground mr-2">Generated: {new Date().toLocaleString('id-ID')}</div>
            <AppLogo />
            <button aria-label="Bantuan" onClick={() => setShowHelp(true)} className="ml-1 p-2 rounded-md hover:bg-gray-100">
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Evaluasi Cards */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">Navigasi Cepat:</span>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/inventory')}>Stok</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/planning')}>Perencanaan</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/production')}>Produksi</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/ppic/movements')}>Pergerakan</Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-4 bg-red-50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-500" />
              <div className="text-sm font-medium">Pesanan Terlambat</div>
            </div>
            <div className="mt-2 text-2xl font-bold">{totalLate}</div>
            <div className="text-xs text-red-700">{lateChangePct >= 0 ? `+${lateChangePct}%` : `${lateChangePct}%`} vs periode sebelumnya</div>
          </div>

          <div className="rounded-lg border p-4 bg-blue-50">
            <div className="flex items-center gap-3">
              <BarChart2 className="text-blue-500" />
              <div className="text-sm font-medium">Efisiensi Produksi</div>
            </div>
            <div className="mt-2 text-2xl font-bold">{efficiencyPct}%</div>
            <div className="text-xs text-blue-700">Plan {plan}% • Realisasi {actual}%</div>
          </div>

          <div className="rounded-lg border p-4 bg-yellow-50">
            <div className="flex items-center gap-3">
              <Package className="text-yellow-600" />
              <div className="text-sm font-medium">Bahan Kritis</div>
            </div>
            <div className="mt-2 text-2xl font-bold">{criticalCount}</div>
            <div className="text-xs text-yellow-700">Jenis bahan di bawah minimum</div>
          </div>

          <div className="rounded-lg border p-4 bg-green-50">
            <div className="flex items-center gap-3">
              <Clock className="text-green-600" />
              <div className="text-sm font-medium">Rata-rata Lead Time</div>
            </div>
            <div className="mt-2 text-2xl font-bold">{avgLT} hari</div>
            <div className="text-xs text-green-700">Rata-rata durasi per pesanan</div>
          </div>
        </div>

        {/* List Laporan per Periode */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Daftar Laporan ({period === 'harian' ? 'Harian' : period === 'bulanan' ? 'Bulanan' : 'Tahunan'})</h3>
          <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Periode</th>
                  <th className="px-3 py-2 font-medium">Ringkasan Produksi</th>
                  <th className="px-3 py-2 font-medium">Ringkasan Stok</th>
                  <th className="px-3 py-2 font-medium">Catatan Masalah</th>
                  <th className="px-3 py-2 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {listData.map((it) => (
                  <React.Fragment key={it.id}>
                    <tr className="border-t">
                      <td className="px-3 py-2"><StatusDot status={it.status} /></td>
                      <td className="px-3 py-2 whitespace-nowrap">{it.label}</td>
                      <td className="px-3 py-2">{it.production}</td>
                      <td className="px-3 py-2">{it.stock}</td>
                      <td className="px-3 py-2">{it.issues}</td>
                      <td className="px-3 py-2 text-right">
                        <Button size="sm" variant="outline" onClick={() => toggleExpand(it.id)}>{expanded === it.id ? 'Tutup' : 'Detail'}</Button>
                      </td>
                    </tr>
                    {expanded === it.id && (
                      <tr className="bg-gray-50/60">
                        <td colSpan={6} className="px-3 py-3">
                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                              <div className="font-medium">Produksi</div>
                              <SimpleTable
                                data={[
                                  { id: 'incoming', label: 'Pesanan Masuk', val: String(it.detail.incoming) },
                                  { id: 'done', label: 'Selesai', val: String(it.detail.done) },
                                  { id: 'late', label: 'Terlambat', val: String(it.detail.late) },
                                ]}
                                columns={[
                                  { header: 'Item', accessor: (r: any) => r.label },
                                  { header: 'Nilai', accessor: (r: any) => r.val },
                                ]}
                              />
                              <div className="font-medium mt-3">Keterlambatan & Penyebab</div>
                              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                {it.detail.lateReasons.length ? it.detail.lateReasons.map((r, idx) => <li key={idx}>{r}</li>) : <li>-</li>}
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <div className="font-medium">Pemakaian Bahan</div>
                              <SimpleTable
                                data={it.detail.materialUsage}
                                columns={[{ header: 'Item', accessor: (r: any) => r.item }, { header: 'Jumlah', accessor: (r: any) => r.qty }]}
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="font-medium">Forecast Kebutuhan</div>
                              <SimpleTable
                                data={it.detail.forecast}
                                columns={[{ header: 'Item', accessor: (r: any) => r.item }, { header: 'Kebutuhan', accessor: (r: any) => r.qty }]}
                              />
                              <div className="font-medium mt-3">Catatan Evaluasi Lapangan</div>
                              <div className="rounded-md border px-3 py-2 text-sm text-muted-foreground">{it.detail.fieldNotes}</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {listData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">Tidak ada laporan untuk periode ini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Print footer */}
        <div className="hidden print:block mt-8 text-xs text-muted-foreground">
          Dokumen ini bersifat resmi untuk keperluan internal PT. Jarbis Indonesia. Dicetak pada {new Date().toLocaleString('id-ID')}.
        </div>

        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-semibold">Tentang Halaman Laporan</h4>
                <button onClick={() => setShowHelp(false)} aria-label="Tutup" className="p-1 rounded hover:bg-gray-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Halaman ini digunakan untuk:</p>
                <ul className="list-disc pl-5">
                  <li>Memantau KPI produksi dan persediaan per periode.</li>
                  <li>Melihat daftar laporan harian/bulanan/tahunan dan membuka detail.</li>
                  <li>Mengekspor ringkasan ke PDF atau Excel (CSV).</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
