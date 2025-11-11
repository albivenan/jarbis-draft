import React, { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Package, DollarSign, TrendingUp, Warehouse } from 'lucide-react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line } from 'recharts';
import { formatCurrency } from './utils/formatters';
import ProductDataTable from './components/ProductDataTable';

// Define types based on project convention
interface Product {
    id: number;
    nama_bahan_baku: string;
    kategori: string;
    stok: number;
    satuan_dasar: string;
    harga_standar: number;
}

interface SummaryMetrics {
    totalInventoryValue: number;
    totalQuantityInStock: number;
    cogsCurrentMonth: number;
}

interface InventoryTrendDataPoint {
    name: string;
    'Nilai Persediaan': number;
}

// Define a local PageProps interface that mimics the global one, including common Inertia props
interface LocalPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            // Add other user properties if needed
        };
    };
    ziggy: {
        url: string;
        port: number | null;
        host: string;
        // Add other ziggy properties if needed
    };
    flash: {
        message?: string;
        // Add other flash properties if needed
    };
    errors: Record<string, string>;
    [key: string]: any; // Add index signature to allow for dynamic properties
    // Add any other common props that might be passed by Inertia
}

interface PersediaanPageProps extends LocalPageProps {
    summaryMetrics: SummaryMetrics;
    inventoryTrendData: InventoryTrendDataPoint[];
    products: {
        data: Product[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

export default function Persediaan() {
    const { summaryMetrics, inventoryTrendData, products, filters } = usePage<PersediaanPageProps>().props;

    // Dummy data for trend if backend doesn't provide it yet
    const dummyInventoryTrendData = useMemo(() => {
        const data = [];
        const days = 30;
        const startDate = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() - (days - 1 - i)); // Go back in time

            data.push({
                name: format(date, 'dd/MM'),
                'Nilai Persediaan': Math.floor(Math.random() * 100000000) + 50000000, // Random inventory value
            });
        }
        return data;
    }, []);


    return (
        <AuthenticatedLayout
            title="Pengelolaan Persediaan & HPP"
        >
            <Head title="Pengelolaan Persediaan & HPP" />

            <div className="space-y-6 mt-4">
                <h2 className="text-2xl font-bold text-gray-900">Ringkasan Persediaan & HPP</h2>
                <p className="text-gray-600">Gambaran umum mengenai nilai persediaan, jumlah stok, dan Harga Pokok Penjualan (HPP).</p>

                {/* Key Metrics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Nilai Persediaan</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(summaryMetrics.totalInventoryValue)}</div>
                            {/* <p className="text-xs text-muted-foreground">+20.1% dari bulan lalu</p> */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Kuantitas Stok</CardTitle>
                            <Warehouse className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summaryMetrics.totalQuantityInStock} unit</div>
                            {/* <p className="text-xs text-muted-foreground">+15% dari bulan lalu</p> */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">HPP Bulan Ini</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(summaryMetrics.cogsCurrentMonth)}</div>
                            {/* <p className="text-xs text-muted-foreground">-5% dari bulan lalu</p> */}
                        </CardContent>
                    </Card>
                </div>

                {/* Inventory Value Trend Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tren Nilai Persediaan</CardTitle>
                        <CardDescription>Perkembangan total nilai persediaan selama 30 hari terakhir.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={inventoryTrendData.length > 0 ? inventoryTrendData : dummyInventoryTrendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Line type="monotone" dataKey="Nilai Persediaan" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Product List/Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Produk & Stok</CardTitle>
                        <CardDescription>Ringkasan stok dan nilai untuk setiap produk.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProductDataTable products={products} filters={filters} />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}