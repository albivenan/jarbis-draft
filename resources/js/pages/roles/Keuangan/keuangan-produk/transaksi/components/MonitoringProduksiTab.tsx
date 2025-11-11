import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Package, Calendar, CheckCircle } from 'lucide-react';

interface TransaksiProduksi {
    id: number;
    nama_produk: string;
    deskripsi?: string;
    harga_disetujui_keuangan: number;
    tenggat_barang_jadi_ppic: string;
    tenggat_pengiriman_ppic: string;
    diajukan_oleh: { name: string };
    diajukan_pada: string;
}

interface MonitoringProduksiTabProps {
    transaksi?: TransaksiProduksi[];
    filters?: {
        search?: string;
        bulan?: string;
    };
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

const MonitoringProduksiTab: React.FC<MonitoringProduksiTabProps> = ({ transaksi = [], filters = {} }) => {
    const [searchTerm, setSearchTerm] = useState<string>(filters.search || '');
    const [selectedBulan, setSelectedBulan] = useState<string>(filters.bulan || 'all');
    const [data, setData] = useState<TransaksiProduksi[]>(transaksi);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                route('manajer-keuangan.keuangan-produk.transaksi-produk.index', {
                    search: searchTerm,
                    bulan: selectedBulan === 'all' ? '' : selectedBulan,
                })
            );
            const result = await response.json();
            setData(result.transaksi.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchData();
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, selectedBulan]);

    const getBulanName = (bulan: number) => {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return months[bulan - 1];
    };

    const getUrgencyColor = (tenggat: string) => {
        const today = new Date();
        const deadline = new Date(tenggat);
        const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) return 'text-red-600';
        if (daysLeft <= 7) return 'text-orange-600';
        if (daysLeft <= 14) return 'text-yellow-600';
        return 'text-green-600';
    };

    const getDaysLeft = (tenggat: string) => {
        const today = new Date();
        const deadline = new Date(tenggat);
        const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) return `Terlambat ${Math.abs(daysLeft)} hari`;
        if (daysLeft === 0) return 'Hari ini';
        if (daysLeft === 1) return 'Besok';
        return `${daysLeft} hari`;
    };

    const totalNilai = data.reduce((sum, item) => sum + item.harga_disetujui_keuangan, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monitoring Produksi</CardTitle>
                <CardDescription>Pesanan yang sudah dikonfirmasi dan dalam proses produksi.</CardDescription>
                <div className="flex items-center gap-4 pt-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Cari nama produk atau pelanggan..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={selectedBulan} onValueChange={setSelectedBulan}>
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
                <div className="border-t mt-4 pt-4 grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Total Pesanan</h3>
                        <p className="text-2xl font-bold text-blue-600">{data.length}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Total Nilai</h3>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(totalNilai)}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Memuat data...</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">No.</TableHead>
                                <TableHead>Produk</TableHead>
                                <TableHead>Pelanggan</TableHead>
                                <TableHead>Nilai Pesanan</TableHead>
                                <TableHead>Tenggat Barang Jadi</TableHead>
                                <TableHead>Tenggat Pengiriman</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{item.nama_produk}</div>
                                            {item.deskripsi && (
                                                <div className="text-sm text-gray-500">{item.deskripsi.substring(0, 50)}...</div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div>{item.diajukan_oleh.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(item.diajukan_pada).toLocaleDateString('id-ID')}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {formatCurrency(item.harga_disetujui_keuangan)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-blue-500" />
                                                <div>
                                                    <div className="font-medium">
                                                        {new Date(item.tenggat_barang_jadi_ppic).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                                    </div>
                                                    <div className={`text-xs ${getUrgencyColor(item.tenggat_barang_jadi_ppic)}`}>
                                                        {getDaysLeft(item.tenggat_barang_jadi_ppic)}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-green-500" />
                                                <div>
                                                    <div className="font-medium">
                                                        {new Date(item.tenggat_pengiriman_ppic).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                                    </div>
                                                    <div className={`text-xs ${getUrgencyColor(item.tenggat_pengiriman_ppic)}`}>
                                                        {getDaysLeft(item.tenggat_pengiriman_ppic)}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-purple-100 text-purple-800">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Dalam Produksi
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500">Tidak ada pesanan dalam produksi.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};

export default MonitoringProduksiTab;
