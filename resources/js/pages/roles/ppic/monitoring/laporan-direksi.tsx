import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Send } from 'lucide-react';

export default function LaporanDireksi() {
  return (
    <AuthenticatedLayout
      title="Laporan ke Direksi"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/ppic' },
        { title: 'Monitoring & Laporan', href: '#' },
        { title: 'Laporan ke Direksi', href: '/roles/ppic/monitoring/laporan-direksi' }
      ]}
    >
      <Head title="Laporan ke Direksi - PPIC" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Laporan ke Direksi
            </h1>
            <p className="text-gray-600 mt-1">Buat dan kirim laporan PPIC ke Direksi</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4 mr-2" />
              Kirim Laporan
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Laporan Bulanan PPIC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Laporan PPIC</h3>
              <p className="text-gray-600">Template laporan untuk Direksi akan ditampilkan di sini</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
