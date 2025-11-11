import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface LogMutasiData {
    id: number;
    tanggal: string;
    jenis_mutasi: 'Pemasukan' | 'Pengeluaran';
    jumlah: number;
    keterangan: string;
    pic: string;
}

export default function LogMutasiSaldoTunai() {
    const mockupData: LogMutasiData[] = [
        { id: 1, tanggal: '2023-10-20', jenis_mutasi: 'Pemasukan', jumlah: 5000000, keterangan: 'Setoran dari Bank', pic: 'Budi' },
        { id: 2, tanggal: '2023-10-21', jenis_mutasi: 'Pengeluaran', jumlah: 1000000, keterangan: 'Pembelian ATK', pic: 'Ani' },
        { id: 3, tanggal: '2023-10-22', jenis_mutasi: 'Pemasukan', jumlah: 2000000, keterangan: 'Penerimaan Kas Kecil', pic: 'Budi' },
        { id: 4, tanggal: '2023-10-23', jenis_mutasi: 'Pengeluaran', jumlah: 500000, keterangan: 'Biaya Transportasi', pic: 'Ani' },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <AuthenticatedLayout title="Log Mutasi Saldo Tunai">
            <Head title="Log Mutasi Saldo Tunai" />

            <div className="flex items-center mb-4">
                <Button variant="ghost" onClick={() => window.history.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>
                <h2 className="text-xl font-semibold ml-2">Log Mutasi Saldo Tunai</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Riwayat Transaksi Saldo Tunai Fisik</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Jenis Mutasi</TableHead>
                                <TableHead>Jumlah</TableHead>
                                <TableHead>Keterangan</TableHead>
                                <TableHead>PIC</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockupData.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.tanggal}</TableCell>
                                    <TableCell>{log.jenis_mutasi}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(log.jumlah)}</TableCell>
                                    <TableCell>{log.keterangan}</TableCell>
                                    <TableCell>{log.pic}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
