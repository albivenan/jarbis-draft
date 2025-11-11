import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, CheckCircle2, XCircle, FileText, Pencil, Trash2, Eye, Download, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export type LeaveType = 'cuti' | 'izin' | 'sakit';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
    id: string;
    jenis_pengajuan: LeaveType;
    tanggal_mulai: string;
    tanggal_selesai: string;
    alasan: string;
    status: LeaveStatus;
    created_at: string;
    approved_by?: string;
    approved_at?: string;
    catatan_approval?: string;
    dokumen?: string[];
}

interface LeaveHistoryProps {
    leaves: LeaveRequest[];
    isLoading: boolean;
    onEdit?: (leave: LeaveRequest) => void;
}

const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
        case 'approved':
            return (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Disetujui
                </Badge>
            );
        case 'rejected':
            return (
                <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                    <XCircle className="h-3 w-3 mr-1" /> Ditolak
                </Badge>
            );
        default:
            return (
                <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50">
                    <Clock className="h-3 w-3 mr-1" /> Diproses
                </Badge>
            );
    }
};

const getTypeLabel = (type: LeaveType) => {
    const types: Record<LeaveType, string> = {
        cuti: 'Cuti Tahunan',
        izin: 'Izin Tidak Masuk',
        sakit: 'Sakit',
    };
    return types[type] || type;
};

export const LeaveHistory = ({ leaves, isLoading, onEdit }: LeaveHistoryProps) => {
    const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        setDeleteId(id);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (deleteId) {
            router.delete(route('leave-requests.destroy', deleteId), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setShowDeleteDialog(false);
                    setDeleteId(null);
                },
                onError: (errors) => {
                    console.error('Delete failed:', errors);
                    alert('Gagal menghapus pengajuan');
                }
            });
        }
    };

    const handleViewDetail = (leave: LeaveRequest) => {
        setSelectedLeave(leave);
        setShowDetailDialog(true);
    };

    if (isLoading) {
        return <div className="text-center py-12">Memuat riwayat...</div>;
    }

    if (leaves.length === 0) {
        return (
            <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada pengajuan</h3>
                <p className="mt-1 text-sm text-gray-500">Mulai dengan membuat pengajuan baru</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {leaves.map((leave) => (
                    <Card key={leave.id} className="border-2">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-blue-500">
                                        {getTypeLabel(leave.jenis_pengajuan)}
                                    </Badge>
                                    {getStatusBadge(leave.status)}
                                </div>
                                {leave.status === 'pending' && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit?.(leave)}
                                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                                        >
                                            <Pencil className="w-4 h-4 mr-1" />
                                            Ubah
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(leave.id)}
                                            className="text-red-600 border-red-300 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Batalkan
                                        </Button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Tanggal:</span>
                                    <span className="font-medium">
                                        {leave.tanggal_mulai}
                                        {leave.tanggal_mulai !== leave.tanggal_selesai && (
                                            <span> s/d {leave.tanggal_selesai}</span>
                                        )}
                                    </span>
                                </div>
                                
                                <div className="pt-2 border-t">
                                    <span className="text-sm text-gray-600">Alasan:</span>
                                    <p className="mt-1 text-sm">{leave.alasan}</p>
                                </div>
                                
                                {leave.dokumen && leave.dokumen.length > 0 && (
                                    <div className="pt-2 border-t">
                                        <span className="text-sm text-gray-600">Dokumen:</span>
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            {leave.dokumen.map((doc, idx) => (
                                                <Badge key={idx} variant="secondary" className="text-xs">
                                                    <FileText className="w-3 h-3 mr-1" />
                                                    Dokumen {idx + 1}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex justify-between text-xs text-gray-500 pt-2">
                                    <span>Diajukan: {new Date(leave.created_at).toLocaleString('id-ID', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        onClick={() => handleViewDetail(leave)}
                                        className="h-auto p-0 text-xs"
                                    >
                                        <Eye className="w-3 h-3 mr-1" />
                                        Detail
                                    </Button>
                                </div>
                                
                                {leave.status === 'pending' && (
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
                                
                                {(leave.status === 'approved' || leave.status === 'rejected') && (
                                    <Alert className={leave.status === 'approved' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                                        <AlertDescription>
                                            <div className="text-sm space-y-1">
                                                <div>
                                                    <strong className={leave.status === 'approved' ? 'text-green-800' : 'text-red-800'}>
                                                        {leave.status === 'approved' ? '✓ Disetujui' : '✗ Ditolak'}
                                                    </strong>
                                                    {leave.approved_by && (
                                                        <span className="text-gray-600"> oleh HRD</span>
                                                    )}
                                                </div>
                                                {leave.approved_at && (
                                                    <div className="text-xs text-gray-600">
                                                        <strong>Waktu:</strong> {new Date(leave.approved_at).toLocaleString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                )}
                                                {leave.catatan_approval && (
                                                    <div className="pt-2 border-t border-gray-200">
                                                        <strong className="text-gray-700">Catatan HRD:</strong>
                                                        <p className="mt-1 text-gray-600">{leave.catatan_approval}</p>
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

            {/* Detail Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detail Pengajuan Izin</DialogTitle>
                    </DialogHeader>
                    {selectedLeave && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Jenis</label>
                                    <p className="mt-1">{getTypeLabel(selectedLeave.jenis_pengajuan)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Status</label>
                                    <div className="mt-1">{getStatusBadge(selectedLeave.status)}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Tanggal Mulai</label>
                                    <p className="mt-1">{selectedLeave.tanggal_mulai}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Tanggal Selesai</label>
                                    <p className="mt-1">{selectedLeave.tanggal_selesai}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Alasan</label>
                                <p className="mt-1">{selectedLeave.alasan}</p>
                            </div>
                            {selectedLeave.dokumen && selectedLeave.dokumen.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Dokumen Pendukung</label>
                                    <div className="mt-2 space-y-2">
                                        {selectedLeave.dokumen.map((doc, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 border rounded">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm">Dokumen {idx + 1}</span>
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Batalkan Pengajuan</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin membatalkan pengajuan ini? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Ya, Batalkan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
