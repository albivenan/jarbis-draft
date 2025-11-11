import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ClipboardList, Eye, Users, Calendar, Package, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function PerintahKerja() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const workOrders = [
    {
      id: 'WO-KYU-001',
      customerOrder: 'CO-2025-001',
      customer: 'PT Furniture Nusantara',
      product: 'Meja Kayu Jati Custom',
      quantity: 5,
      unit: 'unit',
      receivedDate: '2025-01-03',
      targetStartDate: '2025-01-05',
      deadline: '2025-01-12',
      priority: 'high',
      status: 'active',
      progress: 40,
      assignedTeams: 2,
      estimatedHours: 120,
      actualHours: 48,
      materialRequirements: [
        { code: 'MAT-KYU-001', name: 'Kayu Jati Grade A', quantity: 2.5, unit: 'm³', status: 'available' },
        { code: 'MAT-KYU-008', name: 'Lem Kayu PVA', quantity: 3, unit: 'liter', status: 'available' },
        { code: 'MAT-KYU-015', name: 'Finishing Duco Clear', quantity: 2, unit: 'liter', status: 'pending' }
      ],
      processes: [
        { name: 'Pemotongan Kayu', status: 'completed', progress: 100 },
        { name: 'Perakitan & Penyambungan', status: 'in_progress', progress: 60 },
        { name: 'Sanding & Finishing', status: 'pending', progress: 0 },
        { name: 'Quality Control', status: 'pending', progress: 0 }
      ],
      notes: 'Desain custom sesuai spesifikasi customer, perhatikan detail ukiran pada kaki meja'
    },
    {
      id: 'WO-KYU-002',
      customerOrder: 'CO-2025-002',
      customer: 'CV Mebel Jaya',
      product: 'Lemari Kayu Mahoni 3 Pintu',
      quantity: 3,
      unit: 'unit',
      receivedDate: '2025-01-04',
      targetStartDate: '2025-01-06',
      deadline: '2025-01-15',
      priority: 'medium',
      status: 'pending',
      progress: 0,
      assignedTeams: 0,
      estimatedHours: 180,
      actualHours: 0,
      materialRequirements: [
        { code: 'MAT-KYU-002', name: 'Kayu Mahoni Grade A', quantity: 3.2, unit: 'm³', status: 'available' },
        { code: 'MAT-KYU-009', name: 'Hardware Lemari Set', quantity: 3, unit: 'set', status: 'available' },
        { code: 'MAT-KYU-016', name: 'Cat Duco Premium', quantity: 4, unit: 'liter', status: 'available' }
      ],
      processes: [
        { name: 'Pemotongan & Shaping', status: 'pending', progress: 0 },
        { name: 'Assembly Frame', status: 'pending', progress: 0 },
        { name: 'Pemasangan Hardware', status: 'pending', progress: 0 },
        { name: 'Finishing Duco', status: 'pending', progress: 0 }
      ],
      notes: 'Lemari dengan sistem sliding door, perhatikan presisi pada rel pintu'
    },
    {
      id: 'WO-KYU-003',
      customerOrder: 'CO-2025-003',
      customer: 'Hotel Bintang Lima',
      product: 'Set Kursi Kayu Jati Ukir',
      quantity: 12,
      unit: 'unit',
      receivedDate: '2025-01-02',
      targetStartDate: '2025-01-04',
      deadline: '2025-01-18',
      priority: 'high',
      status: 'active',
      progress: 65,
      assignedTeams: 3,
      estimatedHours: 240,
      actualHours: 156,
      materialRequirements: [
        { code: 'MAT-KYU-001', name: 'Kayu Jati Grade A', quantity: 4.8, unit: 'm³', status: 'available' },
        { code: 'MAT-KYU-012', name: 'Busa Kursi Premium', quantity: 12, unit: 'pcs', status: 'available' },
        { code: 'MAT-KYU-018', name: 'Kain Pelapis Kursi', quantity: 15, unit: 'meter', status: 'available' }
      ],
      processes: [
        { name: 'Pemotongan & Ukiran', status: 'completed', progress: 100 },
        { name: 'Assembly Rangka', status: 'completed', progress: 100 },
        { name: 'Pemasangan Busa & Kain', status: 'in_progress', progress: 80 },
        { name: 'Finishing & QC', status: 'pending', progress: 0 }
      ],
      notes: 'Ukiran detail motif tradisional Jawa, memerlukan craftsman berpengalaman'
    },
    {
      id: 'WO-KYU-004',
      customerOrder: 'CO-2025-004',
      customer: 'Toko Furniture Modern',
      product: 'Rak Buku Kayu Minimalis',
      quantity: 8,
      unit: 'unit',
      receivedDate: '2025-01-05',
      targetStartDate: '2025-01-08',
      deadline: '2025-01-20',
      priority: 'low',
      status: 'pending',
      progress: 0,
      assignedTeams: 0,
      estimatedHours: 96,
      actualHours: 0,
      materialRequirements: [
        { code: 'MAT-KYU-003', name: 'Kayu Sengon Grade B', quantity: 2.1, unit: 'm³', status: 'available' },
        { code: 'MAT-KYU-010', name: 'Bracket Rak Adjustable', quantity: 32, unit: 'pcs', status: 'pending' },
        { code: 'MAT-KYU-017', name: 'Cat Water Based', quantity: 3, unit: 'liter', status: 'available' }
      ],
      processes: [
        { name: 'Cutting & Planing', status: 'pending', progress: 0 },
        { name: 'Drilling & Assembly', status: 'pending', progress: 0 },
        { name: 'Sanding', status: 'pending', progress: 0 },
        { name: 'Painting & Finishing', status: 'pending', progress: 0 }
      ],
      notes: 'Desain minimalis dengan sistem knock-down untuk kemudahan pengiriman'
    }
  ];

  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesSearch = wo.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || wo.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || wo.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'active': return 'Aktif';
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

  const getMaterialStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shortage': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaterialStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Tersedia';
      case 'pending': return 'Menunggu';
      case 'shortage': return 'Kurang';
      default: return status;
    }
  };

  const getProcessStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'pending': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const stats = [
    {
      title: 'Total Work Order',
      value: workOrders.length.toString(),
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Work Order Aktif',
      value: workOrders.filter(wo => wo.status === 'active').length.toString(),
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Selesai Bulan Ini',
      value: workOrders.filter(wo => wo.status === 'completed').length.toString(),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Tim Terlibat',
      value: workOrders.reduce((sum, wo) => sum + wo.assignedTeams, 0).toString(),
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Perintah Kerja dari PPIC"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-produksi-kayu' },
        { title: 'Manajemen Produksi', href: '#' },
        { title: 'Perintah Kerja dari PPIC', href: '/roles/manajer-produksi-kayu/manajemen-produksi/perintah-kerja' }
      ]}
    >
      <Head title="Perintah Kerja dari PPIC - Manajer Produksi Kayu" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="h-8 w-8 text-amber-600" />
              Perintah Kerja dari PPIC
            </h1>
            <p className="text-gray-600 mt-1">Kelola Work Order dari PPIC untuk produksi kayu</p>
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
                  placeholder="Cari berdasarkan WO, produk, atau customer..."
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
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="delayed">Terlambat</SelectItem>
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

        {/* Work Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Work Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredWorkOrders.map((wo) => (
                <div key={wo.id} className="p-6 border rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-medium">{wo.id}</h4>
                      <p className="text-gray-600">{wo.product}</p>
                      <p className="text-sm text-gray-500">
                        Customer: {wo.customer} • {wo.quantity} {wo.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(wo.priority)}>
                        {getPriorityText(wo.priority)}
                      </Badge>
                      <Badge className={getStatusColor(wo.status)}>
                        {getStatusText(wo.status)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Progress Keseluruhan</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={wo.progress} className="flex-1" />
                        <span className="text-sm font-medium">{wo.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Waktu Kerja</p>
                      <p className="text-sm text-gray-900">
                        {wo.actualHours}h / {wo.estimatedHours}h
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tim Assigned</p>
                      <p className="text-sm text-gray-900">{wo.assignedTeams} tim</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Deadline</p>
                      <p className="text-sm text-gray-900 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(wo.deadline).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>

                  {/* Material Requirements */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Kebutuhan Material:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {wo.materialRequirements.map((material, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-amber-50 rounded text-sm">
                          <div>
                            <p className="font-medium">{material.name}</p>
                            <p className="text-gray-600">{material.quantity} {material.unit}</p>
                          </div>
                          <Badge className={getMaterialStatusColor(material.status)} size="sm">
                            {getMaterialStatusText(material.status)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Process Status */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Status Proses:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                      {wo.processes.map((process, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">{process.name}</p>
                            <span className={`text-xs ${getProcessStatusColor(process.status)}`}>
                              {process.progress}%
                            </span>
                          </div>
                          <Progress value={process.progress} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {wo.notes && (
                    <div className="bg-blue-50 p-3 rounded mb-4">
                      <p className="text-sm font-medium text-blue-800 mb-1">Catatan Khusus:</p>
                      <p className="text-sm text-blue-700">{wo.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                      <Eye className="w-4 h-4 mr-1" />
                      Detail WO
                    </Button>
                    {wo.status === 'pending' && (
                      <Button size="sm" variant="outline">
                        <Users className="w-4 h-4 mr-1" />
                        Assign Tim
                      </Button>
                    )}
                    {wo.status === 'active' && (
                      <Button size="sm" variant="outline">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Update Status
                      </Button>
                    )}
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