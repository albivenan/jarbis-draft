import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Wallet, Banknote, Filter, Calendar as CalendarIcon, XCircle, ListFilter } from 'lucide-react';
import { ComposedChart, XAxis, YAxis, Tooltip, Legend, Area, ResponsiveContainer, CartesianGrid, Line } from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import { ChartDataPoint, SumberDana } from '../hooks/useSumberDanaData';
import { Sparkles } from 'lucide-react';

interface SumberDanaAnalisaTabProps {
    sumberDana: SumberDana[];
    chartDataTunai: ChartDataPoint[];
    chartDataRekening: ChartDataPoint[];
    isFilterModalOpen: boolean;
    setFilterModalOpen: (value: boolean) => void;
    dateFilter: any;
    analysisPeriod: '3d' | '7d' | '3w' | '1m' | 'custom';
    setAnalysisPeriod: (period: '3d' | '7d' | '3w' | '1m' | 'custom') => void;
    isAnyFilterActive: boolean;
    handleResetFilter: () => void;
    loading: boolean;
    error: string | null;
}

export default function SumberDanaAnalisaTab({
    sumberDana,
    chartDataTunai,
    chartDataRekening,
    isFilterModalOpen,
    setFilterModalOpen,
    dateFilter,
    analysisPeriod,
    setAnalysisPeriod,
    isAnyFilterActive,
    handleResetFilter,
    loading,
    error,
}: SumberDanaAnalisaTabProps) {

    const [showAreaFill, setShowAreaFill] = React.useState(false);

    const PERIOD_OPTIONS = {
        '3d': '3 Hari Terakhir',
        '7d': '7 Hari Terakhir',
        '3w': '3 Minggu Terakhir',
        '1m': '1 Bulan Terakhir',
        'custom': 'Periode Custom',
    };

    const getActiveFilterDescription = () => {
        if (!isAnyFilterActive) {
            return 'Filter standar diterapkan (1 bulan terakhir).';
        }

        if (dateFilter) {
            const startDate = format(parseISO(dateFilter.start_date), 'd MMM yyyy', { locale: id });
            const endDate = dateFilter.end_date ? format(parseISO(dateFilter.end_date), 'd MMM yyyy', { locale: id }) : startDate;
            return `Filter aktif: Periode custom (${startDate} - ${endDate}).`;
        }

        return `Filter aktif: ${PERIOD_OPTIONS[analysisPeriod]}.`;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-300 rounded shadow-sm text-sm">
                    <p className="font-bold">{format(parseISO(label), 'dd MMM yyyy', { locale: id })}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={`item-${index}`} style={{ color: entry.color }}>
                            {entry.name}: {formatCurrency(entry.value)}
                        </p>
                    ))}
                    {payload.find((entry: any) => entry.dataKey === 'laba') && (
                        <p className="mt-1 font-bold">
                            Laba: {formatCurrency(payload.find((entry: any) => entry.dataKey === 'laba').value)}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <Card className="w-full h-[400px] flex items-center justify-center">
                <CardContent>
                    <p className="text-lg text-gray-500">Memuat data...</p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full h-[400px] flex items-center justify-center">
                <CardContent>
                    <p className="text-lg text-red-500">Error: {error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                            <CardTitle>Filter Analisa</CardTitle>
                            <CardDescription>Filter data untuk analisa sumber dana.</CardDescription>
                            <p className="text-sm text-muted-foreground mt-2">{getActiveFilterDescription()}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 sm:mt-0 flex-wrap">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button disabled={analysisPeriod === 'custom'} variant="outline" size="sm" className="w-[150px]">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {PERIOD_OPTIONS[analysisPeriod as keyof typeof PERIOD_OPTIONS]}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Pilih Periode Analisa</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => { setAnalysisPeriod('3d'); }}>3 Hari Terakhir</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setAnalysisPeriod('7d'); }}>7 Hari Terakhir</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setAnalysisPeriod('3w'); }}>3 Minggu Terakhir</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setAnalysisPeriod('1m'); }}>1 Bulan Terakhir</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button variant="outline" size="sm" onClick={() => { setFilterModalOpen(true); }}>
                                <Filter className="mr-2 h-4 w-4" /> Lanjutan
                            </Button>

                            {isAnyFilterActive && (<Button variant="ghost" size="sm" onClick={handleResetFilter}><XCircle className="mr-2 h-4 w-4" />Reset</Button>)}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Comparison Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Tren Tunai</CardTitle>
                                <CardDescription>Pemasukan vs Pengeluaran Tunai</CardDescription>
                            </div>
                            <Button variant="outline" size="icon" onClick={() => setShowAreaFill(!showAreaFill)}>
                                <Sparkles className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={chartDataTunai}>
                                <defs>
                                    <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="waktu" tickFormatter={(str) => format(parseISO(str), 'dd/MM')} />
                                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Area type="monotone" dataKey="pemasukan" stroke="#22c55e" name="Pemasukan" strokeWidth={2} fillOpacity={showAreaFill ? 0.5 : 0} fill="url(#colorPemasukan)" />
                                <Area type="monotone" dataKey="pengeluaran" stroke="#ef4444" name="Pengeluaran" strokeWidth={2} fillOpacity={showAreaFill ? 0.5 : 0} fill="url(#colorPengeluaran)" />
                                <Line type="monotone" dataKey="laba" stroke="#8884d8" name="Laba" strokeWidth={2} dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Tren Rekening Bank</CardTitle>
                                <CardDescription>Pemasukan vs Pengeluaran Rekening Bank</CardDescription>
                            </div>
                            <Button variant="outline" size="icon" onClick={() => setShowAreaFill(!showAreaFill)}>
                                <Sparkles className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={chartDataRekening}>
                                <defs>
                                    <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="waktu" tickFormatter={(str) => format(parseISO(str), 'dd/MM')} />
                                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Area type="monotone" dataKey="pemasukan" stroke="#22c55e" name="Pemasukan" strokeWidth={2} fillOpacity={showAreaFill ? 0.5 : 0} fill="url(#colorPemasukan)" />
                                <Area type="monotone" dataKey="pengeluaran" stroke="#ef4444" name="Pengeluaran" strokeWidth={2} fillOpacity={showAreaFill ? 1 : 0} fill="url(#colorPengeluaran)" />
                                <Line type="monotone" dataKey="laba" stroke="#8884d8" name="Laba" strokeWidth={2} dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}