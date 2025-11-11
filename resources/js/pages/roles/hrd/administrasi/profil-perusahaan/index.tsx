import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import {
    Building,
    Edit,
    Save,
    Camera,
    Phone,
    Mail,
    MapPin,
    Globe,
    Users,
    Award,
    Link as LinkIcon, // Renamed to avoid conflict with @inertiajs/react Link
    User as UserIcon,
} from 'lucide-react';

interface SertifikasiData {
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    url?: string;
}

interface SocialMediaData {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
}

interface BoardMemberData {
    nama: string;
    foto_url: string;
}

interface ProfilPerusahaanData {
    id?: number;
    nama_perusahaan: string;
    nama_legal: string;
    industri: string;
    tahun_berdiri: string;
    alamat_perusahaan: string;
    nomor_telepon: string;
    email_perusahaan: string;
    website: string;
    npwp_perusahaan: string;
    lisensi_bisnis: string;
    sejarah_singkat: string;
    visi: string;
    misi: string;
    nilai_nilai: string[];
    sertifikasi: SertifikasiData[];
    media_sosial: SocialMediaData;
    logo_url: string;
    direktur: BoardMemberData;
    komisaris: BoardMemberData;
}

interface ProfilPerusahaanPageProps {
    profilPerusahaan: ProfilPerusahaanData;
    totalEmployeeCount: number;
}

