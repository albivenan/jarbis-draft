/**
 * Get user division based on role
 */
export const getUserDivision = (role: string): string => {
  switch (role) {
    case 'crew_kayu':
      return 'Produksi Kayu';
    case 'crew_besi':
      return 'Produksi Besi';
    case 'supervisor_kayu':
      return 'Supervisi Kayu';
    case 'supervisor_besi':
      return 'Supervisi Besi';
    default:
      return 'Produksi';
  }
};

/**
 * Get user work section
 */
export const getUserWorkSection = (): string => {
  return 'Bagian Produksi';
};

/**
 * Get status badge color
 */
export const getStatusBadgeColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'hadir':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'terlambat':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'izin':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'sakit':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'cuti':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'alpha':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-300';
  }
};

/**
 * Get status text in Indonesian
 */
export const getStatusText = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'hadir':
      return 'Hadir';
    case 'terlambat':
      return 'Terlambat';
    case 'izin':
      return 'Izin';
    case 'sakit':
      return 'Sakit';
    case 'cuti':
      return 'Cuti';
    case 'alpha':
      return 'Alpha';
    case 'belum_hadir':
      return 'Belum Hadir';
    default:
      return 'Tidak Diketahui';
  }
};

/**
 * Get shift text in Indonesian
 */
export const getShiftText = (shift: string | null): string => {
  if (!shift) return 'Tidak Ada Shift';
  
  switch (shift.toLowerCase()) {
    case 'pagi':
      return 'Shift Pagi';
    case 'siang':
      return 'Shift Siang';
    case 'malam':
      return 'Shift Malam';
    case 'libur':
      return 'Libur';
    default:
      return shift;
  }
};
