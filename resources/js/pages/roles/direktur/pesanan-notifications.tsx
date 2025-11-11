import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Crown,
  DollarSign,
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  Eye,
  Filter,
  Search,
  TrendingUp,
  Settings,
  Archive,
  RefreshCw
} from 'lucide-react';

export default function PesananNotifications() {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    newOrders: true,
    productionProcess: false,
    notificationStatus: false,
    analytics: false
  });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // New Orders Data
  const newOrders = [
    {
      id: 'ORD-2025-001',
      customerName: 'PT Konstruksi Megah',
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
      isVIP: true,
      autoAssigned: 'Produksi Besi',
      estimatedStartDate: '2025-01-10'
    },
    {
      id: 'ORD-2025-002',
      customerName: 'CV Furniture Jaya',
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
      isVIP: false,
      autoAssigned: 'Produksi Kayu',
      estimatedStartDate: '2025-01-12'
    }
  ];  // 

  const productionProcess = [
    {
      id: 'WO-BSI-001',
      orderId: 'ORD-2024-098',
      customerName: 'PT Infrastruktur Prima',
      productType: 'Besi',
      specifications: 'Steel Plate 20mm, Carbon Steel A36',
      quantity: '100 ton',
      currentStage: 'production',
      progress: 75,
      startDate: '2024-12-15',
      estimatedCompletion: '2025-01-10',
      milestones: [
        { stage: 'planning', status: 'completed', date: '2024-12-15', department: 'PPIC' },
        { stage: 'material_prep', status: 'completed', date: '2024-12-18', department: 'Warehouse' },
        { stage: 'production', status: 'in_progress', date: '2024-12-20', department: 'Produksi Besi' },
        { stage: 'qc_inspection', status: 'pending', date: null, department: 'QC Besi' },
        { stage: 'packaging', status: 'pending', date: null, department: 'Warehouse' },
        { stage: 'delivery', status: 'pending', date: null, department: 'Logistics' }
      ],
      issues: [
        {
          type: 'delay',
          description: 'Material delivery terlambat 2 hari',
          impact: 'medium',
          resolvedAt: '2024-12-22'
        }
      ],
      assignedTeam: 'Team A - Supervisor Ahmad',
      priority: 'high'
    },
    {
      id: 'WO-KYU-003',
      orderId: 'ORD-2024-099',
      customerName: 'CV Mebel Indah',
      productType: 'Kayu',
      specifications: 'Kayu Mahoni Grade B, Custom furniture',
      quantity: '150 m³',
      currentStage: 'qc_inspection',
      progress: 90,
      startDate: '2024-12-10',
      estimatedCompletion: '2025-01-08',
      milestones: [
        { stage: 'planning', status: 'completed', date: '2024-12-10', department: 'PPIC' },
        { stage: 'material_prep', status: 'completed', date: '2024-12-12', department: 'Warehouse' },
        { stage: 'production', status: 'completed', date: '2024-12-28', department: 'Produksi Kayu' },
        { stage: 'qc_inspection', status: 'in_progress', date: '2025-01-05', department: 'QC Kayu' },
        { stage: 'packaging', status: 'pending', date: null, department: 'Warehouse' },
        { stage: 'delivery', status: 'pending', date: null, department: 'Logistics' }
      ],
      issues: [],
      assignedTeam: 'Team B - Supervisor Kayu',
      priority: 'medium'
    }
  ];

  // Notification Status Data
  const notificationHistory = [
    {
      id: 'NOTIF-001',
      type: 'new_order',
      title: 'Pesanan Baru - PT Konstruksi Megah',
      message: 'Pesanan H-Beam senilai 750M memerlukan persetujuan direktur',
      timestamp: '2025-01-07 09:30',
      priority: 'high',
      status: 'unread',
      actionRequired: true,
      relatedId: 'ORD-2025-001'
    },
    {
      id: 'NOTIF-002',
      type: 'production_milestone',
      title: 'Produksi WO-BSI-001 Mencapai 75%',
      message: 'Steel Plate untuk PT Infrastruktur Prima on track untuk delivery',
      timestamp: '2025-01-07 08:15',
      priority: 'medium',
      status: 'read',
      actionRequired: false,
      relatedId: 'WO-BSI-001'
    },
    {
      id: 'NOTIF-003',
      type: 'qc_completed',
      title: 'QC Inspection Selesai - WO-KYU-003',
      message: 'Kayu Mahoni untuk CV Mebel Indah passed QC, siap untuk packaging',
      timestamp: '2025-01-07 07:45',
      priority: 'medium',
      status: 'read',
      actionRequired: false,
      relatedId: 'WO-KYU-003'
    },
    {
      id: 'NOTIF-004',
      type: 'delay_alert',
      title: 'Potensi Delay - WO-BSI-002',
      message: 'Material shortage dapat menyebabkan delay 3 hari',
      timestamp: '2025-01-06 16:20',
      priority: 'high',
      status: 'read',
      actionRequired: true,
      relatedId: 'WO-BSI-002'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getOrderPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'new_order': return 'bg-blue-100 text-blue-800';
      case 'production_milestone': return 'bg-green-100 text-green-800';
      case 'qc_completed': return 'bg-purple-100 text-purple-800';
      case 'delay_alert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadCount = notificationHistory.filter(n => n.status === 'unread').length;
  const actionRequiredCount = notificationHistory.filter(n => n.actionRequired).length;
  const totalOrderValue = newOrders.reduce((sum, order) => sum + order.estimatedValue, 0);
  const activeProduction = productionProcess.length;

  return (
    <AuthenticatedLayout
      title="Pesanan & Notifikasi"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/direktur' },
        { title: 'Pesanan & Notifikasi', href: '/roles/direktur/pesanan-notifications' }
      ]}
    >
      <Head title="Pesanan & Notifikasi - Direktur" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-8 w-8 text-blue-600" />
              Pesanan & Notifikasi
            </h1>
            <p className="text-gray-600 mt-1">Monitor pesanan masuk, proses produksi, dan status notifikasi real-time</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Pengaturan
            </Button>
            <Button variant="outline" size="sm">
              <Archive className="w-4 h-4 mr-2" />
              Arsip
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pesanan Baru</p>
                  <p className="text-2xl font-bold text-gray-900">{newOrders.length}</p>
                  <p className="text-sm text-blue-600">Nilai: {formatCurrency(totalOrderValue)}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produksi Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">{activeProduction}</p>
                  <p className="text-sm text-green-600">Work Orders</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <RefreshCw className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Notifikasi Belum Dibaca</p>
                  <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                  <p className="text-sm text-orange-600">Perlu Perhatian</p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Bell className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Perlu Tindakan</p>
                  <p className="text-2xl font-bold text-gray-900">{actionRequiredCount}</p>
                  <p className="text-sm text-red-600">Action Required</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Accordion Sections */}
        <div className="space-y-4">
          {/* 1. Pesanan Masuk Baru */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('newOrders')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedSections.newOrders ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  <Package className="h-5 w-5 text-blue-600" />
                  <span>Pesanan Masuk Baru</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {newOrders.length} Pesanan
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Total Nilai: {formatCurrency(totalOrderValue)}
                </div>
              </CardTitle>
            </CardHeader>

            {expandedSections.newOrders && (
              <CardContent className="space-y-4">
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
                          <Badge className="bg-green-100 text-green-800">
                            Auto-assigned: {order.autoAssigned}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Produk: <span className="font-medium">{order.productType}</span></p>
                            <p className="text-gray-600">Spesifikasi: <span className="font-medium">{order.specifications}</span></p>
                            <p className="text-gray-600">Quantity: <span className="font-medium">{order.quantity}</span></p>
                            <p className="text-gray-600">Contact: <span className="font-medium">{order.contactPerson}</span></p>
                          </div>
                          <div>
                            <p className="text-gray-600">Nilai: <span className="font-semibold text-green-600">{formatCurrency(order.estimatedValue)}</span></p>
                            <p className="text-gray-600">Deadline: <span className="font-medium">{order.deliveryDeadline}</span></p>
                            <p className="text-gray-600">Sales: <span className="font-medium">{order.salesPerson}</span></p>
                            <p className="text-gray-600">Est. Start: <span className="font-medium">{order.estimatedStartDate}</span></p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Eye className="w-4 h-4 mr-2" />
                          Review
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
                      <p className="text-gray-700"><strong>Requirements:</strong> {order.specialRequirements}</p>
                      <p className="text-xs text-gray-500 mt-2">Diterima: {order.receivedAt}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          {/* 2. Proses Produksi */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('productionProcess')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedSections.productionProcess ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  <RefreshCw className="h-5 w-5 text-green-600" />
                  <span>Proses Produksi</span>
                  <Badge className="bg-green-100 text-green-800">
                    {activeProduction} Work Orders
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Aktif dalam produksi
                </div>
              </CardTitle>
            </CardHeader>

            {expandedSections.productionProcess && (
              <CardContent className="space-y-4">
                {productionProcess.map((wo) => (
                  <div key={wo.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{wo.id}</h4>
                          <Badge className="bg-blue-100 text-blue-800">{wo.customerName}</Badge>
                          <Badge className={getOrderPriorityColor(wo.priority)}>
                            {wo.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Produk: <span className="font-medium">{wo.productType}</span></p>
                            <p className="text-gray-600">Spesifikasi: <span className="font-medium">{wo.specifications}</span></p>
                            <p className="text-gray-600">Quantity: <span className="font-medium">{wo.quantity}</span></p>
                            <p className="text-gray-600">Team: <span className="font-medium">{wo.assignedTeam}</span></p>
                          </div>
                          <div>
                            <p className="text-gray-600">Progress: <span className="font-semibold text-green-600">{wo.progress}%</span></p>
                            <p className="text-gray-600">Start: <span className="font-medium">{wo.startDate}</span></p>
                            <p className="text-gray-600">Est. Completion: <span className="font-medium">{wo.estimatedCompletion}</span></p>
                            <p className="text-gray-600">Current Stage: <span className="font-medium capitalize">{wo.currentStage.replace('_', ' ')}</span></p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Detail
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{wo.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${wo.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="bg-gray-50 p-3 rounded">
                      <h5 className="font-medium text-gray-900 mb-2">Production Milestones:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {wo.milestones.map((milestone, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <Badge className={getStageColor(milestone.status)}>
                              {milestone.stage.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <span className="text-gray-600">{milestone.department}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Issues */}
                    {wo.issues.length > 0 && (
                      <div className="bg-orange-50 p-3 rounded mt-3">
                        <h5 className="font-medium text-orange-900 mb-2">Issues:</h5>
                        {wo.issues.map((issue, index) => (
                          <div key={index} className="text-sm text-orange-800">
                            <p><strong>{issue.type.toUpperCase()}:</strong> {issue.description}</p>
                            {issue.resolvedAt && (
                              <p className="text-xs text-orange-600">Resolved: {issue.resolvedAt}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          {/* 3. Status Notifikasi */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('notificationStatus')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedSections.notificationStatus ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  <Bell className="h-5 w-5 text-purple-600" />
                  <span>Status Notifikasi</span>
                  <Badge className="bg-purple-100 text-purple-800">
                    {notificationHistory.length} Total
                  </Badge>
                  {unreadCount > 0 && (
                    <Badge className="bg-red-100 text-red-800">
                      {unreadCount} Unread
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {actionRequiredCount} perlu tindakan
                </div>
              </CardTitle>
            </CardHeader>

            {expandedSections.notificationStatus && (
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cari notifikasi..."
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                {notificationHistory.map((notification) => (
                  <div key={notification.id} className={`p-4 border rounded-lg ${notification.status === 'unread' ? 'bg-blue-50 border-blue-200' : 'bg-white'} hover:shadow-md transition-shadow`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getNotificationTypeColor(notification.type)}>
                            {notification.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getOrderPriorityColor(notification.priority)}>
                            {notification.priority.toUpperCase()}
                          </Badge>
                          {notification.status === 'unread' && (
                            <Badge className="bg-blue-100 text-blue-800">
                              UNREAD
                            </Badge>
                          )}
                          {notification.actionRequired && (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              ACTION REQUIRED
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{notification.title}</h4>
                        <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {notification.timestamp}
                          </span>
                          <span>ID: {notification.relatedId}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {notification.actionRequired && (
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Action
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          {/* 4. Analytics Summary */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('analytics')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedSections.analytics ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <span>Summary & Analytics</span>
                </div>
                <div className="text-sm text-gray-600">
                  Performance insights
                </div>
              </CardTitle>
            </CardHeader>

            {expandedSections.analytics && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-900">Order Pipeline</h3>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalOrderValue)}</p>
                    <p className="text-sm text-blue-700">{newOrders.length} pesanan baru</p>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <RefreshCw className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-900">Production Status</h3>
                    <p className="text-2xl font-bold text-green-900">{activeProduction}</p>
                    <p className="text-sm text-green-700">Work orders aktif</p>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Bell className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-purple-900">Notifications</h3>
                    <p className="text-2xl font-bold text-purple-900">{unreadCount}</p>
                    <p className="text-sm text-purple-700">Belum dibaca</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}