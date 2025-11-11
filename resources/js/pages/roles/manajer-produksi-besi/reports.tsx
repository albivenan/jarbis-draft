import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  Wrench,
  Package,
  ClipboardCheck,
  Users
} from 'lucide-react';

interface ReportsProps {
  roleInfo?: {
    name: string;
    description: string;
  };
}

export default function Reports({ roleInfo }: ReportsProps) {
  const productionData = [
    {
      date: '2024-12-09',
      target: 20,
      actual: 18,
      efficiency: 90,
      quality: 95,
      teams: 3
    },
    {
      date: '2024-12-08',
      target: 20,
      actual: 22,
      efficiency: 110,
      quality: 98,
      teams: 3
    },
    {
      date: '2024-12-07',
      target: 18,
      actual: 16,
      efficiency: 89,
      quality: 92,
      teams: 2
    },
    {
      date: '2024-12-06',
      target: 20,
      actual: 19,
      efficiency: 95,
      quality: 96,
      teams: 3
    },
    {
      date: '2024-12-05',
      target: 22,
      actual: 21,
      efficiency: 95,
      quality: 94,
      teams: 3
    }
  ];

  const weeklyStats = {
    totalProduction: 96,
    targetProduction: 100,
    averageEfficiency: 96,
    qualityRate: 95,
    activeTeams: 3
  };

  const productTypes = [
    {
      name: 'Rangka Besi',
      produced: 45,
      target: 50,
      percentage: 90
    },
    {
      name: 'Pagar Besi',
      produced: 28,
      target: 30,
      percentage: 93
    },
    {
      name: 'Kanopi Besi',
      produced: 15,
      target: 12,
      percentage: 125
    },
    {
      name: 'Railing Tangga',
      produced: 8,
      target: 8,
      percentage: 100
    }
  ];

  return (
    <AuthenticatedLayout>
      <Head title="Laporan Produksi Besi" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Laporan Produksi Besi
            </h1>
            <p className="text-gray-600 mt-1">Analisis dan laporan produksi lini besi</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Produksi</p>
                  <p className="text-xl font-bold">{weeklyStats.totalProduction}</p>
                  <p className="text-xs text-gray-500">dari {weeklyStats.targetProduction} target</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Efisiensi Rata-rata</p>
                  <p className="text-xl font-bold">{weeklyStats.averageEfficiency}%</p>
                  <p className="text-xs text-green-600">+2% dari minggu lalu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Kualitas</p>
                  <p className="text-xl font-bold">{weeklyStats.qualityRate}%</p>
                  <p className="text-xs text-purple-600">Sangat Baik</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Tim Aktif</p>
                  <p className="text-xl font-bold">{weeklyStats.activeTeams}</p>
                  <p className="text-xs text-orange-600">Tim Produksi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Periode</p>
                  <p className="text-xl font-bold">5</p>
                  <p className="text-xs text-gray-600">Hari Kerja</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Production Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Produksi Harian (5 Hari Terakhir)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productionData.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{new Date(day.date).toLocaleDateString('id-ID', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      })}</p>
                      <p className="text-sm text-gray-600">{day.actual}/{day.target} unit</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={day.efficiency >= 100 ? "default" : day.efficiency >= 90 ? "secondary" : "destructive"}>
                        {day.efficiency}%
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">QC: {day.quality}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Product Types */}
          <Card>
            <CardHeader>
              <CardTitle>Produksi per Jenis Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productTypes.map((product, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm text-gray-600">
                        {product.produced}/{product.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          product.percentage >= 100 ? 'bg-green-500' :
                          product.percentage >= 90 ? 'bg-blue-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min(product.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{product.percentage}% dari target</span>
                      <Badge variant={product.percentage >= 100 ? "default" : "secondary"} className="text-xs">
                        {product.percentage >= 100 ? 'Target Tercapai' : 'Dalam Progress'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Report Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Laporan Produksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Tanggal</th>
                    <th className="text-left p-2">Target</th>
                    <th className="text-left p-2">Aktual</th>
                    <th className="text-left p-2">Efisiensi</th>
                    <th className="text-left p-2">Kualitas</th>
                    <th className="text-left p-2">Tim</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {productionData.map((day, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        {new Date(day.date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-2">{day.target} unit</td>
                      <td className="p-2 font-medium">{day.actual} unit</td>
                      <td className="p-2">
                        <Badge variant={day.efficiency >= 100 ? "default" : day.efficiency >= 90 ? "secondary" : "destructive"}>
                          {day.efficiency}%
                        </Badge>
                      </td>
                      <td className="p-2">{day.quality}%</td>
                      <td className="p-2">{day.teams} tim</td>
                      <td className="p-2">
                        <Badge variant={day.actual >= day.target ? "default" : "secondary"}>
                          {day.actual >= day.target ? 'Target Tercapai' : 'Belum Tercapai'}
                        </Badge>
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