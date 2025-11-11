import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, X, Paperclip } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Direktur', href: '/roles/direktur' },
  { title: 'Lampiran', href: '/roles/direktur/attachments' },
];

export default function DirekturAttachmentsPage() {
  const [tab, setTab] = useState('pendapatan');
  const [showHelp, setShowHelp] = useState(false);

  return (
    <AuthenticatedLayout>
      <Head title="Direktur • Lampiran" />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Paperclip className="h-5 w-5" /> Lampiran dari Divisi</h1>
            <p className="text-sm text-muted-foreground">Kumpulan lampiran yang dikirim bawahan: pendapatan, omset, laporan, dan dokumen</p>
          </div>
          <button aria-label="Bantuan" onClick={() => setShowHelp(true)} className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm text-muted-foreground hover:bg-accent">
            <HelpCircle className="h-4 w-4" /> Bantuan
          </button>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="pendapatan">Pendapatan</TabsTrigger>
            <TabsTrigger value="omset">Omset</TabsTrigger>
            <TabsTrigger value="laporan">Laporan</TabsTrigger>
            <TabsTrigger value="dokumen">Dokumen</TabsTrigger>
          </TabsList>

          <TabsContent value="pendapatan">
            <Card>
              <CardHeader>
                <CardTitle>Pendapatan</CardTitle>
                <CardDescription>Ringkasan pendapatan yang dilaporkan divisi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Tabel ringkasan pendapatan (mock). Integrasikan data backend sesuai kebutuhan.</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="omset">
            <Card>
              <CardHeader>
                <CardTitle>Omset</CardTitle>
                <CardDescription>Ringkasan omset/billing per periode</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Tabel omset per divisi/per produk (mock).</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="laporan">
            <Card>
              <CardHeader>
                <CardTitle>Laporan</CardTitle>
                <CardDescription>Laporan periodik yang diunggah oleh masing-masing divisi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Daftar laporan dengan status review/approval (mock).</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dokumen">
            <Card>
              <CardHeader>
                <CardTitle>Dokumen</CardTitle>
                <CardDescription>Dokumen pendukung: PDF, spreadsheet, dan lainnya</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Daftar dokumen dengan metadata (pengirim, tanggal, divisi) (mock).</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-background p-4 shadow">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Bantuan • Lampiran</h2>
              <button aria-label="Tutup" onClick={() => setShowHelp(false)} className="rounded p-1 hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Halaman ini mengumpulkan semua lampiran dari bawahan: pendapatan, omset, laporan, dan dokumen pendukung. Gunakan breadcrumb untuk navigasi.</p>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
