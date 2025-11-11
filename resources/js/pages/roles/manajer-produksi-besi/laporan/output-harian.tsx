import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart2, Download, Calendar, Package, CheckCircle, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

export default function OutputHarian() {
  const [selectedDate, setSelectedDate] = useState<string>('2025-01-05');
  const [filterShift, setFilterShift] = useState<string>('all');

  const dailyOutput = [
    {
      workOrder: 'WO-BSI-001',
      product: 'Rangka Besi H-Beam 200x100',
      targetQuantity: 5,
      completedQuantity: 3,
      unit: 'unit',
      shift: 'pagi',
      startTime: '07:00',
      endTime: '15:00',
      operators: ['Ahmad Santoso', 'Budi Prasetyo'],
      status: 'in_progress',
      qualityStatus: 'passed',
      efficiency: 85,
      notes: 'Progres sesuai target, 2 unit tersisa akan diselesaikan besok'
    },
    {
      workOrder: 'WO-BSI-002',
      product: 'Pagar Besi Ornamen',
      targetQuantity: 4,
      completedQuantity: 4,
      unit: 'meter',
      shift: 'pagi',
      startTime: '07:00',
      endTime: '14:30',
      operators: ['Candra Wijaya', 'Dedi Kurniawan'],
      status: 'completed',
      qualityStatus: 'passed',
      efficiency: 95,
      notes: 'Selesai lebih cepat dari jadwal'
    },
    {
      workOrder: 'WO-BSI-003',
      product: 'Bracket Besi L-Shape',
      targetQuantity: 20,
      completedQuantity: 15,
      unit: 'pcs',
      shift: 'siang',
      startTime: '15:00',
      endTime: '23:00',
      operators: ['Eko Susanto', 'Fajar Nugroho'],
      status: 'in_progress',
      qualityStatus: 'pending',
      efficiency: 75,
      notes: 'Sedikit terlambat karena masalah material'
    },
    {
      workOrder: 'WO-BSI-004',
      product: 'Struktur Baja Ringan',
      targetQuantity: 8,
      completedQuantity: 8,
      unit: 'unit',
      shift: 'siang',
      startTime: '15:00',
      endTime: '22:45',
      operators: ['Gunawan Saputra', 'Hendra Wijaya'],
      status: 'completed',
      qualityStatus: 'passed',
      efficiency: 90,
      notes: 'Selesai tepat waktu dengan kualitas baik'
    }
  ];

  const productionSummary = {
    totalWorkOrders: dailyOutput.length,
    completedWorkOrders: dailyOutput.filter(item => item.status === 'completed').length,
    totalTargetQuantity: dailyOutput.reduce((sum, item) => sum + item.targetQuantity, 0),
    totalCompletedQuantity: dailyOutput.reduce((sum, item) => sum + item.completedQuantity, 0),
    averageEfficiency: Math.round(dailyOutput.reduce((sum, item) => sum + item.efficiency, 0) / dailyOutput.length),
    activeOperators: [...new Set(dailyOutput.flatMap(item => item.operators))].length,
    qualityPassRate: Math.round((dailyOutput.filter(item => item.qualityStatus === 'passed').length / dailyOutput.length) * 100)
  };

  const shiftSummary = {
    pagi: {
      workOrders: dailyOutput.filter(item => item.shift === 'pagi').length,
      completed: dailyOutput.filter(item => item.shift === 'pagi' && item.status === 'completed').length,
      efficiency: Math.round(dailyOutput.filter(item => item.shift === 'pagi').reduce((sum, item) => sum + item.efficiency, 0) / dailyOutput.filter(item => item.shift === 'pagi').length)
    },
    siang: {
      workOrders: dailyOutput.filter(item => item.shift === 'siang').length,
      completed: dailyOutput.filter(item => item.shift === 'siang' && item.status === 'completed').length,
      efficiency: Math.round(dailyOutput.filter(item => item.shift === 'siang').reduce((sum, item) => sum + item.efficiency, 0) / dailyOutput.filter(item => item.shift === 'siang').length)
    }
  };

  const filteredOutput = dailyOutput.filter(item => {
    return filterShift === 'all' || item.shift === filterShift;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'in_progress': return 'Dalam Progres';
      case 'delayed': return 'Terlambat';
      default: return status;
    }
  };

  const getQualityColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityText = (status: string) => {
    switch (status) {
      case 'passed': return 'Lulus';
      case 'failed': return 'Tidak Lulus';
      case 'pending': return 'Menunggu QC';
      default: return status;
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const stats = [
    {
      title: 'Total Work Order',
      value: productionSummary.totalWorkOrders.toString(),
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Selesai',
      value: productionSummary.completedWorkOrders.toString(),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Efisiensi Rata-rata',
      value: `${productionSummary.averageEfficiency}%`,
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Operator Aktif',
      value: productionSummary.activeOperators.toString(),
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Laporan Output Harian"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-produksi-besi' },
        { title: 'Laporan', href: '#' },
        { title: 'Laporan Output Harian', href: '/roles/manajer-produksi-besi/laporan/output-harian' }
      ]}
    >
      <Head title="Laporan Output Harian - Manajer Produksi Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart2 className="h-8 w-8 text-gray-600" />
              Laporan Output Harian
            </h1>
            <p className="text-gray-600 mt-1">Laporan produksi harian divisi besi</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Date and Filter Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Tanggal Laporan
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Filter Shift
                </label>
                <Select value={filterShift} onValueChange={setFilterShift}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Pilih Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Shift</SelectItem>
                    <SelectItem value="pagi">Shift Pagi</SelectItem>
                    <SelectItem value="siang">Shift Siang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Production Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Produksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Target Quantity</span>
                  <span className="font-medium">{productionSummary.totalTargetQuantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed Quantity</span>
                  <span className="font-medium">{productionSummary.totalCompletedQuantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Achievement Rate</span>
                  <span className="font-medium">
                    {Math.round((productionSummary.totalCompletedQuantity / productionSummary.totalTargetQuantity) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quality Pass Rate</span>
                  <span className="font-medium">{productionSummary.qualityPassRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shift Pagi (07:00-15:00)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Work Orders</span>
                  <span className="font-medium">{shiftSummary.pagi.workOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-medium">{shiftSummary.pagi.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="font-medium">
                    {Math.round((shiftSummary.pagi.completed / shiftSummary.pagi.workOrders) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Efficiency</span>
                  <span className={`font-medium ${getEfficiencyColor(shiftSummary.pagi.efficiency)}`}>
                    {shiftSummary.pagi.efficiency}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shift Siang (15:00-23:00)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Work Orders</span>
                  <span className="font-medium">{shiftSummary.siang.workOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-medium">{shiftSummary.siang.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="font-medium">
                    {Math.round((shiftSummary.siang.completed / shiftSummary.siang.workOrders) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Efficiency</span>
                  <span className={`font-medium ${getEfficiencyColor(shiftSummary.siang.efficiency)}`}>
                    {shiftSummary.siang.efficiency}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Output */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Output Produksi - {new Date(selectedDate).toLocaleDateString('id-ID')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOutput.map((item, index) => (
                <div key={index} className="p-6 border rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-medium">{item.workOrder}</h4>
                      <p className="text-gray-600">{item.product}</p>
                      <p className="text-sm text-gray-500">
                        Shift {item.shift} • {item.startTime} - {item.endTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </Badge>
                      <Badge className={getQualityColor(item.qualityStatus)}>
                        {getQualityText(item.qualityStatus)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Target vs Actual</p>
                      <p className="text-lg font-bold">
                        {item.completedQuantity} / {item.targetQuantity} {item.unit}
                      </p>
                      <p className="text-sm text-gray-500">
                        {Math.round((item.completedQuantity / item.targetQuantity) * 100)}% tercapai
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Efisiensi</p>
                      <p className={`text-lg font-bold ${getEfficiencyColor(item.efficiency)}`}>
                        {item.efficiency}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Operator</p>
                      <div className="space-y-1">
                        {item.operators.map((operator, idx) => (
                          <p key={idx} className="text-sm text-gray-900">{operator}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status Kualitas</p>
                      <Badge className={getQualityColor(item.qualityStatus)}>
                        {getQualityText(item.qualityStatus)}
                      </Badge>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm font-medium text-gray-700 mb-1">Catatan:</p>
                      <p className="text-sm text-gray-600">{item.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}