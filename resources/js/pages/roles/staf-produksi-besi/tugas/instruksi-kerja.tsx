import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Eye, AlertTriangle, CheckCircle, Clock, Wrench } from 'lucide-react';

export default function InstruksiKerja() {
  const [selectedInstruction, setSelectedInstruction] = useState<string | null>(null);

  const instructions = [
    {
      id: 'IK-BSI-001',
      workOrder: 'WO-BSI-001',
      title: 'Instruksi Pengelasan H-Beam',
      product: 'Rangka Besi H-Beam 200x100',
      version: '2.1',
      lastUpdated: '2025-01-03',
      status: 'active',
      priority: 'high',
      estimatedTime: '6 jam',
      safetyLevel: 'high',
      steps: [
        {
          step: 1,
          title: 'Persiapan Material',
          description: 'Siapkan besi H-beam sesuai ukuran yang tertera pada gambar teknis',
          tools: ['Penggaris besi', 'Spidol permanen', 'Gerinda potong'],
          materials: ['H-beam 200x100', 'Elektroda E7018'],
          safetyNotes: 'Gunakan APD lengkap, pastikan area kerja bersih',
          duration: '30 menit'
        },
        {
          step: 2,
          title: 'Pemotongan Sesuai Ukuran',
          description: 'Potong H-beam sesuai dengan marking yang telah dibuat',
          tools: ['Mesin potong plasma', 'Klem besi', 'Meja kerja'],
          materials: ['Gas plasma', 'Elektroda cutting'],
          safetyNotes: 'Pastikan ventilasi baik, gunakan kacamata las',
          duration: '45 menit'
        },
        {
          step: 3,
          title: 'Pembersihan Permukaan',
          description: 'Bersihkan permukaan yang akan dilas dari karat dan kotoran',
          tools: ['Sikat baja', 'Gerinda', 'Amplas kasar'],
          materials: ['Thinner', 'Kain lap'],
          safetyNotes: 'Hindari menghirup debu, gunakan masker',
          duration: '20 menit'
        },
        {
          step: 4,
          title: 'Proses Pengelasan',
          description: 'Las sambungan dengan teknik SMAW menggunakan elektroda E7018',
          tools: ['Mesin las SMAW', 'Tang las', 'Palu terak'],
          materials: ['Elektroda E7018 3.2mm', 'Gas pelindung'],
          safetyNotes: 'Gunakan helm las, sarung tangan kulit, sepatu safety',
          duration: '3 jam'
        },
        {
          step: 5,
          title: 'Finishing dan QC',
          description: 'Bersihkan hasil las dan lakukan pemeriksaan visual',
          tools: ['Gerinda finishing', 'Sikat baja halus'],
          materials: ['Batu gerinda halus'],
          safetyNotes: 'Periksa kekuatan sambungan, tidak boleh ada retak',
          duration: '45 menit'
        }
      ],
      qualityStandards: [
        'Sambungan las harus penetrasi penuh',
        'Tidak boleh ada undercut > 0.5mm',
        'Permukaan las rata dan halus',
        'Tidak ada porosity yang terlihat'
      ],
      attachments: [
        { name: 'Gambar Teknis WO-BSI-001.pdf', size: '2.3 MB', type: 'pdf' },
        { name: 'SOP Pengelasan H-Beam.pdf', size: '1.8 MB', type: 'pdf' },
        { name: 'Safety Checklist.pdf', size: '0.5 MB', type: 'pdf' }
      ]
    },
    {
      id: 'IK-BSI-002',
      workOrder: 'WO-BSI-002',
      title: 'Instruksi Pemasangan Pagar Ornamen',
      product: 'Pagar Besi Ornamen',
      version: '1.5',
      lastUpdated: '2025-01-02',
      status: 'active',
      priority: 'medium',
      estimatedTime: '4 jam',
      safetyLevel: 'medium',
      steps: [
        {
          step: 1,
          title: 'Persiapan Komponen',
          description: 'Siapkan semua komponen pagar sesuai dengan daftar material',
          tools: ['Checklist material', 'Penggaris'],
          materials: ['Tiang pagar', 'Panel ornamen', 'Baut dan mur'],
          safetyNotes: 'Periksa kondisi material, tidak boleh ada yang rusak',
          duration: '30 menit'
        },
        {
          step: 2,
          title: 'Pemasangan Tiang Utama',
          description: 'Pasang tiang utama dengan jarak sesuai spesifikasi',
          tools: ['Bor listrik', 'Waterpass', 'Meteran'],
          materials: ['Anchor bolt', 'Semen instan'],
          safetyNotes: 'Pastikan tiang tegak lurus dan kuat',
          duration: '1.5 jam'
        },
        {
          step: 3,
          title: 'Pemasangan Panel Ornamen',
          description: 'Pasang panel ornamen dengan pola yang telah ditentukan',
          tools: ['Kunci pas', 'Obeng', 'Tang'],
          materials: ['Baut stainless', 'Ring dan mur'],
          safetyNotes: 'Periksa kekencangan semua baut',
          duration: '2 jam'
        }
      ],
      qualityStandards: [
        'Jarak antar tiang sesuai spesifikasi',
        'Semua sambungan kencang dan tidak goyang',
        'Pola ornamen simetris dan rapi',
        'Finishing cat merata tanpa cacat'
      ],
      attachments: [
        { name: 'Layout Pagar WO-BSI-002.pdf', size: '1.9 MB', type: 'pdf' },
        { name: 'Detail Ornamen.pdf', size: '3.2 MB', type: 'pdf' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const selectedInstructionData = instructions.find(inst => inst.id === selectedInstruction);

  const stats = [
    {
      title: 'Total Instruksi',
      value: instructions.length.toString(),
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Aktif',
      value: instructions.filter(i => i.status === 'active').length.toString(),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Prioritas Tinggi',
      value: instructions.filter(i => i.priority === 'high').length.toString(),
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      title: 'Rata-rata Waktu',
      value: '5 jam',
      icon: Clock,
      color: 'text-purple-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Instruksi Kerja"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-produksi-besi' },
        { title: 'Tugas Produksi', href: '#' },
        { title: 'Instruksi Kerja', href: '/roles/staf-produksi-besi/tugas/instruksi-kerja' }
      ]}
    >
      <Head title="Instruksi Kerja - Staf Produksi Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-gray-600" />
              Instruksi Kerja
            </h1>
            <p className="text-gray-600 mt-1">Panduan detail untuk setiap proses produksi</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Instructions List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Daftar Instruksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {instructions.map((instruction) => (
                  <div
                    key={instruction.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedInstruction === instruction.id ? 'border-gray-500 bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedInstruction(instruction.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{instruction.title}</h4>
                        <p className="text-xs text-gray-600">{instruction.workOrder}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={getStatusColor(instruction.status)} size="sm">
                          {instruction.status}
                        </Badge>
                        <Badge className={getPriorityColor(instruction.priority)} size="sm">
                          {instruction.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">v{instruction.version}</span>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className={`w-3 h-3 ${getSafetyColor(instruction.safetyLevel)}`} />
                        <span className="text-gray-500">{instruction.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Instruction Detail */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedInstructionData ? selectedInstructionData.title : 'Pilih Instruksi Kerja'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedInstructionData ? (
                <Tabs defaultValue="steps" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="steps">Langkah Kerja</TabsTrigger>
                    <TabsTrigger value="quality">Standar Kualitas</TabsTrigger>
                    <TabsTrigger value="attachments">Lampiran</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="steps" className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Produk:</span> {selectedInstructionData.product}
                        </div>
                        <div>
                          <span className="font-medium">Estimasi Waktu:</span> {selectedInstructionData.estimatedTime}
                        </div>
                        <div>
                          <span className="font-medium">Versi:</span> {selectedInstructionData.version}
                        </div>
                        <div>
                          <span className="font-medium">Update Terakhir:</span> {selectedInstructionData.lastUpdated}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {selectedInstructionData.steps.map((step) => (
                        <div key={step.step} className="border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {step.step}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-2">{step.title}</h4>
                              <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                <div>
                                  <p className="text-xs font-medium text-gray-700 mb-1">Tools:</p>
                                  <div className="space-y-1">
                                    {step.tools.map((tool, index) => (
                                      <div key={index} className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded">
                                        <Wrench className="w-3 h-3 inline mr-1" />
                                        {tool}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-gray-700 mb-1">Materials:</p>
                                  <div className="space-y-1">
                                    {step.materials.map((material, index) => (
                                      <div key={index} className="text-xs bg-green-50 text-green-800 px-2 py-1 rounded">
                                        {material}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-gray-700 mb-1">Durasi:</p>
                                  <div className="text-xs bg-purple-50 text-purple-800 px-2 py-1 rounded">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    {step.duration}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                                <div className="flex items-start">
                                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2" />
                                  <div>
                                    <p className="text-xs font-medium text-yellow-800">Safety Notes:</p>
                                    <p className="text-xs text-yellow-700">{step.safetyNotes}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="quality" className="space-y-4">
                    <div className="space-y-3">
                      {selectedInstructionData.qualityStandards.map((standard, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <p className="text-sm text-green-800">{standard}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="attachments" className="space-y-4">
                    <div className="space-y-3">
                      {selectedInstructionData.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="text-sm font-medium">{attachment.name}</p>
                              <p className="text-xs text-gray-500">{attachment.size}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              Lihat
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Pilih Instruksi Kerja</h3>
                  <p className="text-gray-600">Klik pada instruksi di sebelah kiri untuk melihat detail langkah kerja</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}