import React from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';

const SosialMedia: React.FC = () => {
    return (
        <AuthenticatedLayout
            title="Media Sosial"
            breadcrumbs={[{ label: 'Manajer Marketing', href: '/roles/manajer-marketing' }, { label: 'Kampanye Pemasaran' }, { label: 'Media Sosial' }]}
        >
            <Head title="Media Sosial" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Media Sosial</h1>
                <p className="text-gray-700 dark:text-gray-300">Halaman ini akan menampilkan manajemen kampanye media sosial.</p>
                {/* Add your Social Media content here */}
            </div>
        </AuthenticatedLayout>
    );
};

export default SosialMedia;
