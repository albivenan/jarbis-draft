import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Folder, Search, FileText, Download, Eye, Upload } from 'lucide-react';

export default function DokumenArsip() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const documents = [
    {
      id: 1,
      name: 'SK Promosi Jabatan Q4 2024',
      category: 'SK',
      type: 'PDF',
      size: '2.5 MB',
      uploadDate: '2024-12-15',
      uploadedBy: 'Manajer HRD',
      status: 'active',
      description: 'Surat keputusan promosi jabatan untuk 5 karyawan'
    },
    {
      id: 2,
      name: 'Kontrak Kerja Karyawan Baru',
      category: 'Kontrak',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-12-10',
      uploadedBy: 'Staf HRD',
      status: 'active',
      description: 'Template kontrak kerja untuk karyawan baru'
    },
    {
      id: 3,
      name: 'SOP Absensi Karyawan v2.1',
      category: 'SOP',
      type: 'PDF',
      size: '3.2 MB',
      uploadDate: '2024-12-05',
      uploadedBy: 'Manajer HRD',
      status: 'active',
      description: 'Standar operasional prosedur absensi karyawan'
    },
    {
      id: 4,
      name: 'Laporan Kehadiran November 2024',
      category: 'Laporan',
      type: 'Excel',
      size: '4.1 MB',
      uploadDate: '2024-12-01',
      uploadedBy: 'Staf HRD',
      status: 'archived',
      description: 'Laporan kehadiran karyawan bulan November 2024'
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'archived': return 'Diarsipkan';
      case 'draft': return 'Draft';
      default: return status;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'SK': return 'bg-blue-100 text-blue-800';
      case 'Kontrak': return 'bg-purple-100 text-purple-800';
      case 'SOP': return 'bg-orange-100 text-orange-800';
      case 'Laporan': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    {
      title: 'Total Dokumen',
      value: '248',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Dokumen Aktif',
      value: '186',
      icon: Folder,
      color: 'text-green-600'
    },
    {
      title: 'Upload Bulan Ini',
      value: '12',
      icon: Upload,
      color: 'text-purple-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Dokumen & Arsip Digital"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-hrd' },
        { title: 'Administrasi Perusahaan', href: '#' },
        { title: 'Dokumen & Arsip Digital', href: '/roles/staf-hrd/administrasi/dokumen' }
      ]}
    >
      <Head title="Dokumen & Arsip Digital - HRD" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Folder className="h-8 w-8 text-blue-600" />
              Dokumen & Arsip Digital
            </h1>
            <p className="text-gray-600 mt-1">Kelola dokumen dan arsip digital perusahaan</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Dokumen
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
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

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari berdasarkan nama dokumen atau deskripsi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="SK">SK</SelectItem>
                  <SelectItem value="Kontrak">Kontrak</SelectItem>
                  <SelectItem value="SOP">SOP</SelectItem>
                  <SelectItem value="Laporan">Laporan</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="archived">Diarsipkan</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Dokumen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{doc.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge className={getCategoryColor(doc.category)}>
                        {doc.category}
                      </Badge>
                      <Badge className={getStatusColor(doc.status)}>
                        {getStatusText(doc.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Tipe File</p>
                      <p className="font-medium">{doc.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Ukuran</p>
                      <p className="font-medium">{doc.size}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tanggal Upload</p>
                      <p className="font-medium">{new Date(doc.uploadDate).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Diupload oleh</p>
                      <p className="font-medium">{doc.uploadedBy}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}