import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Download, Eye } from 'lucide-react';

interface SlipGajiProps {
  role: string;
}

export default function SlipGaji({ role }: SlipGajiProps) {
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

  const slipGajiHistory = [
    {
      id: 1,
      period: 'Desember 2024',
      grossSalary: 15000000,
      deductions: 2000000,
      netSalary: 13000000,
      status: 'paid',
      paidDate: '2024-12-31'
    },
    {
      id: 2,
      period: 'November 2024',
      grossSalary: 15000000,
      deductions: 2000000,
      netSalary: 13000000,
      status: 'paid',
      paidDate: '2024-11-30'
    },
    {
      id: 3,
      period: 'Oktober 2024',
      grossSalary: 15000000,
      deductions: 2000000,
      netSalary: 13000000,
      status: 'paid',
      paidDate: '2024-10-31'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Dibayar';
      case 'pending': return 'Menunggu';
      case 'processing': return 'Diproses';
      default: return status;
    }
  };

  return (
    <AuthenticatedLayout
      title="Slip Gaji"
      breadcrumbs={[
        { title: 'Dashboard', href: getDashboardUrl(role) },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Slip Gaji', href: `/roles/${role}/administrasi-pribadi/slip-gaji` }
      ]}
    >
      <Head title={`Slip Gaji - ${getRoleName(role)}`} />

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

        {/* Current Month Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Gaji Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Gaji Kotor</p>
                <p className="text-2xl font-bold text-blue-600">Rp 15.000.000</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600 font-medium">Total Potongan</p>
                <p className="text-2xl font-bold text-red-600">Rp 2.000.000</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Gaji Bersih</p>
                <p className="text-2xl font-bold text-green-600">Rp 13.000.000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Slip Gaji History */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Slip Gaji</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {slipGajiHistory.map((slip) => (
                <div key={slip.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{slip.period}</h4>
                      <p className="text-sm text-gray-600">
                        Dibayar: {new Date(slip.paidDate).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(slip.status)}>
                      {getStatusText(slip.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Gaji Kotor</p>
                      <p className="font-medium">Rp {slip.grossSalary.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Potongan</p>
                      <p className="font-medium text-red-600">Rp {slip.deductions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Gaji Bersih</p>
                      <p className="font-medium text-green-600">Rp {slip.netSalary.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}