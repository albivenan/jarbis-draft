import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';

export default function RiwayatPenilaian() {
  return (
    <AuthenticatedLayout
      title="Riwayat Penilaian"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/supervisor-kayu' },
        { title: 'Kinerja (KPI)', href: '#' },
        { title: 'Riwayat Penilaian', href: '/roles/supervisor-kayu/kinerja/riwayat-penilaian' }
      ]}
    >
      <Head title="Riwayat Penilaian - Supervisor Kayu" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Riwayat Penilaian
            </h1>
            <p className="text-gray-600 mt-1">Riwayat penilaian kinerja crew produksi kayu</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Halaman Dalam Pengembangan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Halaman Sedang Dikembangkan</h3>
              <p className="text-gray-600 mb-4">
                Fitur riwayat penilaian untuk Supervisor Kayu sedang dalam tahap pengembangan.
              </p>
              <p className="text-sm text-gray-500">
                Silakan kembali lagi nanti atau hubungi administrator sistem.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}