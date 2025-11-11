import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';

// Types
import type { PageProps } from './types';

// Utils
import { getCrewConfig } from './utils/crewConfig';
import { getUserDivision, getUserWorkSection } from './utils/scheduleHelpers';
import { canAttend, canCheckout } from './utils/dateHelpers';

// Hooks
import { useLocation } from './hooks/useLocation';
import { useScheduleData } from './hooks/useScheduleData';
import { usePresensi } from './hooks/usePresensi';
import { useRequests } from './hooks/useRequests';

// Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScheduleHeader } from './components/Header/ScheduleHeader';
import { TodayStatusCard } from './components/TodayStatus/TodayStatusCard';
import { CalendarView } from './components/Calendar/CalendarView';
import { RequestDialog } from './components/Requests/RequestDialog';
import { HistoryTab } from './components/History/HistoryTab';
import { DebugInfoFixed } from './components/Debug/DebugInfoFixed';

/**
 * Main Schedule Page Component
 * Orchestrates all hooks and components for crew schedule management
 */
const SchedulePage = () => {
  const { user, historyData = [], schedules: initialSchedules = [], todayStatus: initialTodayStatus } = usePage<PageProps>().props;
  
  // Get crew configuration based on user role
  const crewConfig = getCrewConfig(user?.role || 'crew');
  
  // Local state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'schedule' | 'history'>('schedule');
  
  // Custom hooks
  const { location, isOnline, requestLocationPermission } = useLocation();
  
  const {
    schedules,
    isLoading: isLoadingSchedules,
    currentMonth,
    setCurrentMonth,
    loadSchedules,
    getTodaySchedule,
    getScheduleByDate,
    getWeekSchedules,
    getMonthSchedules,
    updateSchedule
  } = useScheduleData(initialSchedules);
  
  const {
    todayStatus,
    isLoadingStatus,
    loadTodayStatus,
    handleCheckIn,
    handleCheckOut
  } = usePresensi({
    initialTodayStatus,
    location,
    isOnline,
    crewConfig,
    onScheduleUpdate: updateSchedule
  });
  
  const {
    showRequestDialog,
    requestType,
    selectedPermissionType,
    requestTime,
    overtimeDuration,
    requestReason,
    isLoading: isLoadingRequest,
    setShowRequestDialog,
    setRequestType,
    setSelectedPermissionType,
    setRequestTime,
    setOvertimeDuration,
    setRequestReason,
    errors, // Destructure errors
    editingRequest,
    openForEdit,
    handleRequest,
    openRequestDialog
  } = useRequests({
    activeTab,
    getSelectedSchedule: () => getScheduleByDate(selectedDate), // Pass function to get selected schedule
    onRequestSuccess: () => {
      loadSchedules(currentMonth); // Pass argument
      loadTodayStatus();
    }
  });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const todaySchedule = getTodaySchedule();
  const weekSchedules = getWeekSchedules(selectedDate);
  const monthSchedules = getMonthSchedules();
  const selectedSchedule = getScheduleByDate(selectedDate);
  
  const userDivision = getUserDivision(user?.role || '');
  const userWorkSection = getUserWorkSection();
  const canAttendNow = todaySchedule ? canAttend(todaySchedule) : false;
  const canCheckoutNow = todaySchedule ? canCheckout(todaySchedule) : false;
  
  return (
    <AuthenticatedLayout>
      <Head title={`Jadwal Kerja - ${crewConfig.name}`} />
      
      <div className="py-6 space-y-6">
        <ScheduleHeader
          crewConfig={crewConfig}
          isOnline={isOnline}
          isLoading={isLoadingSchedules || isLoadingStatus}
          onRefresh={() => {
            loadSchedules(currentMonth); // Pass argument
            loadTodayStatus();
          }}
        />
        
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule">Jadwal & Presensi</TabsTrigger>
            <TabsTrigger value="history">Riwayat Izin & Lembur</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule" className="space-y-6 mt-6">
            <TodayStatusCard
              schedule={todaySchedule}
              schedules={monthSchedules} // Pass all schedules
              todayStatus={todayStatus}
              location={location}
              isOnline={isOnline}
              isLoading={isLoadingStatus || isLoadingRequest}
              crewConfig={crewConfig}
              userDivision={userDivision}
              userWorkSection={userWorkSection}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              onRequestPermission={() => openRequestDialog('permission')}
              onRequestOvertime={() => openRequestDialog('overtime')}
            />
            
            <CalendarView
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              schedules={monthSchedules}
              weekSchedules={weekSchedules}
              selectedSchedule={selectedSchedule}
              crewConfig={crewConfig}
              isLoading={isLoadingSchedules}
            />
            
            <DebugInfoFixed
              currentTime={currentTime}
              location={location}
              isOnline={isOnline}
              userDivision={userDivision}
              userWorkSection={userWorkSection}
              schedulesCount={schedules.length}
              isLoadingSchedules={isLoadingSchedules}
              todaySchedule={todaySchedule}
              canAttend={canAttendNow}
              canCheckout={canCheckoutNow}
            />
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <HistoryTab crewConfig={crewConfig} historyData={historyData} onEdit={openForEdit} />
          </TabsContent>
        </Tabs>
      </div>
      
      <RequestDialog
        open={showRequestDialog}
        onOpenChange={setShowRequestDialog}
        requestType={requestType}
        isEditing={editingRequest !== null}
        errors={errors} // Pass errors prop
        selectedPermissionType={selectedPermissionType}
        onPermissionTypeChange={setSelectedPermissionType}
        requestTime={requestTime}
        onRequestTimeChange={setRequestTime}
        overtimeDuration={overtimeDuration}
        onOvertimeDurationChange={setOvertimeDuration}
        requestReason={requestReason}
        onRequestReasonChange={setRequestReason}
        isLoading={isLoadingRequest}
        onSubmit={handleRequest}
        crewConfig={crewConfig}
      />
    </AuthenticatedLayout>
  );
};

export default SchedulePage;
