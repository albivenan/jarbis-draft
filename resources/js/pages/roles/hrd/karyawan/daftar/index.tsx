import { useState } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Edit, Eye, Filter, Download, UserPlus } from 'lucide-react';

interface Jabatan {
  nama_jabatan: string;
}

interface Departemen {
  nama_departemen: string;
}

interface RincianPekerjaan {
  jabatan: Jabatan;
  departemen: Departemen;
  status_karyawan: string;
  tanggal_bergabung: string;
}

interface KontakKaryawan {
  email_perusahaan: string;
  nomor_telepon: string;
}

interface Employee {
  id_karyawan: string;
  nama_lengkap: string;
  nik_perusahaan: string;
  foto_profil_url?: string;
  rincian_pekerjaan: RincianPekerjaan;
  kontak_karyawan: KontakKaryawan;
}

import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface PageProps extends InertiaPageProps {
  employees: Employee[];
  pendingChangeRequestsCount: number;
}

export default function DaftarKaryawan() {
  const { employees, pendingChangeRequestsCount } = usePage<PageProps>().props;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const departments = ['all', ...Array.from(new Set(employees.map(e => e.rincian_pekerjaan.departemen.nama_departemen)))];
  const statuses = ['all', ...Array.from(new Set(employees.map(e => e.rincian_pekerjaan.status_karyawan)))];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aktif':
      case 'tetap': return 'bg-green-100 text-green-800';
      case 'kontrak': return 'bg-yellow-100 text-yellow-800';
      case 'tidak aktif':
      case 'berhenti': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aktif': return 'Aktif';
      case 'tetap': return 'Tetap';
      case 'kontrak': return 'Kontrak';
      case 'tidak aktif': return 'Tidak Aktif';
      case 'berhenti': return 'Berhenti';
      default: return status;
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.nik_perusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.rincian_pekerjaan.jabatan.nama_jabatan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.rincian_pekerjaan.departemen.nama_departemen === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || employee.rincian_pekerjaan.status_karyawan === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const employeeSummary = {
    total: employees.length,
    active: employees.filter(e => e.rincian_pekerjaan.status_karyawan.toLowerCase() === 'tetap' || e.rincian_pekerjaan.status_karyawan.toLowerCase() === 'kontrak').length,
    inactive: employees.filter(e => e.rincian_pekerjaan.status_karyawan.toLowerCase() === 'tidak aktif').length,
    terminated: employees.filter(e => e.rincian_pekerjaan.status_karyawan.toLowerCase() === 'berhenti').length
  };

  return (
    <AuthenticatedLayout
      title="Daftar Karyawan"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/hrd' },
        { title: 'Karyawan', href: '#' },
        { title: 'Daftar Karyawan', href: '/roles/hrd/karyawan/daftar' }
      ]}
    >
      <Head title="Daftar Karyawan - Manajer HRD" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Daftar Karyawan
            {pendingChangeRequestsCount > 0 && (
              <a href={route('hrd.karyawan.permintaan-perubahan-data')} className="inline-flex items-center">
                <Badge variant="destructive" className="ml-3 text-lg px-3 py-1 rounded-full cursor-pointer hover:bg-red-700 transition-colors">
                  {pendingChangeRequestsCount}
                </Badge>
              </a>
            )}
          </h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Tambah Karyawan
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{employeeSummary.total}</div>
                <div className="text-sm text-gray-600">Total Karyawan</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{employeeSummary.active}</div>
                <div className="text-sm text-gray-600">Aktif</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{employeeSummary.inactive}</div>
                <div className="text-sm text-gray-600">Tidak Aktif</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{employeeSummary.terminated}</div>
                <div className="text-sm text-gray-600">Berhenti</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'Semua Departemen' : dept}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Semua Status' : getStatusText(status)}
                  </option>
                ))}
              </select>
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari berdasarkan nama, NIK, atau jabatan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter Lanjutan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card>
          <CardHeader>
            <CardTitle>Data Karyawan ({filteredEmployees.length} dari {employees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">No</th>
                    <th className="text-left py-3 px-4">Foto Profil</th>
                    <th className="text-left py-3 px-4">Nama Lengkap</th>
                    <th className="text-left py-3 px-4">NIK Perusahaan</th>
                    <th className="text-left py-3 px-4">Jabatan</th>
                    <th className="text-left py-3 px-4">Departemen</th>
                    <th className="text-left py-3 px-4">Status Kepegawaian</th>
                    <th className="text-left py-3 px-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee, index) => (
                    <tr key={employee.id_karyawan} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{index + 1}</td>
                      <td className="py-3 px-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.foto_profil_url} alt={employee.nama_lengkap} />
                          <AvatarFallback>
                            {employee.nama_lengkap.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{employee.nama_lengkap}</div>
                          <div className="text-sm text-gray-500">{employee.kontak_karyawan?.email_perusahaan || '-'}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{employee.nik_perusahaan}</td>
                      <td className="py-3 px-4">{employee.rincian_pekerjaan?.jabatan?.nama_jabatan || '-'}</td>
                      <td className="py-3 px-4">{employee.rincian_pekerjaan?.departemen?.nama_departemen || '-'}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(employee.rincian_pekerjaan?.status_karyawan || '-')}>
                          {getStatusText(employee.rincian_pekerjaan?.status_karyawan || '-')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Link href={route('hrd.karyawan.detail', { id: employee.id_karyawan })}>
                            <Button variant="ghost" size="sm" title="Lihat Detail">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {filteredEmployees.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">Tidak ada karyawan yang sesuai dengan filter.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
