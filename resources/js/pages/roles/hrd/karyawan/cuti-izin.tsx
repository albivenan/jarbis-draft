import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search, Calendar, Clock, CheckCircle, X } from 'lucide-react';

export default function CutiIzin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const leaveRequests = [
    {
      id: 1,
      employeeId: 'EMP-001',
      employeeName: 'Ahmad Susanto',
      department: 'Produksi Besi',
      type: 'Cuti Tahunan',
      startDate: '2025-01-15',
      endDate: '2025-01-17',
      days: 3,
      reason: 'Acara keluarga',
      status: 'pending',
      requestDate: '2025-01-03',
      approvedBy: null
    },
    {
      id: 2,
      employeeId: 'EMP-002',
      employeeName: 'Siti Nurhaliza',
      department: 'HRD',
      type: 'Cuti Sakit',
      startDate: '2025-01-05',
      endDate: '2025-01-06',
      days: 2,
      reason: 'Sakit demam',
      status: 'approved',
      requestDate: '2025-01-04',
      approvedBy: 'Manajer HRD'
    },
    {
      id: 3,
      employeeId: 'EMP-003',
      employeeName: 'Budi Santoso',
      department: 'PPIC',
      type: 'Izin',
      startDate: '2025-01-10',
      endDate: '2025-01-10',
      days: 1,
      reason: 'Keperluan keluarga mendesak',
      status: 'rejected',
      requestDate: '2025-01-08',
      approvedBy: 'Manajer HRD'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Disetujui';
      case 'pending': return 'Menunggu';
      case 'rejected': return 'Ditolak';
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Cuti Tahunan': return 'bg-blue-100 text-blue-800';
      case 'Cuti Sakit': return 'bg-red-100 text-red-800';
      case 'Izin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    {
      title: 'Total Pengajuan',
      value: '24',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Menunggu Approval',
      value: '8',
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Disetujui',
      value: '14',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Ditolak',
      value: '2',
      icon: X,
      color: 'text-red-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Cuti & Izin"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/hrd' },
        { title: 'Data Karyawan', href: '#' },
        { title: 'Cuti & Izin', href: '/roles/hrd/karyawan/cuti-izin' }
      ]}
    >
      <Head title="Cuti & Izin - HRD" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Cuti & Izin Karyawan
            </h1>
            <p className="text-gray-600 mt-1">Kelola pengajuan cuti dan izin karyawan</p>
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
                    placeholder="Cari berdasarkan nama karyawan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="Cuti Tahunan">Cuti Tahunan</SelectItem>
                  <SelectItem value="Cuti Sakit">Cuti Sakit</SelectItem>
                  <SelectItem value="Izin">Izin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengajuan Cuti & Izin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{request.employeeName} ({request.employeeId})</h4>
                      <p className="text-sm text-gray-600">{request.department}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(request.type)}>
                        {request.type}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusText(request.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Tanggal</p>
                      <p className="font-medium">
                        {new Date(request.startDate).toLocaleDateString('id-ID')} - {new Date(request.endDate).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Durasi</p>
                      <p className="font-medium">{request.days} hari</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tanggal Pengajuan</p>
                      <p className="font-medium">{new Date(request.requestDate).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Disetujui oleh</p>
                      <p className="font-medium">{request.approvedBy || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">Alasan:</p>
                    <p className="text-sm text-gray-900">{request.reason}</p>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Setujui
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                        <X className="w-4 h-4 mr-1" />
                        Tolak
                      </Button>
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
