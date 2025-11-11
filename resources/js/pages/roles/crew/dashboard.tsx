import { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TreePine,
  Wrench,
  Palette,
  FileText,
  TrendingUp,
  HardHat,
  Settings,
  LogOut,
  CheckCircle2,
  LayoutGrid,
  Wallet,
  FilePlus2,
  CalendarDays,
  DollarSign
} from 'lucide-react';

// Helper to get icon component from string
const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<{ className?: string }> } = {
        Calendar,
        FilePlus2,
        Wallet,
        LayoutGrid,
    };
    return icons[iconName] || Settings;
};

// Definisi tipe data dari backend
interface Jadwal {
    id_jadwal: number;
    tanggal: string;
    jam_masuk: string | null;
    jam_keluar: string | null;
    shift: string;
    status_kehadiran: string;
}

interface RoleInfo {
    name: string;
    level: number;
}

interface CrewConfig {
    name: string;
    theme: string;
    icon: React.ComponentType<{ className?: string }>;
    focus: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
}

interface AttendanceStatus {
    has_schedule: boolean;
    has_checkedin: boolean;
    has_checkedout: boolean;
    can_checkin: boolean;
    can_checkout: boolean;
}

interface PageProps {
    auth: { user: { name: string, email: string, id_karyawan: string, role: string } };
    jadwalHariIni: Jadwal | null;
    roleInfo: RoleInfo;
    flash: { success?: string, error?: string };
    attendanceStatus?: AttendanceStatus;
    presensiHariIni?: any;
    // Tambahkan props lain yang mungkin dikirim dari controller jika ada
    kpi: any;
    lastPayroll: any;
    dashboardModules: any;
    [key: string]: any;
}

// Konfigurasi crew berdasarkan role
const getCrewConfig = (role: string): CrewConfig => {
  switch (role) {
    case 'crew_kayu':
      return {
        name: 'Crew Kayu',
        theme: 'green',
        icon: TreePine,
        focus: 'produksi kayu',
        primaryColor: 'text-green-800',
        secondaryColor: 'text-green-600',
        accentColor: 'bg-green-50 border-green-200'
      };
    case 'crew_besi':
      return {
        name: 'Crew Besi',
        theme: 'slate',
        icon: HardHat,
        focus: 'produksi besi',
        primaryColor: 'text-slate-800',
        secondaryColor: 'text-slate-600',
        accentColor: 'bg-slate-50 border-slate-200'
      };
    default:
      return {
        name: 'Crew',
        theme: 'blue',
        icon: User,
        focus: 'produksi',
        primaryColor: 'text-blue-800',
        secondaryColor: 'text-blue-600',
        accentColor: 'bg-blue-50 border-blue-200'
      };
  }
};

