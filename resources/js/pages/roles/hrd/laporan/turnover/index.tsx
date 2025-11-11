import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import UnderDevelopment from '@/components/UnderDevelopment'; // Import the UnderDevelopment component

export default function LaporanTurnover() {
  return (
    <AuthenticatedLayout
      title="Laporan Turnover"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/hrd' },
        { title: 'Laporan HRD', href: '#' },
        { title: 'Laporan Turnover', href: '/roles/hrd/laporan/turnover' }
      ]}
    >
      <Head title="Laporan Turnover - Manajer HRD" />

      <div className="space-y-6">
        <UnderDevelopment />
      </div>
    </AuthenticatedLayout>
  );
}
