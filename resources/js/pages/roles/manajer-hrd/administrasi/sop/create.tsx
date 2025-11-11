import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

export default function CreateSOP() {
    const { data, setData, post, errors, processing } = useForm({
        code: '',
        title: '',
        category: 'hrd',
        department: 'HRD',
        version: '1.0',
        description: '',
        objective: '',
        scope: '',
    });

    const categories = ['hrd', 'produksi', 'keuangan', 'marketing', 'qc', 'umum'];
    const departments = ['HRD', 'Produksi', 'Keuangan', 'Marketing', 'Quality Control', 'PPIC', 'IT'];

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('manajer-hrd.administrasi.sop.store'));
    }

    return (
        <AuthenticatedLayout
            title="Buat SOP Baru"
            breadcrumbs={[
                { title: 'Dashboard', href: '/roles/manajer-hrd' },
                { title: 'Peraturan & SOP', href: route('manajer-hrd.administrasi.sop.index') },
                { title: 'Buat SOP Baru', href: '#' }
            ]}
        >
            <Head title="Buat SOP Baru" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('manajer-hrd.administrasi.sop.index')}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Buat Standard Operating Procedure (SOP) Baru</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Detail SOP</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul SOP</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Contoh: Prosedur Rekrutmen Karyawan"
                                        required
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="code">Kode SOP</Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        placeholder="Contoh: HRD-SOP-001"
                                        required
                                    />
                                    {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <Select onValueChange={(value) => setData('category', value)} defaultValue={data.category}>
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Pilih kategori..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat.toUpperCase()}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Departemen</Label>
                                    <Select onValueChange={(value) => setData('department', value)} defaultValue={data.department}>
                                        <SelectTrigger id="department">
                                            <SelectValue placeholder="Pilih departemen..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="version">Versi</Label>
                                    <Input
                                        id="version"
                                        value={data.version}
                                        onChange={(e) => setData('version', e.target.value)}
                                        required
                                    />
                                    {errors.version && <p className="text-red-500 text-xs mt-1">{errors.version}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Jelaskan secara singkat isi dan tujuan dari SOP ini."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="objective">Tujuan</Label>
                                <Textarea
                                    id="objective"
                                    value={data.objective}
                                    onChange={(e) => setData('objective', e.target.value)}
                                    placeholder="Jelaskan tujuan utama dibuatnya SOP ini."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="scope">Ruang Lingkup</Label>
                                <Textarea
                                    id="scope"
                                    value={data.scope}
                                    onChange={(e) => setData('scope', e.target.value)}
                                    placeholder="Jelaskan siapa saja dan area apa saja yang tercakup oleh SOP ini."
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <Link href={route('manajer-hrd.administrasi.sop.index')}>
                                    <Button type="button" variant="outline">Batal</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan SOP'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
