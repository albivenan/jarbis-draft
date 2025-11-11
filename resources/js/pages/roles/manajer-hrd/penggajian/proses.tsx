import { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Send, AlertCircle, Loader2, PlayCircle, Calendar, Clock, ShieldCheck, X, Eye, Edit } from 'lucide-react';
import { TableLoadingState } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { route } from 'ziggy-js';
import { toast } from 'sonner';

// --- TYPE DEFINITIONS ---
interface AttendanceSummary {
    hadir: number;
    terlambat: number;
    total_menit_terlambat: number;
    total_jam_lembur: number;
}

interface Employee {
    id: number;
    id_karyawan: number;
    nik_perusahaan: string;
    nama_lengkap: string;
    departemen: string;
    jabatan: string; // Add this
    senioritas: string; // Add this
    bagian_kerja: string; // Add this
    gaji_pokok: number;
    tunjangan: number;
    potongan: number;
    upah_lembur: number;
    total_gaji: number;
    koreksi_gaji: number;
    catatan_koreksi: string;
    attendance_summary: AttendanceSummary;
    status?: string;
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
    total_employees: number;
    total_amount: number;
    status: string;
    metode_pembayaran?: 'transfer' | 'tunai';
    submitted_at?: string;
    submitted_by?: string;
    approved_at?: string;
    approved_by?: string;
    paid_at?: string;
    employees: Employee[];
}

interface PayrollStatus {
    is_window_open: boolean;
    message: string;
    open_periods: { value: string; label: string; is_missed: boolean }[];
    periode_pembayaran: string;
}

