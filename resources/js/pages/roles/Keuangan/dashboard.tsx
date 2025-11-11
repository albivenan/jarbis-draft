import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, FileText, BarChart2, Wallet } from 'lucide-react';

interface PageProps {
    auth: {
        user: {
            role: string;
            name: string;
        };
    };
}

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    const isManajer = auth.user.role === 'manajer_keuangan';
    
    const title = isManajer ? 'Dashboard Manajer Keuangan' : 'Dashboard Staf Keuangan';
    const description = isManajer 
        ? 'Ikhtisar lengkap keuangan perusahaan dan manajemen finansial' 
        : 'Ikhtisar keuangan harian dan penggajian';

    return (
        <AuthenticatedLayout>
            <Head title={title} />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <DollarSign className="h-8 w-8 text-green-600" />
                        {title}
                    </h1>
                    <p className="text-gray-600 mt-1">{description}</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard
                        title="Total Pemasukan"
                        value="Rp 0"
                        icon={TrendingUp}
                        color="green"
                    />
                    <KpiCard
                        title="Total Pengeluaran"
                        value="Rp 0"
                        icon={DollarSign}
                        color="red"
                    />
                    <KpiCard
                        title="Saldo Kas"
                        value="Rp 0"
                        icon={Wallet}
                        color="blue"
                    />
                    <KpiCard
                        title="Pending Approval"
                        value="0"
                        icon={FileText}
                        color="yellow"
                    />
                </div>

                {/* Additional Cards for Manajer */}
                {isManajer && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart2 className="h-5 w-5" />
                                        Ringkasan Keuangan Bulan Ini
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Data ringkasan keuangan akan ditampilkan di sini.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Status Penggajian
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Status penggajian karyawan akan ditampilkan di sini.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart2 className="h-5 w-5" />
                                    Grafik Arus Kas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Grafik arus kas perusahaan akan ditampilkan di sini.
                                </p>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Cards for Staf */}
                {!isManajer && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Tugas Hari Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Daftar tugas harian akan ditampilkan di sini.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

interface KpiCardProps {
    title: string;
    value: string;
    icon: any;
    color: 'green' | 'red' | 'blue' | 'yellow';
}

function KpiCard({ title, value, icon: Icon, color }: KpiCardProps) {
    const colorClasses = {
        green: 'bg-green-100 text-green-600',
        red: 'bg-red-100 text-red-600',
        blue: 'bg-blue-100 text-blue-600',
        yellow: 'bg-yellow-100 text-yellow-600',
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
