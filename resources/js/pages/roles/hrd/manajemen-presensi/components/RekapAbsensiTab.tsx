import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RekapData {
  hadir?: number;
  terlambat?: number;
  izin?: number;
  sakit?: number;
  alpha?: number;
}

interface DailyData {
  [date: string]: RekapData;
}

export default function RekapAbsensiTab() {
  const { toast } = useToast();
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [rekap, setRekap] = useState<RekapData>({});
  const [daily, setDaily] = useState<DailyData>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchRekapData = async () => {
    setIsLoading(true);
    try {
      const url = new URL(route('api.presensi.rekap'));
      url.searchParams.set('year', year);
      url.searchParams.set('month', month);

      const response = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      });

      if (!response.ok) throw new Error('Network response was not ok.');

      const result = await response.json();
      if (result.success) {
        setRekap(result.data.rekap || {});
        setDaily(result.data.daily || {});
      } else {
        toast({ title: 'Gagal Memuat Data Rekap', description: result.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Tidak dapat terhubung ke server.', variant: 'destructive' });
      console.error("Failed to fetch rekap data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRekapData();
  }, [year, month]);

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), name: new Date(0, i).toLocaleString('id-ID', { month: 'long' }) }));

  const renderCalendar = () => {
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    const firstDayOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1).getDay();
    const calendarDays = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="border rounded-md p-2 bg-gray-50"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${month.padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = daily[dateStr];

      calendarDays.push(
        <div key={day} className="border rounded-md p-2 min-h-[100px]">
          <div className="font-bold text-sm">{day}</div>
          {dayData && (
            <div className="text-xs mt-1 space-y-1">
              {dayData.hadir && <div className="flex items-center gap-1 text-green-600"><Check size={14} /> Hadir: {dayData.hadir}</div>}
              {dayData.terlambat && <div className="flex items-center gap-1 text-yellow-600"><Clock size={14} /> Telat: {dayData.terlambat}</div>}
              {dayData.alpha && <div className="flex items-center gap-1 text-red-600"><X size={14} /> Alpha: {dayData.alpha}</div>}
              {dayData.izin && <div className="flex items-center gap-1 text-blue-600"><AlertTriangle size={14} /> Izin: {dayData.izin}</div>}
              {dayData.sakit && <div className="flex items-center gap-1 text-purple-600"><AlertTriangle size={14} /> Sakit: {dayData.sakit}</div>}
            </div>
          )}
        </div>
      );
    }
    return calendarDays;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {months.map(m => <SelectItem key={m.value} value={m.value}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hadir</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rekap.hadir || 0}</div>
            <p className="text-xs text-muted-foreground">Total kehadiran</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rekap.terlambat || 0}</div>
            <p className="text-xs text-muted-foreground">Total keterlambatan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Izin</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rekap.izin || 0}</div>
            <p className="text-xs text-muted-foreground">Total izin</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sakit</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rekap.sakit || 0}</div>
            <p className="text-xs text-muted-foreground">Total sakit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alpha</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rekap.alpha || 0}</div>
            <p className="text-xs text-muted-foreground">Total tanpa keterangan</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kalender Rekapitulasi</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-16">Memuat kalender...</div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                <div key={day} className="font-bold text-center text-sm p-2">{day}</div>
              ))}
              {renderCalendar()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
