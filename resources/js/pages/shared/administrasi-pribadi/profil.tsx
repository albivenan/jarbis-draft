import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Edit } from 'lucide-react';

interface ProfilProps {
  role: string;
}

export default function Profil({ role }: ProfilProps) {
  const getRoleName = (role: string) => {
    const roleNames: Record<string, string> = {
      'manajer-hrd': 'Manajer HRD',
      'staf-hrd': 'Staf HRD',
      'manajer-ppic': 'Manajer PPIC',
      'staf-ppic': 'Staf PPIC',
      'crew': 'Crew'
    };
    return roleNames[role] || role;
  };

  const getDashboardUrl = (role: string) => {
    return `/roles/${role}`;
  };

  return (
    <AuthenticatedLayout
      title="Profil"
      breadcrumbs={[
        { title: 'Dashboard', href: getDashboardUrl(role) },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Profil', href: `/roles/${role}/administrasi-pribadi/profil` }
      ]}
    >
      <Head title={`Profil - ${getRoleName(role)}`} />

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                  <p className="text-gray-900 mt-1">John Doe</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900 mt-1">john.doe@jarbisindonesia.com</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Jabatan</label>
                  <p className="text-gray-900 mt-1">{getRoleName(role)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Departemen</label>
                  <p className="text-gray-900 mt-1">
                    {role.includes('hrd') ? 'Human Resources' : 
                     role.includes('ppic') ? 'Production Planning & Inventory Control' : 
                     'Produksi'}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">No. Telepon</label>
                  <p className="text-gray-900 mt-1">+62 812-3456-7890</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Alamat</label>
                  <p className="text-gray-900 mt-1">Jl. Contoh No. 123, Jakarta Selatan</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tanggal Bergabung</label>
                  <p className="text-gray-900 mt-1">15 Januari 2023</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-green-600 mt-1 font-medium">Aktif</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <p className="text-gray-900 mt-1">john.doe</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Terakhir Login</label>
                  <p className="text-gray-900 mt-1">03 Januari 2025, 14:30 WIB</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <p className="text-gray-900 mt-1">{getRoleName(role)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Akun Dibuat</label>
                  <p className="text-gray-900 mt-1">15 Januari 2023</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}