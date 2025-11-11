import React from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';

const EmailMarketing: React.FC = () => {
    return (
        <AuthenticatedLayout
            title="Email Marketing"
            breadcrumbs={[{ label: 'Manajer Marketing', href: '/roles/marketing' }, { label: 'Kampanye Pemasaran' }, { label: 'Email Marketing' }]}
        >
            <Head title="Email Marketing" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Email Marketing</h1>
                <p className="text-gray-700 dark:text-gray-300">Halaman ini akan menampilkan alat dan laporan untuk kampanye email marketing.</p>
                {/* Add your Email Marketing content here */}
            </div>
        </AuthenticatedLayout>
    );
};

export default EmailMarketing;
