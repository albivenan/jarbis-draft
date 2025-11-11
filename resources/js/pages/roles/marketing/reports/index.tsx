import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChart, LineChart, FileText, HelpCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function MarketingReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showHelp, setShowHelp] = useState(false);

  return (
    <AuthenticatedLayout>
      <Head title="Marketing • Laporan" />

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Laporan Marketing</h1>
            <p className="text-sm text-muted-foreground">Ringkasan performa kampanye, kanal, dan funnel</p>
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
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/marketing/campaigns')}>Kampanye</Button>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/roles/chat')}>Chat Atasan</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="channels">Per Kanal</TabsTrigger>
            <TabsTrigger value="funnel">Funnel</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Ringkasan KPI</CardTitle>
                <CardDescription>KPI utama 30 hari terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Leads Baru</div>
                    <div className="text-2xl font-bold">56</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Conversion Rate</div>
                    <div className="text-2xl font-bold">12.4%</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Spend</div>
                    <div className="text-2xl font-bold">Rp 18.000.000</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5" /> Performa Kanal</CardTitle>
                <CardDescription>Perbandingan leads dan biaya per kanal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Grafik ringkasan per kanal (mock). Integrasikan chart lib jika diperlukan.</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funnel">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><LineChart className="h-5 w-5" /> Funnel</CardTitle>
                <CardDescription>Konversi dari leads ke closed-won</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Diagram funnel dan rasio tiap tahap (mock).</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-background p-4 shadow">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Bantuan • Laporan Marketing</h2>
              <button aria-label="Tutup" onClick={() => setShowHelp(false)} className="rounded p-1 hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Pilih tab untuk melihat ringkasan KPI, analisis per kanal, dan funnel konversi. Data saat ini mock untuk demonstrasi.</p>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
