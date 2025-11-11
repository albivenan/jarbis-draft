import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Calendar, Package, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';

// --- TYPES ---
interface Pesanan {
  id: number;
  nama_produk: string;
  deskripsi?: string;
  harga_usulan_ppic: number;
  status: 'Pending' | 'Menunggu Persetujuan Keuangan' | 'Disetujui' | 'Ditolak' | 'Dikonfirmasi Marketing' | 'Banding Harga' | 'Dibatalkan';
  tenggat_barang_jadi_marketing?: string;
  tenggat_pengiriman_marketing?: string;
  tenggat_barang_jadi_ppic?: string;
  tenggat_pengiriman_ppic?: string;
  status_tenggat?: 'Menunggu Review PPIC' | 'Disetujui PPIC' | 'Ditolak PPIC' | 'Diubah PPIC' | 'Banding Tenggat' | 'Final';
  alasan_tenggat_ppic?: string;
  alasan_banding_tenggat?: string;
  diajukan_oleh: { name: string };
  diajukan_pada: string;
  direspon_pada?: string;
  disetujui_oleh?: { name: string };
  harga_disetujui_keuangan?: number;
  margin_keuangan?: number;
}

interface PageProps {
    pesanan: {
        data: Pesanan[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
        status?: string;
    };
    auth: any;
    errors: any;
    ziggy: any;
    flash: any;
    [key: string]: any;
}

export default function AntreanPesanan() {
  const { pesanan = { data: [], links: [], meta: {} }, filters = {} } = usePage<PageProps>().props;

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
  const [hargaUsulanPpicInput, setHargaUsulanPpicInput] = useState<{ [key: number]: number }>({});
  const [showTenggatForm, setShowTenggatForm] = useState<{ [key: number]: 'approve' | 'reject' | 'update' | null }>({});
  const [tenggatForm, setTenggatForm] = useState<{ [key: number]: { tenggat_barang_jadi: string; tenggat_pengiriman: string; alasan: string } }>({});


  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    router.get(route('ppic.perencanaan.pesanan.index'), {
      search: debouncedSearchTerm,
      status: selectedStatus === 'all' ? '' : selectedStatus,
    }, {
      preserveState: true,
      replace: true,
    });
  }, [debouncedSearchTerm, selectedStatus]);

  const orderSummary = {
    total: pesanan.data.length,
    pending: pesanan.data.filter(o => o.status === 'Pending').length, // Menunggu PPIC
    menungguKeuangan: pesanan.data.filter(o => o.status === 'Menunggu Persetujuan Keuangan').length,
    approved: pesanan.data.filter(o => o.status === 'Disetujui').length,
    rejected: pesanan.data.filter(o => o.status === 'Ditolak').length,
  };

  const handleHargaUsulanPpicChange = (id: number, value: string) => {
    setHargaUsulanPpicInput(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  const handleSubmitHargaUsulanPpic = (order: Pesanan) => {
    const harga = hargaUsulanPpicInput[order.id];
    if (harga === undefined || harga <= 0) {
      toast.error('Harga usulan harus lebih besar dari 0.');
      return;
    }

    if (order.status !== 'Pending') {
        toast.error('Pesanan tidak dalam status Menunggu PPIC.');
        return;
    }

    router.put(route('ppic.perencanaan.pesanan.submit-price', order.id), {
      harga_usulan_ppic: harga,
    }, {
      onSuccess: () => {
        toast.success('Harga usulan PPIC berhasil diajukan ke Keuangan!');
      },
      onError: (errors) => {
        console.error(errors);
        toast.error('Gagal mengajukan harga usulan.');
      }
    });
  };

  const handleApproveTenggat = (order: Pesanan) => {
    router.put(route('ppic.perencanaan.pesanan.approve-tenggat', order.id), {}, {
      onSuccess: () => {
        toast.success('Tenggat berhasil disetujui!');
        setShowTenggatForm({ ...showTenggatForm, [order.id]: null });
      },
      onError: (errors) => {
        console.error(errors);
        toast.error('Gagal menyetujui tenggat.');
      }
    });
  };

  const handleRejectTenggat = (order: Pesanan) => {
    const form = tenggatForm[order.id];
    if (!form || !form.alasan) {
      toast.error('Alasan penolakan harus diisi.');
      return;
    }
    router.put(route('ppic.perencanaan.pesanan.reject-tenggat', order.id), {
      alasan_tenggat_ppic: form.alasan,
    }, {
      onSuccess: () => {
        toast.success('Tenggat berhasil ditolak!');
        setShowTenggatForm({ ...showTenggatForm, [order.id]: null });
        setTenggatForm({ ...tenggatForm, [order.id]: { tenggat_barang_jadi: '', tenggat_pengiriman: '', alasan: '' } });
      },
      onError: (errors) => {
        console.error(errors);
        toast.error('Gagal menolak tenggat.');
      }
    });
  };

  const handleUpdateTenggat = (order: Pesanan) => {
    const form = tenggatForm[order.id];
    if (!form || !form.tenggat_barang_jadi || !form.tenggat_pengiriman || !form.alasan) {
      toast.error('Semua field harus diisi.');
      return;
    }
    router.put(route('ppic.perencanaan.pesanan.update-tenggat', order.id), {
      tenggat_barang_jadi_ppic: form.tenggat_barang_jadi,
      tenggat_pengiriman_ppic: form.tenggat_pengiriman,
      alasan_tenggat_ppic: form.alasan,
    }, {
      onSuccess: () => {
        toast.success('Tenggat berhasil diubah!');
        setShowTenggatForm({ ...showTenggatForm, [order.id]: null });
        setTenggatForm({ ...tenggatForm, [order.id]: { tenggat_barang_jadi: '', tenggat_pengiriman: '', alasan: '' } });
      },
      onError: (errors) => {
        console.error(errors);
        toast.error('Gagal mengubah tenggat.');
      }
    });
  };


  const getStatusColor = (status: string) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Menunggu Persetujuan Keuangan': return 'bg-blue-100 text-blue-800';
        case 'Disetujui': return 'bg-green-100 text-green-800';
        case 'Ditolak': return 'bg-red-100 text-red-800';
        case 'Dikonfirmasi Marketing': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Pending': return <Clock className="h-4 w-4" />;
        case 'Menunggu Persetujuan Keuangan': return <Clock className="h-4 w-4" />;
        case 'Disetujui': return <CheckCircle className="h-4 w-4" />;
        case 'Ditolak': return <AlertTriangle className="h-4 w-4" />;
        case 'Dikonfirmasi Marketing': return <CheckCircle className="h-4 w-4" />;
        default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
        case 'Pending': return 'Menunggu Anda';
        case 'Menunggu Persetujuan Keuangan': return 'Menunggu Keuangan';
        case 'Disetujui': return 'Disetujui Keuangan';
        case 'Ditolak': return 'Ditolak';
        case 'Dikonfirmasi Marketing': return 'Dikonfirmasi Pelanggan';
        default: return status;
    }
  };


  return (
    <AuthenticatedLayout
            title="Antrean Pesanan"
            breadcrumbs={[
                { title: 'Dashboard', href: route('ppic.index') },
                { title: 'Perencanaan', href: '#' },
                { title: 'Antrean Pesanan', href: route('ppic.perencanaan.pesanan.index') }
            ]}
        >
            <Head title="Antrean Pesanan - PPIC" />
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Antrean Pesanan Masuk</h1>
        {/* Removed "Tambah Pesanan Baru" button as per new workflow */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{orderSummary.total}</div>
              <div className="text-sm text-gray-600">Total Pesanan</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{orderSummary.pending}</div>
              <div className="text-sm text-gray-600">Menunggu Anda</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{orderSummary.menungguKeuangan}</div>
              <div className="text-sm text-gray-600">Menunggu Keuangan</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{orderSummary.approved}</div>
              <div className="text-sm text-gray-600">Disetujui</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari berdasarkan nama produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="Pending">Menunggu Anda</SelectItem>
                    <SelectItem value="Menunggu Persetujuan Keuangan">Menunggu Keuangan</SelectItem>
                    <SelectItem value="Disetujui">Disetujui Keuangan</SelectItem>
                    <SelectItem value="Ditolak">Ditolak</SelectItem>
                    <SelectItem value="Dikonfirmasi Marketing">Dikonfirmasi Pelanggan</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid gap-4">
        {pesanan.data.length > 0 ? (
            pesanan.data.map((order) => (
            <Card key={order.id} className={`hover:shadow-md transition-shadow ${order.status === 'Pending' ? 'border-yellow-200' : ''}`}>
                <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{order.nama_produk}</h3>
                        <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            <span>{getStatusText(order.status)}</span>
                        </div>
                        </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                        <p><span className="font-medium">Diajukan Oleh:</span> {order.diajukan_oleh.name}</p>
                        <p><span className="font-medium">Diajukan Pada:</span> {new Date(order.diajukan_pada).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        {order.harga_usulan_ppic > 0 && (
                            <p><span className="font-medium">Harga Usulan PPIC:</span> Rp {order.harga_usulan_ppic.toLocaleString('id-ID')}</p>
                        )}
                        </div>
                        <div>
                        {order.status !== 'Pending' && (
                            <>
                            <p><span className="font-medium">Direspon Oleh:</span> {order.disetujui_oleh?.name || '-'}</p>
                            <p><span className="font-medium">Direspon Pada:</span> {order.direspon_pada ? new Date(order.direspon_pada).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}</p>
                            </>
                        )}
                        {(order.status === 'Disetujui' || order.status === 'Dikonfirmasi Marketing') && (
                            <>
                            <p><span className="font-medium">Harga Disetujui Keuangan:</span> Rp {order.harga_disetujui_keuangan?.toLocaleString('id-ID') || '-'}</p>
                            <p><span className="font-medium">Margin Keuangan:</span> {order.margin_keuangan}%</p>
                            </>
                        )}
                        </div>
                    </div>

                    {order.deskripsi && (
                        <div>
                        <p className="text-sm font-medium text-gray-700">Deskripsi:</p>
                        <p className="text-sm text-gray-600">{order.deskripsi}</p>
                        </div>
                    )}

                    {/* Info Tenggat */}
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm font-medium text-green-800 mb-2">📅 Tenggat dari Marketing</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <p className="text-gray-600">Barang Jadi: <span className="font-medium">{order.tenggat_barang_jadi_marketing ? new Date(order.tenggat_barang_jadi_marketing).toLocaleDateString('id-ID') : '-'}</span></p>
                                <p className="text-gray-600">Pengiriman: <span className="font-medium">{order.tenggat_pengiriman_marketing ? new Date(order.tenggat_pengiriman_marketing).toLocaleDateString('id-ID') : '-'}</span></p>
                            </div>
                            <div>
                                <p className="text-gray-600">Status: <span className={`font-medium ${order.status_tenggat === 'Disetujui PPIC' || order.status_tenggat === 'Final' ? 'text-green-600' : order.status_tenggat === 'Ditolak PPIC' ? 'text-red-600' : order.status_tenggat === 'Diubah PPIC' ? 'text-orange-600' : 'text-blue-600'}`}>{order.status_tenggat || 'Menunggu Review'}</span></p>
                                {order.alasan_banding_tenggat && (
                                    <p className="text-gray-600 mt-1">Alasan Banding: <span className="italic text-xs">{order.alasan_banding_tenggat}</span></p>
                                )}
                            </div>
                        </div>
                    </div>
                    </div>

                    {(order.status === 'Pending') && (
                        <div className="flex flex-col gap-2 ml-4 w-64">
                            <Input
                                type="number"
                                placeholder="Harga Usulan PPIC"
                                value={hargaUsulanPpicInput[order.id] !== undefined ? hargaUsulanPpicInput[order.id] : ''}
                                onChange={(e) => handleHargaUsulanPpicChange(order.id, e.target.value)}
                                min="0"
                            />
                            <Button onClick={() => handleSubmitHargaUsulanPpic(order)} className="bg-blue-500 hover:bg-blue-600">
                                Ajukan Harga
                            </Button>

                            {/* Review Tenggat - hanya jika status tenggat Menunggu Review atau Banding */}
                            {(['Menunggu Review PPIC', 'Banding Tenggat'].includes(order.status_tenggat || '')) && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm font-medium">Review Tenggat:</p>
                                    <div className="flex gap-2">
                                        <Button onClick={() => handleApproveTenggat(order)} size="sm" className="bg-green-500 hover:bg-green-600 flex-1">
                                            <CheckCircle className="h-3 w-3 mr-1" /> Setujui
                                        </Button>
                                        <Button onClick={() => setShowTenggatForm({ ...showTenggatForm, [order.id]: 'reject' })} size="sm" variant="destructive" className="flex-1">
                                            <AlertTriangle className="h-3 w-3 mr-1" /> Tolak
                                        </Button>
                                        <Button onClick={() => setShowTenggatForm({ ...showTenggatForm, [order.id]: 'update' })} size="sm" variant="outline" className="flex-1">
                                            <Clock className="h-3 w-3 mr-1" /> Ubah
                                        </Button>
                                    </div>

                                    {/* Form Reject Tenggat */}
                                    {showTenggatForm[order.id] === 'reject' && (
                                        <div className="p-3 border rounded bg-gray-50 space-y-2">
                                            <Label>Alasan Penolakan</Label>
                                            <Textarea
                                                placeholder="Jelaskan alasan penolakan tenggat"
                                                value={tenggatForm[order.id]?.alasan || ''}
                                                onChange={(e) => setTenggatForm({ ...tenggatForm, [order.id]: { ...tenggatForm[order.id], alasan: e.target.value, tenggat_barang_jadi: '', tenggat_pengiriman: '' } })}
                                                rows={3}
                                            />
                                            <Button onClick={() => handleRejectTenggat(order)} size="sm" variant="destructive" className="w-full">
                                                Konfirmasi Tolak
                                            </Button>
                                        </div>
                                    )}

                                    {/* Form Update Tenggat */}
                                    {showTenggatForm[order.id] === 'update' && (
                                        <div className="p-3 border rounded bg-gray-50 space-y-2">
                                            <Label>Tenggat Barang Jadi (Usulan PPIC)</Label>
                                            <Input
                                                type="date"
                                                value={tenggatForm[order.id]?.tenggat_barang_jadi || ''}
                                                onChange={(e) => setTenggatForm({ ...tenggatForm, [order.id]: { ...tenggatForm[order.id], tenggat_barang_jadi: e.target.value, tenggat_pengiriman: tenggatForm[order.id]?.tenggat_pengiriman || '', alasan: tenggatForm[order.id]?.alasan || '' } })}
                                                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                            />
                                            <Label>Tenggat Pengiriman (Usulan PPIC)</Label>
                                            <Input
                                                type="date"
                                                value={tenggatForm[order.id]?.tenggat_pengiriman || ''}
                                                onChange={(e) => setTenggatForm({ ...tenggatForm, [order.id]: { ...tenggatForm[order.id], tenggat_pengiriman: e.target.value, tenggat_barang_jadi: tenggatForm[order.id]?.tenggat_barang_jadi || '', alasan: tenggatForm[order.id]?.alasan || '' } })}
                                                min={tenggatForm[order.id]?.tenggat_barang_jadi || new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                            />
                                            <Label>Alasan Perubahan</Label>
                                            <Textarea
                                                placeholder="Jelaskan alasan perubahan tenggat"
                                                value={tenggatForm[order.id]?.alasan || ''}
                                                onChange={(e) => setTenggatForm({ ...tenggatForm, [order.id]: { ...tenggatForm[order.id], alasan: e.target.value, tenggat_barang_jadi: tenggatForm[order.id]?.tenggat_barang_jadi || '', tenggat_pengiriman: tenggatForm[order.id]?.tenggat_pengiriman || '' } })}
                                                rows={3}
                                            />
                                            <Button onClick={() => handleUpdateTenggat(order)} size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
                                                Konfirmasi Ubah
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                </CardContent>
            </Card>
            ))
        ) : (
            <Card>
            <CardContent className="pt-6 text-center">
                <p className="text-gray-500">Tidak ada pesanan yang sesuai dengan filter.</p>
            </CardContent>
            </Card>
        )}
      </div>

    </div>
    </AuthenticatedLayout>
  );
}
