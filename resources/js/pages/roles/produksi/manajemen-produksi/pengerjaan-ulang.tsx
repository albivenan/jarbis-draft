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
import { RefreshCw, Plus, Eye, Calendar, Clock, AlertTriangle, CheckCircle, Package } from 'lucide-react';

export default function PengerjaanUlang() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [reworkReason, setReworkReason] = useState<string>('');
  const [reworkInstructions, setReworkInstructions] = useState<string>('');
  const [assignedOperator, setAssignedOperator] = useState<string>('');

  const reworkItems = [
    {
      id: 'RW-KYU-001',
      workOrder: 'WO-KYU-001',
      product: 'Meja Kayu Jati Custom',
      originalTask: 'Finishing Duco Premium',
      qcRejectReason: 'Permukaan tidak rata, ada orange peel pada beberapa area',
      reportedBy: 'QC Kayu - Indra Wijaya',
      reportedDate: '2025-01-05',
      priority: 'high',
      status: 'pending',
      estimatedReworkTime: 4,
      assignedOperator: null,
      dueDate: '2025-01-06',
      images: ['rework_001_1.jpg', 'rework_001_2.jpg']
    },
    {
      id: 'RW-KYU-002',
      workOrder: 'WO-KYU-002',
      product: 'Lemari Kayu Mahoni',
      originalTask: 'Assembly & Joinery',
      qcRejectReason: 'Sambungan tidak presisi, ada celah pada joint pintu',
      reportedBy: 'QC Kayu - Indra Wijaya',
      reportedDate: '2025-01-04',
      priority: 'medium',
      status: 'in_progress',
      estimatedReworkTime: 6,
      assignedOperator: 'Agus Prasetyo',
      dueDate: '2025-01-07',
      actualStartTime: '2025-01-05 08:00',
      progress: 60,
      images: ['rework_002_1.jpg']
    },
    {
      id: 'RW-KYU-003',
      workOrder: 'WO-KYU-003',
      product: 'Kursi Kayu Jati Ukir',
      originalTask: 'Detail Ukiran Ornamen',
      qcRejectReason: 'Detail ukiran kurang halus, tidak sesuai dengan standar finishing',
      reportedBy: 'QC Kayu - Indra Wijaya',
      reportedDate: '2025-01-03',
      priority: 'low',
      status: 'completed',
      estimatedReworkTime: 8,
      assignedOperator: 'Candra Wijaya',
      dueDate: '2025-01-05',
      actualStartTime: '2025-01-04 08:00',
      actualEndTime: '2025-01-05 16:00',
      progress: 100,
      completedBy: 'Candra Wijaya',
      completedDate: '2025-01-05',
      images: ['rework_003_before.jpg', 'rework_003_after.jpg']
    }
  ];

  const operators = [
    { id: 'OP-001', name: 'Slamet Riyadi', skill: 'Pemotongan & Shaping', availability: 'available' },
    { id: 'OP-002', name: 'Bambang Sutrisno', skill: 'Finishing & Polishing', availability: 'busy' },
    { id: 'OP-003', name: 'Agus Prasetyo', skill: 'Assembly & Joinery', availability: 'available' },
    { id: 'OP-004', name: 'Candra Wijaya', skill: 'Ukiran & Ornamen', availability: 'available' },
    { id: 'OP-005', name: 'Dedi Kurniawan', skill: 'Pemotongan & Shaping', availability: 'available' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'in_progress': return 'Dalam Progres';
      case 'pending': return 'Menunggu';
      case 'cancelled': return 'Dibatalkan';
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

  const filteredItems = reworkItems.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.workOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAssignRework = () => {
    if (!selectedItem || !assignedOperator || !reworkInstructions) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    // Here would be the API call to assign rework
    console.log({
      itemId: selectedItem,
      operator: assignedOperator,
      reason: reworkReason,
      instructions: reworkInstructions,
      assignedDate: new Date().toISOString()
    });

    alert('Pengerjaan ulang berhasil dialokasikan!');
    
    // Reset form
    setSelectedItem(null);
    setReworkReason('');
    setReworkInstructions('');
    setAssignedOperator('');
  };

  const stats = [
    {
      title: 'Total Rework',
      value: reworkItems.length.toString(),
      icon: RefreshCw,
      color: 'text-blue-600'
    },
    {
      title: 'Menunggu',
      value: reworkItems.filter(item => item.status === 'pending').length.toString(),
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Dalam Progres',
      value: reworkItems.filter(item => item.status === 'in_progress').length.toString(),
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      title: 'Selesai',
      value: reworkItems.filter(item => item.status === 'completed').length.toString(),
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Permintaan Pengerjaan Ulang (Rework)"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-produksi-kayu' },
        { title: 'Manajemen Produksi', href: '#' },
        { title: 'Permintaan Pengerjaan Ulang (Rework)', href: '/roles/manajer-produksi-kayu/manajemen-produksi/pengerjaan-ulang' }
      ]}
    >
      <Head title="Permintaan Pengerjaan Ulang (Rework) - Manajer Produksi Kayu" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <RefreshCw className="h-8 w-8 text-amber-600" />
              Permintaan Pengerjaan Ulang (Rework)
            </h1>
            <p className="text-gray-600 mt-1">Kelola permintaan pengerjaan ulang dari QC untuk produk kayu</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Rework Manual
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Permintaan Rework Manual</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Work Order <span className="text-red-500">*</span>
                    </label>
                    <Input placeholder="Contoh: WO-KYU-001" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Prioritas <span className="text-red-500">*</span>
                    </label>
                    <Select>
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

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Alasan Rework <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={reworkReason}
                    onChange={(e) => setReworkReason(e.target.value)}
                    placeholder="Jelaskan alasan mengapa perlu pengerjaan ulang..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Instruksi Pengerjaan <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={reworkInstructions}
                    onChange={(e) => setReworkInstructions(e.target.value)}
                    placeholder="Berikan instruksi detail untuk pengerjaan ulang..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Assign ke Operator
                  </label>
                  <Select value={assignedOperator} onValueChange={setAssignedOperator}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.filter(op => op.availability === 'available').map((op) => (
                        <SelectItem key={op.id} value={op.id}>
                          {op.name} - {op.skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleAssignRework}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  disabled={!reworkInstructions}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Rework
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

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <Input
                  placeholder="Cari berdasarkan Work Order, produk, atau ID rework..."
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
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Prioritas</SelectItem>
                  <SelectItem value="high">Tinggi</SelectItem>
                  <SelectItem value="medium">Sedang</SelectItem>
                  <SelectItem value="low">Rendah</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Rework Items */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.id} - {item.product}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {item.workOrder} • Task: {item.originalTask}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(item.priority)}>
                      {getPriorityText(item.priority)}
                    </Badge>
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusText(item.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800 mb-1">Alasan Reject dari QC:</h4>
                        <p className="text-sm text-red-700">{item.qcRejectReason}</p>
                        <p className="text-xs text-red-600 mt-2">
                          Dilaporkan oleh: {item.reportedBy} • {new Date(item.reportedDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Estimasi Waktu Rework</p>
                      <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.estimatedReworkTime} jam
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Due Date</p>
                      <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.dueDate).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Operator</p>
                      <p className="text-lg font-bold text-gray-900">
                        {item.assignedOperator || 'Belum ditugaskan'}
                      </p>
                    </div>
                  </div>

                  {item.status === 'in_progress' && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress Rework</span>
                        <span className="text-sm font-bold">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-amber-600 h-2 rounded-full" 
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {item.status === 'completed' && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium text-green-800 mb-1">Rework Selesai</h4>
                          <p className="text-sm text-green-700">
                            Diselesaikan oleh: {item.completedBy} • {new Date(item.completedDate!).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      Detail
                    </Button>
                    {item.status === 'pending' && (
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                        Assign Operator
                      </Button>
                    )}
                    {item.status === 'in_progress' && (
                      <Button size="sm" variant="outline">
                        Update Progress
                      </Button>
                    )}
                    {item.images && item.images.length > 0 && (
                      <Button size="sm" variant="outline">
                        <Package className="w-3 h-3 mr-1" />
                        Lihat Foto ({item.images.length})
                      </Button>
                    )}
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
