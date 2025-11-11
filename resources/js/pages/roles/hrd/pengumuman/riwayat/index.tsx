import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, isFuture, isPast } from 'date-fns';
import { id } from 'date-fns/locale';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface User {
    id: number;
    name: string;
}

interface Pengumuman {
    id: number;
    judul: string;
    konten: string;
    waktu_publikasi: string | null;
    status: 'draft' | 'published';
    user: User;
    created_at: string;
    updated_at: string;
}

interface PengumumanPageProps {
    pengumuman: {
        data: Pengumuman[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
}

export default function RiwayatPengumuman({ pengumuman }: PengumumanPageProps) {
    const truncateHtml = (htmlContent: string, maxLength: number) => {
        const div = document.createElement('div');
        div.innerHTML = htmlContent;
        const textContent = div.textContent || div.innerText || '';
        if (textContent.length > maxLength) {
            return textContent.substring(0, maxLength) + '...';
        }
        return textContent;
    };

    const getStatusDisplay = (item: Pengumuman) => {
        if (item.status === 'draft') {
            return <span className="text-gray-500">Draft</span>;
        } else if (item.waktu_publikasi) {
            const publishTime = new Date(item.waktu_publikasi);
            if (isFuture(publishTime)) {
                return <span className="text-blue-600">Menunggu</span>;
            } else if (isPast(publishTime)) {
                return <span className="text-green-600">Dipublikasi</span>;
            } else { // Exactly now
                return <span className="text-green-600">Dipublikasi</span>;
            }
        }
        return <span className="text-red-500">Invalid Status</span>; // Fallback
    };

    const handleDelete = (id: number) => {
        router.delete(route('hrd.pengumuman.destroy', { pengumuman: id }), {
            onSuccess: () => {
                toast.success('Pengumuman berhasil dihapus!');
            },
            onError: (error) => {
                toast.error('Gagal menghapus pengumuman.');
                console.error(error);
            },
        });
    };

    // Map Inertia links to Pagination component props
    const paginationLinks = pengumuman.links.map(link => ({
        label: link.label,
        url: link.url || '#',
        active: link.active,
        href: link.url || '#', // Add href property
    }));

    return (
        <AuthenticatedLayout
            title="Riwayat Pengumuman"
            breadcrumbs={[
                { title: 'Dashboard', href: '/roles/hrd' },
                { title: 'Pengumuman', href: '/roles/hrd/pengumuman/riwayat' },
                { title: 'Riwayat Pengumuman', href: '/roles/hrd/pengumuman/riwayat' }
            ]}
        >
            <Head title="Riwayat Pengumuman" />

            <Card className="max-w-full mx-auto">
                <CardHeader>
                    <CardTitle>Daftar Riwayat Pengumuman</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Judul</TableHead>
                                    <TableHead>Konten Singkat</TableHead>
                                    <TableHead>Waktu Publikasi</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Dibuat Oleh</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pengumuman.data.length > 0 ? (
                                    pengumuman.data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.judul}</TableCell>
                                            <TableCell dangerouslySetInnerHTML={{ __html: truncateHtml(item.konten, 100) }} />
                                            <TableCell>
                                                {item.waktu_publikasi ? 
                                                    format(new Date(item.waktu_publikasi), 'dd MMMM yyyy HH:mm', { locale: id })
                                                    : <span className="text-gray-500">N/A</span>
                                                }
                                            </TableCell>
                                            <TableCell>{getStatusDisplay(item)}</TableCell>
                                            <TableCell>{item.user.name}</TableCell>
                                            <TableCell className="flex items-center space-x-2">
                                                <Link href={route('hrd.pengumuman.riwayat.show', { pengumuman: item.id })} className="text-blue-600 hover:underline">
                                                    Lihat
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" size="sm">Hapus</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus pengumuman "{item.judul}" secara permanen.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(item.id)}>Hapus</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">Tidak ada pengumuman.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {pengumuman.links.length > 3 && (
                        <Pagination links={paginationLinks} className="mt-4" /> // Use mapped links
                    )}
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
