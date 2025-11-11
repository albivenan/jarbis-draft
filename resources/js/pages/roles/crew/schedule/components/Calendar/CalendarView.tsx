import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import type { ScheduleItem, CrewConfig } from '../../types/index';
import { CalendarNavigation } from './CalendarNavigation';
import { ViewModeSelector } from '../Header/ViewModeSelector';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';

interface CalendarViewProps {
  viewMode: 'day' | 'week' | 'month';
  onViewModeChange: (mode: 'day' | 'week' | 'month') => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  schedules: ScheduleItem[];
  weekSchedules: ScheduleItem[];
  selectedSchedule: ScheduleItem | undefined;
  crewConfig: CrewConfig;
  isLoading: boolean;
}

/**
 * Main calendar view component with mode switching
 */
export const CalendarView = ({
  viewMode,
  onViewModeChange,
  currentMonth,
  onMonthChange,
  selectedDate,
  onDateSelect,
  schedules,
  weekSchedules,
  selectedSchedule,
  crewConfig,
  isLoading
}: CalendarViewProps) => {
  return (
    <Card className="border-2 border-gray-200 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className={`w-5 h-5 ${crewConfig.secondaryColor}`} />
            Kalender Jadwal
          </CardTitle>
          
          <ViewModeSelector 
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            crewConfig={crewConfig}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <CalendarNavigation 
          currentMonth={currentMonth}
          onMonthChange={onMonthChange}
          crewConfig={crewConfig}
        />

        {/* Dynamic Calendar Views */}
        {viewMode === 'month' && (
          <MonthView 
            currentMonth={currentMonth}
            schedules={schedules}
            onDateSelect={onDateSelect}
            crewConfig={crewConfig}
          />
        )}

        {viewMode === 'week' && (
          <WeekView 
            schedules={weekSchedules}
            onDateSelect={onDateSelect}
            crewConfig={crewConfig}
          />
        )}

        {viewMode === 'day' && (
          <DayView 
            date={selectedDate}
            schedule={selectedSchedule}
            crewConfig={crewConfig}
          />
        )}
      </CardContent>
    </Card>
  );
};
