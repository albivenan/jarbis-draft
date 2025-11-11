import { useState, useMemo } from 'react';
import { format, subDays, startOfDay, parseISO } from 'date-fns';

// Define the structure of a single purchase item from the backend
export interface PembelianBahanBakuItem {
    id?: number;
    bahan_baku_id: number | null; // Changed from 'number' to 'number | null'
    nama_item: string;
    jumlah: number;
    satuan: string;
    harga_satuan: number;
    total_harga_item: number;
    status_item: 'Pending' | 'Diterima' | 'Ditolak' | 'Diterima & Dibayar';
    catatan_item?: string | null;
}

// Define the structure of the main purchase data from the backend
export interface PembelianBahanBaku {
    id: number;
    nomor_batch: string;
    waktu_batch: string;
    total_harga_batch: number;
    status_batch: 'Pending' | 'Diajukan' | 'Disetujui' | 'Ditolak';
    items: PembelianBahanBakuItem[];
}

export const usePembelianData = (initialPembelian: PembelianBahanBaku[]) => {
    const [analysisPeriod, setAnalysisPeriod] = useState<'7d' | '30d' | '3m' | '6m'>('7d');

    const analysisData = useMemo(() => {
        const getDaysInPeriod = (period: '7d' | '30d' | '3m' | '6m') => {
            switch (period) {
                case '7d': return 7;
                case '30d': return 30;
                case '3m': return 90;
                case '6m': return 180;
            }
        };

        const days = getDaysInPeriod(analysisPeriod);
        const today = startOfDay(new Date());
        const startDate = subDays(today, days - 1);

        // Initialize a map with all days in the period
        const dataByDay = new Map<string, { 'Total Diterima': number; 'Total Ditolak': number }>();
        for (let i = 0; i < days; i++) {
            const date = format(subDays(today, i), 'dd/MM');
            dataByDay.set(date, { 'Total Diterima': 0, 'Total Ditolak': 0 });
        }

        // Process the real data
        initialPembelian.forEach(pembelian => {
            const pembelianDate = startOfDay(parseISO(pembelian.waktu_batch));

            if (pembelianDate >= startDate && pembelianDate <= today) {
                const dayKey = format(pembelianDate, 'dd/MM');
                const dayData = dataByDay.get(dayKey);

                if (dayData) {
                    pembelian.items.forEach(item => {
                        if (item.status_item === 'Diterima' || item.status_item === 'Diterima & Dibayar') {
                            dayData['Total Diterima'] += item.jumlah;
                        } else if (item.status_item === 'Ditolak') {
                            dayData['Total Ditolak'] += item.jumlah;
                        }
                    });
                }
            }
        });

        // Convert map to array and sort it
        const chartData = Array.from(dataByDay.entries())
            .map(([name, values]) => ({ name, ...values }))
            .reverse(); // To have the oldest date first

        return chartData;

    }, [initialPembelian, analysisPeriod]);

    return {
        analysisPeriod,
        setAnalysisPeriod,
        analysisData,
    };
};
