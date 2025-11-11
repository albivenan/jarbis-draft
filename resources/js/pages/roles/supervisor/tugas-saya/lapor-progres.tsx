import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, AlertCircle } from 'lucide-react';

export default function LaporProgres() {
  return (
    <AuthenticatedLayout
      title="Lapor Progres Fabrikasi"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/supervisor-kayu' },
        { title: 'Tugas Saya', href: '#' },
        { title: 'Lapor Progres', href: '/roles/supervisor-kayu/tugas-saya/lapor-progres' }
      ]}
    >
      <Head title="Lapor Progres Fabrikasi - Supervisor Kayu" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              Lapor Progres Fabrikasi
            </h1>
            <p className="text-gray-600 mt-1">Laporkan progres fabrikasi produk kayu</p>
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
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Halaman Sedang Dikembangkan</h3>
              <p className="text-gray-600 mb-4">
                Fitur lapor progres fabrikasi untuk Supervisor Kayu sedang dalam tahap pengembangan.
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
