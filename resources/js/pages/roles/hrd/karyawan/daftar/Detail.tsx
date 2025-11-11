import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    employment_status: string;
    id_karyawan: string;
    last_login_at: string;
    last_login_ip: string;
}

interface IdentitasKaryawanData {
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
    foto_profil_url: string;
}

interface RincianPekerjaanData {
    id_rincian_pekerjaan: number;
    id_karyawan: string;
    tanggal_bergabung: string;
    status_karyawan: string;
    id_jabatan: number;
    id_departemen: number;
    id_bagian_kerja: number;
    lokasi_kerja: string;
    id_atasan_langsung: string;
    termination_date: string | null;
    departemen: { nama_departemen: string };
    jabatan: { nama_jabatan: string };
}

interface KontakKaryawanData {
    id_kontak: number;
    id_karyawan: string;
    alamat_ktp: string;
    alamat_domisili: string;
    nomor_telepon: string;
    email_pribadi: string;
    email_perusahaan: string;
    nama_bank: string;
    nomor_rekening: string;
    nama_pemilik_rekening: string;
}

interface KontakDaruratData {
    id: number;
    id_karyawan: string;
    nama: string;
    hubungan: string;
    nomor_telepon: string;
}

interface DokumenKaryawanData {
    id: number;
    id_karyawan: string;
    nama_dokumen: string;
    jenis_dokumen: string;
    tanggal_unggah: string;
    url: string;
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

interface EmployeeProps {
    employee: UserData & {
        identitas_karyawan: IdentitasKaryawanData;
        rincian_pekerjaan: RincianPekerjaanData;
        identitas_karyawan: IdentitasKaryawanData & {
            kontak_karyawan: KontakKaryawanData;
            kontak_darurat: KontakDaruratData[];
            dokumen: DokumenKaryawanData[];
            education: EducationData[];
        };
    };
}

export default function EmployeeDetail({ employee }: EmployeeProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
    };

