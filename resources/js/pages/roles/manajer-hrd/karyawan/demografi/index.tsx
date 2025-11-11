import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    UserCheck,
    UserX,
    Calendar,
    Award,
    AlertTriangle,
    Target,
    PieChart,
    Download,
    Filter,
    RefreshCw
} from 'lucide-react';

interface OverviewStats {
    totalEmployees: number;
    activeEmployees: number;
    newHires: number;
    resignations: number;
    avgAge: number;
    avgTenure: number;
    turnoverRate: number;
    retentionRate: number;
}

interface DepartmentAnalysis {
    department: string;
    totalEmployees: number;
    newHires: number;
    resignations: number;
    turnoverRate: number;
    avgTenure: number;
}

interface DemographicItem {
    category: string;
    value: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
    trendValue: number;
}

interface EducationItem {
    category: string;
    value: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
    trendValue: number;
}

interface TrendItem {
    month: string;
    totalEmployees: number;
    newHires: number;
    resignations: number;
    turnoverRate: number;
    retentionRate: number;
}

interface PageProps {
    overviewStats: OverviewStats;
    departmentAnalysis: DepartmentAnalysis[];
    selectedPeriod: string;
    demographicData: DemographicItem[];
    educationData: EducationItem[];
    trendData: TrendItem[];
}

