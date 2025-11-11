import { format, subDays } from 'date-fns';
import { JENIS_PEMASUKAN, STATUS_PEMASUKAN, JenisPemasukan, StatusPemasukan } from './constants';

export const generateDummyData = () => {
    const data = [];
    for (let i = 0; i < 500; i++) { // More data for better filtering
        const random = Math.random();
        let jenis: JenisPemasukan;
        if (random < 0.7) { // 70% chance
            jenis = JENIS_PEMASUKAN.OPERASIONAL;
        } else if (random < 0.9) { // 20% chance
            jenis = JENIS_PEMASUKAN.NON_OPERASIONAL;
        } else { // 10% chance
            jenis = JENIS_PEMASUKAN.KOREKSI;
        }

        data.push({
            id: i + 1,
            invoiceNumber: `INV-${format(subDays(new Date(), i), 'yyyyMMdd')}-${i + 1}`,
            description: `Penjualan Hari ke-${i + 1}`,
            amount: (
                jenis === JENIS_PEMASUKAN.OPERASIONAL ? Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000 :
                jenis === JENIS_PEMASUKAN.NON_OPERASIONAL ? Math.floor(Math.random() * (150000 - 30000 + 1)) + 30000 :
                Math.floor(Math.random() * (50000 - 5000 + 1)) + 5000
            ),
            jenis_pemasukan: jenis,
            catatan: i % 5 === 0 ? `Catatan khusus untuk transaksi ${i + 1}` : '-',
            createdAt: subDays(new Date(), i).toISOString(),
            invoice: i % 3 === 0 ? `https://via.placeholder.com/150?text=Invoice+${i+1}` : null, // Dummy invoice URL
            status: i % 2 === 0 ? STATUS_PEMASUKAN.FINAL : STATUS_PEMASUKAN.DRAFT, // Random status
        });
    }
    return data;
};

export const initialPemasukanData = generateDummyData();

export type Pemasukan = typeof initialPemasukanData[0] & {
    invoice: string | null;
    status: StatusPemasukan;
};
