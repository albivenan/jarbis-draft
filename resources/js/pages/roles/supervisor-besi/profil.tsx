import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Award, 
  Edit, 
  Save, 
  X,
  Camera,
  Shield,
  Clock,
  Users,
  Target
} from 'lucide-react';

export default function Profil() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    employeeId: 'EMP-SUP-BSI-001',
    fullName: 'Ahmad Supervisor',
    email: 'ahmad.supervisor@company.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Industri No. 123, Jakarta Timur',
    birthDate: '1985-03-15',
    joinDate: '2020-01-15',
    position: 'Supervisor Besi',
    department: 'Produksi Besi',
    directReports: 5,
    emergencyContact: {
      name: 'Siti Ahmad',
      relationship: 'Istri',
      phone: '+62 813-9876-5432'
    },
    education: 'S1 Teknik Mesin',
    certifications: [
      'Certified Welding Inspector (CWI)',
      'ISO 9001:2015 Internal Auditor',
      'Occupational Safety & Health'
    ],
    skills: [
      'Welding Supervision',
      'Quality Control',
      'Team Leadership',
      'Production Planning',
      'Safety Management'
    ]
  });

  const [editData, setEditData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    alert('Profil berhasil diperbarui!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profileData);
  };

  const workStats = [
    {
      title: 'Lama Bekerja',
      value: '5 Tahun',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      title: 'Tim Dibawahi',
      value: profileData.directReports.toString(),
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Proyek Selesai',
      value: '127',
      icon: Target,
      color: 'text-purple-600'
    },
    {
      title: 'Rating Kinerja',
      value: '4.7/5.0',
      icon: Award,
      color: 'text-orange-600'
    }
  ];

  const recentAchievements = [
    {
      title: 'Employee of the Month',
      description: 'Pencapaian terbaik dalam supervisi produksi',
      date: 'Desember 2024',
      type: 'award'
    },
    {
      title: 'Zero Accident Record',
      description: '12 bulan tanpa kecelakaan kerja di tim',
      date: 'Januari 2025',
      type: 'safety'
    },
    {
      title: 'Quality Excellence',
      description: 'Tingkat reject terendah dalam divisi',
      date: 'November 2024',
      type: 'quality'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Profil Saya"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/supervisor-besi' },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Profil', href: '/roles/supervisor-besi/profil' }
      ]}
    >
      <Head title="Profil Saya - Supervisor Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <User className="h-8 w-8 text-blue-600" />
              Profil Saya
            </h1>
            <p className="text-gray-600 mt-1">Kelola informasi profil dan data pribadi Anda</p>
          </div>
          {!isEditing ? (
            <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profil
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Simpan
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
            </div>
          )}
        </div>

        {/* Work Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-full bg-gray-100">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pribadi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{profileData.fullName}</h3>
                    <p className="text-gray-600">{profileData.position}</p>
                    <p className="text-sm text-gray-500">ID: {profileData.employeeId}</p>
                  </div>
                </div>

                {/* Personal Information Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Nama Lengkap
                    </label>
                    {isEditing ? (
                      <Input
                        value={editData.fullName}
                        onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Email
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900 py-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {profileData.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Nomor Telepon
                    </label>
                    {isEditing ? (
                      <Input
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900 py-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {profileData.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Tanggal Lahir
                    </label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editData.birthDate}
                        onChange={(e) => setEditData({...editData, birthDate: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900 py-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {new Date(profileData.birthDate).toLocaleDateString('id-ID')}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Alamat
                    </label>
                    {isEditing ? (
                      <Textarea
                        value={editData.address}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                        rows={2}
                      />
                    ) : (
                      <p className="text-gray-900 py-2 flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                        {profileData.address}
                      </p>
                    )}
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
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Nama
                    </label>
                    {isEditing ? (
                      <Input
                        value={editData.emergencyContact.name}
                        onChange={(e) => setEditData({
                          ...editData, 
                          emergencyContact: {...editData.emergencyContact, name: e.target.value}
                        })}
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.emergencyContact.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Hubungan
                    </label>
                    {isEditing ? (
                      <Input
                        value={editData.emergencyContact.relationship}
                        onChange={(e) => setEditData({
                          ...editData, 
                          emergencyContact: {...editData.emergencyContact, relationship: e.target.value}
                        })}
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.emergencyContact.relationship}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Nomor Telepon
                    </label>
                    {isEditing ? (
                      <Input
                        value={editData.emergencyContact.phone}
                        onChange={(e) => setEditData({
                          ...editData, 
                          emergencyContact: {...editData.emergencyContact, phone: e.target.value}
                        })}
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profileData.emergencyContact.phone}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Work Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Informasi Pekerjaan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Posisi</p>
                  <p className="text-gray-900">{profileData.position}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Departemen</p>
                  <p className="text-gray-900">{profileData.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tanggal Bergabung</p>
                  <p className="text-gray-900">{new Date(profileData.joinDate).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tim Dibawahi</p>
                  <p className="text-gray-900">{profileData.directReports} orang</p>
                </div>
              </CardContent>
            </Card>

            {/* Education & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Pendidikan & Sertifikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Pendidikan Terakhir</p>
                  <p className="text-gray-900">{profileData.education}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Sertifikasi</p>
                  <div className="space-y-2">
                    {profileData.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="block w-fit">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Keahlian</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Pencapaian Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAchievements.map((achievement, index) => (
                    <div key={index} className="border-l-4 border-l-green-500 pl-4">
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
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