import React from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';

const Analitik: React.FC = () => {
    return (
        <AuthenticatedLayout
            title="Analitik & Laporan"
            breadcrumbs={[{ label: 'Manajer Marketing', href: '/roles/manajer-marketing' }, { label: 'Analitik & Laporan' }]}
        >
            <Head title="Analitik & Laporan" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Analitik & Laporan</h1>
                <p className="text-gray-700 dark:text-gray-300">Halaman ini akan menampilkan berbagai analitik dan laporan pemasaran.</p>
                {/* Add your Analitik & Laporan content here */}
            </div>
        </AuthenticatedLayout>
    );
};

export default Analitik;
