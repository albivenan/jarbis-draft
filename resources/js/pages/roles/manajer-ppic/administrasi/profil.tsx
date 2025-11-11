import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Edit } from 'lucide-react';

export default function Profil() {
  return (
    <AuthenticatedLayout
      title="Profil"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-ppic' },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Profil', href: '/roles/manajer-ppic/administrasi/profil' }
      ]}
    >
      <Head title="Profil - PPIC" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <User className="h-8 w-8 text-blue-600" />
              Profil Saya
            </h1>
            <p className="text-gray-600 mt-1">Kelola informasi profil pribadi</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profil
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Pribadi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Profil Pengguna</h3>
              <p className="text-gray-600">Informasi profil akan ditampilkan di sini</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}