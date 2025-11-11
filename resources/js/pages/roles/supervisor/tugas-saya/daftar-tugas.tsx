import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';

interface Task {
  id: string;
  workOrder: string;
  productName: string;
  quantity: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  assignedCrew: string[];
  deadline: string;
  progress: number;
  estimatedHours: number;
  actualHours?: number;
}

export default function DaftarTugas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const tasks: Task[] = [
    {
      id: 'TSK-KY-001',
      workOrder: 'WO-KY-2024-001',
      productName: 'Meja Kayu Jati Premium',
      quantity: 50,
      priority: 'high',
      status: 'in_progress',
      assignedCrew: ['Ahmad Yusuf', 'Budi Santoso', 'Sari Dewi'],
      deadline: '2024-01-20',
      progress: 65,
      estimatedHours: 120,
      actualHours: 78
    },
    {
      id: 'TSK-KY-002',
      workOrder: 'WO-KY-2024-002',
      productName: 'Kursi Minimalis Set',
      quantity: 100,
      priority: 'medium',
      status: 'pending',
      assignedCrew: ['Eko Prasetyo', 'Dian Sari'],
      deadline: '2024-01-25',
      progress: 0,
      estimatedHours: 80
    },
    {
      id: 'TSK-KY-003',
      workOrder: 'WO-KY-2024-003',
      productName: 'Lemari Pakaian 3 Pintu',
      quantity: 25,
      priority: 'low',
      status: 'completed',
      assignedCrew: ['Fitri Handayani', 'Gani Wijaya'],
      deadline: '2024-01-18',
      progress: 100,
      estimatedHours: 60,
      actualHours: 58
    },
    {
      id: 'TSK-KY-004',
      workOrder: 'WO-KY-2024-004',
      productName: 'Rak Buku Minimalis',
      quantity: 75,
      priority: 'high',
      status: 'delayed',
      assignedCrew: ['Hendra Kusuma'],
      deadline: '2024-01-16',
      progress: 40,
      estimatedHours: 90,
      actualHours: 65
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.workOrder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Daftar Tugas Produksi Kayu</h1>
        <Button>Tambah Tugas Baru</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tugas</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sedang Dikerjakan</p>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'in_progress').length}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Selesai</p>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'completed').length}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terlambat</p>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'delayed').length}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari berdasarkan nama produk atau work order..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="in_progress">Sedang Dikerjakan</option>
              <option value="completed">Selesai</option>
              <option value="delayed">Terlambat</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{task.productName}</h3>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority === 'high' ? 'Tinggi' : 
                       task.priority === 'medium' ? 'Sedang' : 'Rendah'}
                    </Badge>
                    <Badge className={getStatusColor(task.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(task.status)}
                        <span>
                          {task.status === 'pending' ? 'Menunggu' :
                           task.status === 'in_progress' ? 'Dikerjakan' :
                           task.status === 'completed' ? 'Selesai' : 'Terlambat'}
                        </span>
                      </div>
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Work Order:</span> {task.workOrder}</p>
                    <p><span className="font-medium">Jumlah:</span> {task.quantity} unit</p>
                    <p><span className="font-medium">Deadline:</span> {task.deadline}</p>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">Crew:</span> {task.assignedCrew.join(', ')}
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-sm">
                    <p className="font-medium">Progress: {task.progress}%</p>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Estimasi: {task.estimatedHours}h</p>
                    {task.actualHours && (
                      <p>Aktual: {task.actualHours}h</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Detail</Button>
                    <Button size="sm">Update</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Tidak ada tugas yang sesuai dengan filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
