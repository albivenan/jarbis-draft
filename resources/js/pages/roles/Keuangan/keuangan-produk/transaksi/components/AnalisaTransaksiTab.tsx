import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, subDays, subWeeks, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';
import { TrendingUp, Calendar as CalendarIcon, AreaChart as AreaChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Line, Area } from 'recharts';

// Dummy Data for Sales Trend
const generateDummySalesData = (period: '7d' | '30d' | '3m' | '6m') => {
    const data = [];
    let days = 0;
    let startDate = new Date();

    switch (period) {
        case '7d':
            days = 7;
            startDate = subDays(new Date(), 6);
            break;
        case '30d':
            days = 30;
            startDate = subDays(new Date(), 29);
            break;
        case '3m':
            days = 90;
            startDate = subMonths(new Date(), 3);
            break;
        case '6m':
            days = 180;
            startDate = subMonths(new Date(), 6);
            break;
    }

    for (let i = 0; i < days; i++) {
        const date = subDays(startDate, -i);
        data.push({
            name: format(date, 'dd/MM'),
            'Total Penjualan': Math.floor(Math.random() * 5000000) + 1000000,
        });
    }
    return data;
};

const formatCompact = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        notation: 'compact',
        compactDisplay: 'short',
        minimumFractionDigits: 0,
    }).format(value);
};

interface AnalisaTransaksiTabProps {
    // Props for filtering and data would go here in a real application
}

const AnalisaTransaksiTab: React.FC<AnalisaTransaksiTabProps> = () => {
    const [analysisPeriod, setAnalysisPeriod] = useState<'7d' | '30d' | '3m' | '6m'>('7d');
    const [showArea, setShowArea] = useState<boolean>(true);
    const [selectedDateRange, setSelectedDateRange] = useState<{ from?: Date; to?: Date }>({});

    const salesData = generateDummySalesData(analysisPeriod);

    const PERIOD_OPTIONS = {
        '7d': '7 Hari Terakhir',
        '30d': '30 Hari Terakhir',
        '3m': '3 Bulan Terakhir',
        '6m': '6 Bulan Terakhir',
    };

    return (
        <div className="space-y-6 mt-4">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                            <CardTitle>Tren Transaksi Hasil Penjualan</CardTitle>
                            <CardDescription>Grafik menunjukkan tren total penjualan dalam periode waktu.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 mt-4 sm:mt-0 flex-wrap">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="w-[150px]">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {PERIOD_OPTIONS[analysisPeriod]}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Pilih Periode Analisa</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setAnalysisPeriod('7d')}>7 Hari Terakhir</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setAnalysisPeriod('30d')}>30 Hari Terakhir</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setAnalysisPeriod('3m')}>3 Bulan Terakhir</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setAnalysisPeriod('6m')}>6 Bulan Terakhir</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowArea(!showArea)}
                                className="flex items-center gap-1"
                            >
                                {showArea ? <AreaChartIcon className="h-4 w-4" /> : <LineChartIcon className="h-4 w-4" />}
                                {showArea ? 'Sembunyikan Bayangan' : 'Tampilkan Bayangan'}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    {salesData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[400px] text-center">
                            <AreaChartIcon className="w-16 h-16 text-gray-300" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-500">Data Tidak Tersedia</h3>
                            <p className="mt-1 text-sm text-gray-400">Tidak ada data penjualan untuk periode yang dipilih.</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={400}>
                            <ComposedChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={formatCompact} />
                                <Tooltip formatter={(value: number) => formatCompact(value)} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                {showArea && <Area type="monotone" dataKey="Total Penjualan" stroke="#8884d8" fill="#8884d8" />}
                                <Line type="monotone" dataKey="Total Penjualan" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalisaTransaksiTab;
