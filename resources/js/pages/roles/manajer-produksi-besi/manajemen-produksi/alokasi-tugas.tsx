import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, UserPlus, Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

export default function AlokasiTugas() {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string>('');
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [estimatedHours, setEstimatedHours] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  const [priority, setPriority] = useState<string>('');

  const workOrders = [
    {
      id: 'WO-BSI-001',
      product: 'Rangka Besi H-Beam 200x100',
      quantity: 5,
      unit: 'unit',
      deadline: '2025-01-08',
      status: 'active',
      progress: 45
    },
    {
      id: 'WO-BSI-002',
      product: 'Pagar Besi Ornamen',
      quantity: 10,
      unit: 'meter',
      deadline: '2025-01-10',
      status: 'active',
      progress: 20
    },
    {
      id: 'WO-BSI-003',
      product: 'Struktur Baja Ringan',
      quantity: 15,
      unit: 'unit',
      deadline: '2025-01-12',
      status: 'pending',
      progress: 0
    }
  ];

  const operators = [
    {
      id: 'OP-001',
      name: 'Ahmad Santoso',
      skill: 'Pengelasan SMAW',
      level: 'Senior',
      currentLoad: 75,
      maxCapacity: 8,
      currentTasks: 3,
      status: 'available'
    },
    {
      id: 'OP-002',
      name: 'Budi Prasetyo',
      skill: 'Cutting & Grinding',
      level: 'Senior',
      currentLoad: 90,
      maxCapacity: 8,
      currentTasks: 4,
      status: 'busy'
    },
    {
      id: 'OP-003',
      name: 'Candra Wijaya',
      skill: 'Pengelasan TIG',
      level: 'Junior',
      currentLoad: 50,
      maxCapacity: 6,
      currentTasks: 2,
      status: 'available'
    },
    {
      id: 'OP-004',
      name: 'Dedi Kurniawan',
      skill: 'Assembly & Finishing',
      level: 'Senior',
      currentLoad: 60,
      maxCapacity: 8,
      currentTasks: 2,
      status: 'available'
    },
    {
      id: 'OP-005',
      name: 'Eko Susanto',
      skill: 'Pengelasan SMAW',
      level: 'Junior',
      currentLoad: 40,
      maxCapacity: 6,
      currentTasks: 1,
      status: 'available'
    }
  ];

  const assignedTasks = [
    {
      id: 'TASK-001',
      workOrder: 'WO-BSI-001',
      taskName: 'Pengelasan H-Beam Utama',
      operatorId: 'OP-001',
      operatorName: 'Ahmad Santoso',
      assignedDate: '2025-01-05',
      deadline: '2025-01-06',
      estimatedHours: 6,
      status: 'in_progress',
      priority: 'high',
      progress: 60
    },
    {
      id: 'TASK-002',
      workOrder: 'WO-BSI-001',
      taskName: 'Cutting Material H-Beam',
      operatorId: 'OP-002',
      operatorName: 'Budi Prasetyo',
      assignedDate: '2025-01-05',
      deadline: '2025-01-06',
      estimatedHours: 4,
      status: 'completed',
      priority: 'high',
      progress: 100
    },
    {
      id: 'TASK-003',
      workOrder: 'WO-BSI-002',
      taskName: 'Pembuatan Ornamen Pagar',
      operatorId: 'OP-003',
      operatorName: 'Candra Wijaya',
      assignedDate: '2025-01-05',
      deadline: '2025-01-07',
      estimatedHours: 8,
      status: 'pending',
      priority: 'medium',
      progress: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-red-100 text-red-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Tersedia';
      case 'busy': return 'Sibuk';
      case 'offline': return 'Offline';
      case 'completed': return 'Selesai';
      case 'in_progress': return 'Dalam Progres';
      case 'pending': return 'Menunggu';
      case 'overdue': return 'Terlambat';
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Senior': return 'bg-blue-100 text-blue-800';
      case 'Junior': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoadColor = (load: number) => {
    if (load >= 90) return 'text-red-600';
    if (load >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleAssignTask = () => {
    if (!selectedWorkOrder || !selectedOperator || !taskDescription || !estimatedHours || !deadline || !priority) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    // Here would be the API call to assign the task
    console.log({
      workOrder: selectedWorkOrder,
      operator: selectedOperator,
      description: taskDescription,
      estimatedHours: parseFloat(estimatedHours),
      deadline,
      priority,
      assignedDate: new Date().toISOString()
    });

    alert('Tugas berhasil dialokasikan!');
    
    // Reset form
    setSelectedWorkOrder('');
    setSelectedOperator('');
    setTaskDescription('');
    setEstimatedHours('');
    setDeadline('');
    setPriority('');
  };

  const stats = [
    {
      title: 'Total Operator',
      value: operators.length.toString(),
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Operator Tersedia',
      value: operators.filter(op => op.status === 'available').length.toString(),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Tugas Aktif',
      value: assignedTasks.filter(task => task.status === 'in_progress').length.toString(),
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Tugas Pending',
      value: assignedTasks.filter(task => task.status === 'pending').length.toString(),
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Alokasi Tugas Operator"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-produksi-besi' },
        { title: 'Manajemen Produksi', href: '#' },
        { title: 'Alokasi Tugas Operator', href: '/roles/manajer-produksi-besi/manajemen-produksi/alokasi-tugas' }
      ]}
    >
      <Head title="Alokasi Tugas Operator - Manajer Produksi Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-8 w-8 text-gray-600" />
              Alokasi Tugas Operator
            </h1>
            <p className="text-gray-600 mt-1">Kelola dan alokasikan tugas kepada operator produksi</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gray-600 hover:bg-gray-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Alokasi Tugas Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Alokasi Tugas Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Work Order <span className="text-red-500">*</span>
                    </label>
                    <Select value={selectedWorkOrder} onValueChange={setSelectedWorkOrder}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Work Order" />
                      </SelectTrigger>
                      <SelectContent>
                        {workOrders.map((wo) => (
                          <SelectItem key={wo.id} value={wo.id}>
                            {wo.id} - {wo.product}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Operator <span className="text-red-500">*</span>
                    </label>
                    <Select value={selectedOperator} onValueChange={setSelectedOperator}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.filter(op => op.status === 'available').map((op) => (
                          <SelectItem key={op.id} value={op.id}>
                            {op.name} - {op.skill} ({op.currentLoad}% load)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Deskripsi Tugas <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Jelaskan detail tugas yang akan dikerjakan..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Estimasi Waktu (jam) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(e.target.value)}
                      placeholder="8"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Deadline <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Prioritas <span className="text-red-500">*</span>
                    </label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih prioritas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Rendah</SelectItem>
                        <SelectItem value="medium">Sedang</SelectItem>
                        <SelectItem value="high">Tinggi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleAssignTask}
                  className="w-full bg-gray-600 hover:bg-gray-700"
                  disabled={!selectedWorkOrder || !selectedOperator || !taskDescription || !estimatedHours || !deadline || !priority}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Alokasikan Tugas
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Operators List */}
          <Card>
            <CardHeader>
              <CardTitle>Status Operator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operators.map((operator) => (
                  <div key={operator.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{operator.name}</h4>
                        <p className="text-sm text-gray-600">{operator.skill}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getLevelColor(operator.level)}>
                          {operator.level}
                        </Badge>
                        <Badge className={getStatusColor(operator.status)}>
                          {getStatusText(operator.status)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Workload</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                operator.currentLoad >= 90 ? 'bg-red-500' : 
                                operator.currentLoad >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${operator.currentLoad}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs font-medium ${getLoadColor(operator.currentLoad)}`}>
                            {operator.currentLoad}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Kapasitas</p>
                        <p className="font-medium">{operator.maxCapacity}h/hari</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tugas Aktif</p>
                        <p className="font-medium">{operator.currentTasks} tugas</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assigned Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Tugas yang Dialokasikan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedTasks.map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-sm">{task.taskName}</h4>
                        <p className="text-xs text-gray-600">{task.workOrder} - {task.operatorName}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge className={getPriorityColor(task.priority)} size="sm">
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)} size="sm">
                          {getStatusText(task.status)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-gray-600">Deadline</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.deadline).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Estimasi</p>
                        <p className="font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.estimatedHours}h
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-600 h-2 rounded-full" 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{task.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}