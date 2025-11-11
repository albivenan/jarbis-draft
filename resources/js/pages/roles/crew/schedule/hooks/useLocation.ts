import { useState, useEffect } from 'react';
import type { LocationData } from '../types/index';

/**
 * Custom hook for managing GPS location and online status
 */
export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Request location permission from user
   */
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          alert('Lokasi berhasil diaktifkan! Silakan coba lagi.');
        },
        (err) => {
          console.error('Error getting location:', err);
          alert('Gagal mengakses lokasi. Pastikan Anda mengizinkan akses lokasi di browser dan periksa pengaturan lokasi perangkat Anda.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      alert('Browser Anda tidak mendukung geolokasi. Silakan gunakan browser yang lebih baru.');
    }
  };

  return {
    location,
    isOnline,
    requestLocationPermission
  };
};
