import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import type { CrewConfig, ScheduleItem } from '../../types/index';
import { DAY_NAMES_SHORT } from '../../constants/index';
import { formatTime } from '../../utils/dateHelpers';
import { id } from 'date-fns/locale';

interface MonthViewProps {
  currentMonth: Date;
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

export const MonthView = ({ 
  currentMonth, 
  schedules, 
  onDateSelect, 
  crewConfig 
}: MonthViewProps) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const getScheduleByDate = (date: Date) => {
    return schedules.find(schedule => new Date(schedule.tanggal).toDateString() === date.toDateString());
  };
  
  return (
    <div className="grid grid-cols-7 gap-2">
      {DAY_NAMES_SHORT.map((day) => (
        <div key={day} className="text-center font-semibold text-sm text-gray-500 py-2">
          {day}
        </div>
      ))}
      
      {days.map((day) => {
        const schedule = getScheduleByDate(day);
        const isCurrentDay = isToday(day);
        const isCurrentMonth = isSameMonth(day, currentMonth);
        const borderColor = schedule ? getStatusBorderColor(schedule.status_kehadiran) : 'border-gray-200';

        return (
          <Popover key={day.toString()}>
            <PopoverTrigger asChild>
              <div
                onClick={() => onDateSelect(day)}
                className={`min-h-[100px] p-2 border-2 rounded-lg cursor-pointer transition-all hover:shadow-xl flex flex-col justify-between 
                  ${borderColor} 
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 opacity-60'} 
                  ${isCurrentDay ? `ring-2 ring-offset-1 ${crewConfig.accentColor}` : ''}`
                }
              >
                <div className="flex justify-between items-start">
                    <span className={`text-sm font-semibold ${isCurrentDay ? crewConfig.primaryColor : 'text-gray-800'}`}>
                        {format(day, 'd')}
                    </span>
                    {schedule?.shift && (
                        <Badge variant="secondary" className="text-xs">{schedule.shift}</Badge>
                    )}
                </div>
                {schedule && (
                  <div className="text-center mt-2">
                    <p className="text-xs font-semibold">
                      {schedule.actual_checkin ? formatTime(schedule.actual_checkin) : formatTime(schedule.jam_masuk)} -
                      {schedule.actual_checkout ? formatTime(schedule.actual_checkout) : formatTime(schedule.jam_keluar)}
                    </p>
                  </div>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-3">
                <h4 className="font-medium leading-none text-lg">{format(day, 'eeee, d MMMM yyyy', { locale: id })}</h4>
                {schedule ? (
                  <div className="text-sm space-y-2 pt-2 border-t">
                    <div className="flex justify-between"><span className="text-gray-600">Status:</span> <span className="font-semibold">{schedule.status_kehadiran}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Shift:</span> <span className="font-semibold">{schedule.shift || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Jam Kerja:</span> <span className="font-semibold">{formatTime(schedule.jam_masuk)} - {formatTime(schedule.jam_keluar)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Check-in:</span> <span className="font-semibold">{schedule.actual_checkin ? formatTime(schedule.actual_checkin) : '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Check-out:</span> <span className="font-semibold">{schedule.actual_checkout ? formatTime(schedule.actual_checkout) : '-'}</span></div>
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