    return (
        <AuthenticatedLayout
            title="Detail Karyawan"
            breadcrumbs={[
                { title: 'Dashboard', href: '/roles/hrd' },
                { title: 'Data Karyawan', href: '/roles/hrd/karyawan/daftar' },
                { title: 'Detail Karyawan', href: `/roles/hrd/karyawan/${employee.id_karyawan}/detail` }
            ]}
        >
            <Head title={`Detail Karyawan: ${employee.identitas_karyawan.nama_lengkap}`} />

            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Detail Karyawan: {employee.identitas_karyawan.nama_lengkap}</h1>

                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Pribadi</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Nama Lengkap</p>
                            <p className="font-medium">{employee.identitas_karyawan.nama_lengkap}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">NIK KTP</p>
                            <p className="font-medium">{employee.identitas_karyawan.nik_ktp}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">NIK Perusahaan</p>
                            <p className="font-medium">{employee.identitas_karyawan.nik_perusahaan}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tanggal Lahir</p>
                            <p className="font-medium">{formatDate(employee.identitas_karyawan.tanggal_lahir)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tempat Lahir</p>
                            <p className="font-medium">{employee.identitas_karyawan.tempat_lahir}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Jenis Kelamin</p>
                            <p className="font-medium">{employee.identitas_karyawan.jenis_kelamin}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status Pernikahan</p>
                            <p className="font-medium">{employee.identitas_karyawan.status_pernikahan}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Agama</p>
                            <p className="font-medium">{employee.identitas_karyawan.agama}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Golongan Darah</p>
                            <p className="font-medium">{employee.identitas_karyawan.golongan_darah}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Kewarganegaraan</p>
                            <p className="font-medium">{employee.identitas_karyawan.kewarganegaraan}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pekerjaan KTP</p>
                            <p className="font-medium">{employee.identitas_karyawan.pekerjaan_ktp}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Nomor NPWP</p>
                            <p className="font-medium">{employee.identitas_karyawan.nomor_npwp}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Nomor BPJS Kesehatan</p>
                            <p className="font-medium">{employee.identitas_karyawan.nomor_bpjs_kesehatan}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Nomor BPJS Ketenagakerjaan</p>
                            <p className="font-medium">{employee.identitas_karyawan.nomor_bpjs_ketenagakerjaan}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Alamat KTP</p>
                            <p className="font-medium">{employee.identitas_karyawan.alamat_ktp}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Alamat Domisili</p>
                            <p className="font-medium">{employee.identitas_karyawan.alamat_domisili}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Job Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Rincian Pekerjaan</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Tanggal Bergabung</p>
                            <p className="font-medium">{formatDate(employee.rincian_pekerjaan.tanggal_bergabung)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status Karyawan</p>
                            <p className="font-medium">
                                <Badge variant={employee.rincian_pekerjaan.status_karyawan === 'Tetap' ? 'default' : 'destructive'}>
                                    {employee.rincian_pekerjaan.status_karyawan}
                                </Badge>
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Jabatan</p>
                            <p className="font-medium">{employee.rincian_pekerjaan.jabatan?.nama_jabatan || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Departemen</p>
                            <p className="font-medium">{employee.rincian_pekerjaan.departemen?.nama_departemen || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Lokasi Kerja</p>
                            <p className="font-medium">{employee.rincian_pekerjaan.lokasi_kerja}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tanggal Terminasi</p>
                            <p className="font-medium">{formatDate(employee.rincian_pekerjaan.termination_date)}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Kontak & Bank</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Nomor Telepon</p>
                            <p className="font-medium">{employee.identitas_karyawan.kontak_karyawan?.nomor_telepon || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email Pribadi</p>
                            <p className="font-medium">{employee.identitas_karyawan.kontak_karyawan?.email_pribadi || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email Perusahaan</p>
                            <p className="font-medium">{employee.identitas_karyawan.kontak_karyawan?.email_perusahaan || '-'}</p>
                        </div>
                        <Separator className="md:col-span-2 my-2" />
                        <div>
                            <p className="text-sm text-gray-500">Nama Bank</p>
                            <p className="font-medium">{employee.identitas_karyawan.kontak_karyawan?.nama_bank || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Nomor Rekening</p>
                            <p className="font-medium">{employee.identitas_karyawan.kontak_karyawan?.nomor_rekening || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Nama Pemilik Rekening</p>
                            <p className="font-medium">{employee.identitas_karyawan.kontak_karyawan?.nama_pemilik_rekening || '-'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Emergency Contacts */}
                <Card>
                    <CardHeader>
                        <CardTitle>Kontak Darurat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {employee.identitas_karyawan.kontak_darurat && employee.identitas_karyawan.kontak_darurat.length > 0 ? (
                            <div className="space-y-4">
                                {employee.identitas_karyawan.kontak_darurat.map((contact, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4 last:pb-0 last:border-b-0">
                                        <div>
                                            <p className="text-sm text-gray-500">Nama</p>
                                            <p className="font-medium">{contact.nama}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Hubungan</p>
                                            <p className="font-medium">{contact.hubungan}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Nomor Telepon</p>
                                            <p className="font-medium">{contact.nomor_telepon}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Tidak ada kontak darurat.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Education Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Pendidikan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {employee.identitas_karyawan.education && employee.identitas_karyawan.education.length > 0 ? (
                            <div className="space-y-4">
                                {employee.identitas_karyawan.education.map((edu, index) => (
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
                                        {index < employee.identitas_karyawan.education.length - 1 && <Separator className="my-4" />}
                                    </React.Fragment>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Tidak ada riwayat pendidikan.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Documents */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dokumen Karyawan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {employee.identitas_karyawan.dokumen && employee.identitas_karyawan.dokumen.length > 0 ? (
                            <div className="space-y-4">
                                {employee.identitas_karyawan.dokumen.map((doc, index) => (
                                    <React.Fragment key={index}>
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Nama Dokumen</p>
                                                    <p className="font-medium">{doc.nama_dokumen}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Jenis Dokumen</p>
                                                    <p className="font-medium">{doc.jenis_dokumen}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Tanggal Unggah</p>
                                                    <p className="font-medium">{formatDate(doc.tanggal_unggah)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">URL</p>
                                                    <p className="font-medium"><a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat Dokumen</a></p>
                                                </div>
                                            </div>
                                        </div>
                                        {index < employee.identitas_karyawan.dokumen.length - 1 && <Separator className="my-4" />}
                                    </React.Fragment>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Tidak ada dokumen.</p>
                        )}
                    </CardContent>
                </Card>

            </div>
        </AuthenticatedLayout>
    );
}
