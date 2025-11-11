import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CardDescription } from '@/components/ui/card';
import { format, subMonths, subYears, parseISO, startOfMonth, endOfMonth, addDays, subDays, differenceInDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export interface ComplexDateFilterValue {
    mode: 'semua' | 'absolut' | 'perbandingan_bulan' | 'perbandingan_harian' | 'perbandingan_rentang_harian' | 'perbandingan_rentang_bulanan';
    start_date?: string; // YYYY-MM-DD
    end_date?: string;   // YYYY-MM-DD
    compare_start_date?: string; // YYYY-MM-DD
    compare_end_date?: string;   // YYYY-MM-DD
    start_month_year?: string; // YYYY-MM
    compare_month_year?: string; // YYYY-MM
    start_date_day?: string; // YYYY-MM-DD for daily comparison
    compare_date_day?: string; // YYYY-MM-DD for daily comparison
}

interface ComplexDateFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filter: ComplexDateFilterValue) => void;
    initialFilter?: ComplexDateFilterValue;
}

const ComplexDateFilterModal: React.FC<ComplexDateFilterModalProps> = ({
    isOpen,
    onClose,
    onApply,
    initialFilter,
}) => {
    const [activeTab, setActiveTab] = useState<string>(
        initialFilter?.mode === 'perbandingan_bulan' ? 'perbandingan_bulanan' :
        initialFilter?.mode === 'perbandingan_harian' ? 'perbandingan_harian' :
        initialFilter?.mode === 'perbandingan_rentang_harian' ? 'perbandingan_rentang_harian' :
        initialFilter?.mode === 'perbandingan_rentang_bulanan' ? 'perbandingan_rentang_bulanan' :
        'perbandingan_bulanan' // Default to perbandingan_bulanan
    );

    // State for Perbandingan Bulanan tab
    const [monthYearA, setMonthYearA] = useState<string>(
        initialFilter?.mode === 'perbandingan_bulan' && initialFilter.start_month_year
            ? initialFilter.start_month_year
            : format(new Date(), 'yyyy-MM')
    );
    const [monthYearB, setMonthYearB] = useState<string>(
        initialFilter?.mode === 'perbandingan_bulan' && initialFilter.compare_month_year
            ? initialFilter.compare_month_year
            : format(new Date(), 'yyyy-MM')
    );

    // State for Perbandingan Rentang tab (now also month-based)
    const [rangeMonthYearA, setRangeMonthYearA] = useState<string>(
        initialFilter?.mode === 'perbandingan_rentang_bulanan' && initialFilter.start_date
            ? format(parseISO(initialFilter.start_date), 'yyyy-MM')
            : format(new Date(), 'yyyy-MM')
    );
    const [rangeMonthYearB, setRangeMonthYearB] = useState<string>(
        initialFilter?.mode === 'perbandingan_rentang_bulanan' && initialFilter.end_date
            ? format(parseISO(initialFilter.end_date), 'yyyy-MM')
            : format(new Date(), 'yyyy-MM')
    );


    // State for Perbandingan Harian tab
    const [dayA, setDayA] = useState<Date | undefined>(
        initialFilter?.mode === 'perbandingan_harian' && initialFilter.start_date_day
            ? parseISO(initialFilter.start_date_day)
            : new Date()
    );
    const [dayB, setDayB] = useState<Date | undefined>(
        initialFilter?.mode === 'perbandingan_harian' && initialFilter.compare_date_day
            ? parseISO(initialFilter.compare_date_day)
            : new Date()
    );

    // State for Perbandingan Rentang Harian tab
    const [dailyRangeDayA, setDailyRangeDayA] = useState<Date | undefined>(
        initialFilter?.mode === 'perbandingan_rentang_harian' && initialFilter.start_date
            ? parseISO(initialFilter.start_date)
            : undefined
    );
    const [dailyRangeDayB, setDailyRangeDayB] = useState<Date | undefined>(
        initialFilter?.mode === 'perbandingan_rentang_harian' && initialFilter.compare_start_date
            ? parseISO(initialFilter.compare_start_date)
            : undefined
    );

    useEffect(() => {
        if (isOpen) {
            if (initialFilter?.mode === 'perbandingan_bulan') {
                setActiveTab('perbandingan_bulanan');
                setMonthYearA(initialFilter.start_month_year || format(new Date(), 'yyyy-MM'));
                setMonthYearB(initialFilter.compare_month_year || format(new Date(), 'yyyy-MM'));
            } else if (initialFilter?.mode === 'perbandingan_rentang_bulanan') {
                setActiveTab('perbandingan_rentang_bulanan');
                setRangeMonthYearA(initialFilter.start_date ? format(parseISO(initialFilter.start_date), 'yyyy-MM') : format(new Date(), 'yyyy-MM'));
                setRangeMonthYearB(initialFilter.end_date ? format(parseISO(initialFilter.end_date), 'yyyy-MM') : format(new Date(), 'yyyy-MM'));
            } else if (initialFilter?.mode === 'perbandingan_harian') {
                setActiveTab('perbandingan_harian');
                setDayA(initialFilter.start_date_day ? parseISO(initialFilter.start_date_day) : new Date());
                setDayB(initialFilter.compare_date_day ? parseISO(initialFilter.compare_date_day) : new Date());
            } else if (initialFilter?.mode === 'perbandingan_rentang_harian') {
                setActiveTab('perbandingan_rentang_harian');
                setDailyRangeDayA(initialFilter.start_date ? parseISO(initialFilter.start_date) : undefined);
                setDailyRangeDayB(initialFilter.compare_start_date ? parseISO(initialFilter.compare_start_date) : undefined);
                        } else {
                            // Default to monthly comparison if no specific initial filter mode
                            setActiveTab('perbandingan_bulanan');
                            setMonthYearA(format(new Date(), 'yyyy-MM'));
                            setMonthYearB(format(new Date(), 'yyyy-MM'));
                        }
                    }
                }, [isOpen, initialFilter]);





    const handleApply = () => {
        let filter: ComplexDateFilterValue;
        if (activeTab === 'perbandingan_bulanan') {
            filter = {
                mode: 'perbandingan_bulan',
                start_month_year: monthYearA,
                compare_month_year: monthYearB,
            };
        } else if (activeTab === 'perbandingan_rentang_bulanan') {
            if (!rangeMonthYearA || !rangeMonthYearB) {
                onClose();
                return;
            }

            let startMonth = parseISO(rangeMonthYearA + '-01');
            let endMonth = parseISO(rangeMonthYearB + '-01');
            if (startMonth > endMonth) {
                // Swap months if start month is after end month
                [startMonth, endMonth] = [endMonth, startMonth];
            }

            filter = {
                mode: 'perbandingan_rentang_bulanan',
                start_date: format(startOfMonth(startMonth), 'yyyy-MM-dd'),
                end_date: format(endOfMonth(endMonth), 'yyyy-MM-dd'),
                compare_start_date: undefined, // Explicitly set to undefined
                compare_end_date: undefined,   // Explicitly set to undefined
            };
        } else if (activeTab === 'perbandingan_harian') {
            filter = {
                mode: 'perbandingan_harian',
                start_date_day: dayA ? format(dayA, 'yyyy-MM-dd') : undefined,
                compare_date_day: dayB ? format(dayB, 'yyyy-MM-dd') : undefined,
            };
        } else { // activeTab === 'perbandingan_rentang_harian'
            if (!dailyRangeDayA || !dailyRangeDayB) {
                // If either start day is not selected, do not apply filter and close modal
                onClose();
                return;
            }

            const startDate = dailyRangeDayA;
            const endDate = dailyRangeDayB;

            filter = {
                mode: 'perbandingan_rentang_harian',
                start_date: format(startDate, 'yyyy-MM-dd'),
                end_date: format(endDate, 'yyyy-MM-dd'),
                compare_start_date: undefined, // Explicitly set to undefined
                compare_end_date: undefined,   // Explicitly set to undefined
            };
        }
        onApply(filter);
        onClose();
    };

    // Helper to generate month/year options
    const generateMonthYearOptions = () => {
        const options = [];
        for (let i = 0; i < 24; i++) { // Last 24 months
            const date = subMonths(new Date(), i);
            options.push({
                value: format(date, 'yyyy-MM'),
                label: format(date, 'MMMM yyyy', { locale: id }),
            });
        }
        return options;
    };
    const monthYearOptions = useMemo(generateMonthYearOptions, []);

    const renderSingleDatePicker = (
        date: Date | undefined,
        setDate: (date: Date | undefined) => void,
        label: string,
        htmlFor: string
    ) => (
        <div className="space-y-2">
            <Label htmlFor={htmlFor}>{label}</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: id }) : <span>Pilih Tanggal</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                    />
                </PopoverContent>
            </Popover>
           
        </div>
    );

    const renderDateRangePicker = (
        dateRange: DateRange | undefined,
        setDateRange: (range: DateRange | undefined) => void,
        placeholder: string
    ) => (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                        dateRange.to ? (
                            <>
                                {format(dateRange.from, "LLL dd, y", { locale: id })} -{" "}
                                {format(dateRange.to, "LLL dd, y", { locale: id })}
                            </>
                        ) : (
                            format(dateRange.from, "LLL dd, y", { locale: id })
                        )
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Filter Waktu Kompleks</DialogTitle>
                    <DialogDescription>
                        Pilih mode filter yang sesuai untuk analisis data Anda.
                    </DialogDescription>
                </DialogHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="perbandingan_bulanan">Per Bulan</TabsTrigger>
                        <TabsTrigger value="perbandingan_rentang_bulanan">Rentang Bulanan</TabsTrigger>
                        <TabsTrigger value="perbandingan_harian">Per Hari</TabsTrigger>
                        <TabsTrigger value="perbandingan_rentang_harian">Rentang Harian</TabsTrigger>
                    </TabsList>

                    {/* Perbandingan Bulanan Tab */}
                    <TabsContent value="perbandingan_bulanan" className="space-y-4 p-2">
                        <CardDescription>Membandingkan data antara dua bulan yang berbeda.</CardDescription>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="month-year-a">Bulan Utama (A)</Label>
                                <Select value={monthYearA} onValueChange={setMonthYearA}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Bulan dan Tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {monthYearOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="month-year-b">Bulan Banding (B)</Label>
                                <Select value={monthYearB} onValueChange={setMonthYearB}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Bulan dan Tahun Pembanding" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {monthYearOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button variant="link" className="p-0 h-auto text-xs mt-1" onClick={() => {
                                    if (monthYearA) {
                                        const [year, month] = monthYearA.split('-').map(Number);
                                        const previousYearMonth = format(subYears(new Date(year, month - 1), 1), 'yyyy-MM');
                                        setMonthYearB(previousYearMonth);
                                    }
                                }}>Tahun Lalu</Button>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Perbandingan Rentang Bulanan Tab */}
                    <TabsContent value="perbandingan_rentang_bulanan" className="space-y-4 p-2">
                        <CardDescription>Menampilkan data untuk rentang bulan yang dipilih.</CardDescription>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="range-month-year-a">Bulan Mulai</Label>
                                <Select value={rangeMonthYearA} onValueChange={setRangeMonthYearA}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Bulan dan Tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {monthYearOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="range-month-year-b">Bulan Akhir</Label>
                                <Select value={rangeMonthYearB} onValueChange={setRangeMonthYearB}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Bulan dan Tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {monthYearOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Perbandingan Harian Tab */}
                    <TabsContent value="perbandingan_harian" className="space-y-4 p-2">
                        <CardDescription>Membandingkan data antara dua hari yang berbeda.</CardDescription>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderSingleDatePicker(dayA, setDayA, 'Hari Utama (A)', 'day-a')}
                            {renderSingleDatePicker(dayB, setDayB, 'Hari Banding (B)', 'day-b')}
                        </div>
                    </TabsContent>

                    {/* Rentang Harian Tab */}
                    <TabsContent value="perbandingan_rentang_harian" className="space-y-4 p-2">
                        <CardDescription>Membandingkan dua hari yang berbeda.</CardDescription>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderSingleDatePicker(dailyRangeDayA, setDailyRangeDayA, 'Hari Utama (A)', 'daily-range-day-a')}
                            {renderSingleDatePicker(dailyRangeDayB, setDailyRangeDayB, 'Hari Banding (B)', 'daily-range-day-b')}
                        </div>
                    </TabsContent>
                </Tabs>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    <Button onClick={handleApply}>Terapkan Filter</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ComplexDateFilterModal;