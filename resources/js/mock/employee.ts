export type ShiftType = 'Pagi' | 'Siang' | 'Malam';

export interface EmployeeScheduleItem {
  id: number;
  date: string; // YYYY-MM-DD
  shift: ShiftType;
  start: string; // HH:mm
  end: string; // HH:mm
  activity: string;
  location?: string;
  notes?: string;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getShiftForIndex(index: number): ShiftType {
  const shifts: ShiftType[] = ['Pagi', 'Siang', 'Pagi', 'Malam', 'Pagi', 'Siang', 'Pagi'];
  return shifts[index % shifts.length];
}

function shiftToTime(shift: ShiftType): { start: string; end: string } {
  switch (shift) {
    case 'Pagi':
      return { start: '08:00', end: '16:00' };
    case 'Siang':
      return { start: '12:00', end: '20:00' };
    case 'Malam':
      return { start: '20:00', end: '04:00' };
  }
}

const activities = ['Produksi Line A', 'QC Inspeksi', 'Pemeliharaan', 'Pelatihan', 'Briefing', 'Administrasi'];
const locations = ['Plant 1', 'Gudang', 'Kantor', 'Line A', 'Line B'];

export function getEmployeeSchedule(): EmployeeScheduleItem[] {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 7);
  const end = new Date(today);
  end.setDate(today.getDate() + 21);

  const items: EmployeeScheduleItem[] = [];
  let id = 1;
  for (let d = new Date(start), i = 0; d <= end; d.setDate(d.getDate() + 1), i++) {
    const dateStr = formatDate(d);
    const shift = getShiftForIndex(i);
    const t = shiftToTime(shift);
    items.push({
      id: id++,
      date: dateStr,
      shift,
      start: t.start,
      end: t.end,
      activity: activities[i % activities.length],
      location: locations[i % locations.length],
      notes: i % 5 === 0 ? 'Rotasi tugas' : undefined,
    });
  }
  return items;
}

