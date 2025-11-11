import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Briefcase,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Eye,
    FileText,
    Calendar,
    User,
    Search,
    Target,
    DollarSign,
    Users
} from 'lucide-react';

interface ProjectProposal {
    id: string;
    title: string;
    department: string;
    projectManager: string;
    budget: number;
    duration: number; // in months
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'approved' | 'rejected' | 'revision';
    submittedDate: string;
    expectedStartDate: string;
    description: string;
    objectives: string[];
    deliverables: string[];
    risks: string[];
    teamSize: number;
    roi: number; // expected ROI percentage
    attachments?: string[];
}

export default function PersetujuanProyek() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

    const projectProposals: ProjectProposal[] = [
        {
            id: 'PROJ-001',
            title: 'Modernisasi Sistem Produksi Besi',
            department: 'Produksi Besi',
            projectManager: 'Ahmad Yusuf',
            budget: 2500000000,
            duration: 8,
            priority: 'high',
            status: 'pending',
            submittedDate: '2024-01-10',
            expectedStartDate: '2024-02-01',
            description: 'Upgrade mesin produksi dan implementasi sistem otomasi untuk meningkatkan efisiensi produksi besi hingga 40%',
            objectives: [
                'Meningkatkan kapasitas produksi 40%',
                'Mengurangi waste material hingga 15%',
                'Implementasi quality control otomatis',
                'Mengurangi downtime mesin hingga 25%'
            ],
            deliverables: [
                'Instalasi 5 unit mesin CNC baru',
                'Sistem monitoring real-time',
                'Training untuk 50 operator',
                'Dokumentasi SOP baru'
            ],
            risks: [
                'Delay pengiriman mesin dari supplier',
                'Resistance to change dari operator lama',
                'Potensi gangguan produksi selama instalasi'
            ],
            teamSize: 15,
            roi: 35,
            attachments: ['proposal-detail.pdf', 'budget-breakdown.xlsx', 'timeline.pdf']
        },
        {
            id: 'PROJ-002',
            title: 'Ekspansi Fasilitas Produksi Kayu',
            department: 'Produksi Kayu',
            projectManager: 'Sari Dewi',
            budget: 1800000000,
            duration: 6,
            priority: 'medium',
            status: 'pending',
            submittedDate: '2024-01-12',
            expectedStartDate: '2024-02-15',
            description: 'Pembangunan workshop baru dan penambahan kapasitas produksi kayu untuk memenuhi peningkatan demand',
            objectives: [
                'Menambah kapasitas produksi 60%',
                'Membuka 2 lini produksi baru',
                'Meningkatkan kualitas finishing',
                'Mengurangi lead time 30%'
            ],
            deliverables: [
                'Workshop baru 2000m²',
                '10 unit mesin woodworking baru',
                'Sistem dust collection',
                'Area finishing terpisah'
            ],
            risks: [
                'Keterlambatan konstruksi',
                'Kenaikan harga material bangunan',
                'Kesulitan rekrutmen skilled worker'
            ],
            teamSize: 25,
            roi: 28,
            attachments: ['site-plan.pdf', 'equipment-list.xlsx']
        },
        {
            id: 'PROJ-003',
            title: 'Implementasi ERP System',
            department: 'IT',
            projectManager: 'Budi Santoso',
            budget: 800000000,
            duration: 12,
            priority: 'high',
            status: 'revision',
            submittedDate: '2024-01-08',
            expectedStartDate: '2024-01-20',
            description: 'Implementasi sistem ERP terintegrasi untuk menghubungkan semua departemen dan meningkatkan efisiensi operasional',
            objectives: [
                'Integrasi semua sistem departemen',
                'Real-time reporting dan analytics',
                'Otomasi workflow approval',
                'Paperless operation 80%'
            ],
            deliverables: [
                'ERP system fully implemented',
                'Data migration dari sistem lama',
                'Training untuk 200+ users',
                'Mobile app untuk monitoring'
            ],
            risks: [
                'Kompleksitas integrasi sistem legacy',
                'Resistance to change dari user',
                'Data loss selama migration'
            ],
            teamSize: 8,
            roi: 45,
            attachments: ['system-architecture.pdf', 'implementation-plan.pdf']
        },
        {
            id: 'PROJ-004',
            title: 'Program Sertifikasi ISO 9001:2015',
            department: 'Quality Control',
            projectManager: 'Eko Prasetyo',
            budget: 300000000,
            duration: 10,
            priority: 'medium',
            status: 'approved',
            submittedDate: '2024-01-05',
            expectedStartDate: '2024-01-15',
            description: 'Implementasi sistem manajemen kualitas ISO 9001:2015 untuk meningkatkan standar kualitas dan kepercayaan customer',
            objectives: [
                'Mendapatkan sertifikasi ISO 9001:2015',
                'Standardisasi proses quality control',
                'Meningkatkan customer satisfaction',
                'Mengurangi defect rate hingga 50%'
            ],
            deliverables: [
                'Dokumentasi sistem manajemen kualitas',
                'Training ISO untuk semua departemen',
                'Internal audit system',
                'Sertifikat ISO 9001:2015'
            ],
            risks: [
                'Ketidaksiapan dokumentasi',
                'Gagal audit eksternal',
                'Biaya maintenance sertifikasi'
            ],
            teamSize: 12,
            roi: 25,
            attachments: ['iso-roadmap.pdf', 'gap-analysis.xlsx']
        }
    ];

    const departments = ['all', 'Produksi Besi', 'Produksi Kayu', 'IT', 'Quality Control', 'PPIC', 'HRD', 'Keuangan', 'Marketing'];
    const statuses = ['all', 'pending', 'approved', 'rejected', 'revision'];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-blue-100 text-blue-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'revision': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="h-4 w-4" />;
            case 'approved': return <CheckCircle className="h-4 w-4" />;
            case 'rejected': return <XCircle className="h-4 w-4" />;
            case 'revision': return <AlertTriangle className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Menunggu Persetujuan';
            case 'approved': return 'Disetujui';
            case 'rejected': return 'Ditolak';
            case 'revision': return 'Perlu Revisi';
            default: return status;
        }
    };

    const filteredProposals = projectProposals.filter(proposal => {
        const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proposal.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proposal.projectManager.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || proposal.status === selectedStatus;
        const matchesDepartment = selectedDepartment === 'all' || proposal.department === selectedDepartment;
        return matchesSearch && matchesStatus && matchesDepartment;
    });

    const proposalSummary = {
        total: projectProposals.length,
        pending: projectProposals.filter(p => p.status === 'pending').length,
        approved: projectProposals.filter(p => p.status === 'approved').length,
        rejected: projectProposals.filter(p => p.status === 'rejected').length,
        revision: projectProposals.filter(p => p.status === 'revision').length,
        totalBudget: projectProposals.reduce((sum, p) => sum + p.budget, 0),
        pendingBudget: projectProposals.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.budget, 0)
    };

    const handleApprove = (projectId: string) => {
        console.log('Approving project:', projectId);
        // Logic untuk approve project
    };

    const handleReject = (projectId: string) => {
        console.log('Rejecting project:', projectId);
        // Logic untuk reject project
    };

    const handleRequestRevision = (projectId: string) => {
        console.log('Requesting revision for project:', projectId);
        // Logic untuk request revision
    };

    return (
        <AuthenticatedLayout
            title="Persetujuan Proyek"
            breadcrumbs={[
                { title: 'Dashboard', href: '/roles/direktur' },
                { title: 'Persetujuan Final', href: '#' },
                { title: 'Persetujuan Proyek', href: '/roles/direktur/persetujuan/proyek' }
            ]}
        >
            <Head title="Persetujuan Proyek - Direktur" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <Briefcase className="h-8 w-8 text-blue-600" />
                            Persetujuan Proyek
                        </h1>
                        <p className="text-gray-600 mt-1">Review dan setujui proposal proyek dari berbagai departemen</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Proposal</p>
                                    <p className="text-2xl font-bold text-gray-900">{proposalSummary.total}</p>
                                    <p className="text-sm text-blue-600">Budget: {formatCurrency(proposalSummary.totalBudget)}</p>
                                </div>
                                <div className="p-3 rounded-full bg-blue-100">
                                    <Briefcase className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Menunggu Persetujuan</p>
                                    <p className="text-2xl font-bold text-blue-900">{proposalSummary.pending}</p>
                                    <p className="text-sm text-orange-600">Budget: {formatCurrency(proposalSummary.pendingBudget)}</p>
                                </div>
                                <div className="p-3 rounded-full bg-orange-100">
                                    <Clock className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Disetujui</p>
                                    <p className="text-2xl font-bold text-green-900">{proposalSummary.approved}</p>
                                    <p className="text-sm text-green-600">Proyek Aktif</p>
                                </div>
                                <div className="p-3 rounded-full bg-green-100">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Perlu Revisi</p>
                                    <p className="text-2xl font-bold text-yellow-900">{proposalSummary.revision}</p>
                                    <p className="text-sm text-red-600">Ditolak: {proposalSummary.rejected}</p>
                                </div>
                                <div className="p-3 rounded-full bg-yellow-100">
                                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari berdasarkan judul proyek, departemen, atau project manager..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                            >
                                {statuses.map(status => (
                                    <option key={status} value={status}>
                                        {status === 'all' ? 'Semua Status' : getStatusText(status)}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                            >
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>
                                        {dept === 'all' ? 'Semua Departemen' : dept}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Project Proposals */}
                <div className="grid gap-6">
                    {filteredProposals.map((proposal) => (
                        <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900">{proposal.title}</h3>
                                            <Badge className={getPriorityColor(proposal.priority)}>
                                                {proposal.priority === 'high' ? 'Tinggi' :
                                                    proposal.priority === 'medium' ? 'Sedang' : 'Rendah'}
                                            </Badge>
                                            <Badge className={getStatusColor(proposal.status)}>
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(proposal.status)}
                                                    <span>{getStatusText(proposal.status)}</span>
                                                </div>
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                                            <div>
                                                <p><span className="font-medium">ID:</span> {proposal.id}</p>
                                                <p><span className="font-medium">Departemen:</span> {proposal.department}</p>
                                            </div>
                                            <div>
                                                <p><span className="font-medium">Project Manager:</span> {proposal.projectManager}</p>
                                                <p><span className="font-medium">Tim:</span> {proposal.teamSize} orang</p>
                                            </div>
                                            <div>
                                                <p><span className="font-medium">Budget:</span> {formatCurrency(proposal.budget)}</p>
                                                <p><span className="font-medium">Durasi:</span> {proposal.duration} bulan</p>
                                            </div>
                                            <div>
                                                <p><span className="font-medium">Expected ROI:</span> {proposal.roi}%</p>
                                                <p><span className="font-medium">Start Date:</span> {proposal.expectedStartDate}</p>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-4">{proposal.description}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                                                    <Target className="h-4 w-4" />
                                                    Objectives ({proposal.objectives.length})
                                                </h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    {proposal.objectives.slice(0, 2).map((obj, index) => (
                                                        <li key={index} className="flex items-start gap-1">
                                                            <span className="text-green-600">•</span>
                                                            <span>{obj}</span>
                                                        </li>
                                                    ))}
                                                    {proposal.objectives.length > 2 && (
                                                        <li className="text-xs text-gray-500">+{proposal.objectives.length - 2} more...</li>
                                                    )}
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                                                    <CheckCircle className="h-4 w-4" />
                                                    Deliverables ({proposal.deliverables.length})
                                                </h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    {proposal.deliverables.slice(0, 2).map((del, index) => (
                                                        <li key={index} className="flex items-start gap-1">
                                                            <span className="text-blue-600">•</span>
                                                            <span>{del}</span>
                                                        </li>
                                                    ))}
                                                    {proposal.deliverables.length > 2 && (
                                                        <li className="text-xs text-gray-500">+{proposal.deliverables.length - 2} more...</li>
                                                    )}
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    Risks ({proposal.risks.length})
                                                </h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    {proposal.risks.slice(0, 2).map((risk, index) => (
                                                        <li key={index} className="flex items-start gap-1">
                                                            <span className="text-red-600">•</span>
                                                            <span>{risk}</span>
                                                        </li>
                                                    ))}
                                                    {proposal.risks.length > 2 && (
                                                        <li className="text-xs text-gray-500">+{proposal.risks.length - 2} more...</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>

                                        {proposal.attachments && proposal.attachments.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                                                    <FileText className="h-4 w-4" />
                                                    Attachments ({proposal.attachments.length})
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {proposal.attachments.map((attachment, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {attachment}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="text-xs text-gray-500">
                                            Submitted: {proposal.submittedDate}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 ml-6">
                                        <Button size="sm" variant="outline">
                                            <Eye className="h-4 w-4 mr-2" />
                                            Detail
                                        </Button>

                                        {proposal.status === 'pending' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleApprove(proposal.id)}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Setujui
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                                                    onClick={() => handleRequestRevision(proposal.id)}
                                                >
                                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                                    Revisi
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-red-300 text-red-700 hover:bg-red-50"
                                                    onClick={() => handleReject(proposal.id)}
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Tolak
                                                </Button>
                                            </>
                                        )}

                                        {proposal.status === 'revision' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleApprove(proposal.id)}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Setujui
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-red-300 text-red-700 hover:bg-red-50"
                                                    onClick={() => handleReject(proposal.id)}
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Tolak
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredProposals.length === 0 && (
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <p className="text-gray-500">Tidak ada proposal proyek yang sesuai dengan filter.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
