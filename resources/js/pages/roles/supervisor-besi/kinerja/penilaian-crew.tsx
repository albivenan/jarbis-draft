import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { User, Star, TrendingUp, Clock, CheckCircle, AlertTriangle, Plus } from 'lucide-react';

export default function PenilaianCrew() {
    const [selectedCrew, setSelectedCrew] = useState<string>('');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('monthly');
    const [evaluationData, setEvaluationData] = useState<Record<string, number>>({});
    const [notes, setNotes] = useState<string>('');

    const crewMembers = [
        {
            id: 'CREW-001',
            name: 'Ahmad Santoso',
            position: 'Senior Welder',
            joinDate: '2023-01-15',
            currentScore: 92,
            trend: 'up',
            completedTasks: 28,
            onTimeRate: 96,
            qualityScore: 94,
            lastEvaluation: '2024-12-01'
        },
        {
            id: 'CREW-002',
            name: 'Budi Prasetyo',
            position: 'Cutting Specialist',
            joinDate: '2023-03-20',
            currentScore: 88,
            trend: 'stable',
            completedTasks: 25,
            onTimeRate: 92,
            qualityScore: 89,
            lastEvaluation: '2024-12-01'
        },
        {
            id: 'CREW-003',
            name: 'Candra Wijaya',
            position: 'Assembly Technician',
            joinDate: '2023-06-10',
            currentScore: 85,
            trend: 'up',
            completedTasks: 22,
            onTimeRate: 88,
            qualityScore: 87,
            lastEvaluation: '2024-12-01'
        },
        {
            id: 'CREW-004',
            name: 'Dedi Kurniawan',
            position: 'Finishing Specialist',
            joinDate: '2023-08-05',
            currentScore: 83,
            trend: 'down',
            completedTasks: 20,
            onTimeRate: 85,
            qualityScore: 84,
            lastEvaluation: '2024-12-01'
        },
        {
            id: 'CREW-005',
            name: 'Eko Susanto',
            position: 'Junior Welder',
            joinDate: '2023-10-12',
            currentScore: 79,
            trend: 'up',
            completedTasks: 18,
            onTimeRate: 82,
            qualityScore: 80,
            lastEvaluation: '2024-12-01'
        }
    ];

    const evaluationCriteria = [
        { id: 'technical_skill', name: 'Keahlian Teknis', weight: 25, maxScore: 100 },
        { id: 'quality', name: 'Kualitas Kerja', weight: 25, maxScore: 100 },
        { id: 'productivity', name: 'Produktivitas', weight: 20, maxScore: 100 },
        { id: 'punctuality', name: 'Ketepatan Waktu', weight: 15, maxScore: 100 },
        { id: 'teamwork', name: 'Kerjasama Tim', weight: 10, maxScore: 100 },
        { id: 'safety', name: 'Keselamatan Kerja', weight: 5, maxScore: 100 }
    ];

    const recentEvaluations = [
        {
            id: 'EVAL-001',
            crewName: 'Ahmad Santoso',
            period: 'Desember 2024',
            overallScore: 92,
            evaluatedBy: 'Supervisor Besi A',
            evaluationDate: '2024-12-01',
            status: 'completed',
            improvements: ['Konsistensi kualitas las', 'Leadership dalam tim']
        },
        {
            id: 'EVAL-002',
            crewName: 'Budi Prasetyo',
            period: 'Desember 2024',
            overallScore: 88,
            evaluatedBy: 'Supervisor Besi A',
            evaluationDate: '2024-12-01',
            status: 'completed',
            improvements: ['Kecepatan cutting', 'Akurasi pengukuran']
        },
        {
            id: 'EVAL-003',
            crewName: 'Candra Wijaya',
            period: 'Desember 2024',
            overallScore: 85,
            evaluatedBy: 'Supervisor Besi A',
            evaluationDate: '2024-12-01',
            status: 'completed',
            improvements: ['Presisi assembly', 'Inisiatif problem solving']
        }
    ];

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
            case 'down': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
            default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 80) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBadgeColor = (score: number) => {
        if (score >= 90) return 'bg-green-100 text-green-800';
        if (score >= 80) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const calculateOverallScore = () => {
        let totalScore = 0;
        let totalWeight = 0;

        evaluationCriteria.forEach(criteria => {
            const score = evaluationData[criteria.id] || 0;
            totalScore += (score * criteria.weight);
            totalWeight += criteria.weight;
        });

        return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    };

    const handleScoreChange = (criteriaId: string, score: number) => {
        setEvaluationData(prev => ({
            ...prev,
            [criteriaId]: score
        }));
    };

    const handleSubmitEvaluation = () => {
        if (!selectedCrew || Object.keys(evaluationData).length === 0) {
            alert('Mohon lengkapi semua kriteria penilaian');
            return;
        }

        const evaluationPayload = {
            crewId: selectedCrew,
            period: selectedPeriod,
            scores: evaluationData,
            overallScore: calculateOverallScore(),
            notes,
            evaluatedBy: 'Supervisor Besi A',
            evaluationDate: new Date().toISOString()
        };

        console.log('Submitting evaluation:', evaluationPayload);
        alert('Penilaian berhasil disimpan!');

        // Reset form
        setSelectedCrew('');
        setEvaluationData({});
        setNotes('');
    };

    const stats = [
        {
            title: 'Total Crew',
            value: crewMembers.length.toString(),
            icon: User,
            color: 'text-blue-600'
        },
        {
            title: 'Rata-rata Score',
            value: Math.round(crewMembers.reduce((acc, crew) => acc + crew.currentScore, 0) / crewMembers.length).toString(),
            icon: Star,
            color: 'text-yellow-600'
        },
        {
            title: 'Evaluasi Bulan Ini',
            value: recentEvaluations.length.toString(),
            icon: CheckCircle,
            color: 'text-green-600'
        },
        {
            title: 'Perlu Evaluasi',
            value: crewMembers.filter(crew =>
                new Date(crew.lastEvaluation) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ).length.toString(),
            icon: AlertTriangle,
            color: 'text-orange-600'
        }
    ];

    return (
        <AuthenticatedLayout
            title="Penilaian Crew"
            breadcrumbs={[
                { title: 'Dashboard', href: '/roles/supervisor-besi' },
                { title: 'Kinerja (KPI)', href: '#' },
                { title: 'Penilaian Crew', href: '/roles/supervisor-besi/kinerja/penilaian-crew' }
            ]}
        >
            <Head title="Penilaian Crew - Supervisor Besi" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <User className="h-8 w-8 text-gray-600" />
                            Penilaian Kinerja Crew
                        </h1>
                        <p className="text-gray-600 mt-1">Evaluasi dan penilaian kinerja crew produksi besi</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-gray-600 hover:bg-gray-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Buat Penilaian Baru
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Formulir Penilaian Crew</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                                            Pilih Crew <span className="text-red-500">*</span>
                                        </label>
                                        <Select value={selectedCrew} onValueChange={setSelectedCrew}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih crew untuk dinilai" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {crewMembers.map((crew) => (
                                                    <SelectItem key={crew.id} value={crew.id}>
                                                        {crew.name} - {crew.position}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                                            Periode Penilaian <span className="text-red-500">*</span>
                                        </label>
                                        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih periode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">Bulanan</SelectItem>
                                                <SelectItem value="quarterly">Triwulan</SelectItem>
                                                <SelectItem value="yearly">Tahunan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {selectedCrew && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        {(() => {
                                            const crew = crewMembers.find(c => c.id === selectedCrew);
                                            return crew ? (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <span className="font-medium">Posisi:</span>
                                                        <p>{crew.position}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Bergabung:</span>
                                                        <p>{new Date(crew.joinDate).toLocaleDateString('id-ID')}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Score Saat Ini:</span>
                                                        <p className={getScoreColor(crew.currentScore)}>{crew.currentScore}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Tugas Selesai:</span>
                                                        <p>{crew.completedTasks}</p>
                                                    </div>
                                                </div>
                                            ) : null;
                                        })()}
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Kriteria Penilaian</h3>
                                    <div className="space-y-4">
                                        {evaluationCriteria.map((criteria) => (
                                            <div key={criteria.id} className="p-4 border rounded-lg">
                                                <div className="flex justify-between items-center mb-3">
                                                    <div>
                                                        <h4 className="font-medium">{criteria.name}</h4>
                                                        <p className="text-sm text-gray-600">Bobot: {criteria.weight}%</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={evaluationData[criteria.id] || ''}
                                                            onChange={(e) => handleScoreChange(criteria.id, parseInt(e.target.value) || 0)}
                                                            placeholder="0-100"
                                                            className="w-20 text-center"
                                                        />
                                                    </div>
                                                </div>
                                                <Progress
                                                    value={evaluationData[criteria.id] || 0}
                                                    className="h-2"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {Object.keys(evaluationData).length > 0 && (
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Score Keseluruhan:</span>
                                            <span className={`text-2xl font-bold ${getScoreColor(calculateOverallScore())}`}>
                                                {calculateOverallScore()}/100
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Catatan dan Feedback
                                    </label>
                                    <Textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Berikan feedback konstruktif, area yang perlu diperbaiki, dan apresiasi..."
                                        rows={4}
                                    />
                                </div>

                                <Button
                                    onClick={handleSubmitEvaluation}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    disabled={!selectedCrew || Object.keys(evaluationData).length === 0}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Simpan Penilaian
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className="p-3 rounded-full bg-gray-100">
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Crew Performance */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kinerja Crew Saat Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {crewMembers.map((crew) => (
                                    <div key={crew.id} className="p-4 border rounded-lg">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-medium">{crew.name}</h4>
                                                <p className="text-sm text-gray-600">{crew.position}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={getScoreBadgeColor(crew.currentScore)}>
                                                    {crew.currentScore}
                                                </Badge>
                                                {getTrendIcon(crew.trend)}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600">Tugas Selesai</p>
                                                <p className="font-medium">{crew.completedTasks}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">On-Time Rate</p>
                                                <p className="font-medium">{crew.onTimeRate}%</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Quality Score</p>
                                                <p className="font-medium">{crew.qualityScore}</p>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Overall Performance</span>
                                                <span className="font-medium">{crew.currentScore}%</span>
                                            </div>
                                            <Progress value={crew.currentScore} className="h-2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Evaluations */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Evaluasi Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentEvaluations.map((evaluation) => (
                                    <div key={evaluation.id} className="p-4 border rounded-lg">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-medium">{evaluation.crewName}</h4>
                                                <p className="text-sm text-gray-600">{evaluation.period}</p>
                                            </div>
                                            <Badge className={getScoreBadgeColor(evaluation.overallScore)}>
                                                {evaluation.overallScore}
                                            </Badge>
                                        </div>

                                        <div className="text-sm text-gray-600 mb-3">
                                            <p>Evaluator: {evaluation.evaluatedBy}</p>
                                            <p>Tanggal: {new Date(evaluation.evaluationDate).toLocaleDateString('id-ID')}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">Area Perbaikan:</p>
                                            <div className="space-y-1">
                                                {evaluation.improvements.map((improvement, index) => (
                                                    <div key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                                        {improvement}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}