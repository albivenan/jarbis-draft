import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { TrendingUp, PlusCircle, Filter, Calendar as CalendarIcon, MoreHorizontal, Pencil, Trash2, XCircle, ArrowUp, ArrowDown, ListFilter, AreaChart as AreaChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Legend, Bar, CartesianGrid, Line, Area, LegendPayload }from 'recharts';
import { ComplexDateFilterValue } from '@/components/complex-date-filter-modal';
import { JENIS_PEMASUKAN, jenisPemasukanValues, JENIS_COLORS, JenisPemasukan, JENIS_PEMASUKAN_LEGEND_MAP } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import { RenderCustomizedLabelWithLine, CustomPieTooltip } from '../charts/PieChartLabels';
import { formatCompact } from '../utils/formatters';
import { CustomizedLabel, CustomTooltip } from '../charts/ComposedChartLabels';
import { startOfDay } from 'date-fns';

interface PemasukanAnalisaTabProps {
    dateFilter: ComplexDateFilterValue | null;
    setDateFilter: (filter: ComplexDateFilterValue | null) => void;
    selectedDate: Date | undefined;
    setSelectedDate: (date: Date | undefined) => void;
    analysisPeriod: '3d' | '7d' | '3w' | '1m' | 'custom';
    setAnalysisPeriod: (period: '3d' | '7d' | '3w' | '1m' | 'custom') => void;
    isDateSelectedByUser: boolean;
    setIsDateSelectedByUser: (value: boolean) => void;
    analysisData: {
        chartData: any[];
        total: number;
        compareTotal: number;
        percentageChange: number;
        periodLabel: string;
        comparisonLabel: string;
        chartKeys: any[];
        periodJenisTotals: { [key: string]: number };
        pieChartData: { name: string; value: number }[];
        jenisPercentageChanges: { [key: string]: number };
        periodJenisCounts: { [key: string]: number };
    };
    isAnyFilterActive: boolean;
    handleResetFilter: () => void;
    isFilterModalOpen: boolean;
    setFilterModalOpen: (value: boolean) => void;
    analysisJenisFilter: string[];
    setAnalysisJenisFilter: (value: string[]) => void;
    isCalendarOpen: boolean;
    setIsCalendarOpen: (value: boolean) => void;
    showArea: boolean;
    setShowArea: (value: boolean) => void;
    handleApplyFilter: (filter: ComplexDateFilterValue) => void;
    handleDateSelect: (date: Date | undefined) => void;
    hiddenKeys: string[];
    handleLegendClick: (data: LegendPayload) => void;
}

