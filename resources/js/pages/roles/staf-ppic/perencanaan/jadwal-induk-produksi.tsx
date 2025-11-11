import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Factory, FileText, Search, Filter, Eye } from 'lucide-react';

interface SalesOrder {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Scheduled' | 'In Progress';
  division: 'Besi' | 'Kayu';
}

interface WorkOrder {
  id: string;
  salesOrderId: string;
  product: string;
  quantity: number;
  division: 'Besi' | 'Kayu';
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Released' | 'In Progress' | 'Completed';
  assignedManager: string;
}

export default function JadwalIndukProduksi() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDivision, setFilterDivision] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Sample data - in real app, this would come from props/API
  const salesOrders: SalesOrder[] = [
    {
      id: 'SO-2025-001',
      customer: 'PT Konstruksi Jaya',
      product: 'Rangka Besi H-Beam 200x100',
      quantity: 50,
      deadline: '2025-01-15',
      priority: 'High',
      status: 'Pending',
      division: 'Besi'
    },
    {
      id: 'SO-2025-002',
      customer: 'CV Furniture Modern',
      product: 'Meja Kayu Jati Custom',
      quantity: 25,
      deadline: '2025-01-20',
      priority: 'Medium',
      status: 'Pending',
      division: 'Kayu'
    },
    {
      id: 'SO-2025-003',
      customer: 'PT Infrastruktur Prima',
      product: 'Pagar Besi Ornamen',
      quantity: 100,
      deadline: '2025-01-25',
      priority: 'High',
      status: 'Scheduled',
      division: 'Besi'
    }
  ];

  const workOrders: WorkOrder[] = [
    {
      id: 'WO-BSI-001',
      salesOrderId: 'SO-2025-003',
      product: 'Pagar Besi Ornamen',
      quantity: 100,
      division: 'Besi',
      startDate: '2025-01-10',
      endDate: '2025-01-24',
      status: 'Released',
      assignedManager: 'Ahmad Susanto'
    }
  ];

  const filteredOrders = salesOrders.filter(order => {
    const matchesSearch = order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision = filterDivision === 'all' || order.division === filterDivision;
    const matchesPriority = filterPriority === 'all' || order.priority === filterPriority;
    
    return matchesSearch && matchesDivision && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-purple-100 text-purple-800';
      case 'Released': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Head title="Jadwal Induk Produksi - PPIC" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jadwal Induk Produksi</h1>
            <p className="text-gray-600 mt-1">Lihat jadwal produksi dan status Work Order</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari berdasarkan produk, customer, atau SO..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterDivision} onValueChange={setFilterDivision}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Divisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Divisi</SelectItem>
                  <SelectItem value="Besi">Besi</SelectItem>
                  <SelectItem value="Kayu">Kayu</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Prioritas</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sales Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Sales Orders Menunggu Penjadwalan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Sales Order</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Produk</th>
                    <th className="text-left py-3 px-4">Qty</th>
                    <th className="text-left py-3 px-4">Divisi</th>
                    <th className="text-left py-3 px-4">Deadline</th>
                    <th className="text-left py-3 px-4">Prioritas</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{order.id}</td>
                      <td className="py-3 px-4">{order.customer}</td>
                      <td className="py-3 px-4">{order.product}</td>
                      <td className="py-3 px-4">{order.quantity}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={order.division === 'Besi' ? 'border-gray-500' : 'border-amber-500'}>
                          {order.division}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{new Date(order.deadline).toLocaleDateString('id-ID')}</td>
                      <td className="py-3 px-4">
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Detail
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Active Work Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="w-5 h-5" />
              Work Orders Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Work Order</th>
                    <th className="text-left py-3 px-4">Sales Order</th>
                    <th className="text-left py-3 px-4">Produk</th>
                    <th className="text-left py-3 px-4">Qty</th>
                    <th className="text-left py-3 px-4">Divisi</th>
                    <th className="text-left py-3 px-4">Tanggal Mulai</th>
                    <th className="text-left py-3 px-4">Tanggal Selesai</th>
                    <th className="text-left py-3 px-4">Manajer</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {workOrders.map((wo) => (
                    <tr key={wo.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{wo.id}</td>
                      <td className="py-3 px-4">{wo.salesOrderId}</td>
                      <td className="py-3 px-4">{wo.product}</td>
                      <td className="py-3 px-4">{wo.quantity}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={wo.division === 'Besi' ? 'border-gray-500' : 'border-amber-500'}>
                          {wo.division}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{new Date(wo.startDate).toLocaleDateString('id-ID')}</td>
                      <td className="py-3 px-4">{new Date(wo.endDate).toLocaleDateString('id-ID')}</td>
                      <td className="py-3 px-4">{wo.assignedManager}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(wo.status)}>
                          {wo.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Detail
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}