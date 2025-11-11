import { default as AuthenticatedLayout } from '@/layouts/authenticated-layout';
import { Head, usePage, useForm } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core'; // Import Inertia's PageProps
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    User,
    Briefcase,
    Building2,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Home,
    IdCard,
    Heart,
    Users,
    FileText,
    Download,
    AlertCircle,
    CheckCircle2,
    Pencil,
    Banknote,
    Landmark,
    History
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface EmployeeData {
    id_karyawan: string;
    nama_lengkap: string;
    nik_ktp: string;
    nik_perusahaan: string;
    tanggal_lahir: string;
    tempat_lahir: string;
    jenis_kelamin: string;
    status_pernikahan: string;
    agama: string;
    golongan_darah: string;
    kewarganegaraan: string;
    pekerjaan_ktp: string;
    nomor_npwp: string;
    nomor_bpjs_kesehatan: string;
    nomor_bpjs_ketenagakerjaan: string;
    alamat_ktp: string;
    alamat_domisili: string;
    foto_profil_url?: string;
    kontak_karyawan?: {
        email_perusahaan: string;
        email_pribadi: string;
        nomor_telepon: string;
        nama_bank: string;
        nomor_rekening: string;
        nama_pemilik_rekening: string;
    };
    rincian_pekerjaan?: {
        jabatan?: {
            nama_jabatan: string;
        };
        departemen?: {
            nama_departemen: string;
        };
        bagian_kerja?: {
            nama_bagian_kerja: string;
        };
        tanggal_bergabung: string;
        status_karyawan: string;
        lokasi_kerja: string;
    };
    education?: EducationData[]; // Add this line
}

interface DocumentData {
    id: string;
    nama_dokumen: string;
    jenis_dokumen: string;
    tanggal_unggah: string;
    url: string;
}

interface EmergencyContactData {
    id_emergency_contact: string;
    nama: string;
    hubungan: string;
    nomor_telepon: string;
}

interface EducationData {
    id: number;
    id_karyawan: string;
    jenjang: string;
    institusi: string;
    jurusan: string;
    kota: string;
    negara: string;
    tahun_mulai: number;
    tahun_selesai: number;
    ipk: number;
    nomor_ijazah: string;
    tanggal_ijazah: string;
    file_ijazah: string;
    is_lulus: boolean;
    catatan: string;
}

// Extend Inertia's PageProps
interface CustomPageProps extends InertiaPageProps {
    employeeData: EmployeeData;
    documents: DocumentData[];
    emergencyContacts: EmergencyContactData[];
    userEmail: string;
}

const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
};

