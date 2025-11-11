import type { ScheduleItem } from '../types';
import { CHECKIN_TOLERANCE_HOURS, CHECKOUT_MIN_DURATION_MINUTES } from '../constants';

/**
 * Format date to Indonesian format
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format time to HH:mm format
 */
export const formatTime = (time: string | null | undefined): string => {
  if (!time) return '-';

  // If the time string includes a 'T', it's a full date-time string
  if (typeof time === 'string' && time.includes('T')) {
    try {
      const date = new Date(time);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting time from datetime string:', error);
      // Fallback for invalid date strings
      return time;
    }
  }

  // Otherwise, assume it's a time string (HH:mm:ss or HH:mm)
  if (typeof time === 'string') {
    const parts = time.split(':');
    if (parts.length >= 2) {
      const hours = parts[0]?.padStart(2, '0') || '00';
      const minutes = parts[1]?.padStart(2, '0') || '00';
      return `${hours}:${minutes}`;
    }
  }

  return time || '-'; // Fallback for unexpected formats
};

/**
 * Check if user can attend (check-in) based on schedule
 */
export const canAttend = (schedule: ScheduleItem | undefined): boolean => {
  if (!schedule || !schedule.jam_masuk) return false;
  
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  // Only allow check-in for today's schedule
  if (schedule.tanggal !== today) return false;
  
  try {
    // Parse schedule time
    const [hours, minutes] = schedule.jam_masuk.split(':').map(num => parseInt(num, 10));
    const scheduleTime = new Date();
    scheduleTime.setHours(hours || 0, minutes || 0, 0, 0);
    
    // Allow check-in from 2 hours before to 4 hours after scheduled time
    const startTime = new Date(scheduleTime.getTime() - CHECKIN_TOLERANCE_HOURS * 60 * 60 * 1000);
    const endTime = new Date(scheduleTime.getTime() + 4 * 60 * 60 * 1000);
    
    return now >= startTime && now <= endTime;
  } catch (error) {
    console.error('Error parsing schedule time:', error);
    return false;
  }
};

/**
 * Check if user can checkout based on schedule and check-in time
 */
export const canCheckout = (schedule: ScheduleItem | undefined): boolean => {
  if (!schedule || !schedule.actual_checkin) return false;
  
  try {
    const now = new Date();
    const [hours, minutes, seconds] = schedule.actual_checkin.split(':').map(num => parseInt(num, 10));
    const checkinTime = new Date();
    checkinTime.setHours(hours || 0, minutes || 0, seconds || 0, 0);
    
    // Must wait at least 15 minutes after check-in
    const minCheckoutTime = new Date(checkinTime.getTime() + CHECKOUT_MIN_DURATION_MINUTES * 60 * 1000);
    
    return now >= minCheckoutTime;
  } catch (error) {
    console.error('Error parsing check-in time for checkout:', error);
    return false;
  }
};

/**
 * Get time remaining until checkout is allowed (in minutes)
 */
export const getTimeUntilCheckoutAllowed = (schedule: ScheduleItem | undefined): number | null => {
  if (!schedule || !schedule.actual_checkin) return null;
  
  try {
    const now = new Date();
    const [hours, minutes, seconds] = schedule.actual_checkin.split(':').map(num => parseInt(num, 10));
    const checkinTime = new Date();
    checkinTime.setHours(hours || 0, minutes || 0, seconds || 0, 0);
    
    const minCheckoutTime = new Date(checkinTime.getTime() + CHECKOUT_MIN_DURATION_MINUTES * 60 * 1000);
    
    if (now >= minCheckoutTime) return 0;
    
    return Math.ceil((minCheckoutTime.getTime() - now.getTime()) / (60 * 1000));
  } catch (error) {
    console.error('Error calculating time until checkout allowed:', error);
    return null;
  }
};

/**
 * Get formatted string for time until check-in is allowed.
 */
export const getTimeUntilCheckinAllowed = (schedule: ScheduleItem | undefined, currentTime: Date): string | null => {
  if (!schedule || !schedule.jam_masuk) return null;

  try {
    // Get schedule time
    const [hours, minutes, seconds] = schedule.jam_masuk.split(':').map(Number);
    const scheduleTime = new Date(currentTime);
    scheduleTime.setHours(hours, minutes, seconds || 0, 0);
    
    // Calculate check-in window start (2 hours before schedule time)
    const checkinWindowStart = new Date(scheduleTime.getTime() - 2 * 60 * 60 * 1000);
    
    // If current time is already past check-in window start, return null (can check in)
    if (currentTime >= checkinWindowStart) return null;

    const diffMs = checkinWindowStart.getTime() - currentTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.ceil((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    let result = 'Absen dalam ';
    if (diffHours > 0) {
      result += `${diffHours} jam `;
    }
    if (diffMinutes > 0) {
      result += `${diffMinutes} menit `;
    }
    return result + 'lagi';
  } catch (error) {
    console.error('Error calculating time until check-in allowed:', error);
    return null;
  }
};

/**
 * Check if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

/**
 * Check if date is in current month
 */
export const isCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return date.getMonth() === currentMonth.getMonth() && 
         date.getFullYear() === currentMonth.getFullYear();
};

/**
 * Get days in month
 */
export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/**
 * Get first day of month (0 = Sunday, 6 = Saturday)
 */
export const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

/**
 * Get week dates (Monday to Sunday)
 */
export const getWeekDates = (date: Date = new Date()): Date[] => {
  const dates: Date[] = [];
  const current = new Date(date);
  
  // Get Monday of current week
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  current.setDate(diff);
  
  // Get 7 days starting from Monday
  for (let i = 0; i < 7; i++) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};
