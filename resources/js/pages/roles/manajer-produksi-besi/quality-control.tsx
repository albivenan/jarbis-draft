import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ClipboardCheck, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Wrench
} from 'lucide-react';

interface QualityControlProps {
  roleInfo?: {
    name: string;
    description: string;
  };
}

export default function QualityControl({ roleInfo }: QualityControlProps) {
  const qcStats = {
    totalInspections: 45,
    passed: 41,
    failed: 2,
    pending: 2,
    passRate: 95.3
  };

  const pendingInspections = [
    {
      id: 'QC-2024-001',
      productName: 'Rangka Besi Tipe A',
      batchNumber: 'RB-240901',
      quantity: 5,
      requestedBy: 'Tim Welding A',
      requestDate: '2024-12-09 14:30',
      priority: 'high',
      estimatedTime: '30 menit'
    },
    {
      id: 'QC-2024-002',
      productName: 'Pagar Besi Ornamen',
      batchNumber: 'PB-240902',
      quantity: 3,
      requestedBy: 'Tim Welding B',
      requestDate: '2024-12-09 15:15',
      priority: 'medium',
      estimatedTime: '45 menit'
    }
  ];

  const recentInspections = [
    {
      id: 'QC-2024-003',
      productName: 'Kanopi Besi Minimalis',
      batchNumber: 'KB-240903',
      quantity: 2,
      inspector: 'QC Besi',
      completedDate: '2024-12-09 13:45',
      status: 'passed',
      score: 98,
      notes: 'Kualitas sangat baik, sesuai standar'
    },
    {
      id: 'QC-2024-004',
      productName: 'Railing Tangga',
      batchNumber: 'RT-240904',
      quantity: 4,
      inspector: 'QC Besi',
      completedDate: '2024-12-09 12:30',
      status: 'passed',
      score: 95,
      notes: 'Memenuhi standar kualitas'
    },
    {
      id: 'QC-2024-005',
      productName: 'Rangka Besi Tipe B',
      batchNumber: 'RB-240905',
      quantity: 3,
      inspector: 'QC Besi',
      completedDate: '2024-12-09 11:15',
      status: 'failed',
      score: 75,
      notes: 'Las kurang rapi, perlu perbaikan'
    }
  ];

  const qualityMetrics = [
    {
      category: 'Kekuatan Las',
      score: 96,
      target: 95,
      status: 'excellent'
    },
    {
      category: 'Finishing',
      score: 94,
      target: 90,
      status: 'good'
    },
    {
      category: 'Dimensi',
      score: 98,
      target: 95,
      status: 'excellent'
    },
    {
      category: 'Cat/Coating',
      score: 92,
      target: 90,
      status: 'good'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-100 text-green-800">Lolos</Badge>;
      case 'failed':
        return <Badge variant="destructive">Gagal</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Tinggi</Badge>;
      case 'medium':
        return <Badge variant="secondary">Sedang</Badge>;
      case 'low':
        return <Badge variant="outline">Rendah</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Quality Control Besi" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardCheck className="h-8 w-8 text-green-600" />
              Quality Control Besi
            </h1>
            <p className="text-gray-600 mt-1">Monitor dan kelola kualitas produk besi</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Cari
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* QC Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Inspeksi</p>
                  <p className="text-xl font-bold">{qcStats.totalInspections}</p>
                  <p className="text-xs text-gray-500">Hari ini</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Lolos QC</p>
                  <p className="text-xl font-bold text-green-700">{qcStats.passed}</p>
                  <p className="text-xs text-green-600">Produk</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Gagal QC</p>
                  <p className="text-xl font-bold text-red-700">{qcStats.failed}</p>
                  <p className="text-xs text-red-600">Produk</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-orange-700">{qcStats.pending}</p>
                  <p className="text-xs text-orange-600">Menunggu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Pass Rate</p>
                  <p className="text-xl font-bold text-purple-700">{qcStats.passRate}%</p>
                  <p className="text-xs text-purple-600">Tingkat Lolos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Inspections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Inspeksi Menunggu ({pendingInspections.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingInspections.map((inspection) => (
                  <div key={inspection.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{inspection.productName}</h4>
                        <p className="text-sm text-gray-600">Batch: {inspection.batchNumber}</p>
                      </div>
                      {getPriorityBadge(inspection.priority)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <p>Jumlah: {inspection.quantity} unit</p>
                        <p>Tim: {inspection.requestedBy}</p>
                      </div>
                      <div>
                        <p>Waktu: {inspection.requestDate}</p>
                        <p>Estimasi: {inspection.estimatedTime}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                        Mulai Inspeksi
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {pendingInspections.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ClipboardCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Tidak ada inspeksi yang menunggu</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quality Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Metrik Kualitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{metric.category}</span>
                      <div className="text-right">
                        <span className="font-bold">{metric.score}%</span>
                        <span className="text-sm text-gray-500 ml-1">/ {metric.target}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.status === 'excellent' ? 'bg-green-500' :
                          metric.status === 'good' ? 'bg-blue-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${metric.score}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Target: {metric.target}%</span>
                      <Badge variant={metric.status === 'excellent' ? "default" : "secondary"} className="text-xs">
                        {metric.status === 'excellent' ? 'Sangat Baik' : 
                         metric.status === 'good' ? 'Baik' : 'Perlu Perbaikan'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Inspections */}
        <Card>
          <CardHeader>
            <CardTitle>Inspeksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Produk</th>
                    <th className="text-left p-2">Batch</th>
                    <th className="text-left p-2">Qty</th>
                    <th className="text-left p-2">Inspector</th>
                    <th className="text-left p-2">Waktu</th>
                    <th className="text-left p-2">Score</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInspections.map((inspection) => (
                    <tr key={inspection.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono text-xs">{inspection.id}</td>
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{inspection.productName}</p>
                          <p className="text-xs text-gray-500">{inspection.notes}</p>
                        </div>
                      </td>
                      <td className="p-2 font-mono text-xs">{inspection.batchNumber}</td>
                      <td className="p-2">{inspection.quantity}</td>
                      <td className="p-2">{inspection.inspector}</td>
                      <td className="p-2 text-xs">{inspection.completedDate}</td>
                      <td className="p-2">
                        <span className={`font-bold ${
                          inspection.score >= 95 ? 'text-green-600' :
                          inspection.score >= 85 ? 'text-blue-600' :
                          'text-red-600'
                        }`}>
                          {inspection.score}%
                        </span>
                      </td>
                      <td className="p-2">
                        {getStatusBadge(inspection.status)}
                      </td>
                      <td className="p-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}