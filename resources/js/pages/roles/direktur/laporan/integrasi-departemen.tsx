import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Calendar,
  FileText,
  Download,
  Eye,
  RefreshCw,
  Target,
  Zap
} from 'lucide-react';

export default function IntegrasiDepartemen() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2025-01');

  const integrationData = {
    overview: {
      totalEmployees: 127,
      productionCrew: 45,
      attendanceRate: 94.2,
      payrollProcessed: 98.5,
      systemIntegration: 99.1
    },
    departments: {
      'Produksi Besi': {
        totalCrew: 25,
        presentToday: 23,
        attendanceRate: 92.0,
        avgSalary: 5200000,
        totalPayroll: 130000000,
        supervisor: 'Ahmad Supervisor',
        workOrders: 8,
        completedOrders: 6
      },
      'Produksi Kayu': {
        totalCrew: 20,
        presentToday: 19,
        attendanceRate: 95.0,
        avgSalary: 4800000,
        totalPayroll: 96000000,
        supervisor: 'Supervisor Kayu A',
        workOrders: 6,
        completedOrders: 5
      }
    },
    integrationFlow: [
      {
        step: 1,
        department: 'Crew Produksi',
        action: 'Check-in/Check-out Absensi',
        status: 'active',
        time: 'Real-time',
        description: 'Crew melakukan absensi harian dengan sistem terintegrasi'
      },
      {
        step: 2,
        department: 'HRD',
        action: 'Monitoring & Validasi Absensi',
        status: 'active',
        time: 'Real-time',
        description: 'HRD memantau kehadiran crew dan memvalidasi data absensi'
      },
      {
        step: 3,
        department: 'Keuangan',
        action: 'Perhitungan Payroll Otomatis',
        status: 'active',
        time: 'End of Month',
        description: 'Sistem menghitung gaji berdasarkan data absensi dari HRD'
      },
      {
        step: 4,
        department: 'Supervisor',
        action: 'Laporan Kinerja Crew',
        status: 'active',
        time: 'Weekly',
        description: 'Supervisor menerima laporan kinerja dan evaluasi crew'
      },
      {
        step: 5,
        department: 'Manajemen',
        action: 'Dashboard & Analytics',
        status: 'active',
        time: 'Real-time',
        description: 'Manajemen mendapat insight real-time dari semua departemen'
      }
    ],
    metrics: {
      dataAccuracy: 98.7,
      processEfficiency: 95.3,
      systemUptime: 99.8,
      userSatisfaction: 92.1
    },
    recentActivities: [
      {
        time: '08:30',
        department: 'Crew Besi',
        activity: '23 crew berhasil check-in',
        status: 'success',
        impact: 'Data real-time ke HRD'
      },
      {
        time: '09:15',
        department: 'HRD',
        activity: 'Validasi absensi crew selesai',
        status: 'success',
        impact: 'Data siap untuk payroll'
      },
      {
        time: '10:00',
        department: 'Keuangan',
        activity: 'Perhitungan lembur otomatis',
        status: 'success',
        impact: 'Payroll accuracy 99.2%'
      },
      {
        time: '10:30',
        department: 'Supervisor',
        activity: 'Laporan kinerja harian generated',
        status: 'success',
        impact: 'Management insight updated'
      }
    ]
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'success': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    {
      title: 'Total Karyawan Produksi',
      value: integrationData.overview.productionCrew.toString(),
      icon: Users,
      color: 'text-blue-600',
      change: '+2 dari bulan lalu'
    },
    {
      title: 'Tingkat Kehadiran',
      value: `${integrationData.overview.attendanceRate}%`,
      icon: CheckCircle,
      color: 'text-green-600',
      change: '+1.2% dari bulan lalu'
    },
    {
      title: 'Payroll Processed',
      value: `${integrationData.overview.payrollProcessed}%`,
      icon: DollarSign,
      color: 'text-purple-600',
      change: 'On track'
    },
    {
      title: 'System Integration',
      value: `${integrationData.overview.systemIntegration}%`,
      icon: Zap,
      color: 'text-orange-600',
      change: 'Excellent'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Integrasi Departemen"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/direktur' },
        { title: 'Laporan Strategis', href: '#' },
        { title: 'Integrasi Departemen', href: '/roles/direktur/laporan/integrasi-departemen' }
      ]}
    >
      <Head title="Integrasi Departemen - Direktur" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Building className="h-8 w-8 text-blue-600" />
              Integrasi Departemen
            </h1>
            <p className="text-gray-600 mt-1">Monitor integrasi sistem antar departemen HRD, Keuangan, dan Produksi</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-01">Januari 2025</SelectItem>
                <SelectItem value="2024-12">Desember 2024</SelectItem>
                <SelectItem value="2024-11">November 2024</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className="p-3 rounded-full bg-gray-100">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Integration Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Alur Integrasi Sistem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrationData.integrationFlow.map((flow, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {flow.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{flow.department}</h3>
                      <Badge className={getStatusColor(flow.status)}>
                        {flow.status === 'active' ? 'Aktif' : 'Selesai'}
                      </Badge>
                      <span className="text-sm text-gray-500">{flow.time}</span>
                    </div>
                    <p className="text-gray-700 font-medium">{flow.action}</p>
                    <p className="text-sm text-gray-600">{flow.description}</p>
                  </div>
                  {index < integrationData.integrationFlow.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performa Departemen Produksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(integrationData.departments).map(([dept, data]) => (
                  <div key={dept} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{dept}</h3>
                        <p className="text-sm text-gray-600">Supervisor: {data.supervisor}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Terintegrasi
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-sm text-blue-700">Crew Hari Ini</p>
                        <p className="text-xl font-bold text-blue-900">{data.presentToday}/{data.totalCrew}</p>
                        <p className="text-xs text-blue-600">{data.attendanceRate}% kehadiran</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <p className="text-sm text-green-700">Work Orders</p>
                        <p className="text-xl font-bold text-green-900">{data.completedOrders}/{data.workOrders}</p>
                        <p className="text-xs text-green-600">Completed</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rata-rata Gaji:</span>
                        <span className="font-semibold">{formatCurrency(data.avgSalary)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Payroll:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(data.totalPayroll)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Real-time Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Aktivitas Real-time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrationData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{activity.time}</span>
                        <Badge variant="outline" size="sm">{activity.department}</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{activity.activity}</p>
                      <p className="text-xs text-gray-500">{activity.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">System Health</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700">Data Accuracy:</p>
                    <p className="font-semibold text-blue-900">{integrationData.metrics.dataAccuracy}%</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Process Efficiency:</p>
                    <p className="font-semibold text-blue-900">{integrationData.metrics.processEfficiency}%</p>
                  </div>
                  <div>
                    <p className="text-blue-700">System Uptime:</p>
                    <p className="font-semibold text-blue-900">{integrationData.metrics.systemUptime}%</p>
                  </div>
                  <div>
                    <p className="text-blue-700">User Satisfaction:</p>
                    <p className="font-semibold text-blue-900">{integrationData.metrics.userSatisfaction}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Manfaat Integrasi Sistem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-green-900 mb-2">Efisiensi Operasional</h3>
                <p className="text-sm text-green-700 mb-3">
                  Otomatisasi proses absensi hingga payroll mengurangi manual work hingga 80%
                </p>
                <div className="space-y-1 text-xs text-green-600">
                  <p>• Real-time data synchronization</p>
                  <p>• Automated payroll calculation</p>
                  <p>• Reduced human error</p>
                </div>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-blue-900 mb-2">Akurasi Data</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Integrasi sistem meningkatkan akurasi data dari 85% menjadi 98.7%
                </p>
                <div className="space-y-1 text-xs text-blue-600">
                  <p>• Single source of truth</p>
                  <p>• Data validation rules</p>
                  <p>• Audit trail complete</p>
                </div>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-purple-900 mb-2">Decision Making</h3>
                <p className="text-sm text-purple-700 mb-3">
                  Real-time dashboard memberikan insight untuk pengambilan keputusan yang lebih cepat
                </p>
                <div className="space-y-1 text-xs text-purple-600">
                  <p>• Real-time analytics</p>
                  <p>• Predictive insights</p>
                  <p>• Performance tracking</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle>Rekomendasi Tindak Lanjut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 border-l-4 border-l-blue-500 bg-blue-50">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">Optimasi Sistem</h4>
                  <p className="text-sm text-blue-700">
                    Implementasi machine learning untuk prediksi absensi dan optimasi scheduling crew
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border-l-4 border-l-green-500 bg-green-50">
                <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900">Ekspansi Integrasi</h4>
                  <p className="text-sm text-green-700">
                    Integrasikan sistem dengan departemen PPIC dan QC untuk end-to-end visibility
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border-l-4 border-l-orange-500 bg-orange-50">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-900">Training & Development</h4>
                  <p className="text-sm text-orange-700">
                    Tingkatkan digital literacy crew untuk memaksimalkan penggunaan sistem terintegrasi
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}