import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, CheckCircle2, XCircle, AlertTriangle, Calendar as CalendarIcon, Trash2, Pencil } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { CrewConfig, HistoryItem } from '../../types';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface HistoryTabProps {
  crewConfig: CrewConfig;
  historyData?: HistoryItem[];
  onEdit: (item: HistoryItem) => void;
}

export const HistoryTab = ({ crewConfig, historyData: initialHistoryData = [], onEdit }: HistoryTabProps) => {
  const [typeFilter, setTypeFilter] = useState<'all' | 'permission' | 'overtime'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const handleFilterChange = (filterType: 'type' | 'status', value: string) => {
    if (filterType === 'type') {
      setTypeFilter(value as any);
    } else {
      setStatusFilter(value as any);
      router.reload({
        only: ['historyData']
      });
    }
  };

  const handleCancel = (item: HistoryItem) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan pengajuan ini?')) {
      return;
    }
    router.post(route('presensi.cancel-request'), {
      id_presensi: item.id
    }, {
      preserveState: true,
      preserveScroll: true,
      onError: (errors) => {
        console.error('Cancel failed:', errors);
        alert('Gagal membatalkan pengajuan');
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Diproses
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Diterima
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Ditolak
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredData = initialHistoryData.filter(item => {
    if (typeFilter === 'all') return true;
    return item.type === typeFilter;
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Riwayat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Jenis</label>
              <Select value={typeFilter} onValueChange={(value: any) => handleFilterChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="permission">Izin</SelectItem>
                  <SelectItem value="overtime">Lembur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={statusFilter} onValueChange={(value: any) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="pending">Diproses</SelectItem>
                  <SelectItem value="approved">Diterima</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredData.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 mb-2">Tidak ada riwayat pengajuan</p>
            <p className="text-sm text-gray-500">
              Riwayat pengajuan izin dan lembur akan muncul di sini
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredData.map((item) => (
            <Card key={`${item.type}-${item.id}`} className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className={item.type === 'permission' ? 'bg-blue-500' : 'bg-orange-500'}>
                      {item.type === 'permission' ? 'Izin' : 'Lembur'}
                    </Badge>
                    {getStatusBadge(item.status)}
                  </div>
                  {item.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Ubah
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(item)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Batalkan
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {item.type === 'permission' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Jenis Izin:</span>
                        <span className="font-medium">
                          {item.jenis_izin === 'izin_terlambat' ? 'Izin Terlambat' :
                           item.jenis_izin === 'izin_pulang_awal' ? 'Izin Pulang Awal' :
                           'Izin Tidak Masuk'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tanggal Permohonan:</span>
                        <span className="font-medium">{item.tanggal || item.tanggal_izin}</span>
                      </div>
                      {item.waktu_izin && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Waktu:</span>
                          <span className="font-medium">{item.waktu_izin}</span>
                        </div>
                      )}
                    </>
                  )}
                  {item.type === 'overtime' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tanggal Permohonan:</span>
                        <span className="font-medium">{item.tanggal || item.tanggal_lembur}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Jam:</span>
                        <span className="font-medium">{item.jam_mulai} - {item.jam_selesai}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Durasi:</span>
                        <span className="font-medium">{item.durasi || item.durasi_jam} jam</span>
                      </div>
                    </>
                  )}
                  <div className="pt-2 border-t">
                    <span className="text-sm text-gray-600">Alasan:</span>
                    <p className="mt-1 text-sm">{item.alasan}</p>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 pt-2">
                    <span>Diajukan: {new Date(item.requested_at || item.created_at).toLocaleString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  {item.status === 'pending' && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertDescription>
                        <div className="text-sm text-yellow-800">
                          <strong>⏳ Menunggu Persetujuan HRD</strong>
                          <p className="mt-1 text-xs text-yellow-700">
                            Anda dapat mengubah atau membatalkan permohonan ini selama belum diproses oleh HRD.
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  {(item.status === 'approved' || item.status === 'rejected') && (
                    <Alert className={item.status === 'approved' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                      <AlertDescription>
                        <div className="text-sm space-y-1">
                          <div>
                            <strong className={item.status === 'approved' ? 'text-green-800' : 'text-red-800'}>
                              {item.status === 'approved' ? '✓ Disetujui' : '✗ Ditolak'}
                            </strong>
                            {item.approved_by && (
                              <span className="text-gray-600"> oleh HRD</span>
                            )}
                          </div>
                          {item.approved_at && (
                            <div className="text-xs text-gray-600">
                              <strong>Waktu:</strong> {new Date(item.approved_at).toLocaleString('id-ID', {
                                year: 'numeric',
                                month: 'short',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          )}
                          {(item.notes || item.catatan_approval) && (
                            <div className="pt-2 border-t border-gray-200">
                              <strong className="text-gray-700">Catatan HRD:</strong>
                              <p className="mt-1 text-gray-600">{item.notes || item.catatan_approval}</p>
                            </div>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Alert className="border-blue-200 bg-blue-50">
        <AlertTriangle className="w-4 h-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-sm">
          <strong>Catatan:</strong> Riwayat pengajuan akan otomatis terhapus setelah 7 hari.
        </AlertDescription>
      </Alert>
    </div>
  );
};
