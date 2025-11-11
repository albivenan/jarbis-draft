import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { FileText } from 'lucide-react';

export default function PlaceholderPage() {
    return (
        <AuthenticatedLayout>
            <Head title="Halaman - Keuangan" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Halaman</h1>
                    <p className="text-gray-600 mt-1">Deskripsi halaman.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Data</CardTitle>
                        <CardDescription>Deskripsi data.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EmptyState
                            icon={FileText}
                            title="Fitur Segera Hadir"
                            description="Halaman ini akan menampilkan data."
                        />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
