import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building, 
  Edit,
  Save,
  Camera,
  Phone,
  Mail,
  MapPin,
  Globe,
  Calendar,
  Users,
  Award,
  FileText
} from 'lucide-react';

interface CompanyProfile {
  name: string;
  legalName: string;
  industry: string;
  foundedYear: string;
  employeeCount: number;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  description: string;
  mission: string;
  vision: string;
  values: string[];
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
  socialMedia: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  businessLicense: string;
  taxId: string;
  logo?: string;
}

export default function ProfilPerusahaan() {
  const [isEditing, setIsEditing] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: 'PT. Jarvis Indonesia',
    legalName: 'PT. Jarvis Indonesia Tbk',
    industry: 'Manufacturing & Construction',
    foundedYear: '2015',
    employeeCount: 85,
    email: 'info@jarvisindonesia.com',
    phone: '+62 21 5555-0123',
    website: 'https://www.jarvisindonesia.com',
    address: 'Jl. Industri Raya No. 123, Kawasan Industri Pulogadung',
    city: 'Jakarta Timur',
    postalCode: '13260',
    country: 'Indonesia',
    description: 'PT. Jarvis Indonesia adalah perusahaan manufaktur terkemuka yang bergerak di bidang produksi besi dan kayu berkualitas tinggi untuk industri konstruksi dan furniture. Dengan pengalaman lebih dari 8 tahun, kami telah melayani berbagai proyek besar di Indonesia.',
    mission: 'Menyediakan produk besi dan kayu berkualitas tinggi dengan standar internasional, memberikan solusi terbaik untuk kebutuhan konstruksi dan furniture, serta berkontribusi pada pembangunan infrastruktur Indonesia.',
    vision: 'Menjadi perusahaan manufaktur besi dan kayu terdepan di Indonesia yang dikenal karena kualitas produk, inovasi, dan komitmen terhadap keberlanjutan lingkungan.',
    values: [
      'Kualitas Terjamin',
      'Inovasi Berkelanjutan', 
      'Integritas Tinggi',
      'Kepuasan Pelanggan',
      'Tanggung Jawab Lingkungan',
      'Pengembangan SDM'
    ],
    certifications: [
      {
        name: 'ISO 9001:2015',
        issuer: 'BSI Group',
        date: '2022-03-15',
        expiryDate: '2025-03-15'
      },
      {
        name: 'ISO 14001:2015',
        issuer: 'TUV Rheinland',
        date: '2022-06-20',
        expiryDate: '2025-06-20'
      },
      {
        name: 'OHSAS 18001:2007',
        issuer: 'SGS Indonesia',
        date: '2021-11-10',
        expiryDate: '2024-11-10'
      }
    ],
    socialMedia: {
      linkedin: 'https://linkedin.com/company/jarvis-indonesia',
      facebook: 'https://facebook.com/jarvisindonesia',
      instagram: 'https://instagram.com/jarvisindonesia',
      twitter: 'https://twitter.com/jarvisindonesia'
    },
    businessLicense: '0123456789012345',
    taxId: '01.234.567.8-901.000'
  });

  const handleSave = () => {
    // Logic untuk menyimpan perubahan profil perusahaan
    console.log('Saving company profile...', companyProfile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof CompanyProfile, value: any) => {
    setCompanyProfile(prev => ({
      ...prev,
      [field]: value
    }));
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
        { title: 'Dashboard', href: '/roles/manajer-hrd' },
        { title: 'Pengaturan Sistem', href: '#' },
        { title: 'Profil Perusahaan', href: '/roles/manajer-hrd/pengaturan/profil' }
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
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
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
                      {companyProfile.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{companyProfile.name}</h2>
                  <p className="text-gray-600 mb-2">{companyProfile.industry}</p>
                  <p className="text-sm text-gray-500">Didirikan tahun {companyProfile.foundedYear}</p>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{companyProfile.employeeCount} Karyawan</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Award className="h-4 w-4" />
                      <span>{companyProfile.certifications.length} Sertifikasi</span>
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
                    <span className="font-semibold">{new Date().getFullYear() - parseInt(companyProfile.foundedYear)} tahun</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Karyawan</span>
                    <span className="font-semibold">{companyProfile.employeeCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sertifikasi Aktif</span>
                    <span className="font-semibold">{companyProfile.certifications.length}</span>
                  </div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Perusahaan</label>
                    {isEditing ? (
                      <Input
                        value={companyProfile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{companyProfile.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Legal</label>
                    {isEditing ? (
                      <Input
                        value={companyProfile.legalName}
                        onChange={(e) => handleInputChange('legalName', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{companyProfile.legalName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industri</label>
                    {isEditing ? (
                      <Input
                        value={companyProfile.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{companyProfile.industry}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Didirikan</label>
                    {isEditing ? (
                      <Input
                        value={companyProfile.foundedYear}
                        onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{companyProfile.foundedYear}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Karyawan</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={companyProfile.employeeCount}
                        onChange={(e) => handleInputChange('employeeCount', parseInt(e.target.value))}
                      />
                    ) : (
                      <p className="text-gray-900">{companyProfile.employeeCount}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">NPWP</label>
                    {isEditing ? (
                      <Input
                        value={companyProfile.taxId}
                        onChange={(e) => handleInputChange('taxId', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{companyProfile.taxId}</p>
                    )}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {isEditing ? (
                        <Input
                          type="email"
                          value={companyProfile.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="flex-1"
                        />
                      ) : (
                        <span className="text-gray-900">{companyProfile.email}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {isEditing ? (
                        <Input
                          value={companyProfile.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="flex-1"
                        />
                      ) : (
                        <span className="text-gray-900">{companyProfile.phone}</span>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      {isEditing ? (
                        <Input
                          value={companyProfile.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="flex-1"
                        />
                      ) : (
                        <a href={companyProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          {companyProfile.website}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      {isEditing ? (
                        <Textarea
                          value={`${companyProfile.address}, ${companyProfile.city} ${companyProfile.postalCode}, ${companyProfile.country}`}
                          onChange={(e) => {
                            const fullAddress = e.target.value;
                            handleInputChange('address', fullAddress);
                          }}
                          className="flex-1"
                          rows={2}
                        />
                      ) : (
                        <span className="text-gray-900">
                          {companyProfile.address}, {companyProfile.city} {companyProfile.postalCode}, {companyProfile.country}
                        </span>
                      )}
                    </div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                    {isEditing ? (
                      <Textarea
                        value={companyProfile.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-700">{companyProfile.description}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Misi</label>
                    {isEditing ? (
                      <Textarea
                        value={companyProfile.mission}
                        onChange={(e) => handleInputChange('mission', e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-700">{companyProfile.mission}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Visi</label>
                    {isEditing ? (
                      <Textarea
                        value={companyProfile.vision}
                        onChange={(e) => handleInputChange('vision', e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-700">{companyProfile.vision}</p>
                    )}
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {companyProfile.values.map((value, index) => (
                    <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                      <p className="font-medium text-blue-900">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Sertifikasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companyProfile.certifications.map((cert, index) => (
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}