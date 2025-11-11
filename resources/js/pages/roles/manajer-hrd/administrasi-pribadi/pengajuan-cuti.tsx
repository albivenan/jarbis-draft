import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  CalendarDays,
  Briefcase
} from 'lucide-react';

interface LeaveRequest {
  id: string;
  type: 'annual' | 'sick' | 'emergency' | 'maternity' | 'other';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  documents?: string[];
}

interface LeaveBalance {
  annual: {
    total: number;
    used: number;
    remaining: number;
  };
  sick: {
    total: number;
    used: number;
    remaining: number;
  };
  emergency: {
    total: number;
    used: number;
    remaining: number;
  };
}

export default function PengajuanCutiManajerHRD() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'requests' | 'balance' | 'history'>('requests');
  
  const [formData, setFormData] = useState({
    type: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
    documents: []
  });

  const leaveBalance: LeaveBalance = {
    annual: {
      total: 12,
      used: 3,
      remaining: 9
    },
    sick: {
      total: 12,
      used: 1,
      remaining: 11
    },
    emergency: {
      total: 2,
      used: 0,
      remaining: 2
    }
  };

  const leaveRequests: LeaveRequest[] = [
    {
      id: 'LR-001',
      type: 'annual',
      startDate: '2024-02-15',
      endDate: '2024-02-16',
      days: 2,
      reason: 'Acara keluarga - pernikahan adik',
      status: 'approved',
      submittedDate: '2024-01-20',
      approvedBy: 'Direktur',
      approvedDate: '2024-01-22'
    },
    {
      id: 'LR-002',
      type: 'sick',
      startDate: '2024-01-10',
      endDate: '2024-01-10',
      days: 1,
      reason: 'Demam dan flu',
      status: 'approved',
      submittedDate: '2024-01-10',
      approvedBy: 'Direktur',
      approvedDate: '2024-01-10',
      documents: ['surat-dokter.pdf']
    },
    {
      id: 'LR-003',
      type: 'annual',
      startDate: '2024-03-01',
      endDate: '2024-03-03',
      days: 3,
      reason: 'Liburan keluarga ke Bali',
      status: 'pending',
      submittedDate: '2024-01-15'
    }
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'annual': return 'Cuti Tahunan';
      case 'sick': return 'Cuti Sakit';
      case 'emergency': return 'Cuti Darurat';
      case 'maternity': return 'Cuti Melahirkan';
      default: return 'Lainnya';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'bg-blue-100 text-blue-800';
      case 'sick': return 'bg-red-100 text-red-800';
      case 'emergency': return 'bg-orange-100 text-orange-800';
      case 'maternity': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const calculateDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting leave request:', formData);
    setShowForm(false);
    // Reset form
    setFormData({
      type: 'annual',
      startDate: '',
      endDate: '',
      reason: '',
      documents: []
    });
  };

  const pendingRequests = leaveRequests.filter(req => req.status === 'pending');
  const approvedRequests = leaveRequests.filter(req => req.status === 'approved');

  return (
    <AuthenticatedLayout
      title="Pengajuan Cuti"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-hrd' },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Pengajuan Cuti', href: '/roles/manajer-hrd/administrasi-pribadi/pengajuan-cuti' }
      ]}
    >
      <Head title="Pengajuan Cuti - Manajer HRD" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              Pengajuan Cuti
            </h1>
            <p className="text-gray-600 mt-1">Kelola pengajuan cuti dan izin pribadi</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajukan Cuti
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setSelectedTab('requests')}
            className={`px-6 py-3 font-medium ${
              selectedTab === 'requests' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pengajuan Saya
          </button>
          <button
            onClick={() => setSelectedTab('balance')}
            className={`px-6 py-3 font-medium ${
              selectedTab === 'balance' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Saldo Cuti
          </button>
          <button
            onClick={() => setSelectedTab('history')}
            className={`px-6 py-3 font-medium ${
              selectedTab === 'history' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Riwayat
          </button>
        </div>

        {selectedTab === 'requests' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Summary Cards */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-900">{pendingRequests.length}</p>
                      </div>
                      <div className="p-3 rounded-full bg-yellow-100">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Disetujui</p>
                        <p className="text-2xl font-bold text-green-900">{approvedRequests.length}</p>
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
                        <p className="text-sm font-medium text-gray-600">Total Hari</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {leaveRequests.reduce((sum, req) => sum + req.days, 0)}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-blue-100">
                        <CalendarDays className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Leave Requests List */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Daftar Pengajuan Cuti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaveRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getTypeColor(request.type)}>
                                {getTypeLabel(request.type)}
                              </Badge>
                              <Badge className={getStatusColor(request.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(request.status)}
                                  <span className="capitalize">{request.status}</span>
                                </div>
                              </Badge>
                              <span className="text-sm text-gray-500">ID: {request.id}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                              <div>
                                <p className="text-sm font-medium text-gray-700">Tanggal</p>
                                <p className="text-gray-900">
                                  {new Date(request.startDate).toLocaleDateString('id-ID')} - {new Date(request.endDate).toLocaleDateString('id-ID')}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Durasi</p>
                                <p className="text-gray-900">{request.days} hari</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Tanggal Pengajuan</p>
                                <p className="text-gray-900">{new Date(request.submittedDate).toLocaleDateString('id-ID')}</p>
                              </div>
                            </div>
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700">Alasan</p>
                              <p className="text-gray-900">{request.reason}</p>
                            </div>
                            {request.status === 'approved' && request.approvedBy && (
                              <div className="text-sm text-green-600">
                                Disetujui oleh {request.approvedBy} pada {new Date(request.approvedDate!).toLocaleDateString('id-ID')}
                              </div>
                            )}
                            {request.documents && request.documents.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">Dokumen Pendukung</p>
                                <div className="flex gap-2 mt-1">
                                  {request.documents.map((doc, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      <FileText className="h-3 w-3 mr-1" />
                                      {doc}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedTab === 'balance' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Cuti Tahunan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total</span>
                    <span className="font-semibold">{leaveBalance.annual.total} hari</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Terpakai</span>
                    <span className="font-semibold text-red-600">{leaveBalance.annual.used} hari</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sisa</span>
                    <span className="font-semibold text-green-600">{leaveBalance.annual.remaining} hari</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(leaveBalance.annual.used / leaveBalance.annual.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-red-600" />
                  Cuti Sakit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total</span>
                    <span className="font-semibold">{leaveBalance.sick.total} hari</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Terpakai</span>
                    <span className="font-semibold text-red-600">{leaveBalance.sick.used} hari</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sisa</span>
                    <span className="font-semibold text-green-600">{leaveBalance.sick.remaining} hari</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${(leaveBalance.sick.used / leaveBalance.sick.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Cuti Darurat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total</span>
                    <span className="font-semibold">{leaveBalance.emergency.total} hari</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Terpakai</span>
                    <span className="font-semibold text-red-600">{leaveBalance.emergency.used} hari</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sisa</span>
                    <span className="font-semibold text-green-600">{leaveBalance.emergency.remaining} hari</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{ width: `${(leaveBalance.emergency.used / leaveBalance.emergency.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'history' && (
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Cuti 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.filter(req => req.status !== 'pending').map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{getTypeLabel(request.type)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(request.startDate).toLocaleDateString('id-ID')} - {new Date(request.endDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">{request.days} hari</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ajukan Cuti Baru</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Cuti</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="annual">Cuti Tahunan</option>
                    <option value="sick">Cuti Sakit</option>
                    <option value="emergency">Cuti Darurat</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
                {formData.startDate && formData.endDate && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Durasi: {calculateDays(formData.startDate, formData.endDate)} hari
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alasan</label>
                  <Textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="Jelaskan alasan pengajuan cuti..."
                    rows={3}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1">
                    Ajukan
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}