const PemasukanAnalisaTab: React.FC<PemasukanAnalisaTabProps> = ({
    analysisData,
    isFilterModalOpen,
    setFilterModalOpen,
    dateFilter,
    selectedDate,
    setSelectedDate,
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
    handleLegendClick,
}) => {

    const [ , setDateFilter ] = React.useState<ComplexDateFilterValue | null>(dateFilter);
    const PERIOD_OPTIONS = {
        '3d': '3 Hari Terakhir',
        '7d': '7 Hari Terakhir',
        '3w': '3 Minggu Terakhir',
        '1m': '1 Bulan Terakhir',
    };

    const legendFormatter = (value: string, entry: any) => {
        const { dataKey } = entry;
        const isHidden = hiddenKeys.includes(dataKey);
        return <span style={{ color: isHidden ? '#9ca3af' : '#1f2937', textDecoration: isHidden ? 'line-through' : 'none' }}>{value}</span>;
    };

    return (
        <div className="space-y-6 mt-4">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                            <CardTitle>Ringkasan & Komposisi Pemasukan</CardTitle>
                            <CardDescription>{analysisData.periodLabel}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 mt-4 sm:mt-0 flex-wrap">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm"><ListFilter className="mr-2 h-4 w-4" />Filter Jenis</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Filter Kategori Grafik</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {jenisPemasukanValues.map((jenis: JenisPemasukan) => (
                                        <DropdownMenuCheckboxItem
                                            key={jenis}
                                            checked={analysisJenisFilter.includes(jenis)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setAnalysisJenisFilter([...analysisJenisFilter, jenis]);
                                                } else {
                                                    setAnalysisJenisFilter(analysisJenisFilter.filter(j => j !== jenis));
                                                }
                                            }}
                                        >
                                            <div className="flex justify-between w-full"><span>{jenis}</span><span className="text-muted-foreground text-xs ml-4">{formatCurrency(analysisData.periodJenisTotals[jenis] || 0)}</span></div>
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                    <DropdownMenuCheckboxItem
                                        key="total_keseluruhan"
                                        checked={analysisJenisFilter.includes('total_keseluruhan')}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setAnalysisJenisFilter([...analysisJenisFilter, 'total_keseluruhan']);
                                            } else {
                                                setAnalysisJenisFilter(analysisJenisFilter.filter(j => j !== 'total_keseluruhan'));
                                            }
                                        }}
                                    >
                                        <div className="flex justify-between w-full"><span>Total Keseluruhan</span><span className="text-muted-foreground text-xs ml-4">{formatCurrency(analysisData.periodJenisTotals['total_keseluruhan'] || 0)}</span></div>
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button disabled={isDateSelectedByUser || !!dateFilter} variant="outline" size="sm" className="w-[150px]">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {PERIOD_OPTIONS[analysisPeriod as keyof typeof PERIOD_OPTIONS]}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Pilih Periode Analisa</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => { setAnalysisPeriod('3d'); setSelectedDate(undefined); setDateFilter(null); setIsDateSelectedByUser(false); }}>3 Hari Terakhir</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setAnalysisPeriod('7d'); setSelectedDate(undefined); setDateFilter(null); setIsDateSelectedByUser(false); }}>7 Hari Terakhir</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setAnalysisPeriod('3w'); setSelectedDate(undefined); setDateFilter(null); setIsDateSelectedByUser(false); }}>3 Minggu Terakhir</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setAnalysisPeriod('1m'); setSelectedDate(undefined); setDateFilter(null); setIsDateSelectedByUser(false); }}>1 Bulan Terakhir</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} size={"sm"} className={cn("w-[180px] justify-start text-left font-normal", (isDateSelectedByUser && selectedDate) && "text-primary")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {isDateSelectedByUser && selectedDate ? format(selectedDate, "d MMM yyyy") : <span>Pilih Tanggal</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto flex p-0">
                                    
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={handleDateSelect}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>

                            <Button variant="outline" size="sm" onClick={() => { setFilterModalOpen(true); setSelectedDate(undefined); }}>
                                <Filter className="mr-2 h-4 w-4" /> Lanjutan
                            </Button>

                            {isAnyFilterActive && (<Button variant="ghost" size="sm" onClick={handleResetFilter}><XCircle className="mr-2 h-4 w-4" />Reset</Button>)}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center pt-6">
                    <div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Pemasukan (dari Jenis Terpilih)</p>
                                <p className="text-3xl font-bold text-green-600 flex items-center">
                                    {formatCurrency(analysisData.total)}
                                    {typeof analysisData.percentageChange === 'number' && !isNaN(analysisData.percentageChange) && (
                                        <span className={cn("ml-2 text-lg flex items-center", analysisData.percentageChange >= 0 ? "text-green-600" : "text-red-600")}>
                                            {analysisData.percentageChange >= 0 ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                                            {analysisData.percentageChange.toFixed(2)}%
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="space-y-2">
                                {analysisJenisFilter.length > 0 ? (
                                    analysisJenisFilter
                                        .filter((jenis: string) => jenis !== 'total_keseluruhan')
                                        .map((jenis: string) => {
                                            const percentage = analysisData.jenisPercentageChanges[jenis];
                                            return (
                                                <div key={jenis} className="flex flex-col py-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: JENIS_COLORS[jenis as keyof typeof JENIS_COLORS] }}></div>
                                                            <span className="text-sm font-medium">{JENIS_PEMASUKAN_LEGEND_MAP[jenis as JenisPemasukan]}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-sm">{formatCurrency(analysisData.periodJenisTotals[jenis] || 0)}</span>
                                                            {typeof percentage === 'number' && !isNaN(percentage) && (
                                                                <span className={cn("text-xs flex items-center", percentage >= 0 ? "text-green-600" : "text-red-600")}>
                                                                    {percentage >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                                                    {percentage.toFixed(2)}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground mt-1 ml-[20px]">Jumlah item: {analysisData.periodJenisCounts[jenis] || 0}</span>
                                                </div>
                                            );
                                        })
                                ) : (
                                    <p className="text-sm text-muted-foreground">Tidak ada jenis pemasukan yang dipilih.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="relative min-h-[280px] h-[320px] w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analysisData.pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={<RenderCustomizedLabelWithLine data={analysisData.pieChartData} />}
                                    innerRadius={0}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    paddingAngle={5}
                                >
                                    {analysisData.pieChartData.map((entry: { name: string; value: number }, index: number) => (
                                        <Cell key={`cell-${index}`} fill={JENIS_COLORS[jenisPemasukanValues[index]]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomPieTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Tren Pemasukan per Periode</CardTitle>
                            <CardDescription>Grafik menunjukkan tren pemasukan berdasarkan jenis yang dipilih dalam periode waktu.</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowArea(!showArea)}
                            className="flex items-center gap-1"
                        >
                            {showArea ? <AreaChartIcon className="h-4 w-4" /> : <Line className="h-4 w-4" />}
                            {showArea ? 'Sembunyikan Bayangan' : 'Tampilkan Bayangan'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    {analysisData.chartData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[400px] text-center">
                            <AreaChartIcon className="w-16 h-16 text-gray-300" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-500">Data Tidak Tersedia</h3>
                            <p className="mt-1 text-sm text-gray-400">Tidak ada data pemasukan untuk periode atau filter yang dipilih.</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={400}>
                            <ComposedChart data={analysisData.chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={formatCompact} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend onClick={handleLegendClick} formatter={legendFormatter} wrapperStyle={{ paddingTop: '20px' }} />
                                {showArea && analysisData.chartKeys // Add showArea condition here
                                    .filter((key: any) => !hiddenKeys.includes(key.dataKey))
                                    .map((key: any) => {
                                        if (key.type === 'area') {
                                            if (analysisJenisFilter.includes(key.dataKey)) {
                                                return <Area key={key.dataKey} {...key} connectNulls />;
                                            }
                                        }
                                        return null;
                                    })}
                                {analysisData.chartKeys
                                    .filter((key: any) => !hiddenKeys.includes(key.dataKey))
                                    .map((key: any) => {
                                        if (key.type === 'line') {
                                            if (analysisJenisFilter.includes(key.dataKey)) {
                                                return <Line key={key.dataKey} {...key} type="monotone" connectNulls label={<CustomizedLabel />} />;
                                            }
                                        }
                                        return null;
                                    })}
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PemasukanAnalisaTab;
