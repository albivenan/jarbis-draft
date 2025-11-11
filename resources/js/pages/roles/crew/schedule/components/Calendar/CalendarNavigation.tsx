import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';
import type { CrewConfig } from '../../types/index';

interface CalendarNavigationProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  crewConfig: CrewConfig;
}

/**
 * Calendar navigation component with prev/next month buttons
 */
export const CalendarNavigation = ({ 
  currentMonth, 
  onMonthChange, 
  crewConfig 
}: CalendarNavigationProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onMonthChange(subMonths(currentMonth, 1))}
        className={crewConfig.buttonSecondary}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="text-center">
        <h3 className={`text-lg font-semibold ${crewConfig.primaryColor}`}>
          {format(currentMonth, 'MMMM yyyy', { locale: id })}
        </h3>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onMonthChange(addMonths(currentMonth, 1))}
        className={crewConfig.buttonSecondary}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
