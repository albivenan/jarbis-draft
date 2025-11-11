import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Users, Download, TrendingUp, Clock, CheckCircle, AlertTriangle, Award, Target } from 'lucide-react';

export default function KinerjaCrew() {
  const [filterPeriod, setFilterPeriod] = useState<string>('month');
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const crewPerformance = [
    {
      id: 'CREW-001',
      name: 'Ahmad Santoso',
      position: 'Senior Welder',
      team: 'Team A',
      supervisor: 'Supervisor Besi A',
      period: 'Januari 2025',
      metrics: {
        tasksCompleted: 28,
        tasksAssigned: 30,
        completionRate: 93,
        qualityScore: 88,
        efficiency: 92,
        attendance: 95,
        safetyScore: 100,
        overtimeHours: 12
      },
      achievements: [
        'Zero defect dalam 2 minggu terakhir',
        'Menyelesaikan tugas kompleks lebih cepat dari target'
      ],
      improvements: [
        'Perlu peningkatan kecepatan pada pengelasan TIG'
      ],
      rating: 'excellent',
      trend: 'up'
    },
    {
      id: 'CREW-002',
      name: 'Budi Prasetyo',
      position: 'Cutting Specialist',
      team: 'Team A',
      supervisor: 'Supervisor Besi A',
      period: 'Januari 2025',
      metrics: {
        tasksCompleted: 25,
        tasksAssigned: 28,
        completionRate: 89,
        qualityScore: 92,
        efficiency: 87,
        attendance: 100,
        safetyScore: 95,
        overtimeHours: 8
      },
      achievements: [
        'Akurasi pemotongan 99.5%',
        'Tidak ada kecelakaan kerja'
      ],
      improvements: [
        'Perlu peningkatan kecepatan setup mesin'
      ],
      rating: 'good',
      trend: 'stable'
    },
    {
      id: 'CREW-003',
      name: 'Candra Wijaya',
      position: 'Junior Welder',
      team: 'Team B',
      supervisor: 'Supervisor Besi B',
      period: 'Januari 2025',
      metrics: {
        tasksCompleted: 20,
        tasksAssigned: 25,
        completionRate: 80,
        qualityScore: 75,
        efficiency: 78,
        attendance: 90,
        safetyScore: 90,
        overtimeHours: 15
      },
      achievements: [
        'Menguasai teknik pengelasan SMAW dengan baik'
      ],
      improvements: [
        'Perlu pelatihan pengelasan TIG',
        'Peningkatan konsistensi kualitas'
      ],
      rating: 'satisfactory',
      trend: 'up'
    },
    {
      id: 'CREW-004',
      name: 'Dedi Kurniawan',
      position: 'Assembly Specialist',
      team: 'Team B',
      supervisor: 'Supervisor Besi B',
      period: 'Januari 2025',
      metrics: {
        tasksCompleted: 32,
        tasksAssigned: 32,
        completionRate: 100,
        qualityScore: 95,
        efficiency: 98,
        attendance: 100,
        safetyScore: 100,
        overtimeHours: 5
      },
      achievements: [
        'Perfect completion rate',
        'Kualitas assembly terbaik di divisi',
        'Mentor untuk junior staff'
      ],
      improvements: [],
      rating: 'outstanding',
      trend: 'up'
    },
    {
      id: 'CREW-005',
      name: 'Eko Susanto',
      position: 'Junior Welder',
      team: 'Team A',
      supervisor: 'Supervisor Besi A',
      period: 'Januari 2025',
      metrics: {
        tasksCompleted: 18,
        tasksAssigned: 24,
        completionRate: 75,
        qualityScore: 70,
        efficiency: 72,
        attendance: 85,
        safetyScore: 85,
        overtimeHours: 20
      },
      achievements: [
        'Menunjukkan progress yang konsisten'
      ],
      improvements: [
        'Perlu pelatihan intensif pengelasan',
        'Peningkatan disiplin kehadiran',
        'Fokus pada safety procedures'
      ],
      rating: 'needs_improvement',
      trend: 'down'
    }
  ];

  const teamSummary = {
    'Team A': {
      members: crewPerformance.filter(crew => crew.team === 'Team A').length,
      avgCompletionRate: Math.round(crewPerformance.filter(crew => crew.team === 'Team A').reduce((sum, crew) => sum + crew.metrics.completionRate, 0) / crewPerformance.filter(crew => crew.team === 'Team A').length),
      avgQualityScore: Math.round(crewPerformance.filter(crew => crew.team === 'Team A').reduce((sum, crew) => sum + crew.metrics.qualityScore, 0) / crewPerformance.filter(crew => crew.team === 'Team A').length),
      avgEfficiency: Math.round(crewPerformance.filter(crew => crew.team === 'Team A').reduce((sum, crew) => sum + crew.metrics.efficiency, 0) / crewPerformance.filter(crew => crew.team === 'Team A').length)
    },
    'Team B': {
      members: crewPerformance.filter(crew => crew.team === 'Team B').length,
      avgCompletionRate: Math.round(crewPerformance.filter(crew => crew.team === 'Team B').reduce((sum, crew) => sum + crew.metrics.completionRate, 0) / crewPerformance.filter(crew => crew.team === 'Team B').length),
      avgQualityScore: Math.round(crewPerformance.filter(crew => crew.team === 'Team B').reduce((sum, crew) => sum + crew.metrics.qualityScore, 0) / crewPerformance.filter(crew => crew.team === 'Team B').length),
      avgEfficiency: Math.round(crewPerformance.filter(crew => crew.team === 'Team B').reduce((sum, crew) => sum + crew.metrics.efficiency, 0) / crewPerformance.filter(crew => crew.team === 'Team B').length)
    }
  };

  const filteredCrew = crewPerformance.filter(crew => {
    const matchesSearch = crew.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crew.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = filterTeam === 'all' || crew.team === filterTeam;
    
    return matchesSearch && matchesTeam;
  });

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'outstanding': return 'bg-green-100 text-green-800';
      case 'excellent': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'satisfactory': return 'bg-orange-100 text-orange-800';
      case 'needs_improvement': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingText = (rating: string) => {
    switch (rating) {
      case 'outstanding': return 'Luar Biasa';
      case 'excellent': return 'Sangat Baik';
      case 'good': return 'Baik';
      case 'satisfactory': return 'Memuaskan';
      case 'needs_improvement': return 'Perlu Perbaikan';
      default: return rating;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const overallStats = {
    totalCrew: crewPerformance.length,
    avgCompletionRate: Math.round(crewPerformance.reduce((sum, crew) => sum + crew.metrics.completionRate, 0) / crewPerformance.length),
    avgQualityScore: Math.round(crewPerformance.reduce((sum, crew) => sum + crew.metrics.qualityScore, 0) / crewPerformance.length),
    avgEfficiency: Math.round(crewPerformance.reduce((sum, crew) => sum + crew.metrics.efficiency, 0) / crewPerformance.length),
    topPerformers: crewPerformance.filter(crew => crew.rating === 'outstanding' || crew.rating === 'excellent').length
  };

  const stats = [
    {
      title: 'Total Crew',
      value: overallStats.totalCrew.toString(),
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Completion Rate',
      value: `${overallStats.avgCompletionRate}%`,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Quality Score',
      value: `${overallStats.avgQualityScore}%`,
      icon: Award,
      color: 'text-purple-600'
    },
    {
      title: 'Top Performers',
      value: overallStats.topPerformers.toString(),
      icon: Target,
      color: 'text-orange-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Laporan Kinerja Crew"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-produksi-besi' },
        { title: 'Laporan', href: '#' },
        { title: 'Laporan Kinerja Crew', href: '/roles/manajer-produksi-besi/laporan/kinerja-crew' }
      ]}
    >
      <Head title="Laporan Kinerja Crew - Manajer Produksi Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-8 w-8 text-gray-600" />
              Laporan Kinerja Crew
            </h1>
            <p className="text-gray-600 mt-1">Evaluasi kinerja dan produktivitas crew produksi besi</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <Input
                  placeholder="Cari berdasarkan nama atau posisi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Minggu Ini</SelectItem>
                  <SelectItem value="month">Bulan Ini</SelectItem>
                  <SelectItem value="quarter">Kuartal Ini</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTeam} onValueChange={setFilterTeam}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tim" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tim</SelectItem>
                  <SelectItem value="Team A">Team A</SelectItem>
                  <SelectItem value="Team B">Team B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

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

        {/* Team Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(teamSummary).map(([teamName, summary]) => (
            <Card key={teamName}>
              <CardHeader>
                <CardTitle>{teamName} Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Anggota Tim</span>
                    <span className="font-medium">{summary.members} orang</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className={`font-medium ${getScoreColor(summary.avgCompletionRate)}`}>
                      {summary.avgCompletionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quality Score</span>
                    <span className={`font-medium ${getScoreColor(summary.avgQualityScore)}`}>
                      {summary.avgQualityScore}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Efficiency</span>
                    <span className={`font-medium ${getScoreColor(summary.avgEfficiency)}`}>
                      {summary.avgEfficiency}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Individual Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Kinerja Individual Crew</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredCrew.map((crew) => (
                <div key={crew.id} className="p-6 border rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-medium">{crew.name}</h4>
                      <p className="text-gray-600">{crew.position} • {crew.team}</p>
                      <p className="text-sm text-gray-500">Supervisor: {crew.supervisor}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRatingColor(crew.rating)}>
                        {getRatingText(crew.rating)}
                      </Badge>
                      {getTrendIcon(crew.trend)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Task Completion</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={crew.metrics.completionRate} className="flex-1" />
                        <span className={`text-sm font-medium ${getScoreColor(crew.metrics.completionRate)}`}>
                          {crew.metrics.completionRate}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {crew.metrics.tasksCompleted}/{crew.metrics.tasksAssigned} tugas
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Quality Score</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={crew.metrics.qualityScore} className="flex-1" />
                        <span className={`text-sm font-medium ${getScoreColor(crew.metrics.qualityScore)}`}>
                          {crew.metrics.qualityScore}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Efficiency</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={crew.metrics.efficiency} className="flex-1" />
                        <span className={`text-sm font-medium ${getScoreColor(crew.metrics.efficiency)}`}>
                          {crew.metrics.efficiency}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Attendance</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={crew.metrics.attendance} className="flex-1" />
                        <span className={`text-sm font-medium ${getScoreColor(crew.metrics.attendance)}`}>
                          {crew.metrics.attendance}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Safety Score</p>
                      <p className={`text-lg font-bold ${getScoreColor(crew.metrics.safetyScore)}`}>
                        {crew.metrics.safetyScore}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Overtime Hours</p>
                      <p className="text-lg font-bold text-gray-900">
                        {crew.metrics.overtimeHours}h
                      </p>
                    </div>
                  </div>

                  {crew.achievements.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Pencapaian:</p>
                      <div className="space-y-1">
                        {crew.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                            <CheckCircle className="w-4 h-4" />
                            {achievement}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {crew.improvements.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Area Perbaikan:</p>
                      <div className="space-y-1">
                        {crew.improvements.map((improvement, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-orange-700 bg-orange-50 p-2 rounded">
                            <AlertTriangle className="w-4 h-4" />
                            {improvement}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}