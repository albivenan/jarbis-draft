import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Eye, Calendar, Clock, Users, AlertTriangle, CheckCircle, Package } from 'lucide-react';

export default function MonitoringProgres() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterOperator, setFilterOperator] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const workOrders = [
    {
      id: 'WO-KYU-001',
      product: 'Meja Kayu Jati Custom',
      quantity: 5,
      unit: 'unit',
      startDate: '2025-01-05',
      deadline: '2025-01-08',
      status: 'in_progress',
      priority: 'high',
      progress: 70,
      tasks: [
        {
          id: 'TASK-001',
          name: 'Pemotongan Kayu Jati',
          operator: 'Slamet Riyadi',
          status: 'completed',
          progress: 100,
          estimatedHours: 4,
          actualHours: 3.5,
          startTime: '08:00',
          endTime: '11:30'
        },
        {
          id: 'TASK-002',
          name: 'Assembly & Joinery',
          operator: 'Agus Prasetyo',
          status: 'in_progress',
          progress: 60,
          estimatedHours: 6,
          actualHours: 3.5,
          startTime: '12:00',
          endTime: '-'
        },
        {
          id: 'TASK-003',
          name: 'Finishing & QC',
          operator: 'Bambang Sutrisno',
          status: 'pending',
          progress: 0,
          estimatedHours: 4,
          actualHours: 0,
          startTime: '-',
          endTime: '-'
        }
      ]
    },
    {
      id: 'WO-KYU-002',
      product: 'Lemari Kayu Mahoni',
      quantity: 3,
      unit: 'unit',
      startDate: '2025-01-05',
      deadline: '2025-01-10',
      status: 'in_progress',
      priority: 'medium',
      progress: 40,
      tasks: [
        {
          id: 'TASK-004',
          name: 'Persiapan & Cutting',
          operator: 'Dedi Kurniawan',
          status: 'completed',
          progress: 100,
          estimatedHours: 3,
          actualHours: 3,
          startTime: '08:00',
          endTime: '11:00'
        },
        {
          id: 'TASK-005',
          name: 'Finishing Duco Premium',
          operator: 'Bambang Sutrisno',
          status: 'in_progress',
          progress: 30,
          estimatedHours: 8,
          actualHours: 2.5,
          startTime: '13:00',
          endTime: '-'
        }
      ]
    },
    {
      id: 'WO-KYU-003',
      product: 'Kursi Kayu Jati Ukir',
      quantity: 8,
      unit: 'unit',
      startDate: '2025-01-06',
      deadline: '2025-01-12',
      status: 'pending',
      priority: 'low',
      progress: 0,
      tasks: [
        {
          id: 'TASK-006',
          name: 'Persiapan Material',
          operator: 'Slamet Riyadi',
          status: 'pending',
          progress: 0,
          estimatedHours: 2,
          actualHours: 0,
          startTime: '-',
          endTime: '-'
        }
      ]
    }
  ];

  const operators = [
    { id: 'OP-001', name: 'Slamet Riyadi', currentTasks: 2, efficiency: 92 },
    { id: 'OP-002', name: 'Bambang Sutrisno', currentTasks: 2, efficiency: 88 },
    { id: 'OP-003', name: 'Agus Prasetyo', currentTasks: 1, efficiency: 90 },
    { id: 'OP-004', name: 'Candra Wijaya', currentTasks: 1, efficiency: 95 },
    { id: 'OP-005', name: 'Dedi Kurniawan', currentTasks: 1, efficiency: 87 }
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

  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesSearch = wo.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || wo.status === filterStatus;
    const matchesOperator = filterOperator === 'all' || 
                           wo.tasks.some(task => task.operator.toLowerCase().includes(filterOperator.toLowerCase()));
    
    return matchesSearch && matchesStatus && matchesOperator;
  });

  const stats = [
    {
      title: 'Total Work Order',
      value: workOrders.length.toString(),
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Dalam Progres',
      value: workOrders.filter(wo => wo.status === 'in_progress').length.toString(),
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Selesai Hari Ini',
      value: workOrders.filter(wo => wo.status === 'completed').length.toString(),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Rata-rata Progress',
      value: `${Math.round(workOrders.reduce((acc, wo) => acc + wo.progress, 0) / workOrders.length)}%`,
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Monitoring Progres Lapangan"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-produksi-kayu' },
        { title: 'Manajemen Produksi', href: '#' },
        { title: 'Monitoring Progres Lapangan', href: '/roles/manajer-produksi-kayu/manajemen-produksi/monitoring-progres' }
      ]}
    >
      <Head title="Monitoring Progres Lapangan - Manajer Produksi Kayu" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-amber-600" />
              Monitoring Progres Lapangan
            </h1>
            <p className="text-gray-600 mt-1">Monitor progres real-time produksi kayu di lapangan</p>
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
                <Input
                  placeholder="Cari berdasarkan Work Order atau produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
              <Select value={filterOperator} onValueChange={setFilterOperator}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Operator</SelectItem>
                  {operators.map((op) => (
                    <SelectItem key={op.id} value={op.name}>
                      {op.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Work Orders Progress */}
        <div className="space-y-6">
          {filteredWorkOrders.map((workOrder) => (
            <Card key={workOrder.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{workOrder.id} - {workOrder.product}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {workOrder.quantity} {workOrder.unit} • 
                      Deadline: {new Date(workOrder.deadline).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(workOrder.priority)}>
                      {getPriorityText(workOrder.priority)}
                    </Badge>
                    <Badge className={getStatusColor(workOrder.status)}>
                      {getStatusText(workOrder.status)}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress Keseluruhan</span>
                    <span className="text-sm font-bold">{workOrder.progress}%</span>
                  </div>
                  <Progress value={workOrder.progress} className="h-3" />
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Detail Tugas
                  </h4>
                  
                  <div className="space-y-3">
                    {workOrder.tasks.map((task) => (
                      <div key={task.id} className="p-4 border rounded-lg bg-amber-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-medium">{task.name}</h5>
                            <p className="text-sm text-gray-600">Operator: {task.operator}</p>
                          </div>
                          <Badge className={getStatusColor(task.status)}>
                            {getStatusText(task.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-600">Progress</p>
                            <div className="flex items-center gap-2">
                              <Progress value={task.progress} className="flex-1 h-2" />
                              <span className="text-xs font-medium">{task.progress}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Waktu</p>
                            <p className="text-sm font-medium">
                              {task.actualHours}h / {task.estimatedHours}h
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Mulai</p>
                            <p className="text-sm font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.startTime}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Selesai</p>
                            <p className="text-sm font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.endTime}
                            </p>
                          </div>
                        </div>
                        
                        {task.status === 'in_progress' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              Detail
                            </Button>
                            <Button size="sm" variant="outline">
                              Update Progress
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Operator Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Kinerja Operator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {operators.map((operator) => (
                <div key={operator.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{operator.name}</h4>
                    <Badge variant="outline">{operator.currentTasks} tugas</Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Efisiensi</span>
                        <span className="font-medium">{operator.efficiency}%</span>
                      </div>
                      <Progress value={operator.efficiency} className="h-2" />
                    </div>
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