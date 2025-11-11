import { useState, useEffect } from 'react';
import axios from 'axios';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Calendar, 
  Search, 
  Users,
  Briefcase,
  Clock,
  Edit,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2
} from 'lucide-react';

interface IdentitasKaryawan {
  nik: string;
  departemen: string;
  jabatan: string;
}

interface Employee {
  id: string;
  id_karyawan: string;
  name: string;
  email: string;
  role: string;
  identitas_karyawan: IdentitasKaryawan | null;
}

interface ScheduleTemplate {
  id: string;
  position: string;
  dayOfWeek: string;
  shift: string;
  checkInTime: string;
  checkOutTime: string;
  status_kehadiran?: string;
  catatan?: string;
}

interface DaySchedule {
  date: string;
  shift: string;
  checkInTime: string;
  checkOutTime: string;
}

export default function PengaturanJadwalPage() {
  const [activeTab, setActiveTab] = useState('karyawan');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  // Calendar modal states
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  
  // Schedule edit states
  const [editShift, setEditShift] = useState('pagi');
  const [editCheckIn, setEditCheckIn] = useState('08:00');
  const [editCheckOut, setEditCheckOut] = useState('17:00');
  const [editStatusKehadiran, setEditStatusKehadiran] = useState('hadir');
  const [editCatatan, setEditCatatan] = useState<string | null>(null);

  // Template states
  const [selectedTemplatePositionId, setSelectedTemplatePositionId] = useState<string | null>(null);
  const [templateSchedules, setTemplateSchedules] = useState<ScheduleTemplate[]>([]);

  const handleTemplateScheduleChange = (
    index: number,
    field: keyof ScheduleTemplate,
    value: string
  ) => {
    setTemplateSchedules(prevSchedules =>
      prevSchedules.map((schedule, i) =>
        i === index ? { ...schedule, [field]: value } : schedule
      )
    );
  };

  const handleAddTemplateSchedule = () => {
    const newSchedule: ScheduleTemplate = {
      id: Date.now().toString(),
      position: selectedTemplatePosition || '',
      dayOfWeek: templateDayOfWeek,
      shift: templateShift,
      checkInTime: templateCheckIn,
      checkOutTime: templateCheckOut,
      status_kehadiran: 'hadir',
      catatan: ''
    };
    setTemplateSchedules(prev => [...prev, newSchedule]);
  };

  const handleRemoveTemplateSchedule = (index: number) => {
    setTemplateSchedules(prev => prev.filter((_, i) => i !== index));
  };

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplatePosition, setSelectedTemplatePosition] = useState<string | null>(null);
  const [templateDayOfWeek, setTemplateDayOfWeek] = useState('senin');
  const [templateShift, setTemplateShift] = useState('pagi');
  const [templateCheckIn, setTemplateCheckIn] = useState('08:00');
  const [templateCheckOut, setTemplateCheckOut] = useState('17:00');

  const breadcrumbs = [
    { title: 'Dashboard', href: '/roles/manajer-hrd' },
    { title: 'Manajemen Absensi', href: '#' },
    { title: 'Pengaturan Jadwal', href: '/roles/manajer-hrd/absensi/jadwal' }
  ];

