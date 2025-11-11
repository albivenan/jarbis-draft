import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Eye, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription} from '@/components/ui/dialog';
import EmployeeScheduleCalendar from './EmployeeScheduleCalendar';

interface KaryawanRekap {
  id: number;
  name: string;
  nik: string;
  department: string;
  hadir: number;
  terlambat: number;
  alpha: number;
  izin: number;
  sakit: number;
  attendance_rate: number;
}

interface DaftarKaryawanTabProps {
  departments: string[];
}

export default function DaftarKaryawanTab({ departments }: DaftarKaryawanTabProps) {
  const { toast } = useToast();
  const [records, setRecords] = useState<KaryawanRekap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const url = new URL(route('api.presensi.karyawan-rekap'));
      if (selectedDepartment !== 'all') {
        url.searchParams.set('department', selectedDepartment);
      }
      if (searchTerm) {
        url.searchParams.set('search', searchTerm);
      }

      const response = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      });

      if (!response.ok) throw new Error('Network response was not ok.');

      const result = await response.json();
      if (result.success) {
        setRecords(result.data);
      } else {
        toast({ title: 'Gagal Memuat Data Karyawan', description: result.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Tidak dapat terhubung ke server.', variant: 'destructive' });
      console.error("Failed to fetch employee rekap data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData();
    }, 500); // Debounce search and filter

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, selectedDepartment]);

  const getPerformanceColor = (rate: number) => {
    if (rate >= 95) return 'bg-green-500';
    if (rate >= 85) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari nama atau NIK karyawan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Pilih Departemen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Departemen</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rekap Kehadiran Karyawan (30 Hari Terakhir)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Karyawan</TableHead>
                  <TableHead>Departemen</TableHead>
                  <TableHead className="text-center">Tingkat Kehadiran</TableHead>
                  <TableHead className="text-center">Hadir</TableHead>
                  <TableHead className="text-center">Terlambat</TableHead>
                  <TableHead className="text-center">Alpha</TableHead>
                  <TableHead className="text-center">Izin/Sakit</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8">Memuat data...</TableCell></TableRow>
                ) : records.length > 0 ? (
                  records.map((karyawan) => (
                    <TableRow key={karyawan.id}>
                      <TableCell className="font-medium">
                        <div>{karyawan.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{karyawan.nik}</div>
                      </TableCell>
                      <TableCell>{karyawan.department}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getPerformanceColor(karyawan.attendance_rate)}`}></div>
                          <span>{karyawan.attendance_rate}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">{karyawan.hadir}</TableCell>
                      <TableCell className="text-center font-medium text-yellow-600">{karyawan.terlambat}</TableCell>
                      <TableCell className="text-center font-medium text-red-600">{karyawan.alpha}</TableCell>
                      <TableCell className="text-center font-medium text-blue-600">{karyawan.izin + karyawan.sakit}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedEmployeeId(karyawan.id)}><Eye className="h-3 w-3 mr-1" />Riwayat</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Riwayat Presensi {records.find(r => r.id === selectedEmployeeId)?.name}</DialogTitle>
                                <DialogDescription>Lihat dan kelola riwayat presensi karyawan.</DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                {selectedEmployeeId && (
                                  <EmployeeScheduleCalendar
                                    employeeId={selectedEmployeeId}
                                    employeeName={records.find(r => r.id === selectedEmployeeId)?.name || ''}
                                  />
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <a href={route('hrd.manajemen-presensi.jadwal')}>
                            <Button variant="ghost" size="sm"><Calendar className="h-3 w-3 mr-1" />Jadwal</Button>
                          </a>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={8} className="text-center py-16">Tidak ada data karyawan.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
