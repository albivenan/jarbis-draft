import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Edit, Plus } from 'lucide-react';

interface RekeningProps {
  role: string;
}

export default function Rekening({ role }: RekeningProps) {
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

  const bankAccounts = [
    {
      id: 1,
      bankName: 'Bank Central Asia (BCA)',
      accountNumber: '1234567890',
      accountName: 'John Doe',
      type: 'primary',
      status: 'active'
    },
    {
      id: 2,
      bankName: 'Bank Mandiri',
      accountNumber: '0987654321',
      accountName: 'John Doe',
      type: 'secondary',
      status: 'active'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'primary': return 'bg-blue-100 text-blue-800';
      case 'secondary': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'primary': return 'Utama';
      case 'secondary': return 'Sekunder';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Tidak Aktif';
      default: return status;
    }
  };

  return (
    <AuthenticatedLayout
      title="Kelola Rekening"
      breadcrumbs={[
        { title: 'Dashboard', href: getDashboardUrl(role) },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Kelola Rekening', href: `/roles/${role}/administrasi-pribadi/rekening` }
      ]}
    >
      <Head title={`Kelola Rekening - ${getRoleName(role)}`} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-8 w-8 text-blue-600" />
              Kelola Rekening
            </h1>
            <p className="text-gray-600 mt-1">Kelola informasi rekening bank untuk penggajian</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Rekening
          </Button>
        </div>

        {/* Info */}
        <Card>
          <CardContent className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Informasi:</strong> Rekening utama akan digunakan untuk transfer gaji bulanan. 
                Pastikan informasi rekening selalu up-to-date untuk menghindari kendala pembayaran.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bank Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Rekening Bank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bankAccounts.map((account) => (
                <div key={account.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{account.bankName}</h4>
                      <p className="text-sm text-gray-600">
                        No. Rekening: {account.accountNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        Atas Nama: {account.accountName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(account.type)}>
                        {getTypeText(account.type)}
                      </Badge>
                      <Badge className={getStatusColor(account.status)}>
                        {getStatusText(account.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    {account.type !== 'primary' && (
                      <Button variant="outline" size="sm">
                        Jadikan Utama
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Petunjuk Penggunaan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                <p>Pastikan nama pemilik rekening sesuai dengan nama di KTP</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                <p>Rekening utama akan digunakan untuk transfer gaji bulanan</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                <p>Hubungi HRD jika ada perubahan informasi rekening</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">4</span>
                <p>Verifikasi akan dilakukan oleh tim keuangan sebelum aktivasi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}