import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { LeaveForm } from './LeaveForm';
import { LeaveHistory, LeaveRequest } from './LeaveHistory';
import axios from 'axios';

export default function LeavePage() {
    const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('form');
    const [editingLeave, setEditingLeave] = useState<LeaveRequest | null>(null);

    const loadLeaves = () => {
        setIsLoading(true);
        axios.get(route('leave-requests.requests')).then((response) => {
            setLeaves(response.data.data);
            setIsLoading(false);
        }).catch((error) => {
            console.error('Failed to load leaves:', error);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        if (activeTab === 'history') {
            loadLeaves();
        }
    }, [activeTab]);

    const handleEdit = (leave: LeaveRequest) => {
        setEditingLeave(leave);
        setActiveTab('form');
    };

    const handleFormSuccess = () => {
        setEditingLeave(null);
        setActiveTab('history');
        loadLeaves();
    };

    const pendingCount = leaves.filter(l => l.status === 'pending').length;

    return (
        <AuthenticatedLayout>
            <Head title="Pengajuan Izin" />
            <div className="space-y-6 container mx-auto px-4 py-6">
                <div>
                    <h1 className="text-2xl font-bold">Pengajuan Izin</h1>
                    <p className="text-muted-foreground">
                        Ajukan cuti, sakit, atau izin tidak masuk kerja
                    </p>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 text-sm">
                        <strong>Catatan:</strong> Maksimal 3 pengajuan aktif (pending). Untuk izin terlambat/pulang awal/lembur, gunakan form di halaman Jadwal.
                    </AlertDescription>
                </Alert>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 max-w-md">
                        <TabsTrigger value="form">
                            {editingLeave ? 'Edit Pengajuan' : 'Buat Pengajuan'}
                        </TabsTrigger>
                        <TabsTrigger value="history">
                            Riwayat Pengajuan
                            {pendingCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                    {pendingCount}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="form" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {editingLeave ? 'Edit Pengajuan Izin' : 'Form Pengajuan Izin'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <LeaveForm 
                                    editData={editingLeave} 
                                    onSuccess={handleFormSuccess}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Riwayat Pengajuan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <LeaveHistory 
                                    leaves={leaves} 
                                    isLoading={isLoading}
                                    onEdit={handleEdit}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}
