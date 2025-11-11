import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Check, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Jabatan {
  nama_jabatan: string;
}

interface Departemen {
  nama_departemen: string;
}

interface RincianPekerjaan {
  jabatan: Jabatan;
  departemen: Departemen;
}

interface KontakKaryawan {
  email_perusahaan: string;
}

interface Karyawan {
  id_karyawan: string;
  nama_lengkap: string;
  nik_perusahaan: string;
  kontak_karyawan: KontakKaryawan;
  rincian_pekerjaan: RincianPekerjaan;
}

interface PermintaanPerubahanData {
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

interface PageProps extends InertiaPageProps {
  allRequests: PermintaanPerubahanData[];
}

export default function PermintaanPerubahanDataPage() {
  const { allRequests } = usePage<PageProps>().props;

  const pendingRequests = allRequests.filter(req => req.status === 'pending');
  const historyRequests = allRequests.filter(req => req.status === 'disetujui' || req.status === 'ditolak');

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

  const handleApprove = (id: number) => {
    router.post(route('manajer-hrd.karyawan.approve-data-change-request', { id }), {}, {
      onSuccess: () => {
        router.reload();
      },
      onError: (errors: Record<string, string>) => {
        console.error('Error approving request:', errors);
      },
    });
  };

  const handleReject = (id: number) => {
    router.post(route('manajer-hrd.karyawan.reject-data-change-request', { id }), {}, {
      onSuccess: () => {
        router.reload();
      },
      onError: (errors: Record<string, string>) => {
        console.error('Error rejecting request:', errors);
      },
    });
  };

  const renderTable = (requests: PermintaanPerubahanData[], showActions: boolean) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">No</th>
            <th className="text-left py-3 px-4">Nama Karyawan</th>
            <th className="text-left py-3 px-4">NIK</th>
            <th className="text-left py-3 px-4">Jenis Perubahan</th>
            <th className="text-left py-3 px-4">Nilai Lama</th>
            <th className="text-left py-3 px-4">Nilai Baru</th>
            <th className="text-left py-3 px-4">Diajukan Pada</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Waktu Respon</th>
            {showActions && <th className="text-left py-3 px-4">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan={showActions ? 10 : 9} className="text-center py-4 text-gray-500">Tidak ada riwayat perubahan data.</td>
            </tr>
          ) : (
            requests.map((request, index) => (
              <tr key={request.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{index + 1}</td>
                <td className="py-3 px-4">{request.karyawan.nama_lengkap}</td>
                <td className="py-3 px-4">{request.karyawan.nik_perusahaan}</td>
                <td className="py-3 px-4">{request.tipe_perubahan}</td>
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
                {showActions && (
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" title="Lihat Detail">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {request.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="sm" title="Setujui" onClick={() => handleApprove(request.id)}>
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Tolak" onClick={() => handleReject(request.id)}>
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <AuthenticatedLayout
      title="Permintaan Perubahan Data"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-hrd' },
        { title: 'Karyawan', href: '#' },
        { title: 'Permintaan Perubahan Data', href: '/roles/manajer-hrd/karyawan/permintaan-perubahan-data' }
      ]}
    >
      <Head title="Permintaan Perubahan Data - Manajer HRD" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Permintaan Perubahan Data</h1>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">Menunggu ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="history">Riwayat ({historyRequests.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Permintaan Menunggu Persetujuan</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTable(pendingRequests, true)}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Permintaan Perubahan Data</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTable(historyRequests, false)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}