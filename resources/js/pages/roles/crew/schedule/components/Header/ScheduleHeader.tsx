import { Calendar as CalendarIcon, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CrewConfig } from '../../types/index';

interface ScheduleHeaderProps {
  crewConfig: CrewConfig;
  isOnline: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}

/**
 * Schedule page header with title, status, and refresh button
 */
export const ScheduleHeader = ({ 
  crewConfig, 
  isOnline, 
  isLoading,
  onRefresh 
}: ScheduleHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <CalendarIcon className={`w-6 h-6 ${crewConfig.secondaryColor}`} />
        <div>
          <h1 className={`text-2xl font-bold ${crewConfig.primaryColor}`}>
            Jadwal Kerja & Presensi {crewConfig.name}
          </h1>
          <p className="text-sm text-gray-500">
            Kelola jadwal dan presensi harian Anda
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Online Status Badge */}
        <Badge 
          variant="outline" 
          className={isOnline ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3 mr-1" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 mr-1" />
              Offline
            </>
          )}
        </Badge>
        
        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className={crewConfig.buttonSecondary}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
};
