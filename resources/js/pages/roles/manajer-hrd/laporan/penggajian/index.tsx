import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  Download,
  Calendar,
  PieChart,
  Calculator,
  Award,
  Settings, // Added Settings icon
  Clock, // Added Clock icon
  UserCheck // Added UserCheck icon
} from 'lucide-react';

interface PayrollSummary {
  period: string;
  totalEmployees: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalDeductions: number;
  totalBenefits: number;
  totalOvertime: number;
  avgSalary: number;
  payrollCost: number;
}

interface DepartmentPayroll {
  department: string;
  employees: number;
  totalPay: number;
  avgSalary: number;
  overtimePay: number;
  benefits: number;
  percentage: number;
}

// New interface for PayrollSettings
interface PayrollSettings {
  tarif_per_jam: number;
  upah_lembur_per_jam: number;
  standar_jam_kerja: number;
  tunjangan_makan_per_hari: number;
  tunjangan_transport_per_hari: number;
  potongan_per_10_menit: number;
  periode_pembayaran: 'bulanan' | 'mingguan';
  tanggal_gajian?: number; // Optional for weekly
  hari_gajian_mingguan?: string; // Optional for monthly
}

// New interface for FixedComponent
interface FixedComponent {
  id: number; // Assuming ID from database
  nama: string;
  jenis: 'tunjangan' | 'potongan';
  tipe: 'nominal' | 'persentase';
  jumlah: number;
  keterangan: string;
  valid_from: string; // datetime string
  valid_to: string | null; // datetime string or null
}

interface PageProps {
  payrollSummary: PayrollSummary;
  departmentPayroll: DepartmentPayroll[];
  payrollSettings: PayrollSettings;
  fixedPayrollComponents: FixedComponent[]; // Added fixedPayrollComponents to PageProps
}

export default function LaporanPenggajian() {
  const { payrollSummary, departmentPayroll, payrollSettings, fixedPayrollComponents } = usePage<PageProps>().props;

  const [selectedPeriod, setSelectedPeriod] = useState(payrollSummary.period);

  useEffect(() => {
    if (selectedPeriod !== payrollSummary.period) {
      router.get(route('manajer-hrd.laporan.penggajian'), { period: selectedPeriod }, {
        preserveState: true,
        replace: true,
      });
    }
  }, [selectedPeriod]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPeriod(e.target.value);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AuthenticatedLayout
      title="Laporan Penggajian"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-hrd' },
        { title: 'Laporan HRD', href: '#' },
        { title: 'Laporan Penggajian', href: '/roles/manajer-hrd/laporan/penggajian' }
      ]}
    >
      <Head title="Laporan Penggajian - Manajer HRD" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              Laporan Penggajian
            </h1>
            <p className="text-gray-600 mt-1">Analisis komprehensif penggajian dan benefit karyawan</p>
          </div>
          <div className="flex gap-3">
            <input
              type="month"
              value={selectedPeriod}
              onChange={handlePeriodChange}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Gaji Bruto</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(payrollSummary.totalGrossPay)}</p>
                  <p className="text-sm text-blue-600">{payrollSummary.totalEmployees} karyawan</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Gaji Bersih</p>
                  <p className="text-xl font-bold text-green-900">{formatCurrency(payrollSummary.totalNetPay)}</p>
                  <p className="text-sm text-green-600">Setelah potongan</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Tunjangan</p>
                  <p className="text-xl font-bold text-purple-900">{formatCurrency(payrollSummary.totalBenefits)}</p>
                  <p className="text-sm text-purple-600">Tunjangan</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rata-rata Gaji</p>
                  <p className="text-xl font-bold text-orange-900">{formatCurrency(payrollSummary.avgSalary)}</p>
                  <p className="text-sm text-orange-600">Per karyawan</p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Payroll Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-600" />
              Pengaturan Gaji Aktif
            </CardTitle>
            <CardDescription>Ringkasan pengaturan penggajian yang berlaku untuk periode ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium text-gray-700">Upah Dasar</p>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tarif per Jam:</span>
                  <span className="font-bold">{formatCurrency(payrollSettings.tarif_per_jam)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lembur per Jam:</span>
                  <span className="font-bold">{formatCurrency(payrollSettings.upah_lembur_per_jam)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jam Kerja Standar:</span>
                  <span className="font-bold">{payrollSettings.standar_jam_kerja} Jam</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-gray-700">Aturan Kehadiran</p>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tunjangan Makan:</span>
                  <span className="font-bold">{formatCurrency(payrollSettings.tunjangan_makan_per_hari)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tunjangan Transport:</span>
                  <span className="font-bold">{formatCurrency(payrollSettings.tunjangan_transport_per_hari)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Potongan Telat (per 10 menit):</span>
                  <span className="font-bold">{formatCurrency(payrollSettings.potongan_per_10_menit)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-gray-700">Jadwal Pembayaran</p>
                <div className="flex justify-between">
                  <span className="text-gray-600">Periode:</span>
                  <span className="font-bold">{payrollSettings.periode_pembayaran === 'bulanan' ? 'Bulanan' : 'Mingguan'}</span>
                </div>
                {payrollSettings.periode_pembayaran === 'bulanan' ? (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal Gajian:</span>
                    <span className="font-bold">{payrollSettings.tanggal_gajian}</span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hari Gajian:</span>
                    <span className="font-bold">{payrollSettings.hari_gajian_mingguan}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Payroll Components */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-3">Komponen Gaji Tambahan</h4>
              {fixedPayrollComponents.length > 0 ? (
                <div className="space-y-2">
                  {fixedPayrollComponents.map((component) => (
                    <div key={component.id} className="flex justify-between items-center">
                      <span className="text-gray-600">{component.nama} ({component.jenis === 'tunjangan' ? 'Tunjangan' : 'Potongan'}):</span>
                      <span className="font-bold">
                        {component.tipe === 'nominal' ? formatCurrency(component.jumlah) : `${component.jumlah}%`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Tidak ada komponen gaji tambahan yang aktif.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Department Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Breakdown Per Departemen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Departemen</th>
                    <th className="text-left py-3 px-4">Karyawan</th>
                    <th className="text-left py-3 px-4">Total Gaji</th>
                    <th className="text-left py-3 px-4">Rata-rata</th>
                    <th className="text-left py-3 px-4">Lembur</th>
                    <th className="text-left py-3 px-4">Benefits</th>
                    <th className="text-left py-3 px-4">% dari Total</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentPayroll.map((dept, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{dept.department}</td>
                      <td className="py-3 px-4">{dept.employees}</td>
                      <td className="py-3 px-4 font-medium">{formatCurrency(dept.totalPay)}</td>
                      <td className="py-3 px-4">{formatCurrency(dept.avgSalary)}</td>
                      <td className="py-3 px-4">{formatCurrency(dept.overtimePay)}</td>
                      <td className="py-3 px-4">{formatCurrency(dept.benefits)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{dept.percentage}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${dept.percentage}%` }}
                            ></div>
                          </div>
                        </div>
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