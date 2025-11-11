import React from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { useSumberDanaData } from '@/pages/roles/Keuangan/Harian/sumber-dana/hooks/useSumberDanaData';

import { JENIS_PENGELUARAN, jenisPengeluaranValues, JenisPengeluaran, STATUS_PENGELUARAN, StatusPengeluaran, statusPengeluaranValues } from './utils/constants';

interface SumberDanaOption {
    id: number;
    nama_sumber: string;
    tipe_sumber: 'Tunai' | 'Bank';
    saldo: number;
    is_main_account: boolean;
}

interface FormDataType {
    description: string;
    amount: string;
    jenis_pengeluaran: JenisPengeluaran;
    catatan: string;
    invoice: File | null;
    status: StatusPengeluaran;
    sumber_dana_id: number | null;
}

export default function CreatePengeluaran() {
    const { sumberDana, handlePengeluaran, fetchData } = useSumberDanaData();

    const tunaiAccount = sumberDana.find(sd => sd.tipe_sumber === 'Tunai');
    const tunaiAccountId = tunaiAccount?.id || null;

    const sumberDanaOptions: SumberDanaOption[] = sumberDana.map(sd => ({
        id: sd.id,
        nama_sumber: sd.name,
        tipe_sumber: sd.tipe_sumber,
        saldo: sd.balance,
        is_main_account: sd.tipe_sumber === 'Bank' && sd.name.includes('Utama'), // Assuming 'Utama' in name indicates main bank account
    }));

    const { data, setData, post, processing, errors } = useForm<FormDataType>({
        description: '',
        amount: '',
        jenis_pengeluaran: JENIS_PENGELUARAN.OPERASIONAL,
        catatan: '',
        invoice: null,
        status: STATUS_PENGELUARAN.DRAFT,
        sumber_dana_id: tunaiAccountId || null,
    });

    const [invoicePreview, setInvoicePreview] = React.useState<string | null>(null);
    const [localErrors, setLocalErrors] = React.useState<Partial<Record<keyof FormDataType, string>>>({});

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setData('invoice', file);
            setInvoicePreview(URL.createObjectURL(file));
        }
    }

    function handleRemoveFile() {
        setData('invoice', null);
        if (invoicePreview) {
            URL.revokeObjectURL(invoicePreview);
            setInvoicePreview(null);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const newErrors: Partial<Record<keyof FormDataType, string>> = {};

        if (!data.description) {
            newErrors.description = 'Deskripsi wajib diisi.';
        } else if (data.description.length > 255) {
            newErrors.description = 'Deskripsi tidak boleh lebih dari 255 karakter.';
        }

        if (!data.amount || parseFloat(data.amount.toString()) <= 0) { // Ensure amount is treated as string for parseFloat
            newErrors.amount = 'Jumlah wajib diisi dan harus lebih besar dari 0.';
        }

        if (!data.jenis_pengeluaran) {
            newErrors.jenis_pengeluaran = 'Jenis Pengeluaran wajib dipilih.';
        } else if (!jenisPengeluaranValues.includes(data.jenis_pengeluaran)) {
            newErrors.jenis_pengeluaran = 'Jenis Pengeluaran tidak valid.';
        }

        if (data.invoice && !data.invoice.type.startsWith('image/')) {
            newErrors.invoice = 'File invoice harus berupa gambar.';
        }

        if (!data.status) {
            newErrors.status = 'Status wajib dipilih.';
        } else if (!statusPengeluaranValues.includes(data.status)) {
            newErrors.status = 'Status tidak valid.';
        }

        if (!data.sumber_dana_id) {
            newErrors.sumber_dana_id = 'Sumber Dana wajib dipilih.';
        }

        setLocalErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return; // Prevent form submission if there are local errors
        }

        post(route('keuangan.harian.pengeluaran.store'), {
            onSuccess: () => {
                fetchData(); // Re-fetch data to update balances
                // Optionally, you can reset the form here if needed
                // reset();
            },
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Pengeluaran" />

            <div className="space-y-6 max-w-4xl mx-auto">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* We assume this route name exists */}
                        <Link href={route('keuangan.harian.pengeluaran.index')}>
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Tambah Pengeluaran Baru</h1>
                            <p className="text-gray-600 mt-1">Isi form di bawah untuk mencatat transaksi pengeluaran baru.</p>
                        </div>
                    </div>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Pengeluaran</CardTitle>
                        <CardDescription>Pastikan semua data yang dimasukkan sudah benar sebelum menyimpan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Jumlah (Rp)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    placeholder="Contoh: 500000"
                                    required
                                />
                                {(localErrors.amount || errors.amount) && <p className="text-sm text-red-600 mt-1">{localErrors.amount || errors.amount}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="jenis_pengeluaran">Jenis Pengeluaran</Label>
                                <Select value={data.jenis_pengeluaran} onValueChange={(value: JenisPengeluaran) => setData('jenis_pengeluaran', value)}>
                                    <SelectTrigger id="jenis_pengeluaran">
                                        <SelectValue placeholder="Pilih jenis pengeluaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jenisPengeluaranValues.filter(jenis => jenis !== JENIS_PENGELUARAN.PEMBELIAN_BAHAN_BAKU).map(jenis => (
                                            <SelectItem key={jenis} value={jenis}>{jenis}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {(localErrors.jenis_pengeluaran || errors.jenis_pengeluaran) && <p className="text-sm text-red-600 mt-1">{localErrors.jenis_pengeluaran || errors.jenis_pengeluaran}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={data.status} onValueChange={(value: StatusPengeluaran) => setData('status', value)}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusPengeluaranValues.map(status => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {(localErrors.status || errors.status) && <p className="text-sm text-red-600 mt-1">{localErrors.status || errors.status}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sumber_dana_id">Sumber Dana</Label>
                                <Select
                                    value={data.sumber_dana_id?.toString() || ''}
                                    onValueChange={(value: string) => {
                                        setData('sumber_dana_id', parseInt(value));
                                    }}
                                >
                                    <SelectTrigger id="sumber_dana_id">
                                        <SelectValue placeholder="Pilih sumber dana" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sumberDanaOptions.map(sumber => (
                                            <SelectItem key={sumber.id} value={sumber.id.toString()}>
                                                {sumber.nama_sumber} {sumber.tipe_sumber === 'Bank' && sumber.is_main_account ? '(Utama)' : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {(localErrors.sumber_dana_id || errors.sumber_dana_id) && <p className="text-sm text-red-600 mt-1">{localErrors.sumber_dana_id || errors.sumber_dana_id}</p>}
                            </div>

                            {data.sumber_dana_id && data.status === STATUS_PENGELUARAN.FINAL && (
                                <div className="space-y-2">
                                    <Label>Saldo Saat Ini</Label>
                                    <p className="text-lg font-semibold text-gray-700">
                                        {formatCurrency(parseFloat(String(sumberDanaOptions.find(s => s.id === data.sumber_dana_id)?.saldo || '0')))}
                                    </p>
                                    <p className="text-sm text-gray-500">Saldo ini adalah saldo real dari sumber dana yang dipilih.</p>

                                    {data.amount && parseFloat(data.amount) > 0 && (
                                        <div className="mt-2 p-2 border rounded-md bg-blue-50">
                                            <p className="text-sm text-blue-700">
                                                Estimasi Saldo Akhir: {formatCurrency(
                                                    (parseFloat(String(sumberDanaOptions.find(s => s.id === data.sumber_dana_id)?.saldo || '0')) - parseFloat(data.amount))
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">*Estimasi saldo setelah operasi ini.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Contoh: Pembelian bahan baku"
                                    required
                                />
                                {(localErrors.description || errors.description) && <p className="text-sm text-red-600 mt-1">{localErrors.description || errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="catatan">Catatan (Opsional)</Label>
                                <Textarea
                                    id="catatan"
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    placeholder="Catatan tambahan jika ada"
                                />
                                {(localErrors.catatan || errors.catatan) && <p className="text-sm text-red-600 mt-1">{localErrors.catatan || errors.catatan}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="invoice">Invoice/Bukti</Label>
                                {invoicePreview ? (
                                    <div className="space-y-2">
                                        <img src={invoicePreview} alt="Invoice preview" className="w-full max-w-xs rounded-md border" />
                                        <Button type="button" variant="destructive" size="sm" onClick={handleRemoveFile}>
                                            Hapus Foto
                                        </Button>
                                    </div>
                                ) : (
                                    <Input
                                        id="invoice"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                    />
                                )}
                                {(localErrors.invoice || errors.invoice) && <p className="text-sm text-red-600 mt-1">{localErrors.invoice || errors.invoice}</p>}
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Link href={route('keuangan.harian.pengeluaran.index')} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2">
                                    Batal
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Pengeluaran'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