interface Position {
    id: string;
    nama_jabatan: string;
}

  useEffect(() => {
      axios.get('/api/departments')
          .then(response => {
              setDepartments(['all', ...response.data.map((dept: { nama_departemen: string }) => dept.nama_departemen)]);
          })
          .catch(error => {
              console.error('Error fetching departments:', error);
          });

      axios.get('/api/positions')
          .then(response => {
              setPositions([{ id: 'all', nama_jabatan: 'Semua Posisi' }, ...response.data]);
          })
          .catch(error => {
              console.error('Error fetching positions:', error);
          });

      axios.get('/api/employees')
          .then(response => {
              setEmployees(response.data);
          })
          .catch(error => {
              console.error('Error fetching employees:', error);
          });
  }, []);

  useEffect(() => {
      const filtered = employees.filter(employee => {
          const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (employee.identitas_karyawan?.nik?.toLowerCase().includes(searchTerm.toLowerCase())) ||
              employee.id_karyawan.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesDepartment = selectedDepartment === 'all' || employee.identitas_karyawan?.rincian_pekerjaan?.departemen?.nama_departemen === selectedDepartment;
          const matchesPosition = selectedPosition === 'all' || employee.identitas_karyawan?.rincian_pekerjaan?.jabatan?.id_jabatan === selectedPosition;
          return matchesSearch && matchesDepartment && matchesPosition;
      });
      setFilteredEmployees(filtered);
  }, [employees, searchTerm, selectedDepartment, selectedPosition]);

  useEffect(() => {
      if (selectedPosition && selectedPosition !== 'all') {
          axios.get(`/api/jadwal/pola/${selectedPosition}`)
              .then(response => {
                  setTemplateSchedules(response.data);
              })
              .catch(error => {
                  console.error('Error fetching template schedules:', error);
                  setTemplateSchedules([]);
              });
      } else {
          setTemplateSchedules([]);
      }
  }, [selectedPosition]);
  const shifts = ['pagi', 'siang', 'malam'];
  const daysOfWeek = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
  const statusKehadiranOptions = ['hadir', 'izin', 'sakit', 'cuti', 'libur', 'lepas'];

  // Mock employee data
  const mockEmployees: Employee[] = [
    {
      id: '1',
      employeeId: 'EMP-001',
      name: 'Ahmad Yusuf',
      nik: '3201234567890001',
      department: 'Produksi Besi',
      position: 'Crew Besi'
    },
    {
      id: '2',
      employeeId: 'EMP-002',
      name: 'Budi Santoso',
      nik: '3201234567890002',
      department: 'Produksi Kayu',
      position: 'Crew Kayu'
    },
    {
      id: '3',
      employeeId: 'EMP-003',
      name: 'Sari Dewi',
      nik: '3201234567890003',
      department: 'QC',
      position: 'QC Inspector'
    },
    {
      id: '4',
      employeeId: 'EMP-004',
      name: 'Eko Prasetyo',
      nik: '3201234567890004',
      department: 'Produksi Besi',
      position: 'Supervisor'
    },
    {
      id: '5',
      employeeId: 'EMP-005',
      name: 'Dian Sari',
      nik: '3201234567890005',
      department: 'HRD',
      position: 'Staff'
    }
  ];

  // Mock schedule templates
  const mockTemplates: ScheduleTemplate[] = [
    {
      id: '1',
      position: 'Crew Besi',
      dayOfWeek: 'senin',
      shift: 'pagi',
      checkInTime: '08:00',
      checkOutTime: '17:00'
    },
    {
      id: '2',
      position: 'Crew Kayu',
      dayOfWeek: 'senin',
      shift: 'pagi',
      checkInTime: '08:00',
      checkOutTime: '17:00'
    }
  ];

  // const filteredEmployees = mockEmployees.filter(employee => {
  //   const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     employee.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
  //   const matchesPosition = selectedPosition === 'all' || employee.position === selectedPosition;
  //   return matchesSearch && matchesDepartment && matchesPosition;
  // });

  const handleOpenCalendar = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowCalendarModal(true);
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setShowEditScheduleModal(true);
  };

  const handleSaveSchedule = () => {
    if (!selectedEmployee || !selectedDate) {
      alert('Karyawan atau tanggal belum dipilih.');
      return;
    }

    router.post(route('jadwal.harian.store'), {
      id_karyawan: selectedEmployee.id,
      tanggal: selectedDate,
      jam_masuk: editCheckIn,
      jam_keluar: editCheckOut,
      shift: editShift,
      status_kehadiran: editStatusKehadiran,
      catatan: editCatatan,
    }, {
      onSuccess: () => {
        alert('Jadwal harian berhasil disimpan!');
        setShowEditScheduleModal(false);
      },
      onError: (errors: Record<string, string>) => {
        console.error('Gagal menyimpan jadwal harian:', errors);
        alert('Gagal menyimpan jadwal harian. Silakan coba lagi.');
      }
    });
  };

  const handleOpenTemplateModal = (positionId: string, positionName: string) => {
    setSelectedTemplatePositionId(positionId);
    setSelectedTemplatePosition(positionName);
    setShowTemplateModal(true);
  };

  const handleSaveTemplate = () => {
    if (!selectedTemplatePositionId) {
      alert('Posisi template belum dipilih.');
      return;
    }

    router.post(route('jadwal.pola.store'), {
      id_jabatan: selectedTemplatePositionId,
      pola_jadwal: templateSchedules.map(schedule => ({
        hari_dalam_minggu: schedule.dayOfWeek,
        shift: schedule.shift,
        jam_masuk: schedule.checkInTime,
        jam_keluar: schedule.checkOutTime,
      })),
    }, {
      onSuccess: () => {
        alert('Pola jadwal berhasil disimpan!');
        setShowTemplateModal(false);
      },
            onError: (errors: Record<string, string>) => {
        console.error('Gagal menyimpan pola jadwal:', errors);
        alert('Gagal menyimpan pola jadwal. Silakan coba lagi.');
      }
    });
  };

  const [showApplyTemplateModal, setShowApplyTemplateModal] = useState(false);
  const [applyTemplateStartDate, setApplyTemplateStartDate] = useState<string>('');
  const [applyTemplateEndDate, setApplyTemplateEndDate] = useState<string>('');
  const [selectedApplyTemplatePositionId, setSelectedApplyTemplatePositionId] = useState<string | null>(null);

  const handleApplyTemplate = (positionId: string, positionName: string) => {
    setSelectedApplyTemplatePositionId(positionId);
    setSelectedTemplatePosition(positionName); // Re-use this state for display in apply modal
    setShowApplyTemplateModal(true);
  };

  const handleConfirmApplyTemplate = () => {
    if (!selectedApplyTemplatePositionId || !applyTemplateStartDate || !applyTemplateEndDate) {
      alert('Mohon lengkapi semua kolom tanggal.');
      return;
    }

    router.post(route('jadwal.pola.terapkan'), {
      id_jabatan: selectedApplyTemplatePositionId,
      tanggal_mulai: applyTemplateStartDate,
      tanggal_akhir: applyTemplateEndDate,
      id_karyawan: [], // Apply to all employees in this position
    }, {
      onSuccess: () => {
        alert('Pola jadwal berhasil diterapkan!');
        setShowApplyTemplateModal(false);
      },
            onError: (errors: Record<string, string>) => {
        console.error('Gagal menerapkan pola jadwal:', errors);
        alert('Gagal menerapkan pola jadwal. Silakan coba lagi.');
      }
    });
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push(
        <div
          key={day}
          className="p-2 border hover:bg-gray-50 cursor-pointer min-h-[80px]"
          onClick={() => handleDateClick(dateStr)}
        >
          <div className="font-semibold text-sm">{day}</div>
          <div className="text-xs text-gray-600 mt-1">
            <div>Shift: Pagi</div>
            <div>08:00 - 17:00</div>
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <AuthenticatedLayout
      title="Pengaturan Jadwal"
      breadcrumbs={breadcrumbs}
    >
      <Head title="Pengaturan Jadwal - Manajer HRD" />

      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="karyawan">
              <Users className="h-4 w-4 mr-2" />
              Daftar Karyawan
            </TabsTrigger>
            <TabsTrigger value="jabatan">
              <Briefcase className="h-4 w-4 mr-2" />
              Jadwal Per Jabatan
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Daftar Karyawan */}
          <TabsContent value="karyawan" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Cari berdasarkan nama, NIK, atau ID karyawan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Pilih Departemen" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>
                          {dept === 'all' ? 'Semua Departemen' : dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Pilih Jabatan" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(pos => (
                        <SelectItem key={pos.id} value={pos.id}>
                          {pos.id === 'all' ? 'Semua Jabatan' : pos.nama_jabatan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Employee List */}
            <Card>
              <CardHeader>
                <CardTitle>Daftar Karyawan ({filteredEmployees.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">ID Karyawan</th>
                        <th className="text-left p-3 font-semibold">Nama</th>
                        <th className="text-left p-3 font-semibold">NIK</th>
                        <th className="text-left p-3 font-semibold">Departemen</th>
                        <th className="text-left p-3 font-semibold">Jabatan</th>
                        <th className="text-left p-3 font-semibold">Tgl. Bergabung</th>
                        <th className="text-left p-3 font-semibold">Status Karyawan</th>
                        <th className="text-left p-3 font-semibold">Status Akun</th>
                        <th className="text-left p-3 font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                          <tr key={employee.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-mono text-sm">{employee.id_karyawan}</td>
                            <td className="p-3 font-medium">{employee.name}</td>
                            <td className="p-3 font-mono text-sm">{employee.identitas_karyawan?.nik_ktp}</td>
                            <td className="p-3">{employee.identitas_karyawan?.rincian_pekerjaan?.departemen?.nama_departemen}</td>
                            <td className="p-3">{employee.identitas_karyawan?.rincian_pekerjaan?.jabatan?.nama_jabatan}</td>
                            <td className="p-3 text-sm">{employee.identitas_karyawan?.rincian_pekerjaan?.tanggal_bergabung}</td>
                            <td className="p-3 text-sm">
                              <Badge variant="outline">
                                {employee.identitas_karyawan?.rincian_pekerjaan?.status_karyawan}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm">
                              <Badge variant={employee.status === 'Aktif' ? 'default' : 'destructive'}>
                                {employee.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenCalendar(employee)}
                              >
                                <Calendar className="h-3 w-3 mr-1" />
                                Atur Jadwal
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-gray-500">
                            Tidak ada karyawan yang sesuai dengan kriteria pencarian
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Jadwal Per Jabatan */}
          <TabsContent value="jabatan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Jadwal Per Jabatan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {positions.filter(p => p.id !== 'all').map((position) => (
                    <Card key={position.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{position.nama_jabatan}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                              Atur jadwal default untuk semua karyawan dengan jabatan ini
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenTemplateModal(position.id, position.nama_jabatan)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit Template
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleApplyTemplate(position.id, position.nama_jabatan)}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Terapkan ke Semua
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-7 gap-2">
                          {daysOfWeek.map((day) => {
                            const template = mockTemplates.find(
                              t => t.position === position.nama_jabatan && t.dayOfWeek === day
                            );
                            return (
                              <div key={day} className="border rounded p-2">
                                <div className="font-semibold text-sm capitalize mb-1">{day}</div>
                                {template ? (
                                  <div className="text-xs text-gray-600">
                                    <div>Shift: {template.shift}</div>
                                    <div>{template.checkInTime} - {template.checkOutTime}</div>
                                  </div>
                                ) : (
                                  <div className="text-xs text-gray-500">Tidak ada jadwal</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Calendar Modal */}
        <Dialog open={showCalendarModal} onOpenChange={setShowCalendarModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                Atur Jadwal - {selectedEmployee?.name}
              </DialogTitle>
              <DialogDescription>
                Klik pada tanggal untuk mengatur jadwal kerja karyawan
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-semibold">{formatMonthYear(currentMonth)}</h3>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-0 border">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                  <div key={day} className="p-2 border font-semibold text-center bg-gray-50">
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>

              {/* Bulk Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Atur Jadwal Massal
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCalendarModal(false)}>
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Schedule Modal */}
        <Dialog open={showEditScheduleModal} onOpenChange={setShowEditScheduleModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Jadwal Harian</DialogTitle>
              <DialogDescription>
                Edit jadwal untuk {selectedEmployee?.name} pada {selectedDate}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shift" className="text-right">Shift</Label>
                <Select value={editShift} onValueChange={setEditShift}>
                  <SelectTrigger id="shift" className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shifts.map(shift => (
                      <SelectItem key={shift} value={shift} className="capitalize">
                        {shift}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="checkIn" className="text-right">Jam Masuk</Label>
                <Input
                  id="checkIn"
                  type="time"
                  className="col-span-3"
                  value={editCheckIn}
                  onChange={e => setEditCheckIn(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="checkOut" className="text-right">Jam Keluar</Label>
                <Input
                  id="checkOut"
                  type="time"
                  className="col-span-3"
                  value={editCheckOut}
                  onChange={e => setEditCheckOut(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="statusKehadiran" className="text-right">Status Kehadiran</Label>
                <Select value={editStatusKehadiran} onValueChange={setEditStatusKehadiran}>
                  <SelectTrigger id="statusKehadiran" className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusKehadiranOptions.map(status => (
                      <SelectItem key={status} value={status} className="capitalize">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="catatan" className="text-right">Catatan</Label>
                <Input
                  id="catatan"
                  type="text"
                  className="col-span-3"
                  value={editCatatan || ''}
                  onChange={e => setEditCatatan(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditScheduleModal(false)}>
                Batal
              </Button>
              <Button onClick={handleSaveSchedule}>
                Simpan Jadwal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Template Modal */}
        <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Template Jadwal</DialogTitle>
              <DialogDescription>
                Atur template jadwal untuk jabatan {selectedTemplatePosition}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {templateSchedules.map((schedule, index) => (
                <div key={index} className="flex items-end space-x-2">
                  <div className="grid gap-2 flex-grow">
                    <Label htmlFor={`templateDay-${index}`}>Hari</Label>
                    <Select
                      value={schedule.dayOfWeek}
                      onValueChange={value =>
                        handleTemplateScheduleChange(index, 'dayOfWeek', value)
                      }
                    >
                      <SelectTrigger id={`templateDay-${index}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map(day => (
                          <SelectItem key={day} value={day} className="capitalize">
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`templateShift-${index}`}>Shift</Label>
                    <Input
                      id={`templateShift-${index}`}
                      value={schedule.shift || ''}
                      onChange={e =>
                        handleTemplateScheduleChange(index, 'shift', e.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`templateCheckIn-${index}`}>Jam Masuk</Label>
                    <Input
                      id={`templateCheckIn-${index}`}
                      type="time"
                      value={schedule.checkInTime || ''}
                      onChange={e =>
                        handleTemplateScheduleChange(index, 'checkInTime', e.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`templateCheckOut-${index}`}>Jam Keluar</Label>
                    <Input
                      id={`templateCheckOut-${index}`}
                      type="time"
                      value={schedule.checkOutTime || ''}
                      onChange={e =>
                        handleTemplateScheduleChange(index, 'checkOutTime', e.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`templateStatus-${index}`}>Status Kehadiran</Label>
                    <Select
                      value={schedule.status_kehadiran}
                      onValueChange={value =>
                        handleTemplateScheduleChange(index, 'status_kehadiran', value)
                      }
                    >
                      <SelectTrigger id={`templateStatus-${index}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['hadir', 'izin', 'sakit', 'cuti', 'libur', 'lepas'].map(status => (
                          <SelectItem key={status} value={status} className="capitalize">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`templateCatatan-${index}`}>Catatan</Label>
                    <Input
                      id={`templateCatatan-${index}`}
                      value={schedule.catatan || ''}
                      onChange={e =>
                        handleTemplateScheduleChange(index, 'catatan', e.target.value)
                      }
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveTemplateSchedule(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={handleAddTemplateSchedule}>
                Tambah Pola Jadwal
              </Button>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTemplateModal(false)}>
                Batal
              </Button>
              <Button onClick={handleSaveTemplate}>
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Dialog open={showApplyTemplateModal} onOpenChange={setShowApplyTemplateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terapkan Pola Jadwal</DialogTitle>
            <DialogDescription>
              Terapkan pola jadwal untuk jabatan {selectedTemplatePosition} pada rentang tanggal tertentu.
            </DialogDescription>
          </DialogHeader>
      
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Tanggal Mulai
              </Label>
              <Input
                id="startDate"
                type="date"
                className="col-span-3"
                value={applyTemplateStartDate}
                onChange={e => setApplyTemplateStartDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                Tanggal Akhir
              </Label>
              <Input
                id="endDate"
                type="date"
                className="col-span-3"
                value={applyTemplateEndDate}
                onChange={e => setApplyTemplateEndDate(e.target.value)}
              />
            </div>
          </div>
      
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyTemplateModal(false)}>
              Batal
            </Button>
            <Button onClick={handleConfirmApplyTemplate}>
              Terapkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
