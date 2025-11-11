import { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Filter,
  Calendar,
  Loader2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiGet, apiPost, getErrorMessage, formatApiErrors } from '@/lib/api';
import { validateApprovalNotes } from '@/lib/validation';
import { TableLoadingState } from '@/components/ui/loading-spinner';
import { EmptyState, TableEmptyState } from '@/components/ui/empty-state';

interface Pengajuan {
  id: number;
  id_presensi: number;
  employee_name: string;
  employee_id: string;
  tanggal: string;
  jenis_pengajuan: 'lembur' | 'izin_terlambat' | 'izin_pulang_awal' | 'izin_tidak_masuk';
  alasan_pengajuan: string;
  status_pengajuan: 'pending' | 'approved' | 'rejected';
  jam_lembur_mulai: string | null;
  jam_lembur_selesai: string | null;
  waktu_pengajuan_izin: string | null;
  tanggal_pengajuan: string;
  approved_by: string | null;
  tanggal_approval: string | null;
  catatan_approval: string | null;
  // Additional properties for compatibility
  status?: 'pending' | 'approved' | 'rejected';
  jenis_izin?: string;
  tanggal_izin?: string;
  waktu_izin?: string;
  tanggal_lembur?: string;
  jam_mulai?: string;
  jam_selesai?: string;
  durasi_jam?: number;
  alasan?: string;
  requested_at?: string;
  approved_at?: string;
  notes?: string;
}

interface PageProps extends Record<string, any> {
  initialRequests: Pengajuan[];
}

