import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { ScheduleItem, TodayStatus, LocationData, CrewConfig } from '../../types';
import { canAttend, canCheckout, getTimeUntilCheckoutAllowed, getTimeUntilCheckinAllowed, formatTime } from '../../utils/dateHelpers';

interface PresensiButtonsProps {
  schedule: ScheduleItem;
  todayStatus: TodayStatus | null;
  location: LocationData | null;
  isOnline: boolean;
  isLoading: boolean;
  crewConfig: CrewConfig;
  onCheckIn: (scheduleId: number) => void;
  onCheckOut: (scheduleId: number, actualCheckin?: string) => void;
  onRequestPermission: () => void;
  onRequestOvertime: () => void;
}

export const PresensiButtons = ({
  schedule,
  todayStatus,
  location,
  isOnline,
  isLoading,
  crewConfig,
  onCheckIn,
  onCheckOut,
  onRequestPermission,
  onRequestOvertime
}: PresensiButtonsProps) => {
  const canAttendNow = canAttend(schedule);
  
  // Check if there's pending permission/overtime request for today
  const hasPendingPermission = todayStatus?.pending_permission_today || false;
  const hasPendingOvertime = todayStatus?.pending_overtime_today || false;
  
  // Calculate canCheckout based on todayStatus.attendance
  const canCheckoutNow = (() => {
    if (!todayStatus?.has_checkedin || !todayStatus?.attendance?.jam_masuk_actual) return false;
    
    const now = new Date();
    const checkinActualTime = new Date();
    
    // Parse the time string properly
    try {
      const timeString = todayStatus.attendance.jam_masuk_actual;
      if (typeof timeString === 'string' && timeString.includes(':')) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        checkinActualTime.setHours(hours || 0, minutes || 0, seconds || 0, 0);
      }
    } catch (error) {
      console.error('Error parsing check-in time:', error);
      return false;
    }
    
    // Must wait at least 15 minutes after check-in
    const minCheckoutTime = new Date(checkinActualTime.getTime() + 15 * 60 * 1000);
    
    return new Date() >= minCheckoutTime;
  })();
  
  const timeRemainingCheckout = (() => {
    if (!todayStatus?.has_checkedin || !todayStatus?.attendance?.jam_masuk_actual) return null;
    
    const now = new Date();
    const checkinActualTime = new Date();
    
    // Parse the time string properly
    try {
      const timeString = todayStatus.attendance.jam_masuk_actual;
      if (typeof timeString === 'string' && timeString.includes(':')) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        checkinActualTime.setHours(hours || 0, minutes || 0, seconds || 0, 0);
      }
    } catch (error) {
      console.error('Error parsing check-in time for checkout:', error);
      return null;
    }
    
    const minCheckoutTime = new Date(checkinActualTime.getTime() + 15 * 60 * 1000);
    
    if (now >= minCheckoutTime) return 0;
    
    return Math.ceil((minCheckoutTime.getTime() - now.getTime()) / (1000 * 60));
  })();
  
  const timeRemainingCheckin = getTimeUntilCheckinAllowed(schedule, new Date());

  const canShowAttendButton = !todayStatus?.has_checkedin;
  const canRequestPermission = !todayStatus?.has_checkedin;
  const canRequestOvertime = todayStatus?.has_checkedin && !todayStatus?.has_checkedout;

  return (
    <div className="space-y-3">
      {/* Check-in/Check-out Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        {canShowAttendButton && (
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <div className="flex-1">
                  <Button
                    onClick={() => {
                      if (todayStatus?.has_checkedin) {
                        alert('Anda sudah melakukan check-in hari ini.');
                        return;
                      }
                      if (!canAttendNow) {
                        if (timeRemainingCheckin) {
                          alert(timeRemainingCheckin);
                        } else {
                          alert('Maaf, waktu presensi tidak sesuai dengan jadwal Anda.');
                        }
                      } else {
                        onCheckIn(schedule.id_jadwal);
                      }
                    }}
                    disabled={isLoading || !location || !isOnline || todayStatus?.has_checkedin}
                    className={`w-full ${crewConfig.buttonPrimary} text-white`}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {isLoading ? 'Memproses...' : 'Hadir Sekarang'}
                  </Button>
                </div>
              </TooltipTrigger>
              {!canAttendNow && timeRemainingCheckin && timeRemainingCheckin.trim() !== '' && (
                <TooltipContent>
                  <p>{timeRemainingCheckin}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}
        
        {todayStatus?.has_checkedin && !todayStatus?.has_checkedout && (
          <Button
            onClick={() => onCheckOut(schedule.id_jadwal, todayStatus.attendance?.jam_masuk_actual)}
            disabled={isLoading || !isOnline || !canCheckoutNow}
            variant="outline"
            className={`flex-1 ${crewConfig.buttonSecondary}`}
          >
            <Clock className="h-4 w-4 mr-2" />
            {isLoading ? 'Memproses...' : 'Pulang Sekarang'}
          </Button>
        )}
        
        {todayStatus?.has_checkedout && (
          <Alert className={`flex-1 ${crewConfig.accentColor} border-green-200`}>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Presensi hari ini sudah lengkap
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      {/* Status Messages */}
      {todayStatus?.has_checkedin && !todayStatus?.has_checkedout && !canCheckoutNow && timeRemainingCheckout !== null && timeRemainingCheckout > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Check-out dapat dilakukan {timeRemainingCheckout} menit lagi (minimal 15 menit setelah check-in)
          </AlertDescription>
        </Alert>
      )}
      
      {!isOnline && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Koneksi internet diperlukan untuk presensi. Silakan periksa koneksi Anda.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Permission and Overtime Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
        <Button
          onClick={onRequestPermission}
          disabled={isLoading || !canRequestPermission}
          variant="secondary"
          className="w-full"
          title={!canRequestPermission ? 'Pengajuan izin hanya dapat dilakukan sebelum absen hadir' : ''}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Ajukan Izin
        </Button>

        <Button
          onClick={onRequestOvertime}
          disabled={isLoading || !canRequestOvertime}
          variant="outline"
          className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
          title={!canRequestOvertime ? 'Pengajuan lembur hanya dapat dilakukan setelah absen hadir' : ''}
        >
          <Clock className="w-4 h-4 mr-2" />
          Ajukan Lembur
        </Button>
      </div>
    </div>
  );
};