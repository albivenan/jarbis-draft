import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface JadwalProps {
  role: string;
}

export default function Jadwal({ role }: JadwalProps) {
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
      title="Jadwal"
      breadcrumbs={[
        { title: 'Dashboard', href: getDashboardUrl(role) },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Jadwal', href: `/roles/${role}/administrasi-pribadi/jadwal` }
      ]}
    >
      <Head title={`Jadwal - ${getRoleName(role)}`} />

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
            <CardTitle>Jadwal Kerja Minggu Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day, index) => (
                <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{day}</h4>
                    <p className="text-sm text-gray-600">
                      {index < 5 ? '08:00 - 17:00' : index === 5 ? '08:00 - 12:00' : 'Libur'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {index < 5 ? '8 jam' : index === 5 ? '4 jam' : '-'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {index < 6 ? 'Hari kerja' : 'Libur'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Jadwal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">44</p>
                <p className="text-sm text-blue-800">Jam kerja/minggu</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">6</p>
                <p className="text-sm text-green-800">Hari kerja/minggu</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">1</p>
                <p className="text-sm text-purple-800">Hari libur/minggu</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}