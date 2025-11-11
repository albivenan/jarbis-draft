import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { format, subDays, parseISO, isWithinInterval, startOfDay, endOfDay, differenceInCalendarDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { Banknote, Wallet } from 'lucide-react';
import { ComplexDateFilterValue } from '@/components/complex-date-filter-modal';
import axios from 'axios';

// Assuming PaginatedResponse is a generic type
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

export interface SumberDana {
    id: number;
    name: string;
    balance: number;
    tipe_sumber: 'Tunai' | 'Bank';
    icon?: React.ElementType; // Make icon optional as it's not from backend
    totalPemasukan: number;
    totalPengeluaran: number;
    percentagePemasukan: number;
    percentagePengeluaran: number;
    totalPemasukanYesterday: number;
    totalPengeluaranYesterday: number;
    lastUpdated?: string;
}

export interface Transaction {
    id: string;
    sourceId: number; // Now refers to sumber_dana.id
    type: 'pemasukan' | 'pengeluaran' | 'transfer_in' | 'transfer_out' | 'modal_awal';
    description: string;
    amount: number;
    waktu: string; // ISO date-time string
    currentBalance: number; // Balance after this transaction
}

export interface ChartDataPoint {
    waktu: string;
    pemasukan: number;
    pengeluaran: number;
    laba: number;
}

export const useSumberDanaData = () => {
    const [sumberDana, setSumberDana] = useState<SumberDana[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for paginated history
    const [selectedSumberDanaId, setSelectedSumberDanaId] = useState<number | 'all' | null>('all');
    const [paginatedHistory, setPaginatedHistory] = useState<PaginatedResponse<Transaction> | null>(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setErrorHistory] = useState<string | null>(null);


    const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 29)); // Default to last 1 month
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [selectedTransactionType, setSelectedTransactionType] = useState<string>('all');
    const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
    const [analysisPeriod, setAnalysisPeriod] = useState<'3d' | '7d' | '3w' | '1m' | 'custom'>('1m');
    const [dateFilter, setDateFilter] = useState<ComplexDateFilterValue | null>(null);
    const [isFilterModalOpen, setFilterModalOpen] = useState(false);

    // Define default dates once
    const DEFAULT_START_DATE = useMemo(() => subDays(new Date(), 29), []);
    const DEFAULT_END_DATE = useMemo(() => new Date(), []);

        // Function to fetch paginated transactions for a specific SumberDana

        const fetchPaginatedTransactions = useCallback(async (id: number | 'all' | null, page: number = 1, date: Date | null | undefined, period: 'all' | '3d' | '7d' | '1m' = 'all', transactionType: string = 'all') => {

            setHistoryLoading(true);

            setErrorHistory(null);

            try {

                let url = `/api/keuangan/harian/sumber-dana/${id === null ? 'all' : id}?page=${page}`;

    

                let startDate: string | null = null;

                let endDate: string | null = null;

    

                if (date) {

                    startDate = format(date, 'yyyy-MM-dd');

                    endDate = format(date, 'yyyy-MM-dd');

                } else if (period !== 'all') {

                    const today = new Date();

                    if (period === '3d') {

                        startDate = format(subDays(today, 2), 'yyyy-MM-dd');

                    } else if (period === '7d') {

                        startDate = format(subDays(today, 6), 'yyyy-MM-dd');

                    } else if (period === '1m') {

                        startDate = format(subDays(today, 29), 'yyyy-MM-dd');

                    }

                    endDate = format(today, 'yyyy-MM-dd');

                }

    

                if (startDate && endDate) {

                    url += `&start_date=${startDate}&end_date=${endDate}`;

                }

    

                if (transactionType !== 'all') {

                    url += `&transaction_type=${transactionType}`;

                }

                                const response = await axios.get(url);

                                setPaginatedHistory(response.data.transactions);

            } catch (err) {

                console.error("Failed to fetch paginated transactions:", err);

                setErrorHistory("Gagal memuat riwayat transaksi.");

            } finally {

                setHistoryLoading(false);

            }

        }, []);

    

        // Effect to fetch paginated transactions when selectedSumberDanaId changes

        useEffect(() => {

            if (selectedSumberDanaId !== null) {

                // Pass null for date and 'all' for period for now, will be handled by SumberDanaRiwayatTab

                fetchPaginatedTransactions(selectedSumberDanaId, 1, null, 'all');

            }

        }, [selectedSumberDanaId, fetchPaginatedTransactions]);

    

        const fetchData = useCallback(async () => {

            setLoading(true);

            setError(null);

            try {

                const formattedStartDate = format(startDate, 'yyyy-MM-dd');

                const formattedEndDate = format(endDate, 'yyyy-MM-dd');

                const response = await axios.get(`/api/keuangan/harian/sumber-dana?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);

                

                                const fetchedSumberDana: SumberDana[] = response.data.sumberDana.map((sd: any) => ({

                

                                    ...sd,

                

                                    balance: parseFloat(sd.balance) || 0, // Ensure balance is a number

                

                                    icon: sd.tipe_sumber === 'Tunai' ? Wallet : Banknote, // Assign icons based on type

                

                                }));

                setSumberDana(fetchedSumberDana);

    

                // Ensure default 'Tunai' and 'Bank' sources always exist

                let finalSumberDana = [...fetchedSumberDana];

                if (!fetchedSumberDana.some(sd => sd.tipe_sumber === 'Tunai')) {

                    finalSumberDana.push({ 

                        id: -1, name: 'Tunai', balance: 0, tipe_sumber: 'Tunai', icon: Wallet, 

                        totalPemasukan: 0, totalPengeluaran: 0, percentagePemasukan: 0, percentagePengeluaran: 0, 

                        totalPemasukanYesterday: 0, totalPengeluaranYesterday: 0 

                    });

                }

                if (!fetchedSumberDana.some(sd => sd.tipe_sumber === 'Bank')) {

                    finalSumberDana.push({ 

                        id: -2, name: 'Rekening Bank', balance: 0, tipe_sumber: 'Bank', icon: Banknote, 

                        totalPemasukan: 0, totalPengeluaran: 0, percentagePemasukan: 0, percentagePengeluaran: 0, 

                        totalPemasukanYesterday: 0, totalPengeluaranYesterday: 0 

                    });

                }

                            setSumberDana(finalSumberDana);

                

                            setTransactions(response.data.transactions);

                

                                                        // If a specific sumber dana is selected (or just defaulted), re-fetch its paginated transactions

                

                                                        if (selectedSumberDanaId !== null || finalSumberDana.length > 0) {

                

                                                            const idToFetch = selectedSumberDanaId !== null ? selectedSumberDanaId : 'all'; // Default to 'all' if nothing is explicitly selected

                

                                                            fetchPaginatedTransactions(idToFetch, 1, null, 'all');

                

                                                        }

            } catch (err) {

                console.error("Failed to fetch sumber dana data:", err);

                setError("Gagal memuat data sumber dana.");

            } finally {

                setLoading(false);

            }

        }, [startDate, endDate, selectedSumberDanaId, fetchPaginatedTransactions]);

    

        useEffect(() => {

            fetchData();

        }, [fetchData]);

    

        // Effect to update startDate and endDate based on analysisPeriod or dateFilter

        useEffect(() => {

            const today = new Date();

            let newStartDate = today;

            let newEndDate = today;

    

            if (analysisPeriod === '3d') {

                newStartDate = subDays(today, 2);

            } else if (analysisPeriod === '7d') {

                newStartDate = subDays(today, 6);

            } else if (analysisPeriod === '3w') {

                newStartDate = subDays(today, 20);

            } else if (analysisPeriod === '1m') {

                newStartDate = subDays(today, 29);

            } else if (analysisPeriod === 'custom' && dateFilter && dateFilter.start_date) {

                newStartDate = parseISO(dateFilter.start_date);

                newEndDate = dateFilter.end_date ? parseISO(dateFilter.end_date) : newStartDate;

            }

    

            setStartDate(startOfDay(newStartDate));

            setEndDate(endOfDay(newEndDate));

        }, [analysisPeriod, dateFilter]);

    

        const isAnyFilterActive = useMemo(() => {

            // Default analysisPeriod is '1m', so check against that

            if (selectedTransactionType !== 'all') return true;

            if (selectedSourceFilter !== 'all') return true;

            if (analysisPeriod !== '1m') return true; // Changed from '7d'

            if (dateFilter) return true;

    

            return false;

        }, [selectedTransactionType, selectedSourceFilter, analysisPeriod, dateFilter]);

    

                const filteredTransactions = useMemo(() => {

    

                    console.log("All transactions before filtering:", transactions);

    

                    const filtered = transactions.filter(tx => {

    

                        const txDate = tx.waktu ? parseISO(tx.waktu) : new Date(); // Fallback to current date if waktu is null/undefined

    

                        const isDateMatch = isWithinInterval(txDate, { start: startDate, end: endDate });

    

                        const isTypeMatch = selectedTransactionType === 'all' || tx.type === selectedTransactionType;

    

                        const isSourceMatch = selectedSourceFilter === 'all' || tx.sourceId === Number(selectedSourceFilter);

    

        

    

                        return isDateMatch && isTypeMatch && isSourceMatch;

    

                    });

    

                    console.log("Filtered transactions (pengeluaran type):", filtered.filter(tx => tx.type === 'pengeluaran'));

    

                    return filtered;

    

                }, [transactions, startDate, endDate, selectedTransactionType, selectedSourceFilter]);

    

        const handlePemasukan = useCallback(async (sourceId: number, amount: number, description: string) => {

            try {

                const payload = {

                    sumber_dana_id: sourceId,

                    amount,

                    description,

                };

                console.log("Sending pemasukan payload:", payload);

                await axios.post('/api/keuangan/harian/sumber-dana/pemasukan', payload);

                fetchData(); // Re-fetch all data to update balances and transactions

            } finally {

                // Ensure history is re-fetched after any transaction

                if (selectedSumberDanaId !== null) {

                    fetchPaginatedTransactions(selectedSumberDanaId, 1, null, 'all');

                }

            }

        }, [fetchData, selectedSumberDanaId, fetchPaginatedTransactions]);

    

        const handlePengeluaran = useCallback(async (sourceId: number, amount: number, description: string) => {

            try {

                await axios.post('/api/keuangan/harian/sumber-dana/pengeluaran', {

                    sumber_dana_id: sourceId,

                    amount,

                    description,

                });

                fetchData(); // Re-fetch all data to update balances and transactions

            } finally {

                // Ensure history is re-fetched after any transaction

                if (selectedSumberDanaId !== null) {

                    fetchPaginatedTransactions(selectedSumberDanaId, 1, null, 'all');

                }

            }

        }, [fetchData, selectedSumberDanaId, fetchPaginatedTransactions]);

    

        const handleTransfer = useCallback(async (fromSourceId: number, toSourceId: number, amount: number, description: string) => {

            try {

                await axios.post('/api/keuangan/harian/sumber-dana/transfer', {

                    from_sumber_dana_id: fromSourceId,

                    to_sumber_dana_id: toSourceId,

                    amount,

                    description,

                });

                fetchData(); // Re-fetch all data to update balances and transactions

            } finally {

                // Ensure history is re-fetched after any transaction

                if (selectedSumberDanaId !== null) {

                    fetchPaginatedTransactions(selectedSumberDanaId, 1, null, 'all');

                }

            }

        }, [fetchData, selectedSumberDanaId, fetchPaginatedTransactions]);

    

        const handleResetFilter = useCallback(() => {

            setStartDate(DEFAULT_START_DATE);

            setEndDate(DEFAULT_END_DATE);

            setSelectedTransactionType('all');

            setSelectedSourceFilter('all');

            setAnalysisPeriod('1m'); // Changed from '7d'

            setDateFilter(null);

        }, [DEFAULT_START_DATE, DEFAULT_END_DATE]);

    

        const handleApplyFilter = (filter: ComplexDateFilterValue) => {

            setDateFilter(filter);

            setAnalysisPeriod('custom');

            setFilterModalOpen(false);

        };

    

        const generateChartData = useCallback((sourceId: number): ChartDataPoint[] => {

            const dataMap = new Map<string, { pemasukan: number; pengeluaran: number }>();

            const days = differenceInCalendarDays(endOfDay(endDate), startOfDay(startDate));

    

            for (let i = 0; i <= days; i++) {

                const date = format(subDays(endOfDay(endDate), i), 'yyyy-MM-dd');

                dataMap.set(date, { pemasukan: 0, pengeluaran: 0 });

            }

    

            filteredTransactions.forEach(tx => {

                if (tx.sourceId === sourceId) {

                    const date = format(parseISO(tx.waktu || new Date().toISOString()), 'yyyy-MM-dd'); // Fallback if waktu is null/undefined

                    const entry = dataMap.get(date);

                    if (entry) {

                        if (tx.type === 'pemasukan' || tx.type === 'transfer_in') {

                            entry.pemasukan += tx.amount;

                        } else if (tx.type === 'pengeluaran' || tx.type === 'transfer_out') {

                            entry.pengeluaran += Math.abs(tx.amount);

                        }

                    }

                }

            });

    

                        let cumulativeLaba = 0;

    

                        const sortedData = Array.from(dataMap.entries())

    

                            .map(([date, values]) => ({ waktu: date, ...values }))

    

                            .sort((a, b) => parseISO(a.waktu).getTime() - parseISO(b.waktu).getTime());

    

            

    

                        return sortedData.map(entry => {

    

                            cumulativeLaba += entry.pemasukan - entry.pengeluaran;

    

                            return { ...entry, laba: cumulativeLaba };

    

                        });

        }, [filteredTransactions, startDate, endDate]);

    

        const chartDataTunai = useMemo(() => generateChartData(sumberDana.find(sd => sd.tipe_sumber === 'Tunai')?.id || 0), [generateChartData, sumberDana]);

        const chartDataRekening = useMemo(() => generateChartData(sumberDana.find(sd => sd.tipe_sumber === 'Bank')?.id || 0), [generateChartData, sumberDana]);


    return {
        sumberDana,
        transactions,
        filteredTransactions,
        chartDataTunai,
        chartDataRekening,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        selectedTransactionType,
        setSelectedTransactionType,
        selectedSourceFilter,
        setSelectedSourceFilter,
        analysisPeriod,
        setAnalysisPeriod,
        dateFilter,
        setDateFilter,
        isFilterModalOpen,
        setFilterModalOpen,
        isAnyFilterActive,
        handleResetFilter,
        handlePemasukan,
        handlePengeluaran,
        handleTransfer,
        handleApplyFilter,
        loading,
        error,
        // New exports for history tab
        selectedSumberDanaId,
        setSelectedSumberDanaId,
        paginatedHistory,
        historyLoading,
        historyError,
        fetchPaginatedTransactions,
        fetchData,
    };
};