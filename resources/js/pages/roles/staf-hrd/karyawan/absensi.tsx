import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Users, Clock, CheckCircle, AlertTriangle, Eye } from 'lucide-react';

export default function AbsensiKehadiran() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const attendanceData = [
    {
      id: 1,
      employeeId: 'EMP-001',
      name: 'Ahmad Susanto',
      department: 'Produksi Besi',
      checkIn: '07:45',
      checkOut: '17:15',
      status: 'present',
      workHours: '8h 30m'
    },
    {
      id: 2,
      employeeId: 'EMP-002',
      name: 'Siti Nurhaliza',
      department: 'HRD',
      checkIn: '08:00',
      checkOut: '17:00',
      status: 'present',
      workHours: '8h 0m'
    },
    {
      id: 3,
      employeeId: 'EMP-003',
      name: 'Budi Santoso',
      department: 'PPIC',
      checkIn: '08:15',
      checkOut: '-',
      status: 'late',
      workHours: '-'
    },
    {
      id: 4,
      employeeId: 'EMP-004',
      name: 'Maya Sari',
      department: 'Keuangan',
      checkIn: '-',
      checkOut: '-',
      status: 'absent',
      workHours: '-'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'leave': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'Hadir';
      case 'late': return 'Terlambat';
      case 'absent': return 'Tidak Hadir';
      case 'leave': return 'Cuti';
      default: return status;
    }
  };

  const stats = [
    {
      title: 'Total Karyawan',
      value: '156',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Hadir Hari Ini',
      value: '142',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Terlambat',
      value: '8',
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Tidak Hadir',
      value: '6',
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Absensi & Kehadiran"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-hrd' },
        { title: 'Data Karyawan', href: '#' },
        { title: 'Absensi & Kehadiran', href: '/roles/staf-hrd/karyawan/absensi' }
      ]}
    >
      <Head title="Absensi & Kehadiran - HRD" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              Absensi & Kehadiran
            </h1>
            <p className="text-gray-600 mt-1">Lihat data kehadiran dan absensi karyawan</p>
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
                    placeholder="Cari berdasarkan nama atau ID karyawan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Departemen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Departemen</SelectItem>
                  <SelectItem value="HRD">HRD</SelectItem>
                  <SelectItem value="PPIC">PPIC</SelectItem>
                  <SelectItem value="Produksi Besi">Produksi Besi</SelectItem>
                  <SelectItem value="Produksi Kayu">Produksi Kayu</SelectItem>
                  <SelectItem value="Keuangan">Keuangan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Data Kehadiran - {new Date(selectedDate).toLocaleDateString('id-ID')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">ID Karyawan</th>
                    <th className="text-left py-3 px-4">Nama</th>
                    <th className="text-left py-3 px-4">Departemen</th>
                    <th className="text-left py-3 px-4">Check In</th>
                    <th className="text-left py-3 px-4">Check Out</th>
                    <th className="text-left py-3 px-4">Jam Kerja</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((attendance) => (
                    <tr key={attendance.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{attendance.employeeId}</td>
                      <td className="py-3 px-4">{attendance.name}</td>
                      <td className="py-3 px-4">{attendance.department}</td>
                      <td className="py-3 px-4">{attendance.checkIn}</td>
                      <td className="py-3 px-4">{attendance.checkOut}</td>
                      <td className="py-3 px-4">{attendance.workHours}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(attendance.status)}>
                          {getStatusText(attendance.status)}
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
    </AuthenticatedLayout>
  );
}