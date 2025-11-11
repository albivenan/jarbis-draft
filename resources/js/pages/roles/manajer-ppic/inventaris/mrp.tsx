import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, Calculator, Package, AlertTriangle } from 'lucide-react';

export default function MRP() {
  return (
    <AuthenticatedLayout
      title="Kebutuhan Material (MRP)"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-ppic' },
        { title: 'Manajemen Inventaris', href: '#' },
        { title: 'Kebutuhan Material (MRP)', href: '/roles/manajer-ppic/inventaris/mrp' }
      ]}
    >
      <Head title="Kebutuhan Material (MRP) - PPIC" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="h-8 w-8 text-green-600" />
              Material Requirements Planning (MRP)
            </h1>
            <p className="text-gray-600 mt-1">Hitung kebutuhan material berdasarkan jadwal produksi</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            Hitung MRP
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Kebutuhan</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-sm text-gray-500">item material</p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Perlu Dipesan</p>
                  <p className="text-2xl font-bold text-orange-600">23</p>
                  <p className="text-sm text-gray-500">item material</p>
                </div>
                <ClipboardList className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Kritis</p>
                  <p className="text-2xl font-bold text-red-600">5</p>
                  <p className="text-sm text-gray-500">item material</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hasil Perhitungan MRP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Perhitungan MRP</h3>
              <p className="text-gray-600 mb-4">Klik tombol "Hitung MRP" untuk memulai perhitungan kebutuhan material</p>
              <Button className="bg-green-600 hover:bg-green-700">
                Mulai Perhitungan MRP
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}