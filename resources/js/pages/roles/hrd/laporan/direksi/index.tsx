import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Download,
  Send,
  Calendar,
  RefreshCw
} from 'lucide-react';

interface ExecutiveSummary {
  period: string;
  totalEmployees: number;
  employeeGrowth: number;
  turnoverRate: number;
  retentionRate: number;
  avgSalary: number;
  totalPayrollCost: number;
  trainingInvestment: number;
  recruitmentCost: number;
  employeeSatisfaction: number;
  productivityIndex: number;
}

interface StrategicInitiative {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'planned';
  progress: number;
  impact: 'high' | 'medium' | 'low';
  budget: number;
  timeline: string;
  kpi: string;
  result?: string;
}

interface KeyRecommendation {
  priority: 'high' | 'medium' | 'low',
  area: string;
  recommendation: string;
  expectedImpact: string;
  timeline: string;
  budget?: number;
}

// Define PageProps to include the data passed from the backend
interface PageProps {
  executiveSummary: ExecutiveSummary;
  strategicInitiatives: StrategicInitiative[];
  keyRecommendations: KeyRecommendation[];
}

export default function LaporanDireksi() {
  const { executiveSummary, strategicInitiatives, keyRecommendations } = usePage<PageProps>().props;

  const [reportType, setReportType] = useState<'quarterly' | 'annual'>(executiveSummary.period.startsWith('Q') ? 'quarterly' : 'annual');

  // Effect to handle reportType change and re-fetch data
  useEffect(() => {
    // Only trigger if the reportType state is different from the current prop's inferred report type
    const currentPropReportType = executiveSummary.period.startsWith('Q') ? 'quarterly' : 'annual';
    if (reportType !== currentPropReportType) {
      router.get(route('hrd.laporan.direksi'), { report_type: reportType }, {
        preserveState: true,
        replace: true,
      });
    }
  }, [reportType]); // Depend on reportType

  const handleReportTypeChange = (newReportType: 'quarterly' | 'annual') => {
    setReportType(newReportType);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AuthenticatedLayout
      title="Laporan ke Direksi"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/hrd' },
        { title: 'Laporan HRD', href: '#' },
        { title: 'Laporan ke Direksi', href: '/roles/hrd/laporan/direksi' }
      ]}
    >
      <Head title="Laporan ke Direksi - Manajer HRD" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Laporan Eksekutif HRD
            </h1>
            <p className="text-gray-600 mt-1">Laporan strategis untuk manajemen dan direksi</p>
          </div>
          <div className="flex gap-3">
            <div className="flex border rounded-lg">
              <button
                onClick={() => handleReportTypeChange('quarterly')}
                className={`px-4 py-2 text-sm font-medium ${
                  reportType === 'quarterly' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Kuartalan
              </button>
              <button
                onClick={() => handleReportTypeChange('annual')}
                className={`px-4 py-2 text-sm font-medium ${
                  reportType === 'annual' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tahunan
              </button>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Unduh PDF
            </Button>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Kirim ke Direksi
            </Button>
          </div>
        </div>

        {/* Ringkasan Eksekutif */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Eksekutif - {executiveSummary.period}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Metrik Ketenagakerjaan</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Karyawan</span>
                    <span className="font-bold">{executiveSummary.totalEmployees}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pertumbuhan Karyawan</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-bold text-green-600">+{executiveSummary.employeeGrowth}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tingkat Retensi</span>
                    <span className="font-bold text-green-600">{executiveSummary.retentionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tingkat Turnover</span>
                    <span className="font-bold">{executiveSummary.turnoverRate}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Dampak Finansial</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Biaya Penggajian</span>
                    <span className="font-bold">{formatCurrency(executiveSummary.totalPayrollCost)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Investasi Pelatihan</span>
                    <span className="font-bold">{formatCurrency(executiveSummary.trainingInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Biaya Rekrutmen</span>
                    <span className="font-bold">{formatCurrency(executiveSummary.recruitmentCost)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rata-rata Gaji</span>
                    <span className="font-bold">{formatCurrency(executiveSummary.avgSalary)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Indikator Kinerja</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Kepuasan Karyawan</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{executiveSummary.employeeSatisfaction}/5</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${(executiveSummary.employeeSatisfaction / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Indeks Produktivitas</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{executiveSummary.productivityIndex}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${executiveSummary.productivityIndex}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inisiatif Strategis HRD */}
        <Card>
          <CardHeader>
            <CardTitle>Inisiatif Strategis HRD</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strategicInitiatives.map((initiative) => (
                <div key={initiative.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{initiative.title}</h3>
                        <Badge className={getStatusColor(initiative.status)}>
                          {initiative.status === 'completed' ? 'Selesai' :
                           initiative.status === 'in_progress' ? 'Berjalan' : 'Direncanakan'}
                        </Badge>
                        <Badge className={getImpactColor(initiative.impact)}>
                          Dampak {initiative.impact === 'high' ? 'Tinggi' : 
                                  initiative.impact === 'medium' ? 'Sedang' : 'Rendah'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <p><span className="font-medium">Anggaran:</span> {formatCurrency(initiative.budget)}</p>
                          <p><span className="font-medium">Linimasa:</span> {initiative.timeline}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Target KPI:</span> {initiative.kpi}</p>
                          {initiative.result && (
                            <p><span className="font-medium">Hasil:</span> {initiative.result}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Progres:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${initiative.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{initiative.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rekomendasi Strategis */}
        <Card>
          <CardHeader>
            <CardTitle>Rekomendasi Strategis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {keyRecommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority === 'high' ? 'TINGGI' : 
                       rec.priority === 'medium' ? 'SEDANG' : 'RENDAH'}
                    </Badge>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{rec.area}</h4>
                      <p className="text-gray-700 mb-3">{rec.recommendation}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600"><span className="font-medium">Dampak yang Diharapkan:</span></p>
                          <p className="text-gray-900">{rec.expectedImpact}</p>.
                        </div>
                        <div>
                          <p className="text-gray-600"><span className="font-medium">Linimasa:</span></p>
                          <p className="text-gray-900">{rec.timeline}</p>
                        </div>
                        {rec.budget && (
                          <div>
                            <p className="text-gray-600"><span className="font-medium">Anggaran:</span></p>
                            <p className="text-gray-900">{formatCurrency(rec.budget)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Poin Tindakan untuk Direksi */}
        <Card>
          <CardHeader>
            <CardTitle>Poin Tindakan untuk Direksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Persetujuan Anggaran Pelatihan</h4>
                  <p className="text-sm text-red-800">Diperlukan persetujuan anggaran Rp 250M untuk program pelatihan Q2 2024</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Target className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Tinjau Strategi Kompensasi</h4>
                  <p className="text-sm text-yellow-800">Evaluasi struktur gaji untuk meningkatkan daya saing di pasar talenta</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Persetujuan Sistem HR Digital</h4>
                  <p className="text-sm text-blue-800">Persetujuan implementasi sistem HR digital untuk efisiensi operasional</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
