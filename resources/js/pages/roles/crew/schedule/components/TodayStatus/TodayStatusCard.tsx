import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User, Briefcase, Building, Calendar } from 'lucide-react';
import type { ScheduleItem, TodayStatus, LocationData, CrewConfig } from '../../types/index';
import { StatusBadge } from './StatusBadge';
import { PresensiButtons } from './PresensiButtons';
import { formatDate, formatTime } from '../../utils/dateHelpers';

interface TodayStatusCardProps {
  schedule: ScheduleItem | undefined;
  schedules: ScheduleItem[]; // Add this prop
  todayStatus: TodayStatus | null;
  location: LocationData | null;
  isOnline: boolean;
  isLoading: boolean;
  crewConfig: CrewConfig;
  userDivision: string;
  userWorkSection: string;
  onCheckIn: (scheduleId: number) => void;
  onCheckOut: (scheduleId: number, actualCheckin?: string) => void;
  onRequestPermission: () => void;
  onRequestOvertime: () => void;
}

export const TodayStatusCard = ({
  schedule,
  schedules, // Destructure the new prop
  todayStatus,
  location,
  isOnline,
  isLoading,
  crewConfig,
  userDivision,
  userWorkSection,
  onCheckIn,
  onCheckOut,
  onRequestPermission,
  onRequestOvertime
}: TodayStatusCardProps) => {
  if (!schedule) {
    const findNextSchedule = () => {
      const now = new Date();
      return schedules
        .filter(s => new Date(s.tanggal) > now)
        .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())[0];
    };

    const nextSchedule = findNextSchedule();

    return (
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            Tidak Ada Jadwal Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 mb-2">Anda tidak memiliki jadwal kerja untuk hari ini.</p>
            
            {nextSchedule && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                <p className="text-sm font-medium text-gray-700">Jadwal terdekat Anda berikutnya:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(nextSchedule.tanggal)} ({formatTime(nextSchedule.jam_masuk)} - {formatTime(nextSchedule.jam_keluar)})
                </p>
              </div>
            )}

            <p className="text-sm text-gray-500 mt-4">Silakan hubungi HRD jika Anda merasa ini adalah kesalahan.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${crewConfig.accentColor}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 ${crewConfig.primaryColor}`}>
            <Clock className="w-5 h-5" />
            Status Hari Ini - {formatDate(new Date(schedule.tanggal))}
          </CardTitle>
          <StatusBadge status={schedule.status_kehadiran} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Schedule & User Info */}
          <div className="space-y-4 p-4 bg-white rounded-lg border">
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Shift</p>
                <p className="font-bold text-lg">{schedule.shift?.toUpperCase() || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Jam Kerja</p>
                <p className="font-medium">{formatTime(schedule.jam_masuk)} - {formatTime(schedule.jam_keluar)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Building className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Divisi & Bagian</p>
                <p className="font-medium">{userDivision} / {userWorkSection}</p>
              </div>
            </div>
             <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Lokasi</p>
                <p className="font-medium">{location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Tidak tersedia'}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Presensi Time */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex flex-col justify-center">
             <h3 className="text-sm font-medium text-blue-800 mb-4 text-center">Waktu Presensi</h3>
             <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-blue-600">Check-in</p>
                <p className="text-2xl font-bold text-blue-800">{todayStatus?.attendance?.jam_masuk_actual ? formatTime(todayStatus.attendance.jam_masuk_actual) : '-'}</p>
              </div>
              <div>
                <p className="text-xs text-blue-600">Check-out</p>
                <p className="text-2xl font-bold text-blue-800">{todayStatus?.attendance?.jam_keluar_actual ? formatTime(todayStatus.attendance.jam_keluar_actual) : '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Presensi Action Buttons */}
        <div className="pt-4 border-t">
          <PresensiButtons
            schedule={schedule}
            todayStatus={todayStatus}
            location={location}
            isOnline={isOnline}
            isLoading={isLoading}
            crewConfig={crewConfig}
            onCheckIn={onCheckIn}
            onCheckOut={onCheckOut}
            onRequestPermission={onRequestPermission}
            onRequestOvertime={onRequestOvertime}
          />
        </div>
      </CardContent>
    </Card>
  );
};
