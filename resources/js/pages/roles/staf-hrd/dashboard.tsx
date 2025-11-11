import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface DashboardProps {
  roleInfo?: {
    name: string;
    description: string;
  };
  dashboardModules?: any[];
}

export default function Dashboard({ roleInfo, dashboardModules }: DashboardProps) {
  const stats = [
    {
      title: 'Total Karyawan',
      value: '156',
      unit: 'orang',
      icon: Users,
      trend: '+3 bulan ini',
      color: 'text-blue-600'
    },
    {
      title: 'Hadir Hari Ini',
      value: '142',
      unit: 'orang',
      icon: CheckCircle,
      trend: '91% kehadiran',
      color: 'text-green-600'
    },
    {
      title: 'Pengajuan Cuti',
      value: '8',
      unit: 'pending',
      icon: Clock,
      trend: 'Perlu review',
      color: 'text-orange-600'
    },
    {
      title: 'Dokumen Baru',
      value: '12',
      unit: 'dokumen',
      icon: FileText,
      trend: 'Minggu ini',
      color: 'text-purple-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'employee',
      title: 'Karyawan baru bergabung',
      description: 'Ahmad Susanto - Staf Produksi Besi',
      time: '2 jam yang lalu',
      status: 'success'
    },
    {
      id: 2,
      type: 'leave',
      title: 'Pengajuan cuti disetujui',
      description: 'Siti Nurhaliza - 3 hari cuti tahunan',
      time: '4 jam yang lalu',
      status: 'info'
    },
    {
      id: 3,
      type: 'document',
      title: 'Dokumen SK diupload',
      description: 'SK Promosi Jabatan - 5 karyawan',
      time: '1 hari yang lalu',
      status: 'success'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Dashboard HRD"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-hrd' }
      ]}
    >
      <Head title="Dashboard - Staf HRD" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Staf HRD</h1>
            <p className="text-gray-600 mt-1">Kelola data karyawan dan administrasi perusahaan</p>
          </div>
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            {roleInfo?.name || 'Staf HRD'}
          </Badge>
        </div>

        {/* Statistics */}
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

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Akses Cepat - Data Karyawan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a href="/roles/staf-hrd/karyawan/daftar" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Daftar Karyawan</p>
                      <p className="text-sm text-gray-600">Lihat dan kelola data karyawan</p>
                    </div>
                  </div>
                </a>
                <a href="/roles/hrd/attendance" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Absensi & Kehadiran</p>
                      <p className="text-sm text-gray-600">Monitor kehadiran karyawan</p>
                    </div>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Akses Cepat - Administrasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a href="/roles/staf-hrd/administrasi/dokumen" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Dokumen & Arsip</p>
                      <p className="text-sm text-gray-600">Kelola dokumen perusahaan</p>
                    </div>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}