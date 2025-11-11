import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { HelpCircle, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Direktur', href: '/roles/direktur' },
    { title: 'Approvals', href: '/roles/direktur/approvals' },
];

export default function DirekturApprovalsPage() {
    const [showHelp, setShowHelp] = useState(false);
    return (
        <AuthenticatedLayout>
            <Head title="Direktur • Approvals" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Persetujuan</h1>
                        <p className="text-sm text-muted-foreground">Tinjau dan setujui pengajuan dari divisi (anggaran, proyek, pembelian)</p>
                    </div>
                    <button aria-label="Bantuan" onClick={() => setShowHelp(true)} className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm text-muted-foreground hover:bg-accent">
                        <HelpCircle className="h-4 w-4" /> Bantuan
                    </button>
                </div>

                <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                    Placeholder: Daftar pengajuan menunggu persetujuan (dengan filter status, tanggal, dan divisi).
                </div>
            </div>
            {showHelp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-lg rounded-lg bg-background p-4 shadow">
                        <div className="mb-2 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Bantuan • Persetujuan</h2>
                            <button aria-label="Tutup" onClick={() => setShowHelp(false)} className="rounded p-1 hover:bg-accent">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>Halaman ini menampilkan daftar pengajuan yang membutuhkan keputusan direktur. Gunakan breadcrumb untuk kembali ke halaman lain.</p>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