export default function AnalisaKepegawaian({ overviewStats, departmentAnalysis, selectedPeriod: initialSelectedPeriod, demographicData, educationData, trendData }: PageProps) {
    const [selectedPeriod, setSelectedPeriod] = useState(initialSelectedPeriod);
    const [selectedView, setSelectedView] = useState<'overview' | 'demographics' | 'trends'>('overview');


    const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
        switch (trend) {
            case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
            case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
            case 'stable': return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
        }
    };

    const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
        switch (trend) {
            case 'up': return 'text-green-600';
            case 'down': return 'text-red-600';
            case 'stable': return 'text-gray-600';
        }
    };

    const getStatusColor = (status: 'good' | 'warning' | 'critical') => {
        switch (status) {
            case 'good': return 'bg-green-100 text-green-800';
            case 'warning': return 'bg-yellow-100 text-yellow-800';
            case 'critical': return 'bg-red-100 text-red-800';
        }
    };

    const getStatusIcon = (status: 'good' | 'warning' | 'critical') => {
        switch (status) {
            case 'good': return <UserCheck className="h-4 w-4" />;
            case 'warning': return <AlertTriangle className="h-4 w-4" />;
            case 'critical': return <UserX className="h-4 w-4" />;
        }
    };

    return (
        <AuthenticatedLayout
            title="Analisa Demografi & Departemen"
            breadcrumbs={[
                { title: 'Dashboard', href: '/roles/manajer-hrd' },
                { title: 'Data Karyawan', href: '#' },
                { title: 'Demografi', href: '/roles/manajer-hrd/karyawan/demografi' }
            ]}
        >
            <Head title="Demografi Karyawan - Manajer HRD" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <BarChart3 className="h-8 w-8 text-blue-600" />
                            Analisa Demografi & Departemen
                        </h1>
                        <p className="text-gray-600 mt-1">Analisis demografi dan distribusi karyawan per departemen</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex border rounded-lg">
                            <button
                                onClick={() => setSelectedView('overview')}
                                className={`px-4 py-2 text-sm font-medium ${selectedView === 'overview'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setSelectedView('demographics')}
                                className={`px-4 py-2 text-sm font-medium ${selectedView === 'demographics'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Demografi
                            </button>

                            <button
                                onClick={() => setSelectedView('trends')}
                                className={`px-4 py-2 text-sm font-medium ${selectedView === 'trends'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Tren
                            </button>
                        </div>
                        <input
                            type="month"
                            value={selectedPeriod}
                            onChange={(e) => {
                                const newPeriod = e.target.value;
                                setSelectedPeriod(newPeriod);
                                router.get(route('manajer-hrd.karyawan.demografi'), { period: newPeriod }, { preserveState: true, replace: true });
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                {selectedView === 'overview' && (
                    <>
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Karyawan</p>
                                            <p className="text-2xl font-bold text-gray-900">{overviewStats.totalEmployees}</p>
                                            <p className="text-sm text-blue-600">{overviewStats.activeEmployees} aktif</p>
                                        </div>
                                        <div className="p-3 rounded-full bg-blue-100">
                                            <Users className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Karyawan Baru</p>
                                            <p className="text-2xl font-bold text-green-900">{overviewStats.newHires}</p>
                                            <p className="text-sm text-green-600">Bulan ini</p>
                                        </div>
                                        <div className="p-3 rounded-full bg-green-100">
                                            <UserCheck className="h-6 w-6 text-green-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Turnover Rate</p>
                                            <p className="text-2xl font-bold text-orange-900">{overviewStats.turnoverRate}%</p>
                                            <p className="text-sm text-orange-600">Tahunan</p>
                                        </div>
                                        <div className="p-3 rounded-full bg-orange-100">
                                            <RefreshCw className="h-6 w-6 text-orange-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Rata-rata Usia</p>
                                            <p className="text-2xl font-bold text-purple-900">{overviewStats.avgAge}</p>
                                            <p className="text-sm text-purple-600">Tahun</p>
                                        </div>
                                        <div className="p-3 rounded-full bg-purple-100">
                                            <Calendar className="h-6 w-6 text-purple-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>


                        </div>

                        {/* Department Analysis */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Analisis Per Departemen</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4">Departemen</th>
                                                <th className="text-left py-3 px-4">Karyawan</th>
                                                <th className="text-left py-3 px-4">Karyawan Baru</th>
                                                <th className="text-left py-3 px-4">Resign</th>
                                                <th className="text-left py-3 px-4">Turnover Rate</th>
                                                <th className="text-left py-3 px-4">Masa Kerja Rata-rata</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {departmentAnalysis.map((dept, index) => (
                                                <tr key={index} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium">{dept.department}</td>
                                                    <td className="py-3 px-4">{dept.totalEmployees}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-1">
                                                            <UserCheck className="h-4 w-4 text-green-600" />
                                                            <span>{dept.newHires}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-1">
                                                            <UserX className="h-4 w-4 text-red-600" />
                                                            <span>{dept.resignations}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`font-medium ${dept.turnoverRate > 10 ? 'text-red-600' : dept.turnoverRate > 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                                                            {dept.turnoverRate}%
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">{dept.avgTenure} tahun</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {selectedView === 'demographics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Age Demographics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="h-5 w-5" />
                                    Distribusi Usia
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {demographicData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-gray-900">{item.category}</span>
                                                    <div className="flex items-center gap-2">
                                                        {getTrendIcon(item.trend)}
                                                        <span className={`text-sm ${getTrendColor(item.trend)}`}>
                                                            {item.trend === 'up' ? '+' : item.trend === 'down' ? '' : ''}{item.trendValue}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">{item.value} orang</span>
                                                    <span className="text-sm font-medium">{item.percentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{ width: `${item.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Education Demographics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5" />
                                    Distribusi Pendidikan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {educationData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-gray-900">{item.category}</span>
                                                    <div className="flex items-center gap-2">
                                                        {getTrendIcon(item.trend)}
                                                        <span className={`text-sm ${getTrendColor(item.trend)}`}>
                                                            {item.trend === 'up' ? '+' : item.trend === 'down' ? '' : ''}{item.trendValue}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">{item.value} orang</span>
                                                    <span className="text-sm font-medium">{item.percentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                    <div
                                                        className="bg-green-600 h-2 rounded-full"
                                                        style={{ width: `${item.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}



                {selectedView === 'trends' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tren Kepegawaian 6 Bulan Terakhir</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {trendData.map((trend, index) => (
                                        <div key={index} className="p-3 border rounded-lg">
                                            <h4 className="font-medium text-gray-900 mb-2">{trend.month}</h4>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="flex justify-between items-center">
                                                    <span>Total Karyawan:</span>
                                                    <span className="font-bold">{trend.totalEmployees}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span>Karyawan Baru:</span>
                                                    <span className="font-bold text-green-600">+{trend.newHires}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span>Resignasi:</span>
                                                    <span className="font-bold text-red-600">-{trend.resignations}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span>Turnover Rate:</span>
                                                    <span className="font-bold text-orange-600">{trend.turnoverRate}%</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span>Retention Rate:</span>
                                                    <span className="font-bold text-blue-600">{trend.retentionRate}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Prediksi & Rekomendasi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                                        <h4 className="font-medium text-blue-900 mb-1">Prediksi Pertumbuhan</h4>
                                        <p className="text-sm text-blue-800">Berdasarkan tren saat ini, jumlah karyawan diprediksi akan bertambah 15-20% dalam 12 bulan ke depan.</p>
                                    </div>
                                    <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                                        <h4 className="font-medium text-yellow-900 mb-1">Area Perhatian</h4>
                                        <p className="text-sm text-yellow-800">Departemen Produksi Kayu memiliki turnover rate tertinggi (13.3%). Perlu evaluasi lebih lanjut.</p>
                                    </div>
                                    <div className="p-3 border-l-4 border-green-500 bg-green-50">
                                        <h4 className="font-medium text-green-900 mb-1">Rekomendasi</h4>
                                        <p className="text-sm text-green-800">Tingkatkan program pelatihan dan development untuk meningkatkan retention rate di semua departemen.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}