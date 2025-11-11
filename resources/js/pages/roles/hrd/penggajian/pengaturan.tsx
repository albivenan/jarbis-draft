import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, DollarSign, Clock, Calendar, Plus, Edit, Trash2, UserCheck, Calculator } from 'lucide-react';
import { route } from 'ziggy-js';

// --- TYPES ---
interface FixedComponent {
    id: string;
    nama: string;
    jenis: 'tunjangan' | 'potongan';
    tipe: 'nominal' | 'persentase';
    jumlah: number;
    keterangan: string;
}

interface SimulationInput {
    hariHadir: number;
    menitTerlambat: number;
    jamLembur: number;
}

interface SimulationOutput {
    upahDasar: number;
    upahLembur: number;
    tunjanganDinamis: number;
    tunjanganTetap: number;
    potonganKeterlambatan: number;
    potonganTetap: number;
    gajiBruto: number;
    gajiBersih: number;
}

interface BagianKerja {
    id: number;
    nama: string;
}

interface Jabatan {
    id: number;
    nama: string;
    bagian_kerja?: BagianKerja[];
}

interface PengaturanPenggajianProps {
    jabatans: Jabatan[];
    tarifPerJamRules: { [key: string]: number };
    standarJamKerja: number;
}

const TarifInput = ({ value, onChange, standarJamKerja }: { value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, standarJamKerja: number }) => {
    const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    const upahHarian = value * standarJamKerja;

    return (
        <div>
            <div className="flex items-center">
                <span className="p-2 bg-gray-100 border rounded-l-md text-sm">Rp/jam</span>
                <Input
                    type="number"
                    min={0}
                    value={value}
                    onChange={onChange}
                    className="rounded-l-none"
                    placeholder="e.g. 25000"
                />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
                Upah Harian: {formatCurrency(upahHarian)}
            </p>
        </div>
    );
};

