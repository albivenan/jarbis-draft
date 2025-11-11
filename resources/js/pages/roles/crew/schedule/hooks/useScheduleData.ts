import { useState, useEffect } from 'react';
import type { ScheduleItem } from '../types';
import { API_ENDPOINTS } from '../constants';

/**
 * Custom hook for managing schedule data
 */
export const useScheduleData = (initialSchedules: ScheduleItem[] = []) => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(initialSchedules);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const loadSchedules = async (date: Date) => {
    setIsLoading(true);
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const url = `${API_ENDPOINTS.SCHEDULE}?year=${year}&month=${month}`;

      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': token,
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'same-origin'
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          console.log('✅ Schedules loaded successfully:', result.data);
          setSchedules(result.data);
        }
      }
    } catch (error) {
      console.error('❌ Error loading schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules(currentMonth);
  }, [currentMonth]);

  /**
   * Get today's schedule
   */
  const getTodaySchedule = (): ScheduleItem | undefined => {
    const today = new Date();
    return schedules.find(s => new Date(s.tanggal).toDateString() === today.toDateString());
  };

  /**
   * Get schedule by date
   */
  const getScheduleByDate = (date: Date): ScheduleItem | undefined => {
    return schedules.find(s => new Date(s.tanggal).toDateString() === date.toDateString());
  };

  /**
   * Get week schedules (current week)
   */
  const getWeekSchedules = (selectedDate: Date): ScheduleItem[] => {
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return schedules.filter(s => {
      const scheduleDate = new Date(s.tanggal);
      return scheduleDate >= startOfWeek && scheduleDate <= endOfWeek;
    });
  };

  /**
   * Get month schedules
   */
  const getMonthSchedules = (): ScheduleItem[] => {
    return schedules.filter(s => {
      const scheduleDate = new Date(s.tanggal);
      return scheduleDate.getMonth() === currentMonth.getMonth() &&
             scheduleDate.getFullYear() === currentMonth.getFullYear();
    });
  };

  /**
   * Update schedule locally (optimistic update)
   */
  const updateSchedule = (scheduleId: number, updates: Partial<ScheduleItem>) => {
    setSchedules(prev => prev.map(s => 
      s.id_jadwal === scheduleId ? { ...s, ...updates } : s
    ));
  };

  return {
    schedules,
    isLoading,
    currentMonth,
    setCurrentMonth,
    loadSchedules,
    getTodaySchedule,
    getScheduleByDate,
    getWeekSchedules,
    getMonthSchedules,
    updateSchedule
  };
};
