import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataPembelianTab from './components/DataPembelianTab';
import AnalisaPembelianTab from './components/AnalisaPembelianTab';
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { usePembelianData } from './hooks/usePembelianData';

// --- TYPE DEFINITIONS ---

interface LocalPageProps {
    auth: { user: { id: number; name: string; email: string; } };
    ziggy: any;
    flash: any;
    errors: Record<string, string>;
    [key: string]: any;
}

interface User {
    id: number;
    name: string;
}

interface SumberDana {
    id: number;
    name: string;
    saldo: number;
}

interface BahanBaku {
    id: number;
    nama_bahan_baku: string;
    satuan_dasar: string;
    harga_standar: number;
}

interface PurchaseItem {
    id: number;
    pembelian_bahan_baku_id: number;
    bahan_baku_id: number | null;
    nama_item: string;
    jumlah: number;
    satuan: string;
    harga_satuan: number;
    total_harga_item: number;
    status_item: 'Pending' | 'Diterima' | 'Ditolak' | 'Diterima & Dibayar';
    catatan_item?: string;
    bahan_baku?: BahanBaku;
}

interface PurchaseBatch {
    id: number;
    nomor_batch: string;
    waktu_batch: string;
    status_batch: 'Pending' | 'Diajukan' | 'Disetujui' | 'Ditolak';
    status_pembayaran: 'Belum Dibayar' | 'Sudah Dibayar' | 'Pembayaran Ditolak';
    total_harga_batch: number;
    catatan?: string;
    dibuat_oleh: User;
    disetujui_oleh?: User;
    sumber_dana?: SumberDana;
    items: PurchaseItem[];
    diajukan_pada?: string | null; // New field
    direspon_pada?: string | null; // New field
    dibayar_pada?: string | null; // New field
}

interface PembelianPageProps extends LocalPageProps {
    pembelianBahanBaku: {
        data: PurchaseBatch[];
        links: any[];
        meta: any;
    };
    sumberDanas: SumberDana[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

// --- MAIN COMPONENT ---

export default function Pembelian() {
    const { pembelianBahanBaku, sumberDanas } = usePage<PembelianPageProps>().props;

    // Sanitize data to prevent NaN errors from string-based numbers from backend
    const cleanedData = useMemo(() => {
        const cleanedBatches = (pembelianBahanBaku?.data || []).map(batch => ({
            ...batch,
            total_harga_batch: parseFloat(batch.total_harga_batch as any) || 0,
            items: batch.items.map(item => ({
                ...item,
                harga_satuan: parseFloat(item.harga_satuan as any) || 0,
                total_harga_item: parseFloat(item.total_harga_item as any) || 0,
            })),
        }));

        const cleanedSumberDanas = (sumberDanas || []).map(sd => ({
            ...sd,
            saldo: parseFloat(sd.saldo as any) || 0,
        }));

        return { cleanedBatches, cleanedSumberDanas };
    }, [pembelianBahanBaku, sumberDanas]);

    const { analysisData, analysisPeriod, setAnalysisPeriod } = usePembelianData(cleanedData.cleanedBatches || []);

    // --- HANDLER FUNCTIONS (REFACTORED) ---

    // Handles "Terima" or "Tolak" on a single item
    const handleItemStatusChange = (itemId: number, newStatus: 'Diterima' | 'Ditolak') => {
        router.put(route('manajer-keuangan.keuangan-produk.pembelian.item.update-status', { item: itemId }),
            { status_item: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`Status item berhasil diubah ke "${newStatus}".`),
                onError: () => toast.error('Gagal mengubah status item.'),
            }
        );
    };

    // Handles "Ajukan Batch" button
    const handleSubmitBatch = (batchId: number) => {
        const confirmed = window.confirm("Anda yakin ingin finalisasi review untuk batch ini? Status item yang masih 'Pending' akan ditolak.");
        if (!confirmed) return;

        router.put(route('manajer-keuangan.keuangan-produk.pembelian.batch.update-status', { batch: batchId }),
            { status_batch: 'Diajukan' },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Batch berhasil diajukan untuk pembayaran.'),
                onError: () => toast.error('Gagal mengajukan batch.'),
            }
        );
    };
    
    // Handles "Tolak Seluruh Batch" button
    const handleRejectBatch = (batchId: number) => {
        const confirmed = window.confirm("Anda yakin ingin menolak seluruh permintaan pada batch ini?");
        if (!confirmed) return;

        router.put(route('manajer-keuangan.keuangan-produk.pembelian.batch.update-status', { batch: batchId }),
            { status_batch: 'Ditolak' },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Batch berhasil ditolak.'),
                onError: () => toast.error('Gagal menolak batch.'),
            }
        );
    };

    // Handles the final "Bayar" button click
    const handlePayment = (batchId: number, sumberDanaId: number) => {
        if (!sumberDanaId) {
            toast.error('Silakan pilih sumber dana terlebih dahulu.');
            return;
        }
        
        const confirmed = window.confirm("Anda yakin ingin memproses pembayaran untuk batch ini? Pastikan total harga dan sumber dana sudah benar.");
        if (!confirmed) return;

        router.post(route('manajer-keuangan.keuangan-produk.pembelian.batch.process-payment', { batch: batchId }),
            { sumber_dana_id: sumberDanaId },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Pembayaran berhasil diproses.'),
                onError: (errors) => {
                    const errorMsg = Object.values(errors)[0] || 'Gagal memproses pembayaran.';
                    toast.error(errorMsg);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout
            title="Pembelian Bahan Baku"
            breadcrumbs={[
                { title: 'Dashboard', href: route('manajer-keuangan.index') },
                { title: 'Keuangan Produk', href: '#' },
                { title: 'Pembelian Bahan Baku', href: route('manajer-keuangan.keuangan-produk.pembelian') }
            ]}
        >
            <Head title="Pembelian Bahan Baku" />
            <Tabs defaultValue="data" className="w-full">
                <TabsList>
                    <TabsTrigger value="data">Data Pembelian</TabsTrigger>
                    <TabsTrigger value="analisa">Analisa Pembelian</TabsTrigger>
                </TabsList>
                <TabsContent value="data">
                    <DataPembelianTab
                        batches={cleanedData.cleanedBatches}
                        sumberDanas={cleanedData.cleanedSumberDanas}
                        formatCurrency={formatCurrency}
                        onItemStatusChange={handleItemStatusChange}
                        onSubmitBatch={handleSubmitBatch}
                        onRejectBatch={handleRejectBatch}
                        onProcessPayment={handlePayment}
                    />
                </TabsContent>
                <TabsContent value="analisa">
                    <AnalisaPembelianTab 
                        analysisData={analysisData}
                        analysisPeriod={analysisPeriod}
                        setAnalysisPeriod={setAnalysisPeriod}
                    />
                </TabsContent>
            </Tabs>
        </AuthenticatedLayout>
    );
}

