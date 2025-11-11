import { Button } from '@/components/ui/button';
import type { CrewConfig } from '../../types/index';

interface ViewModeSelectorProps {
  viewMode: 'day' | 'week' | 'month';
  onViewModeChange: (mode: 'day' | 'week' | 'month') => void;
  crewConfig: CrewConfig;
}

/**
 * View mode selector component (Day/Week/Month)
 */
export const ViewModeSelector = ({ 
  viewMode, 
  onViewModeChange, 
  crewConfig 
}: ViewModeSelectorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="bg-gray-100 rounded-lg p-1 flex items-center space-x-1">
        <Button
          variant={viewMode === 'day' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('day')}
          className={viewMode === 'day' ? crewConfig.buttonPrimary : ''}
        >
          Hari
        </Button>
        <Button
          variant={viewMode === 'week' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('week')}
          className={viewMode === 'week' ? crewConfig.buttonPrimary : ''}
        >
          Minggu
        </Button>
        <Button
          variant={viewMode === 'month' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('month')}
          className={viewMode === 'month' ? crewConfig.buttonPrimary : ''}
        >
          Bulan
        </Button>
      </div>
    </div>
  );
};
