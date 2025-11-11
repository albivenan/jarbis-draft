import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wrench,
  Users,
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  Package,
  Target
} from 'lucide-react';

interface DashboardProps {
  roleInfo?: {
    name: string;
    description: string;
  };
  dashboardModules?: string[];
}

export default function Dashboard({ roleInfo }: DashboardProps) {
  const stats = [
    {
      title: 'Produksi Hari Ini',
      value: '18',
      unit: 'unit',
      icon: Wrench,
      trend: '+8%',
      color: 'text-blue-600'
    },
    {
      title: 'Tim Aktif',
      value: '15',
      unit: 'crew',
      icon: Users,
      trend: '100%',
      color: 'text-green-600'
    },
    {
      title: 'QC Pending',
      value: '2',
      unit: 'item',
      icon: ClipboardCheck,
      trend: '-1',
      color: 'text-orange-600'
    },
    {
      title: 'Efisiensi',
      value: '92',
      unit: '%',
      icon: TrendingUp,
      trend: '+3%',
      color: 'text-purple-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'production',
      message: 'Produksi rangka besi selesai - 8 unit',
      time: '15 menit lalu',
      status: 'completed'
    },
    {
      id: 2,
      type: 'quality',
      message: 'QC pagar besi - Lolos standar kualitas',
      time: '30 menit lalu',
      status: 'completed'
    },
    {
      id: 3,
      type: 'team',
      message: 'Tim Welding B mencapai target produksi',
      time: '1 jam lalu',
      status: 'completed'
    },
    {
      id: 4,
      type: 'alert',
      message: 'Mesin las #3 perlu maintenance rutin',
      time: '2 jam lalu',
      status: 'alert'
    }
  ];

  const quickStats = [
    {
      title: 'Target Mingguan',
      value: '100',
      unit: 'unit',
      progress: 68,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Stok Bahan Baku',
      value: '85',
      unit: '%',
      status: 'Aman',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Mesin Aktif',
      value: '12/15',
      unit: 'unit',
      status: 'Normal',
      icon: Wrench,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Tim Hadir',
      value: '15/15',
      unit: 'orang',
      status: '100%',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Dashboard Manajer Produksi Besi"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/produksi-besi' }
      ]}
    >
      <Head title="Dashboard Manajer Produksi Besi" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Wrench className="h-8 w-8 text-blue-600" />
              Dashboard Produksi Besi
            </h1>
            <p className="text-gray-600 mt-1">{roleInfo?.description || 'Mengelola produksi khusus lini besi'}</p>
          </div>
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            Lini Produksi Besi
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

        {/* Quick Stats Widget */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <div key={index} className={`p-4 rounded-lg ${stat.bgColor}`}>
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    {stat.progress && (
                      <span className="text-xs font-medium text-gray-600">{stat.progress}%</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-baseline gap-1">
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    <span className="text-sm text-gray-500">{stat.unit}</span>
                  </div>
                  {stat.status && (
                    <p className="text-xs text-gray-600 mt-1">{stat.status}</p>
                  )}
                  {stat.progress && (
                    <div className="mt-2 w-full bg-white rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${stat.color.replace('text-', 'bg-')}`}
                        style={{ width: `${stat.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className={`p-1 rounded-full ${activity.status === 'completed' ? 'bg-green-100' :
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
            <CardTitle>Ringkasan Produksi Besi Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Wrench className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-700">18</p>
                <p className="text-sm text-blue-600">Unit Selesai</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Package className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-700">9</p>
                <p className="text-sm text-gray-600">Dalam Proses</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <ClipboardCheck className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-700">2</p>
                <p className="text-sm text-orange-600">Menunggu QC</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}