import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isFuture, isPast } from 'date-fns';
import { id } from 'date-fns/locale';

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

interface PengumumanShowPageProps {
    pengumuman: Pengumuman;
}

export default function ShowPengumuman({ pengumuman }: PengumumanShowPageProps) {
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

    return (
        <AuthenticatedLayout
            title="Detail Pengumuman"
            breadcrumbs={[
                { title: 'Dashboard', href: '/roles/hrd' },
                { title: 'Pengumuman', href: '/roles/hrd/pengumuman/riwayat' },
                { title: 'Detail Pengumuman', href: route('hrd.pengumuman.riwayat.show', { pengumuman: pengumuman.id }) } // Updated breadcrumb link
            ]}
        >
            <Head title={`Detail Pengumuman: ${pengumuman.judul}`} />

            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{pengumuman.judul}</CardTitle>
                    <div className="text-sm text-gray-500 mt-1">
                        Dibuat oleh: {pengumuman.user.name} pada {format(new Date(pengumuman.created_at), 'dd MMMM yyyy HH:mm', { locale: id })}
                    </div>
                    <div className="text-sm text-gray-500">
                        Status: {getStatusDisplay(pengumuman)}
                        {pengumuman.waktu_publikasi && (
                            <span> • Waktu Publikasi: {format(new Date(pengumuman.waktu_publikasi), 'dd MMMM yyyy HH:mm', { locale: id })}</span>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: pengumuman.konten }} />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
