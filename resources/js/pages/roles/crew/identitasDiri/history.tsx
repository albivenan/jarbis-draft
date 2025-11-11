import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Karyawan {
  id_karyawan: string;
  nama_lengkap: string;
  nik_perusahaan: string;
}

interface HistoryRequest {
  id: number;
  karyawan: Karyawan;
  tipe_perubahan: string;
  field_name: string;
  nilai_lama: string;
  nilai_baru: string;
  status: 'pending' | 'disetujui' | 'ditolak';
  diajukan_pada: string;
  waktu_direspon?: string;
}

import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface CustomPageProps extends InertiaPageProps {
  historyRequests: HistoryRequest[];
}

export default function History() {
  const { historyRequests, auth } = usePage<CustomPageProps>().props;

  const getRoutePrefix = () => {
    const role = auth?.user?.role || '';
    if (role === 'crew_kayu') return 'crew-kayu';
    if (role === 'crew_besi') return 'crew-besi';
    return 'crew-kayu'; // Default fallback
  };

  const routePrefix = getRoutePrefix();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'disetujui':
        return 'default';
      case 'ditolak':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <AuthenticatedLayout
      title="Riwayat Perubahan Data"
      breadcrumbs={[
        { title: 'Dashboard', href: `/roles/${routePrefix}` },
        { title: 'Identitas Diri', href: `/roles/${routePrefix}/identitas-diri` },
        { title: 'Riwayat Perubahan Data', href: '#' }
      ]}
    >
      <Head title="Riwayat Perubahan Data" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Riwayat Perubahan Data</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Riwayat Perubahan Data ({historyRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">No</th>
                    <th className="text-left py-3 px-4">Jenis Perubahan</th>
                    <th className="text-left py-3 px-4">Field</th>
                    <th className="text-left py-3 px-4">Nilai Lama</th>
                    <th className="text-left py-3 px-4">Nilai Baru</th>
                    <th className="text-left py-3 px-4">Diajukan Pada</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Waktu Respon</th>
                  </tr>
                </thead>
                <tbody>
                  {historyRequests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-4 text-gray-500">Tidak ada riwayat perubahan data yang tertunda.</td>
                    </tr>
                  ) : (
                    historyRequests.map((request, index) => (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{index + 1}</td>
                        <td className="py-3 px-4">{request.tipe_perubahan}</td>
                        <td className="py-3 px-4">{request.field_name}</td>
                        <td className="py-3 px-4">{request.nilai_lama || '-'}</td>
                        <td className="py-3 px-4">{request.nilai_baru || '-'}</td>
                        <td className="py-3 px-4">{format(new Date(request.diajukan_pada), 'dd MMMM yyyy HH:mm', { locale: id })}</td>
                        <td className="py-3 px-4">
                          <Badge variant={getStatusBadgeVariant(request.status)}>
                            {request.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {request.waktu_direspon ? format(new Date(request.waktu_direspon), 'dd MMMM yyyy HH:mm', { locale: id }) : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
