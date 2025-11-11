import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SlipGaji() {
  return (
    <AuthenticatedLayout
      title="Slip Gaji"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-ppic' },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Slip Gaji', href: '/roles/manajer-ppic/administrasi/slip-gaji' }
      ]}
    >
      <Head title="Slip Gaji - PPIC" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-8 w-8 text-green-600" />
              Slip Gaji
            </h1>
            <p className="text-gray-600 mt-1">Lihat dan download slip gaji</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Slip Gaji</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Slip Gaji</h3>
              <p className="text-gray-600">Riwayat slip gaji akan ditampilkan di sini</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}