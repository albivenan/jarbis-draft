import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check, X, Clock, AlertTriangle, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';

interface ScheduleEntry {
  id_jadwal: number;
  tanggal: string;
  jam_masuk: string | null;
  jam_keluar: string | null;
  shift: string | null;
  status_kehadiran: string;
  catatan: string | null;
  attendance_status: string;
  actual_checkin: string | null;
  actual_checkout: string | null;
  can_attend: boolean;
}

interface EmployeeScheduleCalendarProps {
  employeeId: number;
  employeeName: string;
}

export default function EmployeeScheduleCalendar({ employeeId, employeeName }: EmployeeScheduleCalendarProps) {
  const { toast } = useToast();
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDayDetailDialogOpen, setIsDayDetailDialogOpen] = useState(false);
  const [selectedDaySchedule, setSelectedDaySchedule] = useState<ScheduleEntry | null>(null);

  const { data, setData, post, processing, errors, reset, isDirty } = useForm({
    id_jadwal: selectedDaySchedule?.id_jadwal || null,
    id_karyawan: employeeId,
    tanggal: selectedDaySchedule?.tanggal || '',
    status_presensi: '',
    jam_masuk_actual: '',
    jam_keluar_actual: '',
    catatan: '',
  });

  useEffect(() => {
    if (selectedDaySchedule) {
      const initialStatus = (selectedDaySchedule.shift === 'libur' || selectedDaySchedule.shift === 'off')
        ? 'libur' // Default to 'libur' if shift is libur/off
        : selectedDaySchedule.attendance_status || '';

      setData({
        id_jadwal: selectedDaySchedule.id_jadwal,
        id_karyawan: employeeId,
        tanggal: selectedDaySchedule.tanggal,
        status_presensi: initialStatus,
        jam_masuk_actual: selectedDaySchedule.actual_checkin || '',
        jam_keluar_actual: selectedDaySchedule.actual_checkout || '',
        catatan: selectedDaySchedule.catatan || '',
      });
    } else {
      reset();
    }
  }, [selectedDaySchedule, employeeId]);

  useEffect(() => {
    const shouldShowActualTimes = selectedDaySchedule?.shift === 'custom' || 
                                  (selectedDaySchedule?.shift !== 'libur' && 
                                   selectedDaySchedule?.shift !== 'off' && 
                                   (data.status_presensi === 'hadir' || data.status_presensi === 'terlambat'));

    if (!shouldShowActualTimes) {
      setData(prevData => ({
        ...prevData,
        jam_masuk_actual: '',
        jam_keluar_actual: '',
      }));
    }
  }, [data.status_presensi, selectedDaySchedule?.shift]);

  const fetchSchedule = async () => {
    setIsLoading(true);
    try {
      const url = new URL(route('api.presensi.employee-schedule'));
      url.searchParams.set('id_karyawan', employeeId.toString());
      url.searchParams.set('year', year);
      url.searchParams.set('month', month);

      const response = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      });

      if (!response.ok) throw new Error('Network response was not ok.');

      const result = await response.json();
      if (result.success) {
        setSchedules(result.data);
      } else {
        toast({ title: 'Gagal Memuat Jadwal', description: result.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Tidak dapat terhubung ke server.', variant: 'destructive' });
      console.error("Failed to fetch employee schedule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [employeeId, year, month]);

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), name: new Date(0, i).toLocaleString('id-ID', { month: 'long' }) }));

  const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
  const firstDayOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'hadir': return 'border-green-500';
      case 'terlambat': return 'border-yellow-500';
      case 'izin': return 'border-blue-500';
      case 'sakit': return 'border-purple-500';
      case 'alpha': return 'border-red-500';
      case 'libur': return 'border-gray-400';
      default: return 'border-gray-200';
    }
  };

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case 'hadir': return <Check size={14} className="text-green-600" />;
      case 'terlambat': return <Clock size={14} className="text-yellow-600" />;
      case 'izin': return <AlertTriangle size={14} className="text-blue-600" />;
      case 'sakit': return <AlertTriangle size={14} className="text-purple-600" />;
      case 'alpha': return <X size={14} className="text-red-600" />;
      default: return null;
    }
  };

  const formatTimeToHHMM = (timeString: string | null) => {
    if (!timeString) return '';
    const parts = timeString.split(':');
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : timeString;
  };

  const handleDayClick = (schedule: ScheduleEntry | null) => {
    setSelectedDaySchedule(schedule);
    setIsDayDetailDialogOpen(true);
  };

  const handleSaveAttendance = () => {
    if (!selectedDaySchedule) return;

    post(route('api.presensi.update-attendance'), {
      onSuccess: () => {
        toast({ title: 'Berhasil', description: 'Presensi berhasil diperbarui.' });
        fetchSchedule(); // Re-fetch schedule to update calendar
        setIsDayDetailDialogOpen(false);
      },
      onError: (formErrors) => {
        toast({ title: 'Gagal', description: 'Terjadi kesalahan saat memperbarui presensi.', variant: 'destructive' });
        console.error('Update error:', formErrors);
      },
    });
  };

  const renderCalendarDays = () => {
    const calendarDays = [];
    const scheduleMap = new Map(schedules.map(s => [s.tanggal, s]));

    // Empty days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="border rounded-md p-2 bg-gray-50"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${month.padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const schedule = scheduleMap.get(dateStr);
      const attendanceStatus = schedule?.attendance_status || schedule?.status_kehadiran || 'belum_hadir';
      const borderColor = getAttendanceColor(attendanceStatus);

      calendarDays.push(
        <div
          key={dateStr}
          className={`border-2 ${borderColor} rounded-md p-2 min-h-[100px] flex flex-col justify-between cursor-pointer hover:bg-gray-50`}
          onClick={() => handleDayClick(schedule)}
        >
          <div className="font-bold text-sm">{day}</div>
          {schedule && (
            <div className="text-xs mt-1 space-y-1">
              {schedule.shift && <div className="font-medium">Shift: {schedule.shift}</div>}
              {schedule.jam_masuk && <div>Masuk: {schedule.jam_masuk}</div>}
              {schedule.jam_keluar && <div>Keluar: {schedule.jam_keluar}</div>}
              <div className="flex items-center gap-1">
                {getAttendanceIcon(attendanceStatus)}
                <span className="capitalize">{attendanceStatus.replace('_', ' ')}</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return calendarDays;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Jadwal & Presensi {employeeName}</h3>
        <div className="flex gap-2">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              {months.map(m => <SelectItem key={m.value} value={m.value}>{m.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={year} onOnValueChange={setYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16">Memuat jadwal...</div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
            <div key={day} className="font-bold text-center text-sm p-2">{day}</div>
          ))}
          {renderCalendarDays()}
        </div>
      )}

      {/* Day Detail Dialog */}
      <Dialog open={isDayDetailDialogOpen} onOpenChange={setIsDayDetailDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detail Presensi - {selectedDaySchedule?.tanggal}</DialogTitle>
            <DialogDescription>Lihat dan edit detail presensi untuk tanggal ini.</DialogDescription>
          </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select
                value={data.status_presensi}
                onValueChange={(value) => setData('status_presensi', value)}
                disabled={selectedDaySchedule?.shift === 'libur' || selectedDaySchedule?.shift === 'off'}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hadir">Hadir</SelectItem>
                  <SelectItem value="terlambat">Terlambat</SelectItem>
                  <SelectItem value="izin">Izin</SelectItem>
                  <SelectItem value="sakit">Sakit</SelectItem>
                  <SelectItem value="alpha">Alpha</SelectItem>
                  {(selectedDaySchedule?.shift === 'libur' || selectedDaySchedule?.shift === 'off') && (
                    <SelectItem value="libur">Libur</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.status_presensi && <p className="col-span-4 text-right text-red-500 text-xs">{errors.status_presensi}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shift" className="text-right">Shift</Label>
              <Input id="shift" defaultValue={selectedDaySchedule?.shift || '-'} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scheduledCheckIn" className="text-right">Jadwal Masuk</Label>
              <Input id="scheduledCheckIn" defaultValue={selectedDaySchedule?.jam_masuk || '-'} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scheduledCheckOut" className="text-right">Jadwal Keluar</Label>
              <Input id="scheduledCheckOut" defaultValue={selectedDaySchedule?.jam_keluar || '-'} className="col-span-3" readOnly />
            </div>
            {(selectedDaySchedule?.shift === 'custom' || (selectedDaySchedule?.shift !== 'libur' && selectedDaySchedule?.shift !== 'off' && (data.status_presensi === 'hadir' || data.status_presensi === 'terlambat'))) && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="actualCheckIn" className="text-right">Actual Masuk</Label>
                  <Input id="actualCheckIn" type="time" value={formatTimeToHHMM(data.jam_masuk_actual) || ''} onChange={(e) => setData('jam_masuk_actual', e.target.value ? e.target.value + ':00' : '')} className="col-span-3" />
                  {errors.jam_masuk_actual && <p className="col-span-4 text-right text-red-500 text-xs">{errors.jam_masuk_actual}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="actualCheckOut" className="text-right">Actual Keluar</Label>
                  <Input id="actualCheckOut" type="time" value={formatTimeToHHMM(data.jam_keluar_actual) || ''} onChange={(e) => setData('jam_keluar_actual', e.target.value ? e.target.value + ':00' : '')} className="col-span-3" />
                  {errors.jam_keluar_actual && <p className="col-span-4 text-right text-red-500 text-xs">{errors.jam_keluar_actual}</p>}
                </div>
              </>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">Catatan</Label>
              <Input id="notes" value={data.catatan || ''} onChange={(e) => setData('catatan', e.target.value)} className="col-span-3" />
              {errors.catatan && <p className="col-span-4 text-right text-red-500 text-xs">{errors.catatan}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDayDetailDialogOpen(false)} disabled={processing}>Batal</Button>
            <Button type="button" onClick={handleSaveAttendance} disabled={processing || !isDirty}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
