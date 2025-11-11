import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Calendar as CalendarIcon, LineChart as LineChartIcon } from 'lucide-react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Line } from 'recharts';

type AnalysisPeriod = '7d' | '30d' | '3m' | '6m';

interface ChartData {
    name: string;
    'Total Diterima': number;
    'Total Ditolak': number;
}

interface AnalisaPembelianTabProps {
    analysisData: ChartData[];
    analysisPeriod: AnalysisPeriod;
    setAnalysisPeriod: (period: AnalysisPeriod) => void;
}

const AnalisaPembelianTab: React.FC<AnalisaPembelianTabProps> = ({
    analysisData,
    analysisPeriod,
    setAnalysisPeriod,
}) => {
    const PERIOD_OPTIONS: { [key in AnalysisPeriod]: string } = {
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
                            <CardTitle>Tren Pembelian Bahan Baku</CardTitle>
                            <CardDescription>Grafik menunjukkan tren total item diterima dan ditolak dalam periode waktu.</CardDescription>
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
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    {analysisData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[400px] text-center">
                            <LineChartIcon className="w-16 h-16 text-gray-300" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-500">Data Tidak Tersedia</h3>
                            <p className="mt-1 text-sm text-gray-400">Tidak ada data pembelian untuk periode yang dipilih.</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={analysisData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="Total Diterima" stroke="#82ca9d" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="Total Ditolak" stroke="#ff7300" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalisaPembelianTab;