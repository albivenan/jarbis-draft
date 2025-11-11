import { default as AuthenticatedLayout } from '@/layouts/authenticated-layout';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, Building2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const DetailItem = ({ label, value, isTotal = false, className = '' }: { label: string; value: string | number; isTotal?: boolean; className?: string }) => (
    <div className={cn("flex justify-between py-2", isTotal && "font-bold text-lg border-t-2 border-gray-300 mt-2 pt-3", className)}>
        <span className={cn(isTotal ? "text-foreground" : "text-muted-foreground")}>{label}</span>
        <span className={isTotal ? "text-blue-600" : ""}>{value}</span>
    </div>
);

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount || 0);
};

const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

export default function SlipGajiShow() {
    const { payslip } = usePage().props as any;

    const earnings = {
        gaji_pokok: parseFloat(payslip.gaji_pokok || 0),
        tunjangan: parseFloat(payslip.tunjangan || 0),
        upah_lembur: parseFloat(payslip.upah_lembur || 0),
    };

    const deductions = {
        potongan: parseFloat(payslip.potongan || 0),
    };

    const totalEarnings = Object.values(earnings).reduce((sum, a) => sum + a, 0);
    const totalDeductions = Object.values(deductions).reduce((sum, a) => sum + a, 0);
    const finalCorrection = parseFloat(payslip.koreksi_gaji || 0);
    const netSalary = parseFloat(payslip.total_gaji || (totalEarnings - totalDeductions + finalCorrection));

    return (
        <AuthenticatedLayout title="Detail Slip Gaji">
            <Head title={`Slip Gaji - ${payslip.batch?.period}`} />
            
            {/* Watermark for Print */}
            <div className="print:block fixed inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
                <div className="text-9xl font-bold text-gray-400 rotate-45">CONFIDENTIAL</div>
            </div>

            <div className="py-6 print:py-0 relative z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-4 print:hidden">
                        <Button variant="outline" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    </div>

                    <Card className="print:shadow-none print:border-2 print:border-gray-300">
                        {/* Company Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 print:bg-white print:text-gray-900 print:border-b-4 print:border-blue-600">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="hidden print:block bg-blue-600 p-3 rounded-lg">
                                        <Building2 className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold">PT. JARBIS INDONESIA</h1>
                                        <p className="text-sm opacity-90 print:text-gray-600">Jl. Raya Industri Cikarang No. 123, Bekasi 17530</p>
                                        <p className="text-sm opacity-90 print:text-gray-600">Telp: (021) 8888-9999 | Email: hrd@jarbis.co.id</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="bg-white text-blue-600 px-4 py-2 rounded-lg print:bg-blue-600 print:text-white">
                                        <p className="text-xs font-semibold">SLIP GAJI</p>
                                        <p className="text-lg font-bold">{payslip.batch?.period}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <CardContent className="pt-6">
                            {/* Employee Information */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Informasi Karyawan</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Nama Lengkap</p>
                                        <p className="font-semibold">{payslip.karyawan?.user?.name || payslip.karyawan?.nama_lengkap || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">NIK Karyawan</p>
                                        <p className="font-semibold">{payslip.karyawan?.nik_perusahaan || payslip.id_karyawan || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Departemen</p>
                                        <p className="font-semibold">{payslip.karyawan?.rincianPekerjaan?.departemen?.nama_departemen || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Jabatan</p>
                                        <p className="font-semibold">{payslip.karyawan?.rincianPekerjaan?.jabatan?.nama_jabatan || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Status</p>
                                        <p className="font-semibold">{payslip.karyawan?.rincianPekerjaan?.status_karyawan || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Periode Gaji</p>
                                        <p className="font-semibold">{payslip.batch?.period || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Attendance Summary */}
                            {payslip.attendance_summary && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Ringkasan Kehadiran</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-center">
                                            <p className="text-xs text-green-600 font-medium">Hadir</p>
                                            <p className="text-2xl font-bold text-green-700">{payslip.attendance_summary.hadir || 0}</p>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-center">
                                            <p className="text-xs text-blue-600 font-medium">Lembur (Jam)</p>
                                            <p className="text-2xl font-bold text-blue-700">{payslip.attendance_summary.total_jam_lembur || 0}</p>
                                        </div>
                                        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg text-center">
                                            <p className="text-xs text-orange-600 font-medium">Terlambat (Menit)</p>
                                            <p className="text-2xl font-bold text-orange-700">{payslip.attendance_summary.total_menit_terlambat || 0}</p>
                                        </div>
                                        <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-center">
                                            <p className="text-xs text-red-600 font-medium">Alpa</p>
                                            <p className="text-2xl font-bold text-red-700">{payslip.attendance_summary.alpa || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Separator className="my-6" />

                            {/* Earnings and Deductions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Earnings */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-1 w-8 bg-green-600 rounded"></div>
                                        <h3 className="text-lg font-bold text-green-700">PENDAPATAN</h3>
                                    </div>
                                    <div className="space-y-1">
                                        <DetailItem label="Gaji Pokok" value={formatCurrency(earnings.gaji_pokok)} />
                                        <DetailItem label="Tunjangan" value={formatCurrency(earnings.tunjangan)} />
                                        <DetailItem label="Upah Lembur" value={formatCurrency(earnings.upah_lembur)} />
                                        <DetailItem label="TOTAL PENDAPATAN" value={formatCurrency(totalEarnings)} isTotal />
                                    </div>
                                </div>

                                {/* Deductions */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-1 w-8 bg-red-600 rounded"></div>
                                        <h3 className="text-lg font-bold text-red-700">POTONGAN</h3>
                                    </div>
                                    <div className="space-y-1">
                                        <DetailItem label="Total Potongan" value={formatCurrency(deductions.potongan)} />
                                        <DetailItem label="TOTAL POTONGAN" value={formatCurrency(totalDeductions)} isTotal />
                                    </div>
                                </div>
                            </div>

                            {/* Corrections */}
                            {(finalCorrection !== 0 || payslip.catatan_koreksi) && (
                                <>
                                    <Separator className="my-6" />
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="h-1 w-8 bg-blue-600 rounded"></div>
                                            <h3 className="text-lg font-bold text-blue-700">KOREKSI</h3>
                                        </div>
                                        <DetailItem 
                                            label="Koreksi Gaji" 
                                            value={formatCurrency(finalCorrection)} 
                                            className={finalCorrection > 0 ? "text-green-600" : finalCorrection < 0 ? "text-red-600" : ""}
                                        />
                                        {payslip.catatan_koreksi && (
                                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <p className="text-xs text-blue-600 font-medium mb-1">Catatan:</p>
                                                <p className="text-sm text-blue-900">{payslip.catatan_koreksi}</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </CardContent>

                        {/* Net Salary Footer */}
                        <CardFooter className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 print:bg-blue-600">
                            <div className="w-full">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm opacity-90">GAJI BERSIH</p>
                                        <p className="text-xs opacity-75">(Take Home Pay)</p>
                                    </div>
                                    <p className="text-3xl font-bold">{formatCurrency(netSalary)}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-75">
                                    <p>Terbilang: <span className="font-semibold">{/* TODO: Add number to words */}</span></p>
                                </div>
                            </div>
                        </CardFooter>

                        {/* Signatures */}
                        <div className="p-6 print:p-8">
                            <div className="grid grid-cols-2 gap-8 text-center text-sm">
                                <div>
                                    <p className="text-gray-600 mb-16">Disetujui oleh,</p>
                                    <div className="border-t-2 border-gray-300 pt-2">
                                        <p className="font-bold">Manajer HRD</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-600 mb-16">Diterima oleh,</p>
                                    <div className="border-t-2 border-gray-300 pt-2">
                                        <p className="font-bold">{payslip.karyawan?.user?.name || 'Karyawan'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-8 text-xs text-gray-500">
                                <p>Dokumen ini dibuat secara elektronik dan sah tanpa tanda tangan basah</p>
                                <p className="mt-1">Dicetak pada: {formatDate(new Date().toISOString())}</p>
                            </div>
                        </div>

                        {/* Print Button */}
                        <div className="p-4 bg-gray-50 print:hidden flex justify-center">
                            <Button onClick={() => window.print()} size="lg" className="gap-2">
                                <Printer className="h-5 w-5" />
                                Cetak Slip Gaji
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 1cm;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:block {
                        display: block !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    .print\\:border-2 {
                        border-width: 2px !important;
                    }
                    .print\\:border-gray-300 {
                        border-color: #d1d5db !important;
                    }
                    .print\\:py-0 {
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                    }
                    .print\\:p-8 {
                        padding: 2rem !important;
                    }
                    .print\\:bg-white {
                        background-color: white !important;
                    }
                    .print\\:text-gray-900 {
                        color: #111827 !important;
                    }
                    .print\\:border-b-4 {
                        border-bottom-width: 4px !important;
                    }
                    .print\\:border-blue-600 {
                        border-color: #2563eb !important;
                    }
                    .print\\:bg-blue-600 {
                        background-color: #2563eb !important;
                    }
                    .print\\:text-white {
                        color: white !important;
                    }
                    main {
                        padding: 0 !important;
                    }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
