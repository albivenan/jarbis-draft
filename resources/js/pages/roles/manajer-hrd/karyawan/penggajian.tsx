import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
    DollarSign, Settings, Download, Search, Calendar, AlertTriangle, 
    CheckCircle, Eye, Users, Calculator, Lock, RefreshCw 
} from 'lucide-react';

// --- TYPES ---
interface AttendanceSummary {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
    terlambat: number;
    total_jam_kerja_normal: number;
    total_jam_lembur: number;
    total_menit_terlambat: number;
}

interface PayrollData {
    id_karyawan: number;
    nik_perusahaan: string;
    nama_lengkap: string;
    departemen: string;
    jabatan: string;
    gaji_pokok: number;      // from backend
    tunjangan: number;       // from backend
    potongan: number;        // from backend
    upah_lembur: number;     // from backend
    total_gaji: number;      // from backend
    attendance_summary: AttendanceSummary;
}

interface PayrollBatch {
    // Define batch structure if needed later
}

export default function PenggajianHRD() {
    const { toast } = useToast();
    const [selectedPeriod, setSelectedPeriod] = useState(new Date().toISOString().slice(0, 7));
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('processing');
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<PayrollData | null>(null);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [isValidated, setIsValidated] = useState(false);
    const [payrollData, setPayrollData] = useState<PayrollData[]>([]);
    const [submittedBatches, setSubmittedBatches] = useState<PayrollBatch[]>([]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Fetch employees from API - Now trusts the backend for all calculations
    const fetchEmployees = async () => {
        setIsLoading(true);
        setIsValidated(false); // Reset validation status on refresh
        try {
            const [year, month] = selectedPeriod.split('-');
            
            const response = await fetch(`/api/hrd/payroll/employees?month=${month}&year=${year}`);

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Gagal memuat data karyawan');
            }

            // Data from backend is now the source of truth.
            // No more client-side calculations.
            setPayrollData(result.data);
            
            toast({
                title: 'Berhasil',
                description: `Data ${result.data.length} karyawan berhasil dimuat`,
                variant: 'success'
            });

        } catch (error: any) {
            console.error('Error fetching employees:', error);
            toast({
                title: 'Error',
                description: error.message || 'Gagal memuat data karyawan',
                variant: 'destructive'
            });
            setPayrollData([]);
        } finally {
            setIsLoading(false);
            setLastRefresh(new Date());
        }
    };

    // Fetch employees on component mount and when period changes
    useEffect(() => {
        fetchEmployees();
    }, [selectedPeriod]);

    // Validate payroll data
    const handleValidate = async () => {
        if (payrollData.length === 0) {
            toast({ title: 'Peringatan', description: 'Tidak ada data untuk divalidasi', variant: 'warning' });
            return false;
        }

        setIsValidating(true);
        try {
            const response = await fetch('/api/hrd/payroll/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ employees: payrollData })
            });

            const result = await response.json();

            if (!result.success) {
                const errorMessage = result.errors?.join('\n') || result.message || 'Validasi gagal';
                toast({ title: 'Validasi Gagal', description: errorMessage, variant: 'destructive' });
                setIsValidated(false);
                return false;
            }

            toast({ title: 'Validasi Berhasil', description: result.message, variant: 'success' });
            setIsValidated(true);
            return true;

        } catch (error: any) {
            console.error('Error validating payroll:', error);
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
            setIsValidated(false);
            return false;
        } finally {
            setIsValidating(false);
        }
    };

    // Submit payroll batch to finance
    const handleSubmitToFinance = async () => {
        if (!isValidated) {
            const validationResult = await handleValidate();
            if (!validationResult) return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/hrd/payroll/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    period: selectedPeriod,
                    period_type: 'bulanan', // Assuming monthly for now
                    employees: payrollData
                })
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Gagal submit batch penggajian');
            }

            toast({ title: 'Berhasil', description: result.message, variant: 'success' });
            // Potentially refresh data or move to a different view
            fetchEmployees(); 

        } catch (error: any) {
            console.error('Error submitting payroll:', error);
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const payrollSummary = {
        totalEmployees: payrollData.length,
        totalGajiPokok: payrollData.reduce((sum, data) => sum + data.gaji_pokok, 0),
        totalUpahLembur: payrollData.reduce((sum, data) => sum + data.upah_lembur, 0),
        totalTunjangan: payrollData.reduce((sum, data) => sum + data.tunjangan, 0),
        totalPotongan: payrollData.reduce((sum, data) => sum + data.potongan, 0),
        totalGajiBersih: payrollData.reduce((sum, data) => sum + data.total_gaji, 0),
    };

    return (
        <AuthenticatedLayout
            title="Proses Penggajian"
            breadcrumbs={[
                { title: 'Dashboard', href: '/roles/manajer-hrd' },
                { title: 'Karyawan', href: '#' },
                { title: 'Penggajian', href: route('manajer-hrd.karyawan.penggajian') }
            ]}
        >
            <Head title="Proses Penggajian - Manajer HRD" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Proses Penggajian</h1>
                        <p className="text-gray-600 mt-2">Lakukan validasi, kalkulasi, dan submit gaji karyawan.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                <SelectTrigger className="w-48 border-0 bg-transparent focus:ring-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* Generate last 12 months for selection */}
                                    {[...Array(12)].map((_, i) => {
                                        const d = new Date();
                                        d.setMonth(d.getMonth() - i);
                                        const periodValue = d.toISOString().slice(0, 7);
                                        return <SelectItem key={periodValue} value={periodValue}>{periodValue}</SelectItem>;
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline" size="sm" onClick={fetchEmployees} disabled={isLoading}>
                            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh Data
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card><CardHeader><CardTitle>Total Karyawan</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{payrollSummary.totalEmployees}</p></CardContent></Card>
                    <Card><CardHeader><CardTitle>Total Gaji Pokok</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatCurrency(payrollSummary.totalGajiPokok)}</p></CardContent></Card>
                    <Card><CardHeader><CardTitle>Total Lembur</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatCurrency(payrollSummary.totalUpahLembur)}</p></CardContent></Card>
                    <Card><CardHeader><CardTitle>Total Tunjangan</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatCurrency(payrollSummary.totalTunjangan)}</p></CardContent></Card>
                    <Card><CardHeader><CardTitle>Total Gaji Bersih</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{formatCurrency(payrollSummary.totalGajiBersih)}</p></CardContent></Card>
                </div>

                {/* Main Action Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Gaji Karyawan - Periode {selectedPeriod}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left py-3 px-4">Karyawan</th>
                                        <th className="text-left py-3 px-4">Gaji Pokok</th>
                                        <th className="text-left py-3 px-4">Lembur</th>
                                        <th className="text-left py-3 px-4">Tunjangan</th>
                                        <th className="text-left py-3 px-4">Potongan</th>
                                        <th className="text-left py-3 px-4">Gaji Bersih</th>
                                        <th className="text-left py-3 px-4">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan={7} className="text-center py-8">Memuat data...</td></tr>
                                    ) : payrollData.length === 0 ? (
                                        <tr><td colSpan={7} className="text-center py-8">Tidak ada data untuk periode ini.</td></tr>
                                    ) : (
                                        payrollData.map((emp) => (
                                            <tr key={emp.id_karyawan} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium">{emp.nama_lengkap}</div>
                                                    <div className="text-sm text-gray-500">{emp.nik_perusahaan} - {emp.departemen}</div>
                                                </td>
                                                <td className="py-3 px-4">{formatCurrency(emp.gaji_pokok)}</td>
                                                <td className="py-3 px-4">{formatCurrency(emp.upah_lembur)}</td>
                                                <td className="py-3 px-4 text-green-600">{formatCurrency(emp.tunjangan)}</td>
                                                <td className="py-3 px-4 text-red-600">{formatCurrency(emp.potongan)}</td>
                                                <td className="py-3 px-4 font-bold">{formatCurrency(emp.total_gaji)}</td>
                                                <td className="py-3 px-4">
                                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedEmployee(emp); setShowDetailDialog(true); }} title="Lihat Detail">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <Button variant="outline" onClick={handleValidate} disabled={isLoading || isValidating || payrollData.length === 0}>
                                {isValidating ? 'Memvalidasi...' : 'Validasi Data'}
                            </Button>
                            <Button onClick={handleSubmitToFinance} disabled={isLoading || isSubmitting || !isValidated}>
                                {isSubmitting ? 'Mensubmit...' : 'Submit ke Keuangan'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detail Gaji Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Detail Gaji - {selectedEmployee?.nama_lengkap}</DialogTitle>
                                </DialogHeader>
                                {selectedEmployee && (
                                  <div className="space-y-4">
                                    {console.log('DEBUG: Data for Detail Dialog:', selectedEmployee)}                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Gaji Bersih</p>
                                        <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedEmployee.total_gaji)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Periode</p>
                                        <p className="font-medium">{selectedPeriod}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold">Rincian:</h4>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Gaji Pokok</span><span>{formatCurrency(selectedEmployee.gaji_pokok)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Upah Lembur</span><span className="text-blue-500">+ {formatCurrency(selectedEmployee.upah_lembur)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Tunjangan</span><span className="text-green-500">+ {formatCurrency(selectedEmployee.tunjangan)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Potongan</span><span className="text-red-500">- {formatCurrency(selectedEmployee.potongan)}</span></div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h4 className="font-semibold">Ringkasan Kehadiran:</h4>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Hari Hadir</span><span>{selectedEmployee.attendance_summary.hadir} hari</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Hari Terlambat</span><span>{selectedEmployee.attendance_summary.terlambat} hari</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Total Jam Kerja</span><span>{selectedEmployee.attendance_summary.total_jam_kerja_normal} jam</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Total Jam Lembur</span><span>{selectedEmployee.attendance_summary.total_jam_lembur} jam</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Total Menit Terlambat</span><span>{selectedEmployee.attendance_summary.total_menit_terlambat} menit</span></div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button variant="outline" onClick={() => setShowDetailDialog(false)}>Tutup</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </AuthenticatedLayout>
    );
}
