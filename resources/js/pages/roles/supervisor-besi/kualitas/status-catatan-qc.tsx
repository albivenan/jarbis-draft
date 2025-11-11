import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, MessageSquare, CheckCircle, AlertTriangle, Clock, FileText } from 'lucide-react';

export default function StatusCatatanQC() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [supervisorResponse, setSupervisorResponse] = useState<string>('');

  const qcReports = [
    {
      id: 'QC-BSI-001',
      workOrder: 'WO-BSI-001',
      product: 'Rangka Besi H-Beam 200x100',
      qcInspector: 'Indra Wijaya',
      inspectionDate: '2025-01-05',
      status: 'passed',
      score: 95,
      supervisor: 'Supervisor Besi A',
      crew: 'Ahmad Santoso',
      notes: 'Kualitas pengelasan sangat baik, sesuai standar teknis. Dimensi presisi.',
      issues: [],
      supervisorResponse: 'Terima kasih atas feedback positif. Crew akan dipertahankan performanya.',
      responseDate: '2025-01-05'
    },
    {
      id: 'QC-BSI-002',
      workOrder: 'WO-BSI-002',
      product: 'Pagar Besi Ornamen',
      qcInspector: 'Indra Wijaya',
      inspectionDate: '2025-01-05',
      status: 'failed',
      score: 65,
      supervisor: 'Supervisor Besi A',
      crew: 'Candra Wijaya',
      notes: 'Ditemukan beberapa masalah pada ornamen',
      issues: [
        'Jarak antar ornamen tidak konsisten',
        'Beberapa sambungan kurang kuat',
        'Finishing cat tidak merata di bagian sudut'
      ],
      supervisorResponse: null,
      responseDate: null
    },
    {
      id: 'QC-BSI-003',
      workOrder: 'WO-BSI-001',
      product: 'Rangka Besi H-Beam 200x100',
      qcInspector: 'Indra Wijaya',
      inspectionDate: '2025-01-04',
      status: 'conditional',
      score: 78,
      supervisor: 'Supervisor Besi A',
      crew: 'Budi Prasetyo',
      notes: 'Kualitas baik dengan beberapa perbaikan minor',
      issues: [
        'Perlu touch-up pada 2 titik las',
        'Pembersihan slag kurang optimal'
      ],
      supervisorResponse: 'Sudah dilakukan perbaikan sesuai catatan QC. Crew sudah diberi training tambahan.',
      responseDate: '2025-01-04'
    }
  ];

  const filteredReports = qcReports.filter(report => {
    const matchesSearch = report.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.workOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.crew.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'conditional': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'passed': return 'Lulus';
      case 'failed': return 'Tidak Lulus';
      case 'conditional': return 'Lulus Bersyarat';
      case 'pending': return 'Menunggu';
      default: return status;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSubmitResponse = () => {
    if (!selectedItem || !supervisorResponse.trim()) {
      alert('Mohon isi respon supervisor');
      return;
    }

    // Here would be the API call to submit supervisor response
    console.log({
      qcReportId: selectedItem,
      response: supervisorResponse,
      responseDate: new Date().toISOString()
    });

    alert('Respon supervisor berhasil dikirim!');
    setSelectedItem(null);
    setSupervisorResponse('');
  };

  const stats = [
    {
      title: 'Total Laporan QC',
      value: qcReports.length.toString(),
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Lulus QC',
      value: qcReports.filter(r => r.status === 'passed').length.toString(),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Perlu Respon',
      value: qcReports.filter(r => !r.supervisorResponse).length.toString(),
      icon: MessageSquare,
      color: 'text-orange-600'
    },
    {
      title: 'Rata-rata Score',
      value: `${Math.round(qcReports.reduce((acc, r) => acc + r.score, 0) / qcReports.length)}`,
      icon: AlertTriangle,
      color: 'text-purple-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Status & Catatan QC"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/supervisor-besi' },
        { title: 'Umpan Balik Kualitas', href: '#' },
        { title: 'Status & Catatan QC', href: '/roles/supervisor-besi/kualitas/status-catatan-qc' }
      ]}
    >
      <Head title="Status & Catatan QC - Supervisor Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Search className="h-8 w-8 text-gray-600" />
              Status & Catatan QC
            </h1>
            <p className="text-gray-600 mt-1">Monitor feedback QC dan berikan respon untuk perbaikan</p>
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
                    placeholder="Cari berdasarkan produk, WO, atau crew..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status QC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="passed">Lulus</SelectItem>
                  <SelectItem value="failed">Tidak Lulus</SelectItem>
                  <SelectItem value="conditional">Lulus Bersyarat</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* QC Reports */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{report.id} - {report.product}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {report.workOrder} • Crew: {report.crew} • QC: {report.qcInspector}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(report.status)}>
                      {getStatusText(report.status)}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">Score QC</p>
                      <p className={`text-lg font-bold ${getScoreColor(report.score)}`}>
                        {report.score}/100
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Catatan QC:</p>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                      <p className="text-sm text-blue-800">{report.notes}</p>
                      <p className="text-xs text-blue-600 mt-2">
                        Tanggal Inspeksi: {new Date(report.inspectionDate).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>

                  {report.issues && report.issues.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Issues yang Ditemukan:</p>
                      <div className="space-y-2">
                        {report.issues.map((issue, index) => (
                          <div key={index} className="flex items-start gap-2 bg-red-50 p-3 rounded">
                            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                            <p className="text-sm text-red-800">{issue}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.supervisorResponse ? (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Respon Supervisor:</p>
                      <div className="bg-green-50 border-l-4 border-green-400 p-3">
                        <p className="text-sm text-green-800">{report.supervisorResponse}</p>
                        <p className="text-xs text-green-600 mt-2">
                          Tanggal Respon: {report.responseDate ? new Date(report.responseDate).toLocaleDateString('id-ID') : '-'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Menunggu Respon Supervisor</p>
                          <p className="text-xs text-yellow-600">Berikan feedback untuk crew dan tindak lanjut</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-yellow-600 hover:bg-yellow-700"
                          onClick={() => setSelectedItem(report.id)}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Beri Respon
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      Detail Lengkap
                    </Button>
                    {report.status === 'failed' && (
                      <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                        Buat Rework Request
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Response Dialog */}
        {selectedItem && (
          <Card className="border-2 border-blue-500">
            <CardHeader>
              <CardTitle>Beri Respon untuk {selectedItem}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Respon Supervisor <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={supervisorResponse}
                  onChange={(e) => setSupervisorResponse(e.target.value)}
                  placeholder="Berikan feedback untuk crew, tindak lanjut yang akan dilakukan, atau apresiasi atas kinerja yang baik..."
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmitResponse}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!supervisorResponse.trim()}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Kirim Respon
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedItem(null);
                    setSupervisorResponse('');
                  }}
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}