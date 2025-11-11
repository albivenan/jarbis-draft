import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { RequestType, PermissionType, HistoryItem } from '../types';

interface UseRequestsProps {
  activeTab: string;
  getSelectedSchedule?: () => { id_jadwal: number } | null | undefined;
  onRequestSuccess: () => void;
}

// Add a type for the fields that will be validated
interface ValidationData {
  requestReason: string;
  requestTime?: string;
  overtimeStart?: string;
  overtimeEnd?: string;
}

/**
 * Custom hook for managing permission and overtime requests
 */
export const useRequests = ({ activeTab, getSelectedSchedule, onRequestSuccess }: UseRequestsProps) => {
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestType, setRequestType] = useState<RequestType>('permission');
  const [selectedPermissionType, setSelectedPermissionType] = useState<PermissionType>('izin_terlambat');
  const [requestTime, setRequestTime] = useState('');
  const [overtimeDuration, setOvertimeDuration] = useState({ start: '', end: '' });
  const [requestReason, setRequestReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingRequest, setEditingRequest] = useState<HistoryItem | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof ValidationData, string>>>({});

  /**
   * Open request dialog for creating a new request
   */
  const openRequestDialog = (type: RequestType) => {
    setEditingRequest(null);
    setRequestType(type);
    setShowRequestDialog(true);
    
    // Reset form
    setRequestReason('');
    setRequestTime('');
    setOvertimeDuration({ start: '', end: '' });
    
    if (type === 'permission') {
      setSelectedPermissionType('izin_terlambat');
    }
  };

  /**
   * Open request dialog for editing an existing request
   */
  const openForEdit = (item: HistoryItem) => {
    setEditingRequest(item);
    setRequestType(item.type);
    setRequestReason(item.alasan);

    if (item.type === 'permission') {
      setSelectedPermissionType(item.jenis_izin as PermissionType);
      setRequestTime(item.waktu_izin || '');
    } else {
      setOvertimeDuration({ start: item.jam_mulai || '', end: item.jam_selesai || '' });
    }

    setShowRequestDialog(true);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ValidationData, string>> = {};
    
    if (requestReason.trim().length < 10) {
      newErrors.requestReason = 'Alasan harus diisi (minimal 10 karakter).';
    }

    if (requestType === 'permission' && selectedPermissionType !== 'izin_tidak_masuk' && !requestTime) {
      newErrors.requestTime = 'Waktu harus diisi.';
    }

    if (requestType === 'overtime') {
      if (!overtimeDuration.start) {
        newErrors.overtimeStart = 'Jam mulai harus diisi.';
      }
      if (!overtimeDuration.end) {
        newErrors.overtimeEnd = 'Jam selesai harus diisi.';
      }
      if (overtimeDuration.start && overtimeDuration.end && overtimeDuration.start >= overtimeDuration.end) {
        newErrors.overtimeEnd = 'Jam selesai harus setelah jam mulai.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle request submission (create or update)
   */
  const handleRequest = () => {
    if (!validate()) {
      return;
    }

    setIsLoading(true);

    // Get schedule once to use for both request types
    const schedule = getSelectedSchedule ? getSelectedSchedule() : null;

    const isEditing = editingRequest !== null;
    let data: any = {};
    let url: string;
    let method: 'post' | 'put';

    if (requestType === 'permission') {
      url = route('api.presensi.submit-request');
      method = 'post'; // Always use POST for now, update functionality can be handled separately
      data = {
        jenis_permohonan: selectedPermissionType,
        alasan: requestReason,
        waktu_pengajuan: requestTime,
        id_jadwal: schedule?.id_jadwal, // Include schedule ID from function
      };
    } else { // Overtime request
      url = route('api.presensi.submit-request');
      method = 'post'; // Always use POST for now, update functionality can be handled separately
      if (!overtimeDuration.start || !overtimeDuration.end) {
        alert('Jam mulai dan selesai lembur harus diisi');
        setIsLoading(false);
        return;
      }
      data = {
        jenis_permohonan: 'lembur',
        jam_mulai_lembur: overtimeDuration.start,
        jam_selesai_lembur: overtimeDuration.end,
        alasan: requestReason,
        id_jadwal: schedule?.id_jadwal, // Include schedule ID from function
      };
    }

    router[method](url, data, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setShowRequestDialog(false);
        setIsLoading(false);
        onRequestSuccess();
      },
      onError: (errors) => {
        console.error('Request failed:', errors);
        setIsLoading(false);
        const errorMessage = Object.values(errors)[0] as string || 'Terjadi kesalahan';
        alert(`Gagal: ${errorMessage}`);
      }
    });
  };

  return {
    showRequestDialog,
    requestType,
    selectedPermissionType,
    requestTime,
    overtimeDuration,
    requestReason,
    isLoading,
    editingRequest,
    setShowRequestDialog,
    setRequestType,
    setSelectedPermissionType,
    setRequestTime,
    setOvertimeDuration,
    setRequestReason,
    handleRequest,
    openRequestDialog,
    openForEdit,
    errors
  };
};