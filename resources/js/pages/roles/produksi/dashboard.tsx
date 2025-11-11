import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TreePine, 
  Users, 
  ClipboardCheck, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  Package,
  BarChart3
} from 'lucide-react';

interface DashboardProps {
  roleInfo: {
    name: string;
    description: string;
  };
  dashboardModules: string[];
}

export default function Dashboard({ roleInfo, dashboardModules }: DashboardProps) {
  const stats = [
    {
      title: 'Produksi Hari Ini',
      value: '24',
      unit: 'unit',
      icon: TreePine,
      trend: '+12%',
      color: 'text-green-600'
    },
    {
      title: 'Tim Aktif',
      value: '18',
      unit: 'crew',
      icon: Users,
      trend: '100%',
      color: 'text-blue-600'
    },
    {
      title: 'QC Pending',
      value: '3',
      unit: 'item',
      icon: ClipboardCheck,
      trend: '-2',
      color: 'text-orange-600'
    },
    {
      title: 'Efisiensi',
      value: '87',
      unit: '%',
      icon: TrendingUp,
      trend: '+5%',
      color: 'text-purple-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'production',
      message: 'Produksi meja kayu jati selesai - 5 unit',
      time: '10 menit lalu',
      status: 'completed'
    },
    {
      id: 2,
      type: 'quality',
      message: 'QC lemari kayu mahoni - Perlu revisi finishing',
      time: '25 menit lalu',
      status: 'pending'
    },
    {
      id: 3,
      type: 'team',
      message: 'Tim Finishing A menyelesaikan target harian',
      time: '1 jam lalu',
      status: 'completed'
    },
    {
      id: 4,
      type: 'alert',
      message: 'Stok kayu jati menipis - Perlu koordinasi PPIC',
      time: '2 jam lalu',
      status: 'alert'
    }
  ];

  const quickActions = [
    {
      title: 'Laporan Produksi',
      description: 'Lihat laporan produksi harian',
      icon: BarChart3,
      href: '/roles/produksi-kayu/reports',
      color: 'bg-blue-500'
    },
    {
      title: 'Quality Control',
      description: 'Monitor kualitas produk kayu',
      icon: ClipboardCheck,
      href: '/roles/produksi-kayu/quality-control',
      color: 'bg-green-500'
    },
    {
      title: 'Perencanaan',
      description: 'Kelola jadwal dan target produksi',
      icon: Calendar,
      href: '/roles/produksi-kayu/planning',
      color: 'bg-purple-500'
    },
    {
      title: 'Inventori Kayu',
      description: 'Cek stok bahan baku kayu',
      icon: Package,
      href: '/roles/ppic/inventory?filter=kayu',
      color: 'bg-orange-500'
    }
  ];

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard Manajer Produksi Kayu" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TreePine className="h-8 w-8 text-green-600" />
              Dashboard Produksi Kayu
            </h1>
            <p className="text-gray-600 mt-1">{roleInfo.description}</p>
          </div>
          <Badge variant="outline" className="text-green-700 border-green-300">
            Lini Produksi Kayu
          </Badge>
        </div>

        {/* Stats Cards */}
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
                  <div className={`p-3 rounded-full bg-gray-100`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={action.href}>Buka</a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className={`p-1 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-100' :
                      activity.status === 'pending' ? 'bg-orange-100' :
                      'bg-red-100'
                    }`}>
                      {activity.status === 'completed' && <ClipboardCheck className="h-4 w-4 text-green-600" />}
                      {activity.status === 'pending' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                      {activity.status === 'alert' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Production Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Produksi Kayu Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-700">24</p>
                <p className="text-sm text-green-600">Unit Selesai</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-700">12</p>
                <p className="text-sm text-blue-600">Dalam Proses</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <ClipboardCheck className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-700">3</p>
                <p className="text-sm text-orange-600">Menunggu QC</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