interface PageSpecificProps {
    employees: Employee[];
    batches: Batch[];
    payrollStatus: PayrollStatus;
    filters: { period?: string; department?: string; search?: string };
    flash: { validated?: boolean; success?: string; error?: string; };
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

export default function ProsesPenggajianPage() {
    const { employees: initialEmployees, batches: initialBatches, payrollStatus, filters, flash, errors } = usePage<PageProps>().props;

    const [activeTab, setActiveTab] = useState('input');
    const [showEmployeeList, setShowEmployeeList] = useState(!!filters?.period);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<number>>(new Set());
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [isValidated, setIsValidated] = useState(false);
    const [batches, setBatches] = useState<Batch[]>(initialBatches || []);
    const [employees, setEmployees] = useState<Employee[]>(initialEmployees); // New local state for employees
    const [isCancelling, setIsCancelling] = useState(false);
    const [validatedEmployees, setValidatedEmployees] = useState<Employee[]>([]);
    const [processing, setProcessing] = useState(false);
    const [historyBatches, setHistoryBatches] = useState<Batch[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [pendingPaymentBatches, setPendingPaymentBatches] = useState<Batch[]>([]);
    const [isPendingPaymentLoading, setIsPendingPaymentLoading] = useState(false);

    // Dialog states
    const [detailDialog, setDetailDialog] = useState<{ open: boolean; employee: Employee | null }>({ open: false, employee: null });
    const [koreksiDialog, setKoreksiDialog] = useState<{ open: boolean; employee: Employee | null }>({ open: false, employee: null });
    const [koreksiType, setKoreksiType] = useState<'penambahan' | 'pengurangan'>('penambahan');
    const [koreksiAmount, setKoreksiAmount] = useState('');
    const [koreksiNote, setKoreksiNote] = useState('');

    useEffect(() => {
        console.log('[MOUNT] Component mounted with props:', { initialEmployees, initialBatches, payrollStatus, filters });
        console.log('[MOUNT] Payroll Status:', payrollStatus);
        console.log('[MOUNT] Initial Employees:', initialEmployees);
        console.log('[MOUNT] Batches detail:', initialBatches);
        if (initialBatches && initialBatches.length > 0) {
            console.log('[MOUNT] First batch employees:', initialBatches[0].employees);
            initialBatches[0].employees.forEach((emp: Employee) => {
                console.log(`[MOUNT] Employee ${emp.nama_lengkap}: koreksi=${emp.koreksi_gaji}, catatan=${emp.catatan_koreksi}, status=${emp.status}`);
            });
        }

        // If a period is already selected in filters, trigger data fetching on mount
        if (filters?.period && !initialEmployees.length) {
            console.log('[MOUNT] Period already selected, fetching employees...');
            handleStartPayrollProcess({ value: filters.period, label: filters.period }); // Use period from filters
        }
    }, []);

    useEffect(() => {
        console.log('[FLASH] Flash data:', flash);

        if (flash?.validated) {
            console.log('[FLASH] Validation success - setting isValidated to true');
            setIsValidated(true);
            toast.success('Validasi Berhasil!', { description: 'Data siap untuk dikirim ke bagian keuangan.' });
        }
        if (flash?.success) {
            console.log('[FLASH] Success message:', flash.success);
            toast.success(flash.success);
        }
        if (flash?.error) {
            console.log('[FLASH] Error message:', flash.error);
            toast.error(flash.error);
        }
    }, [flash]);

    useEffect(() => {
        if (initialBatches) {
            console.log('[UPDATE] Batches updated:', initialBatches);
            console.log('[UPDATE] Active tab:', activeTab);

            // Always update all batch states from initialBatches
            setBatches(initialBatches.filter(batch => batch.status === 'submitted'));
            setPendingPaymentBatches(initialBatches.filter(batch => batch.status === 'approved'));
            setHistoryBatches(initialBatches.filter(batch => ['paid', 'rejected'].includes(batch.status)));

            console.log('[UPDATE] Filtered batches:', {
                approval: initialBatches.filter(batch => batch.status === 'submitted').length,
                pending_payment: initialBatches.filter(batch => batch.status === 'approved').length,
                history: initialBatches.filter(batch => ['paid', 'rejected'].includes(batch.status)).length
            });
        }
    }, [initialBatches]);

    useEffect(() => {
        console.log('[UPDATE] Initial employees updated:', initialEmployees);
        setEmployees(initialEmployees);
    }, [initialEmployees]);

    useEffect(() => {
        if (activeTab === 'riwayat') {
            setIsHistoryLoading(true);
            router.get(route('manajer-hrd.penggajian.proses'), { tab: 'riwayat', statuses: ['paid', 'rejected', 'finalized'] }, {
                preserveState: true,
                replace: true,
                onSuccess: (page) => {
                    setHistoryBatches((page.props as any).batches || []);
                    setIsHistoryLoading(false);
                },
                onError: (errors) => {
                    console.error('Error fetching history batches:', errors);
                    toast.error('Gagal memuat riwayat penggajian.');
                    setIsHistoryLoading(false);
                }
            });
        } else if (activeTab === 'pending_payment') {
            setIsPendingPaymentLoading(true);
            console.log('[TAB] Fetching pending payment batches with statuses: approved');
            router.get(route('manajer-hrd.penggajian.proses'), { tab: 'pending_payment', statuses: ['approved'] }, {
                preserveState: true,
                replace: true,
                onSuccess: (page) => {
                    console.log('[TAB] Pending payment batches received:', (page.props as any).batches);
                    setPendingPaymentBatches((page.props as any).batches || []);
                    setIsPendingPaymentLoading(false);
                },
                onError: (errors) => {
                    console.error('Error fetching pending payment batches:', errors);
                    toast.error('Gagal memuat data menunggu pembayaran.');
                    setIsPendingPaymentLoading(false);
                }
            });
        }
    }, [activeTab]);

    const handleStartPayrollProcess = (period: { value: string; label: string; }) => {
        console.log('[ACTION] Starting payroll process for period:', period);
        setShowEmployeeList(true);
        router.get(route('manajer-hrd.penggajian.proses'), { period: period.value }, {
            preserveState: true,
            replace: true,
            onStart: () => {
                console.log('[REQUEST] Fetching employees...');
                setIsDataLoading(true);
            },
            onFinish: () => {
                console.log('[REQUEST] Fetch complete');
                setIsDataLoading(false);
            },
            onSuccess: (page) => {
                console.log('[RESPONSE] Employees fetched successfully');
                console.log('[RESPONSE] Received employees:', page.props.employees);
                toast.success(`Data karyawan untuk periode ${period.label} berhasil dimuat.`);
            },
            onError: (errors) => {
                console.error('[RESPONSE] Failed to fetch employees:', errors);
                toast.error('Gagal memuat data karyawan', {
                    description: 'Silakan coba lagi atau hubungi administrator'
                });
            }
        });
    };

    const handleValidate = () => {
        const selectedEmps = employees.filter((e: Employee) => selectedEmployeeIds.has(e.id_karyawan));

        if (selectedEmps.length === 0) {
            toast.error('Tidak ada karyawan yang dipilih untuk divalidasi.');
            return;
        }

        console.log('[VALIDATE] Selected employees:', selectedEmps);

        // Simpan data karyawan yang akan divalidasi
        setValidatedEmployees(selectedEmps);

        // Kirim langsung via router.post, bukan useForm
        router.post(route('manajer-hrd.penggajian.proses.validate'),
            { employees: selectedEmps } as any,
            {
                preserveScroll: true,
                onStart: () => {
                    console.log('[VALIDATE] Sending', selectedEmps.length, 'employees to backend');
                },
                onSuccess: () => {
                    console.log('[VALIDATE] SUCCESS - Setting isValidated to TRUE');
                    setIsValidated(true);
                },
                onError: (errs: any) => {
                    console.error('[VALIDATE] ERROR:', errs);
                    setValidatedEmployees([]);
                    toast.error('Validasi Gagal', { description: 'Silakan periksa daftar kesalahan yang ditampilkan.' });
                }
            }
        );
    };

    const handleSubmitToFinance = () => {
        if (!isValidated) {
            toast.warning('Harap jalankan validasi terlebih dahulu.');
            return;
        }

        if (validatedEmployees.length === 0) {
            toast.error('Tidak ada data karyawan yang tervalidasi.');
            return;
        }

        console.log('[SUBMIT] Submitting', validatedEmployees.length, 'employees');

        setProcessing(true);

        router.post(route('api.payroll.submit'),
            {
                period: filters?.period || '',
                period_type: payrollStatus?.periode_pembayaran || 'bulanan',
                employees: validatedEmployees
            } as any,
            {
                onStart: () => {
                    console.log('[SUBMIT] Request started');
                },
                onSuccess: () => {
                    console.log('[SUBMIT] SUCCESS');
                    setActiveTab('approval');
                    setIsValidated(false);
                    setValidatedEmployees([]);
                    setSelectedEmployeeIds(new Set());
                    setShowEmployeeList(false);
                },
                onError: (errs: any) => {
                    console.error('[SUBMIT] ERROR:', errs);
                    toast.error('Gagal Mengirim Batch');
                },
                onFinish: () => {
                    setProcessing(false);
                }
            }
        );
    };

    const handleCancelBatch = (batch: Batch) => {
        if (!confirm(`Yakin ingin membatalkan batch ${batch.batch_code}? Semua karyawan akan dikembalikan ke Input Data Variabel.`)) {
            return;
        }

        console.log('[ACTION] Cancelling batch:', batch);
        setIsCancelling(true);

        router.post(route('api.payroll.cancel'),
            { type: 'batch', id: batch.id },
            {
                onStart: () => console.log('[REQUEST] Cancelling batch...'),
                onSuccess: (page) => {
                    console.log('[RESPONSE] Batch cancelled successfully:', page.props);
                    setIsCancelling(false);
                    setActiveTab('input');
                    setShowEmployeeList(true);
                },
                onError: (errors) => {
                    console.error('[RESPONSE] Failed to cancel batch:', errors);
                    toast.error('Gagal membatalkan batch');
                    setIsCancelling(false);
                },
                onFinish: () => {
                    setIsCancelling(false);
                }
            }
        );
    };

    const handleCancelItem = (batch: Batch, employee: Employee) => {
        if (!confirm(`Yakin ingin membatalkan pengajuan untuk ${employee.nama_lengkap}?`)) {
            return;
        }

        console.log('[ACTION] Cancelling item:', { batch, employee });
        setIsCancelling(true);

        router.post(route('api.payroll.cancel'),
            { type: 'item', id: employee.id },
            {
                onStart: () => console.log('[REQUEST] Cancelling item...'),
                onSuccess: (page) => {
                    console.log('[RESPONSE] Item cancelled successfully:', page.props);
                    setIsCancelling(false);
                    // Jika masih ada batch, tetap di tab approval
                    // Jika tidak ada batch, pindah ke input
                    const remainingBatches = (page.props as any).batches || [];
                    if (remainingBatches.length === 0) {
                        setActiveTab('input');
                    }
                    setShowEmployeeList(true);
                },
                onError: (errors) => {
                    console.error('[RESPONSE] Failed to cancel item:', errors);
                    toast.error('Gagal membatalkan pengajuan');
                    setIsCancelling(false);
                },
                onFinish: () => {
                    setIsCancelling(false);
                }
            }
        );
    };

    const handleSelectAll = () => {
        // Reset validasi hanya jika sudah pernah validasi
        if (isValidated) {
            setIsValidated(false);
            setValidatedEmployees([]);
        }

        if (selectedEmployeeIds.size === employees.length) {
            setSelectedEmployeeIds(new Set());
        } else {
            setSelectedEmployeeIds(new Set(employees.map((e: Employee) => e.id_karyawan)));
        }
    };

    const handleSelectEmployee = (id: number) => {
        // Reset validasi hanya jika sudah pernah validasi
        if (isValidated) {
            setIsValidated(false);
            setValidatedEmployees([]);
        }

        const newSelected = new Set(selectedEmployeeIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedEmployeeIds(newSelected);
    };

    const handleOpenDetail = (employee: Employee) => {
        console.log('[PROSES.TSX] Opening detail for employee:', employee);
        // Find the batch this employee belongs to to get paid_at
        const parentBatch = historyBatches.find(batch => batch.employees.some(e => e.id === employee.id));
        const employeeWithBatchPaidAt = {
            ...employee,
            batch_paid_at: parentBatch?.paid_at || undefined,
        };
        setDetailDialog({ open: true, employee: employeeWithBatchPaidAt });
    };

    const handleOpenKoreksi = (employee: Employee) => {
        setKoreksiDialog({ open: true, employee });
        setKoreksiType('penambahan');
        setKoreksiAmount('');
        setKoreksiNote('');
    };


    const handleSaveKoreksi = () => {
        if (!koreksiDialog.employee) return;

        const amount = parseFloat(koreksiAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Jumlah koreksi harus lebih dari 0');
            return;
        }

        const koreksiValue = koreksiType === 'penambahan' ? amount : -amount;
        const newTotalGaji = koreksiDialog.employee.gaji_pokok +
            koreksiDialog.employee.tunjangan +
            koreksiDialog.employee.upah_lembur -
            koreksiDialog.employee.potongan +
            koreksiValue;

        // Update the local 'employees' state
        const updatedEmployees = employees.map(emp => {
            if (emp.id_karyawan === koreksiDialog.employee!.id_karyawan) {
                return {
                    ...emp,
                    koreksi_gaji: koreksiValue,
                    catatan_koreksi: koreksiNote,
                    total_gaji: newTotalGaji
                };
            }
            return emp;
        });
        setEmployees(updatedEmployees);

        // Reset validation because data has changed
        if (isValidated) {
            setIsValidated(false);
            setValidatedEmployees([]); // Clear validated employees as their data might be stale
            toast.info('Silakan validasi ulang setelah koreksi');
        }

        setKoreksiDialog({ open: false, employee: null });
        toast.success('Koreksi gaji berhasil diterapkan. Silakan validasi ulang.');

        // NO router.reload() here. The changes are now in local 'employees' state.
        // These changes will be sent with handleValidate and handleSubmitToFinance.
    };


    const renderInputDataTab = () => {
        console.log('[PROSES.TSX] renderInputDataTab - payrollStatus:', payrollStatus);
        console.log('[PROSES.TSX] renderInputDataTab - employees:', employees);
        if (!payrollStatus) return <TableLoadingState text="Mengecek jadwal penggajian..." />;

        if (!payrollStatus.is_window_open) {
            return (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Calendar className="w-5 h-5 mr-2" />
                            Jadwal Penggajian
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EmptyState
                            icon={Clock}
                            title="Belum Waktunya Penggajian"
                            description={payrollStatus.message}
                        />
                    </CardContent>
                </Card>
            );
        }

        if (!showEmployeeList) {
            return (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <PlayCircle className="w-5 h-5 mr-2" />
                            Mulai Proses Penggajian
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4 pt-6">
                        {payrollStatus.open_periods.map((period: { value: string; label: string; is_missed: boolean }) => (
                            <Button
                                key={period.value}
                                size="lg"
                                onClick={() => handleStartPayrollProcess(period)}
                                variant={period.is_missed ? 'destructive' : 'secondary'}
                            >
                                {period.label}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            );
        }

        return (
            <Card>
                <CardHeader>
                    <CardTitle>Data Karyawan & Komponen Gaji</CardTitle>
                    <CardDescription>
                        Pilih karyawan dan submit ke departemen keuangan untuk periode{' '}
                        <span className="font-semibold text-primary">{filters?.period}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {errors && Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Ditemukan Kesalahan Validasi</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc list-inside space-y-1 mt-2">
                                    {Object.values(errors).map((error: any, idx) => (
                                        <li key={idx}>{String(error)}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <Input placeholder="Cari nama atau NIK..." />
                        </div>
                        <div className="flex gap-2">
                            {!isValidated ? (
                                <Button
                                    onClick={handleValidate}
                                    disabled={processing || selectedEmployeeIds.size === 0}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Memvalidasi...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="mr-2 h-4 w-4" />
                                            Validasi ({selectedEmployeeIds.size})
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmitToFinance}
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Submit ke Keuangan ({selectedEmployeeIds.size})
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                    {isDataLoading ? (
                        <TableLoadingState text="Memuat data karyawan..." />
                    ) : employees.length === 0 ? (
                        <EmptyState
                            icon={AlertCircle}
                            title="Tidak Ada Data"
                            description="Tidak ada karyawan untuk periode ini"
                        />
                    ) : (
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectedEmployeeIds.size === employees.length && employees.length > 0}
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Departemen</TableHead>
                                        <TableHead className="text-right">Gaji Pokok</TableHead>
                                        <TableHead className="text-right">Tunjangan</TableHead>
                                        <TableHead className="text-right">Potongan</TableHead>
                                        <TableHead className="text-right">Lembur</TableHead>
                                        <TableHead className="text-right">Total Gaji</TableHead>
                                        <TableHead className="text-right">Koreksi</TableHead>
                                        <TableHead className="text-center">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employees.map((employee: Employee) => (
                                        <TableRow key={employee.id_karyawan}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedEmployeeIds.has(employee.id_karyawan)}
                                                    onCheckedChange={() => handleSelectEmployee(employee.id_karyawan)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{employee.nama_lengkap}</TableCell>
                                            <TableCell>{employee.departemen}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(employee.gaji_pokok)}</TableCell>
                                            <TableCell className="text-right text-green-600">{formatCurrency(employee.tunjangan)}</TableCell>
                                            <TableCell className="text-right text-red-600">{formatCurrency(employee.potongan)}</TableCell>
                                            <TableCell className="text-right text-blue-600">{formatCurrency(employee.upah_lembur)}</TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {formatCurrency(employee.total_gaji)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {employee.koreksi_gaji !== 0 ? (
                                                    <div className="flex flex-col items-end">
                                                        <span className={employee.koreksi_gaji > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                                            {employee.koreksi_gaji > 0 ? '+' : ''}{formatCurrency(employee.koreksi_gaji)}
                                                        </span>
                                                        {employee.catatan_koreksi && (
                                                            <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={employee.catatan_koreksi}>
                                                                {employee.catatan_koreksi}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex gap-1 justify-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenDetail(employee)}
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenKoreksi(employee)}
                                                        title="Koreksi Gaji"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    const renderApprovalTab = () => {
        if (batches.length === 0) {
            return (
                <Card>
                    <CardHeader>
                        <CardTitle>Persetujuan Keuangan</CardTitle>
                        <CardDescription>Tidak ada batch yang menunggu persetujuan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EmptyState
                            icon={Clock}
                            title="Tidak Ada Batch"
                            description="Belum ada batch yang disubmit untuk persetujuan"
                        />
                    </CardContent>
                </Card>
            );
        }

        return (
            <div className="space-y-4">
                {batches.map((batch) => (
                    <Card key={batch.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        {batch.batch_code}
                                        <Badge variant={batch.status === 'submitted' ? 'secondary' : 'default'}>
                                            {batch.status}
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription>
                                        Diajukan oleh: {batch.submitted_by} pada {batch.submitted_at}
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleCancelBatch(batch)}
                                    disabled={isCancelling}
                                >
                                    {isCancelling ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel Batch
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Departemen</TableHead>
                                        <TableHead className="text-right">Gaji Pokok</TableHead>
                                        <TableHead className="text-right">Tunjangan</TableHead>
                                        <TableHead className="text-right">Potongan</TableHead>
                                        <TableHead className="text-right">Lembur</TableHead>
                                        <TableHead className="text-right">Total Gaji</TableHead>
                                        <TableHead className="text-right">Koreksi</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {batch.employees.map((employee) => (
                                        <TableRow key={employee.id}>
                                            <TableCell className="font-medium">{employee.nama_lengkap}</TableCell>
                                            <TableCell>{employee.departemen}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(employee.gaji_pokok)}</TableCell>
                                            <TableCell className="text-right text-green-600">{formatCurrency(employee.tunjangan)}</TableCell>
                                            <TableCell className="text-right text-red-600">{formatCurrency(employee.potongan)}</TableCell>
                                            <TableCell className="text-right text-blue-600">{formatCurrency(employee.upah_lembur)}</TableCell>
                                            <TableCell className="text-right font-semibold">{formatCurrency(employee.total_gaji)}</TableCell>
                                            <TableCell className="text-right">
                                                {employee.koreksi_gaji !== 0 ? (
                                                    <div className="flex flex-col items-end">
                                                        <span className={employee.koreksi_gaji > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                                            {employee.koreksi_gaji > 0 ? '+' : ''}{formatCurrency(employee.koreksi_gaji)}
                                                        </span>
                                                        {employee.catatan_koreksi && (
                                                            <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={employee.catatan_koreksi}>
                                                                {employee.catatan_koreksi}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {employee.status === 'approved' && <Badge variant="default">Disetujui</Badge>}
                                                {employee.status === 'rejected' && <Badge variant="destructive">Ditolak</Badge>}
                                                {employee.status === 'submitted' && <Badge variant="secondary">Menunggu</Badge>}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenDetail(employee)}
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {employee.status !== 'approved' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleCancelItem(batch, employee)}
                                                            disabled={isCancelling}
                                                            title="Cancel"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    const renderRiwayatTab = () => {
        console.log('[PROSES.TSX] renderRiwayatTab - historyBatches:', historyBatches);
        if (isHistoryLoading) {
            return <TableLoadingState text="Memuat riwayat penggajian..." />;
        }

        if (historyBatches.length === 0) {
            return (
                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Penggajian</CardTitle>
                        <CardDescription>Tidak ada riwayat penggajian yang tersedia.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EmptyState
                            icon={Clock}
                            title="Tidak Ada Riwayat"
                            description="Belum ada batch penggajian yang disetujui atau dibayar."
                        />
                    </CardContent>
                </Card>
            );
        }

        return (
            <div className="space-y-4">
                {historyBatches.map((batch) => (
                    <Card key={batch.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        {batch.batch_code}
                                        <Badge variant={batch.status === 'approved' ? 'default' : 'success'}>
                                            {batch.status}
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription>
                                        Diajukan oleh: {batch.submitted_by} pada {formatLocalDateTime(batch.submitted_at)} <br />
                                        Disetujui oleh: {batch.approved_by} pada {formatLocalDateTime(batch.approved_at)} <br />
                                        {batch.paid_at && <>Dibayarkan pada: {formatLocalDateTime(batch.paid_at)}</>} <br />
                                        Metode Pembayaran: <span className="font-semibold capitalize">{batch.metode_pembayaran || 'N/A'}</span>
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Departemen</TableHead>
                                        <TableHead className="text-right">Gaji Pokok</TableHead>
                                        <TableHead className="text-right">Tunjangan</TableHead>
                                        <TableHead className="text-right">Potongan</TableHead>
                                        <TableHead className="text-right">Lembur</TableHead>
                                        <TableHead className="text-right">Koreksi</TableHead>
                                        <TableHead className="text-right">Total Gaji</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {batch.employees.map((employee) => (
                                        <TableRow key={employee.id}>
                                            <TableCell className="font-medium">{employee.nama_lengkap}</TableCell>
                                            <TableCell>{employee.departemen}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(employee.gaji_pokok)}</TableCell>
                                            <TableCell className="text-right text-green-600">{formatCurrency(employee.tunjangan)}</TableCell>
                                            <TableCell className="text-right text-red-600">{formatCurrency(employee.potongan)}</TableCell>
                                            <TableCell className="text-right text-blue-600">{formatCurrency(employee.upah_lembur)}</TableCell>
                                            <TableCell className="text-right">
                                                {employee.koreksi_gaji !== 0 ? (
                                                    <div className="flex flex-col items-end">
                                                        <span className={employee.koreksi_gaji > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                                            {employee.koreksi_gaji > 0 ? '+' : ''}{formatCurrency(employee.koreksi_gaji)}
                                                        </span>
                                                        {employee.catatan_koreksi && (
                                                            <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={employee.catatan_koreksi}>
                                                                {employee.catatan_koreksi}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">{formatCurrency(employee.total_gaji)}</TableCell>
                                            <TableCell className="text-center">
                                                {employee.status === 'approved' && <Badge variant="default">Disetujui</Badge>}
                                                {employee.status === 'rejected' && <Badge variant="destructive">Ditolak</Badge>}
                                                {employee.status === 'finalized' && <Badge variant="secondary">Difinalisasi</Badge>}
                                                {employee.status === 'paid' && <Badge variant="success">Dibayar</Badge>}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenDetail(employee)}
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    const renderPendingPaymentHrdTab = () => {
        if (isPendingPaymentLoading) {
            return <TableLoadingState text="Memuat data menunggu pembayaran..." />;
        }

        if (pendingPaymentBatches.length === 0) {
            return (
                <Card>
                    <CardHeader>
                        <CardTitle>Menunggu Pembayaran</CardTitle>
                        <CardDescription>Tidak ada batch penggajian yang menunggu pembayaran.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EmptyState
                            icon={Clock}
                            title="Tidak Ada Batch"
                            description="Belum ada batch penggajian yang difinalisasi dan menunggu pembayaran."
                        />
                    </CardContent>
                </Card>
            );
        }

        return (
            <div className="space-y-4">
                {pendingPaymentBatches.map((batch) => (
                    <Card key={batch.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        {batch.batch_code}
                                        <Badge variant="default">
                                            Disetujui - Menunggu Pembayaran
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription>
                                        Diajukan oleh: {batch.submitted_by} pada {batch.submitted_at} <br />
                                        Disetujui oleh: {batch.approved_by} pada {batch.approved_at}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {batch.employees && batch.employees.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Departemen</TableHead>
                                            <TableHead className="text-right">Gaji Pokok</TableHead>
                                            <TableHead className="text-right">Tunjangan</TableHead>
                                            <TableHead className="text-right">Potongan</TableHead>
                                            <TableHead className="text-right">Lembur</TableHead>
                                            <TableHead className="text-right">Koreksi</TableHead>
                                            <TableHead className="text-right">Total Gaji</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {batch.employees.map((employee) => (
                                            <TableRow key={employee.id}>
                                                <TableCell className="font-medium">{employee.nama_lengkap}</TableCell>
                                                <TableCell>{employee.departemen}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(employee.gaji_pokok)}</TableCell>
                                                <TableCell className="text-right text-green-600">{formatCurrency(employee.tunjangan)}</TableCell>
                                                <TableCell className="text-right text-red-600">{formatCurrency(employee.potongan)}</TableCell>
                                                <TableCell className="text-right text-blue-600">{formatCurrency(employee.upah_lembur)}</TableCell>
                                                <TableCell className="text-right">
                                                    {employee.koreksi_gaji !== 0 ? (
                                                        <div className="flex flex-col items-end">
                                                            <span className={employee.koreksi_gaji > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                                                {employee.koreksi_gaji > 0 ? '+' : ''}{formatCurrency(employee.koreksi_gaji)}
                                                            </span>
                                                            {employee.catatan_koreksi && (
                                                                <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={employee.catatan_koreksi}>
                                                                    {employee.catatan_koreksi}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">{formatCurrency(employee.total_gaji)}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="default">Disetujui</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex gap-1 justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleOpenDetail(employee)}
                                                            title="Lihat Detail"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <EmptyState
                                    icon={AlertCircle}
                                    title="Tidak Ada Data Karyawan"
                                    description="Batch ini tidak memiliki data karyawan."
                                />
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <AuthenticatedLayout title="Proses Penggajian">
            <Head title="Proses Penggajian" />
            <div className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="input">Input Data Variabel</TabsTrigger>
                        <TabsTrigger value="approval">
                            Persetujuan Keuangan
                            {batches.length > 0 && (
                                <Badge variant="destructive" className="ml-2">{batches.length}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="pending_payment">
                            Menunggu Pembayaran
                            {pendingPaymentBatches.length > 0 && (
                                <Badge variant="secondary" className="ml-2">{pendingPaymentBatches.length}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="riwayat">Selesai</TabsTrigger>
                    </TabsList>
                    <TabsContent value="input">{renderInputDataTab()}</TabsContent>
                    <TabsContent value="approval">{renderApprovalTab()}</TabsContent>
                    <TabsContent value="pending_payment">{renderPendingPaymentHrdTab()}</TabsContent>
                    <TabsContent value="riwayat">{renderRiwayatTab()}</TabsContent>
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
                                {/* NEW FIELDS START */}
                                <div>
                                    <Label className="text-sm text-muted-foreground">Jabatan</Label>
                                    <p className="font-medium">{detailDialog.employee.jabatan}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Bagian Kerja</Label>
                                    <p className="font-medium">{detailDialog.employee.bagian_kerja}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Senioritas</Label>
                                    <p className="font-medium">{detailDialog.employee.senioritas}</p>
                                </div>
                                {/* NEW FIELDS END */}
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

            {/* Dialog Koreksi Gaji */}
            <Dialog open={koreksiDialog.open} onOpenChange={(open) => setKoreksiDialog({ open, employee: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Koreksi Gaji</DialogTitle>
                        <DialogDescription>
                            {koreksiDialog.employee?.nama_lengkap}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Tipe Koreksi</Label>
                            <RadioGroup value={koreksiType} onValueChange={(value: any) => setKoreksiType(value)}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="penambahan" id="penambahan" />
                                    <Label htmlFor="penambahan" className="font-normal cursor-pointer">
                                        Penambahan (Bonus, Insentif, dll)
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="pengurangan" id="pengurangan" />
                                    <Label htmlFor="pengurangan" className="font-normal cursor-pointer">
                                        Pengurangan (Denda, Sanksi, dll)
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div>
                            <Label htmlFor="amount">Jumlah (Rp)</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0"
                                value={koreksiAmount}
                                onChange={(e) => setKoreksiAmount(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="note">Catatan</Label>
                            <Textarea
                                id="note"
                                placeholder="Alasan koreksi..."
                                value={koreksiNote}
                                onChange={(e) => setKoreksiNote(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {koreksiDialog.employee && (
                            <div className="bg-muted p-3 rounded-lg">
                                <div className="text-sm space-y-1">
                                    <div className="flex justify-between">
                                        <span>Total Gaji Saat Ini:</span>
                                        <span className="font-medium">{formatCurrency(koreksiDialog.employee.total_gaji)}</span>
                                    </div>
                                    {koreksiAmount && !isNaN(parseFloat(koreksiAmount)) && (
                                        <>
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Koreksi:</span>
                                                <span className={koreksiType === 'penambahan' ? 'text-green-600' : 'text-red-600'}>
                                                    {koreksiType === 'penambahan' ? '+ ' : '- '}
                                                    {formatCurrency(parseFloat(koreksiAmount))}
                                                </span>
                                            </div>
                                            <div className="flex justify-between font-bold pt-2 border-t">
                                                <span>Total Setelah Koreksi:</span>
                                                <span>
                                                    {formatCurrency(
                                                        koreksiDialog.employee.total_gaji +
                                                        (koreksiType === 'penambahan' ? parseFloat(koreksiAmount) : -parseFloat(koreksiAmount))
                                                    )}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setKoreksiDialog({ open: false, employee: null })}>
                            Batal
                        </Button>
                        <Button onClick={handleSaveKoreksi}>
                            Simpan Koreksi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
