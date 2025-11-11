import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TreePine, BarChart3, TrendingUp, Download } from 'lucide-react';

export default function Reports() {
  const reportData = [
    {
      title: 'Produksi Harian',
      period: 'Hari Ini',
      value: '24 unit',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Produksi Mingguan',
      period: 'Minggu Ini',
      value: '156 unit',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Produksi Bulanan',
      period: 'September 2025',
      value: '642 unit',
      change: '+15%',
      trend: 'up'
    },
    {
      title: 'Efisiensi Tim',
      period: 'Rata-rata',
      value: '87%',
      change: '+5%',
      trend: 'up'
    }
  ];

  return (
    <AuthenticatedLayout>
      <Head title="Laporan Produksi Kayu" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TreePine className="h-8 w-8 text-green-600" />
              Laporan Produksi Kayu
            </h1>
            <p className="text-gray-600 mt-1">Analisis dan laporan produksi lini kayu</p>
          </div>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportData.map((report, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{report.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{report.value}</p>
                    <p className="text-sm text-gray-500">{report.period}</p>
                  </div>
                  <div className={`flex items-center gap-1 ${
                    report.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">{report.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detail Laporan Produksi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Grafik dan detail laporan akan ditampilkan di sini...</p>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
