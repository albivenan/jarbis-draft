import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Send, Camera, FileText } from 'lucide-react';

interface QualityCheckItem {
  id: string;
  parameter: string;
  standard: string;
  result: string;
  status: 'pass' | 'fail' | 'pending';
  notes: string;
}

export default function FormulirLaporan() {
  const [workOrder, setWorkOrder] = useState('WO-KY-2024-001');
  const [productName, setProductName] = useState('Meja Kayu Jati Premium');
  const [inspector, setInspector] = useState('QC Kayu - Siti Aminah');
  const [inspectionDate, setInspectionDate] = useState('2024-01-15');
  const [overallStatus, setOverallStatus] = useState<'pass' | 'fail' | 'conditional'>('pending');
  const [generalNotes, setGeneralNotes] = useState('');

  const [qualityChecks, setQualityChecks] = useState<QualityCheckItem[]>([
    {
      id: '1',
      parameter: 'Kualitas Kayu',
      standard: 'Grade A, tidak ada cacat, serat rata',
      result: '',
      status: 'pending',
      notes: ''
    },
    {
      id: '2',
      parameter: 'Dimensi Produk',
      standard: '150cm x 80cm x 75cm (±2mm)',
      result: '',
      status: 'pending',
      notes: ''
    },
    {
      id: '3',
      parameter: 'Kekuatan Sambungan',
      standard: 'Sambungan kuat, tidak goyang',
      result: '',
      status: 'pending',
      notes: ''
    },
    {
      id: '4',
      parameter: 'Kualitas Finishing',
      standard: 'Halus, rata, tidak ada noda',
      result: '',
      status: 'pending',
      notes: ''
    },
    {
      id: '5',
      parameter: 'Fungsi & Stabilitas',
      standard: 'Stabil, tidak bergoyang',
      result: '',
      status: 'pending',
      notes: ''
    }
  ]);

  const updateQualityCheck = (id: string, field: keyof QualityCheckItem, value: string) => {
    setQualityChecks(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'fail': return 'bg-red-100 text-red-800';
      case 'conditional': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = () => {
    // Logic untuk menyimpan laporan
    console.log('Saving report...', {
      workOrder,
      productName,
      inspector,
      inspectionDate,
      overallStatus,
      qualityChecks,
      generalNotes
    });
  };

  const handleSendReport = () => {
    // Logic untuk mengirim laporan
    console.log('Sending report...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Formulir Laporan QC</h1>
            <p className="text-gray-600">Inspeksi Kualitas Produk Kayu</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Simpan Draft
          </Button>
          <Button onClick={handleSendReport}>
            <Send className="h-4 w-4 mr-2" />
            Kirim Laporan
          </Button>
        </div>
      </div>

      {/* Header Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Inspeksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Work Order</label>
              <Input value={workOrder} onChange={(e) => setWorkOrder(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nama Produk</label>
              <Input value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Inspector</label>
              <Input value={inspector} onChange={(e) => setInspector(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tanggal Inspeksi</label>
              <Input 
                type="date" 
                value={inspectionDate} 
                onChange={(e) => setInspectionDate(e.target.value)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Parameter Kualitas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {qualityChecks.map((check) => (
              <div key={check.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium">{check.parameter}</h4>
                    <p className="text-sm text-gray-600 mt-1">Standard: {check.standard}</p>
                  </div>
                  <select
                    value={check.status}
                    onChange={(e) => updateQualityCheck(check.id, 'status', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="pass">Lulus</option>
                    <option value="fail">Tidak Lulus</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Hasil Pengukuran</label>
                    <Input
                      value={check.result}
                      onChange={(e) => updateQualityCheck(check.id, 'result', e.target.value)}
                      placeholder="Masukkan hasil pengukuran..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Catatan</label>
                    <Input
                      value={check.notes}
                      onChange={(e) => updateQualityCheck(check.id, 'notes', e.target.value)}
                      placeholder="Catatan tambahan..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overall Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Penilaian Keseluruhan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status Keseluruhan</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="overallStatus"
                    value="pass"
                    checked={overallStatus === 'pass'}
                    onChange={(e) => setOverallStatus(e.target.value as 'pass')}
                    className="mr-2"
                  />
                  <Badge className="bg-green-100 text-green-800">Lulus</Badge>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="overallStatus"
                    value="conditional"
                    checked={overallStatus === 'conditional'}
                    onChange={(e) => setOverallStatus(e.target.value as 'conditional')}
                    className="mr-2"
                  />
                  <Badge className="bg-yellow-100 text-yellow-800">Lulus Bersyarat</Badge>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="overallStatus"
                    value="fail"
                    checked={overallStatus === 'fail'}
                    onChange={(e) => setOverallStatus(e.target.value as 'fail')}
                    className="mr-2"
                  />
                  <Badge className="bg-red-100 text-red-800">Tidak Lulus</Badge>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Catatan Umum</label>
              <Textarea
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                placeholder="Masukkan catatan umum, rekomendasi, atau tindakan yang diperlukan..."
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card>
        <CardHeader>
          <CardTitle>Lampiran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Tambah Foto
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Tambah Dokumen
            </Button>
          </div>
          <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-gray-500">Belum ada lampiran. Klik tombol di atas untuk menambah foto atau dokumen.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}