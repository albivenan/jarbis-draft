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
  RefreshCw, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Package, 
  Calendar,
  Search,
  Filter,
  Play,
  Pause,
  FileText,
  Camera,
  MessageSquare
} from 'lucide-react';

export default function AntreanRework() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string>('');

  const reworkQueue = [
    {
      id: 'RW-BSI-001',
      workOrderId: 'WO-BSI-001',
      workOrderTitle: 'Rangka Besi H-Beam',
      itemCode: 'HB-300x150',
      itemDescription: 'H-Beam 300x150x6.5x9mm, panjang 6m',
      quantity: 2,
      unit: 'pcs',
      qcReportId: 'QC-BSI-001-REJ',
      rejectionReason: 'Dimensi tidak sesuai spesifikasi',
      rejectionDetails: 'Tinggi H-beam kurang 5mm dari standar. Ditemukan pada 2 dari 5 batang yang diproduksi.',
      rejectionDate: '2025-01-05 14:30',
      qcInspector: 'QC Besi - Indra Wijaya',
      priority: 'high',
      status: 'pending',
      assignedCrew: '',
      estimatedDuration: '4 jam',
      reworkInstructions: 'Lakukan pemotongan ulang sesuai drawing. Pastikan dimensi tinggi 300mm ±2mm.',
      requiredMaterials: ['H-beam raw material tambahan', 'Elektroda E7018'],
      photos: ['photo1.jpg', 'photo2.jpg'],
      createdAt: '2025-01-05 14:45',
      targetCompletion: '2025-01-06 10:00'
    },
    {
      id: 'RW-BSI-002',
      workOrderId: 'WO-BSI-002',
      workOrderTitle: 'Pagar Besi Ornamen',
      itemCode: 'PGR-ORN-001',
      itemDescription: 'Panel pagar ornamen 2x1.5m',
      quantity: 1,
      unit: 'panel',
      qcReportId: 'QC-BSI-002-REJ',
      rejectionReason: 'Kualitas pengelasan tidak memenuhi standar',
      rejectionDetails: 'Ditemukan porosity pada sambungan las bagian ornamen. Kekuatan sambungan tidak optimal.',
      rejectionDate: '2025-01-05 11:20',
      qcInspector: 'QC Besi - Indra Wijaya',
      priority: 'medium',
      status: 'in_progress',
      assignedCrew: 'Ahmad Santoso',
      estimatedDuration: '6 jam',
      reworkInstructions: 'Grinding sambungan las yang bermasalah, lakukan pengelasan ulang dengan teknik yang benar.',
      requiredMaterials: ['Elektroda E6013', 'Grinding disc'],
      photos: ['photo3.jpg'],
      createdAt: '2025-01-05 11:35',
      targetCompletion: '2025-01-05 18:00',
      startedAt: '2025-01-05 13:00',
      progressNotes: 'Sudah selesai grinding, sedang proses pengelasan ulang'
    },
    {
      id: 'RW-BSI-003',
      workOrderId: 'WO-BSI-003',
      workOrderTitle: 'Struktur Baja Ringan',
      itemCode: 'SBR-75x35',
      itemDescription: 'Rangka baja ringan 75x35mm',
      quantity: 5,
      unit: 'batang',
      qcReportId: 'QC-BSI-003-REJ',
      rejectionReason: 'Coating tidak merata',
      rejectionDetails: 'Lapisan galvanis tidak merata pada beberapa bagian. Berpotensi korosi prematur.',
      rejectionDate: '2025-01-04 16:45',
      qcInspector: 'QC Besi - Indra Wijaya',
      priority: 'low',
      status: 'completed',
      assignedCrew: 'Budi Prasetyo',
      estimatedDuration: '3 jam',
      reworkInstructions: 'Lakukan re-coating pada area yang bermasalah.',
      requiredMaterials: ['Zinc spray coating', 'Wire brush'],
      photos: ['photo4.jpg', 'photo5.jpg'],
      createdAt: '2025-01-04 17:00',
      targetCompletion: '2025-01-05 08:00',
      startedAt: '2025-01-05 07:00',
      completedAt: '2025-01-05 10:30',
      progressNotes: 'Rework selesai, sudah pass QC ulang'
    },
    {
      id: 'RW-BSI-004',
      workOrderId: 'WO-BSI-001',
      workOrderTitle: 'Rangka Besi H-Beam',
      itemCode: 'HB-CONN-001',
      itemDescription: 'Connection plate H-beam',
      quantity: 4,
      unit: 'pcs',
      qcReportId: 'QC-BSI-001-REJ-02',
      rejectionReason: 'Lubang baut tidak presisi',
      rejectionDetails: 'Diameter lubang baut tidak sesuai, terlalu besar 1mm. Akan mempengaruhi kekuatan sambungan.',
      rejectionDate: '2025-01-05 09:15',
      qcInspector: 'QC Besi - Indra Wijaya',
      priority: 'critical',
      status: 'pending',
      assignedCrew: '',
      estimatedDuration: '5 jam',
      reworkInstructions: 'Buat connection plate baru dengan drilling yang presisi sesuai drawing.',
      requiredMaterials: ['Steel plate 10mm', 'Drill bit set'],
      photos: ['photo6.jpg'],
      createdAt: '2025-01-05 09:30',
      targetCompletion: '2025-01-05 16:00'
    }
  ];

  const crewMembers = [
    { value: 'ahmad_santoso', label: 'Ahmad Santoso - Lead Welder' },
    { value: 'budi_prasetyo', label: 'Budi Prasetyo - Cutting Specialist' },
    { value: 'candra_wijaya', label: 'Candra Wijaya - Assembly Tech' },
    { value: 'dedi_kurniawan', label: 'Dedi Kurniawan - Finishing' },
    { value: 'eko_susanto', label: 'Eko Susanto - Junior Welder' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on_hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'in_progress': return 'Dikerjakan';
      case 'completed': return 'Selesai';
      case 'on_hold': return 'Ditunda';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-200 text-red-900';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'critical': return 'Kritis';
      case 'high': return 'Tinggi';
      case 'medium': return 'Sedang';
      case 'low': return 'Rendah';
      default: return priority;
    }
  };

  const filteredRework = reworkQueue.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.workOrderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    const matchesPriority = !selectedPriority || item.priority === selectedPriority;
    const matchesWorkOrder = !selectedWorkOrder || item.workOrderId === selectedWorkOrder;

    return matchesSearch && matchesStatus && matchesPriority && matchesWorkOrder;
  });

  const stats = [
    {
      title: 'Total Rework',
      value: reworkQueue.length.toString(),
      icon: RefreshCw,
      color: 'text-blue-600'
    },
    {
      title: 'Menunggu',
      value: reworkQueue.filter(item => item.status === 'pending').length.toString(),
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Dikerjakan',
      value: reworkQueue.filter(item => item.status === 'in_progress').length.toString(),
      icon: Play,
      color: 'text-blue-600'
    },
    {
      title: 'Selesai Hari Ini',
      value: reworkQueue.filter(item => item.status === 'completed' && item.completedAt?.startsWith('2025-01-05')).length.toString(),
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  const handleAssignCrew = (reworkId: string, crewId: string) => {
    console.log(`Assigning crew ${crewId} to rework ${reworkId}`);
    alert('Crew berhasil ditugaskan!');
  };

  const handleStartRework = (reworkId: string) => {
    console.log(`Starting rework ${reworkId}`);
    alert('Rework dimulai!');
  };

  const handleCompleteRework = (reworkId: string) => {
    console.log(`Completing rework ${reworkId}`);
    alert('Rework selesai! Menunggu QC ulang.');
  };

  return (
    <AuthenticatedLayout
      title="Antrean Pengerjaan Ulang (Rework)"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/supervisor-besi' },
        { title: 'Umpan Balik Kualitas', href: '#' },
        { title: 'Antrean Rework', href: '/roles/supervisor-besi/kualitas/antrean-rework' }
      ]}
    >
      <Head title="Antrean Pengerjaan Ulang - Supervisor Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <RefreshCw className="h-8 w-8 text-orange-600" />
              Antrean Pengerjaan Ulang
            </h1>
            <p className="text-gray-600 mt-1">Kelola dan monitor pengerjaan ulang produk yang ditolak QC</p>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Pencarian
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari ID rework, item, atau WO..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="in_progress">Dikerjakan</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="on_hold">Ditunda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Prioritas
                </label>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua prioritas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua prioritas</SelectItem>
                    <SelectItem value="critical">Kritis</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="low">Rendah</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Work Order
                </label>
                <Select value={selectedWorkOrder} onValueChange={setSelectedWorkOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua WO" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua WO</SelectItem>
                    <SelectItem value="WO-BSI-001">WO-BSI-001</SelectItem>
                    <SelectItem value="WO-BSI-002">WO-BSI-002</SelectItem>
                    <SelectItem value="WO-BSI-003">WO-BSI-003</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rework Queue */}
        <div className="space-y-4">
          {filteredRework.map((item) => (
            <Card key={item.id} className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.id}</h3>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </Badge>
                      <Badge className={getPriorityColor(item.priority)}>
                        {getPriorityText(item.priority)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {item.workOrderId} - {item.workOrderTitle}
                      </span>
                      <span>•</span>
                      <span>{item.itemCode}</span>
                      <span>•</span>
                      <span>{item.quantity} {item.unit}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{item.itemDescription}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {item.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStartRework(item.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Mulai
                      </Button>
                    )}
                    {item.status === 'in_progress' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleCompleteRework(item.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Selesai
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Rejection Details */}
                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Alasan Penolakan QC
                      </h4>
                      <p className="text-red-700 font-medium mb-2">{item.rejectionReason}</p>
                      <p className="text-red-600 text-sm">{item.rejectionDetails}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-red-600">
                        <span>QC Report: {item.qcReportId}</span>
                        <span>•</span>
                        <span>Inspector: {item.qcInspector}</span>
                        <span>•</span>
                        <span>Tanggal: {item.rejectionDate}</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Instruksi Rework</h4>
                      <p className="text-blue-700 text-sm mb-3">{item.reworkInstructions}</p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-blue-800">Material yang Diperlukan:</p>
                          <ul className="text-xs text-blue-700 ml-4">
                            {item.requiredMaterials.map((material, index) => (
                              <li key={index} className="list-disc">{material}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-blue-600">
                          <span>Estimasi: {item.estimatedDuration}</span>
                          <span>•</span>
                          <span>Target: {item.targetCompletion}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assignment & Progress */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-3">Penugasan Crew</h4>
                      {item.assignedCrew ? (
                        <div className="flex items-center gap-2 mb-3">
                          <User className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">{item.assignedCrew}</span>
                          <Badge variant="outline">Ditugaskan</Badge>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Select onValueChange={(value) => handleAssignCrew(item.id, value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih crew untuk rework" />
                            </SelectTrigger>
                            <SelectContent>
                              {crewMembers.map((crew) => (
                                <SelectItem key={crew.value} value={crew.value}>
                                  {crew.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {item.startedAt && (
                        <div className="text-xs text-gray-600 mt-2">
                          <p>Dimulai: {item.startedAt}</p>
                          {item.completedAt && <p>Selesai: {item.completedAt}</p>}
                        </div>
                      )}
                    </div>

                    {item.progressNotes && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Catatan Progress
                        </h4>
                        <p className="text-green-700 text-sm">{item.progressNotes}</p>
                      </div>
                    )}

                    {item.photos && item.photos.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          Foto Dokumentasi ({item.photos.length})
                        </h4>
                        <div className="flex gap-2">
                          {item.photos.map((photo, index) => (
                            <div key={index} className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center">
                              <Camera className="w-6 h-6 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredRework.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Tidak ada item rework yang sesuai dengan filter</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}