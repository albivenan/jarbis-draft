import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, PlusCircle, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

// --- TYPES ---
interface Pesanan {
    id: number;
    nama_produk: string;
    deskripsi?: string;
    harga_usulan_ppic: number;
    harga_disetujui_keuangan?: number;
    margin_keuangan?: number;
    harga_banding_marketing?: number;
    alasan_banding?: string;
    alasan_penolakan?: string;
    tenggat_barang_jadi_marketing?: string;
    tenggat_pengiriman_marketing?: string;
    tenggat_barang_jadi_ppic?: string;
    tenggat_pengiriman_ppic?: string;
    status_tenggat?: 'Menunggu Review PPIC' | 'Disetujui PPIC' | 'Ditolak PPIC' | 'Diubah PPIC' | 'Banding Tenggat' | 'Final';
    alasan_tenggat_ppic?: string;
    alasan_banding_tenggat?: string;
    status: 'Pending' | 'Menunggu Persetujuan Keuangan' | 'Disetujui' | 'Ditolak' | 'Dikonfirmasi Marketing' | 'Banding Harga' | 'Dibatalkan';
    diajukan_oleh: { name: string };
    diajukan_pada: string;
    direspon_pada?: string;
    disetujui_oleh?: { name: string };
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

export default function CrmIndex() {
    const { pesanan, filters } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [newOrderForm, setNewOrderForm] = useState({
        nama_produk: '',
        deskripsi: '',
        tenggat_barang_jadi_marketing: '',
        tenggat_pengiriman_marketing: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bandingForm, setBandingForm] = useState<{ [key: number]: { harga: number; alasan: string } }>({});
    const [showBandingForm, setShowBandingForm] = useState<{ [key: number]: boolean }>({});
    const [bandingTenggatForm, setBandingTenggatForm] = useState<{ [key: number]: { tenggat_barang_jadi: string; tenggat_pengiriman: string; alasan: string } }>({});
    const [showBandingTenggatForm, setShowBandingTenggatForm] = useState<{ [key: number]: boolean }>({});

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        router.get(route('manajer-marketing.crm.index'), {
            search: e.target.value,
            status: selectedStatus === 'all' ? '' : selectedStatus,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(e.target.value);
        router.get(route('manajer-marketing.crm.index'), {
            search: searchTerm,
            status: e.target.value === 'all' ? '' : e.target.value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleNewOrderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewOrderForm({ ...newOrderForm, [e.target.id]: e.target.value });
    };

    const handleNewOrderSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post(route('manajer-marketing.pesanan.store'), newOrderForm, {
            onSuccess: () => {
                toast.success('Pesanan baru berhasil diajukan!');
                setNewOrderForm({ 
                    nama_produk: '', 
                    deskripsi: '', 
                    tenggat_barang_jadi_marketing: '', 
                    tenggat_pengiriman_marketing: '' 
                });
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Gagal mengajukan pesanan baru.');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleConfirmOrder = (order: Pesanan) => {
        if (order.status !== 'Disetujui') {
            toast.error('Pesanan belum disetujui oleh Keuangan.');
            return;
        }
        router.put(route('manajer-marketing.pesanan.confirm', order.id), {}, {
            onSuccess: () => {
                toast.success('Pesanan berhasil dikonfirmasi dan siap untuk produksi!');
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Gagal mengkonfirmasi pesanan.');
            }
        });
    };

    const handleRejectOrder = (order: Pesanan) => {
        if (order.status !== 'Disetujui') {
            toast.error('Hanya pesanan yang disetujui yang bisa ditolak.');
            return;
        }
        if (confirm('Apakah Anda yakin ingin menolak pesanan ini?')) {
            router.put(route('manajer-marketing.pesanan.reject', order.id), {}, {
                onSuccess: () => {
                    toast.success('Pesanan berhasil ditolak.');
                },
                onError: (errors) => {
                    console.error(errors);
                    toast.error('Gagal menolak pesanan.');
                }
            });
        }
    };

    const handleCancelOrder = (order: Pesanan) => {
        if (confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
            router.put(route('manajer-marketing.pesanan.cancel', order.id), {}, {
                onSuccess: () => {
                    toast.success('Pesanan berhasil dibatalkan.');
                },
                onError: (errors) => {
                    console.error(errors);
                    toast.error('Gagal membatalkan pesanan.');
                }
            });
        }
    };

    const handleBandingSubmit = (order: Pesanan) => {
        const form = bandingForm[order.id];
        if (!form || !form.harga || !form.alasan) {
            toast.error('Harga banding dan alasan harus diisi.');
            return;
        }
        router.put(route('manajer-marketing.pesanan.banding', order.id), {
            harga_banding_marketing: form.harga,
            alasan_banding: form.alasan,
        }, {
            onSuccess: () => {
                toast.success('Banding harga berhasil diajukan ke Keuangan!');
                setShowBandingForm({ ...showBandingForm, [order.id]: false });
                setBandingForm({ ...bandingForm, [order.id]: { harga: 0, alasan: '' } });
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Gagal mengajukan banding harga.');
            }
        });
    };

    const handleBandingTenggatSubmit = (order: Pesanan) => {
        const form = bandingTenggatForm[order.id];
        if (!form || !form.tenggat_barang_jadi || !form.tenggat_pengiriman || !form.alasan) {
            toast.error('Semua field tenggat banding harus diisi.');
            return;
        }
        router.put(route('manajer-marketing.pesanan.banding-tenggat', order.id), {
            tenggat_barang_jadi_marketing: form.tenggat_barang_jadi,
            tenggat_pengiriman_marketing: form.tenggat_pengiriman,
            alasan_banding_tenggat: form.alasan,
        }, {
            onSuccess: () => {
                toast.success('Banding tenggat berhasil diajukan ke PPIC!');
                setShowBandingTenggatForm({ ...showBandingTenggatForm, [order.id]: false });
                setBandingTenggatForm({ ...bandingTenggatForm, [order.id]: { tenggat_barang_jadi: '', tenggat_pengiriman: '', alasan: '' } });
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Gagal mengajukan banding tenggat.');
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
            case 'Banding Harga': return 'bg-orange-100 text-orange-800';
            case 'Dibatalkan': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Pending': return <Clock className="h-4 w-4" />;
            case 'Menunggu Persetujuan Keuangan': return <Clock className="h-4 w-4" />;
            case 'Disetujui': return <CheckCircle className="h-4 w-4" />;
            case 'Ditolak': return <XCircle className="h-4 w-4" />;
            case 'Dikonfirmasi Marketing': return <CheckCircle className="h-4 w-4" />;
            case 'Banding Harga': return <DollarSign className="h-4 w-4" />;
            case 'Dibatalkan': return <XCircle className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'Pending': return 'Menunggu PPIC';
            case 'Menunggu Persetujuan Keuangan': return 'Menunggu Keuangan';
            case 'Disetujui': return 'Disetujui Keuangan';
            case 'Ditolak': return 'Ditolak';
            case 'Dikonfirmasi Marketing': return 'Dikonfirmasi Pelanggan';
            case 'Banding Harga': return 'Banding Harga';
            case 'Dibatalkan': return 'Dibatalkan';
            default: return status;
        }
    };

    return (
        <AuthenticatedLayout
            title="Manajemen Pesanan (CRM)"
            breadcrumbs={[
                { title: 'Dashboard', href: route('manajer-marketing.index') },
                { title: 'CRM', href: route('manajer-marketing.crm.index') }
            ]}
        >
            <Head title="Manajemen Pesanan (CRM) - Marketing" />

            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Manajemen Pesanan</h1>

                {/* Form Tambah Pesanan Baru */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PlusCircle className="h-5 w-5" /> Tambah Pesanan Baru
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleNewOrderSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="nama_produk">Nama Produk</Label>
                                    <Input
                                        id="nama_produk"
                                        value={newOrderForm.nama_produk}
                                        onChange={handleNewOrderChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="deskripsi">Deskripsi</Label>
                                    <Textarea
                                        id="deskripsi"
                                        value={newOrderForm.deskripsi}
                                        onChange={handleNewOrderChange}
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="tenggat_barang_jadi_marketing">Tenggat Barang Jadi</Label>
                                    <Input
                                        id="tenggat_barang_jadi_marketing"
                                        type="date"
                                        value={newOrderForm.tenggat_barang_jadi_marketing}
                                        onChange={handleNewOrderChange}
                                        required
                                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="tenggat_pengiriman_marketing">Tenggat Pengiriman</Label>
                                    <Input
                                        id="tenggat_pengiriman_marketing"
                                        type="date"
                                        value={newOrderForm.tenggat_pengiriman_marketing}
                                        onChange={handleNewOrderChange}
                                        required
                                        min={newOrderForm.tenggat_barang_jadi_marketing || new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Mengajukan...' : 'Ajukan Pesanan'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

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
                                        onChange={handleSearch}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <select
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="all">Semua Status</option>
                                <option value="Pending">Menunggu PPIC</option>
                                <option value="Menunggu Persetujuan Keuangan">Menunggu Keuangan</option>
                                <option value="Disetujui">Disetujui Keuangan</option>
                                <option value="Ditolak">Ditolak</option>
                                <option value="Banding Harga">Banding Harga</option>
                                <option value="Dikonfirmasi Marketing">Dikonfirmasi Pelanggan</option>
                                <option value="Dibatalkan">Dibatalkan</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Product Order List */}
                <div className="grid gap-4">
                    {pesanan.data.length > 0 ? (
                        pesanan.data.map((item) => (
                            <Card key={item.id} className={`hover:shadow-md transition-shadow ${item.status === 'Pending' ? 'border-yellow-200' : ''}`}>
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg">{item.nama_produk}</h3>
                                                <Badge className={getStatusColor(item.status)}>
                                                    <div className="flex items-center gap-1">
                                                        {getStatusIcon(item.status)}
                                                        <span>{getStatusText(item.status)}</span>
                                                    </div>
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                <div>
                                                    <p><span className="font-medium">Diajukan Oleh:</span> {item.diajukan_oleh?.name || '-'}</p>
                                                    <p><span className="font-medium">Diajukan Pada:</span> {new Date(item.diajukan_pada).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                                    {item.harga_usulan_ppic && item.harga_usulan_ppic > 0 && (
                                                        <p><span className="font-medium">Harga Usulan PPIC:</span> Rp {item.harga_usulan_ppic.toLocaleString('id-ID')}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    {item.status === 'Disetujui' && (
                                                        <>
                                                            <p><span className="font-medium">Direspon Oleh:</span> {item.disetujui_oleh?.name || '-'}</p>
                                                            <p><span className="font-medium">Direspon Pada:</span> {item.direspon_pada ? new Date(item.direspon_pada).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}</p>
                                                            <p><span className="font-medium">Harga Disetujui Keuangan:</span> Rp {item.harga_disetujui_keuangan?.toLocaleString('id-ID') || '-'}</p>
                                                            <p><span className="font-medium">Margin Keuangan:</span> {item.margin_keuangan}%</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {item.deskripsi && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Deskripsi:</p>
                                                    <p className="text-sm text-gray-600">{item.deskripsi}</p>
                                                </div>
                                            )}

                                            {/* Info Tenggat */}
                                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                                                <p className="text-sm font-medium text-blue-800 mb-2">📅 Informasi Tenggat</p>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <p className="text-gray-600">Tenggat Barang Jadi: <span className="font-medium">{item.tenggat_barang_jadi_marketing ? new Date(item.tenggat_barang_jadi_marketing).toLocaleDateString('id-ID') : '-'}</span></p>
                                                        <p className="text-gray-600">Tenggat Pengiriman: <span className="font-medium">{item.tenggat_pengiriman_marketing ? new Date(item.tenggat_pengiriman_marketing).toLocaleDateString('id-ID') : '-'}</span></p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Status: <span className={`font-medium ${item.status_tenggat === 'Disetujui PPIC' || item.status_tenggat === 'Final' ? 'text-green-600' : item.status_tenggat === 'Ditolak PPIC' ? 'text-red-600' : item.status_tenggat === 'Diubah PPIC' ? 'text-orange-600' : 'text-blue-600'}`}>{item.status_tenggat || 'Menunggu Review'}</span></p>
                                                        {(item.status_tenggat === 'Diubah PPIC' || item.status_tenggat === 'Disetujui PPIC') && (
                                                            <>
                                                                <p className="text-gray-600">PPIC Barang Jadi: <span className="font-medium">{item.tenggat_barang_jadi_ppic ? new Date(item.tenggat_barang_jadi_ppic).toLocaleDateString('id-ID') : '-'}</span></p>
                                                                <p className="text-gray-600">PPIC Pengiriman: <span className="font-medium">{item.tenggat_pengiriman_ppic ? new Date(item.tenggat_pengiriman_ppic).toLocaleDateString('id-ID') : '-'}</span></p>
                                                            </>
                                                        )}
                                                        {item.alasan_tenggat_ppic && (
                                                            <p className="text-gray-600 mt-1">Alasan PPIC: <span className="italic">{item.alasan_tenggat_ppic}</span></p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {item.status === 'Disetujui' && (
                                            <div className="flex flex-col gap-2 ml-4 w-64">
                                                <Button 
                                                    onClick={() => handleConfirmOrder(item)} 
                                                    className="bg-purple-500 hover:bg-purple-600"
                                                    disabled={!['Disetujui PPIC', 'Diubah PPIC'].includes(item.status_tenggat || '')}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" /> Konfirmasi Pesanan
                                                </Button>
                                                {!['Disetujui PPIC', 'Diubah PPIC'].includes(item.status_tenggat || '') && (
                                                    <p className="text-xs text-gray-500">* Tenggat harus disetujui PPIC terlebih dahulu</p>
                                                )}
                                                <Button onClick={() => handleRejectOrder(item)} variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                                                    <XCircle className="h-4 w-4 mr-2" /> Tolak Pesanan
                                                </Button>
                                                <Button onClick={() => setShowBandingForm({ ...showBandingForm, [item.id]: !showBandingForm[item.id] })} variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                                                    <DollarSign className="h-4 w-4 mr-2" /> Ajukan Banding Harga
                                                </Button>
                                                {showBandingForm[item.id] && (
                                                    <div className="space-y-2 p-3 border rounded bg-gray-50">
                                                        <Label>Harga Banding</Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="Harga yang diinginkan"
                                                            value={bandingForm[item.id]?.harga || ''}
                                                            onChange={(e) => setBandingForm({ ...bandingForm, [item.id]: { ...bandingForm[item.id], harga: parseFloat(e.target.value) || 0, alasan: bandingForm[item.id]?.alasan || '' } })}
                                                        />
                                                        <Label>Alasan Banding</Label>
                                                        <Textarea
                                                            placeholder="Jelaskan alasan banding"
                                                            value={bandingForm[item.id]?.alasan || ''}
                                                            onChange={(e) => setBandingForm({ ...bandingForm, [item.id]: { ...bandingForm[item.id], alasan: e.target.value, harga: bandingForm[item.id]?.harga || 0 } })}
                                                            rows={3}
                                                        />
                                                        <Button onClick={() => handleBandingSubmit(item)} className="w-full bg-orange-500 hover:bg-orange-600">
                                                            Submit Banding Harga
                                                        </Button>
                                                    </div>
                                                )}
                                                
                                                {/* Banding Tenggat - hanya jika tenggat diubah/ditolak PPIC */}
                                                {(item.status_tenggat === 'Diubah PPIC' || item.status_tenggat === 'Ditolak PPIC') && (
                                                    <>
                                                        <Button onClick={() => setShowBandingTenggatForm({ ...showBandingTenggatForm, [item.id]: !showBandingTenggatForm[item.id] })} variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
                                                            <Clock className="h-4 w-4 mr-2" /> Ajukan Banding Tenggat
                                                        </Button>
                                                        {showBandingTenggatForm[item.id] && (
                                                            <div className="space-y-2 p-3 border rounded bg-gray-50">
                                                                <Label>Tenggat Barang Jadi Baru</Label>
                                                                <Input
                                                                    type="date"
                                                                    value={bandingTenggatForm[item.id]?.tenggat_barang_jadi || ''}
                                                                    onChange={(e) => setBandingTenggatForm({ ...bandingTenggatForm, [item.id]: { ...bandingTenggatForm[item.id], tenggat_barang_jadi: e.target.value, tenggat_pengiriman: bandingTenggatForm[item.id]?.tenggat_pengiriman || '', alasan: bandingTenggatForm[item.id]?.alasan || '' } })}
                                                                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                                                />
                                                                <Label>Tenggat Pengiriman Baru</Label>
                                                                <Input
                                                                    type="date"
                                                                    value={bandingTenggatForm[item.id]?.tenggat_pengiriman || ''}
                                                                    onChange={(e) => setBandingTenggatForm({ ...bandingTenggatForm, [item.id]: { ...bandingTenggatForm[item.id], tenggat_pengiriman: e.target.value, tenggat_barang_jadi: bandingTenggatForm[item.id]?.tenggat_barang_jadi || '', alasan: bandingTenggatForm[item.id]?.alasan || '' } })}
                                                                    min={bandingTenggatForm[item.id]?.tenggat_barang_jadi || new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                                                />
                                                                <Label>Alasan Banding Tenggat</Label>
                                                                <Textarea
                                                                    placeholder="Jelaskan alasan banding tenggat"
                                                                    value={bandingTenggatForm[item.id]?.alasan || ''}
                                                                    onChange={(e) => setBandingTenggatForm({ ...bandingTenggatForm, [item.id]: { ...bandingTenggatForm[item.id], alasan: e.target.value, tenggat_barang_jadi: bandingTenggatForm[item.id]?.tenggat_barang_jadi || '', tenggat_pengiriman: bandingTenggatForm[item.id]?.tenggat_pengiriman || '' } })}
                                                                    rows={3}
                                                                />
                                                                <Button onClick={() => handleBandingTenggatSubmit(item)} className="w-full bg-blue-500 hover:bg-blue-600">
                                                                    Submit Banding Tenggat
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {(item.status === 'Ditolak' || item.status === 'Pending') && (
                                            <div className="flex flex-col gap-2 ml-4">
                                                <Button onClick={() => handleCancelOrder(item)} variant="destructive">
                                                    <XCircle className="h-4 w-4 mr-2" /> Batalkan Pesanan
                                                </Button>
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