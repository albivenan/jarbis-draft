import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Download, Eye, Edit, Plus } from 'lucide-react';

interface QualityStandard {
  id: string;
  productCategory: string;
  standardName: string;
  version: string;
  lastUpdated: string;
  status: 'active' | 'draft' | 'archived';
  parameters: Array<{
    parameter: string;
    specification: string;
    tolerance: string;
    testMethod: string;
  }>;
  approvedBy: string;
}

export default function StandarKualitas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const qualityStandards: QualityStandard[] = [
    {
      id: '1',
      productCategory: 'Meja Kayu',
      standardName: 'Standar Kualitas Meja Kayu Premium',
      version: 'v2.1',
      lastUpdated: '2024-01-10',
      status: 'active',
      approvedBy: 'Manajer QC',
      parameters: [
        {
          parameter: 'Kualitas Kayu',
          specification: 'Grade A, tidak ada cacat, serat rata',
          tolerance: '0% cacat visible',
          testMethod: 'Visual inspection'
        },
        {
          parameter: 'Dimensi',
          specification: 'Sesuai drawing teknis',
          tolerance: '±2mm',
          testMethod: 'Pengukuran dengan mistar/jangka sorong'
        },
        {
          parameter: 'Kekuatan Sambungan',
          specification: 'Sambungan kuat, tidak goyang',
          tolerance: 'Tidak ada pergerakan >1mm',
          testMethod: 'Uji goyangan manual'
        },
        {
          parameter: 'Finishing',
          specification: 'Halus, rata, tidak ada noda',
          tolerance: 'Roughness <0.5μm',
          testMethod: 'Visual & tactile inspection'
        }
      ]
    },
    {
      id: '2',
      productCategory: 'Kursi Kayu',
      standardName: 'Standar Kualitas Kursi Minimalis',
      version: 'v1.8',
      lastUpdated: '2024-01-08',
      status: 'active',
      approvedBy: 'Manajer QC',
      parameters: [
        {
          parameter: 'Stabilitas',
          specification: 'Kursi stabil, tidak bergoyang',
          tolerance: 'Tidak ada pergerakan >0.5mm',
          testMethod: 'Uji beban 100kg'
        },
        {
          parameter: 'Kenyamanan Duduk',
          specification: 'Ergonomis, nyaman untuk duduk',
          tolerance: 'Sesuai standar ergonomi',
          testMethod: 'User testing'
        },
        {
          parameter: 'Kualitas Pelapis',
          specification: 'Kain/kulit tidak sobek, rata',
          tolerance: '0% cacat visible',
          testMethod: 'Visual inspection'
        }
      ]
    },
    {
      id: '3',
      productCategory: 'Lemari Kayu',
      standardName: 'Standar Kualitas Lemari Pakaian',
      version: 'v2.0',
      lastUpdated: '2024-01-05',
      status: 'active',
      approvedBy: 'Manajer QC',
      parameters: [
        {
          parameter: 'Fungsi Pintu',
          specification: 'Pintu buka tutup lancar',
          tolerance: 'Tidak ada hambatan',
          testMethod: 'Uji buka tutup 50x'
        },
        {
          parameter: 'Kapasitas Beban',
          specification: 'Mampu menahan beban maksimal',
          tolerance: 'Sesuai spesifikasi beban',
          testMethod: 'Load testing'
        },
        {
          parameter: 'Aksesoris',
          specification: 'Handle, rel, engsel berfungsi baik',
          tolerance: 'Tidak ada kerusakan',
          testMethod: 'Functional testing'
        }
      ]
    },
    {
      id: '4',
      productCategory: 'Rak Kayu',
      standardName: 'Standar Kualitas Rak Buku',
      version: 'v1.5',
      lastUpdated: '2023-12-20',
      status: 'draft',
      approvedBy: '-',
      parameters: [
        {
          parameter: 'Kekuatan Rak',
          specification: 'Mampu menahan beban buku',
          tolerance: 'Defleksi <5mm pada beban maksimal',
          testMethod: 'Load testing dengan beban terdistribusi'
        },
        {
          parameter: 'Modularitas',
          specification: 'Dapat dipasang/dibongkar dengan mudah',
          tolerance: 'Waktu assembly <30 menit',
          testMethod: 'Assembly time testing'
        }
      ]
    }
  ];

  const categories = ['all', 'Meja Kayu', 'Kursi Kayu', 'Lemari Kayu', 'Rak Kayu'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'draft': return 'Draft';
      case 'archived': return 'Arsip';
      default: return status;
    }
  };

  const filteredStandards = qualityStandards.filter(standard => {
    const matchesSearch = standard.standardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         standard.productCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || standard.productCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Standar Kualitas Produk</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Standar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{qualityStandards.length}</div>
              <div className="text-sm text-gray-600">Total Standar</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {qualityStandards.filter(s => s.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Aktif</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {qualityStandards.filter(s => s.status === 'draft').length}
              </div>
              <div className="text-sm text-gray-600">Draft</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {qualityStandards.filter(s => s.status === 'archived').length}
              </div>
              <div className="text-sm text-gray-600">Arsip</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari berdasarkan nama standar atau kategori produk..."
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
                  {category === 'all' ? 'Semua Kategori' : category}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Standards List */}
      <div className="grid gap-4">
        {filteredStandards.map((standard) => (
          <Card key={standard.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{standard.standardName}</h3>
                    <Badge className={getStatusColor(standard.status)}>
                      {getStatusText(standard.status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Kategori:</span> {standard.productCategory}</p>
                    <p><span className="font-medium">Versi:</span> {standard.version}</p>
                    <p><span className="font-medium">Terakhir Diupdate:</span> {standard.lastUpdated}</p>
                    <p><span className="font-medium">Disetujui oleh:</span> {standard.approvedBy}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Lihat
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  {standard.status !== 'archived' && (
                    <Button size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              {/* Parameters Preview */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Parameter Kualitas ({standard.parameters.length} parameter)</h4>
                <div className="grid grid-cols-2 gap-4">
                  {standard.parameters.slice(0, 4).map((param, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium text-gray-700">{param.parameter}</p>
                      <p className="text-gray-600">{param.specification}</p>
                      <p className="text-xs text-gray-500">Toleransi: {param.tolerance}</p>
                    </div>
                  ))}
                </div>
                {standard.parameters.length > 4 && (
                  <p className="text-sm text-gray-500 mt-2">
                    +{standard.parameters.length - 4} parameter lainnya...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStandards.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Tidak ada standar kualitas yang sesuai dengan filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
