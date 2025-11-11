import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardList, Search, Eye, Clock, CheckCircle, AlertTriangle, Package, Calendar } from 'lucide-react';

export default function AntreanInspeksi() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const inspectionQueue = [
    {
      id: 'INS-BSI-001',
      workOrder: 'WO-BSI-001',
      product: 'Rangka Besi H-Beam 200x100',
      quantity: 5,
      unit: 'unit',
      submittedBy: 'Ahmad Santoso',
      submittedDate: '2025-01-05',
      requestedDate: '2025-01-05',
      priority: 'high',
      status: 'pending',
      supervisor: 'Supervisor Besi A',
      estimatedInspectionTime: 2,
      notes: 'Pengelasan selesai, siap untuk inspeksi kualitas',
      location: 'Workshop A - Bay 1'
    },
    {
      id: 'INS-BSI-002',
      workOrder: 'WO-BSI-002',
      product: 'Pagar Besi Ornamen',
      quantity: 10,
      unit: 'meter',
      submittedBy: 'Candra Wijaya',
      submittedDate: '2025-01-05',
      requestedDate: '2025-01-06',
      priority: 'medium',
      status: 'in_progress',
      supervisor: 'Supervisor Besi A',
      estimatedInspectionTime: 3,
      notes: 'Ornamen sudah terpasang, perlu inspeksi detail sambungan',
      location: 'Workshop A - Bay 2',
      inspectionStarted: '2025-01-05 14:00',
      inspector: 'QC Besi - Indra Wijaya'
    },
    {
      id: 'INS-BSI-003',
      workOrder: 'WO-BSI-001',
      product: 'Rangka Besi H-Beam 200x100',
      quantity: 3,
      unit: 'unit',
      submittedBy: 'Budi Prasetyo',
      submittedDate: '2025-01-04',
      requestedDate: '2025-01-04',
      priority: 'high',
      status: 'completed',
      supervisor: 'Supervisor Besi A',
      estimatedInspectionTime: 2,
      notes: 'Batch pertama H-beam untuk inspeksi final',
      location: 'Workshop A - Bay 1',
      inspectionStarted: '2025-01-04 10:00',
      inspectionCompleted: '2025-01-04 12:00',
      inspector: 'QC Besi - Indra Wijaya',
      result: 'passed',
      score: 95
    },
    {
      id: 'INS-BSI-004',
      workOrder: 'WO-BSI-003',
      product: 'Struktur Baja Ringan',
      quantity: 8,
      unit: 'unit',
      submittedBy: 'Dedi Kurniawan',
      submittedDate: '2025-01-05',
      requestedDate: '2025-01-07',
      priority: 'low',
      status: 'scheduled',
      supervisor: 'Supervisor Besi B',
      estimatedInspectionTime: 4,
      notes: 'Struktur baja ringan siap untuk inspeksi komprehensif',
      location: 'Workshop B - Bay 1'
    }
  ];

  const filteredQueue = inspectionQueue.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.workOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'in_progress': return 'Sedang Inspeksi';
      case 'pending': return 'Menunggu';
      case 'scheduled': return 'Terjadwal';
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

  const getResultColor = (result: string) => {
    switch (result) {
      case 'passed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'conditional': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const stats = [
    {
      title: 'Total Antrean',
      value: inspectionQueue.length.toString(),
      icon: ClipboardList,
      color: 'text-blue-600'
    },
    {
      title: 'Menunggu Inspeksi',
      value: inspectionQueue.filter(item => item.status === 'pending').length.toString(),
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Sedang Inspeksi',
      value: inspectionQueue.filter(item => item.status === 'in_progress').length.toString(),
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      title: 'Selesai Hari Ini',
      value: inspectionQueue.filter(item => 
        item.status === 'completed' && 
        item.inspectionCompleted?.startsWith('2025-01-05')
      ).length.toString(),
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Antrean Inspeksi"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/qc-besi' },
        { title: 'Inspeksi QC', href: '#' },
        { title: 'Antrean Inspeksi', href: '/roles/qc-besi/inspeksi/antrean-inspeksi' }
      ]}
    >
      <Head title="Antrean Inspeksi - QC Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="h-8 w-8 text-gray-600" />
              Antrean Inspeksi QC
            </h1>
            <p className="text-gray-600 mt-1">Kelola antrean inspeksi kualitas produk besi</p>
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
                    placeholder="Cari berdasarkan produk, WO, atau crew..."
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
                  <SelectItem value="in_progress">Sedang Inspeksi</SelectItem>
                  <SelectItem value="scheduled">Terjadwal</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
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

        {/* Inspection Queue */}
        <div className="space-y-4">
          {filteredQueue.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.id} - {item.product}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {item.workOrder} • {item.quantity} {item.unit} • Crew: {item.submittedBy}
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Lokasi</p>
                      <p className="text-sm text-gray-900 flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {item.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tanggal Diminta</p>
                      <p className="text-sm text-gray-900 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.requestedDate).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Estimasi Waktu</p>
                      <p className="text-sm text-gray-900 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.estimatedInspectionTime} jam
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium text-gray-700 mb-1">Catatan dari Produksi:</p>
                    <p className="text-sm text-gray-600">{item.notes}</p>
                  </div>

                  {item.status === 'in_progress' && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                      <p className="text-sm font-medium text-blue-800">Sedang Diinspeksi</p>
                      <p className="text-sm text-blue-600">
                        Inspector: {item.inspector} • Dimulai: {item.inspectionStarted}
                      </p>
                    </div>
                  )}

                  {item.status === 'completed' && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-green-800">Inspeksi Selesai</p>
                          <p className="text-sm text-green-600">
                            Inspector: {item.inspector} • Selesai: {item.inspectionCompleted}
                          </p>
                        </div>
                        {item.result && (
                          <div className="text-right">
                            <p className="text-xs text-gray-600">Hasil</p>
                            <p className={`text-sm font-bold ${getResultColor(item.result)}`}>
                              {item.result === 'passed' ? 'LULUS' : 
                               item.result === 'failed' ? 'TIDAK LULUS' : 'BERSYARAT'}
                              {item.score && ` (${item.score}/100)`}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {item.status === 'pending' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mulai Inspeksi
                      </Button>
                    )}
                    {item.status === 'in_progress' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Selesaikan Inspeksi
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      Detail
                    </Button>
                    {item.status === 'scheduled' && (
                      <Button variant="outline" size="sm">
                        Reschedule
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