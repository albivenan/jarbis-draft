import { useState, useEffect, useMemo, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, addMonths, subYears, addYears, startOfDay, endOfDay, subDays, addDays, subWeeks, addWeeks, parseISO, differenceInHours, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { ComplexDateFilterValue } from '@/components/complex-date-filter-modal';
import { JENIS_PENGELUARAN, STATUS_PENGELUARAN, JenisPengeluaran, jenisPengeluaranValues, JENIS_COLORS, DESIRED_LEGEND_ORDER } from '../utils/constants';
import { LegendPayload } from 'recharts';

export interface Pengeluaran {
    id: number;
    user_id: number;
    tanggal: string;
    description: string;
    amount: number;
    jenis_pengeluaran: string;
    catatan: string | null;
    invoice_path: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
    };
    sumber_dana?: { // Added sumber_dana
        id: number;
        nama_sumber: string;
    };
}

interface AnalysisDataPoint {
    name: string;
    total: number;
    [key: string]: any;
}

interface AnalysisResult {
    chartData: AnalysisDataPoint[];
    total: number;
    compareTotal: number;
    percentageChange: number;
    periodLabel: string;
    comparisonLabel: string;
    chartKeys: { dataKey: string; color: string; type: 'line' | 'area' | 'bar' }[];
    periodJenisTotals: { [key: string]: number };
    pieChartData: { name: string; value: number }[];
    jenisPercentageChanges: { [key: string]: number };
    periodJenisCounts: { [key: string]: number };
}

interface FormValues {
    description: string;
    amount: number;
    jenis_pengeluaran: JenisPengeluaran;
    catatan: string | null;
    invoice: File | null;
    status: string;
}

export interface UsePengeluaranDataReturn {
    pengeluaranData: Pengeluaran[];
    setPengeluaranData: React.Dispatch<React.SetStateAction<Pengeluaran[]>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    selectedDate: Date | undefined;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    filteredData: Pengeluaran[];
    totalPengeluaran: number;
    handleDeleteClick: (id: number) => void;
    handleEditClick: (pengeluaran: Pengeluaran) => void;
    isEditModalOpen: boolean;
    setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    editingPengeluaran: Pengeluaran | null;
    setEditingPengeluaran: React.Dispatch<React.SetStateAction<Pengeluaran | null>>;
    formValues: FormValues;
    setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
    handleSaveEdit: () => void;
    analysisData: AnalysisResult;
    isFilterModalOpen: boolean;
    setFilterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    dateFilter: ComplexDateFilterValue | null;
    setDateFilter: React.Dispatch<React.SetStateAction<ComplexDateFilterValue | null>>;
    analysisJenisFilter: string[];
    setAnalysisJenisFilter: React.Dispatch<React.SetStateAction<string[]>>;
    analysisPeriod: '3d' | '7d' | '3w' | '1m' | 'custom';
    setAnalysisPeriod: React.Dispatch<React.SetStateAction<'3d' | '7d' | '3w' | '1m' | 'custom'>>;
    isDateSelectedByUser: boolean;
    setIsDateSelectedByUser: React.Dispatch<React.SetStateAction<boolean>>;
    isCalendarOpen: boolean;
    setIsCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    showArea: boolean;
    setShowArea: React.Dispatch<React.SetStateAction<boolean>>;
    handleApplyFilter: (filter: ComplexDateFilterValue) => void;
    handleResetFilter: () => void;
    handleDateSelect: (date: Date | undefined) => void;
    isAnyFilterActive: boolean;
    hiddenKeys: string[];
    setHiddenKeys: React.Dispatch<React.SetStateAction<string[]>>;
    handleLegendClick: (data: LegendPayload) => void;
}

