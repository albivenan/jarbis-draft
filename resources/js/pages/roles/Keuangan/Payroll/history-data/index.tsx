
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { History } from 'lucide-react';

export default function HistoryData() {
    return (
        <AuthenticatedLayout>
            <Head title="Riwayat & Data Penggajian - Manajer Keuangan" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <History className="h-8 w-8 text-blue-600" />
                        Riwayat & Data Penggajian
                    </h1>
                    <p className="text-gray-600 mt-1">Lihat riwayat batch penggajian dan kelola data master terkait penggajian.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Batch Penggajian</CardTitle>
                        <CardDescription>Daftar semua batch penggajian yang telah diproses.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EmptyState
                            icon={History}
                            title="Fitur Segera Hadir"
                            description="Halaman ini akan menampilkan riwayat lengkap batch penggajian dan data master terkait."
                        />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
