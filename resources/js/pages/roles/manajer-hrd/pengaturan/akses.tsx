import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Shield,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Users,
  Lock,
  Unlock,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface UserAccess {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
  createdDate: string;
  modifiedBy: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
}

export default function HakAksesUser() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions'>('users');

  const users: UserAccess[] = [
    {
      id: 'USR-001',
      name: 'Ahmad Yusuf',
      email: 'ahmad.yusuf@company.com',
      role: 'Supervisor Produksi',
      department: 'Produksi Kayu',
      status: 'active',
      lastLogin: '2024-01-15 08:30',
      permissions: ['view_production', 'manage_crew', 'create_reports'],
      createdDate: '2022-03-15',
      modifiedBy: 'Manajer HRD'
    },
    {
      id: 'USR-002',
      name: 'Sari Dewi',
      email: 'sari.dewi@company.com',
      role: 'QC Inspector',
      department: 'Quality Control',
      status: 'active',
      lastLogin: '2024-01-14 16:20',
      permissions: ['view_qc', 'create_inspection', 'approve_quality'],
      createdDate: '2023-06-01',
      modifiedBy: 'Manajer HRD'
    },
    {
      id: 'USR-003',
      name: 'Budi Santoso',
      email: 'budi.santoso@company.com',
      role: 'Operator Produksi',
      department: 'Produksi Besi',
      status: 'suspended',
      lastLogin: '2024-01-10 17:45',
      permissions: ['view_production', 'update_status'],
      createdDate: '2023-01-10',
      modifiedBy: 'Supervisor'
    }
  ];

  const roles: Role[] = [
    {
      id: 'ROLE-001',
      name: 'Direktur',
      description: 'Akses penuh ke seluruh sistem',
      permissions: ['*'],
      userCount: 1,
      isSystem: true
    },
    {
      id: 'ROLE-002',
      name: 'Manajer HRD',
      description: 'Mengelola SDM dan administrasi karyawan',
      permissions: ['manage_employees', 'view_reports', 'manage_payroll', 'manage_recruitment'],
      userCount: 2,
      isSystem: true
    },
    {
      id: 'ROLE-003',
      name: 'Supervisor Produksi',
      description: 'Mengawasi operasional produksi',
      permissions: ['view_production', 'manage_crew', 'create_reports', 'manage_tasks'],
      userCount: 4,
      isSystem: false
    },
    {
      id: 'ROLE-004',
      name: 'QC Inspector',
      description: 'Melakukan inspeksi kualitas produk',
      permissions: ['view_qc', 'create_inspection', 'approve_quality', 'generate_qc_reports'],
      userCount: 6,
      isSystem: false
    }
  ];

  const permissions: Permission[] = [
    {
      id: 'PERM-001',
      name: 'manage_employees',
      description: 'Mengelola data karyawan',
      category: 'HRD',
      isActive: true
    },
    {
      id: 'PERM-002',
      name: 'view_production',
      description: 'Melihat data produksi',
      category: 'Production',
      isActive: true
    },
    {
      id: 'PERM-003',
      name: 'manage_crew',
      description: 'Mengelola tim kerja',
      category: 'Production',
      isActive: true
    },
    {
      id: 'PERM-004',
      name: 'view_qc',
      description: 'Melihat data quality control',
      category: 'Quality',
      isActive: true
    },
    {
      id: 'PERM-005',
      name: 'manage_payroll',
      description: 'Mengelola penggajian',
      category: 'Finance',
      isActive: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <XCircle className="h-4 w-4" />;
      case 'suspended': return <AlertTriangle className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Tidak Aktif';
      case 'suspended': return 'Suspended';
      default: return status;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userSummary = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length
  };

  return (
    <AuthenticatedLayout
      title="Hak Akses User"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-hrd' },
        { title: 'Pengaturan Sistem', href: '#' },
        { title: 'Hak Akses User', href: '/roles/manajer-hrd/pengaturan/akses' }
      ]}
    >
      <Head title="Hak Akses User - Manajer HRD" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              Hak Akses User
            </h1>
            <p className="text-gray-600 mt-1">Kelola hak akses dan permission pengguna sistem</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Pengaturan
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah User
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium ${activeTab === 'users'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-6 py-3 font-medium ${activeTab === 'roles'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Roles ({roles.length})
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-6 py-3 font-medium ${activeTab === 'permissions'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Permissions ({permissions.length})
          </button>
        </div>

        {activeTab === 'users' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{userSummary.total}</p>
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
                      <p className="text-sm font-medium text-gray-600">Active</p>
                      <p className="text-2xl font-bold text-green-900">{userSummary.active}</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Inactive</p>
                      <p className="text-2xl font-bold text-gray-900">{userSummary.inactive}</p>
                    </div>
                    <div className="p-3 rounded-full bg-gray-100">
                      <XCircle className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Suspended</p>
                      <p className="text-2xl font-bold text-red-900">{userSummary.suspended}</p>
                    </div>
                    <div className="p-3 rounded-full bg-red-100">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Cari berdasarkan nama, email, atau role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">Semua Role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Daftar User ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">User</th>
                        <th className="text-left py-3 px-4">Role & Department</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Last Login</th>
                        <th className="text-left py-3 px-4">Permissions</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <p className="text-xs text-gray-500">ID: {user.id}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{user.role}</p>
                              <p className="text-sm text-gray-600">{user.department}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(user.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(user.status)}
                                <span>{getStatusText(user.status)}</span>
                              </div>
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-900">{user.lastLogin}</p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {user.permissions.slice(0, 2).map((perm, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {perm}
                                </Badge>
                              ))}
                              {user.permissions.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.permissions.length - 2}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                {user.status === 'active' ? (
                                  <Lock className="h-4 w-4" />
                                ) : (
                                  <Unlock className="h-4 w-4" />
                                )}
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
          </>
        )}

        {activeTab === 'roles' && (
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {roles.map((role) => (
                  <div key={role.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{role.name}</h3>
                          {role.isSystem && (
                            <Badge className="bg-blue-100 text-blue-800">System Role</Badge>
                          )}
                          <Badge variant="outline">{role.userCount} users</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{role.description}</p>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Permissions:</p>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.slice(0, 5).map((perm, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                            {role.permissions.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {!role.isSystem && (
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'permissions' && (
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Permission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-gray-900">{permission.name}</h4>
                        <Badge variant="outline">{permission.category}</Badge>
                        <Badge className={permission.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {permission.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}