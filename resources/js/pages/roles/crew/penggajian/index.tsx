import { default as AuthenticatedLayout } from '@/layouts/authenticated-layout';
import { Head, usePage } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Banknote, Landmark, List, Pencil, User, Download, FileText, Calendar, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PenggajianIndex() {
    const { bankAccount, payslipHistory } = usePage().props as any;

    const latestPayslip = payslipHistory && payslipHistory.length > 0 ? payslipHistory[0] : null;

    const InfoItem = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color?: string }) => (
        <div className="flex items-center gap-4 p-4">
            <Icon className={cn("h-8 w-8 text-muted-foreground", color)} />
            <div className="flex-1">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-semibold text-lg">{value || '-'}</p>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout title="Penggajian">
            <Head title="Penggajian" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {latestPayslip && (
                        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Gaji Terbaru</span>
                                    <Badge variant="secondary">Periode {latestPayslip.batch?.period}</Badge>
                                </CardTitle>
                                <CardDescription className="text-blue-200">Ringkasan slip gaji terakhir Anda.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <div className="text-4xl font-bold">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(latestPayslip.total_gaji)}
                                </div>
                                <Button variant="secondary" asChild>
                                    <a href={`/crew/payroll/print/${latestPayslip.id}`} target="_blank">
                                        <Download className="h-4 w-4 mr-2" />
                                        Unduh Slip
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <Tabs defaultValue="slip-gaji" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="slip-gaji">Riwayat Slip Gaji</TabsTrigger>
                            <TabsTrigger value="rekening-bank">Rekening Bank</TabsTrigger>
                        </TabsList>

                        <TabsContent value="slip-gaji" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Riwayat Penggajian</CardTitle>
                                    <CardDescription>Berikut adalah daftar slip gaji Anda sebelumnya.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {payslipHistory && payslipHistory.length > 0 ? (
                                            payslipHistory.map((slip: any) => (
                                                <div key={slip.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-gray-100 p-3 rounded-lg">
                                                            <Calendar className="h-5 w-5 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">Periode {slip.batch?.period}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Status: <Badge variant={slip.status === 'disetujui' ? 'default' : 'destructive'} className="capitalize">{slip.status}</Badge>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex items-center gap-2">
                                                        <p className="font-bold text-md text-gray-800">
                                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(slip.total_gaji)}
                                                        </p>
                                                        <Button variant="outline" size="sm" asChild disabled={!slip.batch?.period}>
                                                            <a href={slip.batch?.period ? route(`${((usePage().props.auth as any).user.role).replace('_', '-')}.penggajian.slip.show`, { batchName: slip.batch.period }) : '#'}>
                                                                Lihat Rincian
                                                            </a>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" asChild disabled={!slip.batch?.period}>
                                                             <a href={slip.batch?.period ? route(`${((usePage().props.auth as any).user.role).replace('_', '-')}.penggajian.slip.show`, { batchName: slip.batch.period }) : '#'} target="_blank">
                                                                <FileText className="h-4 w-4 text-gray-600" />
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-muted-foreground">Tidak ada riwayat slip gaji.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="rekening-bank" className="mt-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Informasi Rekening Bank</CardTitle>
                                        <CardDescription>Rekening ini digunakan untuk pembayaran gaji Anda.</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" className="gap-2" asChild>
                                        <a href={route(`${((usePage().props.auth as any).user.role).replace('_', '-')}.identitas-diri`)}> {/* Assuming crew-kayu.identitas-diri is the correct route for bank detail changes */} 
                                            <Pencil className="h-4 w-4" />
                                            Ajukan Perubahan
                                        </a>
                                    </Button>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {bankAccount ? (
                                            <>
                                                <InfoItem icon={Landmark} label="Nama Bank" value={bankAccount.nama_bank} color="text-gray-600" />
                                                <InfoItem icon={Banknote} label="Nomor Rekening" value={bankAccount.nomor_rekening} color="text-gray-600" />
                                                <InfoItem icon={User} label="Nama Pemilik Rekening" value={bankAccount.nama_pemilik_rekening} color="text-gray-600" />
                                            </>
                                        ) : (
                                            <p className="text-center text-muted-foreground">Informasi rekening bank tidak tersedia.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
