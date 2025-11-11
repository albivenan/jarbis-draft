import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Crown,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  BarChart2,
  Target,
  CheckCircle,
  Bell,
  Calendar,
  Clock,
  AlertTriangle,
  Eye,
  Phone,
  Mail,
  Building,
  FileText,
  Zap
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
      title: 'Revenue Bulanan',
      value: '2.8',
      unit: 'Miliar',
      icon: DollarSign,
      trend: '+12% dari bulan lalu',
      color: 'text-green-600'
    },
    {
      title: 'Total Karyawan',
      value: '247',
      unit: 'orang',
      icon: Users,
      trend: '+8 karyawan baru',
      color: 'text-blue-600'
    },
    {
      title: 'Produksi Total',
      value: '1,245',
      unit: 'unit',
      icon: Package,
      trend: '+15% dari target',
      color: 'text-purple-600'
    },
    {
      title: 'Profit Margin',
      value: '18.5',
      unit: '%',
      icon: TrendingUp,
      trend: 'Target 15%',
      color: 'text-orange-600'
    }
  ];

  const departmentPerformance = [
    {
      department: 'Produksi Besi',
      manager: 'Budi Santoso',
      revenue: 1200000000,
      efficiency: 95,
      employees: 85,
      status: 'excellent'
    },
    {
      department: 'Produksi Kayu',
      manager: 'Sari Dewi',
      revenue: 950000000,
      efficiency: 92,
      employees: 72,
      status: 'excellent'
    },
    {
      department: 'PPIC',
      manager: 'Ahmad Wijaya',
      revenue: 0,
      efficiency: 88,
      employees: 15,
      status: 'good'
    },
    {
      department: 'Marketing',
      manager: 'Lisa Permata',
      revenue: 650000000,
      efficiency: 90,
      employees: 25,
      status: 'good'
    }
  ];

  const pendingApprovals = [
    {
      id: 'APP-001',
      type: 'budget',
      title: 'Anggaran Pembelian Mesin CNC Baru',
      department: 'Produksi Besi',
      amount: 850000000,
      requestedBy: 'Budi Santoso',
      submittedAt: '2024-01-15',
      priority: 'high',
      description: 'Investasi mesin CNC untuk meningkatkan kapasitas produksi 30%'
    },
    {
      id: 'APP-002',
      type: 'project',
      title: 'Ekspansi Gudang Bahan Baku',
      department: 'PPIC',
      amount: 450000000,
      requestedBy: 'Ahmad Wijaya',
      submittedAt: '2024-01-14',
      priority: 'medium',
      description: 'Pembangunan gudang tambahan untuk stok bahan baku'
    }
  ];

  // New Orders Notifications
  const newOrders = [
    {
      id: 'ORD-2025-001',
      customerName: 'PT Konstruksi Megah',
      customerCompany: 'PT Konstruksi Megah',
      contactPerson: 'Ir. Bambang Sutrisno',
      phone: '+62 21 5555-1234',
      email: 'bambang@konstruksimegah.com',
      productType: 'Besi',
      specifications: 'H-Beam 400x200x8x13mm, Grade SS400',
      quantity: '50 ton',
      estimatedValue: 750000000,
      deliveryDeadline: '2025-02-15',
      specialRequirements: 'Sertifikat SNI, Galvanized coating',
      salesPerson: 'Lisa Permata',
      receivedAt: '2025-01-07 09:30',
      priority: 'high',
      status: 'new',
      isVIP: true
    },
    {
      id: 'ORD-2025-002',
      customerName: 'CV Furniture Jaya',
      customerCompany: 'CV Furniture Jaya',
      contactPerson: 'Sari Wulandari',
      phone: '+62 21 5555-5678',
      email: 'sari@furniturejaya.com',
      productType: 'Kayu',
      specifications: 'Kayu Jati Grade A, finishing natural',
      quantity: '200 m³',
      estimatedValue: 450000000,
      deliveryDeadline: '2025-02-28',
      specialRequirements: 'Moisture content max 12%, Custom cutting',
      salesPerson: 'Ahmad Marketing',
      receivedAt: '2025-01-07 11:15',
      priority: 'medium',
      status: 'new',
      isVIP: false
    },
    {
      id: 'ORD-2025-003',
      customerName: 'PT Infrastruktur Prima',
      customerCompany: 'PT Infrastruktur Prima',
      contactPerson: 'Eng. Dedi Kurniawan',
      phone: '+62 21 5555-9999',
      email: 'dedi@infraprima.com',
      productType: 'Besi',
      specifications: 'Steel Plate 20mm, Carbon Steel A36',
      quantity: '100 ton',
      estimatedValue: 1200000000,
      deliveryDeadline: '2025-01-25',
      specialRequirements: 'Urgent delivery, Mill test certificate required',
      salesPerson: 'Lisa Permata',
      receivedAt: '2025-01-07 14:45',
      priority: 'urgent',
      status: 'new',
      isVIP: true
    }
  ];

  // Today's Meetings
  const todaysMeetings = [
    {
      id: 'MTG-001',
      title: 'Board Meeting - Q4 Review',
      type: 'board',
      time: '09:00 - 11:00',
      location: 'Ruang Direksi',
      participants: ['Board of Directors', 'Manajer HRD', 'Manajer Keuangan'],
      agenda: 'Review kinerja Q4 2024 dan planning 2025',
      status: 'upcoming',
      priority: 'high'
    },
    {
      id: 'MTG-002',
      title: 'Client Meeting - PT Konstruksi Megah',
      type: 'client',
      time: '14:00 - 15:30',
      location: 'Meeting Room A',
      participants: ['Direktur', 'Manajer Marketing', 'Manajer Produksi Besi'],
      agenda: 'Diskusi project besar H-Beam 750M',
      status: 'upcoming',
      priority: 'high'
    },
    {
      id: 'MTG-003',
      title: 'Weekly Management Review',
      type: 'internal',
      time: '16:00 - 17:00',
      location: 'Ruang Meeting Utama',
      participants: ['All Department Managers'],
      agenda: 'Review progress mingguan semua departemen',
      status: 'upcoming',
      priority: 'medium'
    }
  ];

  const getOrderPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMeetingTypeColor = (type: string) => {
    switch (type) {
      case 'board': return 'bg-purple-100 text-purple-800';
      case 'client': return 'bg-blue-100 text-blue-800';
      case 'internal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
      title="Dashboard Direktur"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/direktur' }
      ]}
    >
      <Head title="Dashboard Direktur" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Crown className="h-8 w-8 text-yellow-600" />
              Dashboard Direktur
            </h1>
            <p className="text-gray-600 mt-1">{roleInfo?.description || 'Executive Dashboard - Strategic Overview & Decision Making'}</p>
          </div>
          <Badge variant="outline" className="text-yellow-700 border-yellow-300">
            Direktur
          </Badge>
        </div>

        {/* Key Performance Indicators */}
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

        {/* New Orders Notifications */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Pesanan Masuk Baru
                <Badge className="bg-red-100 text-red-800">
                  {newOrders.length} Baru
                </Badge>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Lihat Semua
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {newOrders.map((order) => (
                <div key={order.id} className={`p-4 border rounded-lg ${getOrderPriorityColor(order.priority)} transition-all hover:shadow-md`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{order.customerName}</h4>
                        {order.isVIP && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Crown className="w-3 h-3 mr-1" />
                            VIP
                          </Badge>
                        )}
                        <Badge className={getOrderPriorityColor(order.priority)}>
                          {order.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Produk: <span className="font-medium">{order.productType}</span></p>
                          <p className="text-gray-600">Spesifikasi: <span className="font-medium">{order.specifications}</span></p>
                          <p className="text-gray-600">Quantity: <span className="font-medium">{order.quantity}</span></p>
                        </div>
                        <div>
                          <p className="text-gray-600">Nilai Estimasi: <span className="font-semibold text-green-600">{formatCurrency(order.estimatedValue)}</span></p>
                          <p className="text-gray-600">Deadline: <span className="font-medium">{order.deliveryDeadline}</span></p>
                          <p className="text-gray-600">Sales: <span className="font-medium">{order.salesPerson}</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Eye className="w-4 h-4 mr-2" />
                        Detail
                      </Button>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="p-2">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="p-2">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white bg-opacity-50 p-3 rounded text-sm">
                    <p className="text-gray-700"><strong>Contact:</strong> {order.contactPerson} - {order.phone}</p>
                    <p className="text-gray-700"><strong>Requirements:</strong> {order.specialRequirements}</p>
                    <p className="text-xs text-gray-500 mt-2">Diterima: {order.receivedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule & Meetings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Jadwal Hari Ini
              </div>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Kelola Meeting
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysMeetings.map((meeting) => (
                <div key={meeting.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                        <Badge className={getMeetingTypeColor(meeting.type)}>
                          {meeting.type.toUpperCase()}
                        </Badge>
                        {meeting.priority === 'high' && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            PENTING
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {meeting.time}
                          </p>
                          <p className="text-gray-600 flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            {meeting.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Participants: <span className="font-medium">{meeting.participants.length} orang</span></p>
                          <p className="text-gray-600">Agenda: <span className="font-medium">{meeting.agenda}</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Agenda
                      </Button>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Calendar className="w-4 h-4 mr-2" />
                        Join
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-blue-600" />
                Kinerja Departemen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentPerformance.map((dept, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{dept.department}</h4>
                        <p className="text-sm text-gray-600">{dept.manager}</p>
                      </div>
                      <Badge 
                        variant={dept.status === 'excellent' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {dept.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Efficiency</p>
                        <p className="font-semibold text-blue-600">{dept.efficiency}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Employees</p>
                        <p className="font-semibold">{dept.employees}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Revenue</p>
                        <p className="font-semibold text-green-600">
                          {dept.revenue > 0 ? `${(dept.revenue / 1000000000).toFixed(1)}B` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-orange-600" />
                Menunggu Persetujuan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{approval.title}</h4>
                        <p className="text-sm text-gray-600">{approval.department}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge 
                          variant={approval.priority === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {approval.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {approval.type}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{approval.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-semibold text-green-600">{formatCurrency(approval.amount)}</p>
                        <p className="text-xs text-gray-500">Requested by: {approval.requestedBy}</p>
                      </div>
                      <p className="text-xs text-gray-500">{approval.submittedAt}</p>
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
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Aksi Strategis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors cursor-pointer">
                <BarChart2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-blue-900">Laporan Strategis</p>
                <p className="text-sm text-blue-600">Review kinerja perusahaan</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors cursor-pointer">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-900">Persetujuan</p>
                <p className="text-sm text-green-600">Review pending approvals</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors cursor-pointer">
                <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-purple-900">Meeting Management</p>
                <p className="text-sm text-purple-600">Jadwal & agenda meeting</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition-colors cursor-pointer">
                <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="font-medium text-orange-900">Strategic Planning</p>
                <p className="text-sm text-orange-600">Rencana strategis perusahaan</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center hover:bg-red-100 transition-colors cursor-pointer">
                <Bell className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="font-medium text-red-900">Notifications</p>
                <p className="text-sm text-red-600">Alerts & urgent items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
