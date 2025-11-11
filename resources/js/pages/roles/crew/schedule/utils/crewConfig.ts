import type { CrewConfig } from '../types/index';

/**
 * Get crew configuration based on user role
 * Returns theme colors and styling for crew-specific UI
 */
export const getCrewConfig = (role: string): CrewConfig => {
  switch (role) {
    case 'crew_kayu':
      return {
        name: 'Crew Kayu',
        theme: 'green',
        focus: 'Produksi Kayu',
        icon: 'TreePine',
        primaryColor: 'text-green-800',
        secondaryColor: 'text-green-600',
        accentColor: 'bg-green-50 border-green-200',
        buttonPrimary: 'bg-green-600 hover:bg-green-700',
        buttonSecondary: 'border-green-600 text-green-600 hover:bg-green-50'
      };
    
    case 'crew_besi':
      return {
        name: 'Crew Besi',
        theme: 'slate',
        focus: 'Produksi Besi',
        icon: 'HardHat',
        primaryColor: 'text-slate-800',
        secondaryColor: 'text-slate-600',
        accentColor: 'bg-slate-50 border-slate-200',
        buttonPrimary: 'bg-slate-600 hover:bg-slate-700',
        buttonSecondary: 'border-slate-600 text-slate-600 hover:bg-slate-50'
      };
    
    default:
      return {
        name: 'Crew',
        theme: 'blue',
        focus: 'Produksi',
        icon: 'User',
        primaryColor: 'text-blue-800',
        secondaryColor: 'text-blue-600',
        accentColor: 'bg-blue-50 border-blue-200',
        buttonPrimary: 'bg-blue-600 hover:bg-blue-700',
        buttonSecondary: 'border-blue-600 text-blue-600 hover:bg-blue-50'
      };
  }
};

/**
 * Get shift color based on shift type and crew theme
 */
export const getShiftColor = (shift: string | null | undefined, crewTheme: string): string => {
  if (!shift) return 'bg-gray-400';
  
  switch (shift.toLowerCase()) {
    case 'pagi':
      return 'bg-blue-500';
    case 'siang':
      return crewTheme === 'green' ? 'bg-green-500' : (crewTheme === 'blue' ? 'bg-blue-500' : 'bg-slate-500');
    case 'malam':
      return 'bg-purple-500';
    case 'libur':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};
