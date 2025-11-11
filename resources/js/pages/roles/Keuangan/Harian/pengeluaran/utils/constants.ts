export const JENIS_PENGELUARAN = {
    OPERASIONAL: 'Pengeluaran Operasional (Utama)',
    NON_OPERASIONAL: 'Pengeluaran Non-Operasional (Tambahan)',
    KOREKSI: 'Pengeluaran Internal / Koreksi',
    PEMBELIAN_BAHAN_BAKU: 'Pembelian Bahan Baku',
} as const;

export type JenisPengeluaran = typeof JENIS_PENGELUARAN[keyof typeof JENIS_PENGELUARAN];
export const jenisPengeluaranValues = Object.values(JENIS_PENGELUARAN);

export const STATUS_PENGELUARAN = {
    DRAFT: 'Draft',
    FINAL: 'Final',
} as const;
export type StatusPengeluaran = typeof STATUS_PENGELUARAN[keyof typeof STATUS_PENGELUARAN];
export const statusPengeluaranValues = Object.values(STATUS_PENGELUARAN);

export const JENIS_COLORS: { [key in JenisPengeluaran | 'Total Keseluruhan']: string } = {
    [JENIS_PENGELUARAN.OPERASIONAL]: '#ef4444', // Red
    [JENIS_PENGELUARAN.NON_OPERASIONAL]: '#f97316', // Orange
    [JENIS_PENGELUARAN.KOREKSI]: '#8b5cf6', // Violet
    [JENIS_PENGELUARAN.PEMBELIAN_BAHAN_BAKU]: '#22c55e', // Green
    'Total Keseluruhan': '#16a34a',
};

export const DESIRED_LEGEND_ORDER = [
    JENIS_PENGELUARAN.OPERASIONAL,
    JENIS_PENGELUARAN.NON_OPERASIONAL,
    JENIS_PENGELUARAN.KOREKSI,
    JENIS_PENGELUARAN.PEMBELIAN_BAHAN_BAKU,
];

export const DESIRED_ORDER = [
    JENIS_PENGELUARAN.OPERASIONAL,
    JENIS_PENGELUARAN.NON_OPERASIONAL,
    JENIS_PENGELUARAN.KOREKSI,
    JENIS_PENGELUARAN.PEMBELIAN_BAHAN_BAKU,
    'total_keseluruhan'
];
