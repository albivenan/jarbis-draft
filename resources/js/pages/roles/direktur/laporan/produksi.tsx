import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  TrendingUp,
  BarChart2,
  Calendar,
  Target,
  CheckCircle,
  AlertTriangle,
  Users
} from 'lucide-react';

interface LaporanProduksiProps {
  roleInfo?: {
    name: string;
    description: string;
  };
}

export default function LaporanProduksi({ roleInfo }: LaporanProduksiProps) {
  const productionSummary = [
    {
      title: 'Total Produksi Bulan Ini',
      value: '1,245',
      unit: 'unit',
      icon: Package,
      trend: '+15% dari bulan lalu',
      color: 'text-green-600'
    },
    {
      title: 'Efisiensi Produksi',
      value: '94',
      unit: '%',
      icon: TrendingUp,
      trend: 'Target 90%',
      color: 'text-blue-600'
    },
    {
      title: 'On-Time Delivery',
      value: '89',
      unit: '%',
      icon: CheckCircle,
      trend: 'Target 92%',
      color: 'text-orange-600'
    },
    {
      title: 'Defect Rate',
      value: '3.5',
      unit: '%',
      icon: AlertTriangle,
      trend: 'Target <5%',
      color: 'text-red-600'
    }
  ];

  const departmentProduction = [
    {
      department: 'Produksi Besi',
      target: 800,
      actual: 920,
      efficiency: 115,
      quality: 96.5,
      onTime: 92,
      status: 'excellent'
    },
    {
      department: 'Produksi Kayu',
      target: 600,
      actual: 650,
      efficiency: 108,
      quality: 94.2,
      onTime: 88,
      status: 'good'
    }
  ];

  const monthlyTrend = [
    { month: 'Jan', besi: 850, kayu: 580, total: 1430 },
    { month: 'Feb', besi: 920, kayu: 620, total: 1540 },
    { month: 'Mar', besi: 890, kayu: 590, total: 1480 },
    { month: 'Apr', besi: 950, kayu: 650, total: 1600 },
    { month: 'Mei', besi: 920, kayu: 650, total: 1570 }
  ];

  const topProducts = [
    {
      product: 'Rangka Besi Custom',
      category: 'Besi',
      quantity: 245,
      revenue: 1200000000,
      growth: '+18%'
    },
    {
      product: 'Meja Kayu Jati Premium',
      category: 'Kayu',
      quantity: 180,
      revenue: 950000000,
      growth: '+12%'
    },
    {
      product: 'Pagar Besi Minimalis',
      category: 'Besi',
      quantity: 320,
      revenue: 800000000,
      growth: '+25%'
    },
    {
      product: 'Furniture Set Mahoni',
      category: 'Kayu',
      quantity: 95,
      revenue: 650000000,
      growth: '+8%'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AuthenticatedLayout
      title="Laporan Produksi Total"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/direktur' },
        { title: 'Laporan Strategis', href: '#' },
        { title: 'Laporan Produksi Total', href: '/roles/direktur/laporan/produksi' }
      ]}
    >
      <Head title="Laporan Produksi Total" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="h-8 w-8 text-blue-600" />
              Laporan Produksi Total
            </h1>
            <p className="text-gray-600 mt-1">Ringkasan kinerja produksi seluruh divisi</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              Periode: Mei 2024
            </Badge>
            <Badge variant="outline" className="text-green-700 border-green-300">
              Status: On Track
            </Badge>
          </div>
        </div>

        {/* Production Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productionSummary.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{item.title}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {item.value}
                      </p>
                      <span className="text-sm text-gray-500">{item.unit}</span>
                    </div>
                    <p className={`text-sm ${item.color} font-medium`}>
                      {item.trend}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-gray-100">
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-purple-600" />
                Kinerja per Departemen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentProduction.map((dept, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{dept.department}</h4>
                      <Badge 
                        variant={dept.status === 'excellent' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {dept.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Target vs Actual</p>
                        <p className="font-semibold">
                          {dept.actual} / {dept.target} unit
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Efficiency</p>
                        <p className="font-semibold text-blue-600">{dept.efficiency}%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Quality Rate</p>
                        <p className="font-semibold text-green-600">{dept.quality}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">On-Time Delivery</p>
                        <p className="font-semibold text-orange-600">{dept.onTime}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Tren Produksi 5 Bulan Terakhir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyTrend.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 text-center">
                        <p className="font-medium text-gray-900">{month.month}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Besi</p>
                          <p className="font-semibold text-gray-800">{month.besi}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Kayu</p>
                          <p className="font-semibold text-amber-600">{month.kayu}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total</p>
                          <p className="font-semibold text-blue-600">{month.total}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Produk Terlaris
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topProducts.map((product, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{product.product}</h4>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        product.category === 'Besi' ? 'text-gray-700 border-gray-300' : 'text-amber-700 border-amber-300'
                      }`}
                    >
                      {product.category}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Quantity</p>
                      <p className="font-semibold">{product.quantity} unit</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Revenue</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(product.revenue)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-600">Growth: 
                      <span className="font-semibold text-green-600 ml-1">{product.growth}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors cursor-pointer">
                <BarChart2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-blue-900">Export PDF</p>
                <p className="text-sm text-blue-600">Download laporan lengkap</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors cursor-pointer">
                <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-900">Jadwal Otomatis</p>
                <p className="text-sm text-green-600">Atur laporan berkala</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors cursor-pointer">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-purple-900">Share Report</p>
                <p className="text-sm text-purple-600">Bagikan ke stakeholder</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
