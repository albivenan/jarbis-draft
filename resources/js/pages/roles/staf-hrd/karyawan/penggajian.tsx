import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  Download,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  FileText,
  RefreshCw,
  TrendingUp,
  Clock,
  Eye
} from 'lucide-react';

interface PayrollData {
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  period: string;
  workingHours: number;
  overtimeHours: number;
  attendanceRate: number;
  hourlyRate: number;
  basicPay: number;
  overtimePay: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'approved' | 'paid';
  appealStatus?: 'none' | 'pending' | 'reviewed';
  attendanceDetail: {
    present: number;
    late: number;
    absent: number;
  };
}

interface SalaryAppeal {
  id: number;
  employeeId: string;
  employeeName: string;
  period: string;
  reason: string;
  currentSalary: number;
  requestedSalary: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export default function PenggajianStafHRD() {
  const [selectedPeriod, setSelectedPeriod] = useState('2025-01-W4');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<PayrollData | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Mock payroll data
  const generatePayrollData = (): PayrollData[] => {
    return [
      {
        employeeId: 'CREW-001',
        employeeName: 'Ahmad Yusuf',
        department: 'Produksi Besi',
        position: 'Crew',
        period: '2025-01-W4',
        workingHours: 42,
        overtimeHours: 4,
        attendanceRate: 100,
        hourlyRate: 15000,
        basicPay: 630000,
        overtimePay: 90000,
        allowances: 320000,
        deductions: 37500,
        netSalary: 1002500,
        status: 'approved',
        appealStatus: 'none',
        attendanceDetail: {
          present: 6,
          late: 0,
          absent: 0
        }
      },
      {
        employeeId: 'CREW-002',
        employeeName: 'Budi Santoso',
        department: 'Produksi Kayu',
        position: 'Crew',
        period: '2025-01-W4',
        workingHours: 35,
        overtimeHours: 0,
        attendanceRate: 83.3,
        hourlyRate: 15000,
        basicPay: 525000,
        overtimePay: 0,
        allowances: 225000,
        deductions: 37500,
        netSalary: 712500,
        status: 'paid',
        appealStatus: 'pending',
        attendanceDetail: {
          present: 5,
          late: 0,
          absent: 1
        }
      },
      {
        employeeId: 'CREW-003',
        employeeName: 'Sari Dewi',
        department: 'Produksi Besi',
        position: 'Crew',
        period: '2025-01-W4',
        workingHours: 42,
        overtimeHours: 6,
        attendanceRate: 100,
        hourlyRate: 15000,
        basicPay: 630000,
        overtimePay: 135000,
        allowances: 320000,
        deductions: 37500,
        netSalary: 1047500,
        status: 'paid',
        appealStatus: 'none',
        attendanceDetail: {
          present: 6,
          late: 0,
          absent: 0
        }
      },
      {
        employeeId: 'CREW-004',
        employeeName: 'Eko Prasetyo',
        department: 'Produksi Kayu',
        position: 'Crew',
        period: '2025-01-W4',
        workingHours: 28,
        overtimeHours: 0,
        attendanceRate: 66.7,
        hourlyRate: 15000,
        basicPay: 420000,
        overtimePay: 0,
        allowances: 180000,
        deductions: 37500,
        netSalary: 562500,
        status: 'approved',
        appealStatus: 'none',
        attendanceDetail: {
          present: 4,
          late: 0,
          absent: 2
        }
      }
    ];
  };

  // Mock salary appeals data
  const generateAppealsData = (): SalaryAppeal[] => {
    return [
      {
        id: 1,
        employeeId: 'CREW-002',
        employeeName: 'Budi Santoso',
        period: '2025-01-W3',
        reason: 'Jam kerja tidak sesuai. Saya bekerja 7 jam pada tanggal 15 Januari tapi tercatat 0 jam karena sistem error saat check-out.',
        currentSalary: 712500,
        requestedSalary: 817500,
        status: 'pending',
        submittedAt: '2025-01-20T10:30:00Z'
      }
    ];
  };

  const [payrollData] = useState<PayrollData[]>(generatePayrollData());
  const [appealsData] = useState<SalaryAppeal[]>(generateAppealsData());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'approved': return 'Disetujui';
      case 'paid': return 'Dibayar';
      default: return status;
    }
  };

  const filteredPayroll = payrollData.filter(data => {
    const matchesSearch = data.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || data.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const payrollSummary = {
    totalEmployees: filteredPayroll.length,
    totalBasicPay: filteredPayroll.reduce((sum, data) => sum + data.basicPay, 0),
    totalOvertimePay: filteredPayroll.reduce((sum, data) => sum + data.overtimePay, 0),
    totalAllowances: filteredPayroll.reduce((sum, data) => sum + data.allowances, 0),
    totalDeductions: filteredPayroll.reduce((sum, data) => sum + data.deductions, 0),
    totalNetSalary: filteredPayroll.reduce((sum, data) => sum + data.netSalary, 0),
    totalWorkingHours: filteredPayroll.reduce((sum, data) => sum + data.workingHours, 0),
    totalOvertimeHours: filteredPayroll.reduce((sum, data) => sum + data.overtimeHours, 0),
    averageAttendance: filteredPayroll.length > 0 ? filteredPayroll.reduce((sum, data) => sum + data.attendanceRate, 0) / filteredPayroll.length : 0,
    pendingAppeals: appealsData.filter(appeal => appeal.status === 'pending' || appeal.status === 'under_review').length
  };

  const handleExportPayroll = () => {
    alert('Mengexport data payroll ke Excel...');
  };

  return (
    <AuthenticatedLayout
      title="Penggajian Crew"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-hrd' },
        { title: 'Data Karyawan', href: '#' },
        { title: 'Penggajian Crew', href: '/roles/staf-hrd/karyawan/penggajian' }
      ]}
    >
      <Head title="Penggajian Crew - Staf HRD" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              Data Penggajian Crew
            </h1>
            <p className="text-gray-600 mt-1">
              Lihat data gaji crew berdasarkan jam kerja dari sistem presensi | 
              Terakhir diperbarui: {lastRefresh.toLocaleTimeString('id-ID')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setLastRefresh(new Date())}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline" onClick={handleExportPayroll}>
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{payrollSummary.totalEmployees}</div>
                <div className="text-sm text-gray-600">Total Crew</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{formatCurrency(payrollSummary.totalNetSalary)}</div>
                <div className="text-sm text-gray-600">Total Payroll</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{payrollSummary.totalWorkingHours}</div>
                <div className="text-sm text-gray-600">Total Jam Kerja</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{payrollSummary.totalOvertimeHours}</div>
                <div className="text-sm text-gray-600">Total Lembur</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{payrollSummary.averageAttendance.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Rata-rata Kehadiran</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{payrollSummary.pendingAppeals}</div>
                <div className="text-sm text-gray-600">Banding Pending</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-01-W4">Minggu ke-4 Januari 2025</SelectItem>
                    <SelectItem value="2025-01-W3">Minggu ke-3 Januari 2025</SelectItem>
                    <SelectItem value="2025-01">Januari 2025</SelectItem>
                    <SelectItem value="2024-12">Desember 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Departemen</SelectItem>
                  <SelectItem value="Produksi Besi">Produksi Besi</SelectItem>
                  <SelectItem value="Produksi Kayu">Produksi Kayu</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari berdasarkan nama atau ID karyawan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payroll">Data Penggajian</TabsTrigger>
            <TabsTrigger value="appeals">Banding Gaji ({payrollSummary.pendingAppeals})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Statistik Payroll
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Gaji Pokok:</span>
                    <span className="font-medium">{formatCurrency(payrollSummary.totalBasicPay)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Lembur:</span>
                    <span className="font-medium text-orange-600">{formatCurrency(payrollSummary.totalOvertimePay)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Tunjangan:</span>
                    <span className="font-medium text-blue-600">{formatCurrency(payrollSummary.totalAllowances)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Potongan:</span>
                    <span className="font-medium text-red-600">{formatCurrency(payrollSummary.totalDeductions)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Payroll:</span>
                    <span className="text-green-600">{formatCurrency(payrollSummary.totalNetSalary)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Produktivitas Crew
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Jam Kerja:</span>
                    <span className="font-medium">{payrollSummary.totalWorkingHours} jam</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Jam Lembur:</span>
                    <span className="font-medium text-orange-600">{payrollSummary.totalOvertimeHours} jam</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rata-rata Kehadiran:</span>
                    <span className={`font-medium ${payrollSummary.averageAttendance >= 95 ? 'text-green-600' : 
                                    payrollSummary.averageAttendance >= 85 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {payrollSummary.averageAttendance.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rata-rata Jam/Crew:</span>
                    <span className="font-medium">{(payrollSummary.totalWorkingHours / payrollSummary.totalEmployees).toFixed(1)} jam</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Status Gaji</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {filteredPayroll.filter(data => data.status === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-600">Menunggu Approval</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {filteredPayroll.filter(data => data.status === 'approved').length}
                    </div>
                    <div className="text-sm text-gray-600">Sudah Disetujui</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {filteredPayroll.filter(data => data.status === 'paid').length}
                    </div>
                    <div className="text-sm text-gray-600">Sudah Dibayar</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payroll" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Penggajian - {selectedPeriod}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Crew</th>
                        <th className="text-left py-3 px-4">Jam Kerja</th>
                        <th className="text-left py-3 px-4">Kehadiran</th>
                        <th className="text-left py-3 px-4">Gaji Pokok</th>
                        <th className="text-left py-3 px-4">Lembur</th>
                        <th className="text-left py-3 px-4">Tunjangan</th>
                        <th className="text-left py-3 px-4">Potongan</th>
                        <th className="text-left py-3 px-4">Gaji Bersih</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayroll.map((data) => (
                        <tr key={data.employeeId} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{data.employeeName}</div>
                              <div className="text-sm text-gray-600">{data.employeeId} - {data.department}</div>
                              {data.appealStatus === 'pending' && (
                                <Badge className="bg-red-100 text-red-800 text-xs mt-1">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Ada Banding
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <div className="font-medium">{data.workingHours} jam</div>
                              {data.overtimeHours > 0 && (
                                <div className="text-orange-600">+{data.overtimeHours} jam lembur</div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <Badge className={data.attendanceRate >= 95 ? 'bg-green-100 text-green-800' : 
                                              data.attendanceRate >= 85 ? 'bg-yellow-100 text-yellow-800' : 
                                              'bg-red-100 text-red-800'}>
                                {data.attendanceRate}%
                              </Badge>
                              <div className="text-xs text-gray-500 mt-1">
                                H:{data.attendanceDetail.present} T:{data.attendanceDetail.late} A:{data.attendanceDetail.absent}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium">{formatCurrency(data.basicPay)}</div>
                            <div className="text-xs text-gray-500">{data.workingHours} × {formatCurrency(data.hourlyRate)}</div>
                          </td>
                          <td className="py-3 px-4">
                            {data.overtimePay > 0 ? (
                              <div>
                                <div className="font-medium text-orange-600">{formatCurrency(data.overtimePay)}</div>
                                <div className="text-xs text-gray-500">{data.overtimeHours} × {formatCurrency(data.hourlyRate * 1.5)}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-blue-600 font-medium">{formatCurrency(data.allowances)}</td>
                          <td className="py-3 px-4 text-red-600 font-medium">{formatCurrency(data.deductions)}</td>
                          <td className="py-3 px-4 font-bold text-green-600">{formatCurrency(data.netSalary)}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(data.status)}>
                              {getStatusText(data.status)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedEmployee(data);
                                  setShowDetailDialog(true);
                                }}
                                title="Detail Gaji"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appeals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Banding Gaji Crew ({payrollSummary.pendingAppeals} Pending)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appealsData.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-500">Tidak ada banding gaji yang pending</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appealsData.map((appeal) => (
                      <div key={appeal.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{appeal.employeeName}</h4>
                            <p className="text-sm text-gray-500">{appeal.employeeId} • Periode: {appeal.period}</p>
                            <p className="text-xs text-gray-400">Diajukan: {new Date(appeal.submittedAt).toLocaleString('id-ID')}</p>
                          </div>
                          <Badge className={
                            appeal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            appeal.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                            appeal.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {appeal.status === 'pending' ? 'Pending' : 
                             appeal.status === 'under_review' ? 'Under Review' :
                             appeal.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                          </Badge>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded mb-3">
                          <p className="text-sm font-medium mb-1">Alasan Banding:</p>
                          <p className="text-sm">{appeal.reason}</p>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm mb-3">
                          <div>
                            <span className="text-gray-500">Gaji Saat Ini: </span>
                            <span className="font-medium">{formatCurrency(appeal.currentSalary)}</span>
                            <span className="text-gray-500 mx-2">→</span>
                            <span className="text-gray-500">Diminta: </span>
                            <span className="font-medium text-green-600">{formatCurrency(appeal.requestedSalary)}</span>
                            <span className="text-gray-500 ml-2">
                              (Selisih: {formatCurrency(appeal.requestedSalary - appeal.currentSalary)})
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-sm text-blue-800">
                            <AlertTriangle className="w-4 h-4 inline mr-1" />
                            Banding ini menunggu review dari Manajer HRD
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detail Gaji Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Gaji - {selectedEmployee?.employeeName}</DialogTitle>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">ID Karyawan</label>
                    <p className="text-sm text-gray-900">{selectedEmployee.employeeId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Departemen</label>
                    <p className="text-sm text-gray-900">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Periode</label>
                    <p className="text-sm text-gray-900">{selectedEmployee.period}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tingkat Kehadiran</label>
                    <p className="text-sm text-gray-900">{selectedEmployee.attendanceRate}%</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Rincian Gaji</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Gaji Pokok ({selectedEmployee.workingHours} jam × {formatCurrency(selectedEmployee.hourlyRate)}):</span>
                      <span className="font-medium">{formatCurrency(selectedEmployee.basicPay)}</span>
                    </div>
                    {selectedEmployee.overtimePay > 0 && (
                      <div className="flex justify-between">
                        <span>Lembur ({selectedEmployee.overtimeHours} jam × {formatCurrency(selectedEmployee.hourlyRate * 1.5)}):</span>
                        <span className="font-medium text-orange-600">{formatCurrency(selectedEmployee.overtimePay)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Tunjangan:</span>
                      <span className="font-medium text-blue-600">{formatCurrency(selectedEmployee.allowances)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Potongan (BPJS):</span>
                      <span className="font-medium text-red-600">-{formatCurrency(selectedEmployee.deductions)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Gaji Bersih:</span>
                      <span className="text-green-600">{formatCurrency(selectedEmployee.netSalary)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Detail Kehadiran</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">{selectedEmployee.attendanceDetail.present}</div>
                      <div className="text-sm text-gray-600">Hadir</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <div className="text-2xl font-bold text-yellow-600">{selectedEmployee.attendanceDetail.late}</div>
                      <div className="text-sm text-gray-600">Terlambat</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="text-2xl font-bold text-red-600">{selectedEmployee.attendanceDetail.absent}</div>
                      <div className="text-sm text-gray-600">Tidak Hadir</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                    Tutup
                  </Button>
                  <Button onClick={() => alert('Generating slip gaji...')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Slip Gaji
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}