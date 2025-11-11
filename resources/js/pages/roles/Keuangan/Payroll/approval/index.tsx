import { useState, useEffect, useMemo } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Clock, Eye, XCircle, Loader2, DollarSign, ShieldCheck } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// --- TYPE DEFINITIONS ---
interface AttendanceSummary {
    hadir: number;
    terlambat: number;
    total_menit_terlambat: number;
    total_jam_lembur: number;
}

interface Employee {
    id: number; // PayrollEmployee ID
    id_karyawan: number; // User ID
    nik_perusahaan: string;
    nama_lengkap: string;
    departemen: string;
    jabatan: string;
    gaji_pokok: number;
    tunjangan: number;
    potongan: number;
    upah_lembur: number;
    total_gaji: number;
    koreksi_gaji: number;
    catatan_koreksi: string;
    attendance_summary: AttendanceSummary;
    status: 'submitted' | 'approved' | 'rejected' | 'finalized' | 'paid';
    bank_info?: {
        nama_bank: string | null;
        nomor_rekening: string | null;
        nama_pemilik_rekening: string | null;
    };
    batch_paid_at?: string;
}

interface Batch {
    id: number;
    batch_code: string;
    period: string;
    period_type: string;
    total_employees: number;
    total_amount: number;
    status: 'submitted' | 'approved' | 'rejected' | 'finalized' | 'paid';
    metode_pembayaran: 'transfer' | 'tunai'; // Added payment method
    submitted_at?: string;
    submitted_by?: string;
    approved_at?: string;
    approved_by?: string;
    paid_at?: string;
    employees: Employee[];
}

interface PageSpecificProps {
    batches: Batch[];
    flash: { success?: string; error?: string; };
    activeTab: 'pending' | 'payment' | 'completed';
}

interface BasePageProps {
    auth: { user: any; };
    ziggy: any;
    [key: string]: any;
}

type PageProps = BasePageProps & PageSpecificProps;

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount || 0);

const formatLocalDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    // Append 'Z' to indicate UTC, if not already present and it's a simple datetime string
    const utcDateString = dateString.endsWith('Z') || dateString.includes('+') || dateString.includes('-')
        ? dateString
        : dateString + 'Z';

    const date = new Date(utcDateString);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    return date.toLocaleString('id-ID', options);
};

