import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Package, AlertTriangle, ClipboardList, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MRP() {
  return (
    <AuthenticatedLayout
      title="Kebutuhan Material (MRP)"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-ppic' },
        { title: 'Manajemen Inventaris', href: '#' },
        { title: 'Kebutuhan Material (MRP)', href: '/roles/staf-ppic/inventaris/mrp' }
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
            <p className="text-gray-600 mt-1">Lihat hasil perhitungan kebutuhan material</p>
          </div>
          <Badge variant="outline" className="text-green-700 border-green-300">
            Terakhir dihitung: 03 Jan 2025, 14:30
          </Badge>
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
            <CardTitle>Hasil Perhitungan MRP Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">MAT-BSI-001 - Besi Beton 12mm</h4>
                    <p className="text-sm text-gray-600">Kebutuhan: 250 batang | Stok: 150 batang</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Perlu Pesan: 100 batang</Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Detail
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">MAT-KYU-001 - Kayu Jati Grade A</h4>
                    <p className="text-sm text-gray-600">Kebutuhan: 15 m³ | Stok: 8 m³</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Perlu Pesan: 7 m³</Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Detail
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}