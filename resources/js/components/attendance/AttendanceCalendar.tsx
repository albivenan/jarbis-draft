import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, Edit2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDaysInMonth, getDay } from 'date-fns';
import { id } from 'date-fns/locale';

interface AttendanceRecord {
  date: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpa';
  checkIn?: string;
  checkOut?: string;
  shift: string;
  shiftTime: string;
  notes?: string;
}

interface AttendanceCalendarProps {
  employeeId: string;
  employeeName: string;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ employeeId, employeeName }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // January 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  // Data dummy untuk riwayat absen bulan ini
  const attendanceData: AttendanceRecord[] = [
    { date: '2025-01-02', status: 'hadir', checkIn: '08:00', checkOut: '17:00', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-03', status: 'hadir', checkIn: '08:15', checkOut: '17:05', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-06', status: 'hadir', checkIn: '07:55', checkOut: '17:00', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-07', status: 'hadir', checkIn: '08:10', checkOut: '17:15', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-08', status: 'hadir', checkIn: '08:05', checkOut: '17:02', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-09', status: 'hadir', checkIn: '08:20', checkOut: '17:00', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-10', status: 'hadir', checkIn: '08:00', checkOut: '17:00', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-13', status: 'hadir', checkIn: '08:08', checkOut: '17:10', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-14', status: 'hadir', checkIn: '08:02', checkOut: '17:00', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-15', status: 'izin', shift: 'Pagi', shiftTime: '08:00 - 17:00', notes: 'Keperluan keluarga' },
    { date: '2025-01-16', status: 'hadir', checkIn: '08:12', checkOut: '17:05', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-17', status: 'hadir', checkIn: '08:00', checkOut: '17:00', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-20', status: 'hadir', checkIn: '08:18', checkOut: '17:00', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-21', status: 'hadir', checkIn: '08:05', checkOut: '16:55', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-22', status: 'sakit', shift: 'Pagi', shiftTime: '08:00 - 17:00', notes: 'Demam tinggi' },
    { date: '2025-01-23', status: 'hadir', checkIn: '08:00', checkOut: '17:00', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-24', status: 'hadir', checkIn: '08:07', checkOut: '17:03', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-27', status: 'hadir', checkIn: '08:00', checkOut: '17:00', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-28', status: 'hadir', checkIn: '08:15', checkOut: '17:00', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-29', status: 'hadir', checkIn: '08:03', checkOut: '17:00', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-30', status: 'hadir', checkIn: '08:00', checkOut: '17:00', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
    { date: '2025-01-31', status: 'hadir', checkIn: '08:10', checkOut: '17:00', shift: 'Pagi', shiftTime: '08:00 - 17:00' },
  ];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAttendanceForDate = (date: Date): AttendanceRecord | undefined => {
    return attendanceData.find(record =>
      isSameDay(new Date(record.date), date)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hadir': return 'bg-green-100 text-green-800 border-green-200';
      case 'izin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sakit': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'alpa': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (editingRecord) {
      let updatedRecord = { ...editingRecord, status: newStatus as any };

      // Jika status diubah ke alpa, hapus data jam kerja
      if (newStatus === 'alpa') {
        updatedRecord = {
          ...updatedRecord,
          checkIn: undefined,
          checkOut: undefined,
          notes: undefined
        };
      }

      setEditingRecord(updatedRecord);
    }
  };

  const handleShiftChange = (newShift: string) => {
    if (editingRecord) {
      const shiftTimes = {
        'Pagi': '08:00 - 17:00',
        'Siang': '13:00 - 22:00',
        'Malam': '22:00 - 07:00'
      };
      setEditingRecord({
        ...editingRecord,
        shift: newShift,
        shiftTime: shiftTimes[newShift as keyof typeof shiftTimes] || '08:00 - 17:00'
      });
    }
  };

  const handleSaveChanges = () => {
    // Simulasi penyimpanan data
    console.log('Menyimpan perubahan:', editingRecord);
    // Di sini bisa ditambahkan API call untuk menyimpan perubahan
    alert('Perubahan berhasil disimpan!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Kalender Absensi - {employeeName}</h2>
          <p className="text-muted-foreground">Kelola dan ubah status absensi karyawan</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Bulan Sebelumnya</span>
          </Button>
          <span className="text-lg font-semibold min-w-[150px] text-center">
            {format(currentDate, 'MMMM yyyy', { locale: id })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Bulan Berikutnya</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day, index) => (
              <div
                key={day}
                className={`p-2 text-center text-sm font-medium ${index === 0 || index === 6 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'
                  }`}
              >
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: (monthStart.getDay()) }).map((_, index) => (
              <div key={`empty-start-${index}`} className="p-3 bg-gray-50" />
            ))}

            {calendarDays.map(day => {
              const attendance = getAttendanceForDate(day);
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;
              const isToday = isSameDay(day, new Date());
              const hasAttendance = !!attendance;

              return (
                <Dialog key={day.toISOString()}>
                  <DialogTrigger asChild>
                    <div
                      className={`
                        p-3 min-h-[80px] cursor-pointer transition-colors relative
                        ${!isSameMonth(day, currentDate) ? 'opacity-30 bg-gray-50' :
                          isToday ? 'bg-blue-50' :
                            hasAttendance ? 'bg-white hover:bg-gray-50' :
                              'bg-white hover:bg-gray-50'}
                        ${isWeekend && isSameMonth(day, currentDate) ? 'bg-red-50' : ''}
                      `}
                      onClick={() => {
                        setSelectedDate(day);
                        setEditingRecord(attendance || {
                          date: format(day, 'yyyy-MM-dd'),
                          status: 'hadir',
                          shift: 'Pagi',
                          shiftTime: '08:00 - 17:00'
                        });
                      }}
                    >
                      <div className="text-sm font-medium mb-1">{format(day, 'd')}</div>
                      {attendance && (
                        <>
                          <div className={`text-xs px-1.5 py-0.5 rounded mb-1 ${getStatusColor(attendance.status)}`}>
                            {attendance.status}
                          </div>
                          {attendance.checkIn && (
                            <div className="text-xs text-muted-foreground">
                              {attendance.checkIn}
                            </div>
                          )}
                        </>
                      )}
                      {isToday && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </DialogTrigger>

                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        Detail Absensi - {selectedDate && format(selectedDate, 'dd MMMM yyyy', { locale: id })}
                      </DialogTitle>
                    </DialogHeader>

                    {editingRecord && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Status Kehadiran</label>
                          <Select value={editingRecord.status} onValueChange={handleStatusChange}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hadir">Hadir</SelectItem>
                              <SelectItem value="izin">Izin</SelectItem>
                              <SelectItem value="sakit">Sakit</SelectItem>
                              <SelectItem value="alpa">Alpa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Hanya tampilkan input shift dan jam kerja jika status bukan alpa */}
                        {editingRecord.status !== 'alpa' && (
                          <>
                            <div>
                              <label className="text-sm font-medium">Shift</label>
                              <Select value={editingRecord.shift} onValueChange={handleShiftChange}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pagi">Pagi (08:00 - 17:00)</SelectItem>
                                  <SelectItem value="Siang">Siang (13:00 - 22:00)</SelectItem>
                                  <SelectItem value="Malam">Malam (22:00 - 07:00)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>Jam Kerja: {editingRecord.shiftTime}</span>
                            </div>

                            {/* Hanya tampilkan jam check in/out jika status hadir */}
                            {editingRecord.status === 'hadir' && editingRecord.checkIn && editingRecord.checkOut && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Check In</label>
                                  <div className="mt-1 text-sm">{editingRecord.checkIn}</div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Check Out</label>
                                  <div className="mt-1 text-sm">{editingRecord.checkOut}</div>
                                </div>
                              </div>
                            )}

                            {/* Tampilkan catatan jika ada dan status bukan hadir */}
                            {editingRecord.notes && editingRecord.status !== 'hadir' && (
                              <div>
                                <label className="text-sm font-medium">Catatan</label>
                                <div className="mt-1 text-sm text-muted-foreground">{editingRecord.notes}</div>
                              </div>
                            )}
                          </>
                        )}

                        {/* Pesan khusus untuk status alpa */}
                        {editingRecord.status === 'alpa' && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">
                              Status Alpa: Karyawan tidak hadir tanpa keterangan.
                              Tidak ada jam kerja yang dicatat untuk hari ini.
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" size="sm" onClick={() => setEditingRecord(null)}>
                            Batal
                          </Button>
                          <Button size="sm" onClick={handleSaveChanges}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Simpan Perubahan
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              );
            })}

            {/* Empty cells for days after month ends */}
            {Array.from({ length: (6 - monthEnd.getDay()) }).map((_, index) => (
              <div key={`empty-end-${index}`} className="p-3 bg-gray-50" />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center space-x-8 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
          <span>Hadir</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
          <span>Izin</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
          <span>Sakit</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
          <span>Alpa</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>Hari Ini</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;