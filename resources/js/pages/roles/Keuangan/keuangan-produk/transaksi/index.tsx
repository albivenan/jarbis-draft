import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import DataTransaksiTab from './components/DataTransaksiTab';
import AnalisaTransaksiTab from './components/AnalisaTransaksiTab';

interface TransaksiPenjualanProps {
    pemasukanHarian: any; // Will be a Paginator instance from Laravel
    sumberDanas: any[];
    filters: {
        search?: string;
        selectedDate?: string;
    };
}

export default function TransaksiPenjualan({ pemasukanHarian, sumberDanas, filters }: TransaksiPenjualanProps) {
    return (
        <AuthenticatedLayout
            title="Manajemen Transaksi Penjualan"
        >
            <Head title="Manajemen Transaksi Penjualan" />

            <div className="space-y-6">
                <Tabs defaultValue="data-transaksi">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="data-transaksi">Data Transaksi</TabsTrigger>
                        <TabsTrigger value="analisa-transaksi">Analisa Transaksi</TabsTrigger>
                    </TabsList>

                    <TabsContent value="data-transaksi">
                        <DataTransaksiTab
                            pemasukanHarian={pemasukanHarian}
                            sumberDanas={sumberDanas}
                            filters={filters}
                        />
                    </TabsContent>

                    <TabsContent value="analisa-transaksi">
                        <AnalisaTransaksiTab />
                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}
