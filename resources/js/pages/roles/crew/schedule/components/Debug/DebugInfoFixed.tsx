import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ScheduleItem, LocationData } from '../../types/index';

interface DebugInfoProps {
  currentTime: Date;
  location: LocationData | null;
  isOnline: boolean;
  userDivision: string;
  userWorkSection: string;
  schedulesCount: number;
  isLoadingSchedules: boolean;
  todaySchedule: ScheduleItem | undefined;
  canAttend: boolean;
  canCheckout: boolean;
}

/** 
 * Debug information card for development
 */
export const DebugInfoFixed = ({
  currentTime,
  location,
  isOnline,
  userDivision,
  userWorkSection,
  schedulesCount,
  isLoadingSchedules,
  todaySchedule,
  canAttend,
  canCheckout
}: DebugInfoProps) => {
  // Only show in development
  try {
    if (import.meta && import.meta.env && import.meta.env.PROD) return null;
  } catch (error) {
    // If import.meta is not available, still show in development
    try {
      if (process && process.env && process.env.NODE_ENV === 'production') return null;
    } catch (innerError) {
      // In case neither works, always show debug in development builds
      return null; // Skip debug display instead of crashing
    }
  }

  return (
    <Card className="border-dashed border-gray-300">
      <CardHeader>
        <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
          🔍 Debug Info
          <Badge variant="outline" className="text-xs">
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-gray-500 space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div><strong>Current Time:</strong> {currentTime ? currentTime.toLocaleString('id-ID') : 'Invalid Date'}</div>
            <div>
              <strong>Location:</strong> {location 
                ? `${Number(location.latitude || 0).toFixed(4)}, ${Number(location.longitude || 0).toFixed(4)}` 
                : '❌ Not available'}
            </div>
            <div><strong>User Division:</strong> {userDivision || 'Not set'}</div>
            <div><strong>Work Section:</strong> {userWorkSection || 'Not set'}</div>
            <div><strong>Schedules Loaded:</strong> {schedulesCount || 0}</div>
            <div><strong>Loading:</strong> {isLoadingSchedules ? 'Yes' : 'No'}</div>
          </div>
          
          {todaySchedule && (
            <div className="space-y-1">
              <div><strong>Today's Schedule ID:</strong> {todaySchedule.id_jadwal || 'No ID'}</div>
              <div><strong>Shift:</strong> {todaySchedule.shift || 'Not set'}</div>
              <div><strong>Date:</strong> {todaySchedule.tanggal || 'No date'}</div>
              <div><strong>Time:</strong> {todaySchedule.jam_masuk || 'N/A'} - {todaySchedule.jam_keluar || 'N/A'}</div>
              <div>
                <strong>DB Status:</strong>{' '}
                <Badge 
                  variant="outline" 
                  className={
                    todaySchedule.status_kehadiran === 'belum_hadir' ? 'text-gray-600 border-gray-300' :
                    todaySchedule.status_kehadiran === 'hadir' ? 'text-green-600 border-green-300' :
                    todaySchedule.status_kehadiran === 'terlambat' ? 'text-yellow-600 border-yellow-300' :
                    'text-blue-600 border-blue-300'
                  }
                >
                  {todaySchedule.status_kehadiran || 'Not set'}
                </Badge>
              </div>
              <div><strong>Check-in:</strong> {todaySchedule.actual_checkin || '❌ Not yet'}</div>
              <div><strong>Check-out:</strong> {todaySchedule.actual_checkout || '❌ Not yet'}</div>
              <div><strong>Can Attend:</strong> {canAttend ? '✅ Yes' : '❌ No'}</div>
              <div><strong>Can Checkout:</strong> {canCheckout ? '✅ Yes' : '❌ No'}</div>
            </div>
          )}
          
          {/* Add error state information */}
          {!todaySchedule && (
            <div className="col-span-2 text-center py-2 text-gray-400">
              No schedule data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};