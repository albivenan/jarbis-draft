import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, BarChart2, Calendar, AlertTriangle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SimulasiJadwal() {
  // Sample simulation results (read-only for staff)
  const simulationResults = {
    totalOrders: 24,
    scheduledOrders: 20,
    delayedOrders: 4,
    averageDelay: 2.5,
    capacityUtilization: 85,
    lastRun: '2025-01-03 14:30',
    runBy: 'Manajer PPIC',
    recommendations: [
      'Tambah 1 shift untuk divisi Besi pada minggu ke-3',
      'Prioritaskan SO-2025-001 karena deadline ketat',
      'Pertimbangkan outsourcing untuk 2 pesanan kayu'
    ]
  };

  return (
    <AuthenticatedLayout
      title="Simulasi Jadwal"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-ppic' },
        { title: 'Perencanaan Produksi', href: '#' },
        { title: 'Simulasi Jadwal', href: '/roles/staf-ppic/perencanaan/simulasi' }
      ]}
    >
      <Head title="Simulasi Jadwal - PPIC" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="h-8 w-8 text-purple-600" />
              Hasil Simulasi Jadwal Produksi
            </h1>
            <p className="text-gray-600 mt-1">Lihat hasil simulasi penjadwalan terbaru</p>
          </div>
          <Badge variant="outline" className="text-purple-700 border-purple-300">
            Terakhir dijalankan: {simulationResults.lastRun}
          </Badge>
        </div>

        {/* Simulation Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Simulasi terakhir dijalankan oleh</p>
                <p className="font-medium text-gray-900">{simulationResults.runBy}</p>
                <p className="text-sm text-gray-500">{simulationResults.lastRun}</p>
              </div>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Lihat Detail Parameter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Simulation Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pesanan</p>
                  <p className="text-2xl font-bold text-gray-900">{simulationResults.totalOrders}</p>
                </div>
                <BarChart2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terjadwal</p>
                  <p className="text-2xl font-bold text-green-600">{simulationResults.scheduledOrders}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terlambat</p>
                  <p className="text-2xl font-bold text-red-600">{simulationResults.delayedOrders}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisasi Kapasitas</p>
                  <p className="text-2xl font-bold text-purple-600">{simulationResults.capacityUtilization}%</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rekomendasi Optimasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {simulationResults.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-blue-900">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Note for Staff */}
        <Card>
          <CardContent className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Catatan:</strong> Simulasi hanya dapat dijalankan oleh Manajer PPIC. 
                Halaman ini menampilkan hasil simulasi terbaru untuk referensi perencanaan.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}