import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Receipt, 
  Download,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Calculator,
  CreditCard,
  Building,
  User
} from 'lucide-react';

interface SalarySlip {
  id: string;
  month: string;
  year: number;
  period: string;
  basicSalary: number;
  allowances: {
    position: number;
    transport: number;
    meal: number;
    communication: number;
    performance: number;
  };
  overtime: {
    hours: number;
    rate: number;
    total: number;
  };
  deductions: {
    tax: number;
    bpjs: number;
    pension: number;
    loan: number;
    other: number;
  };
  grossSalary: number;
  netSalary: number;
  status: 'paid' | 'pending' | 'processing';
  paymentDate: string;
  paymentMethod: string;
}

export default function SlipGajiManajerHRD() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const salarySlips: SalarySlip[] = [
    {
      id: 'SG-2024-01',
      month: 'Januari',
      year: 2024,
      period: '01 - 31 Januari 2024',
      basicSalary: 15000000,
      allowances: {
        position: 3000000,
        transport: 1000000,
        meal: 800000,
        communication: 500000,
        performance: 2000000
      },
      overtime: {
        hours: 8,
        rate: 125000,
        total: 1000000
      },
      deductions: {
        tax: 2330000,
        bpjs: 400000,
        pension: 300000,
        loan: 0,
        other: 0
      },
      grossSalary: 23300000,
      netSalary: 20270000,
      status: 'paid',
      paymentDate: '2024-01-31',
      paymentMethod: 'Transfer Bank'
    },
    {
      id: 'SG-2023-12',
      month: 'Desember',
      year: 2023,
      period: '01 - 31 Desember 2023',
      basicSalary: 15000000,
      allowances: {
        position: 3000000,
        transport: 1000000,
        meal: 800000,
        communication: 500000,
        performance: 2500000
      },
      overtime: {
        hours: 12,
        rate: 125000,
        total: 1500000
      },
      deductions: {
        tax: 2380000,
        bpjs: 400000,
        pension: 300000,
        loan: 0,
        other: 0
      },
      grossSalary: 23800000,
      netSalary: 20720000,
      status: 'paid',
      paymentDate: '2023-12-31',
      paymentMethod: 'Transfer Bank'
    },
    {
      id: 'SG-2023-11',
      month: 'November',
      year: 2023,
      period: '01 - 30 November 2023',
      basicSalary: 15000000,
      allowances: {
        position: 3000000,
        transport: 1000000,
        meal: 800000,
        communication: 500000,
        performance: 1800000
      },
      overtime: {
        hours: 6,
        rate: 125000,
        total: 750000
      },
      deductions: {
        tax: 2265000,
        bpjs: 400000,
        pension: 300000,
        loan: 0,
        other: 0
      },
      grossSalary: 22050000,
      netSalary: 19085000,
      status: 'paid',
      paymentDate: '2023-11-30',
      paymentMethod: 'Transfer Bank'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Dibayar';
      case 'pending': return 'Menunggu';
      case 'processing': return 'Diproses';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const currentSlip = salarySlips[0];
  const previousSlip = salarySlips[1];
  const salaryTrend = currentSlip.netSalary - previousSlip.netSalary;

  const yearlyStats = {
    totalGross: salarySlips.reduce((sum, slip) => sum + slip.grossSalary, 0),
    totalNet: salarySlips.reduce((sum, slip) => sum + slip.netSalary, 0),
    totalTax: salarySlips.reduce((sum, slip) => sum + slip.deductions.tax, 0),
    averageNet: salarySlips.reduce((sum, slip) => sum + slip.netSalary, 0) / salarySlips.length
  };

  return (
    <AuthenticatedLayout
      title="Slip Gaji"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-hrd' },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Slip Gaji', href: '/roles/manajer-hrd/administrasi-pribadi/slip-gaji' }
      ]}
    >
      <Head title="Slip Gaji - Manajer HRD" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Receipt className="h-8 w-8 text-blue-600" />
              Slip Gaji
            </h1>
            <p className="text-gray-600 mt-1">Riwayat dan detail slip gaji pribadi</p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
            </select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Semua
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gaji Bulan Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentSlip.netSalary)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {salaryTrend >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${salaryTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Math.abs(salaryTrend))}
                    </span>
                  </div>
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
                  <p className="text-sm font-medium text-gray-600">Total Tahun Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(yearlyStats.totalNet)}</p>
                  <p className="text-sm text-gray-500 mt-1">Dari {salarySlips.length} bulan</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Calculator className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rata-rata Bulanan</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(yearlyStats.averageNet)}</p>
                  <p className="text-sm text-gray-500 mt-1">Net salary</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pajak</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(yearlyStats.totalTax)}</p>
                  <p className="text-sm text-gray-500 mt-1">PPh 21</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Salary Slips List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Slip Gaji</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {salarySlips.map((slip) => (
                    <div
                      key={slip.id}
                      onClick={() => setSelectedMonth(slip.id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedMonth === slip.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{slip.month} {slip.year}</h4>
                          <p className="text-sm text-gray-600">{slip.period}</p>
                        </div>
                        <Badge className={getStatusColor(slip.status)}>
                          {getStatusText(slip.status)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Net Salary</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(slip.netSalary)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Slip */}
          <div className="lg:col-span-2">
            {selectedMonth ? (
              (() => {
                const slip = salarySlips.find(s => s.id === selectedMonth) || currentSlip;
                return (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Slip Gaji {slip.month} {slip.year}</CardTitle>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Employee Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <User className="h-4 w-4 text-gray-600" />
                                <span className="font-medium">Informasi Karyawan</span>
                              </div>
                              <p className="text-sm text-gray-600">Nama: Ahmad Yusuf</p>
                              <p className="text-sm text-gray-600">NIK: HRD-001</p>
                              <p className="text-sm text-gray-600">Jabatan: Manajer HRD</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Building className="h-4 w-4 text-gray-600" />
                                <span className="font-medium">Informasi Perusahaan</span>
                              </div>
                              <p className="text-sm text-gray-600">PT. Jarvis Indonesia</p>
                              <p className="text-sm text-gray-600">Periode: {slip.period}</p>
                              <p className="text-sm text-gray-600">Tanggal Bayar: {new Date(slip.paymentDate).toLocaleDateString('id-ID')}</p>
                            </div>
                          </div>
                        </div>

                        {/* Salary Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Income */}
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              Pendapatan
                            </h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Gaji Pokok</span>
                                <span className="font-medium">{formatCurrency(slip.basicSalary)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tunjangan Jabatan</span>
                                <span className="font-medium">{formatCurrency(slip.allowances.position)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tunjangan Transport</span>
                                <span className="font-medium">{formatCurrency(slip.allowances.transport)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tunjangan Makan</span>
                                <span className="font-medium">{formatCurrency(slip.allowances.meal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tunjangan Komunikasi</span>
                                <span className="font-medium">{formatCurrency(slip.allowances.communication)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tunjangan Kinerja</span>
                                <span className="font-medium">{formatCurrency(slip.allowances.performance)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Lembur ({slip.overtime.hours} jam)</span>
                                <span className="font-medium">{formatCurrency(slip.overtime.total)}</span>
                              </div>
                              <div className="border-t pt-2 flex justify-between font-semibold">
                                <span>Total Pendapatan</span>
                                <span className="text-green-600">{formatCurrency(slip.grossSalary)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Deductions */}
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <TrendingDown className="h-4 w-4 text-red-600" />
                              Potongan
                            </h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">PPh 21</span>
                                <span className="font-medium">{formatCurrency(slip.deductions.tax)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">BPJS Kesehatan</span>
                                <span className="font-medium">{formatCurrency(slip.deductions.bpjs)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">BPJS Ketenagakerjaan</span>
                                <span className="font-medium">{formatCurrency(slip.deductions.pension)}</span>
                              </div>
                              {slip.deductions.loan > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Pinjaman</span>
                                  <span className="font-medium">{formatCurrency(slip.deductions.loan)}</span>
                                </div>
                              )}
                              {slip.deductions.other > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Lainnya</span>
                                  <span className="font-medium">{formatCurrency(slip.deductions.other)}</span>
                                </div>
                              )}
                              <div className="border-t pt-2 flex justify-between font-semibold">
                                <span>Total Potongan</span>
                                <span className="text-red-600">
                                  {formatCurrency(
                                    slip.deductions.tax + 
                                    slip.deductions.bpjs + 
                                    slip.deductions.pension + 
                                    slip.deductions.loan + 
                                    slip.deductions.other
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Net Salary */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-5 w-5 text-blue-600" />
                              <span className="text-lg font-semibold text-gray-900">Gaji Bersih</span>
                            </div>
                            <span className="text-2xl font-bold text-blue-600">{formatCurrency(slip.netSalary)}</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            Dibayar melalui {slip.paymentMethod} pada {new Date(slip.paymentDate).toLocaleDateString('id-ID')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Pilih Slip Gaji</h3>
                  <p className="text-gray-600">Pilih bulan dari daftar di sebelah kiri untuk melihat detail slip gaji</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}