import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Search, AlertTriangle, TrendingUp, TrendingDown, Plus } from 'lucide-react';

export default function StokBahanBaku() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const stockData = [
    {
      code: 'MAT-BSI-001',
      name: 'Besi Beton 12mm',
      category: 'Besi',
      currentStock: 150,
      minStock: 100,
      maxStock: 500,
      unit: 'batang',
      location: 'Gudang A-1',
      lastUpdate: '2025-01-03',
      status: 'normal',
      supplier: 'PT Besi Jaya'
    },
    {
      code: 'MAT-BSI-002',
      name: 'Plat Besi 8mm',
      category: 'Besi',
      currentStock: 25,
      minStock: 50,
      maxStock: 200,
      unit: 'lembar',
      location: 'Gudang A-2',
      lastUpdate: '2025-01-03',
      status: 'low',
      supplier: 'CV Logam Prima'
    },
    {
      code: 'MAT-KYU-001',
      name: 'Kayu Jati Grade A',
      category: 'Kayu',
      currentStock: 8,
      minStock: 10,
      maxStock: 50,
      unit: 'm³',
      location: 'Gudang B-1',
      lastUpdate: '2025-01-02',
      status: 'critical',
      supplier: 'UD Kayu Nusantara'
    },
    {
      code: 'MAT-KYU-002',
      name: 'Cat Duco Premium',
      category: 'Finishing',
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unit: 'liter',
      location: 'Gudang C-1',
      lastUpdate: '2025-01-03',
      status: 'normal',
      supplier: 'PT Cat Indah'
    }
  ];

  const filteredStock = stockData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
      case 'overstock': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'critical': return 'Kritis';
      case 'low': return 'Rendah';
      case 'normal': return 'Normal';
      case 'overstock': return 'Berlebih';
      default: return status;
    }
  };

  const stats = [
    {
      title: 'Total Item',
      value: stockData.length.toString(),
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Stok Kritis',
      value: stockData.filter(item => item.status === 'critical').length.toString(),
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      title: 'Stok Rendah',
      value: stockData.filter(item => item.status === 'low').length.toString(),
      icon: TrendingDown,
      color: 'text-yellow-600'
    },
    {
      title: 'Stok Normal',
      value: stockData.filter(item => item.status === 'normal').length.toString(),
      icon: TrendingUp,
      color: 'text-green-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Stok Bahan Baku"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/ppic' },
        { title: 'Manajemen Inventaris', href: '#' },
        { title: 'Stok Bahan Baku', href: '/roles/ppic/inventaris/stok' }
      ]}
    >
      <Head title="Stok Bahan Baku - PPIC" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="h-8 w-8 text-blue-600" />
              Stok Bahan Baku
            </h1>
            <p className="text-gray-600 mt-1">Kelola dan monitor stok bahan baku produksi</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Material
          </Button>
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
                    placeholder="Cari berdasarkan nama atau kode material..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="Besi">Besi</SelectItem>
                  <SelectItem value="Kayu">Kayu</SelectItem>
                  <SelectItem value="Finishing">Finishing</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="critical">Kritis</SelectItem>
                  <SelectItem value="low">Rendah</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stock Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Stok Material</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Kode Material</th>
                    <th className="text-left py-3 px-4">Nama Material</th>
                    <th className="text-left py-3 px-4">Kategori</th>
                    <th className="text-left py-3 px-4">Stok Saat Ini</th>
                    <th className="text-left py-3 px-4">Min/Max</th>
                    <th className="text-left py-3 px-4">Lokasi</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Supplier</th>
                    <th className="text-left py-3 px-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStock.map((item) => (
                    <tr key={item.code} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{item.code}</td>
                      <td className="py-3 px-4">{item.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={
                          item.category === 'Besi' ? 'border-gray-500' : 
                          item.category === 'Kayu' ? 'border-amber-500' : 'border-purple-500'
                        }>
                          {item.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{item.currentStock}</span> {item.unit}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {item.minStock} / {item.maxStock}
                      </td>
                      <td className="py-3 px-4 text-sm">{item.location}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusText(item.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">{item.supplier}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          {(item.status === 'critical' || item.status === 'low') && (
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                              Pesan
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
