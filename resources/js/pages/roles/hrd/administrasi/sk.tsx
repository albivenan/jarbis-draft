import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import UnderDevelopment from '@/components/UnderDevelopment';

export default function SuratKeputusan() {
  const { auth } = usePage().props as any;
  const userRole = auth?.user?.role;

  return (
    <AuthenticatedLayout
      title="Surat Keputusan (SK)"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/hrd' },
        { title: 'Administrasi Perusahaan', href: '#' },
        { title: 'Surat Keputusan (SK)', href: '/roles/hrd/administrasi/sk' }
      ]}
    >
      <Head title="Surat Keputusan (SK) - HRD" />
      <UnderDevelopment 
        role={userRole} 
        message="Halaman ini akan digunakan untuk mengelola Surat Keputusan (SK) karyawan, seperti SK Promosi, Mutasi, dan Pengangkatan." 
      />
    </AuthenticatedLayout>
  );
}
