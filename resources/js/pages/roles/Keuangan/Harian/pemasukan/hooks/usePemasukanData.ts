import { useState, useMemo, useEffect } from 'react';
import { format, subHours, differenceInHours, parseISO, subDays, startOfDay, endOfDay, getDaysInMonth, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { ComplexDateFilterValue } from '@/components/complex-date-filter-modal';
import { JENIS_PEMASUKAN, STATUS_PEMASUKAN, JenisPemasukan, jenisPemasukanValues, JENIS_COLORS, DESIRED_LEGEND_ORDER, JENIS_PEMASUKAN_LEGEND_MAP } from '../utils/constants';
import { LegendPayload } from 'recharts';
import { router } from '@inertiajs/react'; // Import router

export interface Pemasukan {
    id: number;
    user_id: number;
    waktu: string; // Changed from tanggal to waktu
    description: string;
    amount: number; // decimal(15, 2) from backend
    jenis_pemasukan: string;
    catatan: string | null;
    invoice_path: string | null;
    status: string;
    created_at: string; // timestamps() from backend
    updated_at: string; // timestamps() from backend
    keuangan_transaksi_pembeli_id?: number; // Added
    user?: {
        id: number;
        name: string;
        // Add other user properties if needed
    };
    sumber_dana?: { // Added sumber_dana
        id: number;
        nama_sumber: string;
    };
}

// Define a type for formValues
interface FormValues {
    description: string;
    amount: number;
    jenis_pemasukan: JenisPemasukan;
    catatan: string | null;
    [key: string]: any; // Add index signature to make it compatible with Record<string, any>
}

export const usePemasukanData = (initialPemasukan: Pemasukan[]) => {
    const [pemasukanData, setPemasukanData] = useState<Pemasukan[]>(initialPemasukan);

    useEffect(() => {
        setPemasukanData(initialPemasukan);
    }, [initialPemasukan]);

    const [isFilterModalOpen, setFilterModalOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState<ComplexDateFilterValue | null>(null);
    // Initialize selectedDate to the latest date in initialPemasukan, or today if no data
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);
    const [analysisJenisFilter, setAnalysisJenisFilter] = useState<string[]>([...jenisPemasukanValues, 'total_keseluruhan']);
    const [analysisPeriod, setAnalysisPeriod] = useState<'3d' | '7d' | '3w' | '1m' | 'custom'>('7d'); // '3d', '7d', '3w', '1m'
    const [isDateSelectedByUser, setIsDateSelectedByUser] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [showArea, setShowArea] = useState(true); // New state for toggling area visibility

    // Add/Edit Modals State
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingPemasukan, setEditingPemasukan] = useState<Pemasukan | null>(null);

    // Form State
    const [formValues, setFormValues] = useState<FormValues>({ description: '', amount: 0, jenis_pemasukan: JENIS_PEMASUKAN.OPERASIONAL as JenisPemasukan, catatan: '' });

    const handleApplyFilter = (filter: ComplexDateFilterValue) => {
        setDateFilter(filter);
        setSelectedDate(undefined);
        setAnalysisPeriod('7d'); // Reset to default period when complex filter is applied
    };
    const handleResetFilter = () => {
        setDateFilter(null);
        setSelectedDate(new Date()); // Set selectedDate back to today
        setAnalysisPeriod('7d'); // Ensure analysisPeriod is default
        setIsDateSelectedByUser(false);
    };

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            setIsDateSelectedByUser(true);
            setDateFilter(null);
            setIsCalendarOpen(false);
        }
    }

    const isAnyFilterActive = useMemo(() => {
        // If analysisPeriod is not the default, a filter is active.
        if (analysisPeriod !== '7d') {
            return true;
        }

        // Otherwise, check other filters.
        const todayStartOfDay = startOfDay(new Date());
        const isSelectedDateNotToday = selectedDate && startOfDay(selectedDate).getTime() !== todayStartOfDay.getTime();
        
        return dateFilter !== null || !!isSelectedDateNotToday;
    }, [dateFilter, selectedDate, analysisPeriod]);

    const handleLegendClick = (data: LegendPayload) => {
        const dataKey = data.dataKey as string;
        setHiddenKeys((prev: string[]) =>
            prev.includes(dataKey)
                ? prev.filter((key: string) => key !== dataKey)
                : [...prev, dataKey]
        );
    };

    const handleEditClick = (pemasukan: Pemasukan) => {
        setEditingPemasukan(pemasukan);
        setFormValues({ description: pemasukan.description, amount: pemasukan.amount, jenis_pemasukan: pemasukan.jenis_pemasukan as JenisPemasukan, catatan: pemasukan.catatan });
        setEditModalOpen(true);
    };

    const handleSaveEdit = () => {
        if (!editingPemasukan) return;
        // Use Inertia.js to send a PUT/PATCH request
        router.put(route('manajer-keuangan.harian.pemasukan.update', editingPemasukan.id), formValues, {
            onSuccess: () => {
                setEditModalOpen(false);
                setEditingPemasukan(null);
                // Inertia will automatically re-render the page with updated data
                // No need to manually update pemasukanData state here
            },
            onError: (errors) => {
                console.error("Error updating pemasukan:", errors);
                // Handle errors, e.g., display them to the user
            }
        });
    };

    const handleDeleteClick = (id: number) => {
        if (confirm('Are you sure you want to delete this entry?')) {
            router.delete(route('manajer-keuangan.harian.pemasukan.destroy', id), {
                onSuccess: () => {
                    // Inertia will automatically re-render the page with updated data
                    // No need to manually update pemasukanData state here
                },
                onError: (errors) => {
                    console.error("Error deleting pemasukan:", errors);
                    // Handle errors
                }
            });
        }
    };

    const filteredData = useMemo(() => {
        return pemasukanData.filter(item => {
            const itemDate = startOfDay(parseISO(item.waktu)); // Changed from created_at to waktu
            const filterDate = selectedDate ? startOfDay(selectedDate) : startOfDay(new Date());
            return itemDate.getTime() === filterDate.getTime() && item.description.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [pemasukanData, selectedDate, searchTerm]);

    const totalPemasukan = useMemo(() => filteredData.reduce((sum, item) => sum + Number(item.amount), 0), [filteredData]);

    const analysisData = useMemo(() => {
        const finalPemasukanData = pemasukanData.filter(item => item.status === 'Final');

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
        let periodJenisTotals: { [key: string]: number } = {};
        jenisPemasukanValues.forEach(jenis => periodJenisTotals[jenis] = 0);
        let periodJenisCounts: { [key: string]: number } = {};
        jenisPemasukanValues.forEach(jenis => periodJenisCounts[jenis] = 0);
        let jenisPercentageChanges: { [key: string]: number } = {}; // New variable

        const lineKeys = jenisPemasukanValues.map(jenis => ({
            type: 'line',
            dataKey: jenis,
            name: jenis.split(' ')[1],
            stroke: JENIS_COLORS[jenis as JenisPemasukan],
            strokeWidth: 2,
        }));
        const totalLineKey = { type: 'line', dataKey: 'total_keseluruhan', name: 'Total', stroke: JENIS_COLORS['Total Keseluruhan'], strokeWidth: 3 };
        
        const areaKeys = jenisPemasukanValues.map(jenis => ({
            type: 'area',
            dataKey: jenis,
            fill: JENIS_COLORS[jenis as JenisPemasukan],
            fillOpacity: 0.2,
            stroke: 0,
            hide: false,
        }));

        if (selectedDate) {
            periodLabel = `Harian: ${format(selectedDate, 'd MMM yyyy', { locale: id })}`;
            comparisonLabel = 'vs Hari Sebelumnya';

            const todayData: { [key: string]: any } = { name: format(selectedDate, 'dd/MM'), total_keseluruhan: 0 };
            const yesterdayData: { [key: string]: any } = { name: format(subDays(selectedDate, 1), 'dd/MM'), total_keseluruhan: 0 };
            jenisPemasukanValues.forEach(j => { todayData[j] = 0; yesterdayData[j] = 0; });

            finalPemasukanData.forEach(item => {
                const itemDate = startOfDay(parseISO(item.created_at)); // Changed from createdAt
                if (itemDate.getTime() === startOfDay(selectedDate).getTime()) {
                    todayData.total_keseluruhan += Number(item.amount);
                    todayData[item.jenis_pemasukan] += Number(item.amount);
                    periodJenisTotals[item.jenis_pemasukan] = (periodJenisTotals[item.jenis_pemasukan] || 0) + Number(item.amount);
                    periodJenisCounts[item.jenis_pemasukan]++; // Increment count
                }
                if (itemDate.getTime() === startOfDay(subDays(selectedDate, 1)).getTime()) {
                    yesterdayData.total_keseluruhan += Number(item.amount);
                    yesterdayData[item.jenis_pemasukan] += Number(item.amount);
                    analysisJenisFilter.filter(j => j !== 'total_keseluruhan').forEach(jenis => compareTotal += Number(item.amount));
                }
            });
            periodJenisTotals['total_keseluruhan'] = todayData.total_keseluruhan;
            total = periodJenisTotals['total_keseluruhan'];

            chartData = [yesterdayData, todayData];
            if (total === 0) chartData = []; // Added condition
            chartKeys = [...lineKeys, totalLineKey, ...areaKeys];
            percentageChange = calculatePercentageChange(total, compareTotal);

            jenisPemasukanValues.forEach(jenis => {
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
                jenisPemasukanValues.forEach(j => { monthAData[j] = 0; monthBData[j] = 0; });

                finalPemasukanData.forEach(item => {
                    const itemDate = parseISO(item.created_at);
                
                    // Process current month (startMonth)
                    if (itemDate >= startOfMonth(startMonth) && itemDate <= endOfMonth(startMonth)) {
                        monthAData.total_keseluruhan += Number(item.amount);
                        monthAData[item.jenis_pemasukan] += Number(item.amount);
                        periodJenisTotals[item.jenis_pemasukan] = (periodJenisTotals[item.jenis_pemasukan] || 0) + Number(item.amount);
                        periodJenisCounts[item.jenis_pemasukan]++;
                    }
                
                    // Process comparison month (compareMonth)
                    if (itemDate >= startOfMonth(compareMonth) && itemDate <= endOfMonth(compareMonth)) {
                        monthBData.total_keseluruhan += Number(item.amount);
                        monthBData[item.jenis_pemasukan] += Number(item.amount);
                        compareTotal += Number(item.amount); // Accumulate total for comparison period
                    }
                });
                                
                // After the loop, set total and periodJenisTotals['total_keseluruhan']
                periodJenisTotals['total_keseluruhan'] = monthAData.total_keseluruhan;
                total = periodJenisTotals['total_keseluruhan'];
                
                chartData = [monthAData, monthBData];
                if (total === 0) chartData = []; // Added condition
                chartKeys = [...lineKeys, totalLineKey, ...areaKeys];
                percentageChange = calculatePercentageChange(total, compareTotal);
                
                jenisPemasukanValues.forEach(jenis => {
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
                jenisPemasukanValues.forEach(j => { rangeAData[j] = 0; });

                finalPemasukanData.forEach(item => {
                    const itemDate = parseISO(item.created_at);
                    if (isWithinInterval(itemDate, { start: startDate, end: endDate })) {
                        rangeAData.total_keseluruhan += Number(item.amount);
                        rangeAData[item.jenis_pemasukan] += Number(item.amount);
                        periodJenisTotals[item.jenis_pemasukan] = (periodJenisTotals[item.jenis_pemasukan] || 0) + Number(item.amount);
                        periodJenisCounts[item.jenis_pemasukan]++;
                    }
                });
                periodJenisTotals['total_keseluruhan'] = rangeAData.total_keseluruhan;
                total = periodJenisTotals['total_keseluruhan'];

                chartData = [rangeAData];
                if (total === 0) chartData = []; // Added condition
                chartKeys = [...lineKeys, totalLineKey, ...areaKeys];
                percentageChange = 0;
                jenisPemasukanValues.forEach(jenis => {
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
                    jenisPemasukanValues.forEach(j => { rangeBData[j] = 0; });

                    finalPemasukanData.forEach(item => {
                        const itemDate = parseISO(item.created_at);
                        if (isWithinInterval(itemDate, { start: compareStartDate, end: compareEndDate })) {
                            rangeBData.total_keseluruhan += Number(item.amount);
                            rangeBData[item.jenis_pemasukan] += Number(item.amount);
                            if (analysisJenisFilter.filter(j => j !== 'total_keseluruhan').includes(item.jenis_pemasukan)) compareTotal += Number(item.amount);
                        }
                    });

                    chartData = [rangeAData, rangeBData];
                    if (total === 0) chartData = []; // Added condition
                    percentageChange = calculatePercentageChange(total, compareTotal);

                    jenisPemasukanValues.forEach(jenis => {
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
                jenisPemasukanValues.forEach(j => { dayAData[j] = 0; dayBData[j] = 0; });

                finalPemasukanData.forEach(item => {
                    const itemDate = startOfDay(parseISO(item.created_at));
                    if (itemDate.getTime() === startDate.getTime()) {
                        dayAData.total_keseluruhan += Number(item.amount);
                        dayAData[item.jenis_pemasukan] += Number(item.amount);
                        periodJenisTotals[item.jenis_pemasukan] = (periodJenisTotals[item.jenis_pemasukan] || 0) + Number(item.amount);
                        periodJenisCounts[item.jenis_pemasukan]++; // Increment count
                    }
                    if (itemDate.getTime() === compareDate.getTime()) {
                        dayBData.total_keseluruhan += Number(item.amount);
                        dayBData[item.jenis_pemasukan] += Number(item.amount);
                        if (analysisJenisFilter.filter(j => j !== 'total_keseluruhan').includes(item.jenis_pemasukan)) compareTotal += Number(item.amount);
                    }
                });
                periodJenisTotals['total_keseluruhan'] = dayAData.total_keseluruhan;
                total = periodJenisTotals['total_keseluruhan'];

                chartData = [dayAData, dayBData];
                if (total === 0) chartData = []; // Added condition
                chartKeys = [...lineKeys, totalLineKey, ...areaKeys];
                percentageChange = calculatePercentageChange(total, compareTotal);

                jenisPemasukanValues.forEach(jenis => {
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
                jenisPemasukanValues.forEach(j => { rangeAData[j] = 0; });

                finalPemasukanData.forEach(item => {
                    const itemDate = startOfDay(parseISO(item.created_at));
                    if (isWithinInterval(itemDate, { start: startDate, end: endDate })) {
                        rangeAData.total_keseluruhan += item.amount;
                        rangeAData[item.jenis_pemasukan] += item.amount;
                        periodJenisTotals[item.jenis_pemasukan] = (periodJenisTotals[item.jenis_pemasukan] || 0) + item.amount;
                        periodJenisCounts[item.jenis_pemasukan]++;
                    }
                });
                periodJenisTotals['total_keseluruhan'] = rangeAData.total_keseluruhan;
                total = periodJenisTotals['total_keseluruhan'];

                chartData = [rangeAData];
                if (total === 0) chartData = []; // Added condition
                chartKeys = [...lineKeys, totalLineKey, ...areaKeys];
                percentageChange = 0;
                jenisPemasukanValues.forEach(jenis => {
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
                    jenisPemasukanValues.forEach(j => { rangeBData[j] = 0; });

                    finalPemasukanData.forEach(item => {
                        const itemDate = startOfDay(parseISO(item.created_at));
                        if (isWithinInterval(itemDate, { start: compareStartDate, end: compareEndDate })) {
                            rangeBData.total_keseluruhan += item.amount;
                            rangeBData[item.jenis_pemasukan] += item.amount;
                            if (analysisJenisFilter.filter(j => j !== 'total_keseluruhan').includes(item.jenis_pemasukan)) compareTotal += item.amount;
                        }
                    });

                    chartData = [rangeAData, rangeBData];
                    if (total === 0) chartData = []; // Added condition
                    percentageChange = calculatePercentageChange(total, compareTotal);

                    jenisPemasukanValues.forEach(jenis => {
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
            let previousPeriodJenisTotals: { [key: string]: number } = {}; // Initialize previousPeriodJenisTotals
            jenisPemasukanValues.forEach(jenis => {
                previousPeriodJenisTotals[jenis] = 0;
            });

            const dataByDay = new Map<string, { total_keseluruhan: number, [key: string]: number }>();
            const totalDaysToFetch = periodOption.days * 2;

            for (let i = 0; i < totalDaysToFetch; i++) {
                const date = subDays(today, i);
                const dayKey = format(date, 'yyyy-MM-dd');
                const newDayData: { total_keseluruhan: number, [key: string]: number } = { total_keseluruhan: 0 };
                jenisPemasukanValues.forEach(j => newDayData[j] = 0);
                dataByDay.set(dayKey, newDayData);
            }

            finalPemasukanData.forEach(item => {
                const itemDate = startOfDay(parseISO(item.created_at));
                if (differenceInHours(today, itemDate) < (totalDaysToFetch * 24)) {
                    const dayKey = format(itemDate, 'yyyy-MM-dd');
                    const dayData = dataByDay.get(dayKey);
                    if (dayData) {
                        dayData.total_keseluruhan += item.amount;
                        dayData[item.jenis_pemasukan] += item.amount;
                        const startDateForPeriod = subDays(today, periodOption.days - 1);
                        if (itemDate >= startDateForPeriod && itemDate <= today) {
                            periodJenisCounts[item.jenis_pemasukan]++;
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

                // Removed: total calculation for summary card should not be filtered by jenis analysis


            }
            chartData = tempChartData.reverse();
            if (total === 0) chartData = []; // Added condition
            
            jenisPemasukanValues.forEach(jenis => {
                periodJenisTotals[jenis] = chartData.reduce((sum, day) => sum + (day[jenis] || 0), 0);
            });
            periodJenisTotals['total_keseluruhan'] = chartData.reduce((sum, day) => sum + (day['total_keseluruhan'] || 0), 0);
            total = periodJenisTotals['total_keseluruhan'];

            chartKeys = [...lineKeys, totalLineKey, ...areaKeys];
            // Calculate previousPeriodTotal and previousPeriodJenisTotals for the 2-day comparison period
            const comparePeriodEndDate = subDays(startDate, 1); // Day before current period starts
            const comparePeriodStartDate = subDays(startDate, 2); // Two days before current period starts

            finalPemasukanData.forEach(item => {
                const itemDate = startOfDay(parseISO(item.created_at));
                if (itemDate >= comparePeriodStartDate && itemDate <= comparePeriodEndDate) {
                    previousPeriodTotal += item.amount;
                    previousPeriodJenisTotals[item.jenis_pemasukan] += item.amount;
                }
            });

            percentageChange = calculatePercentageChange(total, previousPeriodTotal);



            jenisPemasukanValues.forEach(jenis => {
                const currentJenisTotal = periodJenisTotals[jenis] || 0;
                const previousJenisTotal = previousPeriodJenisTotals[jenis] || 0;
                jenisPercentageChanges[jenis] = calculatePercentageChange(currentJenisTotal, previousJenisTotal);
            });
        }

        const totalSumOfJenis = Object.values(periodJenisTotals).reduce((sum, val) => sum + val, 0);

        const pieChartData = jenisPemasukanValues
            .map(jenis => ({
                name: JENIS_PEMASUKAN_LEGEND_MAP[jenis],
                value: totalSumOfJenis === 0 ? 0 : (periodJenisTotals[jenis] || 0)
            }))
            .filter(entry => DESIRED_LEGEND_ORDER.includes(entry.name));

        return { chartData, total, compareTotal, percentageChange, periodLabel, comparisonLabel, chartKeys, periodJenisTotals, pieChartData, jenisPercentageChanges, periodJenisCounts };
    }, [pemasukanData, dateFilter, analysisJenisFilter, analysisPeriod, selectedDate]);

    return {
        pemasukanData, setPemasukanData,
        isFilterModalOpen, setFilterModalOpen,
        dateFilter, setDateFilter,
        selectedDate, setSelectedDate,
        searchTerm, setSearchTerm,
        hiddenKeys, setHiddenKeys,
        analysisJenisFilter, setAnalysisJenisFilter,
        analysisPeriod, setAnalysisPeriod,
        isDateSelectedByUser, setIsDateSelectedByUser,
        isCalendarOpen, setIsCalendarOpen,
        showArea, setShowArea,
        isEditModalOpen, setEditModalOpen,
        editingPemasukan, setEditingPemasukan,
        formValues, setFormValues,
        handleApplyFilter,
        handleResetFilter,
        handleDateSelect,
        isAnyFilterActive,
        handleLegendClick,
        handleEditClick,
        handleSaveEdit,
        handleDeleteClick,
        filteredData,
        totalPemasukan,
        analysisData,
    };
};