
export const JENIS_PEMASUKAN = {
    OPERASIONAL: 'Pemasukan Operasional (Utama)',
    NON_OPERASIONAL: 'Pemasukan Non-Operasional (Tambahan)',
    PENJUALAN_PRODUK: 'Pemasukan Penjualan Produk',
    KOREKSI: 'Pemasukan Internal / Koreksi',
} as const;

export type JenisPemasukan = typeof JENIS_PEMASUKAN[keyof typeof JENIS_PEMASUKAN];
export const jenisPemasukanValues = Object.values(JENIS_PEMASUKAN);

export const JENIS_PEMASUKAN_LEGEND_MAP: { [key in JenisPemasukan]: string } = {
    [JENIS_PEMASUKAN.OPERASIONAL]: 'Operasional',
    [JENIS_PEMASUKAN.NON_OPERASIONAL]: 'Non-Operasional',
    [JENIS_PEMASUKAN.PENJUALAN_PRODUK]: 'Penjualan Produk',
    [JENIS_PEMASUKAN.KOREKSI]: 'Koreksi',
};

export const STATUS_PEMASUKAN = {
    DRAFT: 'Draft',
    FINAL: 'Final',
} as const;
export type StatusPemasukan = typeof STATUS_PEMASUKAN[keyof typeof STATUS_PEMASUKAN];
export const statusPemasukanValues = Object.values(STATUS_PEMASUKAN);

export const JENIS_COLORS: { [key in JenisPemasukan | 'Total Keseluruhan']: string } = {
    [JENIS_PEMASUKAN.OPERASIONAL]: '#3b82f6',
    [JENIS_PEMASUKAN.NON_OPERASIONAL]: '#f97316',
    [JENIS_PEMASUKAN.PENJUALAN_PRODUK]: '#10b981',
    [JENIS_PEMASUKAN.KOREKSI]: '#8b5cf6',
    'Total Keseluruhan': '#16a34a',
};

export const DESIRED_LEGEND_ORDER = [
    JENIS_PEMASUKAN_LEGEND_MAP[JENIS_PEMASUKAN.OPERASIONAL],
    JENIS_PEMASUKAN_LEGEND_MAP[JENIS_PEMASUKAN.NON_OPERASIONAL],
    JENIS_PEMASUKAN_LEGEND_MAP[JENIS_PEMASUKAN.PENJUALAN_PRODUK],
    JENIS_PEMASUKAN_LEGEND_MAP[JENIS_PEMASUKAN.KOREKSI],
];

export const DESIRED_ORDER = [
    JENIS_PEMASUKAN.OPERASIONAL,
    JENIS_PEMASUKAN.NON_OPERASIONAL,
    JENIS_PEMASUKAN.PENJUALAN_PRODUK,
    JENIS_PEMASUKAN.KOREKSI,
    'total_keseluruhan'
];