export default function IdentitasDiriIndex() {
    const { employeeData, documents, emergencyContacts, userEmail, auth } = usePage<CustomPageProps>().props;
    const [showKtpEditModal, setShowKtpEditModal] = useState(false);
    const [showContactEditModal, setShowContactEditModal] = useState(false);
    const [showTaxEditModal, setShowTaxEditModal] = useState(false);
    const [showBankEditModal, setShowBankEditModal] = useState(false);
    
    // Determine route prefix based on user role
    const getRoutePrefix = () => {
        const role = auth?.user?.role || '';
        if (role === 'crew_kayu') return 'crew-kayu';
        if (role === 'crew_besi') return 'crew-besi';
        // Fallback: detect from current URL
        const path = window.location.pathname;
        if (path.includes('crew-kayu')) return 'crew-kayu';
        if (path.includes('crew-besi')) return 'crew-besi';
        return 'crew-kayu'; // default fallback
    };
    
    const routePrefix = getRoutePrefix();

    const formKtp = useForm({
        nama_lengkap: employeeData.nama_lengkap || '',
        nik_ktp: employeeData.nik_ktp || '',
        tempat_lahir: employeeData.tempat_lahir || '',
        tanggal_lahir: employeeData.tanggal_lahir ? format(new Date(employeeData.tanggal_lahir), 'yyyy-MM-dd') : '',
        jenis_kelamin: employeeData.jenis_kelamin || '',
        golongan_darah: employeeData.golongan_darah || '',
        agama: employeeData.agama || '',
        status_pernikahan: employeeData.status_pernikahan || '',
        kewarganegaraan: employeeData.kewarganegaraan || '',
        pekerjaan_ktp: employeeData.pekerjaan_ktp || '',
        alamat_ktp: employeeData.alamat_ktp || '',
    });

    const formContact = useForm({
        email_pribadi: employeeData.kontak_karyawan?.email_pribadi || '',
        nomor_telepon: employeeData.kontak_karyawan?.nomor_telepon || '',
        alamat_domisili: employeeData.alamat_domisili || '',
    });

    const formTax = useForm({
        nomor_npwp: employeeData.nomor_npwp || '',
        nomor_bpjs_kesehatan: employeeData.nomor_bpjs_kesehatan || '',
        nomor_bpjs_ketenagakerjaan: employeeData.nomor_bpjs_ketenagakerjaan || '',
    });

    const formBank = useForm({
        nama_bank: employeeData.kontak_karyawan?.nama_bank || '',
        nomor_rekening: employeeData.kontak_karyawan?.nomor_rekening || '',
        nama_pemilik_rekening: employeeData.kontak_karyawan?.nama_pemilik_rekening || '',
    });

    const getInitials = (name: string) => {
        return name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
    };

    // Update InfoItem prop type for value
    const InfoItem = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | undefined, color?: string }) => (
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="mt-0.5">
                <Icon className={cn("h-5 w-5 text-muted-foreground", color)} />
            </div>
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold">{value || '-'}</p>
            </div>
        </div>
    );

    const CardHeaderWithEdit = ({ title, description, onEditClick }: { title: string, description: string, onEditClick?: () => void }) => (
        <CardHeader className="flex flex-row items-start justify-between">
            <div className="space-y-1.5">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </div>
            {onEditClick && (
                <Button variant="outline" size="sm" className="gap-2" onClick={onEditClick}>
                    <Pencil className="h-4 w-4" />
                    Ajukan Perubahan
                </Button>
            )}
        </CardHeader>
    );

    const handleSubmitKtp = (e: React.FormEvent) => {
        e.preventDefault();
        formKtp.post(route(`${routePrefix}.profile.update-ktp`), {
            onSuccess: () => {
                setShowKtpEditModal(false);
                alert('Pengajuan perubahan identitas KTP berhasil dikirim!');
            },
            onError: (errors) => {
                console.error('Error submitting KTP data:', errors);
                alert('Gagal mengajukan perubahan identitas KTP.');
            },
        });
    };

    const handleSubmitContact = (e: React.FormEvent) => {
        e.preventDefault();
        formContact.post(route(`${routePrefix}.profile.update-contact`), {
            onSuccess: () => {
                setShowContactEditModal(false);
                alert('Pengajuan perubahan informasi kontak berhasil dikirim!');
            },
            onError: (errors) => {
                console.error('Error submitting contact data:', errors);
                alert('Gagal mengajukan perubahan informasi kontak.');
            },
        });
    };

    const handleSubmitTax = (e: React.FormEvent) => {
        e.preventDefault();
        formTax.post(route(`${routePrefix}.profile.update-tax`), {
            onSuccess: () => {
                setShowTaxEditModal(false);
                alert('Pengajuan perubahan data pajak & jaminan sosial berhasil dikirim!');
            },
            onError: (errors) => {
                console.error('Error submitting tax data:', errors);
                alert('Gagal mengajukan perubahan data pajak & jaminan sosial.');
            },
        });
    };

    const handleSubmitBank = (e: React.FormEvent) => {
        e.preventDefault();
        formBank.post(route(`${routePrefix}.profile.update-bank`), {
            onSuccess: () => {
                setShowBankEditModal(false);
                alert('Pengajuan perubahan informasi bank berhasil dikirim!');
            },
            onError: (errors) => {
                console.error('Error submitting bank data:', errors);
                alert('Gagal mengajukan perubahan informasi bank.');
            },
        });
    };

    return (
        <AuthenticatedLayout title="Profil Saya">
            <Head title="Profil Saya" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Profile Card */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                                    <AvatarImage src={employeeData?.foto_profil_url} alt={employeeData?.nama_lengkap} />
                                    <AvatarFallback className="text-2xl font-bold">
                                        {getInitials(employeeData?.nama_lengkap)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-center md:text-left space-y-2">
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <h1 className="text-3xl font-bold">{employeeData?.nama_lengkap || 'Nama Tidak Tersedia'}</h1>
                                        <a href={route(`${routePrefix}.history-perubahan-data`)}>
                                            <Button variant="outline" size="icon" title="Riwayat Perubahan Data">
                                                <History className="h-4 w-4" />
                                            </Button>
                                        </a>
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        <Badge variant="default" className="gap-1">
                                            <Briefcase className="h-3 w-3" />
                                            {employeeData?.rincian_pekerjaan?.jabatan?.nama_jabatan || 'Jabatan'}
                                        </Badge>
                                        <Badge variant="secondary" className="gap-1">
                                            <Building2 className="h-3 w-3" />
                                            {employeeData?.rincian_pekerjaan?.departemen?.nama_departemen || 'Departemen'}
                                        </Badge>
                                        <Badge variant="outline" className="gap-1">
                                            <IdCard className="h-3 w-3" />
                                            {employeeData?.nik_perusahaan || 'NIK'}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-center md:justify-start pt-2">
                                        <div className="flex items-center gap-1">
                                            <Mail className="h-4 w-4" />
                                            {userEmail || '-'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Phone className="h-4 w-4" />
                                            {employeeData?.kontak_karyawan?.nomor_telepon || '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="status-kepegawaian" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto">
                            <TabsTrigger value="status-kepegawaian">Status Kepegawaian</TabsTrigger>
                            <TabsTrigger value="identitas-kontak">Identitas & Kontak</TabsTrigger>
                            <TabsTrigger value="data-tambahan">Data Tambahan</TabsTrigger>
                            <TabsTrigger value="riwayat-pendidikan">Riwayat Pendidikan</TabsTrigger>
                            <TabsTrigger value="documents">Dokumen</TabsTrigger>
                            <TabsTrigger value="emergency-contacts">Kontak Darurat</TabsTrigger>
                        </TabsList>

                        <TabsContent value="status-kepegawaian" className="space-y-4 mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Kepegawaian</CardTitle>
                                    <CardDescription>Detail status dan informasi pekerjaan Anda di perusahaan. Data ini tidak dapat diubah langsung.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoItem
                                            icon={IdCard}
                                            label="NIK Perusahaan"
                                            value={employeeData?.nik_perusahaan}
                                            color="text-sky-500"
                                        />
                                        <InfoItem
                                            icon={Briefcase}
                                            label="Jabatan"
                                            value={employeeData?.rincian_pekerjaan?.jabatan?.nama_jabatan}
                                            color="text-sky-500"
                                        />
                                        <InfoItem
                                            icon={Building2}
                                            label="Departemen"
                                            value={employeeData?.rincian_pekerjaan?.departemen?.nama_departemen}
                                            color="text-sky-500"
                                        />
                                        <InfoItem
                                            icon={Users}
                                            label="Bagian Kerja"
                                            value={employeeData?.rincian_pekerjaan?.bagian_kerja?.nama_bagian_kerja}
                                            color="text-sky-500"
                                        />
                                        <InfoItem
                                            icon={Calendar}
                                            label="Tanggal Bergabung"
                                            value={employeeData?.rincian_pekerjaan?.tanggal_bergabung
                                                ? format(new Date(employeeData.rincian_pekerjaan.tanggal_bergabung), 'dd MMMM yyyy', { locale: id })
                                                : '-'}
                                            color="text-sky-500"
                                        />
                                        <InfoItem
                                            icon={CheckCircle2}
                                            label="Status Karyawan"
                                            value={employeeData?.rincian_pekerjaan?.status_karyawan}
                                            color="text-sky-500"
                                        />
                                        <InfoItem
                                            icon={MapPin}
                                            label="Lokasi Kerja"
                                            value={employeeData?.rincian_pekerjaan?.lokasi_kerja}
                                            color="text-sky-500"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="identitas-kontak" className="space-y-4 mt-4">
                            <Card>
                                <CardHeaderWithEdit title="Identitas Sesuai KTP" description="Informasi identitas pribadi sesuai data KTP" onEditClick={() => setShowKtpEditModal(true)} />
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoItem icon={User} label="Nama Lengkap" value={employeeData?.nama_lengkap} color="text-indigo-500" />
                                        <InfoItem icon={IdCard} label="NIK KTP" value={employeeData?.nik_ktp} color="text-indigo-500" />
                                        <InfoItem icon={MapPin} label="Tempat Lahir" value={employeeData?.tempat_lahir} color="text-indigo-500" />
                                        <InfoItem
                                            icon={Calendar}
                                            label="Tanggal Lahir"
                                            value={employeeData?.tanggal_lahir
                                                ? format(new Date(employeeData.tanggal_lahir), 'dd MMMM yyyy', { locale: id })
                                                : '-'}
                                            color="text-indigo-500"
                                        />
                                        <InfoItem icon={User} label="Jenis Kelamin" value={employeeData?.jenis_kelamin} color="text-indigo-500" />
                                        <InfoItem icon={Heart} label="Golongan Darah" value={employeeData?.golongan_darah} color="text-indigo-500" />
                                        <InfoItem icon={User} label="Agama" value={employeeData?.agama} color="text-indigo-500" />
                                        <InfoItem icon={Users} label="Status Perkawinan" value={employeeData?.status_pernikahan} color="text-indigo-500" />
                                        <InfoItem icon={User} label="Kewarganegaraan" value={employeeData?.kewarganegaraan} color="text-indigo-500" />
                                        <InfoItem icon={Briefcase} label="Pekerjaan (KTP)" value={employeeData?.pekerjaan_ktp} color="text-indigo-500" />
                                        <div className="md:col-span-2">
                                            <InfoItem icon={Home} label="Alamat Sesuai KTP" value={employeeData?.alamat_ktp} color="text-indigo-500" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* KTP Edit Modal */}
                            <Dialog open={showKtpEditModal} onOpenChange={setShowKtpEditModal}>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Ajukan Perubahan Identitas KTP</DialogTitle>
                                        <DialogDescription>
                                            Isi formulir di bawah untuk mengajukan perubahan data identitas sesuai KTP Anda.
                                            Perubahan akan ditinjau oleh HRD.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmitKtp} className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nama_lengkap" className="text-right">Nama Lengkap</Label>
                                            <Input id="nama_lengkap" value={formKtp.data.nama_lengkap} onChange={e => formKtp.setData('nama_lengkap', e.target.value)} className="col-span-3" />
                                            {formKtp.errors.nama_lengkap && <div className="col-span-4 text-right text-red-500 text-sm">{formKtp.errors.nama_lengkap}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nik_ktp" className="text-right">NIK KTP</Label>
                                            <Input id="nik_ktp" value={formKtp.data.nik_ktp} onChange={e => formKtp.setData('nik_ktp', e.target.value)} className="col-span-3" />
                                            {formKtp.errors.nik_ktp && <div className="col-span-4 text-right text-red-500 text-sm">{formKtp.errors.nik_ktp}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="tempat_lahir" className="text-right">Tempat Lahir</Label>
                                            <Input id="tempat_lahir" value={formKtp.data.tempat_lahir} onChange={e => formKtp.setData('tempat_lahir', e.target.value)} className="col-span-3" />
                                            {formKtp.errors.tempat_lahir && <div className="col-span-4 text-right text-red-500 text-sm">{formKtp.errors.tempat_lahir}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="tanggal_lahir" className="text-right">Tanggal Lahir</Label>
                                            <Input type="date" id="tanggal_lahir" value={formKtp.data.tanggal_lahir} onChange={e => formKtp.setData('tanggal_lahir', e.target.value)} className="col-span-3" />
                                            {formKtp.errors.tanggal_lahir && <div className="col-span-4 text-right text-red-500 text-sm">{formKtp.errors.tanggal_lahir}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="jenis_kelamin" className="text-right">Jenis Kelamin</Label>
                                            <Select value={formKtp.data.jenis_kelamin} onValueChange={value => formKtp.setData('jenis_kelamin', value)}>
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {formKtp.errors.jenis_kelamin && <div className="col-span-4 text-right text-red-500 text-sm">{formKtp.errors.jenis_kelamin}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="golongan_darah" className="text-right">Golongan Darah</Label>
                                            <Select value={formKtp.data.golongan_darah} onValueChange={value => formKtp.setData('golongan_darah', value)}>
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Pilih Golongan Darah" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="A">A</SelectItem>
                                                    <SelectItem value="B">B</SelectItem>
                                                    <SelectItem value="AB">AB</SelectItem>
                                                    <SelectItem value="O">O</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {formKtp.errors.golongan_darah && <div className="col-span-4 text-right text-red-500 text-sm">{formKtp.errors.golongan_darah}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="agama" className="text-right">Agama</Label>
                                            <Select value={formKtp.data.agama} onValueChange={value => formKtp.setData('agama', value)}>
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Pilih Agama" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Islam">Islam</SelectItem>
                                                    <SelectItem value="Kristen">Kristen</SelectItem>
                                                    <SelectItem value="Katolik">Katolik</SelectItem>
                                                    <SelectItem value="Hindu">Hindu</SelectItem>
                                                    <SelectItem value="Buddha">Buddha</SelectItem>
                                                    <SelectItem value="Konghucu">Konghucu</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {formKtp.errors.agama && <div className="col-span-4 text-right text-red-500 text-sm">{formKtp.errors.agama}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="status_pernikahan" className="text-right">Status Perkawinan</Label>
                                            <Select value={formKtp.data.status_pernikahan} onValueChange={value => formKtp.setData('status_pernikahan', value)}>
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Pilih Status Perkawinan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Belum Menikah">Belum Menikah</SelectItem>
                                                    <SelectItem value="Menikah">Menikah</SelectItem>
                                                    <SelectItem value="Cerai">Cerai</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {formKtp.errors.status_pernikahan && <div className="col-span-4 text-right text-red-500 text-sm">{formKtp.errors.status_pernikahan}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="kewarganegaraan" className="text-right">Kewarganegaraan</Label>
                                            <Input id="kewarganegaraan" value={formKtp.data.kewarganegaraan} onChange={e => formKtp.setData('kewarganegaraan', e.target.value)} className="col-span-3" />
                                            {formKtp.errors.kewarganegaraan && <div className="col-span-4 text-right text-red-500 text-sm">{formKtp.errors.kewarganegaraan}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="pekerjaan_ktp" className="text-right">Pekerjaan (KTP)</Label>
                                            <Input id="pekerjaan_ktp" value={formKtp.data.pekerjaan_ktp} onChange={e => formKtp.setData('pekerjaan_ktp', e.target.value)} className="col-span-3" />
                                            {formKtp.errors.pekerjaan_ktp && <div className="col-span-4 text-right text-red-500 text-sm">{formKtp.errors.pekerjaan_ktp}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="alamat_ktp" className="text-right">Alamat Sesuai KTP</Label>
                                            <Textarea id="alamat_ktp" value={formKtp.data.alamat_ktp} onChange={e => formKtp.setData('alamat_ktp', e.target.value)} className="col-span-3" />
                                            {formKtp.errors.alamat_ktp && <div className="col-span-4 text-right text-red-500 text-sm">{formKtp.errors.alamat_ktp}</div>}
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setShowKtpEditModal(false)}>Batal</Button>
                                            <Button type="submit" disabled={formKtp.processing}>Ajukan Perubahan</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                            <Card>
                                <CardHeaderWithEdit title="Informasi Kontak" description="Alamat domisili dan kontak yang dapat dihubungi" onEditClick={() => setShowContactEditModal(true)} />
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoItem icon={Mail} label="Email Perusahaan" value={userEmail} color="text-green-500" />
                                        <InfoItem icon={Mail} label="Email Pribadi" value={employeeData?.kontak_karyawan?.email_pribadi} color="text-green-500" />
                                        <InfoItem icon={Phone} label="Nomor Telepon" value={employeeData?.kontak_karyawan?.nomor_telepon} color="text-green-500" />
                                        <div className="md:col-span-2">
                                            <InfoItem icon={Home} label="Alamat Domisili" value={employeeData?.alamat_domisili} color="text-green-500" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Edit Modal */}
                            <Dialog open={showContactEditModal} onOpenChange={setShowContactEditModal}>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Ajukan Perubahan Informasi Kontak</DialogTitle>
                                        <DialogDescription>
                                            Isi formulir di bawah untuk mengajukan perubahan data informasi kontak Anda.
                                            Perubahan akan ditinjau oleh HRD.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmitContact} className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="email_pribadi" className="text-right">Email Pribadi</Label>
                                            <Input id="email_pribadi" type="email" value={formContact.data.email_pribadi} onChange={e => formContact.setData('email_pribadi', e.target.value)} className="col-span-3" />
                                            {formContact.errors.email_pribadi && <div className="col-span-4 text-right text-red-500 text-sm">{formContact.errors.email_pribadi}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nomor_telepon" className="text-right">Nomor Telepon</Label>
                                            <Input id="nomor_telepon" value={formContact.data.nomor_telepon} onChange={e => formContact.setData('nomor_telepon', e.target.value)} className="col-span-3" />
                                            {formContact.errors.nomor_telepon && <div className="col-span-4 text-right text-red-500 text-sm">{formContact.errors.nomor_telepon}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="alamat_domisili" className="text-right">Alamat Domisili</Label>
                                            <Textarea id="alamat_domisili" value={formContact.data.alamat_domisili} onChange={e => formContact.setData('alamat_domisili', e.target.value)} className="col-span-3" />
                                            {formContact.errors.alamat_domisili && <div className="col-span-4 text-right text-red-500 text-sm">{formContact.errors.alamat_domisili}</div>}
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setShowContactEditModal(false)}>Batal</Button>
                                            <Button type="submit" disabled={formContact.processing}>Ajukan Perubahan</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </TabsContent>

                        <TabsContent value="data-tambahan" className="space-y-4 mt-4">
                            <Card>
                                <CardHeaderWithEdit title="Pajak & Jaminan Sosial" description="Informasi terkait NPWP dan BPJS" onEditClick={() => setShowTaxEditModal(true)} />
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoItem icon={IdCard} label="Nomor NPWP" value={employeeData?.nomor_npwp} color="text-amber-500" />
                                        <InfoItem icon={Heart} label="Nomor BPJS Kesehatan" value={employeeData?.nomor_bpjs_kesehatan} color="text-amber-500" />
                                        <InfoItem icon={Briefcase} label="Nomor BPJS Ketenagakerjaan" value={employeeData?.nomor_bpjs_ketenagakerjaan} color="text-amber-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tax Edit Modal */}
                            <Dialog open={showTaxEditModal} onOpenChange={setShowTaxEditModal}>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Ajukan Perubahan Data Pajak & Jaminan Sosial</DialogTitle>
                                        <DialogDescription>
                                            Isi formulir di bawah untuk mengajukan perubahan data pajak dan jaminan sosial Anda.
                                            Perubahan akan ditinjau oleh HRD.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmitTax} className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nomor_npwp" className="text-right">Nomor NPWP</Label>
                                            <Input id="nomor_npwp" value={formTax.data.nomor_npwp} onChange={e => formTax.setData('nomor_npwp', e.target.value)} className="col-span-3" />
                                            {formTax.errors.nomor_npwp && <div className="col-span-4 text-right text-red-500 text-sm">{formTax.errors.nomor_npwp}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nomor_bpjs_kesehatan" className="text-right">Nomor BPJS Kesehatan</Label>
                                            <Input id="nomor_bpjs_kesehatan" value={formTax.data.nomor_bpjs_kesehatan} onChange={e => formTax.setData('nomor_bpjs_kesehatan', e.target.value)} className="col-span-3" />
                                            {formTax.errors.nomor_bpjs_kesehatan && <div className="col-span-4 text-right text-red-500 text-sm">{formTax.errors.nomor_bpjs_kesehatan}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nomor_bpjs_ketenagakerjaan" className="text-right">Nomor BPJS Ketenagakerjaan</Label>
                                            <Input id="nomor_bpjs_ketenagakerjaan" value={formTax.data.nomor_bpjs_ketenagakerjaan} onChange={e => formTax.setData('nomor_bpjs_ketenagakerjaan', e.target.value)} className="col-span-3" />
                                            {formTax.errors.nomor_bpjs_ketenagakerjaan && <div className="col-span-4 text-right text-red-500 text-sm">{formTax.errors.nomor_bpjs_ketenagakerjaan}</div>}
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setShowTaxEditModal(false)}>Batal</Button>
                                            <Button type="submit" disabled={formTax.processing}>Ajukan Perubahan</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Card>
                                <CardHeaderWithEdit title="Informasi Bank" description="Rekening bank untuk keperluan penggajian" onEditClick={() => setShowBankEditModal(true)} />
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoItem icon={Landmark} label="Nama Bank" value={employeeData?.kontak_karyawan?.nama_bank} color="text-green-500" />
                                        <InfoItem icon={Banknote} label="Nomor Rekening" value={employeeData?.kontak_karyawan?.nomor_rekening} color="text-green-500" />
                                        <InfoItem icon={User} label="Nama Pemilik Rekening" value={employeeData?.kontak_karyawan?.nama_pemilik_rekening} color="text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Bank Edit Modal */}
                            <Dialog open={showBankEditModal} onOpenChange={setShowBankEditModal}>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Ajukan Perubahan Informasi Bank</DialogTitle>
                                        <DialogDescription>
                                            Isi formulir di bawah untuk mengajukan perubahan informasi rekening bank Anda.
                                            Perubahan akan ditinjau oleh HRD.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmitBank} className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nama_bank" className="text-right">Nama Bank</Label>
                                            <Input id="nama_bank" value={formBank.data.nama_bank} onChange={e => formBank.setData('nama_bank', e.target.value)} className="col-span-3" />
                                            {formBank.errors.nama_bank && <div className="col-span-4 text-right text-red-500 text-sm">{formBank.errors.nama_bank}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nomor_rekening" className="text-right">Nomor Rekening</Label>
                                            <Input id="nomor_rekening" value={formBank.data.nomor_rekening} onChange={e => formBank.setData('nomor_rekening', e.target.value)} className="col-span-3" />
                                            {formBank.errors.nomor_rekening && <div className="col-span-4 text-right text-red-500 text-sm">{formBank.errors.nomor_rekening}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nama_pemilik_rekening" className="text-right">Nama Pemilik Rekening</Label>
                                            <Input id="nama_pemilik_rekening" value={formBank.data.nama_pemilik_rekening} onChange={e => formBank.setData('nama_pemilik_rekening', e.target.value)} className="col-span-3" />
                                            {formBank.errors.nama_pemilik_rekening && <div className="col-span-4 text-right text-red-500 text-sm">{formBank.errors.nama_pemilik_rekening}</div>}
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setShowBankEditModal(false)}>Batal</Button>
                                            <Button type="submit" disabled={formBank.processing}>Ajukan Perubahan</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </TabsContent>

                        <TabsContent value="data-tambahan" className="space-y-4 mt-4">
                            <Card>
                                <CardHeaderWithEdit title="Pajak & Jaminan Sosial" description="Informasi terkait NPWP dan BPJS" onEditClick={() => setShowTaxEditModal(true)} />
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoItem icon={IdCard} label="Nomor NPWP" value={employeeData?.nomor_npwp} color="text-amber-500" />
                                        <InfoItem icon={Heart} label="Nomor BPJS Kesehatan" value={employeeData?.nomor_bpjs_kesehatan} color="text-amber-500" />
                                        <InfoItem icon={Briefcase} label="Nomor BPJS Ketenagakerjaan" value={employeeData?.nomor_bpjs_ketenagakerjaan} color="text-amber-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tax Edit Modal */}
                            <Dialog open={showTaxEditModal} onOpenChange={setShowTaxEditModal}>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Ajukan Perubahan Data Pajak & Jaminan Sosial</DialogTitle>
                                        <DialogDescription>
                                            Isi formulir di bawah untuk mengajukan perubahan data pajak dan jaminan sosial Anda.
                                            Perubahan akan ditinjau oleh HRD.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmitTax} className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nomor_npwp" className="text-right">Nomor NPWP</Label>
                                            <Input id="nomor_npwp" value={formTax.data.nomor_npwp} onChange={e => formTax.setData('nomor_npwp', e.target.value)} className="col-span-3" />
                                            {formTax.errors.nomor_npwp && <div className="col-span-4 text-right text-red-500 text-sm">{formTax.errors.nomor_npwp}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nomor_bpjs_kesehatan" className="text-right">Nomor BPJS Kesehatan</Label>
                                            <Input id="nomor_bpjs_kesehatan" value={formTax.data.nomor_bpjs_kesehatan} onChange={e => formTax.setData('nomor_bpjs_kesehatan', e.target.value)} className="col-span-3" />
                                            {formTax.errors.nomor_bpjs_kesehatan && <div className="col-span-4 text-right text-red-500 text-sm">{formTax.errors.nomor_bpjs_kesehatan}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nomor_bpjs_ketenagakerjaan" className="text-right">Nomor BPJS Ketenagakerjaan</Label>
                                            <Input id="nomor_bpjs_ketenagakerjaan" value={formTax.data.nomor_bpjs_ketenagakerjaan} onChange={e => formTax.setData('nomor_bpjs_ketenagakerjaan', e.target.value)} className="col-span-3" />
                                            {formTax.errors.nomor_bpjs_ketenagakerjaan && <div className="col-span-4 text-right text-red-500 text-sm">{formTax.errors.nomor_bpjs_ketenagakerjaan}</div>}
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setShowTaxEditModal(false)}>Batal</Button>
                                            <Button type="submit" disabled={formTax.processing}>Ajukan Perubahan</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Card>
                                <CardHeaderWithEdit title="Informasi Bank" description="Rekening bank untuk keperluan penggajian" onEditClick={() => setShowBankEditModal(true)} />
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoItem icon={Landmark} label="Nama Bank" value={employeeData?.kontak_karyawan?.nama_bank} color="text-green-500" />
                                        <InfoItem icon={Banknote} label="Nomor Rekening" value={employeeData?.kontak_karyawan?.nomor_rekening} color="text-green-500" />
                                        <InfoItem icon={User} label="Nama Pemilik Rekening" value={employeeData?.kontak_karyawan?.nama_pemilik_rekening} color="text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Bank Edit Modal */}
                            <Dialog open={showBankEditModal} onOpenChange={setShowBankEditModal}>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Ajukan Perubahan Informasi Bank</DialogTitle>
                                        <DialogDescription>
                                            Isi formulir di bawah untuk mengajukan perubahan informasi rekening bank Anda.
                                            Perubahan akan ditinjau oleh HRD.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmitBank} className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nama_bank" className="text-right">Nama Bank</Label>
                                            <Input id="nama_bank" value={formBank.data.nama_bank} onChange={e => formBank.setData('nama_bank', e.target.value)} className="col-span-3" />
                                            {formBank.errors.nama_bank && <div className="col-span-4 text-right text-red-500 text-sm">{formBank.errors.nama_bank}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nomor_rekening" className="text-right">Nomor Rekening</Label>
                                            <Input id="nomor_rekening" value={formBank.data.nomor_rekening} onChange={e => formBank.setData('nomor_rekening', e.target.value)} className="col-span-3" />
                                            {formBank.errors.nomor_rekening && <div className="col-span-4 text-right text-red-500 text-sm">{formBank.errors.nomor_rekening}</div>}
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nama_pemilik_rekening" className="text-right">Nama Pemilik Rekening</Label>
                                            <Input id="nama_pemilik_rekening" value={formBank.data.nama_pemilik_rekening} onChange={e => formBank.setData('nama_pemilik_rekening', e.target.value)} className="col-span-3" />
                                            {formBank.errors.nama_pemilik_rekening && <div className="col-span-4 text-right text-red-500 text-sm">{formBank.errors.nama_pemilik_rekening}</div>}
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setShowBankEditModal(false)}>Batal</Button>
                                            <Button type="submit" disabled={formBank.processing}>Ajukan Perubahan</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </TabsContent>

                        <TabsContent value="riwayat-pendidikan" className="space-y-4 mt-4">
                            <Card>
                                <CardHeaderWithEdit title="Riwayat Pendidikan" description="Informasi riwayat pendidikan formal Anda" />
                                <CardContent>
                                    {employeeData.education && employeeData.education.length > 0 ? (
                                        <div className="space-y-4">
                                            {employeeData.education.map((edu, index) => (
                                                <React.Fragment key={index}>
                                                    <div className="space-y-2">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-sm text-gray-500">Jenjang</p>
                                                                <p className="font-medium">{edu.jenjang}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Institusi</p>
                                                                <p className="font-medium">{edu.institusi}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Jurusan</p>
                                                                <p className="font-medium">{edu.jurusan}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Tahun Masuk - Lulus</p>
                                                                <p className="font-medium">{edu.tahun_mulai} - {edu.tahun_selesai}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">IPK</p>
                                                                <p className="font-medium">{edu.ipk}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Status</p>
                                                                <p className="font-medium">
                                                                    <Badge variant={edu.is_lulus ? 'default' : 'outline'}>
                                                                        {edu.is_lulus ? 'Lulus' : 'Belum Lulus'}
                                                                    </Badge>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {edu.catatan && (
                                                            <div>
                                                                <p className="text-sm text-gray-500">Catatan</p>
                                                                <p className="font-medium">{edu.catatan}</p>
                                                            </div>
                                                        )}
                                                        {edu.nomor_ijazah && (
                                                            <div>
                                                                <p className="text-sm text-gray-500">Nomor Ijazah</p>
                                                                <p className="font-medium">{edu.nomor_ijazah}</p>
                                                            </div>
                                                        )}
                                                        {edu.tanggal_ijazah && (
                                                            <div>
                                                                <p className="text-sm text-gray-500">Tanggal Ijazah</p>
                                                                <p className="font-medium">{formatDate(edu.tanggal_ijazah)}</p>
                                                            </div>
                                                        )}
                                                        {edu.file_ijazah && (
                                                            <div>
                                                                <p className="text-sm text-gray-500">File Ijazah</p>
                                                                <p className="font-medium"><a href={edu.file_ijazah} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat File</a></p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {index < employeeData.education!.length - 1 && <Separator className="my-4" />}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">Belum Ada Riwayat Pendidikan</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Riwayat pendidikan Anda akan muncul di sini
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="documents" className="mt-4">
                            <Card>
                                <CardHeaderWithEdit title="Dokumen Karyawan" description="Daftar dokumen penting terkait kepegawaian Anda" />
                                <CardContent>
                                    {documents && documents.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {documents.map((doc: any) => (
                                                <Card key={doc.id} className="border-2 hover:border-primary/50 transition-colors">
                                                    <CardContent className="pt-6">
                                                        <div className="flex items-start gap-4">
                                                            <div className="p-3 rounded-lg bg-primary/10">
                                                                <FileText className="h-6 w-6 text-primary" />
                                                            </div>
                                                            <div className="flex-1 space-y-2">
                                                                <h4 className="font-semibold">{doc.nama_dokumen || 'Dokumen'}</h4>
                                                                <div className="space-y-1 text-sm text-muted-foreground">
                                                                    <p className="flex items-center gap-2">
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {doc.jenis_dokumen || 'Umum'}
                                                                        </Badge>
                                                                    </p>
                                                                    <p className="flex items-center gap-1">
                                                                        <Calendar className="h-3 w-3" />
                                                                        {doc.tanggal_unggah
                                                                            ? format(new Date(doc.tanggal_unggah), 'dd MMM yyyy', { locale: id })
                                                                            : '-'}
                                                                    </p>
                                                                </div>
                                                                <a
                                                                    href={doc.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mt-2"
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                    Lihat/Unduh
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">Belum Ada Dokumen</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Dokumen kepegawaian Anda akan muncul di sini
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="emergency-contacts" className="mt-4">
                            <Card>
                                <CardHeaderWithEdit title="Kontak Darurat" description="Kontak yang dapat dihubungi dalam keadaan darurat" />
                                <CardContent>
                                    {emergencyContacts && emergencyContacts.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {emergencyContacts.map((contact: any) => (
                                                <Card key={contact.id_emergency_contact} className="border-2">
                                                    <CardContent className="pt-6">
                                                        <div className="flex items-start gap-4">
                                                            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
                                                                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                                            </div>
                                                            <div className="flex-1 space-y-2">
                                                                <h4 className="font-semibold text-lg">{contact.nama || '-'}</h4>
                                                                <div className="space-y-1">
                                                                    <p className="flex items-center gap-2 text-sm">
                                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                                        <span className="text-muted-foreground">Hubungan:</span>
                                                                        <Badge variant="secondary">{contact.hubungan || '-'}</Badge>
                                                                    </p>
                                                                    <p className="flex items-center gap-2 text-sm">
                                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                                        <span className="font-medium">{contact.nomor_telepon || '-'}</span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">Belum Ada Kontak Darurat</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Hubungi HRD untuk menambahkan kontak darurat Anda
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
