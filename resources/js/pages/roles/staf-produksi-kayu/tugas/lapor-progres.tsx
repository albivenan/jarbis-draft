import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, AlertTriangle, CheckCircle, Camera, Upload } from 'lucide-react';

export default function LaporProgres() {
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [issues, setIssues] = useState<string>('');

  const activeTasks = [
    {
      id: 'TASK-KYU-001',
      workOrder: 'WO-KYU-001',
      taskName: 'Pemotongan Kayu Jati',
      product: 'Meja Kayu Jati Custom',
      currentProgress: 60,
      estimatedHours: 4,
      actualHours: 2.5,
      deadline: '2025-01-06',
      status: 'in_progress'
    },
    {
      id: 'TASK-KYU-002',
      workOrder: 'WO-KYU-001',
      taskName: 'Perakitan dan Penyambungan',
      product: 'Meja Kayu Jati Custom',
      currentProgress: 0,
      estimatedHours: 6,
      actualHours: 0,
      deadline: '2025-01-07',
      status: 'pending'
    },
    {
      id: 'TASK-KYU-003',
      workOrder: 'WO-KYU-002',
      taskName: 'Finishing Duco Premium',
      product: 'Lemari Kayu Mahoni',
      currentProgress: 30,
      estimatedHours: 6,
      actualHours: 2,
      deadline: '2025-01-08',
      status: 'in_progress'
    }
  ];

  const recentReports = [
    {
      id: 'RPT-001',
      taskId: 'TASK-KYU-001',
      taskName: 'Pemotongan Kayu Jati',
      reportTime: '2025-01-05 15:30',
      progress: 60,
      timeSpent: 2.5,
      status: 'on_track',
      notes: 'Pemotongan berjalan lancar, sudah menyelesaikan 3 dari 5 komponen meja'
    },
    {
      id: 'RPT-002',
      taskId: 'TASK-KYU-003',
      taskName: 'Finishing Duco Premium',
      reportTime: '2025-01-05 13:15',
      progress: 30,
      timeSpent: 2,
      status: 'on_track',
      notes: 'Base coat sudah selesai, menunggu pengeringan sebelum pengamplasan'
    },
    {
      id: 'RPT-003',
      taskId: 'TASK-KYU-004',
      taskName: 'Pembuatan Ornamen Ukir',
      reportTime: '2025-01-05 10:00',
      progress: 100,
      timeSpent: 8,
      status: 'completed',
      notes: 'Ornamen ukir selesai dengan detail yang presisi sesuai desain'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on_track': return 'bg-blue-100 text-blue-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'on_track': return 'Sesuai Jadwal';
      case 'delayed': return 'Terlambat';
      case 'in_progress': return 'Dalam Progres';
      default: return status;
    }
  };

  const handleSubmitReport = () => {
    if (!selectedTask || progressPercentage === 0 || !timeSpent) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    // Here would be the API call to submit the progress report
    console.log({
      taskId: selectedTask,
      progress: progressPercentage,
      timeSpent: parseFloat(timeSpent),
      notes,
      issues,
      reportTime: new Date().toISOString()
    });

    alert('Laporan progres berhasil dikirim!');
    
    // Reset form
    setSelectedTask('');
    setProgressPercentage(0);
    setTimeSpent('');
    setNotes('');
    setIssues('');
  };

  const stats = [
    {
      title: 'Tugas Aktif',
      value: activeTasks.length.toString(),
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      title: 'Rata-rata Progress',
      value: `${Math.round(activeTasks.reduce((acc, task) => acc + task.currentProgress, 0) / activeTasks.length)}%`,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Laporan Hari Ini',
      value: recentReports.filter(r => r.reportTime.startsWith('2025-01-05')).length.toString(),
      icon: CheckCircle,
      color: 'text-purple-600'
    },
    {
      title: 'Kendala Aktif',
      value: recentReports.filter(r => r.status === 'delayed').length.toString(),
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Lapor Progres"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-produksi-kayu' },
        { title: 'Tugas Produksi', href: '#' },
        { title: 'Lapor Progres', href: '/roles/staf-produksi-kayu/tugas/lapor-progres' }
      ]}
    >
      <Head title="Lapor Progres - Staf Produksi Kayu" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-amber-600" />
              Lapor Progres Tugas
            </h1>
            <p className="text-gray-600 mt-1">Update progres dan kendala tugas produksi kayu</p>
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
          {/* Progress Report Form */}
          <Card>
            <CardHeader>
              <CardTitle>Buat Laporan Progres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Pilih Tugas <span className="text-red-500">*</span>
                </label>
                <Select value={selectedTask} onValueChange={setSelectedTask}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tugas yang sedang dikerjakan" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.taskName} - {task.workOrder}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTask && (
                <div className="bg-amber-50 p-4 rounded-lg">
                  {(() => {
                    const task = activeTasks.find(t => t.id === selectedTask);
                    return task ? (
                      <div>
                        <h4 className="font-medium mb-2">{task.taskName}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Produk:</span>
                            <p className="font-medium">{task.product}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Progress Saat Ini:</span>
                            <p className="font-medium">{task.currentProgress}%</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Waktu Kerja:</span>
                            <p className="font-medium">{task.actualHours}h / {task.estimatedHours}h</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Deadline:</span>
                            <p className="font-medium">{new Date(task.deadline).toLocaleDateString('id-ID')}</p>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Progress Saat Ini (%) <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={progressPercentage}
                    onChange={(e) => setProgressPercentage(parseInt(e.target.value) || 0)}
                    placeholder="Masukkan persentase progress (0-100)"
                  />
                  <Progress value={progressPercentage} className="w-full" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Waktu yang Dihabiskan (jam) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(e.target.value)}
                  placeholder="Contoh: 2.5"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Catatan Progress
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Jelaskan apa yang sudah dikerjakan, hasil yang dicapai, kualitas finishing, dll..."
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Kendala/Masalah (jika ada)
                </label>
                <Textarea
                  value={issues}
                  onChange={(e) => setIssues(e.target.value)}
                  placeholder="Jelaskan kendala yang dihadapi, material kayu yang kurang, masalah alat, dll..."
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Foto Progress (opsional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload foto hasil kerja kayu</p>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Pilih File
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleSubmitReport}
                className="w-full bg-amber-600 hover:bg-amber-700"
                disabled={!selectedTask || progressPercentage === 0 || !timeSpent}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Kirim Laporan
              </Button>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Laporan Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{report.taskName}</h4>
                        <p className="text-xs text-gray-600">{report.reportTime}</p>
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {getStatusText(report.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Progress</p>
                        <div className="flex items-center gap-2">
                          <Progress value={report.progress} className="flex-1 h-2" />
                          <span className="text-xs font-medium">{report.progress}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Waktu</p>
                        <p className="text-sm font-medium">{report.timeSpent} jam</p>
                      </div>
                    </div>
                    
                    {report.notes && (
                      <div className="bg-amber-50 p-3 rounded text-sm">
                        <p className="text-gray-700">{report.notes}</p>
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