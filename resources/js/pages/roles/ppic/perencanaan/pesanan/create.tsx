import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function CreatePesanan() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_produk: '',
        deskripsi: '',
        harga_usulan_ppic: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ppic.perencanaan.pesanan.store'), {
            onSuccess: () => {
                toast.success('Usulan harga produk berhasil diajukan!');
                reset();
            },
            onError: (e) => {
                console.error(e);
                toast.error('Gagal mengajukan usulan harga. Periksa kembali isian form.');
            }
        });
    };

    return (
        <AuthenticatedLayout
            title="Buat Pesanan Baru"
            breadcrumbs={[
                { title: 'Dashboard', href: route('ppic.index') },
                { title: 'Perencanaan', href: '#' },
                { title: 'Antrean Pesanan', href: route('ppic.perencanaan.pesanan.index') },
                { title: 'Buat Baru', href: '#' }
            ]}
        >
            <Head title="Buat Pesanan Baru" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <FileText className="h-8 w-8 text-blue-600" />
                            Buat Pesanan Baru
                        </h1>
                        <p className="text-gray-600 mt-1">Formulir untuk membuat pesanan produk baru dan mengusulkan harga.</p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="nama_produk">Nama Produk</Label>
                            <Input
                                id="nama_produk"
                                type="text"
                                value={data.nama_produk}
                                onChange={(e) => setData('nama_produk', e.target.value)}
                                disabled={processing}
                                placeholder="Masukkan nama produk"
                            />
                            {errors.nama_produk && <p className="text-xs text-red-500 mt-1">{errors.nama_produk}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deskripsi">Deskripsi (Opsional)</Label>
                            <Textarea
                                id="deskripsi"
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                disabled={processing}
                                placeholder="Deskripsi singkat produk"
                            />
                            {errors.deskripsi && <p className="text-xs text-red-500 mt-1">{errors.deskripsi}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="harga_usulan_ppic">Harga Usulan PPIC</Label>
                            <Input
                                id="harga_usulan_ppic"
                                type="number"
                                value={data.harga_usulan_ppic}
                                onChange={(e) => setData('harga_usulan_ppic', parseFloat(e.target.value))}
                                disabled={processing}
                                min="0"
                                placeholder="Masukkan harga usulan"
                            />
                            {errors.harga_usulan_ppic && <p className="text-xs text-red-500 mt-1">{errors.harga_usulan_ppic}</p>}
                        </div>

                        <div className="flex justify-between items-center">
                            <Link href={route('ppic.perencanaan.pesanan.index')}>
                                <Button variant="outline">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Mengajukan...' : 'Ajukan Harga Produk'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
