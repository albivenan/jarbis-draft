import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  TrendingUp,
  Calendar,
  User,
  Search,
  Building,
  BarChart3
} from 'lucide-react';

interface BudgetRequest {
  id: string;
  title: string;
  department: string;
  requestedBy: string;
  amount: number;
  category: 'operational' | 'capital' | 'marketing' | 'hr' | 'maintenance';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected' | 'revision';
  submittedDate: string;
  requestedPeriod: string;
  description: string;
  justification: string;
  expectedBenefit: string;
  currentBudgetUsage: number;
  budgetLimit: number;
  attachments?: string[];
}

export default function PersetujuanAnggaran() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const budgetRequests: BudgetRequest[] = [
    {
      id: 'BUD-001',
      title: 'Pembelian Mesin CNC Baru',
      department: 'Produksi Besi',
      requestedBy: 'Ahmad Yusuf',
      amount: 850000000,
      category: 'capital',
      priority: 'high',
      status: 'pending',
      submittedDate: '2024-01-10',
      requestedPeriod: 'Q1 2024',
      description: 'Pembelian 2 unit mesin CNC untuk meningkatkan kapasitas produksi dan presisi cutting',
      justification: 'Mesin lama sudah berusia 8 tahun dan sering breakdown. Efisiensi produksi menurun 25%',
      expectedBenefit: 'Peningkatan kapasitas 40%, pengurangan waste 15%, peningkatan kualitas produk',
      currentBudgetUsage: 65,
      budgetLimit: 1200000000,
      attachments: ['quotation-cnc.pdf', 'comparison-analysis.xlsx', 'roi-calculation.pdf']
    },
    {
      id: 'BUD-002',
      title: 'Kampanye Marketing Digital',
      department: 'Marketing',
      requestedBy: 'Sari Dewi',
      amount: 150000000,
      category: 'marketing',
      priority: 'medium',
      status: 'pending',
      submittedDate: '2024-01-12',
      requestedPeriod: 'Q1-Q2 2024',
      description: 'Budget untuk kampanye digital marketing, social media ads, dan website development',
      justification: 'Kompetitor meningkatkan presence digital. Market share turun 8% dalam 6 bulan terakhir',
      expectedBenefit: 'Peningkatan brand awareness 30%, lead generation 50%, market share recovery',
      currentBudgetUsage: 45,
      budgetLimit: 300000000,
      attachments: ['marketing-strategy.pdf', 'competitor-analysis.pdf']
    },
    {
      id: 'BUD-003',
      title: 'Training & Development Program',
      department: 'HRD',
      requestedBy: 'Budi Santoso',
      amount: 75000000,
      category: 'hr',
      priority: 'medium',
      status: 'approved',
      submittedDate: '2024-01-08',
      requestedPeriod: 'Q1 2024',
      description: 'Program pelatihan teknis untuk operator dan supervisor, sertifikasi ISO',
      justification: 'Skill gap analysis menunjukkan 40% karyawan perlu upskilling untuk standar industri 4.0',
      expectedBenefit: 'Peningkatan produktivitas 20%, pengurangan error rate 30%, employee retention',
      currentBudgetUsage: 30,
      budgetLimit: 200000000,
      attachments: ['training-curriculum.pdf', 'skill-gap-analysis.xlsx']
    },
    {
      id: 'BUD-004',
      title: 'Maintenance Preventif Tahunan',
      department: 'Maintenance',
      requestedBy: 'Eko Prasetyo',
      amount: 200000000,
      category: 'maintenance',
      priority: 'high',
      status: 'revision',
      submittedDate: '2024-01-05',
      requestedPeriod: 'Q1-Q4 2024',
      description: 'Budget maintenance preventif untuk semua mesin produksi, spare parts, dan overhaul',
      justification: 'Downtime mesin meningkat 35% tahun lalu. Biaya reactive maintenance 3x lebih mahal',
      expectedBenefit: 'Pengurangan downtime 50%, penghematan biaya maintenance 25%, extend equipment life',
      currentBudgetUsage: 80,
      budgetLimit: 250000000,
      attachments: ['maintenance-schedule.pdf', 'cost-analysis.xlsx']
    },
    {
      id: 'BUD-005',
      title: 'Upgrade Sistem IT & Security',
      department: 'IT',
      requestedBy: 'Dian Sari',
      amount: 120000000,
      category: 'operational',
      priority: 'high',
      status: 'pending',
      submittedDate: '2024-01-15',
      requestedPeriod: 'Q1 2024',
      description: 'Upgrade server, implementasi cybersecurity, backup system, dan software licenses',
      justification: 'Sistem current sudah outdated, vulnerability tinggi, compliance requirement',
      expectedBenefit: 'Peningkatan security 90%, system reliability 95%, compliance achievement',
      currentBudgetUsage: 55,
      budgetLimit: 180000000,
      attachments: ['it-assessment.pdf', 'security-audit.pdf', 'upgrade-plan.pdf']
    }
  ];

  const departments = ['all', 'Produksi Besi', 'Produksi Kayu', 'Marketing', 'HRD', 'IT', 'Maintenance', 'PPIC', 'Keuangan'];
  const statuses = ['all', 'pending', 'approved', 'rejected', 'revision'];
  const categories = ['all', 'operational', 'capital', 'marketing', 'hr', 'maintenance'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'revision': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'operational': return 'bg-blue-100 text-blue-800';
      case 'capital': return 'bg-purple-100 text-purple-800';
      case 'marketing': return 'bg-green-100 text-green-800';
      case 'hr': return 'bg-orange-100 text-orange-800';
      case 'maintenance': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'revision': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu Persetujuan';
      case 'approved': return 'Disetujui';
      case 'rejected': return 'Ditolak';
      case 'revision': return 'Perlu Revisi';
      default: return status;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'operational': return 'Operasional';
      case 'capital': return 'Modal';
      case 'marketing': return 'Marketing';
      case 'hr': return 'SDM';
      case 'maintenance': return 'Maintenance';
      default: return category;
    }
  };

  const filteredRequests = budgetRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    const matchesDepartment = selectedDepartment === 'all' || request.department === selectedDepartment;
    const matchesCategory = selectedCategory === 'all' || request.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesDepartment && matchesCategory;
  });

  const budgetSummary = {
    total: budgetRequests.length,
    pending: budgetRequests.filter(r => r.status === 'pending').length,
    approved: budgetRequests.filter(r => r.status === 'approved').length,
    rejected: budgetRequests.filter(r => r.status === 'rejected').length,
    revision: budgetRequests.filter(r => r.status === 'revision').length,
    totalAmount: budgetRequests.reduce((sum, r) => sum + r.amount, 0),
    pendingAmount: budgetRequests.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0),
    approvedAmount: budgetRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.amount, 0)
  };

  const handleApprove = (budgetId: string) => {
    console.log('Approving budget:', budgetId);
  };

  const handleReject = (budgetId: string) => {
    console.log('Rejecting budget:', budgetId);
  };

  const handleRequestRevision = (budgetId: string) => {
    console.log('Requesting revision for budget:', budgetId);
  };

  return (
    <AuthenticatedLayout
      title="Persetujuan Anggaran"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/direktur' },
        { title: 'Persetujuan Final', href: '#' },
        { title: 'Persetujuan Anggaran', href: '/roles/direktur/persetujuan/anggaran' }
      ]}
    >
      <Head title="Persetujuan Anggaran - Direktur" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              Persetujuan Anggaran
            </h1>
            <p className="text-gray-600 mt-1">Review dan setujui permintaan anggaran dari berbagai departemen</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Permintaan</p>
                  <p className="text-2xl font-bold text-gray-900">{budgetSummary.total}</p>
                  <p className="text-sm text-blue-600">Total: {formatCurrency(budgetSummary.totalAmount)}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Menunggu Persetujuan</p>
                  <p className="text-2xl font-bold text-orange-900">{budgetSummary.pending}</p>
                  <p className="text-sm text-orange-600">{formatCurrency(budgetSummary.pendingAmount)}</p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disetujui</p>
                  <p className="text-2xl font-bold text-green-900">{budgetSummary.approved}</p>
                  <p className="text-sm text-green-600">{formatCurrency(budgetSummary.approvedAmount)}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Perlu Revisi</p>
                  <p className="text-2xl font-bold text-yellow-900">{budgetSummary.revision}</p>
                  <p className="text-sm text-red-600">Ditolak: {budgetSummary.rejected}</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari berdasarkan judul, departemen, atau pemohon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Semua Status' : getStatusText(status)}
                  </option>
                ))}
              </select>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'Semua Departemen' : dept}
                  </option>
                ))}
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Semua Kategori' : getCategoryText(category)}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Budget Requests */}
        <div className="grid gap-6">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{request.title}</h3>
                      <Badge className={getPriorityColor(request.priority)}>
                        {request.priority === 'high' ? 'Tinggi' : 
                         request.priority === 'medium' ? 'Sedang' : 'Rendah'}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          <span>{getStatusText(request.status)}</span>
                        </div>
                      </Badge>
                      <Badge className={getCategoryColor(request.category)}>
                        {getCategoryText(request.category)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <p><span className="font-medium">ID:</span> {request.id}</p>
                        <p><span className="font-medium">Departemen:</span> {request.department}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Pemohon:</span> {request.requestedBy}</p>
                        <p><span className="font-medium">Periode:</span> {request.requestedPeriod}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Jumlah:</span> <span className="font-bold text-green-600">{formatCurrency(request.amount)}</span></p>
                        <p><span className="font-medium">Budget Limit:</span> {formatCurrency(request.budgetLimit)}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Usage:</span> {request.currentBudgetUsage}%</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${request.currentBudgetUsage > 80 ? 'bg-red-500' : request.currentBudgetUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(request.currentBudgetUsage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Deskripsi:</h4>
                        <p className="text-gray-700 text-sm">{request.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Justifikasi:</h4>
                        <p className="text-gray-700 text-sm">{request.justification}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Expected Benefit:</h4>
                        <p className="text-gray-700 text-sm">{request.expectedBenefit}</p>
                      </div>
                    </div>

                    {request.attachments && request.attachments.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          Attachments ({request.attachments.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {request.attachments.map((attachment, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {attachment}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      Submitted: {request.submittedDate}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-6">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Detail
                    </Button>
                    
                    {request.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(request.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Setujui
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                          onClick={() => handleRequestRevision(request.id)}
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Revisi
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Tolak
                        </Button>
                      </>
                    )}
                    
                    {request.status === 'revision' && (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(request.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Setujui
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Tolak
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">Tidak ada permintaan anggaran yang sesuai dengan filter.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}