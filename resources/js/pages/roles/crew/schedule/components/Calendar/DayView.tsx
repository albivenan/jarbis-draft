import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Briefcase, Info, CheckCircle, XCircle, Calendar } from 'lucide-react';
import type { ScheduleItem, CrewConfig } from '../../types/index';
import { formatTime } from '../../utils/dateHelpers';
import { Badge } from '@/components/ui/badge';

interface DayViewProps {
  date: Date;
  schedule: ScheduleItem | undefined;
  crewConfig: CrewConfig;
}

export const DayView = ({ date, schedule, crewConfig }: DayViewProps) => {
  return (
    <div className="mt-6">
      {schedule ? (
        <Card className={`border-2 ${crewConfig.accentColor}`}>
          <CardHeader>
            <CardTitle className={`text-2xl font-bold ${crewConfig.primaryColor}`}>
              {format(date, 'eeee, dd MMMM yyyy', { locale: id })}
            </CardTitle>
            <CardDescription>Detail jadwal dan kehadiran untuk hari ini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Briefcase className="w-5 h-5 mr-3 mt-1 text-gray-500" />
                  <div>
                    <p className="text-gray-600">Shift</p>
                    <p className="font-semibold text-lg">{schedule.shift || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 mr-3 mt-1 text-gray-500" />
                  <div>
                    <p className="text-gray-600">Jam Kerja</p>
                    <p className="font-semibold text-lg">
                      {schedule.actual_checkin ? formatTime(schedule.actual_checkin) : formatTime(schedule.jam_masuk)} -
                      {schedule.actual_checkout ? formatTime(schedule.actual_checkout) : formatTime(schedule.jam_keluar)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 mr-3 mt-1 text-gray-500" />
                  <div>
                    <p className="text-gray-600">Status Jadwal</p>
                    <Badge variant={schedule.status_kehadiran === 'hadir' ? 'default' : 'destructive'} className="capitalize text-lg">{schedule.status_kehadiran}</Badge>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 mt-1 text-green-500" />
                  <div>
                    <p className="text-gray-600">Check-in</p>
                    <p className="font-semibold text-lg">{schedule.actual_checkin ? formatTime(schedule.actual_checkin) : '-'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <XCircle className="w-5 h-5 mr-3 mt-1 text-red-500" />
                  <div>
                    <p className="text-gray-600">Check-out</p>
                    <p className="font-semibold text-lg">{schedule.actual_checkout ? formatTime(schedule.actual_checkout) : '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-16">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700">Tidak Ada Jadwal</h3>
            <p className="text-gray-500">Tidak ada jadwal kerja untuk tanggal yang dipilih.</p>
        </div>
      )}
    </div>
  );
};
