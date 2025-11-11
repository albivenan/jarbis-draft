import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { 
  Calendar, 
  Search, 
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  Loader2
} from 'lucide-react';

interface AttendanceReport {
  period: string;
  department: string;
  totalEmployees: number;
  workingDays: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalOvertime: number;
  attendanceRate: number;
  punctualityRate: number;
  averageWorkingHours: number;
  trends?: {
    attendanceRate: 'up' | 'down' | 'stable';
    attendanceRateChange: number;
    punctualityRate: 'up' | 'down' | 'stable';
    punctualityRateChange: number;
    totalOvertime: 'up' | 'down' | 'stable';
    totalOvertimeChange: number;
  };
}

interface DepartmentAttendance {
  department: string;
  employees: number;
  presentRate: number;
  lateRate: number;
  absentRate: number;
  overtimeHours: number;
  trend: 'up' | 'down' | 'stable';
}

interface DailyAttendance {
  date: string;
  present: number;
  late: number;
  absent: number;
  overtime: number;
  totalEmployees: number;
}

interface Department {
  id_departemen: number;
  nama_departemen: string;
}

export default function LaporanKehadiran() {
  const [selectedPeriod, setSelectedPeriod] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | undefined>(undefined);
  const [viewType, setViewType] = useState<'summary' | 'department' | 'daily'>('summary');

  const [summaryReport, setSummaryReport] = useState<AttendanceReport | null>(null);
  const [departmentReports, setDepartmentReports] = useState<DepartmentAttendance[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyAttendance[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [departmentSortColumn, setDepartmentSortColumn] = useState<string | null>(null);
  const [departmentSortDirection, setDepartmentSortDirection] = useState<'asc' | 'desc'>('asc');

  const [dailySortColumn, setDailySortColumn] = useState<string | null>(null);
  const [dailySortDirection, setDailySortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/hrd/laporan/kehadiran', {
          params: {
            period: selectedPeriod,
            department_id: selectedDepartmentId === 'all' ? undefined : selectedDepartmentId,
          },
        });
        setSummaryReport(response.data.summary);
        setDepartmentReports(response.data.department);
        setDailyReports(response.data.daily);
      } catch (err) {
        setError('Failed to fetch attendance report.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/api/departments');
        setDepartments(response.data);
      } catch (err) {
        console.error('Failed to fetch departments', err);
      }
    };

    fetchReportData();
    fetchDepartments();
  }, [selectedPeriod, selectedDepartmentId]);

  const handleDepartmentSort = (column: string) => {
    if (departmentSortColumn === column) {
      setDepartmentSortDirection(departmentSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setDepartmentSortColumn(column);
      setDepartmentSortDirection('asc');
    }
  };

  const sortedDepartmentReports = [...departmentReports].sort((a, b) => {
    if (!departmentSortColumn) return 0;
    const aValue = (a as any)[departmentSortColumn];
    const bValue = (b as any)[departmentSortColumn];

    if (aValue < bValue) return departmentSortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return departmentSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDailySort = (column: string) => {
    if (dailySortColumn === column) {
      setDailySortDirection(dailySortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setDailySortColumn(column);
      setDailySortDirection('asc');
    }
  };

  const sortedDailyReports = [...dailyReports].sort((a, b) => {
    if (!dailySortColumn) return 0;
    const aValue = (a as any)[dailySortColumn];
    const bValue = (b as any)[dailySortColumn];

    if (aValue < bValue) return dailySortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return dailySortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Placeholder for trend calculation (needs previous period data)
  const attendanceTrend = 0; 
  const punctualityTrend = 0;

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
    }
  };

  return (
    <AuthenticatedLayout
      title="Laporan Kehadiran"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-hrd' },
        { title: 'Laporan HRD', href: '#' },
        { title: 'Laporan Kehadiran', href: '/roles/manajer-hrd/laporan/kehadiran' }
      ]}
    >
      <Head title="Laporan Kehadiran - Manajer HRD" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              Laporan Kehadiran
            </h1>
            <p className="text-gray-600 mt-1">Analisis kehadiran dan kedisiplinan karyawan</p>
          </div>
          <div className="flex gap-3">
            <div className="flex border rounded-lg">
              <button
                onClick={() => setViewType('summary')}
                className={`px-4 py-2 text-sm font-medium ${viewType === 'summary' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Ringkasan
              </button>
              <button
                onClick={() => setViewType('department')}
                className={`px-4 py-2 text-sm font-medium ${viewType === 'department' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Per Departemen
              </button>
              <button
                onClick={() => setViewType('daily')}
                className={`px-4 py-2 text-sm font-medium ${viewType === 'daily' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Harian
              </button>
            </div>
            <input
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <Select
              onValueChange={(value) => setSelectedDepartmentId(value)}
              value={selectedDepartmentId}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Departemen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Departemen</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id_departemen} value={String(dept.id_departemen)}>
                    {dept.nama_departemen}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="ml-2 text-gray-600">Memuat data...</p>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center h-64 text-red-600">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && summaryReport && (
          <>
            {viewType === 'summary' && (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Tingkat Kehadiran</p>
                          <div className="flex items-center gap-1 mt-1">
                            {summaryReport.trends?.attendanceRate === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                            {summaryReport.trends?.attendanceRate === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                            {summaryReport.trends?.attendanceRate === 'stable' && <div className="h-4 w-4 bg-gray-400 rounded-full" />}
                            <span className={`text-sm ${getTrendColor(summaryReport.trends?.attendanceRate || 'stable')}`}>
                              {summaryReport.trends?.attendanceRateChange !== undefined && summaryReport.trends.attendanceRateChange > 0 ? '+' : ''}{summaryReport.trends?.attendanceRateChange?.toFixed(1)}%
                            </span>
                          </div>
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
                          <p className="text-sm font-medium text-gray-600">Tingkat Ketepatan</p>
                          <p className="text-2xl font-bold text-gray-900">{summaryReport.punctualityRate}%</p>
                          {/* Trend calculation is separate and would compare current vs previous period, not yet implemented */}
                          <div className="flex items-center gap-1 mt-1">
                            {summaryReport.trends?.punctualityRate === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                            {summaryReport.trends?.punctualityRate === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                            {summaryReport.trends?.punctualityRate === 'stable' && <div className="h-4 w-4 bg-gray-400 rounded-full" />}
                            <span className={`text-sm ${getTrendColor(summaryReport.trends?.punctualityRate || 'stable')}`}>
                              {summaryReport.trends?.punctualityRateChange !== undefined && summaryReport.trends.punctualityRateChange > 0 ? '+' : ''}{summaryReport.trends?.punctualityRateChange?.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100">
                          <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Karyawan</p>
                          <p className="text-2xl font-bold text-gray-900">{summaryReport.totalEmployees}</p>
                          <p className="text-sm text-gray-600">{summaryReport.workingDays} hari kerja</p>
                        </div>
                        <div className="p-3 rounded-full bg-purple-100">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Rata-rata Jam Kerja</p>
                          <p className="text-2xl font-bold text-gray-900">{summaryReport.averageWorkingHours}h</p>
                          <p className="text-sm text-gray-600">{summaryReport.totalOvertime}h lembur</p>
                        </div>
                        <div className="p-3 rounded-full bg-orange-100">
                          <BarChart3 className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Statistics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Distribusi Kehadiran
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-900">Hadir</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-900">{summaryReport.totalPresent}</p>
                            <p className="text-sm text-green-700">{summaryReport.attendanceRate}%</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            <span className="font-medium text-yellow-900">Terlambat</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-yellow-900">{summaryReport.totalLate}</p>
                            <p className="text-sm text-yellow-700">
                              {((summaryReport.totalLate / (summaryReport.totalEmployees * summaryReport.workingDays)) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                            <span className="font-medium text-red-900">Tidak Hadir</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-900">{summaryReport.totalAbsent}</p>
                            <p className="text-sm text-red-700">
                              {(100 - summaryReport.attendanceRate).toFixed(1)}%
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-blue-900">Lembur</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-900">{summaryReport.totalOvertime}h</p>
                            <p className="text-sm text-blue-700">Total jam lembur</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Perbandingan Periode
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Tingkat Kehadiran</p>
                            <p className="text-sm text-gray-600">Bulan ini vs bulan lalu</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              {summaryReport.trends?.attendanceRate === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                              {summaryReport.trends?.attendanceRate === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                              {summaryReport.trends?.attendanceRate === 'stable' && <div className="h-4 w-4 bg-gray-400 rounded-full" />}
                              <span className={`text-sm ${getTrendColor(summaryReport.trends?.attendanceRate || 'stable')}`}>
                                {summaryReport.trends?.attendanceRateChange !== undefined && summaryReport.trends.attendanceRateChange > 0 ? '+' : ''}{summaryReport.trends?.attendanceRateChange?.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Tingkat Ketepatan</p>
                            <p className="text-sm text-gray-600">Bulan ini vs bulan lalu</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              {summaryReport.trends?.punctualityRate === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                              {summaryReport.trends?.punctualityRate === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                              {summaryReport.trends?.punctualityRate === 'stable' && <div className="h-4 w-4 bg-gray-400 rounded-full" />}
                              <span className={`text-sm ${getTrendColor(summaryReport.trends?.punctualityRate || 'stable')}`}>
                                {summaryReport.trends?.punctualityRateChange !== undefined && summaryReport.trends.punctualityRateChange > 0 ? '+' : ''}{summaryReport.trends?.punctualityRateChange?.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Jam Lembur</p>
                            <p className="text-sm text-gray-600">Total jam lembur</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{summaryReport.totalOvertime}h</p>
                            <div className="flex items-center gap-1">
                              {summaryReport.trends?.totalOvertime === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                              {summaryReport.trends?.totalOvertime === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                              {summaryReport.trends?.totalOvertime === 'stable' && <div className="h-4 w-4 bg-gray-400 rounded-full" />}
                              <span className={`text-sm ${getTrendColor(summaryReport.trends?.totalOvertime || 'stable')}`}>
                                {summaryReport.trends?.totalOvertimeChange !== undefined && summaryReport.trends.totalOvertimeChange > 0 ? '+' : ''}{summaryReport.trends?.totalOvertimeChange?.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </>
        )}

        {!loading && !error && departmentReports && (
          <>
            {viewType === 'department' && (
              <Card>
                <CardHeader>
                  <CardTitle>Kehadiran Per Departemen</CardTitle>
                </CardHeader>
                <CardContent>
                  {departmentReports.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleDepartmentSort('department')}>Departemen</th>
                            <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleDepartmentSort('employees')}>Karyawan</th>
                            <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleDepartmentSort('presentRate')}>Tingkat Kehadiran</th>
                            <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleDepartmentSort('lateRate')}>Tingkat Keterlambatan</th>
                            <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleDepartmentSort('absentRate')}>Tingkat Absen</th>
                            <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleDepartmentSort('overtimeHours')}>Jam Lembur</th>
                            <th className="text-left py-3 px-4">Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedDepartmentReports.map((dept, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">{dept.department}</td>
                              <td className="py-3 px-4">{dept.employees}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{dept.presentRate}%</span>
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-green-600 h-2 rounded-full" 
                                      style={{ width: `${dept.presentRate}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`font-medium ${dept.lateRate > 10 ? 'text-red-600' : dept.lateRate > 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                                  {dept.lateRate}%
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`font-medium ${dept.absentRate > 5 ? 'text-red-600' : dept.absentRate > 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                                  {dept.absentRate}%
                                </span>
                              </td>
                              <td className="py-3 px-4">{dept.overtimeHours}h</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  {getTrendIcon(dept.trend)}
                                  <span className={`text-sm ${getTrendColor(dept.trend)}`}>
                                    {dept.trend === 'up' ? 'Meningkat' : dept.trend === 'down' ? 'Menurun' : 'Stabil'}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">Tidak ada data kehadiran per departemen untuk periode ini.</p>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {!loading && !error && dailyReports && (
          <>
            {viewType === 'daily' && (
              <Card>
                <CardHeader>
                  <CardTitle>Kehadiran Harian</CardTitle>
                </CardHeader>
                <CardContent>
                  {dailyReports.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleDailySort('date')}>Tanggal</th>
                            <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleDailySort('present')}>Hadir</th>
                            <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleDailySort('late')}>Terlambat</th>
                            <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleDailySort('absent')}>Tidak Hadir</th>
                            <th className="text-left py-3 px-4 cursor-pointer" onClick={() => handleDailySort('overtime')}>Lembur</th>
                            <th className="text-left py-3 px-4">Tingkat Kehadiran</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedDailyReports.map((day, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">{day.date}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span>{day.present}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-yellow-600" />
                                  <span>{day.late}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <XCircle className="h-4 w-4 text-red-600" />
                                  <span>{day.absent}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                                  <span>{day.overtime}h</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {((day.present / day.totalEmployees) * 100).toFixed(1)}%
                                  </span>
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-green-600 h-2 rounded-full" 
                                      style={{ width: `${(day.present / day.totalEmployees) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">Tidak ada data kehadiran harian untuk periode ini.</p>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {!loading && !error && !summaryReport && !departmentReports.length && !dailyReports.length && (
          <div className="flex justify-center items-center h-64 text-gray-600">
            <Search className="h-6 w-6 mr-2" />
            <p>Tidak ada data laporan kehadiran untuk periode atau departemen yang dipilih.</p>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
