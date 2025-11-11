import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Save, Send, Camera, Upload, CheckCircle, AlertTriangle, X } from 'lucide-react';

export default function FormulirLaporan() {
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [inspectionResult, setInspectionResult] = useState<string>('');
  const [overallScore, setOverallScore] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string>('');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [defects, setDefects] = useState<Array<{id: string, category: string, description: string, severity: string}>>([]);

  const inspectionItems = [
    {
      id: 'INS-BSI-001',
      workOrder: 'WO-BSI-001',
      product: 'Rangka Besi H-Beam 200x100',
      quantity: 5,
      unit: 'unit',
      submittedBy: 'Ahmad Santoso',
      location: 'Workshop A - Bay 1'
    },
    {
      id: 'INS-BSI-002',
      workOrder: 'WO-BSI-002',
      product: 'Pagar Besi Ornamen',
      quantity: 10,
      unit: 'meter',
      submittedBy: 'Candra Wijaya',
      location: 'Workshop A - Bay 2'
    }
  ];

  const checklistItems = [
    { id: 'dimension', category: 'Dimensi', label: 'Dimensi sesuai dengan spesifikasi teknis', critical: true },
    { id: 'welding_quality', category: 'Pengelasan', label: 'Kualitas pengelasan memenuhi standar', critical: true },
    { id: 'surface_finish', category: 'Finishing', label: 'Permukaan halus dan bebas dari cacat', critical: false },
    { id: 'coating', category: 'Finishing', label: 'Lapisan cat/coating merata dan tidak ada yang terlewat', critical: false },
    { id: 'assembly', category: 'Assembly', label: 'Perakitan sesuai dengan gambar teknis', critical: true },
    { id: 'strength', category: 'Struktur', label: 'Kekuatan struktur sesuai dengan beban yang direncanakan', critical: true },
    { id: 'safety', category: 'Keselamatan', label: 'Tidak ada bagian yang tajam atau berbahaya', critical: true },
    { id: 'marking', category: 'Identifikasi', label: 'Marking dan identifikasi produk jelas dan benar', critical: false }
  ];

  const defectCategories = [
    'Pengelasan', 'Dimensi', 'Finishing', 'Assembly', 'Material', 'Keselamatan'
  ];

  const severityLevels = [
    { value: 'minor', label: 'Minor', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'major', label: 'Major', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
  ];

  const handleChecklistChange = (itemId: string, checked: boolean) => {
    setChecklist(prev => ({
      ...prev,
      [itemId]: checked
    }));
  };

  const addDefect = () => {
    const newDefect = {
      id: `defect-${Date.now()}`,
      category: '',
      description: '',
      severity: 'minor'
    };
    setDefects(prev => [...prev, newDefect]);
  };

  const updateDefect = (id: string, field: string, value: string) => {
    setDefects(prev => prev.map(defect => 
      defect.id === id ? { ...defect, [field]: value } : defect
    ));
  };

  const removeDefect = (id: string) => {
    setDefects(prev => prev.filter(defect => defect.id !== id));
  };

  const calculateScore = () => {
    const totalItems = checklistItems.length;
    const passedItems = checklistItems.filter(item => checklist[item.id]).length;
    const criticalFailed = checklistItems.filter(item => item.critical && !checklist[item.id]).length;
    
    let baseScore = (passedItems / totalItems) * 100;
    
    // Deduct points for critical failures
    baseScore -= (criticalFailed * 15);
    
    // Deduct points for defects
    const defectPenalty = defects.reduce((penalty, defect) => {
      switch (defect.severity) {
        case 'critical': return penalty + 20;
        case 'major': return penalty + 10;
        case 'minor': return penalty + 5;
        default: return penalty;
      }
    }, 0);
    
    const finalScore = Math.max(0, Math.min(100, baseScore - defectPenalty));
    setOverallScore(Math.round(finalScore));
    
    // Auto-determine result based on score
    if (finalScore >= 90) {
      setInspectionResult('passed');
    } else if (finalScore >= 75) {
      setInspectionResult('conditional');
    } else {
      setInspectionResult('failed');
    }
  };

  React.useEffect(() => {
    calculateScore();
  }, [checklist, defects]);

  const handleSubmitReport = () => {
    if (!selectedItem || !inspectionResult) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    const reportData = {
      inspectionId: selectedItem,
      result: inspectionResult,
      score: overallScore,
      checklist,
      defects,
      notes,
      recommendations,
      inspector: 'QC Besi - Indra Wijaya',
      inspectionDate: new Date().toISOString()
    };

    console.log('Submitting inspection report:', reportData);
    alert('Laporan inspeksi berhasil disimpan!');
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'conditional': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'passed': return 'LULUS';
      case 'failed': return 'TIDAK LULUS';
      case 'conditional': return 'LULUS BERSYARAT';
      default: return 'Belum Ditentukan';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <AuthenticatedLayout
      title="Formulir Laporan QC"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/qc-besi' },
        { title: 'Inspeksi QC', href: '#' },
        { title: 'Formulir Laporan QC', href: '/roles/qc-besi/inspeksi/formulir-laporan' }
      ]}
    >
      <Head title="Formulir Laporan QC - QC Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-gray-600" />
              Formulir Laporan QC
            </h1>
            <p className="text-gray-600 mt-1">Buat laporan hasil inspeksi kualitas produk besi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Pilih Item Inspeksi</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedItem} onValueChange={setSelectedItem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih item yang akan diinspeksi" />
                  </SelectTrigger>
                  <SelectContent>
                    {inspectionItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.id} - {item.product} ({item.quantity} {item.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedItem && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    {(() => {
                      const item = inspectionItems.find(i => i.id === selectedItem);
                      return item ? (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Work Order:</span> {item.workOrder}
                          </div>
                          <div>
                            <span className="font-medium">Lokasi:</span> {item.location}
                          </div>
                          <div>
                            <span className="font-medium">Crew:</span> {item.submittedBy}
                          </div>
                          <div>
                            <span className="font-medium">Quantity:</span> {item.quantity} {item.unit}
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Checklist */}
            {selectedItem && (
              <Card>
                <CardHeader>
                  <CardTitle>Checklist Inspeksi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {checklistItems.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <Checkbox
                          id={item.id}
                          checked={checklist[item.id] || false}
                          onCheckedChange={(checked) => handleChecklistChange(item.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <label htmlFor={item.id} className="text-sm font-medium cursor-pointer flex items-center gap-2">
                            {item.label}
                            {item.critical && (
                              <Badge variant="outline" className="text-red-600 border-red-300">
                                Critical
                              </Badge>
                            )}
                          </label>
                          <p className="text-xs text-gray-500 mt-1">Kategori: {item.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Defects */}
            {selectedItem && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Defect yang Ditemukan</CardTitle>
                    <Button size="sm" onClick={addDefect} variant="outline">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Tambah Defect
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {defects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                      <p>Tidak ada defect yang ditemukan</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {defects.map((defect) => (
                        <div key={defect.id} className="p-4 border rounded-lg bg-red-50">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium text-red-800">Defect #{defects.indexOf(defect) + 1}</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeDefect(defect.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Kategori
                              </label>
                              <Select
                                value={defect.category}
                                onValueChange={(value) => updateDefect(defect.id, 'category', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                  {defectCategories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Severity
                              </label>
                              <Select
                                value={defect.severity}
                                onValueChange={(value) => updateDefect(defect.id, 'severity', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih severity" />
                                </SelectTrigger>
                                <SelectContent>
                                  {severityLevels.map((level) => (
                                    <SelectItem key={level.value} value={level.value}>
                                      {level.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              Deskripsi Defect
                            </label>
                            <Textarea
                              value={defect.description}
                              onChange={(e) => updateDefect(defect.id, 'description', e.target.value)}
                              placeholder="Jelaskan detail defect yang ditemukan..."
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Notes and Recommendations */}
            {selectedItem && (
              <Card>
                <CardHeader>
                  <CardTitle>Catatan dan Rekomendasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Catatan Inspeksi
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tambahkan catatan detail hasil inspeksi..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Rekomendasi Perbaikan
                    </label>
                    <Textarea
                      value={recommendations}
                      onChange={(e) => setRecommendations(e.target.value)}
                      placeholder="Berikan rekomendasi untuk perbaikan atau tindak lanjut..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Foto Dokumentasi (opsional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload foto hasil inspeksi</p>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Pilih File
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary Section */}
          <div className="space-y-6">
            {selectedItem && (
              <>
                {/* Score Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hasil Inspeksi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getScoreColor(overallScore)}`}>
                        {overallScore}/100
                      </div>
                      <Badge className={getResultColor(inspectionResult)}>
                        {getResultText(inspectionResult)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Checklist Passed:</span>
                        <span className="font-medium">
                          {checklistItems.filter(item => checklist[item.id]).length}/{checklistItems.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Critical Issues:</span>
                        <span className="font-medium text-red-600">
                          {checklistItems.filter(item => item.critical && !checklist[item.id]).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Defects:</span>
                        <span className="font-medium text-orange-600">
                          {defects.length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <Button 
                      onClick={handleSubmitReport}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={!selectedItem || !inspectionResult}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Laporan
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Draft
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}