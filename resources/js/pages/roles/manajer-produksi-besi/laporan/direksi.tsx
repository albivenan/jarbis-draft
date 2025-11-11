import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { FileText, Download, TrendingUp, TrendingDown, Package, Users, CheckCircle, AlertTriangle, BarChart3, Calendar } from 'lucide-react';

export default function LaporanDireksi() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [selectedYear, setSelectedYear] = useState<string>('2025');

  const executiveSummary = {
    period: 'Januari 2025',
    totalWorkOrders: 15,
    completedWorkOrders: 12,
    completionRate: 80,
    totalProduction: 156,
    targetProduction: 180,
    achievementRate: 87,
    qualityPassRate: 92,
    onTimeDelivery: 85,
    crewUtilization: 88,
    safetyIncidents: 1,
    costEfficiency: 94,
    customerSatisfaction: 91
  };

  const productionTrends = [
    { month: 'Sep 2024', production: 145, target: 160, achievement: 91 },
    { month: 'Okt 2024', production: 152, target: 165, achievement: 92 },
    { month: 'Nov 2024', production: 148, target: 170, achievement: 87 },
    { month: 'Des 2024', production: 162, target: 175, achievement: 93 },
    { month: 'Jan 2025', production: 156, target: 180, achievement: 87 }
  ];

  const keyMetrics = [
    {
      category: 'Produktivitas',
      metrics: [
        { name: 'Total Work Order', value: '15', unit: 'WO', trend: 'up', change: '+12%' },
        { name: 'Work Order Selesai', value: '12', unit: 'WO', trend: 'up', change: '+8%' },
        { name: 'Tingkat Penyelesaian', value: '80', unit: '%', trend: 'down', change: '-5%' },
        { name: 'Output Produksi', value: '156', unit: 'unit', trend: 'down', change: '-3%' }
      ]
    },
    {
      category: 'Kualitas',
      metrics: [
        { name: 'Pass Rate QC', value: '92', unit: '%', trend: 'up', change: '+2%' },
        { name: 'Rework Rate', value: '8', unit: '%', trend: 'down', change: '-2%' },
        { name: 'Customer Complaint', value: '2', unit: 'kasus', trend: 'stable', change: '0%' },
        { name: 'On-Time Delivery', value: '85', unit: '%', trend: 'down', change: '-3%' }
      ]
    },
    {
      category: 'Sumber Daya',
      metrics: [
        { name: 'Crew Utilization', value: '88', unit: '%', trend: 'up', change: '+5%' },
        { name: 'Equipment Uptime', value: '94', unit: '%', trend: 'up', change: '+1%' },
        { name: 'Material Efficiency', value: '96', unit: '%', trend: 'stable', change: '0%' },
        { name: 'Overtime Hours', value: '120', unit: 'jam', trend: 'up', change: '+15%' }
      ]
    },
    {
      category: 'Keselamatan & Biaya',
      metrics: [
        { name: 'Safety Incidents', value: '1', unit: 'kejadian', trend: 'up', change: '+1' },
        { name: 'Cost per Unit', value: '2.8', unit: 'juta', trend: 'down', change: '-5%' },
        { name: 'Budget Utilization', value: '94', unit: '%', trend: 'stable', change: '0%' },
        { name: 'ROI', value: '18', unit: '%', trend: 'up', change: '+2%' }
      ]
    }
  ];

  const challenges = [
    {
      issue: 'Keterlambatan Delivery Material',
      impact: 'High',
      description: 'Supplier utama mengalami keterlambatan pengiriman bahan baku H-beam',
      action: 'Mencari supplier alternatif dan meningkatkan safety stock',
      timeline: '2 minggu',
      status: 'in_progress'
    },
    {
      issue: 'Kekurangan Tenaga Ahli Pengelasan TIG',
      impact: 'Medium',
      description: 'Hanya 2 dari 8 welder yang menguasai teknik TIG dengan baik',
      action: 'Program pelatihan intensif TIG welding untuk 4 operator',
      timeline: '1 bulan',
      status: 'planned'
    },
    {
      issue: 'Peningkatan Reject Rate pada Produk Ornamen',
      impact: 'Medium',
      description: 'Reject rate naik dari 5% menjadi 8% dalam 2 minggu terakhir',
      action: 'Review SOP finishing dan pelatihan ulang operator',
      timeline: '2 minggu',
      status: 'in_progress'
    }
  ];

  const opportunities = [
    {
      title: 'Implementasi Lean Manufacturing',
      description: 'Penerapan 5S dan waste reduction dapat meningkatkan efisiensi 15%',
      potential_benefit: 'Peningkatan produktivitas 15%, pengurangan waste 20%',
      investment_required: 'Rp 50 juta',
      timeline: '3 bulan'
    },
    {
      title: 'Upgrade Equipment Cutting',
      description: 'Penggantian mesin cutting lama dengan CNC plasma cutting',
      potential_benefit: 'Akurasi +25%, kecepatan +40%, pengurangan waste material 30%',
      investment_required: 'Rp 200 juta',
      timeline: '2 bulan'
    },
    {
      title: 'Sertifikasi ISO 9001:2015',
      description: 'Implementasi sistem manajemen kualitas internasional',
      potential_benefit: 'Peningkatan kredibilitas, akses pasar ekspor, quality improvement',
      investment_required: 'Rp 75 juta',
      timeline: '6 bulan'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'in_progress': return 'Dalam Progres';
      case 'planned': return 'Direncanakan';
      default: return status;
    }
  };

  const stats = [
    {
      title: 'Achievement Rate',
      value: `${executiveSummary.achievementRate}%`,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Quality Pass Rate',
      value: `${executiveSummary.qualityPassRate}%`,
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Crew Utilization',
      value: `${executiveSummary.crewUtilization}%`,
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Safety Incidents',
      value: executiveSummary.safetyIncidents.toString(),
      icon: AlertTriangle,
      color: 'text-orange-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Laporan ke Direksi"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-produksi-besi' },
        { title: 'Laporan', href: '#' },
        { title: 'Laporan ke Direksi', href: '/roles/manajer-produksi-besi/laporan/direksi' }
      ]}
    >
      <Head title="Laporan ke Direksi - Manajer Produksi Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-gray-600" />
              Laporan Eksekutif ke Direksi
            </h1>
            <p className="text-gray-600 mt-1">Laporan komprehensif kinerja divisi produksi besi</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button className="bg-gray-600 hover:bg-gray-700">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Period Selection */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Periode Laporan
                </label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Periode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Bulanan</SelectItem>
                    <SelectItem value="quarter">Kuartalan</SelectItem>
                    <SelectItem value="year">Tahunan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Tahun
                </label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Ringkasan Eksekutif - {executiveSummary.period}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="p-3 rounded-full bg-gray-100 w-fit mx-auto mb-2">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Pencapaian Produksi</p>
                <div className="flex items-center gap-2 mb-1">
                  <Progress value={executiveSummary.achievementRate} className="flex-1" />
                  <span className="text-sm font-medium">{executiveSummary.achievementRate}%</span>
                </div>
                <p className="text-xs text-gray-500">
                  {executiveSummary.totalProduction} / {executiveSummary.targetProduction} unit
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Tingkat Penyelesaian WO</p>
                <div className="flex items-center gap-2 mb-1">
                  <Progress value={executiveSummary.completionRate} className="flex-1" />
                  <span className="text-sm font-medium">{executiveSummary.completionRate}%</span>
                </div>
                <p className="text-xs text-gray-500">
                  {executiveSummary.completedWorkOrders} / {executiveSummary.totalWorkOrders} WO
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">On-Time Delivery</p>
                <div className="flex items-center gap-2 mb-1">
                  <Progress value={executiveSummary.onTimeDelivery} className="flex-1" />
                  <span className="text-sm font-medium">{executiveSummary.onTimeDelivery}%</span>
                </div>
                <p className="text-xs text-gray-500">Ketepatan waktu pengiriman</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {keyMetrics.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h4 className="font-medium text-gray-900 mb-3">{category.category}</h4>
                  <div className="space-y-3">
                    {category.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{metric.name}</p>
                          <p className="text-lg font-bold text-gray-900">
                            {metric.value} {metric.unit}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(metric.trend)}
                          <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                            {metric.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Production Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Tren Produksi 5 Bulan Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productionTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="font-medium">{trend.month}</p>
                      <p className="text-sm text-gray-600">{trend.achievement}%</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Produksi: {trend.production} unit</span>
                        <span>Target: {trend.target} unit</span>
                      </div>
                      <Progress value={trend.achievement} className="w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Challenges & Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Tantangan & Rencana Tindakan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {challenges.map((challenge, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">{challenge.issue}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getImpactColor(challenge.impact)}>
                        {challenge.impact} Impact
                      </Badge>
                      <Badge className={getStatusColor(challenge.status)}>
                        {getStatusText(challenge.status)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                  <div className="bg-blue-50 p-3 rounded mb-2">
                    <p className="text-sm font-medium text-blue-800">Rencana Tindakan:</p>
                    <p className="text-sm text-blue-700">{challenge.action}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Timeline: {challenge.timeline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Peluang Peningkatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {opportunities.map((opportunity, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{opportunity.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-medium text-green-800">Manfaat Potensial:</p>
                      <p className="text-green-700">{opportunity.potential_benefit}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded">
                      <p className="font-medium text-orange-800">Investasi Diperlukan:</p>
                      <p className="text-orange-700">{opportunity.investment_required}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="font-medium text-blue-800">Timeline:</p>
                      <p className="text-blue-700">{opportunity.timeline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}