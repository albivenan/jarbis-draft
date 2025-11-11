import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, TrendingUp, Users, Factory } from 'lucide-react';

export default function AnalisisKapasitas() {
  return (
    <AuthenticatedLayout
      title="Analisis Kapasitas"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/ppic' },
        { title: 'Monitoring & Laporan', href: '#' },
        { title: 'Analisis Kapasitas', href: '/roles/ppic/monitoring/kapasitas' }
      ]}
    >
      <Head title="Analisis Kapasitas - PPIC" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart2 className="h-8 w-8 text-purple-600" />
              Analisis Kapasitas Produksi
            </h1>
            <p className="text-gray-600 mt-1">Analisis utilisasi kapasitas produksi per divisi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Kapasitas Besi</p>
                  <p className="text-2xl font-bold text-gray-600">85%</p>
                </div>
                <Factory className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Kapasitas Kayu</p>
                  <p className="text-2xl font-bold text-amber-600">72%</p>
                </div>
                <Factory className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rata-rata</p>
                  <p className="text-2xl font-bold text-purple-600">78%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Grafik Utilisasi Kapasitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analisis Kapasitas</h3>
              <p className="text-gray-600">Grafik utilisasi kapasitas akan ditampilkan di sini</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
