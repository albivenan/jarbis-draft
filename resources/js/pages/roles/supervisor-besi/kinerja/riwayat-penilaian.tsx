import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Calendar, User, TrendingUp, TrendingDown, Minus, Search, Filter, Download, Eye } from 'lucide-react';

export default function RiwayatPenilaian() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [selectedCrew, setSelectedCrew] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');

  const periods = [
    { value: '2025-01', label: 'Januari 2025' },
    { value: '2024-12', label: 'Desember 2024' },
    { value: '2024-11', label: 'November 2024' },
    { value: '2024-10', label: 'Oktober 2024' },
    { value: '2024-09', label: 'September 2024' },
    { value: '2024-08', label: 'Agustus 2024' }
  ];

  const crewMembers = [
    { value: 'ahmad_santoso', label: 'Ahmad Santoso' },
    { value: 'budi_prasetyo', label: 'Budi Prasetyo' },
    { value: 'candra_wijaya', label: 'Candra Wijaya' },
    { value: 'dedi_kurniawan', label: 'Dedi Kurniawan' },
    { value: 'eko_susanto', label: 'Eko Susanto' }
  ];

  const ratingFilters = [
    { value: 'excellent', label: 'Sangat Baik (4.5-5.0)' },
    { value: 'good', label: 'Baik (3.5-4.4)' },
    { value: 'average', label: 'Cukup (2.5-3.4)' },
    { value: 'poor', label: 'Kurang (1.5-2.4)' },
    { value: 'very_poor', label: 'Sangat Kurang (1.0-1.4)' }
  ];

  const evaluationHistory = [
    {
      id: 'EVAL-2025-001',
      crewName: 'Ahmad Santoso',
      position: 'Lead Welder',
      period: '2025-01',
      periodLabel: 'Januari 2025',
      evaluationDate: '2025-01-31',
      evaluatedBy: 'Supervisor Besi A',
      overallScore: 4.6,
      categories: {
        technical: 4.8,
        quality: 4.5,
        productivity: 4.4,
        teamwork: 4.7,
        discipline: 4.6
      },
      strengths: ['Keahlian pengelasan sangat baik', 'Leadership yang kuat', 'Konsisten dalam kualitas'],
      improvements: ['Perlu meningkatkan dokumentasi kerja'],
      goals: ['Mentoring crew junior', 'Sertifikasi welding advanced'],
      status: 'completed',
      trend: 'up'
    },
    {
      id: 'EVAL-2024-012',
      crewName: 'Ahmad Santoso',
      position: 'Lead Welder',
      period: '2024-12',
      periodLabel: 'Desember 2024',
      evaluationDate: '2024-12-31',
      evaluatedBy: 'Supervisor Besi A',
      overallScore: 4.4,
      categories: {
        technical: 4.6,
        quality: 4.3,
        productivity: 4.2,
        teamwork: 4.5,
        discipline: 4.4
      },
      strengths: ['Teknik pengelasan konsisten', 'Mampu handle proyek kompleks'],
      improvements: ['Komunikasi dengan tim bisa ditingkatkan', 'Manajemen waktu'],
      goals: ['Pelatihan leadership', 'Optimasi workflow'],
      status: 'completed',
      trend: 'up'
    },
    {
      id: 'EVAL-2025-002',
      crewName: 'Budi Prasetyo',
      position: 'Cutting Specialist',
      period: '2025-01',
      periodLabel: 'Januari 2025',
      evaluationDate: '2025-01-31',
      evaluatedBy: 'Supervisor Besi A',
      overallScore: 4.2,
      categories: {
        technical: 4.4,
        quality: 4.1,
        productivity: 4.0,
        teamwork: 4.2,
        discipline: 4.3
      },
      strengths: ['Presisi cutting sangat baik', 'Efisien dalam penggunaan material'],
      improvements: ['Kecepatan kerja bisa ditingkatkan', 'Koordinasi dengan welder'],
      goals: ['Training plasma cutting', 'Sertifikasi operator'],
      status: 'completed',
      trend: 'up'
    },
    {
      id: 'EVAL-2024-011',
      crewName: 'Budi Prasetyo',
      position: 'Cutting Specialist',
      period: '2024-12',
      periodLabel: 'Desember 2024',
      evaluationDate: '2024-12-31',
      evaluatedBy: 'Supervisor Besi A',
      overallScore: 3.9,
      categories: {
        technical: 4.1,
        quality: 3.8,
        productivity: 3.7,
        teamwork: 4.0,
        discipline: 4.0
      },
      strengths: ['Teknik cutting yang baik', 'Rajin dan disiplin'],
      improvements: ['Perlu peningkatan kecepatan', 'Quality control lebih ketat'],
      goals: ['Pelatihan advanced cutting', 'Improvement productivity'],
      status: 'completed',
      trend: 'up'
    },
    {
      id: 'EVAL-2025-003',
      crewName: 'Eko Susanto',
      position: 'Junior Welder',
      period: '2025-01',
      periodLabel: 'Januari 2025',
      evaluationDate: '2025-01-31',
      evaluatedBy: 'Supervisor Besi A',
      overallScore: 3.4,
      categories: {
        technical: 3.2,
        quality: 3.4,
        productivity: 3.6,
        teamwork: 3.8,
        discipline: 3.5
      },
      strengths: ['Semangat belajar tinggi', 'Kooperatif dengan senior'],
      improvements: ['Teknik pengelasan perlu diperbaiki', 'Konsistensi kualitas'],
      goals: ['Intensive welding training', 'Mentoring dengan Ahmad'],
      status: 'completed',
      trend: 'stable'
    },
    {
      id: 'EVAL-2024-010',
      crewName: 'Eko Susanto',
      position: 'Junior Welder',
      period: '2024-12',
      periodLabel: 'Desember 2024',
      evaluationDate: '2024-12-31',
      evaluatedBy: 'Supervisor Besi A',
      overallScore: 3.6,
      categories: {
        technical: 3.4,
        quality: 3.6,
        productivity: 3.8,
        teamwork: 3.7,
        discipline: 3.5
      },
      strengths: ['Progress yang konsisten', 'Attitude yang baik'],
      improvements: ['Skill welding masih perlu latihan', 'Speed masih lambat'],
      goals: ['Basic welding certification', 'Skill improvement program'],
      status: 'completed',
      trend: 'down'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600 bg-green-100';
    if (score >= 3.5) return 'text-blue-600 bg-blue-100';
    if (score >= 2.5) return 'text-yellow-600 bg-yellow-100';
    if (score >= 1.5) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return 'Sangat Baik';
    if (score >= 3.5) return 'Baik';
    if (score >= 2.5) return 'Cukup';
    if (score >= 1.5) return 'Kurang';
    return 'Sangat Kurang';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredHistory = evaluationHistory.filter(evaluation => {
    const matchesSearch = evaluation.crewName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluation.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = !selectedPeriod || evaluation.period === selectedPeriod;
    const matchesCrew = !selectedCrew || evaluation.crewName.toLowerCase().includes(selectedCrew.toLowerCase());
    const matchesRating = !selectedRating || 
      (selectedRating === 'excellent' && evaluation.overallScore >= 4.5) ||
      (selectedRating === 'good' && evaluation.overallScore >= 3.5 && evaluation.overallScore < 4.5) ||
      (selectedRating === 'average' && evaluation.overallScore >= 2.5 && evaluation.overallScore < 3.5) ||
      (selectedRating === 'poor' && evaluation.overallScore >= 1.5 && evaluation.overallScore < 2.5) ||
      (selectedRating === 'very_poor' && evaluation.overallScore < 1.5);

    return matchesSearch && matchesPeriod && matchesCrew && matchesRating;
  });

  const stats = [
    {
      title: 'Total Evaluasi',
      value: evaluationHistory.length.toString(),
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Rata-rata Skor',
      value: (evaluationHistory.reduce((sum, evaluation) => sum + evaluation.overallScore, 0) / evaluationHistory.length).toFixed(1),
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Crew Aktif',
      value: new Set(evaluationHistory.map(evaluation => evaluation.crewName)).size.toString(),
      icon: User,
      color: 'text-purple-600'
    },
    {
      title: 'Periode Terakhir',
      value: 'Jan 2025',
      icon: Calendar,
      color: 'text-orange-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Riwayat Penilaian Crew"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/supervisor-besi' },
        { title: 'Kinerja (KPI)', href: '#' },
        { title: 'Riwayat Penilaian', href: '/roles/supervisor-besi/kinerja/riwayat-penilaian' }
      ]}
    >
      <Head title="Riwayat Penilaian Crew - Supervisor Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Riwayat Penilaian Crew
            </h1>
            <p className="text-gray-600 mt-1">Riwayat dan tren penilaian kinerja crew fabrikasi besi</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Laporan
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
                    placeholder="Cari nama crew atau ID evaluasi..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Periode
                </label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua periode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua periode</SelectItem>
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Crew
                </label>
                <Select value={selectedCrew} onValueChange={setSelectedCrew}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua crew" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua crew</SelectItem>
                    {crewMembers.map((crew) => (
                      <SelectItem key={crew.value} value={crew.value}>
                        {crew.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Rating
                </label>
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua rating</SelectItem>
                    {ratingFilters.map((rating) => (
                      <SelectItem key={rating.value} value={rating.value}>
                        {rating.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation History */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Evaluasi ({filteredHistory.length} data)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredHistory.map((evaluation) => (
                <div key={evaluation.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{evaluation.crewName}</h3>
                        <Badge variant="outline">{evaluation.position}</Badge>
                        <Badge className={getScoreColor(evaluation.overallScore)}>
                          {evaluation.overallScore.toFixed(1)} - {getScoreLabel(evaluation.overallScore)}
                        </Badge>
                        {getTrendIcon(evaluation.trend)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>ID: {evaluation.id}</span>
                        <span>•</span>
                        <span>Periode: {evaluation.periodLabel}</span>
                        <span>•</span>
                        <span>Tanggal: {evaluation.evaluationDate}</span>
                        <span>•</span>
                        <span>Penilai: {evaluation.evaluatedBy}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Detail
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600 mb-1">Teknis</p>
                      <p className="text-lg font-semibold text-gray-900">{evaluation.categories.technical}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600 mb-1">Kualitas</p>
                      <p className="text-lg font-semibold text-gray-900">{evaluation.categories.quality}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600 mb-1">Produktivitas</p>
                      <p className="text-lg font-semibold text-gray-900">{evaluation.categories.productivity}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600 mb-1">Kerjasama</p>
                      <p className="text-lg font-semibold text-gray-900">{evaluation.categories.teamwork}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600 mb-1">Disiplin</p>
                      <p className="text-lg font-semibold text-gray-900">{evaluation.categories.discipline}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-green-800 mb-2">Kelebihan:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        {evaluation.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800 mb-2">Area Perbaikan:</h4>
                      <ul className="text-sm text-orange-700 space-y-1">
                        {evaluation.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-orange-600 mt-1">•</span>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Target Periode Depan:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {evaluation.goals.map((goal, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}

              {filteredHistory.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Tidak ada data evaluasi yang sesuai dengan filter</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}