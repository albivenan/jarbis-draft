import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

// --- TYPES ---
interface ProdukHarga {
    id: number;
    nama_produk: string;
    deskripsi?: string;
    harga_usulan_ppic: number;
    harga_disetujui_keuangan?: number;
    margin_keuangan?: number;
    harga_banding_marketing?: number;
    alasan_banding?: string;
    alasan_penolakan?: string;
    status: 'Pending' | 'Menunggu Persetujuan Keuangan' | 'Disetujui' | 'Ditolak' | 'Dikonfirmasi Marketing' | 'Banding Harga' | 'Dibatalkan';
    diajukan_oleh: { name: string };
    diajukan_pada: string;
    direspon_pada?: string;
    disetujui_oleh?: { name: string };
}

interface PageProps {
    produkHarga: {
        data: ProdukHarga[];
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

export default function HargaProdukIndex() {
    const { produkHarga, filters } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [marginInput, setMarginInput] = useState<{ [key: number]: number }>({});
    const [hargaDisetujuiInput, setHargaDisetujuiInput] = useState<{ [key: number]: number }>({});
    const [alasanPenolakanInput, setAlasanPenolakanInput] = useState<{ [key: number]: string }>({});
    const [showRejectForm, setShowRejectForm] = useState<{ [key: number]: boolean }>({});

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        router.get(route('manajer-keuangan.keuangan-produk.harga.index'), {
            search: e.target.value,
            status: selectedStatus === 'all' ? '' : selectedStatus,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(e.target.value);
        router.get(route('manajer-keuangan.keuangan-produk.harga.index'), {
            search: searchTerm,
            status: e.target.value === 'all' ? '' : e.target.value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleMarginChange = (id: number, value: string) => {
        setMarginInput(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
    };

    const handleHargaDisetujuiChange = (id: number, value: string) => {
        setHargaDisetujuiInput(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
    };

    const handleApprove = (produkHargaItem: ProdukHarga) => {
        const margin = marginInput[produkHargaItem.id] !== undefined ? marginInput[produkHargaItem.id] : 0;
        const hargaDisetujui = hargaDisetujuiInput[produkHargaItem.id] !== undefined ? hargaDisetujuiInput[produkHargaItem.id] : produkHargaItem.harga_usulan_ppic;

        if (hargaDisetujui <= 0) {
            toast.error('Harga disetujui harus lebih besar dari 0.');
            return;
        }
        if (margin < 0 || margin > 100) {
            toast.error('Margin harus antara 0 dan 100.');
            return;
        }

        router.put(route('manajer-keuangan.keuangan-produk.harga.approve', produkHargaItem.id), {
            harga_disetujui_keuangan: hargaDisetujui,
            margin_keuangan: margin,
        }, {
            onSuccess: () => {
                toast.success('Usulan harga produk berhasil disetujui!');
            },
            onError: (e) => {
                console.error(e);
                toast.error('Gagal menyetujui usulan harga.');
            }
        });
    };

    const handleReject = (produkHargaItem: ProdukHarga) => {
        const alasan = alasanPenolakanInput[produkHargaItem.id] || '';
        router.put(route('manajer-keuangan.keuangan-produk.harga.reject', produkHargaItem.id), {
            alasan_penolakan: alasan
        }, {
            onSuccess: () => {
                toast.success('Usulan harga produk berhasil ditolak!');
                setShowRejectForm({ ...showRejectForm, [produkHargaItem.id]: false });
                setAlasanPenolakanInput({ ...alasanPenolakanInput, [produkHargaItem.id]: '' });
            },
            onError: (e) => {
                console.error(e);
                toast.error('Gagal menolak usulan harga.');
            }
        });
    };

    const handleApproveBanding = (produkHargaItem: ProdukHarga) => {
        const margin = marginInput[produkHargaItem.id] !== undefined ? marginInput[produkHargaItem.id] : 0;
        const hargaDisetujui = hargaDisetujuiInput[produkHargaItem.id] !== undefined ? hargaDisetujuiInput[produkHargaItem.id] : (produkHargaItem.harga_banding_marketing || produkHargaItem.harga_usulan_ppic);

        if (hargaDisetujui <= 0) {
            toast.error('Harga disetujui harus lebih besar dari 0.');
            return;
        }
        if (margin < 0 || margin > 100) {
            toast.error('Margin harus antara 0 dan 100.');
            return;
        }

        router.put(route('manajer-keuangan.keuangan-produk.harga.approve-banding', produkHargaItem.id), {
            harga_disetujui_keuangan: hargaDisetujui,
            margin_keuangan: margin,
        }, {
            onSuccess: () => {
                toast.success('Banding harga berhasil disetujui!');
            },
            onError: (e) => {
                console.error(e);
                toast.error('Gagal menyetujui banding harga.');
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
            case 'Pending': return 'Menunggu Persetujuan PPIC';
            case 'Menunggu Persetujuan Keuangan': return 'Menunggu Persetujuan Anda';
            case 'Disetujui': return 'Disetujui Keuangan';
            case 'Ditolak': return 'Ditolak Keuangan';
            case 'Dikonfirmasi Marketing': return 'Dikonfirmasi Pelanggan';
            case 'Banding Harga': return 'Banding Harga - Menunggu Anda';
            case 'Dibatalkan': return 'Dibatalkan';
            default: return status;
        }
    };

    return (
        <AuthenticatedLayout
            title="Manajemen Harga Produk"
            breadcrumbs={[
                { title: 'Dashboard', href: route('manajer-keuangan.index') },
                { title: 'Keuangan Produk', href: '#' },
                { title: 'Manajemen Harga Produk', href: route('manajer-keuangan.keuangan-produk.harga.index') }
            ]}
        >
            <Head title="Manajemen Harga Produk - Keuangan" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Manajemen Harga Produk</h1>
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
                                <option value="Pending">Menunggu Persetujuan PPIC</option>
                                <option value="Menunggu Persetujuan Keuangan">Menunggu Persetujuan Anda</option>
                                <option value="Banding Harga">Banding Harga</option>
                                <option value="Disetujui">Disetujui Keuangan</option>
                                <option value="Ditolak">Ditolak Keuangan</option>
                                <option value="Dikonfirmasi Marketing">Dikonfirmasi Pelanggan</option>
                                <option value="Dibatalkan">Dibatalkan</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Product Price List */}
                <div className="grid gap-4">
                    {produkHarga.data.length > 0 ? (
                        produkHarga.data.map((item) => (
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
                                                    <p><span className="font-medium">Diajukan Oleh:</span> {item.diajukan_oleh.name}</p>
                                                    <p><span className="font-medium">Diajukan Pada:</span> {new Date(item.diajukan_pada).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                                    <p><span className="font-medium">Harga Usulan PPIC:</span> Rp {item.harga_usulan_ppic.toLocaleString('id-ID')}</p>
                                                </div>
                                                <div>
                                                    {item.status !== 'Pending' && (
                                                        <>
                                                            <p><span className="font-medium">Direspon Oleh:</span> {item.disetujui_oleh?.name || '-'}</p>
                                                            <p><span className="font-medium">Direspon Pada:</span> {item.direspon_pada ? new Date(item.direspon_pada).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}</p>
                                                        </>
                                                    )}
                                                    {item.status === 'Disetujui' && (
                                                        <>
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
                                        </div>

                                        {item.status === 'Menunggu Persetujuan Keuangan' && (
                                            <div className="flex flex-col gap-2 ml-4 w-64">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`harga_disetujui_${item.id}`}>Harga Disetujui</Label>
                                                    <Input
                                                        id={`harga_disetujui_${item.id}`}
                                                        type="number"
                                                        value={hargaDisetujuiInput[item.id] !== undefined ? hargaDisetujuiInput[item.id] : item.harga_usulan_ppic}
                                                        onChange={(e) => handleHargaDisetujuiChange(item.id, e.target.value)}
                                                        min="0"
                                                        placeholder="Harga disetujui"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`margin_${item.id}`}>Margin (%)</Label>
                                                    <Input
                                                        id={`margin_${item.id}`}
                                                        type="number"
                                                        value={marginInput[item.id] !== undefined ? marginInput[item.id] : 0}
                                                        onChange={(e) => handleMarginChange(item.id, e.target.value)}
                                                        min="0"
                                                        max="100"
                                                        placeholder="Margin"
                                                    />
                                                </div>
                                                <Button onClick={() => handleApprove(item)} className="bg-green-500 hover:bg-green-600">
                                                    <CheckCircle className="h-4 w-4 mr-2" /> Setujui
                                                </Button>
                                                <Button onClick={() => setShowRejectForm({ ...showRejectForm, [item.id]: !showRejectForm[item.id] })} variant="destructive">
                                                    <XCircle className="h-4 w-4 mr-2" /> Tolak
                                                </Button>
                                                {showRejectForm[item.id] && (
                                                    <div className="space-y-2 p-3 border rounded bg-gray-50">
                                                        <Label>Alasan Penolakan (Opsional)</Label>
                                                        <Textarea
                                                            placeholder="Jelaskan alasan penolakan"
                                                            value={alasanPenolakanInput[item.id] || ''}
                                                            onChange={(e) => setAlasanPenolakanInput({ ...alasanPenolakanInput, [item.id]: e.target.value })}
                                                            rows={3}
                                                        />
                                                        <Button onClick={() => handleReject(item)} variant="destructive" className="w-full">
                                                            Konfirmasi Tolak
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {item.status === 'Banding Harga' && (
                                            <div className="flex flex-col gap-2 ml-4 w-64">
                                                <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                                                    <p className="text-sm font-medium text-orange-800">Banding Harga dari Marketing</p>
                                                    <p className="text-sm text-orange-600 mt-1">Harga Banding: Rp {item.harga_banding_marketing?.toLocaleString('id-ID')}</p>
                                                    {item.alasan_banding && (
                                                        <p className="text-sm text-gray-600 mt-2"><span className="font-medium">Alasan:</span> {item.alasan_banding}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`harga_disetujui_banding_${item.id}`}>Harga Disetujui</Label>
                                                    <Input
                                                        id={`harga_disetujui_banding_${item.id}`}
                                                        type="number"
                                                        value={hargaDisetujuiInput[item.id] !== undefined ? hargaDisetujuiInput[item.id] : (item.harga_banding_marketing || item.harga_usulan_ppic)}
                                                        onChange={(e) => handleHargaDisetujuiChange(item.id, e.target.value)}
                                                        min="0"
                                                        placeholder="Harga disetujui"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`margin_banding_${item.id}`}>Margin (%)</Label>
                                                    <Input
                                                        id={`margin_banding_${item.id}`}
                                                        type="number"
                                                        value={marginInput[item.id] !== undefined ? marginInput[item.id] : 0}
                                                        onChange={(e) => handleMarginChange(item.id, e.target.value)}
                                                        min="0"
                                                        max="100"
                                                        placeholder="Margin"
                                                    />
                                                </div>
                                                <Button onClick={() => handleApproveBanding(item)} className="bg-green-500 hover:bg-green-600">
                                                    <CheckCircle className="h-4 w-4 mr-2" /> Setujui Banding
                                                </Button>
                                                <Button onClick={() => setShowRejectForm({ ...showRejectForm, [item.id]: !showRejectForm[item.id] })} variant="destructive">
                                                    <XCircle className="h-4 w-4 mr-2" /> Tolak Banding
                                                </Button>
                                                {showRejectForm[item.id] && (
                                                    <div className="space-y-2 p-3 border rounded bg-gray-50">
                                                        <Label>Alasan Penolakan (Opsional)</Label>
                                                        <Textarea
                                                            placeholder="Jelaskan alasan penolakan"
                                                            value={alasanPenolakanInput[item.id] || ''}
                                                            onChange={(e) => setAlasanPenolakanInput({ ...alasanPenolakanInput, [item.id]: e.target.value })}
                                                            rows={3}
                                                        />
                                                        <Button onClick={() => handleReject(item)} variant="destructive" className="w-full">
                                                            Konfirmasi Tolak
                                                        </Button>
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
                                <p className="text-gray-500">Tidak ada permintaan harga produk yang sesuai dengan filter.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}