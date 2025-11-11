import React, { useState, useEffect, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Loader2, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/date-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';
import { Transaction } from '@/pages/roles/Keuangan/Harian/sumber-dana/hooks/useSumberDanaData'; // Import Transaction type

// Assuming PaginatedResponse is a generic type defined elsewhere or here
interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string | null;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface SumberDanaRiwayatTabProps {
    selectedSumberDanaId: number | 'all' | null;
    setSelectedSumberDanaId: React.Dispatch<React.SetStateAction<number | 'all' | null>>;
    paginatedHistory: PaginatedResponse<Transaction> | null;
    historyLoading: boolean;
    historyError: string | null;
    fetchPaginatedTransactions: (
        id: number | 'all' | null,
        page?: number,
        date?: Date | null,
        period?: 'all' | '3d' | '7d' | '1m',
        transactionType?: string
    ) => Promise<void>;
    selectedTransactionType: string;
    setSelectedTransactionType: React.Dispatch<React.SetStateAction<string>>;
}

const SumberDanaRiwayatTab: React.FC<SumberDanaRiwayatTabProps> = ({
    selectedSumberDanaId,
    setSelectedSumberDanaId,
    paginatedHistory,
    historyLoading,
    historyError,
    fetchPaginatedTransactions,
    selectedTransactionType,
    setSelectedTransactionType,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<'all' | '3d' | '7d' | '1m'>('all'); // 'all' for all time



    // Effect to fetch paginated transactions when filters change
    useEffect(() => {
        console.log("Paginated History updated in SumberDanaRiwayatTab:", paginatedHistory);
        if (selectedSumberDanaId !== null) {
            fetchPaginatedTransactions(selectedSumberDanaId, currentPage, selectedDate, selectedPeriod, selectedTransactionType);
        }
    }, [selectedSumberDanaId, currentPage, selectedDate, selectedPeriod, selectedTransactionType, fetchPaginatedTransactions]);

    const handlePageChange = (page: number) => {
        if (paginatedHistory && page >= 1 && page <= paginatedHistory.last_page) {
            setCurrentPage(page);
        }
    };

    const handleResetFilters = () => {
        setSelectedDate(null);
        setSelectedTransactionType('all');
        setSelectedPeriod('all');
        setCurrentPage(1);
    };

    const displayedTransactions = useMemo(() => paginatedHistory?.data || [], [paginatedHistory]);

    if (historyLoading) {
        return (
            <Card className="w-full">
                <CardContent className="flex items-center justify-center p-6">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-lg">Memuat riwayat transaksi...</span>
                </CardContent>
            </Card>
        );
    }

    if (historyError) {
        return (
            <Card className="w-full">
                <CardContent className="p-6 text-red-500">
                    <p>Error: {historyError}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Riwayat Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    {/* Transaction Type Filter */}
                    <Select value={selectedTransactionType} onValueChange={(value) => {
                        setSelectedTransactionType(value);
                        setCurrentPage(1);
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Jenis Transaksi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Jenis</SelectItem>
                            <SelectItem value="pemasukan">Pemasukan</SelectItem>
                            <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                            <SelectItem value="transfer_in">Transfer Masuk</SelectItem>
                            <SelectItem value="transfer_out">Transfer Keluar</SelectItem>
                            <SelectItem value="modal_awal">Modal Awal</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Period Filter */}
                    <Select value={selectedPeriod} onValueChange={(value: 'all' | '3d' | '7d' | '1m') => {
                        setSelectedPeriod(value);
                        setCurrentPage(1);
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Periode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Waktu</SelectItem>
                            <SelectItem value="3d">3 Hari Terakhir</SelectItem>
                            <SelectItem value="7d">7 Hari Terakhir</SelectItem>
                            <SelectItem value="1m">1 Bulan Terakhir</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Single Date Picker */}
                    <DatePicker date={selectedDate} setDate={(date) => {
                        setSelectedDate(date || null);
                        setCurrentPage(1);
                    }} />

                    {/* Reset Filter Button */}
                    {(selectedDate !== null || selectedTransactionType !== 'all' || selectedPeriod !== 'all') && (
                        <Button variant="outline" onClick={handleResetFilters} className="flex items-center gap-1">
                            <XCircle className="h-4 w-4" /> Reset Filter
                        </Button>
                    )}
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">No.</TableHead>
                            <TableHead>Waktu</TableHead>
                            <TableHead>Jenis</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead className="text-right">Jumlah</TableHead>
                            <TableHead className="text-right">Saldo Setelah</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayedTransactions.length > 0 ? (
                            displayedTransactions.map((transaction: Transaction, index: number) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{((paginatedHistory!.current_page - 1) * paginatedHistory!.per_page) + index + 1}</TableCell>
                                    <TableCell>{format(parseISO(transaction.waktu), 'dd MMMM yyyy HH:mm:ss', { locale: id })}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                transaction.type === 'pemasukan' || transaction.type === 'transfer_in'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {transaction.type === 'pemasukan' && 'Pemasukan'}
                                            {transaction.type === 'pengeluaran' && 'Pengeluaran'}
                                            {transaction.type === 'transfer_in' && 'Transfer Masuk'}
                                            {transaction.type === 'transfer_out' && 'Transfer Keluar'}
                                            {transaction.type === 'modal_awal' && 'Modal Awal'}
                                        </span>
                                    </TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell
                                        className={`text-right font-medium ${
                                            transaction.type === 'pemasukan' || transaction.type === 'transfer_in' || transaction.type === 'modal_awal'
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {formatCurrency(transaction.amount)}
                                    </TableCell>
                                    <TableCell className="text-right">{formatCurrency(transaction.currentBalance)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Tidak ada riwayat transaksi.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {paginatedHistory && paginatedHistory.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" /> Sebelumnya
                        </Button>
                        <span className="text-sm text-gray-700">
                            Halaman {currentPage} dari {paginatedHistory.last_page}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === paginatedHistory.last_page}
                        >
                            Berikutnya <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SumberDanaRiwayatTab;
