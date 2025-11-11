// Constants for Schedule module

export const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const DAY_NAMES_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const SHIFT_COLORS = {
  pagi: 'bg-blue-500',
  siang_kayu: 'bg-green-500',
  siang_besi: 'bg-slate-500',
  malam: 'bg-purple-500',
  libur: 'bg-gray-400'
} as const;

export const STATUS_COLORS = {
  hadir: 'bg-green-100 text-green-800 border-green-200',
  terlambat: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  izin: 'bg-blue-100 text-blue-800 border-blue-200',
  sakit: 'bg-red-100 text-red-800 border-red-200',
  cuti: 'bg-purple-100 text-purple-800 border-purple-200',
  belum_hadir: 'text-gray-600 border-gray-300'
} as const;

export const CHECKIN_TOLERANCE_HOURS = 2; // Hours before shift start
export const CHECKOUT_MIN_DURATION_MINUTES = 15; // Minimum minutes after check-in
export const OVERTIME_MAX_HOURS = 8; // Maximum overtime hours
export const OVERTIME_MIN_MINUTES = 30; // Minimum overtime minutes

export const API_ENDPOINTS = {
  SCHEDULE: '/api/jadwal/employee-schedule',
  TODAY_STATUS: '/api/presensi/today-status',
  CHECKIN: '/presensi/checkin',
  CHECKOUT: '/presensi/checkout',
  PERMISSION_REQUESTS: '/api/presensi/permission-requests',
  USER_REQUESTS: '/api/presensi/user-requests',
  OVERTIME_REQUESTS: '/api/presensi/overtime-requests',
  REQUEST_PERMISSION: '/presensi/request-permission',
  REQUEST_OVERTIME: '/presensi/request-overtime',
  HISTORY: '/api/presensi/history',
} as const;

export const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds
