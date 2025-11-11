import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Calendar, Clock } from 'lucide-react';

interface CutiProps {
  role: string;
}

export default function Cuti({ role }: CutiProps) {
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

  const cutiHistory = [
    {
      id: 1,
      type: 'Cuti Tahunan',
      startDate: '2024-12-20',
      endDate: '2024-12-24',
      days: 5,
      status: 'approved',
      reason: 'Liburan akhir tahun bersama keluarga'
    },
    {
      id: 2,
      type: 'Cuti Sakit',
      startDate: '2024-11-15',
      endDate: '2024-11-16',
      days: 2,
      status: 'approved',
      reason: 'Sakit demam'
    },
    {
      id: 3,
      type: 'Cuti Tahunan',
      startDate: '2025-01-15',
      endDate: '2025-01-17',
      days: 3,
      status: 'pending',
      reason: 'Acara keluarga'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Disetujui';
      case 'pending': return 'Menunggu';
      case 'rejected': return 'Ditolak';
      default: return status;
    }
  };

  return (
    <AuthenticatedLayout
      title="Pengajuan Cuti"
      breadcrumbs={[
        { title: 'Dashboard', href: getDashboardUrl(role) },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Pengajuan Cuti', href: `/roles/${role}/administrasi-pribadi/cuti` }
      ]}
    >
      <Head title={`Pengajuan Cuti - ${getRoleName(role)}`} />

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

        {/* Saldo Cuti */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saldo Cuti Tahunan</p>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-gray-500">hari tersisa</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cuti Terpakai</p>
                  <p className="text-2xl font-bold text-green-600">8</p>
                  <p className="text-sm text-gray-500">hari tahun ini</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pengajuan Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                  <p className="text-sm text-gray-500">menunggu approval</p>
                </div>
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Riwayat Cuti */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Pengajuan Cuti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cutiHistory.map((cuti) => (
                <div key={cuti.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{cuti.type}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(cuti.startDate).toLocaleDateString('id-ID')} - {new Date(cuti.endDate).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{cuti.days} hari</span>
                      <Badge className={getStatusColor(cuti.status)}>
                        {getStatusText(cuti.status)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>Alasan:</strong> {cuti.reason}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}