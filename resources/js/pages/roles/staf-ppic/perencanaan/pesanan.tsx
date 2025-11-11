import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ClipboardList,
  Calendar,
  Package,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  ArrowRight
} from 'lucide-react';

interface PesananMasukProps {
  roleInfo?: {
    name: string;
    description: string;
  };
}

export default function PesananMasuk({ roleInfo }: PesananMasukProps) {
  const stats = [
    {
      title: 'Total Pesanan Masuk',
      value: '24',
      unit: 'pesanan',
      icon: ClipboardList,
      trend: '+3 hari ini',
      color: 'text-blue-600'
    },
    {
      title: 'Menunggu Review',
      value: '8',
      unit: 'pesanan',
      icon: Clock,
      trend: 'Perlu tindakan',
      color: 'text-orange-600'
    },
    {
      title: 'Siap Dijadwalkan',
      value: '12',
      unit: 'pesanan',
      icon: CheckCircle,
      trend: 'Ready to schedule',
      color: 'text-green-600'
    },
    {
      title: 'Butuh Klarifikasi',
      value: '4',
      unit: 'pesanan',
      icon: AlertTriangle,
      trend: 'Urgent',
      color: 'text-red-600'
    }
  ];

  // Format ERP berdasarkan seeder: SO (Sales Order) dari Marketing
  const incomingOrders = [
    {
      id: 'SO-2024-001',
      customer: 'PT Konstruksi Jaya',
      customerCode: 'CUST-001',
      product: 'Rangka Besi Custom 10x12m',
      productCode: 'PRD-BSI-001',
      category: 'Besi',
      quantity: 50,
      unit: 'unit',
      requestedDate: '2024-02-15',
      orderDate: '2024-01-15',
      priority: 'most_priority',
      status: 'pending_review',
      estimatedDuration: '14 hari',
      marketingPIC: 'Staf Marketing',
      notes: 'Spesifikasi khusus untuk proyek gedung 15 lantai',
      materialNeeded: [
        { code: 'MAT-BSI-001', name: 'Besi Beton 12mm', qty: 200, unit: 'batang' },
        { code: 'MAT-BSI-002', name: 'Plat Besi 8mm', qty: 50, unit: 'lembar' }
      ]
    },
    {
      id: 'SO-2024-002',
      customer: 'CV Furniture Modern',
      customerCode: 'CUST-002',
      product: 'Set Meja Kursi Kayu Jati Premium',
      productCode: 'PRD-KYU-001',
      category: 'Kayu',
      quantity: 25,
      unit: 'set',
      requestedDate: '2024-02-20',
      orderDate: '2024-01-16',
      priority: 'priority',
      status: 'ready_to_schedule',
      estimatedDuration: '10 hari',
      marketingPIC: 'Manajer Marketing',
      notes: 'Finishing premium dengan cat duco',
      materialNeeded: [
        { code: 'MAT-KYU-001', name: 'Kayu Jati Grade A', qty: 15, unit: 'm³' },
        { code: 'MAT-KYU-002', name: 'Cat Duco Premium', qty: 20, unit: 'liter' }
      ]
    },
    {
      id: 'SO-2024-003',
      customer: 'PT Properti Indah',
      customerCode: 'CUST-003',
      product: 'Pagar Besi Minimalis',
      productCode: 'PRD-BSI-002',
      category: 'Besi',
      quantity: 100,
      unit: 'meter',
      requestedDate: '2024-02-10',
      orderDate: '2024-01-17',
      priority: 'most_priority',
      status: 'need_clarification',
      estimatedDuration: '7 hari',
      marketingPIC: 'Staf Marketing',
      notes: 'Desain belum final, menunggu approval customer',
      materialNeeded: [
        { code: 'MAT-BSI-003', name: 'Hollow Besi 4x4', qty: 150, unit: 'batang' },
        { code: 'MAT-BSI-004', name: 'Cat Anti Karat', qty: 30, unit: 'liter' }
      ]
    },
    {
      id: 'SO-2024-004',
      customer: 'UD Mebel Jaya',
      customerCode: 'CUST-004',
      product: 'Lemari Kayu Mahoni Custom',
      productCode: 'PRD-KYU-002',
      category: 'Kayu',
      quantity: 15,
      unit: 'unit',
      requestedDate: '2024-02-25',
      orderDate: '2024-01-18',
      priority: 'stock',
      status: 'pending_review',
      estimatedDuration: '12 hari',
      marketingPIC: 'Staf Marketing',
      notes: 'Pesanan untuk stok showroom',
      materialNeeded: [
        { code: 'MAT-KYU-003', name: 'Kayu Mahoni Grade B', qty: 8, unit: 'm³' },
        { code: 'MAT-KYU-004', name: 'Handle Lemari Premium', qty: 45, unit: 'pcs' }
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'most_priority': return 'destructive';
      case 'priority': return 'default';
      case 'stock': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review': return 'text-orange-600 bg-orange-50';
      case 'ready_to_schedule': return 'text-green-600 bg-green-50';
      case 'need_clarification': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_review': return 'Menunggu Review';
      case 'ready_to_schedule': return 'Siap Dijadwalkan';
      case 'need_clarification': return 'Butuh Klarifikasi';
      default: return status;
    }
  };

  return (
    <AuthenticatedLayout
      title="Antrean Pesanan Masuk"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-ppic' },
        { title: 'Perencanaan Produksi', href: '#' },
        { title: 'Antrean Pesanan Masuk', href: '/roles/staf-ppic/perencanaan/pesanan' }
      ]}
    >
      <Head title="Antrean Pesanan Masuk" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="h-8 w-8 text-blue-600" />
              Antrean Pesanan Masuk
            </h1>
            <p className="text-gray-600 mt-1">Lihat pesanan dari Marketing yang perlu dianalisis dan dijadwalkan</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              Real-time Data
            </Badge>
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

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Daftar Pesanan Masuk (Sales Orders)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incomingOrders.map((order) => (
                <div key={order.id} className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.customer} ({order.customerCode})</p>
                      </div>
                      <Badge 
                        variant={order.category === 'Besi' ? 'outline' : 'secondary'}
                        className={order.category === 'Besi' ? 'text-gray-700 border-gray-300' : 'text-amber-700 border-amber-300'}
                      >
                        {order.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(order.priority)} className="text-xs">
                        {order.priority.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Produk</p>
                      <p className="text-sm text-gray-900">{order.product}</p>
                      <p className="text-xs text-gray-500">{order.productCode}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Quantity & Timeline</p>
                      <p className="text-sm text-gray-900">{order.quantity} {order.unit}</p>
                      <p className="text-xs text-gray-500">Estimasi: {order.estimatedDuration}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tanggal</p>
                      <p className="text-sm text-gray-900">Request: {order.requestedDate}</p>
                      <p className="text-xs text-gray-500">Order: {order.orderDate}</p>
                    </div>
                  </div>

                  {/* Material Requirements */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Kebutuhan Material</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {order.materialNeeded.map((material, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                          <span>{material.name} ({material.code})</span>
                          <span className="font-medium">{material.qty} {material.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes & Actions */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Catatan</p>
                      <p className="text-sm text-gray-600">{order.notes}</p>
                      <p className="text-xs text-gray-500 mt-1">PIC Marketing: {order.marketingPIC}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="font-medium text-orange-900">8 Pesanan</p>
                <p className="text-sm text-orange-600">Menunggu review PPIC</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-900">12 Pesanan</p>
                <p className="text-sm text-green-600">Siap masuk jadwal produksi</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="font-medium text-red-900">4 Pesanan</p>
                <p className="text-sm text-red-600">Butuh klarifikasi dengan Marketing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}