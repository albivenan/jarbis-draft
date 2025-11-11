import { format, isSameDay, isToday, startOfWeek, addDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { ScheduleItem, CrewConfig } from '../../types/index';
import { DAY_NAMES } from '../../constants/index';
import { formatTime } from '../../utils/dateHelpers';

interface WeekViewProps {
  schedules: ScheduleItem[];
  onDateSelect: (date: Date) => void;
  crewConfig: CrewConfig;
}

const getStatusBorderColor = (status: string) => {
  switch (status) {
    case 'Hadir':
    case 'hadir':
      return 'border-green-500';
    case 'Terlambat':
    case 'terlambat':
      return 'border-yellow-500';
    case 'Izin':
    case 'izin':
      return 'border-blue-500';
    case 'Alpha':
    case 'alpha':
      return 'border-red-500';
    case 'Libur':
      return 'border-gray-400';
    default:
      return 'border-gray-200';
  }
};

export const WeekView = ({ schedules, onDateSelect, crewConfig }: WeekViewProps) => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
  
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
      {weekDays.map((day, index) => {
        const daySchedule = schedules.find(s => isSameDay(new Date(s.tanggal), day));
        const isTodayDate = isToday(day);
        const borderColor = daySchedule ? getStatusBorderColor(daySchedule.status_kehadiran) : 'border-gray-200';

        return (
          <Popover key={day.toString()}>
            <PopoverTrigger asChild>
              <div
                onClick={() => onDateSelect(day)}
                className={`min-h-[120px] border-2 rounded-lg p-2 cursor-pointer transition-all hover:shadow-xl flex flex-col ${borderColor} ${isTodayDate ? `ring-2 ring-offset-1 ${crewConfig.accentColor}` : ''}`}
              >
                <div className="text-center mb-2">
                  <div className="text-xs text-gray-500">{DAY_NAMES[day.getDay()]}</div>
                  <div className="text-lg font-bold">{format(day, 'd')}</div>
                </div>
                
                {daySchedule ? (
                  <div className="space-y-2 flex-grow flex flex-col justify-end">
                    {daySchedule.shift && (
                      <Badge variant="secondary" className="text-xs w-full justify-center">{daySchedule.shift}</Badge>
                    )}
                    <div className="text-xs text-center font-semibold text-gray-700">
                      {daySchedule.actual_checkin ? formatTime(daySchedule.actual_checkin) : formatTime(daySchedule.jam_masuk)} -
                      {daySchedule.actual_checkout ? formatTime(daySchedule.actual_checkout) : formatTime(daySchedule.jam_keluar)}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-center text-gray-400 flex-grow flex items-center justify-center">Libur</div>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <h4 className="font-medium leading-none text-lg">{format(day, 'eeee, d MMMM yyyy', { locale: id })}</h4>
                {daySchedule ? (
                  <div className="text-sm space-y-2 pt-2 border-t">
                    <div className="flex justify-between items-center"><span className="text-gray-600">Status:</span> <Badge variant={daySchedule.status_kehadiran === 'hadir' ? 'default' : 'destructive'} className="capitalize">{daySchedule.status_kehadiran}</Badge></div>
                    <div className="flex justify-between"><span className="text-gray-600">Shift:</span> <span className="font-semibold">{daySchedule.shift || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Jam Kerja:</span> <span className="font-semibold">{formatTime(daySchedule.jam_masuk)} - {formatTime(daySchedule.jam_keluar)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Check-in:</span> <span className="font-semibold">{daySchedule.actual_checkin ? formatTime(daySchedule.actual_checkin) : '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Check-out:</span> <span className="font-semibold">{daySchedule.actual_checkout ? formatTime(daySchedule.actual_checkout) : '-'}</span></div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground pt-2">Tidak ada jadwal untuk tanggal ini.</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        );
      })}
    </div>
  );
};
