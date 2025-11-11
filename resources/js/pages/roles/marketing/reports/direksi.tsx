import React from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';

const LaporanDireksi: React.FC = () => {
    return (
        <AuthenticatedLayout
            title="Laporan ke Direksi"
            breadcrumbs={[{ label: 'Manajer Marketing', href: '/roles/marketing' }, { label: 'Laporan' }, { label: 'Direksi' }]}
        >
            <Head title="Laporan ke Direksi" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Laporan ke Direksi</h1>
                <p className="text-gray-700 dark:text-gray-300">Halaman ini akan menampilkan laporan pemasaran yang ditujukan untuk direksi.</p>
                {/* Add your Laporan ke Direksi content here */}
            </div>
        </AuthenticatedLayout>
    );
};

export default LaporanDireksi;
