import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Plus, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

export default function Cuti() {
  const [showForm, setShowForm] = useState(false);
  const [leaveType, setLeaveType] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  const [workHandover, setWorkHandover] = useState<string>('');

  const leaveTypes = [
    { value: 'annual', label: 'Cuti Tahunan', quota: 12, used: 3 },
    { value: 'sick', label: 'Cuti Sakit', quota: 12, used: 1 },
    { value: 'maternity', label: 'Cuti Melahirkan', quota: 3, used: 0 },
    { value: 'marriage', label: 'Cuti Pernikahan', quota: 3, used: 0 },
    { value: 'family', label: 'Cuti Keluarga', quota: 2, used: 0 },
    { value: 'emergency', label: 'Cuti Darurat', quota: 5, used: 1 },
    { value: 'unpaid', label: 'Cuti Tanpa Gaji', quota: 0, used: 0 }
  ];

  const leaveHistory = [
    {
      id: 'LEAVE-2025-001',
      type: 'annual',
      typeLabel: 'Cuti Tahunan',
      startDate: '2025-01-15',
      endDate: '2025-01-17',
      duration: 3,
      reason: 'Liburan keluarga ke Bali',
      status: 'pending',
      submittedDate: '2025-01-05',
      approver: 'Manajer Produksi Besi',
      emergencyContact: 'Siti Ahmad - 081234567890',
      workHandover: 'Tugas supervisi diserahkan kepada Supervisor Besi B',
      documents: ['tiket-pesawat.pdf'],
      notes: ''
    },
    {
      id: 'LEAVE-2024-012',
      type: 'sick',
      typeLabel: 'Cuti Sakit',
      startDate: '2024-12-20',
      endDate: '2024-12-22',
      duration: 3,
      reason: 'Demam tinggi dan flu',
      status: 'approved',
      submittedDate: '2024-12-19',
      approvedDate: '2024-12-19',
      approver: 'Manajer Produksi Besi',
      emergencyContact: 'Siti Ahmad - 081234567890',
      workHandover: 'Koordinasi dengan Supervisor Besi B untuk coverage',
      documents: ['surat-dokter.pdf'],
      notes: 'Disetujui dengan catatan: segera istirahat dan jaga kesehatan'
    },
    {
      id: 'LEAVE-2024-011',
      type: 'annual',
      typeLabel: 'Cuti Tahunan',
      startDate: '2024-11-25',
      endDate: '2024-11-29',
      duration: 5,
      reason: 'Mudik lebaran keluarga',
      status: 'approved',
      submittedDate: '2024-11-10',
      approvedDate: '2024-11-12',
      approver: 'Manajer Produksi Besi',
      emergencyContact: 'Siti Ahmad - 081234567890',
      workHandover: 'Semua tugas supervisi didelegasikan ke Supervisor Besi B dan C',
      documents: [],
      notes: 'Disetujui. Pastikan semua pekerjaan selesai sebelum cuti'
    },
    {
      id: 'LEAVE-2024-010',
      type: 'emergency',
      typeLabel: 'Cuti Darurat',
      startDate: '2024-10-15',
      endDate: '2024-10-15',
      duration: 1,
      reason: 'Keluarga sakit mendadak',
      status: 'approved',
      submittedDate: '2024-10-15',
      approvedDate: '2024-10-15',
      approver: 'Manajer Produksi Besi',
      emergencyContact: 'Siti Ahmad - 081234567890',
      workHandover: 'Koordinasi darurat dengan Supervisor Besi B',
      documents: [],
      notes: 'Disetujui untuk keadaan darurat'
    },
    {
      id: 'LEAVE-2024-009',
      type: 'annual',
      typeLabel: 'Cuti Tahunan',
      startDate: '2024-08-12',
      endDate: '2024-08-16',
      duration: 5,
      reason: 'Liburan keluarga',
      status: 'rejected',
      submittedDate: '2024-08-05',
      rejectedDate: '2024-08-07',
      approver: 'Manajer Produksi Besi',
      emergencyContact: 'Siti Ahmad - 081234567890',
      workHandover: 'Tugas supervisi diserahkan kepada Supervisor Besi B',
      documents: [],
      notes: 'Ditolak karena periode peak production. Silakan ajukan di periode lain'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu Persetujuan';
      case 'approved': return 'Disetujui';
      case 'rejected': return 'Ditolak';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmitLeave = () => {
    if (!leaveType || !startDate || !endDate || !reason) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    const duration = calculateDuration(startDate, endDate);
    const leaveData = {
      type: leaveType,
      startDate,
      endDate,
      duration,
      reason,
      emergencyContact,
      workHandover,
      submittedDate: new Date().toISOString().split('T')[0]
    };

    console.log('Submitting leave request:', leaveData);
    alert('Pengajuan cuti berhasil dikirim!');
    
    // Reset form
    setShowForm(false);
    setLeaveType('');
    setStartDate('');
    setEndDate('');
    setReason('');
    setEmergencyContact('');
    setWorkHandover('');
  };

  const totalUsedDays = leaveHistory
    .filter(leave => leave.status === 'approved' && leave.startDate.startsWith('2025'))
    .reduce((sum, leave) => sum + leave.duration, 0);

  const stats = [
    {
      title: 'Total Cuti Digunakan',
      value: `${totalUsedDays} hari`,
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Cuti Tahunan Tersisa',
      value: `${leaveTypes.find(t => t.value === 'annual')?.quota - leaveTypes.find(t => t.value === 'annual')?.used} hari`,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Pengajuan Pending',
      value: leaveHistory.filter(l => l.status === 'pending').length.toString(),
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Cuti Tahun Ini',
      value: leaveHistory.filter(l => l.startDate.startsWith('2025')).length.toString(),
      icon: FileText,
      color: 'text-purple-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Pengajuan Cuti"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/supervisor-besi' },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Pengajuan Cuti', href: '/roles/supervisor-besi/cuti' }
      ]}
    >
      <Head title="Pengajuan Cuti - Supervisor Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              Pengajuan Cuti
            </h1>
            <p className="text-gray-600 mt-1">Kelola pengajuan cuti dan lihat riwayat cuti Anda</p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajukan Cuti Baru
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leave Request Form */}
          {showForm && (
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Form Pengajuan Cuti Baru</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Jenis Cuti <span className="text-red-500">*</span>
                      </label>
                      <Select value={leaveType} onValueChange={setLeaveType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis cuti" />
                        </SelectTrigger>
                        <SelectContent>
                          {leaveTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label} ({type.quota - type.used} hari tersisa)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Durasi
                      </label>
                      <Input
                        value={startDate && endDate ? `${calculateDuration(startDate, endDate)} hari` : ''}
                        placeholder="Akan dihitung otomatis"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Tanggal Mulai <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Tanggal Selesai <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Alasan Cuti <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Jelaskan alasan pengajuan cuti..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Kontak Darurat
                    </label>
                    <Input
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="Nama dan nomor telepon yang bisa dihubungi"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Serah Terima Pekerjaan
                    </label>
                    <Textarea
                      value={workHandover}
                      onChange={(e) => setWorkHandover(e.target.value)}
                      placeholder="Jelaskan bagaimana pekerjaan akan diserahterimakan selama cuti..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Dokumen Pendukung (opsional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload dokumen pendukung (surat dokter, tiket, dll)</p>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Pilih File
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleSubmitLeave}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!leaveType || !startDate || !endDate || !reason}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Ajukan Cuti
                    </Button>
                    <Button 
                      onClick={() => setShowForm(false)}
                      variant="outline"
                    >
                      Batal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Leave Quota */}
          <div className={showForm ? '' : 'lg:col-span-3'}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Kuota Cuti 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveTypes.map((type) => (
                    <div key={type.value} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{type.label}</p>
                        <p className="text-sm text-gray-600">
                          Digunakan: {type.used} hari
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {type.quota > 0 ? `${type.quota - type.used}/${type.quota}` : 'Unlimited'}
                        </p>
                        <p className="text-sm text-gray-600">tersisa</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Leave History */}
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Pengajuan Cuti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveHistory.map((leave) => (
                    <div key={leave.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{leave.id}</h4>
                            <Badge className={getStatusColor(leave.status)}>
                              {getStatusIcon(leave.status)}
                              <span className="ml-1">{getStatusText(leave.status)}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{leave.typeLabel}</span>
                            <span>•</span>
                            <span>{leave.startDate} s/d {leave.endDate}</span>
                            <span>•</span>
                            <span>{leave.duration} hari</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {leave.status === 'pending' && (
                            <>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded text-sm mb-3">
                        <p className="text-gray-700"><strong>Alasan:</strong> {leave.reason}</p>
                        {leave.workHandover && (
                          <p className="text-gray-700 mt-1"><strong>Serah Terima:</strong> {leave.workHandover}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-4">
                          <span>Diajukan: {leave.submittedDate}</span>
                          {leave.approvedDate && <span>Disetujui: {leave.approvedDate}</span>}
                          {leave.rejectedDate && <span>Ditolak: {leave.rejectedDate}</span>}
                        </div>
                        <span>Approver: {leave.approver}</span>
                      </div>

                      {leave.notes && (
                        <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                          <p className="text-sm text-blue-800"><strong>Catatan:</strong> {leave.notes}</p>
                        </div>
                      )}

                      {leave.documents && leave.documents.length > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Dokumen:</span>
                          {leave.documents.map((doc, index) => (
                            <Button key={index} variant="outline" size="sm" className="h-6 text-xs">
                              <Download className="w-3 h-3 mr-1" />
                              {doc}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}