export default function ProfilPerusahaan({ profilPerusahaan, totalEmployeeCount }: ProfilPerusahaanPageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, post, processing, errors } = useForm<ProfilPerusahaanData>({
        id: profilPerusahaan.id || undefined,
        nama_perusahaan: profilPerusahaan.nama_perusahaan || '',
        nama_legal: profilPerusahaan.nama_legal || '',
        industri: profilPerusahaan.industri || '',
        tahun_berdiri: profilPerusahaan.tahun_berdiri || '',
        alamat_perusahaan: profilPerusahaan.alamat_perusahaan || '',
        nomor_telepon: profilPerusahaan.nomor_telepon || '',
        email_perusahaan: profilPerusahaan.email_perusahaan || '',
        website: profilPerusahaan.website || '',
        npwp_perusahaan: profilPerusahaan.npwp_perusahaan || '',
        lisensi_bisnis: profilPerusahaan.lisensi_bisnis || '',
        sejarah_singkat: profilPerusahaan.sejarah_singkat || '',
        visi: profilPerusahaan.visi || '',
        misi: profilPerusahaan.misi || '',
        nilai_nilai: profilPerusahaan.nilai_nilai || [],
        sertifikasi: profilPerusahaan.sertifikasi || [],
        media_sosial: profilPerusahaan.media_sosial || {},
        logo_url: profilPerusahaan.logo_url || '',
        direktur: profilPerusahaan.direktur || { nama: '', foto_url: '' },
        komisaris: profilPerusahaan.komisaris || { nama: '', foto_url: '' },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hrd.administrasi.profil-perusahaan.update'), {
            onSuccess: () => {
                toast.success('Profil perusahaan berhasil diperbarui!');
                setIsEditing(false); // Exit editing mode on success
            },
            onError: (err) => {
                toast.error('Gagal memperbarui profil perusahaan.');
                console.error(err);
            },
        });
    };

    const handleAddValue = () => {
        setData('nilai_nilai', [...data.nilai_nilai, '']);
    };

    const handleUpdateValue = (index: number, value: string) => {
        const newValues = [...data.nilai_nilai];
        newValues[index] = value;
        setData('nilai_nilai', newValues);
    };

    const handleRemoveValue = (index: number) => {
        const newValues = data.nilai_nilai.filter((_, i) => i !== index);
        setData('nilai_nilai', newValues);
    };

    const handleAddCertification = () => {
        setData('sertifikasi', [...data.sertifikasi, { name: '', issuer: '', date: '', expiryDate: '', url: '' }]);
    };

    const handleUpdateCertification = (index: number, field: keyof SertifikasiData, value: string) => {
        const newCertifications = [...data.sertifikasi];
        newCertifications[index] = { ...newCertifications[index], [field]: value };
        setData('sertifikasi', newCertifications);
    };

    const handleRemoveCertification = (index: number) => {
        const newCertifications = data.sertifikasi.filter((_, i) => i !== index);
        setData('sertifikasi', newCertifications);
    };

    const handleUpdateSocialMedia = (platform: keyof SocialMediaData, value: string) => {
        setData('media_sosial', { ...data.media_sosial, [platform]: value });
    };

    const handleUpdateBoardMember = (memberType: 'direktur' | 'komisaris', field: keyof BoardMemberData, value: string) => {
        setData(memberType, { ...data[memberType], [field]: value });
    };

    const isCertificationExpiring = (expiryDate?: string) => {
        if (!expiryDate) return false;
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
    };

    return (
        <AuthenticatedLayout
            title="Profil Perusahaan"
            breadcrumbs={[
                { title: 'Dashboard', href: '/roles/hrd' },
                { title: 'Administrasi Perusahaan', href: '#' },
                { title: 'Profil Perusahaan', href: '/roles/hrd/administrasi/profil-perusahaan' }
            ]}
        >
            <Head title="Profil Perusahaan - Manajer HRD" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <Building className="h-8 w-8 text-blue-600" />
                            Profil Perusahaan
                        </h1>
                        <p className="text-gray-600 mt-1">Kelola informasi dan identitas perusahaan</p>
                    </div>
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    Batal
                                </Button>
                                <Button onClick={handleSubmit} disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profil
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Company Logo & Basic Info */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="relative inline-block">
                                        <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                                            {data.nama_perusahaan.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                        </div>
                                        {isEditing && (
                                            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                                                <Camera className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-1">{data.nama_perusahaan}</h2>
                                    <p className="text-gray-600 mb-2">{data.industri}</p>
                                    <p className="text-sm text-gray-500">Didirikan tahun {data.tahun_berdiri}</p>
                                    <div className="mt-4 space-y-3 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Users className="h-4 w-4" />
                                            <span>{totalEmployeeCount} Karyawan</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Award className="h-4 w-4" />
                                            <span>{data.sertifikasi.length} Sertifikasi</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Statistik Perusahaan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Tahun Beroperasi</span>
                                        <span className="font-semibold">{data.tahun_berdiri ? (new Date().getFullYear() - parseInt(data.tahun_berdiri)) : 'N/A'} tahun</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total Karyawan</span>
                                        <span className="font-semibold">{totalEmployeeCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Sertifikasi Aktif</span>
                                        <span className="font-semibold">{data.sertifikasi.length}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Direktur & Komisaris Info */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Pimpinan Perusahaan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {data.direktur && (
                                        <div className="flex items-center gap-3">
                                            {data.direktur.foto_url ? (
                                                <img src={data.direktur.foto_url} alt={data.direktur.nama} className="w-12 h-12 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <UserIcon className="h-6 w-6 text-gray-500" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-900">{data.direktur.nama}</p>
                                                <p className="text-sm text-gray-600">Direktur Utama</p>
                                            </div>
                                        </div>
                                    )}
                                    {data.komisaris && (
                                        <div className="flex items-center gap-3">
                                            {data.komisaris.foto_url ? (
                                                <img src={data.komisaris.foto_url} alt={data.komisaris.nama} className="w-12 h-12 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <UserIcon className="h-6 w-6 text-gray-500" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-900">{data.komisaris.nama}</p>
                                                <p className="text-sm text-gray-600">Komisaris Utama</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Dasar</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Nama Perusahaan</Label>
                                        {isEditing ? (
                                            <Input
                                                value={data.nama_perusahaan}
                                                onChange={(e) => setData('nama_perusahaan', e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-gray-900">{data.nama_perusahaan}</p>
                                        )}
                                        {errors.nama_perusahaan && <p className="text-red-500 text-sm mt-1">{errors.nama_perusahaan}</p>}
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Nama Legal</Label>
                                        {isEditing ? (
                                            <Input
                                                value={data.nama_legal}
                                                onChange={(e) => setData('nama_legal', e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-gray-900">{data.nama_legal}</p>
                                        )}
                                        {errors.nama_legal && <p className="text-red-500 text-sm mt-1">{errors.nama_legal}</p>}
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Industri</Label>
                                        {isEditing ? (
                                            <Input
                                                value={data.industri}
                                                onChange={(e) => setData('industri', e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-gray-900">{data.industri}</p>
                                        )}
                                        {errors.industri && <p className="text-red-500 text-sm mt-1">{errors.industri}</p>}
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Tahun Didirikan</Label>
                                        {isEditing ? (
                                            <Input
                                                value={data.tahun_berdiri}
                                                onChange={(e) => setData('tahun_berdiri', e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-gray-900">{data.tahun_berdiri}</p>
                                        )}
                                        {errors.tahun_berdiri && <p className="text-red-500 text-sm mt-1">{errors.tahun_berdiri}</p>}
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">NPWP</Label>
                                        {isEditing ? (
                                            <Input
                                                value={data.npwp_perusahaan}
                                                onChange={(e) => setData('npwp_perusahaan', e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-gray-900">{data.npwp_perusahaan}</p>
                                        )}
                                        {errors.npwp_perusahaan && <p className="text-red-500 text-sm mt-1">{errors.npwp_perusahaan}</p>}
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Lisensi Bisnis</Label>
                                        {isEditing ? (
                                            <Input
                                                value={data.lisensi_bisnis}
                                                onChange={(e) => setData('lisensi_bisnis', e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-gray-900">{data.lisensi_bisnis}</p>
                                        )}
                                        {errors.lisensi_bisnis && <p className="text-red-500 text-sm mt-1">{errors.lisensi_bisnis}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Kontak</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Email</Label>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            {isEditing ? (
                                                <Input
                                                    type="email"
                                                    value={data.email_perusahaan}
                                                    onChange={(e) => setData('email_perusahaan', e.target.value)}
                                                    className="flex-1"
                                                />
                                            ) : (
                                                <span className="text-gray-900">{data.email_perusahaan}</span>
                                            )}
                                        </div>
                                        {errors.email_perusahaan && <p className="text-red-500 text-sm mt-1">{errors.email_perusahaan}</p>}
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Telepon</Label>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            {isEditing ? (
                                                <Input
                                                    value={data.nomor_telepon}
                                                    onChange={(e) => setData('nomor_telepon', e.target.value)}
                                                    className="flex-1"
                                                />
                                            ) : (
                                                <span className="text-gray-900">{data.nomor_telepon}</span>
                                            )}
                                        </div>
                                        {errors.nomor_telepon && <p className="text-red-500 text-sm mt-1">{errors.nomor_telepon}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Website</Label>
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-gray-400" />
                                            {isEditing ? (
                                                <Input
                                                    value={data.website}
                                                    onChange={(e) => setData('website', e.target.value)}
                                                    className="flex-1"
                                                />
                                            ) : (
                                                <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                                    {data.website}
                                                </a>
                                            )}
                                        </div>
                                        {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Alamat</Label>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                            {isEditing ? (
                                                <Textarea
                                                    value={data.alamat_perusahaan}
                                                    onChange={(e) => setData('alamat_perusahaan', e.target.value)}
                                                    className="flex-1"
                                                    rows={2}
                                                />
                                            ) : (
                                                <span className="text-gray-900">
                                                    {data.alamat_perusahaan}
                                                </span>
                                            )}
                                        </div>
                                        {errors.alamat_perusahaan && <p className="text-red-500 text-sm mt-1">{errors.alamat_perusahaan}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Media */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Media Sosial</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.keys(data.media_sosial).map((platform) => (
                                        <div key={platform}>
                                            <Label className="block text-sm font-medium text-gray-700 mb-2">{platform.charAt(0).toUpperCase() + platform.slice(1)}</Label>
                                            {isEditing ? (
                                                <Input
                                                    value={data.media_sosial[platform as keyof SocialMediaData] || ''}
                                                    onChange={(e) => handleUpdateSocialMedia(platform as keyof SocialMediaData, e.target.value)}
                                                />
                                            ) : (
                                                <a href={data.media_sosial[platform as keyof SocialMediaData]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    {data.media_sosial[platform as keyof SocialMediaData]}
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {errors.media_sosial && <p className="text-red-500 text-sm mt-1">{errors.media_sosial}</p>}
                            </CardContent>
                        </Card>

                        {/* Direktur & Komisaris Edit Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pimpinan Perusahaan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Nama Direktur Utama</Label>
                                        {isEditing ? (
                                            <Input
                                                value={data.direktur.nama}
                                                onChange={(e) => handleUpdateBoardMember('direktur', 'nama', e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-gray-900">{data.direktur.nama}</p>
                                        )}
                                        {errors['direktur.nama'] && <p className="text-red-500 text-sm mt-1">{errors['direktur.nama']}</p>}
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Foto URL Direktur Utama</Label>
                                        {isEditing ? (
                                            <Input
                                                value={data.direktur.foto_url}
                                                onChange={(e) => handleUpdateBoardMember('direktur', 'foto_url', e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-gray-900">{data.direktur.foto_url}</p>
                                        )}
                                        {errors['direktur.foto_url'] && <p className="text-red-500 text-sm mt-1">{errors['direktur.foto_url']}</p>}
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Nama Komisaris Utama</Label>
                                        {isEditing ? (
                                            <Input
                                                value={data.komisaris.nama}
                                                onChange={(e) => handleUpdateBoardMember('komisaris', 'nama', e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-gray-900">{data.komisaris.nama}</p>
                                        )}
                                        {errors['komisaris.nama'] && <p className="text-red-500 text-sm mt-1">{errors['komisaris.nama']}</p>}
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Foto URL Komisaris Utama</Label>
                                        {isEditing ? (
                                            <Input
                                                value={data.komisaris.foto_url}
                                                onChange={(e) => handleUpdateBoardMember('komisaris', 'foto_url', e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-gray-900">{data.komisaris.foto_url}</p>
                                        )}
                                        {errors['komisaris.foto_url'] && <p className="text-red-500 text-sm mt-1">{errors['komisaris.foto_url']}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Company Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tentang Perusahaan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Sejarah Singkat</Label>
                                        {isEditing ? (
                                            <Textarea
                                                value={data.sejarah_singkat}
                                                onChange={(e) => setData('sejarah_singkat', e.target.value)}
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-gray-700">{data.sejarah_singkat}</p>
                                        )}
                                        {errors.sejarah_singkat && <p className="text-red-500 text-sm mt-1">{errors.sejarah_singkat}</p>}
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Misi</Label>
                                        {isEditing ? (
                                            <Textarea
                                                value={data.misi}
                                                onChange={(e) => setData('misi', e.target.value)}
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-gray-700">{data.misi}</p>
                                        )}
                                        {errors.misi && <p className="text-red-500 text-sm mt-1">{errors.misi}</p>}
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-2">Visi</Label>
                                        {isEditing ? (
                                            <Textarea
                                                value={data.visi}
                                                onChange={(e) => setData('visi', e.target.value)}
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-gray-700">{data.visi}</p>
                                        )}
                                        {errors.visi && <p className="text-red-500 text-sm mt-1">{errors.visi}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Company Values */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Nilai-Nilai Perusahaan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <div className="space-y-3">
                                        {data.nilai_nilai.map((value, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Input
                                                    value={value}
                                                    onChange={(e) => handleUpdateValue(index, e.target.value)}
                                                />
                                                <Button variant="destructive" onClick={() => handleRemoveValue(index)}>
                                                    Hapus
                                                </Button>
                                            </div>
                                        ))}
                                        <Button type="button" onClick={handleAddValue}>
                                            Tambah Nilai
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {data.nilai_nilai.map((value, index) => (
                                            <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                                                <p className="font-medium text-blue-900">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.nilai_nilai && <p className="text-red-500 text-sm mt-1">{errors.nilai_nilai}</p>}
                            </CardContent>
                        </Card>

                        {/* Certifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sertifikasi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <div className="space-y-4">
                                        {data.sertifikasi.map((cert, index) => (
                                            <div key={index} className="p-4 border rounded-lg space-y-2">
                                                <div>
                                                    <Label>Nama Sertifikasi</Label>
                                                    <Input
                                                        value={cert.name}
                                                        onChange={(e) => handleUpdateCertification(index, 'name', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Penerbit</Label>
                                                    <Input
                                                        value={cert.issuer}
                                                        onChange={(e) => handleUpdateCertification(index, 'issuer', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Tanggal Diperoleh</Label>
                                                    <Input
                                                        type="date"
                                                        value={cert.date}
                                                        onChange={(e) => handleUpdateCertification(index, 'date', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Tanggal Kadaluarsa (Opsional)</Label>
                                                    <Input
                                                        type="date"
                                                        value={cert.expiryDate}
                                                        onChange={(e) => handleUpdateCertification(index, 'expiryDate', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>URL Sertifikasi (Opsional)</Label>
                                                    <Input
                                                        type="url"
                                                        value={cert.url}
                                                        onChange={(e) => handleUpdateCertification(index, 'url', e.target.value)}
                                                    />
                                                </div>
                                                <Button variant="destructive" onClick={() => handleRemoveCertification(index)}>
                                                    Hapus Sertifikasi
                                                </Button>
                                            </div>
                                        ))}
                                        <Button type="button" onClick={handleAddCertification}>
                                            Tambah Sertifikasi
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {data.sertifikasi.map((cert, index) => (
                                            <div key={index} className={`flex items-start gap-3 p-3 border rounded-lg ${isCertificationExpiring(cert.expiryDate) ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <Award className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{cert.name}</h4>
                                                            <p className="text-gray-600">{cert.issuer}</p>
                                                            <p className="text-sm text-gray-500">
                                                                Diperoleh: {cert.date}
                                                                {cert.expiryDate && ` • Berlaku hingga: ${cert.expiryDate}`}
                                                            </p>
                                                            {cert.url && (
                                                                <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                                                                    <LinkIcon className="h-3 w-3" /> Lihat Sertifikat
                                                                </a>
                                                            )}
                                                        </div>
                                                        {isCertificationExpiring(cert.expiryDate) && (
                                                            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                                                Segera Expired
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.sertifikasi && <p className="text-red-500 text-sm mt-1">{errors.sertifikasi}</p>}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
