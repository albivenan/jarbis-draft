import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, CheckCircle, Clock, AlertTriangle, TrendingUp, Package, Users } from 'lucide-react';

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
      title: 'Tugas Hari Ini',
      value: '8',
      unit: 'tugas',
      icon: ClipboardList,
      trend: '2 selesai',
      color: 'text-blue-600'
    },
    {
      title: 'Tugas Selesai',
      value: '6',
      unit: 'tugas',
      icon: CheckCircle,
      trend: '75% completion',
      color: 'text-green-600'
    },
    {
      title: 'Dalam Progres',
      value: '2',
      unit: 'tugas',
      icon: Clock,
      trend: 'On schedule',
      color: 'text-orange-600'
    },
    {
      title: 'QC Check',
      value: '4',
      unit: 'item',
      icon: Package,
      trend: 'Menunggu QC',
      color: 'text-purple-600'
    }
  ];

  const todayTasks = [
    {
      id: 1,
      workOrder: 'WO-KYU-001',
      product: 'Meja Kayu Jati Custom',
      quantity: 5,
      unit: 'unit',
      status: 'in_progress',
      priority: 'high',
      deadline: '2025-01-05',
      progress: 60
    },
    {
      id: 2,
      workOrder: 'WO-KYU-002',
      product: 'Lemari Kayu Mahoni',
      quantity: 3,
      unit: 'unit',
      status: 'completed',
      priority: 'medium',
      deadline: '2025-01-04',
      progress: 100
    },
    {
      id: 3,
      workOrder: 'WO-KYU-003',
      product: 'Kursi Kayu Minimalis',
      quantity: 12,
      unit: 'unit',
      status: 'pending',
      priority: 'low',
      deadline: '2025-01-08',
      progress: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'in_progress': return 'Dalam Progres';
      case 'pending': return 'Menunggu';
      case 'delayed': return 'Terlambat';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Tinggi';
      case 'medium': return 'Sedang';
      case 'low': return 'Rendah';
      default: return priority;
    }
  };

  return (
    <AuthenticatedLayout
      title="Dashboard Produksi Kayu"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-produksi-kayu' }
      ]}
    >
      <Head title="Dashboard - Staf Produksi Kayu" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Staf Produksi Kayu</h1>
            <p className="text-gray-600 mt-1">Kelola tugas produksi dan monitor kualitas produk kayu</p>
          </div>
          <Badge variant="outline" className="text-amber-700 border-amber-300">
            {roleInfo?.name || 'Staf Produksi Kayu'}
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

        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-amber-600" />
              Tugas Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayTasks.map((task) => (
                <div key={task.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{task.workOrder}</h4>
                      <p className="text-sm text-gray-600">{task.product}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {getPriorityText(task.priority)}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusText(task.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Quantity</p>
                      <p className="font-medium">{task.quantity} {task.unit}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Deadline</p>
                      <p className="font-medium">{new Date(task.deadline).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Progress</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-amber-600 h-2 rounded-full" 
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{task.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">Aksi</p>
                      <div className="flex gap-1">
                        {task.status === 'pending' && (
                          <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Mulai
                          </button>
                        )}
                        {task.status === 'in_progress' && (
                          <button className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Update
                          </button>
                        )}
                        {task.status === 'completed' && (
                          <button className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            QC Check
                          </button>
                        )}
                      </div>
                    </div>
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
              <CardTitle>Akses Cepat - Tugas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a href="/roles/staf-produksi-kayu/tugas/daftar-tugas" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium">Daftar Tugas Harian</p>
                      <p className="text-sm text-gray-600">Lihat semua tugas produksi</p>
                    </div>
                  </div>
                </a>
                <a href="/roles/staf-produksi-kayu/tugas/instruksi-kerja" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Instruksi Kerja</p>
                      <p className="text-sm text-gray-600">Panduan dan SOP produksi</p>
                    </div>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Akses Cepat - Kualitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a href="/roles/staf-produksi-kayu/kualitas/checklist-qc" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Checklist QC</p>
                      <p className="text-sm text-gray-600">Periksa kualitas produk</p>
                    </div>
                  </div>
                </a>
                <a href="/roles/staf-produksi-kayu/kualitas/lapor-kendala" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">Lapor Kendala</p>
                      <p className="text-sm text-gray-600">Laporkan masalah produksi</p>
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