import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Rekening() {
  return (
    <AuthenticatedLayout
      title="Kelola Rekening"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/ppic' },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Kelola Rekening', href: '/roles/ppic/administrasi/rekening' }
      ]}
    >
      <Head title="Kelola Rekening - PPIC" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-8 w-8 text-blue-600" />
              Kelola Rekening
            </h1>
            <p className="text-gray-600 mt-1">Kelola informasi rekening bank</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Edit className="w-4 h-4 mr-2" />
            Edit Rekening
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Rekening Bank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Rekening Bank</h3>
              <p className="text-gray-600">Informasi rekening bank akan ditampilkan di sini</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
