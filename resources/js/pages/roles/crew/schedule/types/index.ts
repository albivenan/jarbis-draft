import type { Config } from 'ziggy-js';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

// --- GLOBAL TYPES (Minimal copy for local context) ---

export interface User {
    id: number;
    id_karyawan: number;
    name: string;
    email: string;
    role: string;
}

interface BasePageProps extends InertiaPageProps {
    auth: {
        user: User;
    };
    ziggy: Config;
    flash: {
        success?: string;
        error?: string;
    };
}

export interface PageSpecificProps {
    initialEmployeeId: number;
    initialYear: number;
    initialMonth: number;
    errors: Record<string, string>;
    todayStatus: TodayStatus;
    weeklySchedule: ScheduleItem[];
    schedules: ScheduleItem[];
    monthlySummary: MonthlySummaryItem[];
    crewConfig: CrewConfig;
    historyData?: HistoryItem[];
    [key: string]: any;
}

export type PageProps = BasePageProps & PageSpecificProps;

// --- SCHEDULE SPECIFIC TYPES ---

/**
 * Item for the monthly summary.
 */
export interface MonthlySummaryItem {
  tanggal: string;
  status_presensi: string;
}

/**
 * Configuration for the crew member's role, theme, and display properties.
 */
export interface CrewConfig {
  name: string;
  theme: string;
  focus: string;
  icon: string; // Icon name from lucide-react
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  buttonPrimary?: string;
  buttonSecondary?: string;
}

/**
 * Represents a single schedule item for a day.
 */
export interface ScheduleItem {
  id_jadwal: number;
  tanggal: Date; // Format: YYYY-MM-DD
  hari?: string;
  jam_masuk: string | null; // Format: HH:mm:ss
  jam_keluar: string | null; // Format: HH:mm:ss
  shift: string | null;
  status_kehadiran: string;
  attendance_status?: string;
  actual_checkin?: string | null; // Format: HH:mm:ss
  actual_checkout?: string | null; // Format: HH:mm:ss
  can_attend?: boolean;
  checkin_window_start?: string; // Format: HH:mm:ss
  date?: Date; // For compatibility
  startTime?: string;
  endTime?: string;
  task?: string;
  notes?: string;
}

/**
 * Represents the attendance record for a specific day.
 */
export interface AttendanceRecord {
  jam_masuk_actual: string;
  jam_keluar_actual: string | null;
  status_presensi: string;
  jam_kerja?: string;
  catatan?: string;
  jenis_pengajuan?: string;
  status_pengajuan?: string;
}

/**
 * Represents the schedule details for a specific day, including future schedules.
 */
export interface ScheduleDetails {
  id_jadwal: number;
  jam_masuk: string;
  jam_keluar: string;
  shift: string;
  tanggal: string; // Format: YYYY-MM-DD
  is_next_schedule?: boolean; // True if this schedule is for a future date
  checkin_window_start?: string; // Format: HH:mm:ss
}

/**
 * Consolidated status for the current day.
 */
export interface TodayStatus {
  has_schedule: boolean;
  can_checkin: boolean;
  can_checkout: boolean;
  has_checkedin: boolean;
  has_checkedout: boolean;
  schedule: ScheduleDetails | null;
  attendance: AttendanceRecord | null;
  current_time: string; // Format: HH:mm:ss
  current_date: string; // Format: YYYY-MM-DD
}

/**
 * Geolocation data for attendance.
 */
export interface LocationData {
  latitude: number;
  longitude: number;
}

/**
 * Types for requests (permission, overtime, etc.)
 */
export type RequestType = 'permission' | 'overtime';
export type PermissionType = 'izin_terlambat' | 'izin_pulang_awal' | 'izin_tidak_masuk';

/**
 * History item for permission and overtime requests
 */
export interface HistoryItem {
  id: number;
  id_jadwal?: number;
  type: 'permission' | 'overtime';
  employee_name?: string;
  jenis_izin?: string;
  tanggal?: string; // Tanggal permohonan (dari backend)
  tanggal_izin?: string;
  waktu_izin?: string;
  tanggal_lembur?: string;
  jam_mulai?: string;
  jam_selesai?: string;
  durasi?: number; // Durasi lembur (dari backend)
  durasi_jam?: number;
  alasan: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string; // Waktu pengajuan dibuat (dari backend)
  requested_at?: string;
  approved_by?: string | number; // ID user HRD yang approve
  approved_at?: string; // Waktu disetujui/ditolak
  catatan_approval?: string; // Catatan dari HRD (dari backend)
  notes?: string;
  can_cancel?: boolean;
  can_edit?: boolean;
  tanggal_jadwal?: string;
  jam_masuk_jadwal?: string;
}