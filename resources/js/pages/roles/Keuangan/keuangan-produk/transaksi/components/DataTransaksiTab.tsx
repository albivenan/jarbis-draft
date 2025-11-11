import { Link, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// Define types based on project convention and new backend structure
interface SumberDana {
    id: number;
    nama_sumber: string;
    saldo: number;
}

interface KeuanganTransaksiPembeli {
    id: number;
    nama_pembeli: string;
    email_pembeli: string | null;
    telepon_pembeli: string | null;
    alamat_pembeli: string | null;
}

interface PemasukanHarian {
    id: number;
    user_id: number;
    sumber_dana_id: number;
    keuangan_transaksi_pembeli_id: number;
    waktu: string;
    description: string; // Used for orderName
    amount: number; // Used for totalPurchase
    jenis_pemasukan: string; // Used for paymentType
    catatan: string | null;
    invoice_path: string | null;
    status: string; // Used for paymentStatus
    saldo_sebelum: number;
    saldo_setelah: number;
    created_at: string;
    updated_at: string;
    pembeli: KeuanganTransaksiPembeli; // Eager loaded relationship
    sumber_dana: SumberDana; // Eager loaded relationship
}

interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Paginator {
    current_page: number;
    data: PemasukanHarian[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginatorLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

interface DataTransaksiTabProps {
    pemasukanHarian: Paginator;
    sumberDanas: SumberDana[];
    filters: {
        search?: string;
        selectedDate?: string;
    };
}

const DataTransaksiTab: React.FC<DataTransaksiTabProps> = ({ pemasukanHarian, sumberDanas, filters }) => {
    const [searchTerm, setSearchTerm] = useState<string>(filters.search || '');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        filters.selectedDate ? new Date(filters.selectedDate) : undefined
    );

    const handleSearch = () => {
        router.get(
            route('keuangan.keuangan-produk.transaksi.index'),
            {
                search: searchTerm,
                selectedDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        router.get(
            route('keuangan.keuangan-produk.transaksi.index'),
            {
                search: searchTerm,
                selectedDate: date ? format(date, 'yyyy-MM-dd') : undefined,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleClearDate = () => {
        setSelectedDate(undefined);
        router.get(
            route('keuangan.keuangan-produk.transaksi.index'),
            {
                search: searchTerm,
                selectedDate: undefined,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            handleSearch();
        }, 300); // Debounce search input

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const totalTransaksi = pemasukanHarian.data.reduce((sum, transaction) => sum + parseFloat(transaction.amount.toString()), 0);

    const handleDeleteClick = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            router.delete(route('keuangan.keuangan-produk.transaksi.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optionally show a toast notification
                },
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Data Transaksi Pembeli</CardTitle>
                <CardDescription>Daftar identitas pembeli dan ringkasan transaksi.</CardDescription>
                <div className="flex items-center gap-4 pt-4">
                    <Input
                        placeholder="Cari nama, email, telepon, atau pesanan..."
                        className="max-w-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !selectedDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                initialFocus
                            />
                            {selectedDate && (
                                <div className="p-2">
                                    <Button variant="ghost" onClick={handleClearDate} className="w-full">
                                        Reset Tanggal
                                    </Button>
                                </div>
                            )}
                        </PopoverContent>
                    </Popover>
                    <Link href={route('keuangan.keuangan-produk.transaksi.create')}>
                        <Button>Tambah Transaksi</Button>
                    </Link>
                </div>
                <div className="border-t mt-4 pt-4">
                    <h3 className="text-lg font-semibold">Total Pembelian (Filter Terpilih)</h3>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalTransaksi)}</p>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">No.</TableHead>
                            <TableHead>Nama Pembeli</TableHead>
                            <TableHead>Nama Pesanan</TableHead>
                            <TableHead>Status Pembayaran</TableHead>
                            <TableHead>Waktu Transaksi</TableHead>
                            <TableHead>Total Harga</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pemasukanHarian.data.length > 0 ? (
                            pemasukanHarian.data.map((transaction, index) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{pemasukanHarian.from + index}</TableCell>
                                    <TableCell>
                                        <div>{transaction.pembeli?.nama_pembeli || 'N/A'}</div>
                                        <div className="text-sm text-muted-foreground">{transaction.pembeli?.email_pembeli || ''}</div>
                                        <div className="text-sm text-muted-foreground">{transaction.pembeli?.telepon_pembeli || ''}</div>
                                    </TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell>
                                        {transaction.status === 'DP' ? (
                                            <Badge variant="secondary">
                                                DP: {formatCurrency(transaction.amount)}
                                            </Badge>
                                        ) : (
                                            <Badge variant="default">
                                                Lunas
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{format(new Date(transaction.waktu), 'dd MMMM yyyy HH:mm', { locale: id })}</TableCell>
                                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Buka menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => router.get(route('keuangan.keuangan-produk.transaksi.edit', transaction.id))}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    <span>Edit</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteClick(transaction.id)} className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Hapus</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Tidak ada data transaksi yang ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Pagination className="mt-4">
                    <PaginationContent>
                        {pemasukanHarian.links.map((link, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    href={link.url || '#'}
                                    isActive={link.active}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (link.url) {
                                            router.get(link.url, {}, { preserveScroll: true, replace: true });
                                        }
                                    }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            </PaginationItem>
                        ))}
                    </PaginationContent>
                </Pagination>
            </CardContent>
        </Card>
    );
};

export default DataTransaksiTab;
