import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { DialogDescription } from '@/components/ui/dialog';

// --- TYPES ---
interface BahanBaku {
    id: number;
    nama_bahan_baku: string;
    satuan_dasar: string;
    harga_standar: number;
}

interface PageProps {
    bahanBakuList: BahanBaku[];
    auth: any;
    errors: any;
    ziggy: any;
    flash: any;
    [key: string]: any;
}

// --- FORM COMPONENT ---
const CreatePurchaseRequestForm = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        catatan: '',
        items: [{ nama_item: '', jumlah: 1, satuan: '', harga_satuan: 0 }]
    });

    const handleAddItem = () => {
        setData('items', [...data.items, { nama_item: '', jumlah: 1, satuan: '', harga_satuan: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...data.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setData('items', updatedItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ppic.inventaris.pembelian.store'), {
            onSuccess: () => {
                toast.success('Permintaan pembelian berhasil dibuat!');
                reset();
            },
            onError: (e) => {
                console.error(e);
                toast.error('Gagal membuat permintaan. Periksa kembali isian form.');
            }
        });
    };
    
    const calculateTotalEstimatedCost = () => {
        return data.items.reduce((total, item) => {
            const price = Number(item.harga_satuan) || 0;
            const quantity = Number(item.jumlah) || 0;
            return total + (price * quantity);
        }, 0);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="catatan">Catatan (Opsional)</Label>
                <Textarea
                    id="catatan"
                    value={data.catatan}
                    onChange={(e) => setData('catatan', e.target.value)}
                    placeholder="Tambahkan catatan untuk bagian keuangan..."
                />
                {errors.catatan && <p className="text-xs text-red-500">{errors.catatan}</p>}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Daftar Bahan Baku</CardTitle>
                    <p className="text-sm text-muted-foreground">Tambahkan bahan baku yang ingin Anda ajukan untuk pembelian.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {data.items.map((item, index) => {
                        const itemTotal = (Number(item.jumlah) || 0) * (Number(item.harga_satuan) || 0);
                        return (
                            <div key={index} className="flex flex-col sm:flex-row items-start gap-3 p-4 border rounded-lg bg-gray-50/50">
                                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 flex-grow">
                                    <div className="space-y-1 col-span-2">
                                        <Label htmlFor={`item-nama-${index}`}>Nama Bahan Baku</Label>
                                        <Input
                                            id={`item-nama-${index}`}
                                            type="text"
                                            value={item.nama_item}
                                            onChange={(e) => handleItemChange(index, 'nama_item', e.target.value)}
                                            disabled={processing}
                                            placeholder="Contoh: Besi Beton 12mm"
                                        />
                                        {errors[`items.${index}.nama_item`] && <p className="text-xs text-red-500 mt-1">{errors[`items.${index}.nama_item`]}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`item-jumlah-${index}`}>Jumlah</Label>
                                        <Input
                                            id={`item-jumlah-${index}`}
                                            type="number"
                                            value={item.jumlah}
                                            onChange={(e) => handleItemChange(index, 'jumlah', e.target.value)}
                                            min="1"
                                            disabled={processing}
                                        />
                                        {errors[`items.${index}.jumlah`] && <p className="text-xs text-red-500 mt-1">{errors[`items.${index}.jumlah`]}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`item-satuan-${index}`}>Satuan</Label>
                                        <Input
                                            id={`item-satuan-${index}`}
                                            type="text"
                                            value={item.satuan}
                                            onChange={(e) => handleItemChange(index, 'satuan', e.target.value)}
                                            disabled={processing}
                                            placeholder="Contoh: kg, batang"
                                        />
                                        {errors[`items.${index}.satuan`] && <p className="text-xs text-red-500 mt-1">{errors[`items.${index}.satuan`]}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`item-harga-${index}`}>Harga Satuan</Label>
                                        <Input
                                            id={`item-harga-${index}`}
                                            type="number"
                                            value={item.harga_satuan}
                                            onChange={(e) => handleItemChange(index, 'harga_satuan', e.target.value)}
                                            min="0"
                                            disabled={processing}
                                            placeholder="Contoh: 75000"
                                        />
                                        {errors[`items.${index}.harga_satuan`] && <p className="text-xs text-red-500 mt-1">{errors[`items.${index}.harga_satuan`]}</p>}
                                    </div>
                                </div>
                                <div className="pt-5">
                                    <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveItem(index)} disabled={data.items.length <= 1 || processing}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                    {errors.items && <p className="text-xs text-red-500 mt-2">{errors.items}</p>}
                    <Button type="button" variant="outline" onClick={handleAddItem} disabled={processing}>
                        <Plus className="w-4 h-4 mr-2" /> Tambah Item
                    </Button>
                </CardContent>
            </Card>

            <div className="pt-4 flex justify-between items-center">
                <Link href={route('ppic.inventaris.pembelian.index')}>
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Batal
                    </Button>
                </Link>
                <div className="text-right">
                    <h3 className="text-lg font-semibold">Estimasi Total Biaya:</h3>
                    <p className="text-2xl font-bold text-blue-600">
                        Rp {calculateTotalEstimatedCost().toLocaleString('id-ID')}
                    </p>
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                    {processing ? 'Mengirim Permintaan...' : 'Kirim Permintaan ke Keuangan'}
                </Button>
            </div>
        </form>
    );
};

// --- MAIN PAGE COMPONENT ---
export default function CreatePembelian() {
    return (
        <AuthenticatedLayout
            title="Buat Permintaan Pembelian"
            breadcrumbs={[
                { title: 'Dashboard', href: '/roles/ppic' },
                { title: 'Manajemen Inventaris', href: '#' },
                { title: 'Permintaan Pembelian', href: route('ppic.inventaris.pembelian.index') },
                { title: 'Buat Baru', href: '#' }
            ]}
        >
            <Head title="Buat Permintaan Pembelian" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <FileText className="h-8 w-8 text-blue-600" />
                            Buat Permintaan Pembelian Baru
                        </h1>
                        <p className="text-gray-600 mt-1">Isi form di bawah untuk membuat permintaan pembelian bahan baku.</p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <CreatePurchaseRequestForm />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