const SimulationResultDisplay = ({ output }: { output: SimulationOutput | null }) => {
    if (!output) {
        return (
            <div className="pt-4 mt-4 border-t text-center text-muted-foreground">
                Pilih jabatan untuk melihat hasil simulasi.
            </div>
        );
    }
    const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    return (
        <div className="pt-4 mt-4 border-t space-y-2 text-sm">
            <h4 className="font-semibold text-base mb-2">Hasil Perhitungan:</h4>
            <div className="flex justify-between"><span className="text-muted-foreground">Upah Kerja Dasar</span><span>{formatCurrency(output.upahDasar)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tunjangan Kehadiran</span><span className="text-green-600">+ {formatCurrency(output.tunjanganDinamis)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tunjangan Tetap</span><span className="text-green-600">+ {formatCurrency(output.tunjanganTetap)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Upah Lembur</span><span className="text-blue-600">+ {formatCurrency(output.upahLembur)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Potongan Keterlambatan</span><span className="text-red-600">- {formatCurrency(output.potonganKeterlambatan)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Potongan Tetap</span><span className="text-red-600">- {formatCurrency(output.potonganTetap)}</span></div>
            <div className="flex justify-between font-semibold pt-2 border-t"><span className="">Gaji Bruto</span><span>{formatCurrency(output.gajiBruto)}</span></div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t"><span className="">Gaji Bersih</span><span>{formatCurrency(output.gajiBersih)}</span></div>
        </div>
    );
};

export default function PengaturanPenggajianPage({ jabatans, tarifPerJamRules: initialTarifPerJamRules, standarJamKerja }: PengaturanPenggajianProps) {
    // --- STATES ---
    const [fixedComponents, setFixedComponents] = useState<FixedComponent[]>([
        { id: '1', nama: 'Tunjangan Jabatan Manajer', jenis: 'tunjangan', tipe: 'nominal', jumlah: 1500000, keterangan: 'Untuk level manajer ke atas' },
        { id: '2', nama: 'Potongan BPJS Kesehatan', jenis: 'potongan', tipe: 'persentase', jumlah: 1, keterangan: '1% dari Gaji Pokok (dihitung dari Upah Dasar)' },
        { id: '3', nama: 'Potongan BPJS Ketenagakerjaan', jenis: 'potongan', tipe: 'persentase', jumlah: 2, keterangan: '2% dari Gaji Pokok (dihitung dari Upah Dasar)' },
    ]);
    const [showComponentModal, setShowComponentModal] = useState(false);
    const [editingComponent, setEditingComponent] = useState<FixedComponent | null>(null);
    const [componentForm, setComponentForm] = useState<Omit<FixedComponent, 'id'>>({ nama: '', jenis: 'tunjangan', tipe: 'nominal', jumlah: 0, keterangan: '' });

    const [jabatanList] = useState<Jabatan[]>(jabatans);
    const [tarifPerJamRules, setTarifPerJamRules] = useState(initialTarifPerJamRules || {});
    const [standarJamKerjaState, setStandarJamKerjaState] = useState<number>(standarJamKerja);

    const [tunjanganMakan, setTunjanganMakan] = useState(25000);
    const [tunjanganTransport, setTunjanganTransport] = useState(15000);
    const [potonganPer10Menit, setPotonganPer10Menit] = useState(5000);

    const [tanggalGajian, setTanggalGajian] = useState(25);
    const [periodePembayaran, setPeriodePembayaran] = useState('bulanan');
    const [hariGajian, setHariGajian] = useState('jumat');

    // --- Simulation States ---
    const [simulationInput, setSimulationInput] = useState<SimulationInput>({ hariHadir: 22, menitTerlambat: 30, jamLembur: 10 });
    const [selectedJabatanId, setSelectedJabatanId] = useState<number | null>(null);
    const [simulationOutput, setSimulationOutput] = useState<SimulationOutput | null>(null);


    const [isLoading, setIsLoading] = useState(false);
    const [effectiveDate, setEffectiveDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const handleSaveAllSettings = () => {
        setIsLoading(true);
        const generalSettingsData = {
            tunjangan_makan_per_hari: tunjanganMakan,
            tunjangan_transport_per_hari: tunjanganTransport,
            potongan_per_10_menit: potonganPer10Menit,
            tanggal_gajian: tanggalGajian,
            periode_pembayaran: periodePembayaran,
            hari_gajian_mingguan: hariGajian,
            effective_date: effectiveDate,
            standar_jam_kerja: standarJamKerjaState,
        };

        router.post(route('hrd.penggajian.pengaturan.update'), { tarifPerJamRules }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Pengaturan tarif per jam berhasil disimpan');
                router.post('/api/payroll/settings', generalSettingsData, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => toast.success('Pengaturan umum berhasil disimpan'),
                    onError: () => toast.error('Gagal menyimpan pengaturan umum'),
                    onFinish: () => setIsLoading(false),
                });
            },
            onError: () => {
                toast.error('Gagal menyimpan pengaturan tarif per jam');
                setIsLoading(false);
            },
        });
    };

    const handleAddComponent = () => {
        setEditingComponent(null);
        setComponentForm({ nama: '', jenis: 'tunjangan', tipe: 'nominal', jumlah: 0, keterangan: '' });
        setShowComponentModal(true);
    };

    const handleEditComponent = (component: FixedComponent) => {
        setEditingComponent(component);
        setComponentForm(component);
        setShowComponentModal(true);
    };

    const handleSaveComponent = () => {
        if (!componentForm.nama || componentForm.jumlah <= 0) {
            alert('Nama komponen dan jumlah harus diisi.');
            return;
        }
        if (editingComponent) {
            setFixedComponents(fixedComponents.map(c => c.id === editingComponent.id ? { ...componentForm, id: c.id } : c));
        } else {
            setFixedComponents([...fixedComponents, { ...componentForm, id: Date.now().toString() }]);
        }
        setShowComponentModal(false);
    };

    const handleDeleteComponent = (id: string) => {
        if (confirm('Yakin ingin menghapus komponen ini?')) {
            setFixedComponents(fixedComponents.filter(c => c.id !== id));
        }
    }

    const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    // --- Main Calculation Effect ---
    useEffect(() => {
        if (selectedJabatanId === null) {
            setSimulationOutput(null);
            return;
        };

        const jabatan = jabatanList.find(j => j.id === selectedJabatanId);
        if (!jabatan) return;

        let tarifPerJamSimulasi = tarifPerJamRules[`${jabatan.id}-default-default`] || 0;
        if (jabatan.bagian_kerja && jabatan.bagian_kerja.length > 0) {
            tarifPerJamSimulasi = tarifPerJamRules[`${jabatan.id}-${jabatan.bagian_kerja[0].id}-Senior`] || 0;
        }

        const { hariHadir, menitTerlambat, jamLembur } = simulationInput;

        const calculatedUpahDasar = tarifPerJamSimulasi * standarJamKerjaState * hariHadir;
        const dummyOvertimeRate = 50000;
        const calculatedUpahLembur = dummyOvertimeRate * jamLembur;
        const calculatedTunjanganDinamis = (tunjanganMakan + tunjanganTransport) * hariHadir;
        const calculatedPotonganKeterlambatan = Math.floor(menitTerlambat / 10) * potonganPer10Menit;
        let calculatedTunjanganTetap = 0;
        let calculatedPotonganTetap = 0;
        fixedComponents.forEach(comp => {
            if (comp.jenis === 'tunjangan') {
                calculatedTunjanganTetap += comp.tipe === 'nominal' ? comp.jumlah : calculatedUpahDasar * (comp.jumlah / 100);
            } else {
                calculatedPotonganTetap += comp.tipe === 'nominal' ? comp.jumlah : calculatedUpahDasar * (comp.jumlah / 100);
            }
        });
        const gajiBruto = calculatedUpahDasar + calculatedUpahLembur + calculatedTunjanganDinamis + calculatedTunjanganTetap - calculatedPotonganKeterlambatan - calculatedPotonganTetap;
        const calculatedGajiBersih = gajiBruto;

        setSimulationOutput({ upahDasar: calculatedUpahDasar, upahLembur: calculatedUpahLembur, tunjanganDinamis: calculatedTunjanganDinamis, tunjanganTetap: calculatedTunjanganTetap, potonganKeterlambatan: calculatedPotonganKeterlambatan, potonganTetap: calculatedPotonganTetap, gajiBruto: gajiBruto, gajiBersih: calculatedGajiBersih });

    }, [simulationInput, selectedJabatanId, tarifPerJamRules, standarJamKerjaState, tunjanganMakan, tunjanganTransport, potonganPer10Menit, fixedComponents]);


    return (
        <AuthenticatedLayout
            title="Pengaturan Penggajian"
            breadcrumbs={[{ title: 'Dashboard', href: '/roles/hrd' }, { title: 'Manajemen Penggajian', href: '#' }, { title: 'Pengaturan', href: route('hrd.penggajian.pengaturan') }]}
        >
            <Head title="Pengaturan Penggajian" />

            <div className="space-y-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Penggajian</h1>
                        <p className="text-muted-foreground max-w-2xl">
                            Pusat kendali untuk semua aturan, komponen, dan parameter perhitungan gaji.
                        </p>
                    </div>
                    <Button onClick={handleSaveAllSettings} size="lg" className="flex-shrink-0" disabled={isLoading}>
                        <Settings className="h-4 w-4 mr-2" />
                        {isLoading ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
                    </Button>
                </div>

                <Tabs defaultValue="pengaturan" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="pengaturan">Pengaturan Aturan Gaji</TabsTrigger>
                        <TabsTrigger value="simulasi">Kalkulator & Simulasi Gaji</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pengaturan">
                        <div className="mt-6 space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-gray-600" />Pengaturan Tarif per Jam</CardTitle>
                                    <CardDescription>
                                        Atur tarif per jam untuk setiap jabatan. Nilai ini akan dikalikan dengan standar jam kerja global ({standarJamKerjaState} jam/hari) untuk menentukan upah harian.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="multiple" className="w-full">
                                        {jabatanList.map(jabatan => (
                                            <AccordionItem value={`item-${jabatan.id}`} key={jabatan.id}>
                                                <AccordionTrigger className="text-base">{jabatan.nama}</AccordionTrigger>
                                                <AccordionContent>
                                                    {jabatan.bagian_kerja && jabatan.bagian_kerja.length > 0 ? (
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Bagian Kerja</TableHead>
                                                                    <TableHead>Tarif per Jam (Senior)</TableHead>
                                                                    <TableHead>Tarif per Jam (Junior)</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {jabatan.bagian_kerja.map(bagian => (
                                                                    <TableRow key={bagian.id}>
                                                                        <TableCell className="font-medium">{bagian.nama}</TableCell>
                                                                        <TableCell>
                                                                            <TarifInput
                                                                                value={tarifPerJamRules[`${jabatan.id}-${bagian.id}-Senior`] || 0}
                                                                                onChange={e => setTarifPerJamRules(prev => ({ ...prev, [`${jabatan.id}-${bagian.id}-Senior`]: Number(e.target.value) }))}
                                                                                standarJamKerja={standarJamKerjaState}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <TarifInput
                                                                                value={tarifPerJamRules[`${jabatan.id}-${bagian.id}-Junior`] || 0}
                                                                                onChange={e => setTarifPerJamRules(prev => ({ ...prev, [`${jabatan.id}-${bagian.id}-Junior`]: Number(e.target.value) }))}
                                                                                standarJamKerja={standarJamKerjaState}
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    ) : (
                                                        <div className="p-4 border rounded-md">
                                                            <Label>Tarif per Jam</Label>
                                                            <TarifInput
                                                                value={tarifPerJamRules[`${jabatan.id}-default-default`] || 0}
                                                                onChange={e => setTarifPerJamRules(prev => ({ ...prev, [`${jabatan.id}-default-default`]: Number(e.target.value) }))}
                                                                standarJamKerja={standarJamKerjaState}
                                                            />
                                                        </div>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-green-600" />Komponen Gaji Tambahan</CardTitle>
                                    <CardDescription>Kelola tunjangan dan potongan dengan jumlah tetap atau persentase.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nama Komponen</TableHead>
                                                <TableHead>Jenis</TableHead>
                                                <TableHead>Jumlah</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {fixedComponents.map(c => (
                                                <TableRow key={c.id}>
                                                    <TableCell className="font-medium">{c.nama}</TableCell>
                                                    <TableCell><Badge variant={c.jenis === 'tunjangan' ? 'default' : 'destructive'}>{c.jenis}</Badge></TableCell>
                                                    <TableCell>{c.tipe === 'nominal' ? formatCurrency(c.jumlah) : `${c.jumlah}%`}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEditComponent(c)}><Edit className="h-4 w-4" /></Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteComponent(c.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <Button onClick={handleAddComponent} className="mt-4 w-full" variant="outline"><Plus className="h-4 w-4 mr-2" />Tambah Komponen Gaji</Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><UserCheck className="h-5 w-5 text-blue-600" />Aturan Berdasarkan Kehadiran</CardTitle>
                                    <CardDescription>Atur nilai nominal untuk tunjangan harian atau denda keterlambatan.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2"><Label htmlFor="tunjanganMakan">Tunjangan Makan per Hari</Label><div className="flex items-center"><span className="p-2 bg-gray-100 border rounded-l-md">Rp</span><Input id="tunjanganMakan" type="number" min={0} value={tunjanganMakan} onChange={e => setTunjanganMakan(Number(e.target.value))} className="rounded-l-none" /></div></div>
                                    <div className="space-y-2"><Label htmlFor="tunjanganTransport">Tunjangan Transportasi per Hari</Label><div className="flex items-center"><span className="p-2 bg-gray-100 border rounded-l-md">Rp</span><Input id="tunjanganTransport" type="number" min={0} value={tunjanganTransport} onChange={e => setTunjanganTransport(Number(e.target.value))} className="rounded-l-none" /></div></div>
                                    <div className="space-y-2"><Label htmlFor="potonganPer10Menit">Potongan Keterlambatan (per 10 menit)</Label><div className="flex items-center"><span className="p-2 bg-gray-100 border rounded-l-md">Rp</span><Input id="potonganPer10Menit" type="number" min={0} value={potonganPer10Menit} onChange={e => setPotonganPer10Menit(Number(e.target.value))} className="rounded-l-none" /></div></div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-purple-600" />Jadwal & Parameter Umum</CardTitle>
                                    <CardDescription>Atur jadwal, periode, dan parameter umum proses penggajian.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="standarJamKerjaInput">Standar Jam Kerja per Hari</Label>
                                        <div className="flex items-center">
                                            <Input id="standarJamKerjaInput" type="number" min={0} value={standarJamKerjaState} onChange={e => setStandarJamKerjaState(Number(e.target.value))} className="rounded-r-none" />
                                            <span className="p-2 bg-gray-100 border rounded-r-md">Jam</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="effectiveDate">Tanggal Efektif Perubahan</Label>
                                        <Input id="effectiveDate" type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} />
                                    </div>
                                    <div className="space-y-2"><Label htmlFor="periodePembayaran">Periode Pembayaran</Label><Select value={periodePembayaran} onValueChange={(v: 'bulanan' | 'mingguan') => setPeriodePembayaran(v)}><SelectTrigger id="periodePembayaran"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="bulanan">Bulanan</SelectItem><SelectItem value="mingguan">Mingguan</SelectItem></SelectContent></Select></div>
                                    {periodePembayaran === 'bulanan' ? (
                                        <div className="space-y-2">
                                            <Label htmlFor="tanggalGajian">Tanggal Gajian Setiap Bulan</Label>
                                            <Select value={tanggalGajian.toString()} onValueChange={v => setTanggalGajian(Number(v))}><SelectTrigger id="tanggalGajian"><SelectValue /></SelectTrigger><SelectContent>{Array.from({ length: 28 }, (_, i) => i + 1).map(day => (<SelectItem key={day} value={day.toString()}>{day}</SelectItem>))}</SelectContent></Select>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Label htmlFor="hariGajian">Hari Gajian Setiap Minggu</Label>
                                            <Select value={hariGajian} onValueChange={setHariGajian}><SelectTrigger id="hariGajian"><SelectValue /></SelectTrigger><SelectContent>
                                                <SelectItem value="senin">Senin</SelectItem>
                                                <SelectItem value="selasa">Selasa</SelectItem>
                                                <SelectItem value="rabu">Rabu</SelectItem>
                                                <SelectItem value="kamis">Kamis</SelectItem>
                                                <SelectItem value="jumat">Jumat</SelectItem>
                                            </SelectContent></Select>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="simulasi">
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" />Kalkulator Gaji Tunggal</CardTitle>
                                <CardDescription>Masukkan parameter, pilih jabatan, dan lihat hasil simulasi gaji secara instan.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4 p-4 border rounded-lg">
                                    <h4 className="font-medium">1. Masukkan Parameter Simulasi</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2"><Label>Total Hari Hadir</Label><Input type="number" value={simulationInput.hariHadir} onChange={e => setSimulationInput(p => ({ ...p, hariHadir: Number(e.target.value) }))} /></div>
                                        <div className="space-y-2"><Label>Total Jam Lembur</Label><Input type="number" value={simulationInput.jamLembur} onChange={e => setSimulationInput(p => ({ ...p, jamLembur: Number(e.target.value) }))} /></div>
                                        <div className="space-y-2"><Label>Total Menit Terlambat</Label><Input type="number" value={simulationInput.menitTerlambat} onChange={e => setSimulationInput(p => ({ ...p, menitTerlambat: Number(e.target.value) }))} /></div>
                                    </div>
                                </div>

                                <div className="space-y-4 p-4 border rounded-lg">
                                    <h4 className="font-medium">2. Pilih Jabatan</h4>
                                    <Select
                                        value={selectedJabatanId?.toString() ?? ''}
                                        onValueChange={(value) => setSelectedJabatanId(value ? Number(value) : null)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih jabatan untuk simulasi..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {jabatanList.map(jabatan => (
                                                <SelectItem key={jabatan.id} value={jabatan.id.toString()}>
                                                    {jabatan.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-muted-foreground">
                                        Memilih jabatan akan menggunakan tarif per jam yang telah diatur untuk menghitung simulasi gaji.
                                    </p>
                                </div>

                                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                                    <h4 className="font-medium">3. Hasil Simulasi</h4>
                                    <SimulationResultDisplay output={simulationOutput} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <Dialog open={showComponentModal} onOpenChange={setShowComponentModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingComponent ? 'Edit' : 'Tambah'} Komponen Gaji Tetap</DialogTitle>
                            <DialogDescription>Buat komponen gaji yang dapat digunakan kembali.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2"><Label>Nama Komponen</Label><Input value={componentForm.nama} onChange={e => setComponentForm({ ...componentForm, nama: e.target.value })} placeholder="Contoh: Tunjangan Jabatan" /></div>
                            <div className="space-y-2"><Label>Jenis</Label><Select value={componentForm.jenis} onValueChange={(v: 'tunjangan' | 'potongan') => setComponentForm({ ...componentForm, jenis: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="tunjangan">Tunjangan</SelectItem><SelectItem value="potongan">Potongan</SelectItem></SelectContent></Select></div>
                            <div className="space-y-2"><Label>Tipe Nilai</Label><Select value={componentForm.tipe} onValueChange={(v: 'nominal' | 'persentase') => setComponentForm({ ...componentForm, tipe: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="nominal">Nominal (Rp)</SelectItem><SelectItem value="persentase">Persentase (%)</SelectItem></SelectContent></Select></div>
                            <div className="space-y-2"><Label>Jumlah</Label><Input type="number" value={componentForm.jumlah} onChange={e => setComponentForm({ ...componentForm, jumlah: Number(e.target.value) })} /></div>
                            <div className="space-y-2"><Label>Keterangan</Label><Input value={componentForm.keterangan} onChange={e => setComponentForm({ ...componentForm, keterangan: e.target.value })} placeholder="Contoh: Diberikan untuk level manajer" /></div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowComponentModal(false)}>Batal</Button>
                            <Button onClick={handleSaveComponent}>Simpan</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
