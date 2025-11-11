import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Download, Eye, Filter } from 'lucide-react';

interface InspectionRecord {
  id: string;
  date: string;
  productName: string;
  productCode: string;
  batchNumber: string;
  inspector: string;
  result: 'pass' | 'fail' | 'conditional';
  defectCount: number;
  notes: string;
}

export default function RiwayatInspeksi() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResult, setSelectedResult] = useState<string>('all');

  const inspectionRecords: InspectionRecord[] = [
    {
      id: '1',
      date: '2024-01-15',
      productName: 'Meja Kayu Premium',
      productCode: 'MKP-001',
      batchNumber: 'BATCH-2024-001',
      inspector: 'Ahmad Fauzi',
      result: 'pass',
      defectCount: 0,
      notes: 'Semua parameter sesuai standar'
    },
    {
      id: '2',
      date: '2024-01-15',
      productName: 'Kursi Minimalis',
      productCode: 'KM-002',
      batchNumber: 'BATCH-2024-002',
      inspector: 'Siti Nurhaliza',
      result: 'fail',
      defectCount: 3,
      notes: 'Ditemukan cacat pada finishing dan sambungan'
    },
    {
      id: '3',
      date: '2024-01-14',
      productName: 'Lemari Pakaian',
      productCode: 'LP-003',
      batchNumber: 'BATCH-2024-003',
      inspector: 'Ahmad Fauzi',
      result: 'conditional',
      defectCount: 1,
      notes: 'Minor defect pada handle, dapat diperbaiki'
    },
    {
      id: '4',
      date: '2024-01-14',
      productName: 'Rak Buku',
      productCode: 'RB-004',
      batchNumber: 'BATCH-2024-004',
      inspector: 'Budi Santoso',
      result: 'pass',
      defectCount: 0,
      notes: 'Kualitas sangat baik'
    }
  ];

  const getResultColor = (result: string) => {
    switch (result) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'fail': return 'bg-red-100 text-red-800';
      case 'conditional': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'pass': return 'Lulus';
      case 'fail': return 'Gagal';
      case 'conditional': return 'Bersyarat';
      default: return result;
    }
  };

  const filteredRecords = inspectionRecords.filter(record => {
    const matchesSearch = record.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResult = selectedResult === 'all' || record.result === selectedResult;
    return matchesSearch && matchesResult;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Riwayat Inspeksi</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{inspectionRecords.length}</div>
              <div className="text-sm text-gray-600">Total Inspeksi</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {inspectionRecords.filter(r => r.result === 'pass').length}
              </div>
              <div className="text-sm text-gray-600">Lulus</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {inspectionRecords.filter(r => r.result === 'fail').length}
              </div>
              <div className="text-sm text-gray-600">Gagal</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {inspectionRecords.filter(r => r.result === 'conditional').length}
              </div>
              <div className="text-sm text-gray-600">Bersyarat</div>
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
                  placeholder="Cari berdasarkan nama produk, kode, atau batch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedResult}
              onChange={(e) => setSelectedResult(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">Semua Hasil</option>
              <option value="pass">Lulus</option>
              <option value="fail">Gagal</option>
              <option value="conditional">Bersyarat</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <div className="grid gap-4">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{record.productName}</h3>
                    <Badge className={getResultColor(record.result)}>
                      {getResultText(record.result)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Kode Produk:</span> {record.productCode}</p>
                    <p><span className="font-medium">Batch:</span> {record.batchNumber}</p>
                    <p><span className="font-medium">Tanggal:</span> {record.date}</p>
                    <p><span className="font-medium">Inspector:</span> {record.inspector}</p>
                    <p><span className="font-medium">Jumlah Cacat:</span> {record.defectCount}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-700">Catatan:</p>
                    <p className="text-gray-600">{record.notes}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Detail
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Tidak ada riwayat inspeksi yang sesuai dengan filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