export default function PengajuanPage() {
  const { initialRequests } = usePage<PageProps>().props;
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('masuk');
  const [requests, setRequests] = useState<Pengajuan[]>(initialRequests || []);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Pengajuan | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // History filters
  const [historyStatus, setHistoryStatus] = useState<'all' | 'approved' | 'rejected'>('all');
  const [historyDateFrom, setHistoryDateFrom] = useState('');
  const [historyDateTo, setHistoryDateTo] = useState('');
  const [historyEmployee, setHistoryEmployee] = useState('');

  const breadcrumbs = [
    { title: 'Dashboard', href: '/roles/manajer-hrd' },
    { title: 'Manajemen Absensi', href: '#' },
    { title: 'Pengajuan Izin & Lembur', href: '/roles/manajer-hrd/absensi/pengajuan' },
  ];

  // Fetch requests from API
  const fetchRequests = async (initialTabStatus = 'pending', isHistory = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (isHistory) {
        if (historyStatus !== 'all') {
          params.append('status', historyStatus);
        } else {
          params.append('status', 'all'); // Ensure 'status=all' is sent when historyStatus is 'all'
        }
        if (historyDateFrom) params.append('date_from', historyDateFrom);
        if (historyDateTo) params.append('date_to', historyDateTo);
        if (historyEmployee) params.append('employee', historyEmployee);
      } else {
        params.append('status', initialTabStatus);
      }

      const response = await apiGet(`/api/hrd/requests?${params.toString()}`);
      
      if (response.success && response.data) {
        setRequests(response.data);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      const errorMessage = getErrorMessage(error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = () => {
    fetchRequests(activeTab, true);
  };

  useEffect(() => {
    if (activeTab === 'masuk') {
      setRequests(initialRequests.filter(r => r.status_pengajuan === 'pending') || []);
    } else if (activeTab === 'riwayat') {
      fetchHistory();
    } else {
      fetchRequests(activeTab);
    }
  }, [activeTab, initialRequests, historyStatus, historyDateFrom, historyDateTo, historyEmployee]);

  const pendingCount = requests.filter(r => r.status_pengajuan === 'pending').length;

  const handleApprove = (request: Pengajuan) => {
    setSelectedRequest(request);
    setApprovalAction('approve');
    setApprovalNotes('');
    setShowApprovalModal(true);
  };

  const handleReject = (request: Pengajuan) => {
    setSelectedRequest(request);
    setApprovalAction('reject');
    setApprovalNotes('');
    setShowApprovalModal(true);
  };

  const handleViewDetail = (request: Pengajuan, type: 'permission' | 'overtime') => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const submitApproval = async () => {
    if (!selectedRequest) return;
    
    const validation = validateApprovalNotes(approvalNotes, approvalAction);
    if (!validation.isValid) {
      toast({
        title: 'Validasi Gagal',
        description: validation.errors.map(e => e.message).join('\n'),
        variant: 'destructive',
      });
      return;
    }
    
    setProcessing(true);
    try {
      const endpoint = '/api/hrd/approve-request';
      
      const data = await apiPost(endpoint, {
        id_presensi: selectedRequest.id_presensi,
        action: approvalAction,
        catatan_approval: approvalNotes,
      });
      
      if (data.success) {
        toast({
          title: 'Berhasil',
          description: `Pengajuan berhasil ${approvalAction === 'approve' ? 'disetujui' : 'ditolak'}`,
        });
        setShowApprovalModal(false);
        setApprovalNotes('');
        
        // Refresh data
        activeTab === 'masuk' ? fetchRequests('pending') : fetchHistory();
      }
    } catch (error) {
      console.error('Error processing approval:', error);
      const errorMessage = getErrorMessage(error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const getRequestType = (request: Pengajuan): 'permission' | 'overtime' => {
    return request.jenis_pengajuan === 'lembur' ? 'overtime' : 'permission';
  };

  const getJenisLabel = (jenis: string) => {
    const labels: Record<string, string> = {
      'terlambat': 'Izin Terlambat',
      'pulang_awal': 'Izin Pulang Awal',
      'tidak_masuk': 'Izin Tidak Masuk',
      'izin_terlambat': 'Izin Terlambat',
      'izin_pulang_awal': 'Izin Pulang Awal',
      'izin_tidak_masuk': 'Izin Tidak Masuk',
    };
    return labels[jenis] || jenis;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'pending': 'secondary',
      'approved': 'default',
      'rejected': 'destructive',
    };
    
    const labels: Record<string, string> = {
      'pending': 'Menunggu',
      'approved': 'Disetujui',
      'rejected': 'Ditolak',
    };
    
    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter requests based on search term and type
  const filteredRequests = requests.filter(req => 
    req.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPermissionRequests = filteredRequests.filter(r => r.jenis_pengajuan !== 'lembur');
  const filteredOvertimeRequests = filteredRequests.filter(r => r.jenis_pengajuan === 'lembur');

  return (
    <AuthenticatedLayout breadcrumbs={breadcrumbs}>
      <Head title="Pengajuan Izin & Lembur" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pengajuan Izin & Lembur</h1>
            <p className="text-muted-foreground">
              Kelola pengajuan izin dan lembur dari karyawan
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="masuk" className="relative">
              <Clock className="mr-2 h-4 w-4" />
              Pengajuan Masuk
              {pendingCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="riwayat">
              <FileText className="mr-2 h-4 w-4" />
              Riwayat
            </TabsTrigger>
          </TabsList>

          {/* Tab: Pengajuan Masuk */}
          <TabsContent value="masuk" className="space-y-4">
            {/* Search and filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Pengajuan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Cari nama atau NIK karyawan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button onClick={() => fetchRequests('pending')} variant="outline">
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Permission Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Pengajuan Izin
                  {filteredPermissionRequests.length > 0 && (
                    <Badge variant="secondary">{filteredPermissionRequests.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <TableLoadingState text="Memuat data pengajuan izin..." />
                ) : filteredPermissionRequests.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="Belum ada riwayat"
                    description="Belum ada pengajuan izin yang telah diproses"
                  />
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama</TableHead>
                          <TableHead>NIK</TableHead>
                          <TableHead>Jenis</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Alasan</TableHead>
                          <TableHead>Diajukan</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPermissionRequests
                          .filter(r => !historyEmployee || 
                            r.employee_name.toLowerCase().includes(historyEmployee.toLowerCase()) ||
                            r.employee_id.toLowerCase().includes(historyEmployee.toLowerCase())
                          )
                          .filter(r => !historyDateFrom || (r.tanggal_izin && new Date(r.tanggal_izin) >= new Date(historyDateFrom)))
                          .filter(r => !historyDateTo || (r.tanggal_izin && new Date(r.tanggal_izin) <= new Date(historyDateTo)))
                          .map((request) => (
                            <TableRow key={request.id_presensi}>
                              <TableCell className="font-medium">{request.employee_name}</TableCell>
                              <TableCell>{request.employee_id}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{getJenisLabel(request.jenis_pengajuan)}</Badge>
                              </TableCell>
                              <TableCell>{formatDate(request.tanggal)}</TableCell>
                              <TableCell className="max-w-xs truncate">{request.alasan_pengajuan}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {formatDateTime(request.tanggal_pengajuan)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewDetail(request, 'permission')}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleApprove(request)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Terima
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleReject(request)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Tolak
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Overtime Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pengajuan Lembur
                  {filteredOvertimeRequests.length > 0 && (
                    <Badge variant="secondary">{filteredOvertimeRequests.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <TableLoadingState text="Memuat data pengajuan lembur..." />
                ) : filteredOvertimeRequests.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="Belum ada riwayat"
                    description="Belum ada pengajuan lembur yang telah diproses"
                  />
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama</TableHead>
                          <TableHead>NIK</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Jam</TableHead>
                          <TableHead>Alasan</TableHead>
                          <TableHead>Diajukan</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOvertimeRequests
                          .filter(r => !historyEmployee || 
                            r.employee_name.toLowerCase().includes(historyEmployee.toLowerCase()) ||
                            r.employee_id.toLowerCase().includes(historyEmployee.toLowerCase())
                          )
                          .filter(r => !historyDateFrom || (r.tanggal_lembur && new Date(r.tanggal_lembur) >= new Date(historyDateFrom)))
                          .filter(r => !historyDateTo || (r.tanggal_lembur && new Date(r.tanggal_lembur) <= new Date(historyDateTo)))
                          .map((request) => (
                            <TableRow key={request.id_presensi}>
                              <TableCell className="font-medium">{request.employee_name}</TableCell>
                              <TableCell>{request.employee_id}</TableCell>
                              <TableCell>{formatDate(request.tanggal)}</TableCell>
                              <TableCell>
                                {request.jam_lembur_mulai} - {request.jam_lembur_selesai}
                              </TableCell>
                              <TableCell className="max-w-xs truncate">{request.alasan_pengajuan}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {formatDateTime(request.tanggal_pengajuan)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewDetail(request, 'overtime')}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleApprove(request)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Terima
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleReject(request)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Tolak
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Riwayat */}
          <TabsContent value="riwayat" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Riwayat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="status-filter">Status</Label>
                    <Select value={historyStatus} onValueChange={(value: any) => setHistoryStatus(value)}>
                      <SelectTrigger id="status-filter">
                        <SelectValue placeholder="Semua Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="approved">Disetujui</SelectItem>
                        <SelectItem value="rejected">Ditolak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="date-from">Tanggal Dari</Label>
                    <Input
                      id="date-from"
                      type="date"
                      value={historyDateFrom}
                      onChange={(e) => setHistoryDateFrom(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="date-to">Tanggal Sampai</Label>
                    <Input
                      id="date-to"
                      type="date"
                      value={historyDateTo}
                      onChange={(e) => setHistoryDateTo(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="employee-search">Cari Karyawan</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="employee-search"
                        placeholder="Nama atau NIK..."
                        value={historyEmployee}
                        onChange={(e) => setHistoryEmployee(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button onClick={fetchHistory} variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Terapkan Filter
                  </Button>
                  <Button 
                    onClick={() => {
                      setHistoryStatus('all');
                      setHistoryDateFrom('');
                      setHistoryDateTo('');
                      setHistoryEmployee('');
                    }} 
                    variant="ghost"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Permission History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Riwayat Pengajuan Izin
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <TableLoadingState text="Memuat riwayat pengajuan izin..." />
                ) : filteredPermissionRequests.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="Belum ada riwayat"
                    description="Belum ada pengajuan izin yang telah diproses"
                  />
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama</TableHead>
                          <TableHead>NIK</TableHead>
                          <TableHead>Jenis</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Diproses Oleh</TableHead>
                          <TableHead>Tanggal Proses</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPermissionRequests
                          .filter(r => !historyEmployee || 
                            r.employee_name.toLowerCase().includes(historyEmployee.toLowerCase()) ||
                            r.employee_id.toLowerCase().includes(historyEmployee.toLowerCase())
                          )
                          .filter(r => !historyDateFrom || new Date(r.tanggal) >= new Date(historyDateFrom))
                          .filter(r => !historyDateTo || new Date(r.tanggal) <= new Date(historyDateTo))
                          .map((request) => (
                            <TableRow key={request.id_presensi}>
                              <TableCell className="font-medium">{request.employee_name}</TableCell>
                              <TableCell>{request.employee_id}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{getJenisLabel(request.jenis_pengajuan)}</Badge>
                              </TableCell>
                              <TableCell>{formatDate(request.tanggal)}</TableCell>
                              <TableCell>{getStatusBadge(request.status_pengajuan)}</TableCell>
                              <TableCell className="text-sm">{request.approved_by || '-'}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {request.tanggal_approval ? formatDateTime(request.tanggal_approval) : '-'}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewDetail(request, 'permission')}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Detail
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Overtime History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Riwayat Pengajuan Lembur
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <TableLoadingState text="Memuat riwayat pengajuan lembur..." />
                ) : filteredOvertimeRequests.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="Belum ada riwayat"
                    description="Belum ada pengajuan lembur yang telah diproses"
                  />
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama</TableHead>
                          <TableHead>NIK</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Jam</TableHead>
                          <TableHead>Durasi</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Diproses Oleh</TableHead>
                          <TableHead>Tanggal Proses</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOvertimeRequests

                          .filter(r => !historyDateFrom || (r.tanggal_lembur && new Date(r.tanggal_lembur) >= new Date(historyDateFrom)))
                          .filter(r => !historyDateTo || (r.tanggal_lembur && new Date(r.tanggal_lembur) <= new Date(historyDateTo)))
                          .map((request) => (
                            <TableRow key={request.id_presensi}>
                              <TableCell className="font-medium">{request.employee_name}</TableCell>
                              <TableCell>{request.employee_id}</TableCell>
                              <TableCell>{formatDate(request.tanggal)}</TableCell>
                              <TableCell>
                                {request.jam_lembur_mulai || '-'} - {request.jam_lembur_selesai || '-'}
                              </TableCell>
                              <TableCell>{request.durasi_jam || 0} jam</TableCell>
                              <TableCell>{getStatusBadge(request.status_pengajuan)}</TableCell>
                              <TableCell className="text-sm">{request.approved_by || '-'}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {request.tanggal_approval ? formatDateTime(request.tanggal_approval) : '-'}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewDetail(request, 'overtime')}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Detail
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Approval/Rejection Modal */}
      <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? 'Setujui' : 'Tolak'} Pengajuan
            </DialogTitle>
            <DialogDescription>
              {approvalAction === 'approve' 
                ? 'Anda akan menyetujui pengajuan ini.'
                : 'Anda akan menolak pengajuan ini. Mohon berikan alasan penolakan.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Karyawan:</span>
                  <span className="text-sm">{selectedRequest.employee_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">NIK:</span>
                  <span className="text-sm">{selectedRequest.employee_id}</span>
                </div>
                {getRequestType(selectedRequest) === 'permission' && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Jenis:</span>
                    <span className="text-sm">{getJenisLabel(selectedRequest.jenis_pengajuan)}</span>
                  </div>
                )}
                {getRequestType(selectedRequest) === 'overtime' && selectedRequest.jam_lembur_mulai && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Durasi:</span>
                    <span className="text-sm">{selectedRequest.durasi_jam || 0} jam</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">
                  Catatan {approvalAction === 'reject' && <span className="text-destructive">*</span>}
                </Label>
                <Textarea
                  id="notes"
                  placeholder={approvalAction === 'approve' 
                    ? 'Catatan tambahan (opsional)' 
                    : 'Alasan penolakan (wajib)'}
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApprovalModal(false)}
              disabled={processing}
            >
              Batal
            </Button>
            <Button
              variant={approvalAction === 'approve' ? 'default' : 'destructive'}
              onClick={submitApproval}
              disabled={processing || (approvalAction === 'reject' && !approvalNotes.trim())}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                approvalAction === 'approve' ? 'Setujui' : 'Tolak'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Modal - Will be enhanced in next subtask */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Pengajuan</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nama Karyawan</Label>
                  <p className="font-medium">{selectedRequest.employee_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">NIK</Label>
                  <p className="font-medium">{selectedRequest.employee_id}</p>
                </div>
                
                {getRequestType(selectedRequest) === 'permission' && (
                  <>
                    <div>
                      <Label className="text-muted-foreground">Jenis Izin</Label>
                      <p className="font-medium">{getJenisLabel(selectedRequest.jenis_pengajuan)}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Tanggal</Label>
                      <p className="font-medium">{formatDate(selectedRequest.tanggal)}</p>
                    </div>
                    {selectedRequest.waktu_pengajuan_izin && (
                      <div>
                        <Label className="text-muted-foreground">Waktu</Label>
                        <p className="font-medium">{selectedRequest.waktu_pengajuan_izin}</p>
                      </div>
                    )}
                  </>
                )}
                
                {getRequestType(selectedRequest) === 'overtime' && (
                  <>
                    <div>
                      <Label className="text-muted-foreground">Tanggal Lembur</Label>
                      <p className="font-medium">{formatDate(selectedRequest.tanggal)}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Jam Mulai</Label>
                      <p className="font-medium">{selectedRequest.jam_lembur_mulai || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Jam Selesai</Label>
                      <p className="font-medium">{selectedRequest.jam_lembur_selesai || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Durasi</Label>
                      <p className="font-medium">{selectedRequest.durasi_jam || 0} jam</p>
                    </div>
                  </>
                )}
                
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Alasan</Label>
                  <p className="font-medium">{selectedRequest.alasan_pengajuan || selectedRequest.alasan || '-'}</p>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status_pengajuan)}</div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Diajukan Pada</Label>
                  <p className="font-medium">{formatDateTime(selectedRequest.tanggal_pengajuan)}</p>
                </div>
                
                {selectedRequest.approved_by && (
                  <>
                    <div>
                      <Label className="text-muted-foreground">Diproses Oleh</Label>
                      <p className="font-medium">{selectedRequest.approved_by}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Diproses Pada</Label>
                      <p className="font-medium">
                        {selectedRequest.tanggal_approval ? formatDateTime(selectedRequest.tanggal_approval) : '-'}
                      </p>
                    </div>
                  </>
                )}
                
                {selectedRequest.catatan_approval && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Catatan</Label>
                    <p className="font-medium">{selectedRequest.catatan_approval}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