const CrewDashboard = () => {
  const { auth, jadwalHariIni, roleInfo, flash, kpi, lastPayroll, dashboardModules, attendanceStatus: initialAttendanceStatus, presensiHariIni } = usePage<PageProps>().props;
  
  // Get crew configuration based on user role
  const crewConfig = getCrewConfig(auth.user.role);
  const IconComponent = crewConfig.icon;

  // State management for attendance
  const [attendanceStatus, setAttendanceStatus] = useState(initialAttendanceStatus || {
    has_schedule: !!jadwalHariIni,
    has_checkedin: !!presensiHariIni?.jam_masuk_actual,
    has_checkedout: !!presensiHariIni?.jam_keluar_actual,
    can_checkin: false,
    can_checkout: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Tidak dapat mengakses lokasi. Pastikan GPS aktif.');
        }
      );
    } else {
      setError('Browser tidak mendukung GPS.');
    }
  }, []);

  const handleCheckIn = async () => {
    if (!location) {
      setError('Lokasi diperlukan untuk presensi. Pastikan GPS aktif.');
      return;
    }

    if (!jadwalHariIni?.id_jadwal) {
      setError('Tidak ada jadwal kerja hari ini.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/presensi/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          id_jadwal: jadwalHariIni.id_jadwal,
          latitude: location.lat,
          longitude: location.lng,
          lokasi_presensi: `Area Kerja ${crewConfig.name}`
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update attendance status
        setAttendanceStatus(prev => ({
          ...prev,
          has_checkedin: true,
          can_checkin: false,
          can_checkout: true
        }));
      } else {
        setError(data.message || 'Check-in gagal');
      }
    } catch (error: any) {
      console.error('Check-in failed:', error);
      setError('Check-in gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/presensi/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });

      const data = await response.json();

      if (data.success) {
        // Update attendance status
        setAttendanceStatus(prev => ({
          ...prev,
          has_checkedout: true,
          can_checkout: false
        }));
      } else {
        setError(data.message || 'Check-out gagal');
      }
    } catch (error: any) {
      console.error('Check-out failed:', error);
      setError('Check-out gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'Hadir':
        return 'bg-green-100 text-green-800';
      case 'Sakit':
      case 'Izin':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cuti':
        return 'bg-blue-100 text-blue-800';
      case 'Libur':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Dashboard ${crewConfig.name}`} />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className={`text-2xl font-bold ${crewConfig.primaryColor} flex items-center space-x-2`}>
            <IconComponent className={`h-6 w-6 ${crewConfig.secondaryColor}`} />
            <span>Dashboard {crewConfig.name}</span>
          </h1>
          <p className="text-gray-600">Selamat datang, {auth.user.name}</p>
        </div>

        {/* Flash Messages */}
        {flash?.success && (
            <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
                {flash.success}
            </div>
        )}
        {flash?.error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                {flash.error}
            </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Status Kehadiran */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Hari Ini</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge className={getStatusColor(jadwalHariIni?.status_kehadiran ?? 'Belum ada')}>
                  {jadwalHariIni?.status_kehadiran ?? 'Belum ada jadwal'}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Masuk: {jadwalHariIni?.jam_masuk || '-'} | Keluar: {jadwalHariIni?.jam_keluar || '-'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* NIK Perusahaan */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NIK Perusahaan</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">{auth.user.id_karyawan}</div>
              <p className="text-xs text-muted-foreground">
                Shift: {jadwalHariIni?.shift || '-'}
              </p>
            </CardContent>
          </Card>

          {/* Last Payroll */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gaji Terakhir</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {lastPayroll ? (
                <div className="space-y-1">
                  <div className="text-lg font-medium">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(lastPayroll.total_gaji)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Periode: {lastPayroll.batch?.period || '-'}
                  </p>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Data gaji belum tersedia</div>
              )}
            </CardContent>
          </Card>

          {/* KPI Kehadiran */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">KPI Kehadiran</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {kpi ? (
                <div className="space-y-1">
                  <div className="text-lg font-medium">
                    {kpi.hasil}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Target: {kpi.kpi.target} | Periode: {new Date(kpi.periode).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Data KPI belum tersedia</div>
              )}
            </CardContent>
          </Card>

          {/* Target Produksi - Dynamic based on crew type */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Target {crewConfig.name === 'Crew Kayu' ? 'Produksi Kayu' : crewConfig.name === 'Crew Besi' ? 'Produksi Besi' : 'Produksi'}
              </CardTitle>
              {crewConfig.name === 'Crew Kayu' ? (
                <TreePine className="h-4 w-4 text-muted-foreground" />
              ) : crewConfig.name === 'Crew Besi' ? (
                <Wrench className="h-4 w-4 text-muted-foreground" />
              ) : (
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">- / -</div>
              <p className="text-xs text-muted-foreground">
                {crewConfig.name === 'Crew Besi' ? 'Target harian produksi besi' : 'Data belum tersedia'}
              </p>
            </CardContent>
          </Card>

          {/* Info Spesifik - Dynamic based on crew type */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {crewConfig.name === 'Crew Kayu' ? 'Kualitas Kayu' : crewConfig.name === 'Crew Besi' ? 'Status Peralatan' : 'Info Lain'}
              </CardTitle>
              {crewConfig.name === 'Crew Kayu' ? (
                <Palette className="h-4 w-4 text-muted-foreground" />
              ) : crewConfig.name === 'Crew Besi' ? (
                <Settings className="h-4 w-4 text-muted-foreground" />
              ) : (
                <User className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {crewConfig.name === 'Crew Besi' ? 'Normal' : '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                {crewConfig.name === 'Crew Besi' ? 'Semua peralatan berfungsi' : 'Data belum tersedia'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Aksi Cepat</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Error Display */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Attendance Button Logic */}
              {!attendanceStatus.has_schedule ? (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>Tidak ada jadwal kerja hari ini</AlertDescription>
                </Alert>
              ) : attendanceStatus.can_checkin && !attendanceStatus.has_checkedin ? (
                <Button 
                  onClick={handleCheckIn} 
                  disabled={isLoading || !location}
                  className={`w-full justify-center ${
                    crewConfig.theme === 'green' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-slate-600 hover:bg-slate-700'
                  } text-white`}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {isLoading ? 'Memproses...' : 'Hadir Sekarang'}
                </Button>
              ) : attendanceStatus.has_checkedin && !attendanceStatus.has_checkedout ? (
                <Button 
                  onClick={handleCheckOut} 
                  disabled={isLoading}
                  variant="outline"
                  className={
                    crewConfig.theme === 'green' 
                      ? 'w-full justify-center border-green-600 text-green-600 hover:bg-green-50'
                      : 'w-full justify-center border-slate-600 text-slate-600 hover:bg-slate-50'
                  }
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoading ? 'Memproses...' : 'Pulang Sekarang'}
                </Button>
              ) : attendanceStatus.has_checkedout ? (
                <Alert className={crewConfig.accentColor}>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Presensi hari ini sudah lengkap
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Presensi dapat dilakukan mulai 2 jam sebelum jam kerja
                  </AlertDescription>
                </Alert>
              )}

              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Ajukan Cuti/Izin
              </Button>
            </CardContent>
          </Card>

          <Card className={crewConfig.accentColor}>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${crewConfig.primaryColor}`}>
                <AlertTriangle className="h-5 w-5" />
                <span>
                  {crewConfig.name === 'Crew Kayu' ? 'Informasi Divisi Kayu' : 
                   crewConfig.name === 'Crew Besi' ? 'Informasi Produksi Besi' : 
                   'Informasi Penting'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {crewConfig.name === 'Crew Besi' ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Safety Check:</span>
                    <span className="text-green-600 font-medium">✓ Selesai</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Peralatan:</span>
                    <span className="text-green-600 font-medium">✓ Normal</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Material:</span>
                    <span className="text-yellow-600 font-medium">⚠ Cek Stock</span>
                  </div>
                </div>
              ) : (
                <p className={`text-sm ${crewConfig.secondaryColor}`}>
                  {crewConfig.name === 'Crew Kayu' ? 
                    'Informasi khusus divisi kayu dan pengumuman akan ditampilkan di sini.' :
                    'Informasi penting atau pengumuman akan ditampilkan di sini.'}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LayoutGrid className="h-5 w-5" />
                <span>Modul Cepat</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dashboardModules && dashboardModules.map((module: any) => {
                const Icon = getIcon(module.icon);
                return (
                  <Button key={module.id} className="w-full justify-start" variant="ghost" asChild>
                    <a href={route(module.route)}>
                      <Icon className="h-4 w-4 mr-2" />
                      {module.nama_modul}
                    </a>
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default CrewDashboard;