import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardList, Search, Eye, Users, Calendar, Package, CheckCircle, Clock } from 'lucide-react';

export default function PerintahKerja() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const workOrders = [
    {
      id: 'WO-BSI-001',
      salesOrder: 'SO-2025-001',
      product: 'Rangka Besi H-Beam 200x100',
      customer: 'PT Konstruksi Jaya',
      quantity: 50,
      unit: 'unit',
      startDate: '2025-01-05',
      endDate: '2025-01-15',
      priority: 'high',
      status: 'active',
      assignedSupervisor: 'Supervisor Besi A',
      assignedCrew: 8,
      progress: 25,
      materials: [
        { code: 'MAT-BSI-001', name: 'Besi Beton 12mm', required: 200, unit: 'batang' },
        { code: 'MAT-BSI-002', name: 'Plat Besi 8mm', required: 50, unit: 'lembar' }
      ]
    },
    {
      id: 'WO-BSI-002',
      salesOrder: 'SO-2025-003',
      product: 'Pagar Besi Ornamen',
      customer: 'PT Infrastruktur Prima',
      quantity: 100,
      unit: 'meter',
      startDate: '2025-01-03',
      endDate: '2025-01-20',
      priority: 'medium',
      status: 'completed',
      assignedSupervisor: 'Supervisor Besi B',
      assignedCrew: 6,
      progress: 100,
      materials: [
        { code: 'MAT-BSI-003', name: 'Hollow Besi 4x4', required: 150, unit: 'batang' },
        { code: 'MAT-BSI-004', name: 'Cat Anti Karat', required: 30, unit: 'liter' }
      ]
    },
    {
      id: 'WO-BSI-003',
      salesOrder: 'SO-2025-005',
      product: 'Struktur Besi Gudang',
      customer: 'CV Logistik Jaya',
      quantity: 1,
      unit: 'set',
      startDate: '2025-01-08',
      endDate: '2025-01-25',
      priority: 'high',
      status: 'pending',
      assignedSupervisor: 'Supervisor Besi A',
      assignedCrew: 12,
      progress: 0,
      materials: [
        { code: 'MAT-BSI-005', name: 'Besi WF 400x200', required: 20, unit: 'batang' },
        { code: 'MAT-BSI-006', name: 'Baut Besi M16', required: 200, unit: 'pcs' }
      ]
    }
  ];

  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesSearch = wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || wo.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || wo.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'completed': return 'Selesai';
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
      title: 'Total Work Order',
      value: workOrders.length.toString(),
      icon: ClipboardList,
      color: 'text-blue-600'
    },
    {
      title: 'Aktif',
      value: workOrders.filter(wo => wo.status === 'active').length.toString(),
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Selesai',
      value: workOrders.filter(wo => wo.status === 'completed').length.toString(),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Crew Terlibat',
      value: workOrders.reduce((total, wo) => total + wo.assignedCrew, 0).toString(),
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Perintah Kerja dari PPIC"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-produksi-besi' },
        { title: 'Manajemen Produksi', href: '#' },
        { title: 'Perintah Kerja dari PPIC', href: '/roles/manajer-produksi-besi/manajemen-produksi/perintah-kerja' }
      ]}
    >
      <Head title="Perintah Kerja dari PPIC - Produksi Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="h-8 w-8 text-gray-600" />
              Perintah Kerja dari PPIC
            </h1>
            <p className="text-gray-600 mt-1">Kelola work order yang diterima dari PPIC untuk produksi besi</p>
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
                    placeholder="Cari berdasarkan WO, produk, atau customer..."
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
            <div className="space-y-4">
              {filteredWorkOrders.map((wo) => (
                <div key={wo.id} className="p-6 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-medium">{wo.id}</h4>
                      <p className="text-sm text-gray-600">Sales Order: {wo.salesOrder}</p>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Produk & Customer</p>
                      <p className="text-sm text-gray-900">{wo.product}</p>
                      <p className="text-xs text-gray-500">{wo.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Quantity & Timeline</p>
                      <p className="text-sm text-gray-900">{wo.quantity} {wo.unit}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(wo.startDate).toLocaleDateString('id-ID')} - {new Date(wo.endDate).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tim & Progress</p>
                      <p className="text-sm text-gray-900">{wo.assignedSupervisor}</p>
                      <p className="text-xs text-gray-500">{wo.assignedCrew} crew members</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gray-600 h-2 rounded-full" 
                            style={{ width: `${wo.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{wo.progress}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Material Requirements</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {wo.materials.map((material, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                          <span>{material.name} ({material.code})</span>
                          <span className="font-medium">{material.required} {material.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Detail
                    </Button>
                    <Button variant="outline" size="sm">
                      <Users className="w-4 h-4 mr-1" />
                      Alokasi Tim
                    </Button>
                    {wo.status === 'pending' && (
                      <Button size="sm" className="bg-gray-600 hover:bg-gray-700">
                        Mulai Produksi
                      </Button>
                    )}
                    {wo.status === 'active' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Update Progress
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