import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardList, Search, Play, CheckCircle, Clock, Package } from 'lucide-react';

export default function DaftarTugas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tasks = [
    {
      id: 'TASK-BSI-001',
      workOrder: 'WO-BSI-001',
      taskName: 'Pemotongan Besi H-Beam',
      product: 'Rangka Besi H-Beam 200x100',
      quantity: 20,
      unit: 'batang',
      assignedDate: '2025-01-05',
      deadline: '2025-01-06',
      status: 'in_progress',
      priority: 'high',
      supervisor: 'Supervisor Besi A',
      estimatedHours: 8,
      actualHours: 4,
      materials: [
        { code: 'MAT-BSI-001', name: 'Besi H-Beam 200x100', qty: 20, unit: 'batang' }
      ],
      tools: ['Mesin Potong Besi', 'Penggaris Besi', 'Kacamata Safety'],
      instructions: 'Potong besi H-Beam sesuai dengan spesifikasi teknis. Pastikan ukuran presisi dan permukaan rata.'
    },
    {
      id: 'TASK-BSI-002',
      workOrder: 'WO-BSI-001',
      taskName: 'Pengelasan Rangka Utama',
      product: 'Rangka Besi H-Beam 200x100',
      quantity: 10,
      unit: 'joint',
      assignedDate: '2025-01-06',
      deadline: '2025-01-07',
      status: 'pending',
      priority: 'high',
      supervisor: 'Supervisor Besi A',
      estimatedHours: 12,
      actualHours: 0,
      materials: [
        { code: 'MAT-BSI-007', name: 'Kawat Las E6013', qty: 5, unit: 'kg' }
      ],
      tools: ['Mesin Las SMAW', 'Helm Las', 'Sarung Tangan Las'],
      instructions: 'Las semua sambungan rangka utama dengan teknik SMAW. Periksa kualitas las setiap joint.'
    },
    {
      id: 'TASK-BSI-003',
      workOrder: 'WO-BSI-002',
      taskName: 'Finishing Cat Anti Karat',
      product: 'Pagar Besi Ornamen',
      quantity: 50,
      unit: 'meter',
      assignedDate: '2025-01-04',
      deadline: '2025-01-05',
      status: 'completed',
      priority: 'medium',
      supervisor: 'Supervisor Besi B',
      estimatedHours: 6,
      actualHours: 5.5,
      materials: [
        { code: 'MAT-BSI-004', name: 'Cat Anti Karat', qty: 15, unit: 'liter' }
      ],
      tools: ['Spray Gun', 'Kompresor', 'Masker Debu'],
      instructions: 'Aplikasikan cat anti karat secara merata. Pastikan tidak ada bagian yang terlewat.'
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

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Tinggi';
      case 'medium': return 'Sedang';
      case 'low': return 'Rendah';
      default: return priority;
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
      title: 'Menunggu',
      value: tasks.filter(t => t.status === 'pending').length.toString(),
      icon: Package,
      color: 'text-purple-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Daftar Tugas Harian"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-produksi-besi' },
        { title: 'Tugas Produksi', href: '#' },
        { title: 'Daftar Tugas Harian', href: '/roles/staf-produksi-besi/tugas/daftar-tugas' }
      ]}
    >
      <Head title="Daftar Tugas Harian - Staf Produksi Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="h-8 w-8 text-gray-600" />
              Daftar Tugas Harian
            </h1>
            <p className="text-gray-600 mt-1">Kelola dan update progres tugas produksi besi</p>
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
        <Card>
          <CardHeader>
            <CardTitle>Tugas Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="p-6 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-medium">{task.taskName}</h4>
                      <p className="text-sm text-gray-600">{task.workOrder} - {task.product}</p>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Target & Deadline</p>
                      <p className="text-sm text-gray-900">{task.quantity} {task.unit}</p>
                      <p className="text-xs text-gray-500">
                        Deadline: {new Date(task.deadline).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Waktu Kerja</p>
                      <p className="text-sm text-gray-900">
                        {task.actualHours}h / {task.estimatedHours}h
                      </p>
                      <p className="text-xs text-gray-500">Supervisor: {task.supervisor}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Progress</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gray-600 h-2 rounded-full" 
                            style={{ width: `${task.status === 'completed' ? 100 : task.status === 'in_progress' ? 50 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">
                          {task.status === 'completed' ? '100%' : task.status === 'in_progress' ? '50%' : '0%'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Material Dibutuhkan</p>
                      <div className="space-y-1">
                        {task.materials.map((material, index) => (
                          <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                            {material.name} - {material.qty} {material.unit}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Tools & Equipment</p>
                      <div className="flex flex-wrap gap-1">
                        {task.tools.map((tool, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Instruksi Kerja</p>
                    <p className="text-sm text-gray-600">{task.instructions}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {task.status === 'pending' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Play className="w-4 h-4 mr-1" />
                        Mulai Tugas
                      </Button>
                    )}
                    {task.status === 'in_progress' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Selesaikan
                        </Button>
                        <Button variant="outline" size="sm">
                          Update Progress
                        </Button>
                      </>
                    )}
                    {task.status === 'completed' && (
                      <Button variant="outline" size="sm" disabled>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Selesai
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      Detail
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}