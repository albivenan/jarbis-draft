import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import UnderDevelopment from '@/components/UnderDevelopment';

export default function DokumenArsip() {
  const { auth } = usePage().props as any;
  const userRole = auth?.user?.role;

  return (
    <AuthenticatedLayout
      title="Dokumen & Arsip Digital"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-hrd' },
        { title: 'Administrasi Perusahaan', href: '#' },
        { title: 'Dokumen & Arsip Digital', href: '/roles/manajer-hrd/administrasi/dokumen' }
      ]}
    >
      <Head title="Dokumen & Arsip Digital - Manajer HRD" />
      <UnderDevelopment 
        role={userRole} 
        message="Halaman ini akan menjadi pusat dokumen terintegrasi yang menampilkan arsip dari berbagai modul, bukan sebagai tempat upload manual." 
      />
    </AuthenticatedLayout>
  );
}