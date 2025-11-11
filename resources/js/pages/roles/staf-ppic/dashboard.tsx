import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Package,
  Calendar,
  ClipboardList,
  TrendingUp,
  BarChart2,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface DashboardProps {
  roleInfo?: {
    name: string;
    description: string;
  };
}

export default function Dashboard({ roleInfo }: DashboardProps) {
  const stats = [
    {
      title: 'Tugas Hari Ini',
      value: '12',
      unit: 'tugas',
      icon: ClipboardList,
      trend: '8 selesai, 4 progress',
      color: 'text-blue-600'
    },
    {
      title: 'Pesanan Diproses',
      value: '15',
      unit: 'pesanan',
      icon: Calendar,
      trend: 'Dalam jadwal',
      color: 'text-green-600'
    },
    {
      title: 'Material Check',
      value: '6',
      unit: 'item',
      icon: Package,
      trend: 'Perlu review',
      color: 'text-purple-600'
    },
    {
      title: 'Efisiensi Kerja',
      value: '94',
      unit: '%',
      icon: TrendingUp,
      trend: 'Target 90%',
      color: 'text-orange-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Dashboard Staf PPIC"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-ppic' }
      ]}
    >
      <Head title="Dashboard Staf PPIC" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="h-8 w-8 text-blue-600" />
              Dashboard Staf PPIC
            </h1>
            <p className="text-gray-600 mt-1">{roleInfo?.description || 'Production Planning, Inventory & Control Staff'}</p>
          </div>
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            Staf PPIC
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <span className="text-sm text-gray-500">{stat.unit}</span>
                    </div>
                    <p className={`text-sm ${stat.color} font-medium`}>
                      {stat.trend}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-gray-100">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors cursor-pointer">
                <ClipboardList className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-blue-900">Input Data</p>
                <p className="text-sm text-blue-600">Entry pesanan baru</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors cursor-pointer">
                <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-900">Update Jadwal</p>
                <p className="text-sm text-green-600">Perbarui jadwal</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors cursor-pointer">
                <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-purple-900">Cek Material</p>
                <p className="text-sm text-purple-600">Verifikasi stok</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition-colors cursor-pointer">
                <BarChart2 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="font-medium text-orange-900">Laporan</p>
                <p className="text-sm text-orange-600">Buat laporan harian</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}