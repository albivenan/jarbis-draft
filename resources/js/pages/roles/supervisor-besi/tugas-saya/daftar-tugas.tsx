import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ClipboardList, Search, Play, CheckCircle, Clock, Package, Users, AlertTriangle } from 'lucide-react';

export default function DaftarTugas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tasks = [
    {
      id: 'TASK-SUP-BSI-001',
      workOrder: 'WO-BSI-001',
      taskName: 'Supervisi Pengelasan H-Beam',
      product: 'Rangka Besi H-Beam 200x100',
      assignedCrew: ['Ahmad Santoso', 'Budi Prasetyo'],
      assignedDate: '2025-01-05',
      deadline: '2025-01-06',
      status: 'in_progress',
      priority: 'high',
      progress: 75,
      estimatedHours: 8,
      actualHours: 6,
      description: 'Mengawasi dan memastikan kualitas pengelasan H-beam sesuai standar teknis',
      checkpoints: [
        { id: 1, name: 'Persiapan Material', status: 'completed', time: '08:00' },
        { id: 2, name: 'Proses Pengelasan', status: 'in_progress', time: '10:00' },
        { id: 3, name: 'Quality Check', status: 'pending', time: '-' },
        { id: 4, name: 'Final Inspection', status: 'pending', time: '-' }
      ]
    },
    {
      id: 'TASK-SUP-BSI-002',
      workOrder: 'WO-BSI-002',
      taskName: 'Supervisi Pemasangan Ornamen',
      product: 'Pagar Besi Ornamen',
      assignedCrew: ['Candra Wijaya', 'Eko Susanto'],
      assignedDate: '2025-01-05',
      deadline: '2025-01-07',
      status: 'pending',
      priority: 'medium',
      progress: 0,
      estimatedHours: 6,
      actualHours: 0,
      description: 'Mengawasi pemasangan ornamen pagar dan memastikan presisi pemasangan',
      checkpoints: [
        { id: 1, name: 'Persiapan Komponen', status: 'pending', time: '-' },
        { id: 2, name: 'Pemasangan Frame', status: 'pending', time: '-' },
        { id: 3, name: 'Instalasi Ornamen', status: 'pending', time: '-' },
        { id: 4, name: 'Final Check', status: 'pending', time: '-' }
      ]
    },
    {
      id: 'TASK-SUP-BSI-003',
      workOrder: 'WO-BSI-001',
      taskName: 'Supervisi Finishing Anti Karat',
      product: 'Rangka Besi H-Beam 200x100',
      assignedCrew: ['Dedi Kurniawan'],
      assignedDate: '2025-01-04',
      deadline: '2025-01-05',
      status: 'completed',
      priority: 'high',
      progress: 100,
      estimatedHours: 4,
      actualHours: 4.5,
      description: 'Mengawasi proses finishing cat anti karat dan quality control',
      checkpoints: [
        { id: 1, name: 'Persiapan Surface', status: 'completed', time: '08:00' },
        { id: 2, name: 'Aplikasi Primer', status: 'completed', time: '10:00' },
        { id: 3, name: 'Aplikasi Top Coat', status: 'completed', time: '13:00' },
        { id: 4, name: 'Final Inspection', status: 'completed', time: '15:30' }
      ]
    }
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.workOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

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

  const getCheckpointStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const stats = [
    {
      title: 'Total Tugas',
      value: tasks.length.toString(),
      icon: ClipboardList,
      color: 'text-blue-600'
    },
    {
      title: 'Dalam Progres',
      value: tasks.filter(t => t.status === 'in_progress').length.toString(),
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Selesai',
      value: tasks.filter(t => t.status === 'completed').length.toString(),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Crew Aktif',
      value: '5',
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Daftar Tugas Produksi"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/supervisor-besi' },
        { title: 'Tugas Saya', href: '#' },
        { title: 'Daftar Tugas Produksi', href: '/roles/supervisor-besi/tugas-saya/daftar-tugas' }
      ]}
    >
      <Head title="Daftar Tugas Produksi - Supervisor Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="h-8 w-8 text-gray-600" />
              Daftar Tugas Produksi
            </h1>
            <p className="text-gray-600 mt-1">Kelola dan supervisi tugas produksi besi</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-full bg-gray-100">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari berdasarkan nama tugas, WO, atau produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="in_progress">Dalam Progres</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="delayed">Terlambat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{task.taskName}</CardTitle>
                    <p className="text-sm text-gray-600">{task.workOrder} - {task.product}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge className={getStatusColor(task.status)}>
                      {getStatusText(task.status)}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress Supervisi</span>
                    <span className="text-sm font-bold">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-3" />
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">{task.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Crew yang Diawasi</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {task.assignedCrew.map((crew, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {crew}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Waktu Supervisi</p>
                      <p className="text-sm text-gray-900">
                        {task.actualHours}h / {task.estimatedHours}h
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Deadline</p>
                      <p className="text-sm text-gray-900">
                        {new Date(task.deadline).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Checkpoint Supervisi</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {task.checkpoints.map((checkpoint) => (
                        <div key={checkpoint.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <CheckCircle className={`w-4 h-4 ${getCheckpointStatusColor(checkpoint.status)}`} />
                          <div className="flex-1">
                            <p className="text-xs font-medium">{checkpoint.name}</p>
                            <p className="text-xs text-gray-500">{checkpoint.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {task.status === 'pending' && (
                      <Button size="sm" className="bg-gray-600 hover:bg-gray-700">
                        <Play className="w-4 h-4 mr-1" />
                        Mulai Supervisi
                      </Button>
                    )}
                    {task.status === 'in_progress' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Update Progress
                        </Button>
                        <Button variant="outline" size="sm">
                          Lapor Kendala
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm">
                      Detail Tugas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}