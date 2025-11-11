import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  Search, 
  Filter,
  Plus,
  Eye,
  Edit,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  Calendar,
  BookOpen,
  Target
} from 'lucide-react';

interface SOP {
  id: number;
  code: string;
  title: string;
  category: 'hrd' | 'produksi' | 'keuangan' | 'marketing' | 'qc' | 'umum';
  department: string;
  version: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  effective_date: string;
  review_date: string;
  next_review_date: string;
  approved_by: string;
  created_by: string;
  description: string;
  objective: string;
  scope: string;
  steps: Array<{
    step_number: number;
    title: string;
    description: string;
    responsible: string;
    duration?: string;
  }>;
  related_documents: string[];
  attachments: string[];
  download_count: number;
}

export default function PeraturanSOP({ sops }: { sops: SOP[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const categories = ['all', 'hrd', 'produksi', 'keuangan', 'marketing', 'qc', 'umum'];
  const statuses = ['all', 'draft', 'review', 'approved', 'archived'];
  const departments = ['all', 'HRD', 'Produksi', 'Keuangan', 'Marketing', 'Quality Control', 'PPIC', 'IT'];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hrd': return 'bg-blue-100 text-blue-800';
      case 'produksi': return 'bg-green-100 text-green-800';
      case 'keuangan': return 'bg-purple-100 text-purple-800';
      case 'marketing': return 'bg-orange-100 text-orange-800';
      case 'qc': return 'bg-red-100 text-red-800';
      case 'umum': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'review': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'archived': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'hrd': return 'HRD';
      case 'produksi': return 'Produksi';
      case 'keuangan': return 'Keuangan';
      case 'marketing': return 'Marketing';
      case 'qc': return 'Quality Control';
      case 'umum': return 'Umum';
      default: return category;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'review': return 'Review';
      case 'approved': return 'Disetujui';
      case 'archived': return 'Diarsipkan';
      default: return status;
    }
  };

  const filteredSOPs = sops.filter(sop => {
    const matchesSearch = sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sop.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sop.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || sop.status === selectedStatus;
    const matchesDepartment = selectedDepartment === 'all' || sop.department === selectedDepartment;
    return matchesSearch && matchesCategory && matchesStatus && matchesDepartment;
  });

  const sopSummary = {
    total: sops.length,
    draft: sops.filter(s => s.status === 'draft').length,
    review: sops.filter(s => s.status === 'review').length,
    approved: sops.filter(s => s.status === 'approved').length,
    archived: sops.filter(s => s.status === 'archived').length,
    totalDownloads: sops.reduce((sum, sop) => sum + sop.download_count, 0)
  };

  const isSOPDueForReview = (nextReviewDate: string) => {
    if (!nextReviewDate) return false;
    const today = new Date();
    const reviewDate = new Date(nextReviewDate);
    const daysUntilReview = Math.ceil((reviewDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilReview <= 30 && daysUntilReview > 0;
  };

  return (
    <AuthenticatedLayout
      title="Peraturan & SOP"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-hrd' },
        { title: 'Administrasi Perusahaan', href: '#' },
        { title: 'Peraturan & SOP', href: '/roles/manajer-hrd/administrasi/sop' }
      ]}
    >
      <Head title="Peraturan & SOP - Manajer HRD" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="h-8 w-8 text-blue-600" />
              Peraturan & SOP
            </h1>
            <p className="text-gray-600 mt-1">Kelola Standard Operating Procedures dan peraturan perusahaan</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Buat SOP Baru
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total SOP</p>
                  <p className="text-2xl font-bold text-gray-900">{sopSummary.total}</p>
                  <p className="text-sm text-blue-600">{sopSummary.totalDownloads} downloads</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Draft</p>
                  <p className="text-2xl font-bold text-gray-900">{sopSummary.draft}</p>
                  <p className="text-sm text-gray-600">Dalam penyusunan</p>
                </div>
                <div className="p-3 rounded-full bg-gray-100">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Review</p>
                  <p className="text-2xl font-bold text-yellow-900">{sopSummary.review}</p>
                  <p className="text-sm text-yellow-600">Menunggu review</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disetujui</p>
                  <p className="text-2xl font-bold text-green-900">{sopSummary.approved}</p>
                  <p className="text-sm text-green-600">Aktif berlaku</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Diarsipkan</p>
                  <p className="text-2xl font-bold text-red-900">{sopSummary.archived}</p>
                  <p className="text-sm text-red-600">Tidak berlaku</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari SOP berdasarkan judul, kode, atau deskripsi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Semua Kategori' : getCategoryText(category)}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Semua Status' : getStatusText(status)}
                  </option>
                ))}
              </select>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'Semua Departemen' : dept}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* SOP List */}
        <div className="grid gap-6">
          {filteredSOPs.map((sop) => (
            <Card key={sop.id} className={`hover:shadow-lg transition-shadow ${isSOPDueForReview(sop.next_review_date) ? 'border-yellow-200 bg-yellow-50' : ''}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{sop.title}</h3>
                      <Badge className={getCategoryColor(sop.category)}>
                        {getCategoryText(sop.category)}
                      </Badge>
                      <Badge className={getStatusColor(sop.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(sop.status)}
                          <span>{getStatusText(sop.status)}</span>
                        </div>
                      </Badge>
                      {isSOPDueForReview(sop.next_review_date) && (
                        <Badge className="bg-orange-100 text-orange-800">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due Review
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <p><span className="font-medium">Kode SOP:</span> {sop.code}</p>
                        <p><span className="font-medium">Versi:</span> {sop.version}</p>
                        <p><span className="font-medium">Departemen:</span> {sop.department}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Berlaku:</span> {sop.effective_date}</p>
                        <p><span className="font-medium">Review Terakhir:</span> {sop.review_date}</p>
                        <p><span className="font-medium">Review Berikutnya:</span> {sop.next_review_date}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Dibuat oleh:</span> {sop.created_by}</p>
                        <p><span className="font-medium">Disetujui oleh:</span> {sop.approved_by}</p>
                        <p><span className="font-medium">Download:</span> {sop.download_count}x</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Tujuan:
                      </h4>
                      <p className="text-gray-700 text-sm">{sop.objective}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Deskripsi:</h4>
                      <p className="text-gray-700 text-sm">{sop.description}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Ruang Lingkup:</h4>
                      <p className="text-gray-700 text-sm">{sop.scope}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Langkah-langkah ({sop.steps?.length || 0} tahap):</h4>
                      <div className="space-y-2">
                        {sop.steps?.slice(0, 3).map((step, index) => (
                          <div key={index} className="flex items-start gap-3 text-sm">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                              {step.step_number}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{step.title}</p>
                              <p className="text-gray-600">{step.description}</p>
                              <p className="text-xs text-gray-500">
                                PIC: {step.responsible} {step.duration && `• Durasi: ${step.duration}`}
                              </p>
                            </div>
                          </div>
                        ))}
                        {sop.steps?.length > 3 && (
                          <p className="text-sm text-gray-500 ml-9">+{sop.steps.length - 3} langkah lainnya...</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Dokumen Terkait:</h4>
                      <div className="flex flex-wrap gap-2">
                        {sop.related_documents?.map((doc, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {sop.attachments?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Lampiran:</h4>
                        <div className="flex flex-wrap gap-2">
                          {sop.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
                              <FileText className="h-3 w-3" />
                              <span>{attachment}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-6">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Lihat
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    {sop.status === 'draft' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Users className="h-4 w-4 mr-2" />
                        Submit Review
                      </Button>
                    )}
                    {sop.status === 'review' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSOPs.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">Tidak ada data SOP untuk ditampilkan. Silakan buat data baru.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}