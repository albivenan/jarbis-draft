import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Filter,
  Eye,
  Edit,
  UserCheck,
  UserX,
  Calendar,
  Phone,
  Mail,
  User,
  MapPin,
  Briefcase
} from 'lucide-react';

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'probation';
  contractType: 'permanent' | 'contract' | 'internship';
  supervisor: string;
  avatar?: string;
}

export default function DaftarKaryawan() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const employees: Employee[] = [
    {
      id: '1',
      employeeId: 'EMP-001',
      name: 'Ahmad Yusuf',
      position: 'Supervisor Produksi Kayu',
      department: 'Produksi Kayu',
      email: 'ahmad.yusuf@company.com',
      phone: '081234567890',
      joinDate: '2022-03-15',
      status: 'active',
      contractType: 'permanent',
      supervisor: 'Manajer Produksi Kayu'
    },
    {
      id: '2',
      employeeId: 'EMP-002',
      name: 'Budi Santoso',
      position: 'Operator Produksi Besi',
      department: 'Produksi Besi',
      email: 'budi.santoso@company.com',
      phone: '081234567891',
      joinDate: '2023-01-10',
      status: 'active',
      contractType: 'permanent',
      supervisor: 'Supervisor Produksi Besi'
    },
    {
      id: '3',
      employeeId: 'EMP-003',
      name: 'Sari Dewi',
      position: 'QC Inspector',
      department: 'Quality Control',
      email: 'sari.dewi@company.com',
      phone: '081234567892',
      joinDate: '2023-06-01',
      status: 'probation',
      contractType: 'contract',
      supervisor: 'Manajer QC'
    },
    {
      id: '4',
      employeeId: 'EMP-004',
      name: 'Eko Prasetyo',
      position: 'Staff PPIC',
      department: 'PPIC',
      email: 'eko.prasetyo@company.com',
      phone: '081234567893',
      joinDate: '2022-11-20',
      status: 'active',
      contractType: 'permanent',
      supervisor: 'Manajer PPIC'
    },
    {
      id: '5',
      employeeId: 'EMP-005',
      name: 'Dian Sari',
      position: 'Staff HRD',
      department: 'HRD',
      email: 'dian.sari@company.com',
      phone: '081234567894',
      joinDate: '2023-02-14',
      status: 'active',
      contractType: 'permanent',
      supervisor: 'Manajer HRD'
    },
    {
      id: '6',
      employeeId: 'EMP-006',
      name: 'Fitri Handayani',
      position: 'Staff Keuangan',
      department: 'Keuangan',
      email: 'fitri.handayani@company.com',
      phone: '081234567895',
      joinDate: '2022-08-05',
      status: 'active',
      contractType: 'permanent',
      supervisor: 'Manajer Keuangan'
    },
    {
      id: '7',
      employeeId: 'EMP-007',
      name: 'Gani Wijaya',
      position: 'Staff Marketing',
      department: 'Marketing',
      email: 'gani.wijaya@company.com',
      phone: '081234567896',
      joinDate: '2023-04-12',
      status: 'inactive',
      contractType: 'contract',
      supervisor: 'Manajer Marketing'
    },
    {
      id: '8',
      employeeId: 'EMP-008',
      name: 'Hendra Kusuma',
      position: 'Intern Developer',
      department: 'IT',
      email: 'hendra.kusuma@company.com',
      phone: '081234567897',
      joinDate: '2023-09-01',
      status: 'active',
      contractType: 'internship',
      supervisor: 'Software Engineer'
    }
  ];

  const departments = ['all', 'Produksi Kayu', 'Produksi Besi', 'Quality Control', 'PPIC', 'HRD', 'Keuangan', 'Marketing', 'IT'];
  const statuses = ['all', 'active', 'inactive', 'probation'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'probation': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'permanent': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'internship': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Tidak Aktif';
      case 'probation': return 'Masa Percobaan';
      default: return status;
    }
  };

  const getContractTypeText = (type: string) => {
    switch (type) {
      case 'permanent': return 'Tetap';
      case 'contract': return 'Kontrak';
      case 'internship': return 'Magang';
      default: return type;
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const employeeSummary = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    inactive: employees.filter(e => e.status === 'inactive').length,
    probation: employees.filter(e => e.status === 'probation').length,
    permanent: employees.filter(e => e.contractType === 'permanent').length,
    contract: employees.filter(e => e.contractType === 'contract').length,
    internship: employees.filter(e => e.contractType === 'internship').length
  };

  return (
    <AuthenticatedLayout
      title="Daftar Karyawan"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-hrd' },
        { title: 'Data Karyawan', href: '#' },
        { title: 'Daftar Karyawan', href: '/roles/staf-hrd/karyawan/daftar' }
      ]}
    >
      <Head title="Daftar Karyawan - Staf HRD" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              Daftar Karyawan
            </h1>
            <p className="text-gray-600 mt-1">Kelola data karyawan dan informasi kepegawaian</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter Lanjutan
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Karyawan</p>
                  <p className="text-2xl font-bold text-gray-900">{employeeSummary.total}</p>
                  <p className="text-sm text-blue-600">Semua status</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Karyawan Aktif</p>
                  <p className="text-2xl font-bold text-green-900">{employeeSummary.active}</p>
                  <p className="text-sm text-green-600">Status aktif</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Masa Percobaan</p>
                  <p className="text-2xl font-bold text-yellow-900">{employeeSummary.probation}</p>
                  <p className="text-sm text-yellow-600">Perlu evaluasi</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tidak Aktif</p>
                  <p className="text-2xl font-bold text-red-900">{employeeSummary.inactive}</p>
                  <p className="text-sm text-red-600">Perlu tindakan</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <UserX className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contract Type Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{employeeSummary.permanent}</div>
                <div className="text-sm text-gray-600">Karyawan Tetap</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(employeeSummary.permanent / employeeSummary.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{employeeSummary.contract}</div>
                <div className="text-sm text-gray-600">Karyawan Kontrak</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${(employeeSummary.contract / employeeSummary.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{employeeSummary.internship}</div>
                <div className="text-sm text-gray-600">Magang</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full" 
                    style={{ width: `${(employeeSummary.internship / employeeSummary.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari berdasarkan nama, ID, posisi, atau email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
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
            </div>
          </CardContent>
        </Card>

      {/* Employee List */}
      <div className="grid gap-4">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{employee.name}</h3>
                      <Badge className={getStatusColor(employee.status)}>
                        {getStatusText(employee.status)}
                      </Badge>
                      <Badge className={getContractTypeColor(employee.contractType)}>
                        {getContractTypeText(employee.contractType)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">ID:</span> {employee.employeeId}</p>
                      <p><span className="font-medium">Posisi:</span> {employee.position}</p>
                      <p><span className="font-medium">Departemen:</span> {employee.department}</p>
                      <p><span className="font-medium">Supervisor:</span> {employee.supervisor}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span>{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" />
                      <span>{employee.phone}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>Bergabung: {employee.joinDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Lihat
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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