const Approval = () => {
    const { batches: initialBatches, flash, activeTab: initialActiveTab } = usePage<PageProps>().props;

    // State Management
    const [activeTab, setActiveTab] = useState(initialActiveTab || 'pending');
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<number>>(new Set());
    const [finalizedIds, setFinalizedIds] = useState<Set<number>>(new Set()); // New state to track finalized employees
    const [processingBulkAction, setProcessingBulkAction] = useState(false);
    const [detailDialog, setDetailDialog] = useState<{ open: boolean; employee: Employee | null }>({ open: false, employee: null });
    const [batchPaymentMethods, setBatchPaymentMethods] = useState<Record<number, 'transfer' | 'tunai'>>({});

    useEffect(() => {
        const initialMethods: Record<number, 'transfer' | 'tunai'> = {};
        initialBatches.forEach(batch => {
            initialMethods[batch.id] = batch.metode_pembayaran || 'transfer'; // Default to 'transfer'
        });
        setBatchPaymentMethods(initialMethods);
    }, [initialBatches]);

    // Filter batches based on active tab
    const filteredBatches = useMemo(() => {
        if (activeTab === 'pending') return initialBatches.filter(b => b.status === 'submitted');
        if (activeTab === 'payment') return initialBatches.filter(b => b.status === 'approved'); // Now shows approved batches
        if (activeTab === 'completed') return initialBatches.filter(b => ['paid', 'rejected'].includes(b.status));
        return [];
    }, [initialBatches, activeTab]);

    // Toast notifications for flash messages
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // --- Handlers ---

    const resetSelections = () => {
        setSelectedEmployeeIds(new Set());
        setFinalizedIds(new Set()); // Reset finalized IDs as well
    };

    const handlePaymentMethodChange = (batchId: number, method: 'transfer' | 'tunai') => {
        setBatchPaymentMethods(prev => ({
            ...prev,
            [batchId]: method,
        }));

        router.post(route('api.payroll.batch.update-payment-method', { batch: batchId }), {
            metode_pembayaran: method,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Metode pembayaran untuk batch ${batchId} diperbarui menjadi ${method}.`);
            },
            onError: () => {
                toast.error(`Gagal memperbarui metode pembayaran untuk batch ${batchId}.`);
                // Revert the state if the API call fails
                setBatchPaymentMethods(prev => ({
                    ...prev,
                    [batchId]: prev[batchId] === 'transfer' ? 'tunai' : 'transfer',
                }));
            },
        });
    };

    const handleTabChange = (newTab: 'pending' | 'payment' | 'completed') => {
        setActiveTab(newTab);
        resetSelections();
        router.get(route('keuangan.payroll.approval'), { tab: newTab }, { preserveState: true, replace: true, only: ['batches', 'activeTab'] });
    };

    const handleSelectEmployee = (employeeId: number) => {
        const newSelected = new Set(selectedEmployeeIds);
        if (newSelected.has(employeeId)) {
            newSelected.delete(employeeId);
        } else {
            newSelected.add(employeeId);
        }
        setSelectedEmployeeIds(newSelected);
        // If selection changes, reset finalized status for these employees
        setFinalizedIds(prev => {
            const newFinalized = new Set(prev);
            if (newSelected.has(employeeId)) {
                // If employee is newly selected, ensure they are not marked as finalized yet
                newFinalized.delete(employeeId);
            } else {
                // If employee is deselected, remove them from finalized as well
                newFinalized.delete(employeeId);
            }
            return newFinalized;
        });
    };

    const handleSelectAll = (employeesInTable: Employee[]) => {
        const allIds = employeesInTable.map(emp => emp.id);
        const allSelected = allIds.length > 0 && allIds.every(id => selectedEmployeeIds.has(id));

        if (allSelected) {
            resetSelections();
        } else {
            setSelectedEmployeeIds(new Set(allIds));
            setFinalizedIds(new Set()); // Reset finalized IDs when selecting all
        }
    };

    const handleBulkApproveReject = (action: 'approve' | 'reject') => {
        if (selectedEmployeeIds.size === 0) return toast.error('Tidak ada karyawan yang dipilih.');
        if (!confirm(`Anda yakin ingin ${action === 'approve' ? 'MENYETUJUI' : 'MENOLAK'} ${selectedEmployeeIds.size} karyawan terpilih?`)) return;

        router.post(route('api.payroll.bulk-approve-reject'), { ids: Array.from(selectedEmployeeIds), action }, {
            onStart: () => setProcessingBulkAction(true),
            onSuccess: () => {
                toast.success(`Aksi berhasil diproses.`);
                resetSelections();
            },
            onError: () => toast.error('Gagal memproses aksi massal.'),
            onFinish: () => {
                setProcessingBulkAction(false);
                router.reload({ only: ['batches', 'activeTab', 'flash'] });
            },
        });
    };

    const handleFinalize = () => {
        if (selectedEmployeeIds.size === 0) return toast.error('Tidak ada karyawan yang dipilih.');
        if (!confirm(`Anda yakin ingin VALIDASI & FINALISASI ${selectedEmployeeIds.size} karyawan terpilih?`)) return;

        router.post(route('api.payroll.finalize-approved-batch'), { ids: Array.from(selectedEmployeeIds) }, {
            onStart: () => setProcessingBulkAction(true),
            onSuccess: () => {
                toast.success('Validasi & Finalisasi berhasil! Tombol Bayar kini tersedia.');
                setFinalizedIds(new Set(selectedEmployeeIds)); // Mark these IDs as ready to be paid
            },
            onError: () => toast.error('Gagal memfinalisasi data.'),
            onFinish: () => setProcessingBulkAction(false),
        });
    };

    const handleBulkPay = () => {
        if (selectedEmployeeIds.size === 0) return toast.error('Tidak ada karyawan yang dipilih.');
        if (!confirm(`Anda yakin ingin MEMBAYAR ${selectedEmployeeIds.size} karyawan terpilih?`)) return;

        router.post(route('api.payroll.bulk-pay'), { ids: Array.from(selectedEmployeeIds) }, {
            onStart: () => setProcessingBulkAction(true),
            onSuccess: () => {
                toast.success('Pembayaran berhasil diproses.');
                // Force a visit to the completed tab to see the result
                router.visit(route('keuangan.payroll.approval', { tab: 'completed' }));
            },
            onError: () => toast.error('Gagal memproses pembayaran.'),
            onFinish: () => {
                setProcessingBulkAction(false);
            },
        });
    };

    // --- Render Functions ---

    const renderActionButtons = () => {
        if (selectedEmployeeIds.size === 0) return null;

        const commonProps = { disabled: processingBulkAction };
        const loader = <Loader2 className="mr-2 h-4 w-4 animate-spin" />;

        if (activeTab === 'pending') {
            return (
                <div className="flex gap-2">
                    <Button {...commonProps} onClick={() => handleBulkApproveReject('approve')}>
                        {processingBulkAction ? loader : <CheckCircle className="mr-2 h-4 w-4" />}
                        Setujui ({selectedEmployeeIds.size})
                    </Button>
                    <Button {...commonProps} variant="destructive" onClick={() => handleBulkApproveReject('reject')}>
                        {processingBulkAction ? loader : <XCircle className="mr-2 h-4 w-4" />}
                        Tolak ({selectedEmployeeIds.size})
                    </Button>
                </div>
            );
        }

        if (activeTab === 'payment') {
            if (selectedEmployeeIds.size > 0) {
                return (
                    <Button {...commonProps} className="bg-green-600 hover:bg-green-700 text-white" onClick={handleBulkPay}>
                        {processingBulkAction ? loader : <DollarSign className="mr-2 h-4 w-4" />}
                        Bayar ({selectedEmployeeIds.size})
                    </Button>
                );
            } else {
                return (
                    <Button {...commonProps} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleFinalize}>
                        {processingBulkAction ? loader : <ShieldCheck className="mr-2 h-4 w-4" />}
                        Validasi & Finalisasi ({selectedEmployeeIds.size})
                    </Button>
                );
            }
        }

        return null;
    };

    const renderBatchTable = (batchesToRender: Batch[], filterStatus: 'submitted' | 'approved' | 'finalized' | 'paid' | 'rejected') => {
        if (batchesToRender.length === 0) {
            return <Card className="mt-4"><CardContent><EmptyState icon={Clock} title="Tidak Ada Data" description="Belum ada batch penggajian untuk tab ini." /></CardContent></Card>;
        }

        return (
            <div className="space-y-4">
                {batchesToRender.map((batch) => {
                    // For payment tab, we only allow selection of 'approved' employees
                    const selectableEmployees = batch.employees.filter(emp => emp.status === filterStatus);
                    const allInBatchSelected = selectableEmployees.length > 0 && selectableEmployees.every(emp => selectedEmployeeIds.has(emp.id));

                    return (
                        <Card key={batch.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">{batch.batch_code} <Badge variant={batch.status === 'submitted' ? 'secondary' : 'default'}>{batch.status}</Badge></CardTitle>
                                <CardDescription className="flex justify-between items-center">
                                    <div>
                                        <span>Periode: {batch.period} • Total: {formatCurrency(batch.total_amount)}</span>
                                        {batch.submitted_by && <span className="text-xs text-muted-foreground ml-2">Diajukan oleh: {batch.submitted_by} pada {formatLocalDateTime(batch.submitted_at)}</span>}
                                        {batch.approved_by && <span className="text-xs text-muted-foreground ml-2">Disetujui oleh: {batch.approved_by} pada {formatLocalDateTime(batch.approved_at)}</span>}
                                        {activeTab === 'completed' && batch.paid_at && <span className="text-xs text-muted-foreground ml-2">Dibayarkan pada: {formatLocalDateTime(batch.paid_at)}</span>}
                                        {(activeTab === 'payment' || activeTab === 'completed') && batch.metode_pembayaran && (
                                            <span className="ml-2 text-sm text-muted-foreground">Metode Pembayaran: <span className="font-semibold capitalize">{batch.metode_pembayaran}</span></span>
                                        )}
                                    </div>
                                    {activeTab === 'pending' && (
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor={`payment-method-${batch.id}`} className="text-xs">Metode Pembayaran:</Label>
                                            <Select
                                                value={batchPaymentMethods[batch.id] || 'transfer'}
                                                onValueChange={(value: 'transfer' | 'tunai') => handlePaymentMethodChange(batch.id, value)}
                                            >
                                                <SelectTrigger id={`payment-method-${batch.id}`} className="w-[120px] h-8 text-xs">
                                                    <SelectValue placeholder="Pilih Metode" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="transfer">Transfer</SelectItem>
                                                    <SelectItem value="tunai">Tunai</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">
                                                <Checkbox
                                                    checked={allInBatchSelected}
                                                    onCheckedChange={() => handleSelectAll(selectableEmployees)}
                                                    disabled={selectableEmployees.length === 0}
                                                />
                                            </TableHead>
                                            <TableHead>Nama Karyawan</TableHead>
                                            <TableHead>Departemen</TableHead>
                                            <TableHead className="text-right">Total Gaji</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {batch.employees.map((employee) => {
                                            const isFinalized = finalizedIds.has(employee.id);
                                            const isSelectable = employee.status === filterStatus;
                                            const isChecked = selectedEmployeeIds.has(employee.id);

                                            return (
                                                <TableRow key={employee.id} data-disabled={!isSelectable && activeTab !== 'completed'} className={!isSelectable && activeTab !== 'completed' ? "bg-muted/50 text-muted-foreground" : ""}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onCheckedChange={() => handleSelectEmployee(employee.id)}
                                                            disabled={!isSelectable}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">{employee.nama_lengkap}</TableCell>
                                                    <TableCell>{employee.departemen}</TableCell>
                                                    <TableCell className="text-right font-semibold">{formatCurrency(employee.total_gaji)}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant={
                                                            employee.status === 'paid' ? 'success' :
                                                                employee.status === 'approved' ? 'default' :
                                                                    employee.status === 'finalized' ? 'outline' :
                                                                        employee.status === 'rejected' ? 'destructive' : 'secondary'
                                                        }>{employee.status}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setDetailDialog({ open: true, employee })}>
                                                            <span className="sr-only">Buka detail</span>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Persetujuan Penggajian - Manajer Keuangan" />

            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        Persetujuan Penggajian
                    </h1>
                    <p className="text-gray-600 mt-1">Tinjau, setujui, finalisasi, dan proses pembayaran batch penggajian.</p>
                </div>

                {selectedEmployeeIds.size > 0 && (
                    <Card>
                        <CardContent className="pt-6 flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{selectedEmployeeIds.size} karyawan terpilih</span>
                            {renderActionButtons()}
                        </CardContent>
                    </Card>
                )}

                <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as 'pending' | 'payment' | 'completed')}>
                    <TabsList>
                        <TabsTrigger value="pending">Menunggu Persetujuan</TabsTrigger>
                        <TabsTrigger value="payment">Menunggu Pembayaran</TabsTrigger>
                        <TabsTrigger value="completed">Selesai</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending">{renderBatchTable(filteredBatches, 'submitted')}</TabsContent>
                    <TabsContent value="payment">{renderBatchTable(filteredBatches, 'approved')}</TabsContent>
                    <TabsContent value="completed">{renderBatchTable(filteredBatches, 'paid')}</TabsContent>
                </Tabs>
            </div>

            {/* Dialog Lihat Detail */}
            <Dialog open={detailDialog.open} onOpenChange={(open) => setDetailDialog({ open, employee: null })}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detail Penggajian</DialogTitle>
                        <DialogDescription>
                            {detailDialog.employee?.nama_lengkap} - {detailDialog.employee?.departemen}
                        </DialogDescription>
                    </DialogHeader>
                    {detailDialog.employee && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm text-muted-foreground">NIK</Label>
                                    <p className="font-medium">{detailDialog.employee.nik_perusahaan}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Departemen</Label>
                                    <p className="font-medium">{detailDialog.employee.departemen}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Jabatan</Label>
                                    <p className="font-medium">{detailDialog.employee.jabatan}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-3">Komponen Gaji</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Gaji Pokok</span>
                                        <span className="font-medium">{formatCurrency(detailDialog.employee.gaji_pokok)}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span>Tunjangan</span>
                                        <span className="font-medium">+ {formatCurrency(detailDialog.employee.tunjangan)}</span>
                                    </div>
                                    <div className="flex justify-between text-blue-600">
                                        <span>Upah Lembur</span>
                                        <span className="font-medium">+ {formatCurrency(detailDialog.employee.upah_lembur)}</span>
                                    </div>
                                    <div className="flex justify-between text-red-600">
                                        <span>Potongan</span>
                                        <span className="font-medium">- {formatCurrency(detailDialog.employee.potongan)}</span>
                                    </div>
                                    {detailDialog.employee.koreksi_gaji !== 0 && (
                                        <div className={`flex justify-between ${detailDialog.employee.koreksi_gaji > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            <span>Koreksi</span>
                                            <span className="font-medium">
                                                {detailDialog.employee.koreksi_gaji > 0 ? '+ ' : '- '}
                                                {formatCurrency(Math.abs(detailDialog.employee.koreksi_gaji))}
                                            </span>
                                        </div>
                                    )}
                                    {detailDialog.employee.catatan_koreksi && (
                                        <div className="text-sm text-muted-foreground italic">
                                            Catatan: {detailDialog.employee.catatan_koreksi}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total Gaji</span>
                                    <span>{formatCurrency(detailDialog.employee.total_gaji)}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-3">Informasi Bank</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Nama Bank:</span>
                                        <span className="ml-2 font-medium">{detailDialog.employee.bank_info?.nama_bank || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Nomor Rekening:</span>
                                        <span className="ml-2 font-medium">{detailDialog.employee.bank_info?.nomor_rekening || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Nama Pemilik:</span>
                                        <span className="ml-2 font-medium">{detailDialog.employee.bank_info?.nama_pemilik_rekening || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            {detailDialog.employee.batch_paid_at && (
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-3">Informasi Pembayaran</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Tanggal Dibayar:</span>
                                            <span className="ml-2 font-medium">{formatLocalDateTime(detailDialog.employee.batch_paid_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {detailDialog.employee.attendance_summary && (
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-3">Ringkasan Kehadiran</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Hari Hadir:</span>
                                            <span className="ml-2 font-medium">{detailDialog.employee.attendance_summary.hadir} hari</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Terlambat:</span>
                                            <span className="ml-2 font-medium">{detailDialog.employee.attendance_summary.terlambat} kali</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Total Keterlambatan:</span>
                                            <span className="ml-2 font-medium">{detailDialog.employee.attendance_summary.total_menit_terlambat} menit</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Jam Lembur:</span>
                                            <span className="ml-2 font-medium">{detailDialog.employee.attendance_summary.total_jam_lembur} jam</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
};

export default Approval;