export const usePengeluaranData = (initialPengeluaran: Pengeluaran[]): UsePengeluaranDataReturn => {
    const [pengeluaranData, setPengeluaranData] = useState<Pengeluaran[]>(initialPengeluaran);

    useEffect(() => {
        setPengeluaranData(initialPengeluaran);
    }, [initialPengeluaran]);

    const [isFilterModalOpen, setFilterModalOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState<ComplexDateFilterValue | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);
    const [analysisJenisFilter, setAnalysisJenisFilter] = useState<string[]>([...jenisPengeluaranValues, 'total_keseluruhan']);
    const [analysisPeriod, setAnalysisPeriod] = useState<'3d' | '7d' | '3w' | '1m' | 'custom'>('7d');
    const [isDateSelectedByUser, setIsDateSelectedByUser] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [showArea, setShowArea] = useState(true);

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingPengeluaran, setEditingPengeluaran] = useState<Pengeluaran | null>(null);

    const [formValues, setFormValues] = useState<FormValues>({ description: '', amount: 0, jenis_pengeluaran: JENIS_PENGELUARAN.OPERASIONAL as JenisPengeluaran, catatan: '', invoice: null, status: STATUS_PENGELUARAN.DRAFT });

    const handleApplyFilter = useCallback((filter: ComplexDateFilterValue) => {
        setDateFilter(filter);
        setSelectedDate(undefined);
        setAnalysisPeriod('7d'); // Reset to default period when complex filter is applied
    }, []);

    const handleResetFilter = useCallback(() => {
        setDateFilter(null);
        setSelectedDate(new Date()); // Set selectedDate back to today
        setAnalysisPeriod('7d'); // Ensure analysisPeriod is default
        setIsDateSelectedByUser(false);
    }, []);

    const handleDateSelect = useCallback((date: Date | undefined) => {
        setSelectedDate(date);
        setIsDateSelectedByUser(true);
        setIsCalendarOpen(false);
    }, []);

    const isAnyFilterActive = useMemo(() => {
        const initialMonthStart = startOfMonth(new Date()).toISOString().split('T')[0];
        const initialMonthEnd = endOfMonth(new Date()).toISOString().split('T')[0];
        const currentSelectedMonthStart = selectedDate ? startOfMonth(selectedDate).toISOString().split('T')[0] : '';
        const currentSelectedMonthEnd = selectedDate ? endOfMonth(selectedDate).toISOString().split('T')[0] : '';

        return (
            searchTerm !== '' ||
            hiddenKeys.length > 0 ||
            analysisJenisFilter.length > 0 ||
            analysisPeriod !== '1m' ||
            dateFilter !== null ||
            isDateSelectedByUser ||
            (currentSelectedMonthStart !== initialMonthStart || currentSelectedMonthEnd !== initialMonthEnd)
        );
    }, [searchTerm, hiddenKeys, analysisJenisFilter, analysisPeriod, dateFilter, isDateSelectedByUser, selectedDate]);

    const handleLegendClick = useCallback((data: LegendPayload) => {
        if (data.dataKey) {
            setHiddenKeys(prev =>
                prev.includes(data.dataKey as string) ? prev.filter(key => key !== data.dataKey) : [...prev, data.dataKey as string]
            );
        }
    }, []);

    const handleEditClick = useCallback((pengeluaran: Pengeluaran) => {
        setEditingPengeluaran(pengeluaran);
        setFormValues({
            description: pengeluaran.description,
            amount: pengeluaran.amount,
            jenis_pengeluaran: pengeluaran.jenis_pengeluaran as JenisPengeluaran,
            catatan: pengeluaran.catatan || '',
            invoice: null,
            status: pengeluaran.status,
        });
        setEditModalOpen(true);
    }, []);

    const handleSaveEdit = useCallback(() => {
        if (!editingPengeluaran) return;

        const formData = new FormData();
        formData.append('_method', 'put'); // Spoof PUT request for Laravel
        formData.append('description', formValues.description);
        formData.append('amount', formValues.amount.toString()); // Ensure amount is string for FormData
        formData.append('jenis_pengeluaran', formValues.jenis_pengeluaran);
        formData.append('catatan', formValues.catatan || '');
        formData.append('status', formValues.status);
        if (formValues.invoice) {
            formData.append('invoice', formValues.invoice);
        }

        router.post(route('manajer-keuangan.harian.pengeluaran.update', editingPengeluaran.id), formData, {
            onSuccess: () => {
                toast.success('Pengeluaran berhasil diperbarui.');
                setEditModalOpen(false);
                setEditingPengeluaran(null);
                // Inertia will automatically re-render the page with updated data
                // No need to manually update pengeluaranData state here
            },
            onError: (errors) => {
                console.error("Error updating pengeluaran:", errors);
                toast.error("Gagal memperbarui pengeluaran.");
            }
        });
    }, [editingPengeluaran, formValues]);

    const handleDeleteClick = useCallback((id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) {
            router.delete(route('manajer-keuangan.harian.pengeluaran.destroy', id), {
                onSuccess: () => {
                    toast.success('Pengeluaran berhasil dihapus.');
                    // Inertia will automatically re-render the page with updated data
                    // No need to manually update pengeluaranData state here
                },
                onError: (errors) => {
                    console.error("Error deleting pengeluaran:", errors);
                    toast.error("Gagal menghapus pengeluaran.");
                }
            });
        }
    }, []);

    const filteredData = useMemo(() => {
        const data = pengeluaranData.filter(item => {
            const itemDate = startOfDay(parseISO(item.created_at));
            const isDateMatch = selectedDate ? (itemDate.getTime() === startOfDay(selectedDate).getTime()) : true; // If no date selected, all dates match
            const isSearchMatch = item.description.toLowerCase().includes(searchTerm.toLowerCase());
            return isDateMatch && isSearchMatch;
        });
        return data;
    }, [pengeluaranData, selectedDate, searchTerm]);

    const totalPengeluaran = useMemo(() => filteredData.reduce((sum, item) => sum + Number(item.amount), 0), [filteredData]);

    const analysisData = useMemo(() => {
        const finalPengeluaranData = pengeluaranData.filter(item => item.status === 'Final');
        const calculatePercentageChange = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return ((current - previous) / previous) * 100;
        };

        let chartData: any[] = [];
        let total = 0;
        let compareTotal = 0;
        let percentageChange = 0;
        let periodLabel = '';
        let comparisonLabel = 'vs Kemarin';
        let chartKeys: any[] = [];
        const periodJenisTotals: { [key: string]: number } = {};
        jenisPengeluaranValues.forEach(jenis => periodJenisTotals[jenis] = 0);
        const periodJenisCounts: { [key: string]: number } = {};
        jenisPengeluaranValues.forEach(jenis => periodJenisCounts[jenis] = 0);
        const jenisPercentageChanges: { [key: string]: number } = {}; // New variable

        const lineKeys = jenisPengeluaranValues.map(jenis => ({
            type: 'line',
            dataKey: jenis,
            name: jenis,
            stroke: JENIS_COLORS[jenis as JenisPengeluaran],
            strokeWidth: 2,
        }));
        const totalLineKey = { type: 'line', dataKey: 'total_keseluruhan', name: 'Total', stroke: JENIS_COLORS['Total Keseluruhan'], strokeWidth: 3 };
        
        const areaKeys = jenisPengeluaranValues.map(jenis => ({
            type: 'area',
            dataKey: jenis,
            fill: JENIS_COLORS[jenis as JenisPengeluaran],
            fillOpacity: 0.2,
            stroke: 0,
            hide: false,
        }));

        if (selectedDate) {
            periodLabel = `Harian: ${format(selectedDate, 'd MMM yyyy', { locale: id })}`;
            comparisonLabel = 'vs Hari Sebelumnya';

            const todayData: { [key: string]: any } = { name: format(selectedDate, 'dd/MM'), total_keseluruhan: 0 };
            const yesterdayData: { [key: string]: any } = { name: format(subDays(selectedDate, 1), 'dd/MM'), total_keseluruhan: 0 };
            jenisPengeluaranValues.forEach(j => { todayData[j] = 0; yesterdayData[j] = 0; });

            finalPengeluaranData.forEach(item => {
                const itemDate = startOfDay(parseISO(item.created_at));
                if (itemDate.getTime() === startOfDay(selectedDate).getTime()) {
                    todayData.total_keseluruhan += Number(item.amount);
                    todayData[item.jenis_pengeluaran] += Number(item.amount);
                    periodJenisTotals[item.jenis_pengeluaran] = (periodJenisTotals[item.jenis_pengeluaran] || 0) + Number(item.amount);
                    periodJenisCounts[item.jenis_pengeluaran]++;
                }
                if (itemDate.getTime() === startOfDay(subDays(selectedDate, 1)).getTime()) {
                    yesterdayData.total_keseluruhan += Number(item.amount);
                    yesterdayData[item.jenis_pengeluaran] += Number(item.amount);
                    analysisJenisFilter.filter(j => j !== 'total_keseluruhan').forEach(jenis => compareTotal += Number(item.amount));
                }
            });
            periodJenisTotals['total_keseluruhan'] = todayData.total_keseluruhan;
            total = periodJenisTotals['total_keseluruhan'];

            chartData = [yesterdayData, todayData];
            if (total === 0) chartData = [];
            chartKeys = [...lineKeys, totalLineKey, ...areaKeys];
            percentageChange = calculatePercentageChange(total, compareTotal);

            jenisPengeluaranValues.forEach(jenis => {
                const currentJenisTotal = todayData[jenis] || 0;
                const previousJenisTotal = yesterdayData[jenis] || 0;
                jenisPercentageChanges[jenis] = calculatePercentageChange(currentJenisTotal, previousJenisTotal);
            });

        } else if (dateFilter) {
            if (dateFilter.mode === 'perbandingan_bulan' && dateFilter.start_month_year && dateFilter.compare_month_year) {
                const startMonth = parseISO(dateFilter.start_month_year + '-01');
                const compareMonth = parseISO(dateFilter.compare_month_year + '-01');
                periodLabel = `Perbandingan Bulanan: ${format(startMonth, 'MMM yyyy', { locale: id })} vs ${format(compareMonth, 'MMM yyyy', { locale: id })}`;
                comparisonLabel = `vs ${format(compareMonth, 'MMM yyyy', { locale: id })}`;

                const monthAData: { [key: string]: any } = { name: format(startMonth, 'MMM yyyy'), total_keseluruhan: 0 };
                const monthBData: { [key: string]: any } = { name: format(compareMonth, 'MMM yyyy'), total_keseluruhan: 0 };
                jenisPengeluaranValues.forEach(j => { monthAData[j] = 0; monthBData[j] = 0; });

                finalPengeluaranData.forEach(item => {
                    const itemDate = parseISO(item.created_at);
                
                    // Process current month (startMonth)
                    if (itemDate >= startOfMonth(startMonth) && itemDate <= endOfMonth(startMonth)) {
                        monthAData.total_keseluruhan += Number(item.amount);
                        monthAData[item.jenis_pengeluaran] += Number(item.amount);
                        periodJenisTotals[item.jenis_pengeluaran] = (periodJenisTotals[item.jenis_pengeluaran] || 0) + Number(item.amount);
                        periodJenisCounts[item.jenis_pengeluaran]++;
                    }
                
                    // Process comparison month (compareMonth)
                    if (itemDate >= startOfMonth(compareMonth) && itemDate <= endOfMonth(compareMonth)) {
                        monthBData.total_keseluruhan += Number(item.amount);
                        monthBData[item.jenis_pengeluaran] += Number(item.amount);
                        compareTotal += Number(item.amount); // Accumulate total for comparison period
                    }
                });
                                
                // After the loop, set total and periodJenisTotals['total_keseluruhan']
                periodJenisTotals['total_keseluruhan'] = monthAData.total_keseluruhan;
                total = periodJenisTotals['total_keseluruhan'];
                
                chartData = [monthAData, monthBData];
                if (total === 0) chartData = [];
                chartKeys = [...lineKeys, totalLineKey, ...areaKeys];
                percentageChange = calculatePercentageChange(total, compareTotal);
                
                jenisPengeluaranValues.forEach(jenis => {
                    const currentJenisTotal = monthAData[jenis] || 0;
                    const previousJenisTotal = monthBData[jenis] || 0;
                    jenisPercentageChanges[jenis] = calculatePercentageChange(currentJenisTotal, previousJenisTotal);
                });
            } else if (dateFilter.mode === 'perbandingan_rentang_bulanan' && dateFilter.start_date && dateFilter.end_date) {
                const startDate = startOfMonth(parseISO(dateFilter.start_date));
                const endDate = endOfMonth(parseISO(dateFilter.end_date));

                const startDateKey = format(startDate, 'MMM yyyy', { locale: id });
                const endDateKey = format(endDate, 'MMM yyyy', { locale: id });

                periodLabel = `Rentang Bulanan: ${startDateKey} - ${endDateKey}`;
                comparisonLabel = '';

                const rangeAData: { [key: string]: any } = { name: `${startDateKey} - ${endDateKey}`, total_keseluruhan: 0 };
                jenisPengeluaranValues.forEach(j => { rangeAData[j] = 0; });

                finalPengeluaranData.forEach(item => {
                    const itemDate = parseISO(item.created_at);
                    if (isWithinInterval(itemDate, { start: startDate, end: endDate })) {
                        rangeAData.total_keseluruhan += Number(item.amount);
                        rangeAData[item.jenis_pengeluaran] += Number(item.amount);
                        periodJenisTotals[item.jenis_pengeluaran] = (periodJenisTotals[item.jenis_pengeluaran] || 0) + Number(item.amount);
                        periodJenisCounts[item.jenis_pengeluaran]++;
                    }
                });
                periodJenisTotals['total_keseluruhan'] = rangeAData.total_keseluruhan;
                total = periodJenisTotals['total_keseluruhan'];

                chartData = [rangeAData];
                if (total === 0) chartData = [];
                chartKeys = [...lineKeys, totalLineKey, ...areaKeys];
                percentageChange = 0;
                jenisPengeluaranValues.forEach(jenis => {
                    jenisPercentageChanges[jenis] = 0;
                });

                if (dateFilter.compare_start_date && dateFilter.compare_end_date) {
                    const compareStartDate = startOfMonth(parseISO(dateFilter.compare_start_date));
                    const compareEndDate = endOfMonth(parseISO(dateFilter.compare_end_date));

                    const compareStartDateKey = format(compareStartDate, 'MMM yyyy', { locale: id });
                    const compareEndDateKey = format(compareEndDate, 'MMM yyyy', { locale: id });

                    periodLabel = `Perbandingan Rentang Bulanan: ${startDateKey} - ${endDateKey} vs ${compareStartDateKey} - ${compareEndDateKey}`;
                    comparisonLabel = `vs ${compareStartDateKey} - ${compareEndDateKey}`;

                    const rangeBData: { [key: string]: any } = { name: `${compareStartDateKey} - ${compareEndDateKey}`, total_keseluruhan: 0 };
                    jenisPengeluaranValues.forEach(j => { rangeBData[j] = 0; });

                    finalPengeluaranData.forEach(item => {
                        const itemDate = parseISO(item.created_at);
                        if (isWithinInterval(itemDate, { start: compareStartDate, end: compareEndDate })) {
                            rangeBData.total_keseluruhan += Number(item.amount);
                            rangeBData[item.jenis_pengeluaran] += Number(item.amount);
                            if (analysisJenisFilter.filter(j => j !== 'total_keseluruhan').includes(item.jenis_pengeluaran)) compareTotal += Number(item.amount);
                        }
                    });

                    chartData = [rangeAData, rangeBData];
                    if (total === 0) chartData = [];
                    percentageChange = calculatePercentageChange(total, compareTotal);

                    jenisPengeluaranValues.forEach(jenis => {
                        const currentJenisTotal = rangeAData[jenis] || 0;
                        const previousJenisTotal = rangeBData[jenis] || 0;
                        jenisPercentageChanges[jenis] = calculatePercentageChange(currentJenisTotal, previousJenisTotal);
                    });
                }
            } else if (dateFilter.mode === 'perbandingan_harian' && dateFilter.start_date && dateFilter.compare_start_date) {
                const startDate = startOfDay(parseISO(dateFilter.start_date));
                const compareDate = startOfDay(parseISO(dateFilter.compare_start_date));
                const startDateKey = format(startDate, 'd MMM yyyy');
                const compareDateKey = format(compareDate, 'd MMM yyyy');
                periodLabel = `Perbandingan Harian: ${startDateKey} vs ${compareDateKey}`;
                comparisonLabel = `vs ${compareDateKey}`;

                const dayAData: { [key: string]: any } = { name: startDateKey, total_keseluruhan: 0 };
                const dayBData: { [key: string]: any } = { name: compareDateKey, total_keseluruhan: 0 };
                jenisPengeluaranValues.forEach(j => { dayAData[j] = 0; dayBData[j] = 0; });

                finalPengeluaranData.forEach(item => {
                    const itemDate = startOfDay(parseISO(item.created_at));
                    if (itemDate.getTime() === startDate.getTime()) {
                        dayAData.total_keseluruhan += Number(item.amount);
                        dayAData[item.jenis_pengeluaran] += Number(item.amount);
                        periodJenisTotals[item.jenis_pengeluaran] = (periodJenisTotals[item.jenis_pengeluaran] || 0) + Number(item.amount);
                        periodJenisCounts[item.jenis_pengeluaran]++;
                    }
                    if (itemDate.getTime() === compareDate.getTime()) {
                        dayBData.total_keseluruhan += Number(item.amount);
                        dayBData[item.jenis_pengeluaran] += Number(item.amount);
                        if (analysisJenisFilter.filter(j => j !== 'total_keseluruhan').includes(item.jenis_pengeluaran)) compareTotal += Number(item.amount);
                    }
                });
                periodJenisTotals['total_keseluruhan'] = dayAData.total_keseluruhan;
                total = periodJenisTotals['total_keseluruhan'];

                chartData = [dayAData, dayBData];
                if (total === 0) chartData = [];
                chartKeys = [...lineKeys, totalLineKey, ...areaKeys];
                percentageChange = calculatePercentageChange(total, compareTotal);

                jenisPengeluaranValues.forEach(jenis => {
                    const currentJenisTotal = dayAData[jenis] || 0;
                    const previousJenisTotal = dayBData[jenis] || 0;
                    jenisPercentageChanges[jenis] = calculatePercentageChange(currentJenisTotal, previousJenisTotal);
                });
            } else if (dateFilter.mode === 'perbandingan_rentang_harian' && dateFilter.start_date && dateFilter.end_date) {
                const startDate = startOfDay(parseISO(dateFilter.start_date));
                const endDate = endOfDay(parseISO(dateFilter.end_date));

                const startDateKey = format(startDate, 'd MMM yyyy');
                const endDateKey = format(endDate, 'd MMM yyyy');

                periodLabel = `Rentang Harian: ${startDateKey} - ${endDateKey}`;
                comparisonLabel = '';

                const rangeAData: { [key: string]: any } = { name: `${startDateKey} - ${endDateKey}`, total_keseluruhan: 0 };
                jenisPengeluaranValues.forEach(j => { rangeAData[j] = 0; });

                finalPengeluaranData.forEach(item => {
                    const itemDate = startOfDay(parseISO(item.created_at));
                    if (isWithinInterval(itemDate, { start: startDate, end: endDate })) {
                        rangeAData.total_keseluruhan += item.amount;
                        rangeAData[item.jenis_pengeluaran] += item.amount;
                        periodJenisTotals[item.jenis_pengeluaran] = (periodJenisTotals[item.jenis_pengeluaran] || 0) + item.amount;
                        periodJenisCounts[item.jenis_pengeluaran]++;
                    }
                });
                periodJenisTotals['total_keseluruhan'] = rangeAData.total_keseluruhan;
                total = periodJenisTotals['total_keseluruhan'];

                chartData = [rangeAData];
                if (total === 0) chartData = [];
                chartKeys = [...lineKeys, totalLineKey, ...areaKeys];
                percentageChange = 0;
                jenisPengeluaranValues.forEach(jenis => {
                    jenisPercentageChanges[jenis] = 0;
                });

                if (dateFilter.compare_start_date && dateFilter.compare_end_date) {
                    const compareStartDate = startOfDay(parseISO(dateFilter.compare_start_date));
                    const compareEndDate = endOfDay(parseISO(dateFilter.compare_end_date));

                    const compareStartDateKey = format(compareStartDate, 'd MMM yyyy');
                    const compareEndDateKey = format(compareEndDate, 'd MMM yyyy');

                    periodLabel = `Perbandingan Rentang Harian: ${startDateKey} - ${endDateKey} vs ${compareStartDateKey} - ${compareEndDateKey}`;
                    comparisonLabel = `vs ${compareStartDateKey} - ${compareEndDateKey}`;

                    const rangeBData: { [key: string]: any } = { name: `${compareStartDateKey} - ${compareEndDateKey}`, total_keseluruhan: 0 };
                    jenisPengeluaranValues.forEach(j => { rangeBData[j] = 0; });

                    finalPengeluaranData.forEach(item => {
                        const itemDate = startOfDay(parseISO(item.created_at));
                        if (isWithinInterval(itemDate, { start: compareStartDate, end: compareEndDate })) {
                            rangeBData.total_keseluruhan += item.amount;
                            rangeBData[item.jenis_pengeluaran] += item.amount;
                            if (analysisJenisFilter.filter(j => j !== 'total_keseluruhan').includes(item.jenis_pengeluaran)) compareTotal += item.amount;
                        }
                    });

                    chartData = [rangeAData, rangeBData];
                    if (total === 0) chartData = [];
                    percentageChange = calculatePercentageChange(total, compareTotal);

                    jenisPengeluaranValues.forEach(jenis => {
                        const currentJenisTotal = rangeAData[jenis] || 0;
                        const previousJenisTotal = rangeBData[jenis] || 0;
                        jenisPercentageChanges[jenis] = calculatePercentageChange(currentJenisTotal, previousJenisTotal);
                    });
                }
            }
        } else {
            const PERIOD_OPTIONS = {
                '3d': { label: '3 Hari Terakhir', days: 3, comparisonLabel: 'vs 3 Hari Sebelumnya' },
                '7d': { label: '7 Hari Terakhir', days: 7, comparisonLabel: 'vs 7 Hari Sebelumnya' },
                '3w': { label: '3 Minggu Terakhir', days: 21, comparisonLabel: 'vs 3 Minggu Sebelumnya' },
                '1m': { label: '1 Bulan Terakhir', days: 30, comparisonLabel: 'vs 1 Bulan Sebelumnya' },
            };
            type AnalysisPeriod = keyof typeof PERIOD_OPTIONS;

            const periodOption = PERIOD_OPTIONS[analysisPeriod as AnalysisPeriod];
            const today = startOfDay(new Date());
            const startDate = subDays(today, periodOption.days - 1);
            
            periodLabel = `${periodOption.label} (${format(startDate, 'd MMM', { locale: id })}) - ${format(today, 'd MMM yyyy', { locale: id })}`;
            comparisonLabel = periodOption.comparisonLabel;
            let previousPeriodTotal = 0;
            const previousPeriodJenisTotals: { [key: string]: number } = {}; // Initialize previousPeriodJenisTotals
            jenisPengeluaranValues.forEach(jenis => {
                previousPeriodJenisTotals[jenis] = 0;
            });

            const dataByDay = new Map<string, { total_keseluruhan: number, [key: string]: number }>();
            const totalDaysToFetch = periodOption.days * 2;

            for (let i = 0; i < totalDaysToFetch; i++) {
                const date = subDays(today, i);
                const dayKey = format(date, 'yyyy-MM-dd');
                const newDayData: { total_keseluruhan: number, [key: string]: number } = { total_keseluruhan: 0 };
                jenisPengeluaranValues.forEach(j => newDayData[j] = 0);
                dataByDay.set(dayKey, newDayData);
            }

            finalPengeluaranData.forEach(item => {
                const itemDate = startOfDay(parseISO(item.created_at));
                if (differenceInHours(today, itemDate) < (totalDaysToFetch * 24)) {
                    const dayKey = format(itemDate, 'yyyy-MM-dd');
                    const dayData = dataByDay.get(dayKey);
                    if (dayData) {
                        dayData.total_keseluruhan += item.amount;
                        dayData[item.jenis_pengeluaran] += item.amount;
                        const startDateForPeriod = subDays(today, periodOption.days - 1);
                        if (itemDate >= startDateForPeriod && itemDate <= today) {
                            periodJenisCounts[item.jenis_pengeluaran]++;
                        }
                    }
                }
            });

            const tempChartData = [];
            for (let i = 0; i < periodOption.days; i++) {
                const date = subDays(today, i);
                const dayKey = format(date, 'yyyy-MM-dd');
                const dayData = dataByDay.get(dayKey)!;

                tempChartData.push({
                    name: format(date, 'dd/MM'),
                    ...dayData
                });
            }
            chartData = tempChartData.reverse();
            if (total === 0) chartData = [];
            
            jenisPengeluaranValues.forEach(jenis => {
                periodJenisTotals[jenis] = chartData.reduce((sum, day) => sum + (day[jenis] || 0), 0);
            });
            periodJenisTotals['total_keseluruhan'] = chartData.reduce((sum, day) => sum + (day['total_keseluruhan'] || 0), 0);
            total = periodJenisTotals['total_keseluruhan'];

            chartKeys = [...lineKeys, totalLineKey, ...areaKeys];
            // Calculate previousPeriodTotal and previousPeriodJenisTotals for the 2-day comparison period
            const comparePeriodEndDate = subDays(startDate, 1); // Day before current period starts
            const comparePeriodStartDate = subDays(startDate, 2); // Two days before current period starts

            finalPengeluaranData.forEach(item => {
                const itemDate = startOfDay(parseISO(item.created_at));
                if (itemDate >= comparePeriodStartDate && itemDate <= comparePeriodEndDate) {
                    previousPeriodTotal += item.amount;
                    previousPeriodJenisTotals[item.jenis_pengeluaran] += item.amount;
                }
            });

            percentageChange = calculatePercentageChange(total, previousPeriodTotal);

            jenisPengeluaranValues.forEach(jenis => {
                const currentJenisTotal = periodJenisTotals[jenis] || 0;
                const previousJenisTotal = previousPeriodJenisTotals[jenis] || 0;
                jenisPercentageChanges[jenis] = calculatePercentageChange(currentJenisTotal, previousJenisTotal);
            });
        }

        const totalSumOfJenis = Object.values(periodJenisTotals).reduce((sum, val) => sum + val, 0);

        const pieChartData = jenisPengeluaranValues
            .map(jenis => ({
                name: jenis,
                value: totalSumOfJenis === 0 ? 0 : (periodJenisTotals[jenis] || 0)
            }))
            .filter(entry => DESIRED_LEGEND_ORDER.includes(entry.name));

        console.log("periodJenisTotals:", periodJenisTotals);
        console.log("totalSumOfJenis:", totalSumOfJenis);
        console.log("pieChartData:", pieChartData);

        return { chartData, total, compareTotal, percentageChange, periodLabel, comparisonLabel, chartKeys, periodJenisTotals, pieChartData, jenisPercentageChanges, periodJenisCounts };
    }, [pengeluaranData, dateFilter, analysisJenisFilter, analysisPeriod, selectedDate]);

    return {
        pengeluaranData,
        setPengeluaranData,
        searchTerm,
        setSearchTerm,
        selectedDate,
        setSelectedDate,
        filteredData,
        totalPengeluaran,
        handleDeleteClick,
        handleEditClick,
        isEditModalOpen,
        setEditModalOpen,
        editingPengeluaran,
        setEditingPengeluaran,
        formValues,
        setFormValues,
        handleSaveEdit,
        analysisData,
        isFilterModalOpen,
        setFilterModalOpen,
        dateFilter,
        setDateFilter,
        analysisJenisFilter,
        setAnalysisJenisFilter,
        analysisPeriod,
        setAnalysisPeriod,
        isDateSelectedByUser,
        setIsDateSelectedByUser,
        isCalendarOpen,
        setIsCalendarOpen,
        showArea,
        setShowArea,
        handleApplyFilter,
        handleResetFilter,
        handleDateSelect,
        isAnyFilterActive,
        hiddenKeys,
        setHiddenKeys,
        handleLegendClick,
    };
}

