import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  BarChart2,
  TrendingUp,
  FileText,
  Target
} from 'lucide-react';

interface DashboardProps {
  roleInfo?: {
    name: string;
    description: string;
  };
}

export default function Dashboard({ roleInfo }: DashboardProps) {
  const stats = [
    {
      title: 'Inspeksi Hari Ini',
      value: '18',
      unit: 'item',
      icon: Search,
      trend: '16 passed, 2 rework',
      color: 'text-blue-600'
    },
    {
      title: 'Antrean Inspeksi',
      value: '7',
      unit: 'item',
      icon: ClipboardList,
      trend: 'Menunggu QC',
      color: 'text-orange-600'
    },
    {
      title: 'Pass Rate',
      value: '89',
      unit: '%',
      icon: CheckCircle,
      trend: 'Target 85%',
      color: 'text-green-600'
    },
    {
      title: 'Reject Rate',
      value: '11',
      unit: '%',
      icon: AlertTriangle,
      trend: 'Perlu perbaikan',
      color: 'text-red-600'
    }
  ];

  const inspectionQueue = [
    {
      id: 'INS-BS-001',
      product: 'Rangka Besi 10x12m',
      workOrder: 'WO-BS-001',
      quantity: 5,
      supervisor: 'Ahmad Supervisor',
      priority: 'high',
      submittedAt: '14:30',
      estimatedTime: '45 menit'
    },
    {
      id: 'INS-BS-002',
      product: 'Pagar Besi Minimalis',
      workOrder: 'WO-BS-002',
      quantity: 8,
      supervisor: 'Budi Supervisor',
      priority: 'medium',
      submittedAt: '15:15',
      estimatedTime: '60 menit'
    }
  ];

  const recentInspections = [
    {
      id: 'QC-RPT-001',
      product: 'Rangka Besi Batch 1',
      result: 'passed',
      score: 95,
      issues: [],
      inspector: 'Saya',
      completedAt: '13:45',
      notes: 'Kualitas welding excellent, dimensi sesuai spesifikasi'
    },
    {
      id: 'QC-RPT-002',
      product: 'Pagar Minimalis Batch 2',
      result: 'rework',
      score: 78,
      issues: ['Finishing cat tidak rata', 'Welding pada joint perlu perbaikan'],
      inspector: 'Saya',
      completedAt: '12:30',
      notes: 'Perlu rework pada bagian finishing dan welding'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Dashboard QC Besi"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/qc-besi' }
      ]}
    >
      <Head title="Dashboard QC Besi" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Search className="h-8 w-8 text-blue-600" />
              Dashboard QC Besi
            </h1>
            <p className="text-gray-600 mt-1">{roleInfo?.description || 'Quality Control untuk produksi besi dan logam'}</p>
          </div>
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            QC Besi
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <span className="text-sm text-gray-500">{stat.unit}</span>
                    </div>
                    <p className={`text-sm ${stat.color} font-medium`}>
                      {stat.trend}
                    </p>
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
          {/* Inspection Queue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-orange-600" />
                Antrean Inspeksi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inspectionQueue.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.product}</h4>
                        <p className="text-sm text-gray-600">{item.workOrder}</p>
                      </div>
                      <Badge 
                        variant={
                          item.priority === 'urgent' ? 'destructive' : 
                          item.priority === 'high' ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {item.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                      <div>
                        <p className="text-gray-600">Quantity</p>
                        <p className="font-medium">{item.quantity} unit</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Estimasi Waktu</p>
                        <p className="font-medium">{item.estimatedTime}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Supervisor: {item.supervisor}</span>
                      <span>Submitted: {item.submittedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Inspections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Inspeksi Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInspections.map((inspection) => (
                  <div key={inspection.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{inspection.product}</h4>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={inspection.result === 'passed' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {inspection.result === 'passed' ? 'PASSED' : 'REWORK'}
                        </Badge>
                        <span className="text-sm font-semibold text-blue-600">{inspection.score}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{inspection.notes}</p>
                    {inspection.issues.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-red-600 mb-1">Issues Found:</p>
                        <ul className="text-xs text-red-600 list-disc list-inside">
                          {inspection.issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Inspector: {inspection.inspector}</span>
                      <span>Completed: {inspection.completedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors cursor-pointer">
                <Search className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-blue-900">Mulai Inspeksi</p>
                <p className="text-sm text-blue-600">Inspeksi item berikutnya</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors cursor-pointer">
                <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-900">Buat Laporan</p>
                <p className="text-sm text-green-600">Laporan QC harian</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors cursor-pointer">
                <BarChart2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-purple-900">Analisis Reject</p>
                <p className="text-sm text-purple-600">Analisa penyebab reject</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition-colors cursor-pointer">
                <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="font-medium text-orange-900">Standar Kualitas</p>
                <p className="text-sm text-orange-600">Lihat standar produk</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}