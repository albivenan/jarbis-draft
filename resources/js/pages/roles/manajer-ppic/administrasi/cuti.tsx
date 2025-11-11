import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Cuti() {
  return (
    <AuthenticatedLayout
      title="Pengajuan Cuti"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-ppic' },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Pengajuan Cuti', href: '/roles/manajer-ppic/administrasi/cuti' }
      ]}
    >
      <Head title="Pengajuan Cuti - PPIC" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Pengajuan Cuti
            </h1>
            <p className="text-gray-600 mt-1">Ajukan dan kelola cuti pribadi</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Ajukan Cuti
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Pengajuan Cuti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pengajuan Cuti</h3>
              <p className="text-gray-600">Riwayat pengajuan cuti akan ditampilkan di sini</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}