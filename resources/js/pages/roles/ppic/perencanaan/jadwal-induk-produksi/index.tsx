import { useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Calendar, Package, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface JadwalProduksi {
    id: number;
    nama_produk: string;
    deskripsi?: string;
    harga_disetujui_keuangan: number;
    tenggat_barang_jadi_ppic: string;
    tenggat_pengiriman_ppic: string;
    diajukan_oleh: { name: string };
    diajukan_pada: string;
}

interface PageProps {
    jadwalProduksi: {
        data: JadwalProduksi[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
        bulan?: string;
    };
}

export default function JadwalIndukProduksi() {
    const { jadwalProduksi, filters } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedBulan, setSelectedBulan] = useState(filters.bulan || 'all');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        router.get(route('ppic.perencanaan.jadwal-induk-produksi'), {
            search: e.target.value,
            bulan: selectedBulan === 'all' ? '' : selectedBulan,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleBulanChange = (value: string) => {
        setSelectedBulan(value);
        router.get(route('ppic.perencanaan.jadwal-induk-produksi'), {
            search: searchTerm,
            bulan: value === 'all' ? '' : value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const getBulanName = (bulan: number) => {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return months[bulan - 1];
    };

    const getUrgencyColor = (tenggat: string) => {
        const today = new Date();
        const deadline = new Date(tenggat);
        const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) return 'bg-red-100 text-red-800 border-red-300';
        if (daysLeft <= 7) return 'bg-orange-100 text-orange-800 border-orange-300';
        if (daysLeft <= 14) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        return 'bg-green-100 text-green-800 border-green-300';
    };

    const getDaysLeft = (tenggat: string) => {
        const today = new Date();
        const deadline = new Date(tenggat);
        const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) return `Terlambat ${Math.abs(daysLeft)} hari`;
        if (daysLeft === 0) return 'Hari ini';
        if (daysLeft === 1) return 'Besok';
        return `${daysLeft} hari lagi`;
    };

    return (
        <AuthenticatedLayout
            title="Jadwal Induk Produksi"
            breadcrumbs={[
                { title: 'Dashboard', href: route('ppic.index') },
                { title: 'Perencanaan', href: '#' },
                { title: 'Jadwal Induk Produksi', href: route('ppic.perencanaan.jadwal-induk-produksi') }
            ]}
        >
            <Head title="Jadwal Induk Produksi - PPIC" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Jadwal Induk Produksi</h1>
                    <Badge className="bg-purple-100 text-purple-800">
                        <Package className="h-4 w-4 mr-1" />
                        {jadwalProduksi.data.length} Pesanan Aktif
                    </Badge>
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
                            <Select value={selectedBulan} onValueChange={handleBulanChange}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Bulan</SelectItem>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                                        <SelectItem key={m} value={m.toString()}>{getBulanName(m)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Jadwal List */}
                <div className="grid gap-4">
                    {jadwalProduksi.data.length > 0 ? (
                        jadwalProduksi.data.map((item) => (
                            <Card key={item.id} className={`hover:shadow-md transition-shadow border-l-4 ${getUrgencyColor(item.tenggat_barang_jadi_ppic)}`}>
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg">{item.nama_produk}</h3>
                                                <Badge className="bg-purple-100 text-purple-800">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Dikonfirmasi
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div className="space-y-1">
                                                    <p className="text-gray-500">Pelanggan</p>
                                                    <p className="font-medium">{item.diajukan_oleh.name}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-gray-500">Nilai Pesanan</p>
                                                    <p className="font-medium">Rp {item.harga_disetujui_keuangan.toLocaleString('id-ID')}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-gray-500">Tanggal Pesanan</p>
                                                    <p className="font-medium">{new Date(item.diajukan_pada).toLocaleDateString('id-ID')}</p>
                                                </div>
                                            </div>

                                            {item.deskripsi && (
                                                <div>
                                                    <p className="text-sm text-gray-500">Deskripsi:</p>
                                                    <p className="text-sm text-gray-700">{item.deskripsi}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="ml-4 space-y-2 min-w-[200px]">
                                            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Calendar className="h-4 w-4 text-blue-600" />
                                                    <p className="text-sm font-medium text-blue-800">Tenggat Barang Jadi</p>
                                                </div>
                                                <p className="text-lg font-bold text-blue-900">
                                                    {new Date(item.tenggat_barang_jadi_ppic).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                                <p className="text-xs text-blue-600 mt-1">{getDaysLeft(item.tenggat_barang_jadi_ppic)}</p>
                                            </div>

                                            <div className="p-3 bg-green-50 border border-green-200 rounded">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Package className="h-4 w-4 text-green-600" />
                                                    <p className="text-sm font-medium text-green-800">Tenggat Pengiriman</p>
                                                </div>
                                                <p className="text-lg font-bold text-green-900">
                                                    {new Date(item.tenggat_pengiriman_ppic).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                                <p className="text-xs text-green-600 mt-1">{getDaysLeft(item.tenggat_pengiriman_ppic)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Tidak ada jadwal produksi yang sesuai dengan filter.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
