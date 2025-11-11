import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, AlertTriangle, Package, FileText } from 'lucide-react';

export default function ChecklistQC() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [checklistData, setChecklistData] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const qcItems = [
    {
      id: 'QC-KYU-001',
      workOrder: 'WO-KYU-001',
      product: 'Meja Kayu Jati Custom',
      quantity: 5,
      unit: 'unit',
      status: 'pending',
      checklist: [
        { id: 'dimension', label: 'Dimensi sesuai spesifikasi', required: true },
        { id: 'surface', label: 'Permukaan halus tanpa cacat', required: true },
        { id: 'joint', label: 'Sambungan kuat dan presisi', required: true },
        { id: 'grain', label: 'Arah serat kayu konsisten', required: true },
        { id: 'moisture', label: 'Kadar air sesuai standar (<12%)', required: false },
        { id: 'finish', label: 'Finishing sesuai spesifikasi', required: true }
      ]
    },
    {
      id: 'QC-KYU-002',
      workOrder: 'WO-KYU-002',
      product: 'Lemari Kayu Mahoni',
      quantity: 3,
      unit: 'unit',
      status: 'completed',
      checklist: [
        { id: 'assembly', label: 'Perakitan sesuai gambar teknis', required: true },
        { id: 'door_fit', label: 'Pintu pas dan tidak menggantung', required: true },
        { id: 'drawer', label: 'Laci bergerak lancar', required: true },
        { id: 'duco_finish', label: 'Finishing duco merata dan halus', required: true },
        { id: 'hardware', label: 'Hardware terpasang dengan baik', required: true },
        { id: 'color_match', label: 'Warna sesuai dengan standar', required: true }
      ]
    },
    {
      id: 'QC-KYU-003',
      workOrder: 'WO-KYU-003',
      product: 'Kursi Kayu Jati Ukir',
      quantity: 8,
      unit: 'unit',
      status: 'pending',
      checklist: [
        { id: 'carving', label: 'Detail ukiran presisi dan halus', required: true },
        { id: 'stability', label: 'Struktur kursi stabil dan kuat', required: true },
        { id: 'comfort', label: 'Ergonomi sesuai standar', required: true },
        { id: 'polish', label: 'Polishing merata tanpa noda', required: true },
        { id: 'pattern', label: 'Pola ukiran sesuai desain', required: true }
      ]
    }
  ];

  const handleChecklistChange = (itemId: string, checkId: string, checked: boolean) => {
    setChecklistData(prev => ({
      ...prev,
      [`${itemId}-${checkId}`]: checked
    }));
  };

  const handleNotesChange = (itemId: string, value: string) => {
    setNotes(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const getCompletionPercentage = (item: any) => {
    const totalChecks = item.checklist.length;
    const completedChecks = item.checklist.filter((check: any) => 
      checklistData[`${item.id}-${check.id}`]
    ).length;
    return Math.round((completedChecks / totalChecks) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Lulus QC';
      case 'pending': return 'Menunggu QC';
      case 'failed': return 'Tidak Lulus';
      default: return status;
    }
  };

  const stats = [
    {
      title: 'Total Item QC',
      value: qcItems.length.toString(),
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Lulus QC',
      value: qcItems.filter(item => item.status === 'completed').length.toString(),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Menunggu QC',
      value: qcItems.filter(item => item.status === 'pending').length.toString(),
      icon: AlertTriangle,
      color: 'text-yellow-600'
    },
    {
      title: 'Checklist Selesai',
      value: '78%',
      icon: FileText,
      color: 'text-purple-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Checklist QC"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-produksi-kayu' },
        { title: 'Kualitas', href: '#' },
        { title: 'Checklist QC', href: '/roles/staf-produksi-kayu/kualitas/checklist-qc' }
      ]}
    >
      <Head title="Checklist QC - Staf Produksi Kayu" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              Checklist Quality Control
            </h1>
            <p className="text-gray-600 mt-1">Periksa kualitas produk kayu sebelum diserahkan ke QC</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* QC Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Items List */}
          <Card>
            <CardHeader>
              <CardTitle>Item Menunggu QC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qcItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedItem === item.id ? 'border-amber-500 bg-amber-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedItem(item.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{item.id}</h4>
                        <p className="text-sm text-gray-600">{item.product}</p>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span>{item.quantity} {item.unit}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-amber-600 h-2 rounded-full" 
                            style={{ width: `${getCompletionPercentage(item)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{getCompletionPercentage(item)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Checklist Detail */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedItem ? `Checklist - ${selectedItem}` : 'Pilih Item untuk QC'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedItem ? (
                <div className="space-y-4">
                  {qcItems.find(item => item.id === selectedItem)?.checklist.map((check) => (
                    <div key={check.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Checkbox
                        id={`${selectedItem}-${check.id}`}
                        checked={checklistData[`${selectedItem}-${check.id}`] || false}
                        onCheckedChange={(checked) => 
                          handleChecklistChange(selectedItem, check.id, checked as boolean)
                        }
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor={`${selectedItem}-${check.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {check.label}
                          {check.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Catatan QC
                    </label>
                    <Textarea
                      placeholder="Tambahkan catatan hasil pemeriksaan kualitas kayu..."
                      value={notes[selectedItem] || ''}
                      onChange={(e) => handleNotesChange(selectedItem, e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Lulus QC
                    </Button>
                    <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Tidak Lulus
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Pilih Item untuk QC</h3>
                  <p className="text-gray-600">Klik pada item di sebelah kiri untuk memulai checklist QC</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}