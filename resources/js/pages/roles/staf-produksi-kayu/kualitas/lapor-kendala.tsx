import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, CheckCircle, Camera, Upload, MessageSquare, User } from 'lucide-react';

export default function LaporKendala() {
  const [issueType, setIssueType] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [workOrder, setWorkOrder] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [suggestedSolution, setSuggestedSolution] = useState<string>('');

  const issueTypes = [
    { value: 'material', label: 'Material Kayu Tidak Sesuai' },
    { value: 'equipment', label: 'Kerusakan Alat Woodworking' },
    { value: 'quality', label: 'Masalah Kualitas Finishing' },
    { value: 'safety', label: 'Keselamatan Kerja' },
    { value: 'process', label: 'Proses Produksi Kayu' },
    { value: 'moisture', label: 'Kadar Air Kayu' },
    { value: 'other', label: 'Lainnya' }
  ];

  const priorities = [
    { value: 'low', label: 'Rendah', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Sedang', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'Tinggi', color: 'bg-red-100 text-red-800' },
    { value: 'critical', label: 'Kritis', color: 'bg-red-200 text-red-900' }
  ];

  const activeWorkOrders = [
    { value: 'WO-KYU-001', label: 'WO-KYU-001 - Meja Kayu Jati Custom' },
    { value: 'WO-KYU-002', label: 'WO-KYU-002 - Lemari Kayu Mahoni' },
    { value: 'WO-KYU-003', label: 'WO-KYU-003 - Kursi Kayu Jati Ukir' }
  ];

  const recentIssues = [
    {
      id: 'ISS-KYU-001',
      title: 'Kayu jati mengandung kadar air tinggi',
      workOrder: 'WO-KYU-001',
      type: 'moisture',
      priority: 'high',
      status: 'open',
      reportedBy: 'Slamet Riyadi',
      reportedAt: '2025-01-05 11:30',
      description: 'Kayu jati yang diterima memiliki kadar air 15%, seharusnya maksimal 12% untuk furniture',
      response: null
    },
    {
      id: 'ISS-KYU-002',
      title: 'Mesin planer mengalami gangguan',
      workOrder: 'WO-KYU-002',
      type: 'equipment',
      priority: 'critical',
      status: 'in_progress',
      reportedBy: 'Bambang Sutrisno',
      reportedAt: '2025-01-05 09:15',
      description: 'Mata pisau planer tumpul dan hasil tidak rata, perlu penggantian mata pisau',
      response: 'Tim maintenance sedang mengganti mata pisau. Estimasi selesai 1 jam.'
    },
    {
      id: 'ISS-KYU-003',
      title: 'Hasil finishing duco tidak merata',
      workOrder: 'WO-KYU-002',
      type: 'quality',
      priority: 'medium',
      status: 'resolved',
      reportedBy: 'Agus Prasetyo',
      reportedAt: '2025-01-04 16:20',
      description: 'Beberapa area finishing duco terlihat tidak merata dan ada orange peel',
      response: 'Sudah dilakukan pengamplasan ulang dan re-spray. Hasil sudah sesuai standar.'
    },
    {
      id: 'ISS-KYU-004',
      title: 'Kayu mahoni retak saat pengeringan',
      workOrder: 'WO-KYU-002',
      type: 'material',
      priority: 'high',
      status: 'open',
      reportedBy: 'Candra Wijaya',
      reportedAt: '2025-01-05 14:45',
      description: 'Beberapa papan mahoni mengalami retak rambut setelah proses pengeringan',
      response: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Terbuka';
      case 'in_progress': return 'Dalam Proses';
      case 'resolved': return 'Selesai';
      case 'closed': return 'Ditutup';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : 'bg-gray-100 text-gray-800';
  };

  const getPriorityText = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.label : priority;
  };

  const getTypeText = (type: string) => {
    const typeObj = issueTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const handleSubmitIssue = () => {
    if (!issueType || !priority || !workOrder || !title || !description) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    // Here would be the API call to submit the issue
    console.log({
      type: issueType,
      priority,
      workOrder,
      title,
      description,
      suggestedSolution,
      reportedAt: new Date().toISOString()
    });

    alert('Laporan kendala berhasil dikirim!');
    
    // Reset form
    setIssueType('');
    setPriority('');
    setWorkOrder('');
    setTitle('');
    setDescription('');
    setSuggestedSolution('');
  };

  const stats = [
    {
      title: 'Kendala Terbuka',
      value: recentIssues.filter(i => i.status === 'open').length.toString(),
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      title: 'Dalam Proses',
      value: recentIssues.filter(i => i.status === 'in_progress').length.toString(),
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Selesai Hari Ini',
      value: recentIssues.filter(i => i.status === 'resolved' && i.reportedAt.startsWith('2025-01-05')).length.toString(),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Total Laporan',
      value: recentIssues.length.toString(),
      icon: MessageSquare,
      color: 'text-blue-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Lapor Kendala"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-produksi-kayu' },
        { title: 'Kualitas', href: '#' },
        { title: 'Lapor Kendala', href: '/roles/staf-produksi-kayu/kualitas/lapor-kendala' }
      ]}
    >
      <Head title="Lapor Kendala - Staf Produksi Kayu" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              Lapor Kendala Produksi
            </h1>
            <p className="text-gray-600 mt-1">Laporkan masalah dan kendala dalam proses produksi kayu</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Issue Report Form */}
          <Card>
            <CardHeader>
              <CardTitle>Laporkan Kendala Baru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Jenis Kendala <span className="text-red-500">*</span>
                  </label>
                  <Select value={issueType} onValueChange={setIssueType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kendala" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Prioritas <span className="text-red-500">*</span>
                  </label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat prioritas" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((prio) => (
                        <SelectItem key={prio.value} value={prio.value}>
                          {prio.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Work Order Terkait <span className="text-red-500">*</span>
                </label>
                <Select value={workOrder} onValueChange={setWorkOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Work Order" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeWorkOrders.map((wo) => (
                      <SelectItem key={wo.value} value={wo.value}>
                        {wo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Judul Kendala <span className="text-red-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ringkasan singkat kendala yang dihadapi"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Deskripsi Detail <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan kendala secara detail, kondisi kayu, masalah alat, dampaknya, dll..."
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Saran Solusi (opsional)
                </label>
                <Textarea
                  value={suggestedSolution}
                  onChange={(e) => setSuggestedSolution(e.target.value)}
                  placeholder="Jika ada, berikan saran solusi untuk mengatasi kendala ini..."
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Foto Pendukung (opsional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload foto kendala untuk memperjelas laporan</p>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Pilih File
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleSubmitIssue}
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={!issueType || !priority || !workOrder || !title || !description}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Kirim Laporan Kendala
              </Button>
            </CardContent>
          </Card>

          {/* Recent Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Kendala Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIssues.map((issue) => (
                  <div key={issue.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{issue.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>{issue.workOrder}</span>
                          <span>•</span>
                          <span>{getTypeText(issue.type)}</span>
                          <span>•</span>
                          <span>{issue.reportedAt}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 ml-2">
                        <Badge className={getStatusColor(issue.status)} size="sm">
                          {getStatusText(issue.status)}
                        </Badge>
                        <Badge className={getPriorityColor(issue.priority)} size="sm">
                          {getPriorityText(issue.priority)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-3 rounded text-sm mb-3">
                      <p className="text-gray-700">{issue.description}</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                      <User className="w-3 h-3" />
                      <span>Dilaporkan oleh: {issue.reportedBy}</span>
                    </div>
                    
                    {issue.response && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-3">
                        <p className="text-xs font-medium text-blue-800 mb-1">Respon:</p>
                        <p className="text-xs text-blue-700">{issue.response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}