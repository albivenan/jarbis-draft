import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, CheckCircle, Clock, AlertTriangle, Image, Video } from 'lucide-react';

interface WorkInstruction {
  id: string;
  workOrder: string;
  productName: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  assignedCrew: string[];
  steps: Array<{
    stepNumber: number;
    title: string;
    description: string;
    estimatedTime: number;
    tools: string[];
    materials: string[];
    safetyNotes: string[];
    qualityChecks: string[];
    attachments?: Array<{
      type: 'image' | 'video' | 'document';
      name: string;
      url: string;
    }>;
    status: 'pending' | 'in_progress' | 'completed';
  }>;
  totalEstimatedTime: number;
  specialInstructions?: string;
}

export default function InstruksiKerja() {
  const [selectedInstruction, setSelectedInstruction] = useState<string>('1');

  const workInstructions: WorkInstruction[] = [
    {
      id: '1',
      workOrder: 'WO-KY-2024-001',
      productName: 'Meja Kayu Jati Premium',
      priority: 'high',
      status: 'in_progress',
      assignedCrew: ['Ahmad Yusuf', 'Budi Santoso', 'Sari Dewi'],
      totalEstimatedTime: 480, // minutes
      specialInstructions: 'Perhatikan arah serat kayu untuk hasil finishing terbaik. Gunakan kayu jati grade A tanpa cacat.',
      steps: [
        {
          stepNumber: 1,
          title: 'Persiapan Material dan Alat',
          description: 'Siapkan kayu jati grade A sesuai cutting list, periksa kualitas kayu, dan siapkan semua alat yang diperlukan.',
          estimatedTime: 60,
          tools: ['Gergaji circular', 'Mistar', 'Pensil', 'Square'],
          materials: ['Kayu Jati Grade A 150x80x5cm', 'Kayu Jati Grade A 75x5x5cm (4 pcs)'],
          safetyNotes: [
            'Gunakan kacamata safety saat menggunakan gergaji',
            'Pastikan area kerja bersih dan terang',
            'Periksa kondisi alat sebelum digunakan'
          ],
          qualityChecks: [
            'Kayu tidak ada cacat, retak, atau mata kayu',
            'Dimensi sesuai dengan cutting list',
            'Kelembaban kayu 8-12%'
          ],
          status: 'completed',
          attachments: [
            {
              type: 'image',
              name: 'cutting-list.jpg',
              url: '/attachments/cutting-list.jpg'
            }
          ]
        },
        {
          stepNumber: 2,
          title: 'Pemotongan Kayu',
          description: 'Potong kayu sesuai dengan dimensi yang telah ditentukan. Pastikan potongan lurus dan presisi.',
          estimatedTime: 120,
          tools: ['Gergaji circular', 'Meja potong', 'Clamp', 'Amplas 120'],
          materials: ['Kayu yang sudah disiapkan'],
          safetyNotes: [
            'Gunakan push stick saat memotong kayu kecil',
            'Jangan memaksa gergaji jika terasa berat',
            'Pastikan blade gergaji tajam dan dalam kondisi baik'
          ],
          qualityChecks: [
            'Potongan lurus dengan toleransi ±1mm',
            'Permukaan potongan halus',
            'Tidak ada chip atau tear-out'
          ],
          status: 'completed'
        },
        {
          stepNumber: 3,
          title: 'Pembentukan dan Penghalusan',
          description: 'Bentuk komponen sesuai desain dan haluskan semua permukaan dengan amplas bertingkat.',
          estimatedTime: 180,
          tools: ['Router', 'Amplas 120, 180, 240', 'Sander', 'Chisel'],
          materials: ['Komponen yang sudah dipotong'],
          safetyNotes: [
            'Gunakan dust mask saat mengamplas',
            'Periksa arah serat sebelum mengamplas',
            'Gunakan tekanan yang konsisten'
          ],
          qualityChecks: [
            'Permukaan halus dan rata',
            'Tidak ada bekas amplas yang kasar',
            'Bentuk sesuai dengan template'
          ],
          status: 'in_progress'
        },
        {
          stepNumber: 4,
          title: 'Perakitan',
          description: 'Rakit semua komponen menjadi meja utuh. Gunakan lem kayu dan sekrup sesuai spesifikasi.',
          estimatedTime: 90,
          tools: ['Clamp', 'Bor', 'Obeng', 'Square', 'Palu karet'],
          materials: ['Lem kayu PVA', 'Sekrup kayu 6x50mm', 'Dowel 8mm'],
          safetyNotes: [
            'Pastikan lem tidak berlebihan',
            'Gunakan clamp dengan tekanan yang tepat',
            'Periksa kesikuan sebelum lem mengering'
          ],
          qualityChecks: [
            'Sambungan kuat dan rapat',
            'Meja tidak goyang',
            'Permukaan rata dan sejajar'
          ],
          status: 'pending'
        },
        {
          stepNumber: 5,
          title: 'Finishing',
          description: 'Aplikasikan finishing natural oil untuk melindungi kayu dan memberikan tampilan premium.',
          estimatedTime: 30,
          tools: ['Kuas', 'Lap kain', 'Amplas 320'],
          materials: ['Natural Oil Finish', 'Thinner'],
          safetyNotes: [
            'Gunakan masker dan sarung tangan',
            'Pastikan ventilasi yang baik',
            'Jauhkan dari sumber api'
          ],
          qualityChecks: [
            'Finishing merata tanpa brush mark',
            'Tidak ada noda atau cacat',
            'Warna sesuai dengan sample'
          ],
          status: 'pending'
        }
      ]
    },
    {
      id: '2',
      workOrder: 'WO-KY-2024-002',
      productName: 'Kursi Minimalis Set',
      priority: 'medium',
      status: 'pending',
      assignedCrew: ['Eko Prasetyo', 'Dian Sari'],
      totalEstimatedTime: 360,
      steps: [
        {
          stepNumber: 1,
          title: 'Persiapan Material Kursi',
          description: 'Siapkan kayu mahoni untuk frame kursi dan bahan pelapis.',
          estimatedTime: 45,
          tools: ['Gergaji', 'Mistar', 'Pensil'],
          materials: ['Kayu Mahoni', 'Busa kursi', 'Kain pelapis'],
          safetyNotes: ['Gunakan APD lengkap'],
          qualityChecks: ['Material sesuai spesifikasi'],
          status: 'pending'
        }
      ]
    }
  ];

  const selectedInstructionData = workInstructions.find(inst => inst.id === selectedInstruction);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (!selectedInstructionData) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Instruksi Kerja</h1>
        <div className="flex gap-2">
          <select
            value={selectedInstruction}
            onChange={(e) => setSelectedInstruction(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            {workInstructions.map(inst => (
              <option key={inst.id} value={inst.id}>
                {inst.workOrder} - {inst.productName}
              </option>
            ))}
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Work Order Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{selectedInstructionData.productName}</h2>
                <Badge className={getPriorityColor(selectedInstructionData.priority)}>
                  {selectedInstructionData.priority === 'high' ? 'Tinggi' : 
                   selectedInstructionData.priority === 'medium' ? 'Sedang' : 'Rendah'}
                </Badge>
                <Badge className={getStatusColor(selectedInstructionData.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(selectedInstructionData.status)}
                    <span>
                      {selectedInstructionData.status === 'pending' ? 'Menunggu' :
                       selectedInstructionData.status === 'in_progress' ? 'Dikerjakan' : 'Selesai'}
                    </span>
                  </div>
                </Badge>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Work Order:</span> {selectedInstructionData.workOrder}</p>
                <p><span className="font-medium">Crew:</span> {selectedInstructionData.assignedCrew.join(', ')}</p>
                <p><span className="font-medium">Total Estimasi:</span> {Math.floor(selectedInstructionData.totalEstimatedTime / 60)}h {selectedInstructionData.totalEstimatedTime % 60}m</p>
              </div>
            </div>
          </div>
          
          {selectedInstructionData.specialInstructions && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-1">Instruksi Khusus:</h4>
              <p className="text-sm text-yellow-700">{selectedInstructionData.specialInstructions}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work Steps */}
      <div className="space-y-4">
        {selectedInstructionData.steps.map((step) => (
          <Card key={step.stepNumber} className={`${step.status === 'in_progress' ? 'border-blue-200 bg-blue-50' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium">
                    {step.stepNumber}
                  </div>
                  {step.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(step.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(step.status)}
                      <span>
                        {step.status === 'pending' ? 'Menunggu' :
                         step.status === 'in_progress' ? 'Dikerjakan' : 'Selesai'}
                      </span>
                    </div>
                  </Badge>
                  <span className="text-sm text-gray-600">{step.estimatedTime} menit</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="description">
                <TabsList>
                  <TabsTrigger value="description">Deskripsi</TabsTrigger>
                  <TabsTrigger value="tools">Alat & Material</TabsTrigger>
                  <TabsTrigger value="safety">Keselamatan</TabsTrigger>
                  <TabsTrigger value="quality">Quality Check</TabsTrigger>
                  {step.attachments && <TabsTrigger value="attachments">Lampiran</TabsTrigger>}
                </TabsList>

                <TabsContent value="description" className="mt-4">
                  <p className="text-gray-700">{step.description}</p>
                </TabsContent>

                <TabsContent value="tools" className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Alat yang Diperlukan:</h4>
                    <div className="flex flex-wrap gap-2">
                      {step.tools.map((tool, index) => (
                        <Badge key={index} variant="outline">{tool}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Material:</h4>
                    <div className="flex flex-wrap gap-2">
                      {step.materials.map((material, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">{material}</Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="safety" className="mt-4">
                  <h4 className="font-medium mb-2">Catatan Keselamatan:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {step.safetyNotes.map((note, index) => (
                      <li key={index} className="text-sm text-gray-700">{note}</li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="quality" className="mt-4">
                  <h4 className="font-medium mb-2">Quality Check Points:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {step.qualityChecks.map((check, index) => (
                      <li key={index} className="text-sm text-gray-700">{check}</li>
                    ))}
                  </ul>
                </TabsContent>

                {step.attachments && (
                  <TabsContent value="attachments" className="mt-4">
                    <h4 className="font-medium mb-2">Lampiran:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {step.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          {attachment.type === 'image' ? (
                            <Image className="h-8 w-8 text-blue-600" />
                          ) : attachment.type === 'video' ? (
                            <Video className="h-8 w-8 text-red-600" />
                          ) : (
                            <FileText className="h-8 w-8 text-gray-600" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{attachment.name}</p>
                            <p className="text-sm text-gray-600 capitalize">{attachment.type}</p>
                          </div>
                          <Button size="sm" variant="outline">Lihat</Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}
              </Tabs>

              {step.status !== 'completed' && (
                <div className="mt-4 flex gap-2">
                  {step.status === 'pending' && (
                    <Button size="sm">Mulai Step</Button>
                  )}
                  {step.status === 'in_progress' && (
                    <Button size="sm">Selesaikan Step</Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}