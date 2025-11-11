import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { BarChart2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Download, Calendar } from 'lucide-react';

export default function AnalisisKualitas() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [selectedMonth, setSelectedMonth] = useState<string>('2025-01');

  const qualityData = {
    summary: {
      totalInspections: 156,
      passRate: 87.2,
      failRate: 12.8,
      averageScore: 89.5,
      reworkCount: 20,
      trend: 'up' // up, down, stable
    },
    monthlyTrend: [
      { month: '2024-09', passRate: 82.1, avgScore: 85.2, inspections: 142 },
      { month: '2024-10', passRate: 84.5, avgScore: 87.1, inspections: 138 },
      { month: '2024-11', passRate: 86.3, avgScore: 88.3, inspections: 151 },
      { month: '2024-12', passRate: 85.9, avgScore: 88.8, inspections: 149 },
      { month: '2025-01', passRate: 87.2, avgScore: 89.5, inspections: 156 }
    ],
    productAnalysis: [
      {
        product: 'Rangka Besi H-Beam',
        totalInspections: 45,
        passRate: 91.1,
        avgScore: 92.3,
        commonIssues: ['Undercut pada las', 'Dimensi tidak presisi'],
        reworkCount: 4
      },
      {
        product: 'Pagar Besi Ornamen',
        totalInspections: 38,
        passRate: 84.2,
        avgScore: 87.1,
        commonIssues: ['Jarak ornamen tidak konsisten', 'Finishing tidak merata'],
        reworkCount: 6
      },
      {
        product: 'Struktur Baja Ringan',
        totalInspections: 32,
        passRate: 87.5,
        avgScore: 89.8,
        commonIssues: ['Sambungan kurang kuat', 'Cat anti karat tipis'],
        reworkCount: 4
      },
      {
        product: 'Railing Tangga Besi',
        totalInspections: 25,
        passRate: 88.0,
        avgScore: 90.2,
        commonIssues: ['Permukaan tidak halus', 'Ukuran tidak standar'],
        reworkCount: 3
      },
      {
        product: 'Kanopi Besi Hollow',
        totalInspections: 16,
        passRate: 81.3,
        avgScore: 85.6,
        commonIssues: ['Bocor pada sambungan', 'Karat pada finishing'],
        reworkCount: 3
      }
    ],
    defectAnalysis: [
      { category: 'Pengelasan', count: 12, percentage: 35.3, trend: 'down' },
      { category: 'Dimensi', count: 8, percentage: 23.5, trend: 'stable' },
      { category: 'Finishing', count: 7, percentage: 20.6, trend: 'up' },
      { category: 'Assembly', count: 4, percentage: 11.8, trend: 'down' },
      { category: 'Material', count: 3, percentage: 8.8, trend: 'stable' }
    ],
    operatorPerformance: [
      { name: 'Ahmad Santoso', inspections: 28, passRate: 92.9, avgScore: 93.1 },
      { name: 'Budi Prasetyo', inspections: 25, passRate: 88.0, avgScore: 89.2 },
      { name: 'Candra Wijaya', inspections: 22, passRate: 86.4, avgScore: 87.8 },
      { name: 'Dedi Kurniawan', inspections: 20, passRate: 85.0, avgScore: 86.5 },
      { name: 'Eko Susanto', inspections: 18, passRate: 83.3, avgScore: 85.9 }
    ]
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPassRateColor = (rate: number) => {
    if (rate >= 90) return 'bg-green-500';
    if (rate >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const stats = [
    {
      title: 'Total Inspeksi',
      value: qualityData.summary.totalInspections.toString(),
      icon: BarChart2,
      color: 'text-blue-600',
      trend: qualityData.summary.trend
    },
    {
      title: 'Pass Rate',
      value: `${qualityData.summary.passRate}%`,
      icon: CheckCircle,
      color: 'text-green-600',
      trend: qualityData.summary.trend
    },
    {
      title: 'Rata-rata Score',
      value: qualityData.summary.averageScore.toString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      trend: qualityData.summary.trend
    },
    {
      title: 'Total Rework',
      value: qualityData.summary.reworkCount.toString(),
      icon: AlertTriangle,
      color: 'text-orange-600',
      trend: 'down'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Laporan Analisis Kualitas"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-produksi-besi' },
        { title: 'Laporan', href: '#' },
        { title: 'Laporan Analisis Kualitas', href: '/roles/manajer-produksi-besi/laporan/analisis-kualitas' }
      ]}
    >
      <Head title="Laporan Analisis Kualitas - Manajer Produksi Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart2 className="h-8 w-8 text-gray-600" />
              Laporan Analisis Kualitas
            </h1>
            <p className="text-gray-600 mt-1">Analisis komprehensif kualitas produksi besi</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-01">Januari 2025</SelectItem>
                <SelectItem value="2024-12">Desember 2024</SelectItem>
                <SelectItem value="2024-11">November 2024</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-gray-600 hover:bg-gray-700">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
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
                  <div className="flex items-center gap-2">
                    <div className="p-3 rounded-full bg-gray-100">
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    {getTrendIcon(stat.trend)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tren Kualitas Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityData.monthlyTrend.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{new Date(month.month).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                      <p className="text-sm text-gray-600">{month.inspections} inspeksi</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getScoreColor(month.avgScore)}`}>
                        {month.passRate}% Pass Rate
                      </p>
                      <p className="text-sm text-gray-600">Score: {month.avgScore}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Defect Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Analisis Kategori Defect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityData.defectAnalysis.map((defect, index) => (
                  <div key={defect.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{defect.category}</span>
                        {getTrendIcon(defect.trend)}
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{defect.count}</span>
                        <span className="text-sm text-gray-600 ml-2">({defect.percentage}%)</span>
                      </div>
                    </div>
                    <Progress value={defect.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Analisis Kualitas per Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Produk</th>
                    <th className="text-center p-3">Inspeksi</th>
                    <th className="text-center p-3">Pass Rate</th>
                    <th className="text-center p-3">Avg Score</th>
                    <th className="text-center p-3">Rework</th>
                    <th className="text-left p-3">Issue Umum</th>
                  </tr>
                </thead>
                <tbody>
                  {qualityData.productAnalysis.map((product, index) => (
                    <tr key={product.product} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{product.product}</td>
                      <td className="p-3 text-center">{product.totalInspections}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getPassRateColor(product.passRate)}`}></div>
                          <span className={getScoreColor(product.passRate)}>{product.passRate}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={getScoreColor(product.avgScore)}>{product.avgScore}</span>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="outline" className="text-orange-600">
                          {product.reworkCount}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          {product.commonIssues.slice(0, 2).map((issue, idx) => (
                            <div key={idx} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                              {issue}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Operator Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Kinerja Kualitas per Operator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {qualityData.operatorPerformance.map((operator, index) => (
                <div key={operator.name} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{operator.name}</h4>
                      <p className="text-sm text-gray-600">{operator.inspections} inspeksi</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${getScoreColor(operator.avgScore)}`}>
                        Score: {operator.avgScore}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Pass Rate</span>
                        <span className="font-medium">{operator.passRate}%</span>
                      </div>
                      <Progress value={operator.passRate} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle>Rekomendasi Perbaikan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Fokus pada Pengelasan</p>
                  <p className="text-sm text-yellow-700">35.3% defect berasal dari masalah pengelasan. Perlu training tambahan untuk operator.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Tingkatkan Kontrol Dimensi</p>
                  <p className="text-sm text-blue-700">23.5% defect dari masalah dimensi. Perlu kalibrasi alat ukur dan SOP yang lebih ketat.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-50 border-l-4 border-green-400 rounded">
                <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Pertahankan Kinerja Ahmad Santoso</p>
                  <p className="text-sm text-green-700">Pass rate 92.9% dengan score 93.1. Jadikan benchmark untuk operator lain.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}