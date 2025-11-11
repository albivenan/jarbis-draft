import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import UnderDevelopment from '@/components/UnderDevelopment'; // Mengimpor langsung dari components

export default function KontrakKaryawan() {
  return (
    <AuthenticatedLayout
      title="Kontrak & Status Kerja"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-hrd' },
        { title: 'Data Karyawan', href: '#' },
        { title: 'Kontrak & Status Kerja', href: '/roles/manajer-hrd/karyawan/kontrak' }
      ]}
    >
      <Head title="Kontrak & Status Kerja - Manajer HRD" />

      <UnderDevelopment 
        title="Halaman Kontrak & Status Kerja"
        message="Fitur ini sedang dalam pengembangan dan belum tersedia untuk digunakan oleh perusahaan."
      />
    </AuthenticatedLayout>
  );
}
