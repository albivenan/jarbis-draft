import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  CreditCard,
  Download,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Building,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';

export default function SlipGaji() {
  const { auth } = usePage().props as any;
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2025-01-W4');
  const [periodType, setPeriodType] = useState<'weekly' | 'monthly'>('weekly');
  const [showAppealDialog, setShowAppealDialog] = useState(false);
  const [appealReason, setAppealReason] = useState('');
  const [pendingAppeals, setPendingAppeals] = useState<any[]>([
    {
      id: 1,
      period: '2025-01-W3',
      reason: 'Jam kerja tidak sesuai. Saya bekerja 7 jam pada tanggal 15 Januari tapi tercatat 0 jam karena sistem error.',
      status: 'pending',
      submittedAt: '2025-01-20T10:30:00Z'
    }
  ]);

  const employeeInfo = {
    employeeId: auth?.user?.employee_id || 'CREW-001',
    fullName: auth?.user?.name || 'Ahmad Crew',
    position: 'Crew',
    department: auth?.user?.role?.includes('besi') ? 'Produksi Besi' : 'Produksi Kayu',
    joinDate: '2024-01-15',
    bankAccount: 'BCA - 1234567890',
    npwp: '12.345.678.9-012.000',
    hourlyRate: 15000 // Rp 15.000/jam
  };

  const salaryPeriods = {
    weekly: [
      { value: '2025-01-W4', label: 'Minggu ke-4 Januari 2025' },
      { value: '2025-01-W3', label: 'Minggu ke-3 Januari 2025' },
      { value: '2025-01-W2', label: 'Minggu ke-2 Januari 2025' },
      { value: '2025-01-W1', label: 'Minggu ke-1 Januari 2025' },
      { value: '2024-12-W4', label: 'Minggu ke-4 Desember 2024' },
      { value: '2024-12-W3', label: 'Minggu ke-3 Desember 2024' }
    ],
    monthly: [
      { value: '2025-01', label: 'Januari 2025' },
      { value: '2024-12', label: 'Desember 2024' },
      { value: '2024-11', label: 'November 2024' },
      { value: '2024-10', label: 'Oktober 2024' }
    ]
  };

  // Generate salary data based on attendance system
  const generateSalaryData = () => {
    const hourlyRate = employeeInfo.hourlyRate;

    return {
      '2025-01-W4': {
        period: 'Minggu ke-4 Januari 2025',
        payDate: '2025-01-26',
        workingDays: 6,
        attendanceDays: 6,
        workingHours: 42, // 6 days * 7 hours
        overtimeHours: 4, // dari pengajuan lembur
        attendanceRate: 100,
        earnings: {
          basicPay: 42 * hourlyRate, // 630,000
          overtimePay: 4 * hourlyRate * 1.5, // 90,000
          attendanceBonus: 50000, // bonus kehadiran 100%
          mealAllowance: 6 * 25000, // 150,000
          transportAllowance: 6 * 20000 // 120,000
        },
        deductions: {
          bpjsKesehatan: 25000, // 2% dari gaji pokok
          bpjsKetenagakerjaan: 12500, // 1% dari gaji pokok
          incomeTax: 0, // di bawah PTKP
          lateDeduction: 0
        },
        summary: {
          totalEarnings: 1040000,
          totalDeductions: 37500,
          netSalary: 1002500
        },
        attendanceDetail: [
          { date: '2025-01-20', checkIn: '17:00', checkOut: '00:00', hours: 7, status: 'hadir' },
          { date: '2025-01-21', checkIn: '17:05', checkOut: '00:15', hours: 7.17, status: 'terlambat' },
          { date: '2025-01-22', checkIn: '17:00', checkOut: '00:00', hours: 7, status: 'hadir' },
          { date: '2025-01-23', checkIn: '17:00', checkOut: '02:00', hours: 9, status: 'hadir', overtime: 2 },
          { date: '2025-01-24', checkIn: '17:00', checkOut: '00:00', hours: 7, status: 'hadir' },
          { date: '2025-01-25', checkIn: '17:00', checkOut: '02:00', hours: 9, status: 'hadir', overtime: 2 }
        ]
      },
      '2025-01-W3': {
        period: 'Minggu ke-3 Januari 2025',
        payDate: '2025-01-19',
        workingDays: 6,
        attendanceDays: 5,
        workingHours: 35,
        overtimeHours: 0,
        attendanceRate: 83.3,
        earnings: {
          basicPay: 35 * hourlyRate, // 525,000
          overtimePay: 0,
          attendanceBonus: 0, // tidak dapat bonus karena ada 1 hari tidak masuk
          mealAllowance: 5 * 25000, // 125,000
          transportAllowance: 5 * 20000 // 100,000
        },
        deductions: {
          bpjsKesehatan: 25000,
          bpjsKetenagakerjaan: 12500,
          incomeTax: 0,
          lateDeduction: 0
        },
        summary: {
          totalEarnings: 750000,
          totalDeductions: 37500,
          netSalary: 712500
        },
        attendanceDetail: [
          { date: '2025-01-13', checkIn: '17:00', checkOut: '00:00', hours: 7, status: 'hadir' },
          { date: '2025-01-14', checkIn: '-', checkOut: '-', hours: 0, status: 'izin' },
          { date: '2025-01-15', checkIn: '17:00', checkOut: '00:00', hours: 7, status: 'hadir' },
          { date: '2025-01-16', checkIn: '17:00', checkOut: '00:00', hours: 7, status: 'hadir' },
          { date: '2025-01-17', checkIn: '17:00', checkOut: '00:00', hours: 7, status: 'hadir' },
          { date: '2025-01-18', checkIn: '17:00', checkOut: '00:00', hours: 7, status: 'hadir' }
        ]
      },
      '2025-01': {
        period: 'Januari 2025',
        payDate: '2025-01-31',
        workingDays: 26, // 26 hari kerja dalam bulan
        attendanceDays: 24,
        workingHours: 168, // total jam kerja
        overtimeHours: 8,
        attendanceRate: 92.3,
        earnings: {
          basicPay: 168 * hourlyRate, // 2,520,000
          overtimePay: 8 * hourlyRate * 1.5, // 180,000
          attendanceBonus: 100000, // bonus kehadiran > 90%
          mealAllowance: 24 * 25000, // 600,000
          transportAllowance: 24 * 20000 // 480,000
        },
        deductions: {
          bpjsKesehatan: 100000, // 4% dari gaji pokok bulanan
          bpjsKetenagakerjaan: 50000, // 2% dari gaji pokok bulanan
          incomeTax: 50000, // PPh 21
          lateDeduction: 0
        },
        summary: {
          totalEarnings: 3880000,
          totalDeductions: 200000,
          netSalary: 3680000
        }
      }
    };
  };

  const salaryData = generateSalaryData();

  const currentSalary = salaryData[selectedPeriod as keyof typeof salaryData] || salaryData['2025-01'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateYearToDate = () => {
    const currentYear = selectedPeriod.split('-')[0];
    const yearPeriods = Object.keys(salaryData).filter(period => period.startsWith(currentYear));

    let totalEarnings = 0;
    let totalDeductions = 0;
    let totalNet = 0;

    yearPeriods.forEach(period => {
      const data = salaryData[period as keyof typeof salaryData];
      if (data) {
        totalEarnings += data.summary.totalEarnings;
        totalDeductions += data.summary.totalDeductions;
        totalNet += data.summary.netSalary;
      }
    });

    return { totalEarnings, totalDeductions, totalNet, periods: yearPeriods.length };
  };

  const ytdData = calculateYearToDate();

  const stats = [
    {
      title: `Gaji Bersih ${periodType === 'weekly' ? 'Minggu Ini' : 'Bulan Ini'}`,
      value: formatCurrency(currentSalary.summary.netSalary),
      icon: CreditCard,
      color: 'text-green-600'
    },
    {
      title: 'Jam Kerja',
      value: `${currentSalary.workingHours} jam`,
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      title: 'Tingkat Kehadiran',
      value: `${currentSalary.attendanceRate}%`,
      icon: CheckCircle,
      color: currentSalary.attendanceRate >= 95 ? 'text-green-600' : currentSalary.attendanceRate >= 85 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      title: 'Tarif per Jam',
      value: formatCurrency(employeeInfo.hourlyRate),
      icon: DollarSign,
      color: 'text-purple-600'
    }
  ];

  const handleDownloadSlip = () => {
    alert(`Mengunduh slip gaji ${currentSalary.period}...`);
  };

  const handleViewDetail = () => {
    alert(`Membuka detail slip gaji ${currentSalary.period}...`);
  };

  const handleAppeal = () => {
    if (!appealReason.trim()) {
      alert('Silakan isi alasan banding terlebih dahulu.');
      return;
    }

    // Check if appeal already exists for this period
    if (pendingAppeals.some(appeal => appeal.period === selectedPeriod)) {
      alert('Anda sudah mengajukan banding untuk periode ini.');
      return;
    }

    // Create new appeal
    const newAppeal = {
      id: Date.now(),
      employeeId: employeeInfo.employeeId,
      period: selectedPeriod,
      reason: appealReason,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    // Add to pending appeals
    setPendingAppeals(prev => [...prev, newAppeal]);

    console.log('Sending salary appeal to HRD:', newAppeal);
    alert(`Pengajuan banding gaji untuk periode ${currentSalary.period} berhasil dikirim ke HRD. Anda akan mendapat notifikasi hasil review dalam 3-5 hari kerja.`);

    setShowAppealDialog(false);
    setAppealReason('');
  };

  return (
    <AuthenticatedLayout
      title="Slip Gaji"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/supervisor-besi' },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Slip Gaji', href: '/roles/supervisor-besi/slip-gaji' }
      ]}
    >
      <Head title="Slip Gaji - Supervisor Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-8 w-8 text-green-600" />
              Slip Gaji Crew
            </h1>
            <p className="text-gray-600 mt-1">Gaji berdasarkan jam kerja dari sistem presensi</p>
          </div>
          <div className="flex gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={periodType === 'weekly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setPeriodType('weekly');
                  setSelectedPeriod('2025-01-W4');
                }}
              >
                Mingguan
              </Button>
              <Button
                variant={periodType === 'monthly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setPeriodType('monthly');
                  setSelectedPeriod('2025-01');
                }}
              >
                Bulanan
              </Button>
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                {salaryPeriods[periodType].map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => setShowAppealDialog(true)}
              className={pendingAppeals.some(appeal => appeal.period === selectedPeriod) ? 'opacity-50 cursor-not-allowed' : ''}
              disabled={pendingAppeals.some(appeal => appeal.period === selectedPeriod)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {pendingAppeals.some(appeal => appeal.period === selectedPeriod) ? 'Banding Diajukan' : 'Ajukan Banding'}
            </Button>
            <Button onClick={handleDownloadSlip} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
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
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-full bg-gray-100">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Salary Slip Detail */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="bg-blue-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Slip Gaji - {currentSalary.period}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Tanggal Pembayaran: {currentSalary.payDate}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Dibayar
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Employee Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Informasi Karyawan
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID Karyawan:</span>
                        <span className="font-medium">{employeeInfo.employeeId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nama:</span>
                        <span className="font-medium">{employeeInfo.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Posisi:</span>
                        <span className="font-medium">{employeeInfo.position}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Departemen:</span>
                        <span className="font-medium">{employeeInfo.department}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Kehadiran & Kinerja
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hari Kerja:</span>
                        <span className="font-medium">{currentSalary.workingDays} hari</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kehadiran:</span>
                        <span className="font-medium">{currentSalary.attendanceDays} hari</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lembur:</span>
                        <span className="font-medium">{currentSalary.overtimeHours} jam</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rekening:</span>
                        <span className="font-medium">{employeeInfo.bankAccount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Earnings */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Pendapatan
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Gaji Pokok ({currentSalary.workingHours} jam × {formatCurrency(employeeInfo.hourlyRate)})</span>
                        <span className="font-medium">{formatCurrency(currentSalary.earnings.basicPay)}</span>
                      </div>
                      {currentSalary.overtimeHours > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Uang Lembur ({currentSalary.overtimeHours} jam × {formatCurrency(employeeInfo.hourlyRate * 1.5)})</span>
                          <span className="font-medium">{formatCurrency(currentSalary.earnings.overtimePay)}</span>
                        </div>
                      )}
                      {currentSalary.earnings.attendanceBonus > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Bonus Kehadiran ({currentSalary.attendanceRate}%)</span>
                          <span className="font-medium">{formatCurrency(currentSalary.earnings.attendanceBonus)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Tunjangan Makan ({currentSalary.attendanceDays} hari × Rp 25.000)</span>
                        <span className="font-medium">{formatCurrency(currentSalary.earnings.mealAllowance)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tunjangan Transport ({currentSalary.attendanceDays} hari × Rp 20.000)</span>
                        <span className="font-medium">{formatCurrency(currentSalary.earnings.transportAllowance)}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Pendapatan</span>
                          <span className="text-green-600">{formatCurrency(currentSalary.summary.totalEarnings)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    Potongan
                  </h3>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      {currentSalary.deductions.incomeTax > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>PPh 21</span>
                          <span className="font-medium">{formatCurrency(currentSalary.deductions.incomeTax)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>BPJS Kesehatan (1%)</span>
                        <span className="font-medium">{formatCurrency(currentSalary.deductions.bpjsKesehatan)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>BPJS Ketenagakerjaan (2%)</span>
                        <span className="font-medium">{formatCurrency(currentSalary.deductions.bpjsKetenagakerjaan)}</span>
                      </div>
                      {currentSalary.deductions.lateDeduction > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Potongan Keterlambatan</span>
                          <span className="font-medium">{formatCurrency(currentSalary.deductions.lateDeduction)}</span>
                        </div>
                      )}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Potongan</span>
                          <span className="text-red-600">{formatCurrency(currentSalary.summary.totalDeductions)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Salary */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Gaji Bersih (Take Home Pay)</span>
                    <span className="text-2xl font-bold text-blue-600">{formatCurrency(currentSalary.summary.netSalary)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Dibayarkan ke rekening {employeeInfo.bankAccount} pada {currentSalary.payDate}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Detail */}
            {currentSalary.attendanceDetail && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Detail Kehadiran - {currentSalary.period}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Tanggal</th>
                          <th className="text-left py-2">Masuk</th>
                          <th className="text-left py-2">Keluar</th>
                          <th className="text-left py-2">Jam Kerja</th>
                          <th className="text-left py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentSalary.attendanceDetail.map((day: any, index: number) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-2 font-medium">
                              {new Date(day.date).toLocaleDateString('id-ID', { 
                                weekday: 'short', 
                                day: '2-digit', 
                                month: 'short' 
                              })}
                            </td>
                            <td className="py-2">{day.checkIn}</td>
                            <td className="py-2">{day.checkOut}</td>
                            <td className="py-2">
                              <div className="flex items-center gap-1">
                                <span>{day.hours} jam</span>
                                {day.overtime && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{day.overtime}h lembur
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="py-2">
                              <Badge 
                                className={
                                  day.status === 'hadir' ? 'bg-green-100 text-green-800' :
                                  day.status === 'terlambat' ? 'bg-yellow-100 text-yellow-800' :
                                  day.status === 'izin' ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'
                                }
                              >
                                {day.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {currentSalary.attendanceDetail.filter((d: any) => d.status === 'hadir').length}
                      </div>
                      <div className="text-xs text-gray-600">Hadir</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-yellow-600">
                        {currentSalary.attendanceDetail.filter((d: any) => d.status === 'terlambat').length}
                      </div>
                      <div className="text-xs text-gray-600">Terlambat</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {currentSalary.attendanceDetail.filter((d: any) => d.status === 'izin').length}
                      </div>
                      <div className="text-xs text-gray-600">Izin</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-red-600">
                        {currentSalary.attendanceDetail.filter((d: any) => d.status === 'alpha').length}
                      </div>
                      <div className="text-xs text-gray-600">Alpha</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Appeals Notification */}
            {pendingAppeals.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-5 w-5" />
                    Banding Pending ({pendingAppeals.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingAppeals.map((appeal) => (
                    <div key={appeal.id} className="bg-white p-3 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">{appeal.period}</span>
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                          {appeal.status === 'pending' ? 'Menunggu Review' : 'Sedang Direview'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{appeal.reason}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Diajukan: {new Date(appeal.submittedAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  ))}
                  <div className="text-xs text-yellow-700 bg-yellow-100 p-2 rounded">
                    💡 HRD akan meninjau banding Anda dalam 3-5 hari kerja
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Year to Date Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Ringkasan Tahun Berjalan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Gaji Bersih YTD</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(ytdData.totalNet)}</p>
                  <p className="text-xs text-gray-500">{ytdData.periods} bulan</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Pendapatan:</span>
                    <span className="font-medium text-green-600">{formatCurrency(ytdData.totalEarnings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Potongan:</span>
                    <span className="font-medium text-red-600">{formatCurrency(ytdData.totalDeductions)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Rata-rata per Bulan:</span>
                    <span className="font-bold">{formatCurrency(ytdData.totalNet / ytdData.periods)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tax Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informasi Pajak
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="text-gray-600 mb-1">NPWP:</p>
                  <p className="font-medium">{employeeInfo.npwp}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600 mb-1">PPh 21 Bulan Ini:</p>
                  <p className="font-medium">{formatCurrency(currentSalary.deductions.incomeTax)}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600 mb-1">PPh 21 YTD:</p>
                  <p className="font-medium">{formatCurrency(ytdData.totalDeductions * 0.3)}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Bukti Potong
                </Button>
              </CardContent>
            </Card>

            {/* Salary Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Perbandingan Periode
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const periods = Object.keys(salaryData);
                  const currentIndex = periods.indexOf(selectedPeriod);
                  const previousPeriod = periods[currentIndex + 1];
                  
                  if (!previousPeriod) {
                    return (
                      <div className="text-center py-4 text-gray-500">
                        <p className="text-sm">Tidak ada data periode sebelumnya</p>
                      </div>
                    );
                  }
                  
                  const prevData = salaryData[previousPeriod as keyof typeof salaryData];
                  const currentNet = currentSalary.summary.netSalary;
                  const prevNet = prevData.summary.netSalary;
                  const difference = currentNet - prevNet;
                  const percentChange = ((difference / prevNet) * 100);
                  
                  return (
                    <div className="space-y-3">
                      <div className="text-sm">
                        <p className="text-gray-600 mb-1">Periode Sebelumnya:</p>
                        <p className="font-medium">{prevData.period}</p>
                        <p className="text-gray-600">{formatCurrency(prevNet)}</p>
                      </div>
                      
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Selisih:</span>
                          <div className="text-right">
                            <div className={`font-medium ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {difference >= 0 ? '+' : ''}{formatCurrency(difference)}
                            </div>
                            <div className={`text-xs ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {difference >= 0 ? '+' : ''}{percentChange.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-gray-600">Jam Kerja:</span>
                            <div className="font-medium">
                              {currentSalary.workingHours} vs {prevData.workingHours}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Kehadiran:</span>
                            <div className="font-medium">
                              {currentSalary.attendanceRate}% vs {prevData.attendanceRate}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={handleViewDetail}>
                  <Eye className="w-4 h-4 mr-2" />
                  Lihat Detail
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleDownloadSlip}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Riwayat Gaji
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Building className="w-4 h-4 mr-2" />
                  Info Benefit
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Appeal Dialog */}
        <Dialog open={showAppealDialog} onOpenChange={setShowAppealDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajukan Banding Gaji</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Periode: <span className="font-medium">{currentSalary.period}</span>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Gaji Saat Ini: <span className="font-medium">{formatCurrency(currentSalary.summary.netSalary)}</span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Alasan Banding</label>
                <textarea
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  rows={4}
                  placeholder="Jelaskan alasan mengapa Anda mengajukan banding gaji (misal: jam kerja tidak sesuai, lembur tidak terhitung, dll)..."
                />
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Catatan:</p>
                    <p>Pengajuan banding akan direview oleh HRD dalam 3-5 hari kerja. Pastikan alasan yang Anda berikan jelas dan dapat diverifikasi.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAppealDialog(false)}>
                  Batal
                </Button>
                <Button onClick={handleAppeal} className="bg-blue-600 hover:bg-blue-700">
                  Kirim Banding
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}