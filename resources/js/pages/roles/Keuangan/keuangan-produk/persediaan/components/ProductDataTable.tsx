import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { router } from '@inertiajs/react';
import { formatCurrency } from '../utils/formatters';

interface Product {
    id: number;
    nama_bahan_baku: string;
    kategori: string;
    stok: number;
    satuan_dasar: string;
    harga_standar: number;
}

interface ProductDataTableProps {
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

export default function ProductDataTable({ products, filters }: ProductDataTableProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get(
            route('keuangan.keuangan-produk.persediaan'),
            { search: e.target.value },
            { preserveState: true, replace: true }
        );
    };

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState: true, replace: true });
        }
    };

    return (
        <div className="space-y-4">
            <Input
                placeholder="Cari produk..."
                value={filters.search || ''}
                onChange={handleSearchChange}
                className="max-w-sm"
            />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Produk</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Stok</TableHead>
                            <TableHead>Satuan</TableHead>
                            <TableHead>HPP per Unit</TableHead>
                            <TableHead>Total Nilai Stok</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.data.length ? (
                            products.data.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.nama_bahan_baku}</TableCell>
                                    <TableCell>{product.kategori}</TableCell>
                                    <TableCell>{product.stok}</TableCell>
                                    <TableCell>{product.satuan_dasar}</TableCell>
                                    <TableCell>{formatCurrency(product.harga_standar)}</TableCell>
                                    <TableCell>{formatCurrency(product.stok * product.harga_standar)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Tidak ada produk ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Menampilkan {products.from}-{products.to} dari {products.total} produk.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(products.links[0].url)}
                        disabled={!products.links[0].url}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(products.links[products.links.length - 1].url)}
                        disabled={!products.links[products.links.length - 1].url}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
