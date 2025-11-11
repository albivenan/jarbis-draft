import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Eye, AlertTriangle, CheckCircle, Clock, Wrench, Users } from 'lucide-react';

export default function InstruksiKerja() {
  const [selectedInstruction, setSelectedInstruction] = useState<string | null>(null);

  const instructions = [
    {
      id: 'IK-SUP-BSI-001',
      workOrder: 'WO-BSI-001',
      title: 'Supervisi Pengelasan H-Beam Struktural',
      product: 'Rangka Besi H-Beam 200x100',
      version: '2.3',
      lastUpdated: '2025-01-03',
      status: 'active',
      priority: 'high',
      estimatedTime: '8 jam',
      safetyLevel: 'high',
      crewAssigned: ['Ahmad Santoso', 'Budi Prasetyo'],
      steps: [
        {
          step: 1,
          title: 'Briefing Crew & Safety Check',
          description: 'Lakukan briefing keselamatan dan periksa kelengkapan APD crew',
          supervisorActions: ['Cek APD lengkap', 'Brief safety procedure', 'Verifikasi sertifikat welder'],
          crewActions: ['Gunakan APD lengkap', 'Siapkan tools pengelasan', 'Cek kondisi mesin las'],
          checkpoints: ['APD crew lengkap', 'Mesin las dalam kondisi baik', 'Area kerja aman'],
          duration: '30 menit'
        },
        {
          step: 2,
          title: 'Persiapan Material & Layout',
          description: 'Supervisi persiapan material H-beam dan layout pengelasan',
          supervisorActions: ['Verifikasi spesifikasi material', 'Cek akurasi layout', 'Approve marking'],
          crewActions: ['Siapkan H-beam sesuai ukuran', 'Buat marking layout', 'Posisikan material'],
          checkpoints: ['Material sesuai spek', 'Layout akurat', 'Marking jelas'],
          duration: '45 menit'
        },
        {
          step: 3,
          title: 'Supervisi Proses Pengelasan',
          description: 'Awasi proses pengelasan dan pastikan kualitas sesuai standar',
          supervisorActions: ['Monitor teknik pengelasan', 'Cek parameter mesin', 'Evaluasi hasil las'],
          crewActions: ['Lakukan pengelasan sesuai WPS', 'Maintain parameter yang benar', 'Bersihkan slag'],
          checkpoints: ['Teknik pengelasan benar', 'Penetrasi optimal', 'Tidak ada defect'],
          duration: '5 jam'
        },
        {
          step: 4,
          title: 'Quality Control & Dokumentasi',
          description: 'Lakukan pemeriksaan kualitas dan dokumentasi hasil kerja',
          supervisorActions: ['Inspeksi visual', 'Ukur dimensi', 'Buat laporan supervisi'],
          crewActions: ['Bersihkan hasil las', 'Siapkan untuk inspeksi', 'Rapikan area kerja'],
          checkpoints: ['Kualitas sesuai standar', 'Dimensi akurat', 'Dokumentasi lengkap'],
          duration: '1.5 jam'
        }
      ],
      qualityStandards: [
        'Pengelasan sesuai WPS (Welding Procedure Specification)',
        'Penetrasi las minimal 80% ketebalan material',
        'Tidak ada undercut, porosity, atau crack',
        'Dimensi sesuai toleransi ±2mm',
        'Surface finish sesuai standar AWS D1.1'
      ],
      safetyRequirements: [
        'Helm las dengan filter yang sesuai',
        'Sarung tangan kulit untuk pengelasan',
        'Sepatu safety dengan sol anti slip',
        'Ventilasi area kerja memadai',
        'Fire extinguisher siap pakai'
      ],
      attachments: [
        { name: 'WPS H-Beam Welding.pdf', size: '2.8 MB', type: 'pdf' },
        { name: 'Gambar Teknis WO-BSI-001.pdf', size: '3.2 MB', type: 'pdf' },
        { name: 'Safety Checklist Welding.pdf', size: '0.9 MB', type: 'pdf' }
      ]
    },
    {
      id: 'IK-SUP-BSI-002',
      workOrder: 'WO-BSI-002',
      title: 'Supervisi Pemasangan Ornamen Pagar',
      product: 'Pagar Besi Ornamen Dekoratif',
      version: '1.7',
      lastUpdated: '2025-01-02',
      status: 'active',
      priority: 'medium',
      estimatedTime: '6 jam',
      safetyLevel: 'medium',
      crewAssigned: ['Candra Wijaya', 'Eko Susanto'],
      steps: [
        {
          step: 1,
          title: 'Persiapan Komponen & Tools',
          description: 'Supervisi persiapan semua komponen ornamen dan tools pemasangan',
          supervisorActions: ['Verifikasi kelengkapan komponen', 'Cek kondisi tools', 'Approve layout'],
          crewActions: ['Siapkan semua komponen ornamen', 'Cek tools pemasangan', 'Buat layout pemasangan'],
          checkpoints: ['Komponen lengkap sesuai BOM', 'Tools dalam kondisi baik', 'Layout sesuai gambar'],
          duration: '1 jam'
        },
        {
          step: 2,
          title: 'Pemasangan Frame Utama',
          description: 'Supervisi pemasangan frame utama pagar dengan presisi tinggi',
          supervisorActions: ['Monitor kelurusan frame', 'Cek dimensi dan jarak', 'Verifikasi kekuatan'],
          crewActions: ['Pasang frame sesuai marking', 'Cek kelurusan dengan waterpass', 'Kencangkan baut'],
          checkpoints: ['Frame lurus dan tegak', 'Jarak sesuai spesifikasi', 'Sambungan kuat'],
          duration: '2 jam'
        },
        {
          step: 3,
          title: 'Instalasi Ornamen Detail',
          description: 'Supervisi pemasangan ornamen detail dengan pola yang konsisten',
          supervisorActions: ['Monitor pola ornamen', 'Cek simetri dan spacing', 'Evaluasi estetika'],
          crewActions: ['Pasang ornamen sesuai pola', 'Jaga konsistensi jarak', 'Pastikan simetri'],
          checkpoints: ['Pola ornamen konsisten', 'Spacing merata', 'Simetri terjaga'],
          duration: '2.5 jam'
        },
        {
          step: 4,
          title: 'Finishing & Final Check',
          description: 'Supervisi finishing dan pemeriksaan akhir kualitas pemasangan',
          supervisorActions: ['Inspeksi keseluruhan', 'Cek kekencangan', 'Approve hasil kerja'],
          crewActions: ['Kencangkan semua baut', 'Bersihkan area kerja', 'Touch up jika perlu'],
          checkpoints: ['Semua baut kencang', 'Tidak ada bagian goyang', 'Hasil rapi dan bersih'],
          duration: '30 menit'
        }
      ],
      qualityStandards: [
        'Jarak antar ornamen konsisten ±1mm',
        'Semua sambungan kencang dan tidak goyang',
        'Pola ornamen simetris dan sesuai desain',
        'Finishing permukaan rata dan halus',
        'Tidak ada goresan atau cacat pada ornamen'
      ],
      safetyRequirements: [
        'Helm safety dan kacamata pelindung',
        'Sarung tangan kerja anti slip',
        'Sepatu safety dengan perlindungan jari kaki',
        'Harness jika bekerja di ketinggian',
        'Area kerja bebas dari material berserakan'
      ],
      attachments: [
        { name: 'Detail Ornamen Pattern.pdf', size: '4.1 MB', type: 'pdf' },
        { name: 'Installation Guide.pdf', size: '2.3 MB', type: 'pdf' },
        { name: 'Quality Checklist.pdf', size: '1.1 MB', type: 'pdf' }
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
      title: 'Crew Terlibat',
      value: '5',
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Instruksi Kerja"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/supervisor-besi' },
        { title: 'Tugas Saya', href: '#' },
        { title: 'Instruksi Kerja', href: '/roles/supervisor-besi/tugas-saya/instruksi-kerja' }
      ]}
    >
      <Head title="Instruksi Kerja - Supervisor Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-gray-600" />
              Instruksi Kerja Supervisi
            </h1>
            <p className="text-gray-600 mt-1">Panduan supervisi untuk setiap proses produksi besi</p>
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
              <CardTitle>Daftar Instruksi Supervisi</CardTitle>
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
                        <Badge className={getStatusColor(instruction.status)}>
                          {instruction.status}
                        </Badge>
                        <Badge className={getPriorityColor(instruction.priority)}>
                          {instruction.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">v{instruction.version}</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span className="text-gray-500">{instruction.crewAssigned.length} crew</span>
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
                {selectedInstructionData ? selectedInstructionData.title : 'Pilih Instruksi Supervisi'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedInstructionData ? (
                <Tabs defaultValue="steps" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="steps">Langkah Supervisi</TabsTrigger>
                    <TabsTrigger value="quality">Standar Kualitas</TabsTrigger>
                    <TabsTrigger value="safety">Keselamatan</TabsTrigger>
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
                          <span className="font-medium">Crew Assigned:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedInstructionData.crewAssigned.map((crew, index) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {crew}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Safety Level:</span>
                          <span className={`ml-2 ${getSafetyColor(selectedInstructionData.safetyLevel)}`}>
                            {selectedInstructionData.safetyLevel}
                          </span>
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
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                  <p className="text-xs font-medium text-gray-700 mb-1">Aksi Supervisor:</p>
                                  <div className="space-y-1">
                                    {step.supervisorActions.map((action, index) => (
                                      <div key={index} className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded">
                                        <CheckCircle className="w-3 h-3 inline mr-1" />
                                        {action}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-gray-700 mb-1">Aksi Crew:</p>
                                  <div className="space-y-1">
                                    {step.crewActions.map((action, index) => (
                                      <div key={index} className="text-xs bg-green-50 text-green-800 px-2 py-1 rounded">
                                        <Wrench className="w-3 h-3 inline mr-1" />
                                        {action}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="mb-3">
                                <p className="text-xs font-medium text-gray-700 mb-1">Checkpoint:</p>
                                <div className="flex flex-wrap gap-1">
                                  {step.checkpoints.map((checkpoint, index) => (
                                    <span key={index} className="text-xs bg-purple-50 text-purple-800 px-2 py-1 rounded">
                                      {checkpoint}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>Durasi: {step.duration}</span>
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

                  <TabsContent value="safety" className="space-y-4">
                    <div className="space-y-3">
                      {selectedInstructionData.safetyRequirements.map((requirement, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                          <p className="text-sm text-red-800">{requirement}</p>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Pilih Instruksi Supervisi</h3>
                  <p className="text-gray-600">Klik pada instruksi di sebelah kiri untuk melihat detail langkah supervisi</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}