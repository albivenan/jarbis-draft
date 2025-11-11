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
import { TrendingUp, Clock, AlertTriangle, CheckCircle, Camera, Upload, Users, Package } from 'lucide-react';

export default function LaporProgres() {
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<string>('');
  const [crewPerformance, setCrewPerformance] = useState<Record<string, number>>({});
  const [supervisionNotes, setSupervisionNotes] = useState<string>('');
  const [issues, setIssues] = useState<string>('');
  const [nextActions, setNextActions] = useState<string>('');

  const activeTasks = [
    {
      id: 'TASK-SUP-BSI-001',
      workOrder: 'WO-BSI-001',
      taskName: 'Supervisi Pengelasan H-Beam',
      product: 'Rangka Besi H-Beam 200x100',
      currentProgress: 75,
      estimatedHours: 8,
      actualHours: 6,
      deadline: '2025-01-06',
      status: 'in_progress',
      crewAssigned: [
        { name: 'Ahmad Santoso', role: 'Lead Welder', performance: 95 },
        { name: 'Budi Prasetyo', role: 'Assistant Welder', performance: 88 }
      ],
      checkpoints: [
        { name: 'Safety Briefing', status: 'completed', time: '08:00' },
        { name: 'Material Preparation', status: 'completed', time: '08:30' },
        { name: 'Welding Process', status: 'in_progress', time: '09:00' },
        { name: 'Quality Check', status: 'pending', time: '-' }
      ]
    },
    {
      id: 'TASK-SUP-BSI-002',
      workOrder: 'WO-BSI-002',
      taskName: 'Supervisi Pemasangan Ornamen',
      product: 'Pagar Besi Ornamen',
      currentProgress: 40,
      estimatedHours: 6,
      actualHours: 2.5,
      deadline: '2025-01-07',
      status: 'in_progress',
      crewAssigned: [
        { name: 'Candra Wijaya', role: 'Assembly Lead', performance: 92 },
        { name: 'Eko Susanto', role: 'Helper', performance: 85 }
      ],
      checkpoints: [
        { name: 'Component Check', status: 'completed', time: '08:00' },
        { name: 'Frame Installation', status: 'in_progress', time: '09:30' },
        { name: 'Ornament Fitting', status: 'pending', time: '-' },
        { name: 'Final Inspection', status: 'pending', time: '-' }
      ]
    }
  ];

  const recentReports = [
    {
      id: 'RPT-001',
      taskId: 'TASK-SUP-BSI-001',
      taskName: 'Supervisi Pengelasan H-Beam',
      reportTime: '2025-01-05 14:30',
      progress: 75,
      timeSpent: 6,
      status: 'on_track',
      supervisionNotes: 'Progres sesuai jadwal. Kualitas pengelasan Ahmad sangat baik, Budi perlu sedikit guidance.',
      crewEvaluation: 'Ahmad: Excellent (95%), Budi: Good (88%)',
      nextActions: 'Lanjutkan ke tahap quality check, siapkan tools inspeksi'
    },
    {
      id: 'RPT-002',
      taskId: 'TASK-SUP-BSI-002',
      taskName: 'Supervisi Pemasangan Ornamen',
      reportTime: '2025-01-05 11:15',
      progress: 40,
      timeSpent: 2.5,
      status: 'on_track',
      supervisionNotes: 'Frame installation berjalan lancar. Candra menunjukkan leadership yang baik.',
      crewEvaluation: 'Candra: Excellent (92%), Eko: Good (85%)',
      nextActions: 'Mulai pemasangan ornamen detail, pastikan spacing konsisten'
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

  const getCheckpointStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const handleCrewPerformanceChange = (crewName: string, performance: number) => {
    setCrewPerformance(prev => ({
      ...prev,
      [crewName]: performance
    }));
  };

  const handleSubmitReport = () => {
    if (!selectedTask || progressPercentage === 0 || !timeSpent) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    const reportData = {
      taskId: selectedTask,
      progress: progressPercentage,
      timeSpent: parseFloat(timeSpent),
      crewPerformance,
      supervisionNotes,
      issues,
      nextActions,
      reportTime: new Date().toISOString(),
      supervisor: 'Supervisor Besi A'
    };

    console.log('Submitting supervision report:', reportData);
    alert('Laporan supervisi berhasil dikirim!');
    
    // Reset form
    setSelectedTask('');
    setProgressPercentage(0);
    setTimeSpent('');
    setCrewPerformance({});
    setSupervisionNotes('');
    setIssues('');
    setNextActions('');
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
      title: 'Crew Diawasi',
      value: activeTasks.reduce((acc, task) => acc + task.crewAssigned.length, 0).toString(),
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Lapor Progres Fabrikasi"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/supervisor-besi' },
        { title: 'Tugas Saya', href: '#' },
        { title: 'Lapor Progres Fabrikasi', href: '/roles/supervisor-besi/tugas-saya/lapor-progres' }
      ]}
    >
      <Head title="Lapor Progres Fabrikasi - Supervisor Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-gray-600" />
              Lapor Progres Supervisi
            </h1>
            <p className="text-gray-600 mt-1">Update progres supervisi dan evaluasi kinerja crew</p>
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
              <CardTitle>Buat Laporan Supervisi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Pilih Tugas Supervisi <span className="text-red-500">*</span>
                </label>
                <Select value={selectedTask} onValueChange={setSelectedTask}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tugas yang sedang disupervisi" />
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
                <div className="bg-gray-50 p-4 rounded-lg">
                  {(() => {
                    const task = activeTasks.find(t => t.id === selectedTask);
                    return task ? (
                      <div>
                        <h4 className="font-medium mb-2">{task.taskName}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Produk:</span>
                            <p className="font-medium">{task.product}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Progress Saat Ini:</span>
                            <p className="font-medium">{task.currentProgress}%</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Waktu Supervisi:</span>
                            <p className="font-medium">{task.actualHours}h / {task.estimatedHours}h</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Deadline:</span>
                            <p className="font-medium">{new Date(task.deadline).toLocaleDateString('id-ID')}</p>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-gray-600 text-sm">Crew yang Diawasi:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {task.crewAssigned.map((crew, index) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {crew.name} ({crew.role})
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-3">
                          <span className="text-gray-600 text-sm">Checkpoint Status:</span>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {task.checkpoints.map((checkpoint, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs">
                                <CheckCircle className={`w-3 h-3 ${getCheckpointStatusColor(checkpoint.status)}`} />
                                <span>{checkpoint.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Progress Supervisi (%) <span className="text-red-500">*</span>
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
                  Waktu Supervisi (jam) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(e.target.value)}
                  placeholder="Contoh: 6.5"
                />
              </div>

              {selectedTask && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Evaluasi Kinerja Crew
                  </label>
                  <div className="space-y-3">
                    {activeTasks.find(t => t.id === selectedTask)?.crewAssigned.map((crew) => (
                      <div key={crew.name} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="font-medium text-sm">{crew.name}</p>
                            <p className="text-xs text-gray-600">{crew.role}</p>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={crewPerformance[crew.name] || ''}
                            onChange={(e) => handleCrewPerformanceChange(crew.name, parseInt(e.target.value) || 0)}
                            placeholder="0-100"
                            className="w-20 text-center"
                          />
                        </div>
                        <Progress value={crewPerformance[crew.name] || 0} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Catatan Supervisi
                </label>
                <Textarea
                  value={supervisionNotes}
                  onChange={(e) => setSupervisionNotes(e.target.value)}
                  placeholder="Jelaskan hasil supervisi, kualitas kerja crew, pencapaian target..."
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
                  placeholder="Jelaskan kendala yang dihadapi, masalah crew, material, atau proses..."
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Rencana Tindak Lanjut
                </label>
                <Textarea
                  value={nextActions}
                  onChange={(e) => setNextActions(e.target.value)}
                  placeholder="Jelaskan langkah selanjutnya, target berikutnya, atau perbaikan yang diperlukan..."
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Foto Dokumentasi (opsional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload foto hasil supervisi</p>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Pilih File
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleSubmitReport}
                className="w-full bg-gray-600 hover:bg-gray-700"
                disabled={!selectedTask || progressPercentage === 0 || !timeSpent}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Kirim Laporan Supervisi
              </Button>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Laporan Supervisi Terbaru</CardTitle>
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
                        <p className="text-xs text-gray-600">Waktu Supervisi</p>
                        <p className="text-sm font-medium">{report.timeSpent} jam</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="bg-blue-50 p-2 rounded text-xs">
                        <p className="font-medium text-blue-800 mb-1">Catatan Supervisi:</p>
                        <p className="text-blue-700">{report.supervisionNotes}</p>
                      </div>
                      
                      <div className="bg-green-50 p-2 rounded text-xs">
                        <p className="font-medium text-green-800 mb-1">Evaluasi Crew:</p>
                        <p className="text-green-700">{report.crewEvaluation}</p>
                      </div>
                      
                      {report.nextActions && (
                        <div className="bg-purple-50 p-2 rounded text-xs">
                          <p className="font-medium text-purple-800 mb-1">Tindak Lanjut:</p>
                          <p className="text-purple-700">{report.nextActions}</p>
                        </div>
                      )}
                    </div>
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