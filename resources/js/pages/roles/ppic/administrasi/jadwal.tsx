import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function Jadwal() {
  return (
    <AuthenticatedLayout
      title="Jadwal"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/ppic' },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Jadwal', href: '/roles/ppic/administrasi/jadwal' }
      ]}
    >
      <Head title="Jadwal - PPIC" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              Jadwal Kerja
            </h1>
            <p className="text-gray-600 mt-1">Lihat jadwal kerja pribadi</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Jadwal Kerja Saya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Jadwal Kerja</h3>
              <p className="text-gray-600">Jadwal kerja akan ditampilkan di sini</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
