import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Search, FileDown, Eye, Users, BarChart3, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RekapAbsensiTab from './components/RekapAbsensiTab';
import DaftarKaryawanTab from './components/DaftarKaryawanTab';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  checkIn: string;
  checkOut: string;
  status: string;
  notes?: string;
}

import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface PageProps extends InertiaPageProps {
  initialAttendanceData: AttendanceRecord[];
  departments: string[];
  errors: any; // Add errors prop
  [key: string]: any;
}

export default function PresensiPage() {
  const { initialAttendanceData, departments, errors } = usePage<PageProps>().props;
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('harian');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [records, setRecords] = useState<AttendanceRecord[]>(initialAttendanceData || []);
  const [isLoading, setIsLoading] = useState(false);
  
  // Safe departments array
  const departmentsList = Array.isArray(departments) ? departments : [];

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const url = new URL(route('api.presensi.attendance-data'));
      url.searchParams.set('date', selectedDate);
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
        toast({ title: 'Gagal Memuat Data', description: result.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Tidak dapat terhubung ke server.', variant: 'destructive' });
      console.error("Failed to fetch attendance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    if (activeTab !== 'harian') return;
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }
    const handler = setTimeout(() => {
        fetchAttendance();
    }, 500); // Debounce search input

    return () => {
        clearTimeout(handler);
    };
  }, [selectedDate, selectedDepartment, searchTerm, activeTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hadir': return 'bg-green-100 text-green-800';
      case 'terlambat': return 'bg-yellow-100 text-yellow-800';
      case 'izin': return 'bg-blue-100 text-blue-800';
      case 'sakit': return 'bg-purple-100 text-purple-800';
      case 'alpha': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hadir': return <CheckCircle className="h-4 w-4" />;
      case 'terlambat': return <Clock className="h-4 w-4" />;
      case 'izin':
      case 'sakit':
      case 'alpha':
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <AuthenticatedLayout
      title="Presensi"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/hrd' },
        { title: 'Manajemen Presensi', href: '#' },
        { title: 'Presensi', href: route('hrd.manajemen-presensi.presensi') }
      ]}
    >
      <Head title="Presensi - Manajer HRD" />

      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="harian"><Calendar className="h-4 w-4 mr-2" />Presensi Harian</TabsTrigger>
            <TabsTrigger value="rekap"><BarChart3 className="h-4 w-4 mr-2" />Rekap Absensi</TabsTrigger>
            <TabsTrigger value="karyawan"><Users className="h-4 w-4 mr-2" />Daftar Karyawan</TabsTrigger>
          </TabsList>

          <TabsContent value="harian" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border-gray-300 rounded-md"
                    />
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Pilih Departemen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Departemen</SelectItem>
                      {departmentsList.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari nama karyawan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline"><FileDown className="h-4 w-4 mr-2" />Export</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Absensi - {new Date(selectedDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Karyawan</TableHead>
                        <TableHead>Departemen</TableHead>
                        <TableHead>Jam Masuk</TableHead>
                        <TableHead>Jam Keluar</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Keterangan</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8">Memuat data...</TableCell></TableRow>
                      ) : records.length > 0 ? (
                        records.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.employeeName}</TableCell>
                            <TableCell>{record.department}</TableCell>
                            <TableCell>{record.checkIn}</TableCell>
                            <TableCell>{record.checkOut}</TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(record.status)} flex items-center gap-1 w-fit`}>
                                {getStatusIcon(record.status)}
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">{record.notes}</TableCell>
                            <TableCell><Button variant="outline" size="sm"><Eye className="h-3 w-3 mr-1" />Detail</Button></TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow><TableCell colSpan={7} className="text-center py-16">Tidak ada data absensi.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="rekap">
            <RekapAbsensiTab />
          </TabsContent>
          <TabsContent value="karyawan">
            <DaftarKaryawanTab departments={departmentsList} />
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
