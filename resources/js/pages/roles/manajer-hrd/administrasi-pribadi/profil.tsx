import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Edit,
  Save,
  Camera,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Shield,
  Award,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface UserProfile {
  employeeId: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  birthDate: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
  workExperience: Array<{
    company: string;
    position: string;
    duration: string;
  }>;
  skills: string[];
  bio: string;
}

export default function ProfilManajerHRD() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    employeeId: 'EMP-HRD-001',
    name: 'Dr. Sarah Wijayanti, M.Psi',
    position: 'Manajer HRD',
    department: 'Human Resources Development',
    email: 'sarah.wijayanti@company.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Sudirman No. 123, Jakarta Selatan 12190',
    joinDate: '2020-03-15',
    birthDate: '1985-07-22',
    emergencyContact: {
      name: 'Ahmad Wijayanti',
      relationship: 'Suami',
      phone: '+62 813-9876-5432'
    },
    education: [
      {
        degree: 'S2 Psikologi Industri',
        institution: 'Universitas Indonesia',
        year: '2010'
      },
      {
        degree: 'S1 Psikologi',
        institution: 'Universitas Gadjah Mada',
        year: '2008'
      }
    ],
    certifications: [
      {
        name: 'Certified Human Resources Professional (CHRP)',
        issuer: 'HCMI',
        date: '2021-06-15',
        expiryDate: '2024-06-15'
      },
      {
        name: 'ISO 9001:2015 Lead Auditor',
        issuer: 'BSI Group',
        date: '2022-03-20',
        expiryDate: '2025-03-20'
      },
      {
        name: 'Competency Based HR Management',
        issuer: 'Dale Carnegie Indonesia',
        date: '2020-11-10'
      }
    ],
    workExperience: [
      {
        company: 'PT. Maju Bersama',
        position: 'Senior HR Specialist',
        duration: '2017 - 2020'
      },
      {
        company: 'CV. Karya Mandiri',
        position: 'HR Officer',
        duration: '2015 - 2017'
      },
      {
        company: 'PT. Sukses Jaya',
        position: 'HR Assistant',
        duration: '2012 - 2015'
      }
    ],
    skills: [
      'Strategic HR Planning',
      'Talent Management',
      'Performance Management',
      'Employee Relations',
      'Compensation & Benefits',
      'Training & Development',
      'HR Analytics',
      'Change Management',
      'Leadership Development',
      'Organizational Psychology'
    ],
    bio: 'Profesional HRD berpengalaman 12+ tahun dengan keahlian dalam strategic HR planning, talent management, dan organizational development. Memiliki track record yang kuat dalam membangun sistem HR yang efektif dan mengembangkan budaya kerja yang positif.'
  });

  const handleSave = () => {
    // Logic untuk menyimpan perubahan profil
    console.log('Saving profile changes...', profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({
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

  const calculateYearsOfService = (joinDate: string) => {
    const today = new Date();
    const join = new Date(joinDate);
    const years = today.getFullYear() - join.getFullYear();
    const months = today.getMonth() - join.getMonth();
    
    if (months < 0) {
      return `${years - 1} tahun ${12 + months} bulan`;
    } else {
      return `${years} tahun ${months} bulan`;
    }
  };

  return (
    <AuthenticatedLayout
      title="Profil Saya"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-hrd' },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Profil', href: '/roles/manajer-hrd/administrasi-pribadi/profil' }
      ]}
    >
      <Head title="Profil - Manajer HRD" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <User className="h-8 w-8 text-blue-600" />
              Profil Saya
            </h1>
            <p className="text-gray-600 mt-1">Kelola informasi profil dan data pribadi Anda</p>
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
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                      {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{profile.name}</h2>
                  <p className="text-gray-600 mb-2">{profile.position}</p>
                  <Badge className="bg-blue-100 text-blue-800 mb-4">
                    {profile.employeeId}
                  </Badge>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span>{profile.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Bergabung {profile.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{calculateYearsOfService(profile.joinDate)} masa kerja</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Statistik</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sertifikasi Aktif</span>
                    <span className="font-semibold">{profile.certifications.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Keahlian</span>
                    <span className="font-semibold">{profile.skills.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pengalaman Kerja</span>
                    <span className="font-semibold">{profile.workExperience.length} perusahaan</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pribadi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    {isEditing ? (
                      <Input
                        value={profile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={profile.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.birthDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {isEditing ? (
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="flex-1"
                        />
                      ) : (
                        <span className="text-gray-900">{profile.email}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {isEditing ? (
                        <Input
                          value={profile.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="flex-1"
                        />
                      ) : (
                        <span className="text-gray-900">{profile.phone}</span>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      {isEditing ? (
                        <Textarea
                          value={profile.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="flex-1"
                          rows={2}
                        />
                      ) : (
                        <span className="text-gray-900">{profile.address}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Kontak Darurat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                    {isEditing ? (
                      <Input
                        value={profile.emergencyContact.name}
                        onChange={(e) => handleInputChange('emergencyContact', {
                          ...profile.emergencyContact,
                          name: e.target.value
                        })}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.emergencyContact.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hubungan</label>
                    {isEditing ? (
                      <Input
                        value={profile.emergencyContact.relationship}
                        onChange={(e) => handleInputChange('emergencyContact', {
                          ...profile.emergencyContact,
                          relationship: e.target.value
                        })}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.emergencyContact.relationship}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                    {isEditing ? (
                      <Input
                        value={profile.emergencyContact.phone}
                        onChange={(e) => handleInputChange('emergencyContact', {
                          ...profile.emergencyContact,
                          phone: e.target.value
                        })}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.emergencyContact.phone}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle>Pendidikan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">Lulus tahun {edu.year}</p>
                      </div>
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
                  {profile.certifications.map((cert, index) => (
                    <div key={index} className={`flex items-start gap-3 p-3 border rounded-lg ${isCertificationExpiring(cert.expiryDate) ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Shield className="h-4 w-4 text-green-600" />
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
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Segera Expired
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Pengalaman Kerja</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.workExperience.map((exp, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{exp.position}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Keahlian</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>Tentang Saya</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    placeholder="Ceritakan tentang diri Anda..."
                  />
                ) : (
                  <p className="text-gray-700">{profile.bio}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}