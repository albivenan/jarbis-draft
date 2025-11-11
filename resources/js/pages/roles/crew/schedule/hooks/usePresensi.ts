import { useState } from 'react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from '@/hooks/use-toast';
import type { TodayStatus, LocationData, CrewConfig } from '../types';
import { API_ENDPOINTS } from '../constants';

interface UsePresensiProps {
  initialTodayStatus?: TodayStatus | null;
  location: LocationData | null;
  isOnline: boolean;
  crewConfig: CrewConfig;
  onScheduleUpdate: (scheduleId: number, updates: any) => void;
}

/**
 * Custom hook for managing presensi (attendance) operations
 */
export const usePresensi = ({ 
  initialTodayStatus = null,
  location, 
  isOnline, 
  crewConfig,
  onScheduleUpdate 
}: UsePresensiProps) => {
  const [todayStatus, setTodayStatus] = useState<TodayStatus | null>(initialTodayStatus);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  /**
   * Load today's presensi status
   */
  const loadTodayStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      
      const response = await fetch(API_ENDPOINTS.TODAY_STATUS, {
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
        setTodayStatus(result.data);
        console.log('✅ Today status loaded:', result.data);
      }
    } catch (error) {
      console.error('❌ Error loading today status:', error);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  /**
   * Handle check-in
   */
  const handleCheckIn = async (scheduleId: number) => {
    if (!isOnline) {
      toast({
        title: "Tidak Ada Koneksi",
        description: "Koneksi internet diperlukan untuk presensi. Silakan periksa koneksi Anda.",
        variant: "destructive",
      });
      return;
    }

    if (!location) {
      toast({
        title: "Lokasi Tidak Tersedia",
        description: "Lokasi diperlukan untuk presensi. Silakan aktifkan GPS.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingStatus(true);
    
    // Format waktu dengan benar menggunakan format ISO 8601
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    try {
      // Optimistic update - Real-time update without page reload
      onScheduleUpdate(scheduleId, {
        actual_checkin: currentTime,
        status_kehadiran: 'hadir',
        can_attend: false
      });

      // Update today status for real-time UI updates
      setTodayStatus(prev => prev ? {
        ...prev,
        has_checkedin: true,
        can_checkout: true,
        can_checkin: false,
        attendance: {
          jam_masuk_actual: currentTime,
          jam_keluar_actual: null,
          status_presensi: 'hadir',
          jam_kerja: null,
          catatan: null,
          jenis_pengajuan: 'normal',
          status_pengajuan: 'approved'
        }
      } : null);

      // Use Inertia router for CSRF-safe requests
      router.post(route('presensi.checkin'), {
        id_jadwal: scheduleId,
        latitude: location.latitude,
        longitude: location.longitude,
        lokasi_presensi: `Area Kerja ${crewConfig.name}`
      }, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          // Flash message will be handled by useFlashMessages hook in layout
          setIsLoadingStatus(false);
          // Reload today status after successful operation
          setTimeout(() => loadTodayStatus(), 500);
        },
        onError: (errors) => {
          console.error('❌ Presensi failed:', errors);
          const errorMessage = Object.values(errors)[0] as string || 'Terjadi kesalahan';
          
          toast({
            title: "Presensi Gagal",
            description: errorMessage,
            variant: "destructive",
          });
          
          // Revert optimistic update
          loadTodayStatus();
          setIsLoadingStatus(false);
        }
      });
    } catch (error) {
      console.error('Error during check-in:', error);
      setIsLoadingStatus(false);
      toast({
        title: "Kesalahan Sistem",
        description: "Terjadi kesalahan saat mencatat presensi. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  /**
   * Handle check-out
   */
  const handleCheckOut = async (scheduleId: number, actualCheckin?: string) => {
    if (!isOnline) {
      toast({
        title: "Tidak Ada Koneksi",
        description: "Koneksi internet diperlukan untuk presensi. Silakan periksa koneksi Anda.",
        variant: "destructive",
      });
      return;
    }

    // Check if 15 minutes have passed since check-in
    if (actualCheckin) {
      try {
        const checkInTime = new Date();
        const [hours, minutes, seconds] = actualCheckin.split(':').map(Number);
        checkInTime.setHours(hours, minutes, seconds || 0, 0);

        const now = new Date();
        const timeDiff = (now.getTime() - checkInTime.getTime()) / (1000 * 60); // in minutes

        if (timeDiff < 15) {
          const remainingTime = Math.ceil(15 - timeDiff);
          toast({
            title: "Terlalu Cepat",
            description: `Anda harus menunggu ${remainingTime} menit lagi sebelum bisa check-out. Minimal 15 menit setelah check-in.`,
            variant: "warning",
          });
          return;
        }
      } catch (error) {
        console.error('Error parsing check-in time:', error);
        toast({
          title: "Kesalahan Sistem",
          description: "Terjadi kesalahan saat memproses waktu check-in. Silakan coba lagi.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoadingStatus(true);
    
    // Format waktu dengan benar menggunakan format ISO 8601
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    try {
      // Optimistic update - Real-time update without page reload
      onScheduleUpdate(scheduleId, {
        actual_checkout: currentTime
      });

      // Update today status for real-time UI updates
      setTodayStatus(prev => {
        if (!prev || !prev.attendance) return prev;
        
        return {
          ...prev,
          has_checkedout: true,
          can_checkout: false,
          attendance: {
            ...prev.attendance,
            jam_keluar_actual: currentTime
          }
        };
      });

      // Use Inertia router for CSRF-safe requests
      router.post(route('presensi.checkout'), {}, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          // Flash message will be handled by useFlashMessages hook in layout
          setIsLoadingStatus(false);
          // Reload today status after successful operation
          setTimeout(() => loadTodayStatus(), 500);
        },
        onError: (errors) => {
          console.error('❌ Check-out failed:', errors);
          const errorMessage = Object.values(errors)[0] as string || 'Terjadi kesalahan';
          
          toast({
            title: "Check-out Gagal",
            description: errorMessage,
            variant: "destructive",
          });
          
          // Revert optimistic update
          loadTodayStatus();
          setIsLoadingStatus(false);
        }
      });
    } catch (error) {
      console.error('Error during check-out:', error);
      setIsLoadingStatus(false);
      toast({
        title: "Kesalahan Sistem",
        description: "Terjadi kesalahan saat mencatat check-out. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return {
    todayStatus,
    isLoadingStatus,
    loadTodayStatus,
    handleCheckIn,
    handleCheckOut,
    setTodayStatus
  };
};
