import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, Image, CheckCircle, AlertTriangle } from 'lucide-react';

interface ProductionDetail {
  workOrder: string;
  productName: string;
  specifications: {
    material: string;
    dimensions: string;
    finish: string;
    quality: string;
  };
  productionSteps: Array<{
    step: string;
    status: 'completed' | 'in_progress' | 'pending';
    operator: string;
    completedAt?: string;
  }>;
  qualityChecks: Array<{
    checkpoint: string;
    status: 'pass' | 'fail' | 'pending';
    notes?: string;
  }>;
  attachments: Array<{
    name: string;
    type: 'image' | 'document';
    url: string;
  }>;
}

export default function DetailProduksi() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const productionDetail: ProductionDetail = {
    workOrder: 'WO-KY-2024-001',
    productName: 'Meja Kayu Jati Premium',
    specifications: {
      material: 'Kayu Jati Grade A',
      dimensions: '150cm x 80cm x 75cm',
      finish: 'Natural Oil Finish',
      quality: 'Premium Export Quality'
    },
    productionSteps: [
      {
        step: 'Pemotongan Kayu',
        status: 'completed',
        operator: 'Ahmad Yusuf',
        completedAt: '2024-01-10 08:30'
      },
      {
        step: 'Pembentukan & Penghalusan',
        status: 'completed',
        operator: 'Budi Santoso',
        completedAt: '2024-01-11 14:20'
      },
      {
        step: 'Perakitan',
        status: 'in_progress',
        operator: 'Sari Dewi'
      },
      {
        step: 'Finishing',
        status: 'pending',
        operator: '-'
      }
    ],
    qualityChecks: [
      {
        checkpoint: 'Kualitas Kayu',
        status: 'pass',
        notes: 'Kayu berkualitas baik, tidak ada cacat'
      },
      {
        checkpoint: 'Presisi Pemotongan',
        status: 'pass',
        notes: 'Ukuran sesuai spesifikasi'
      },
      {
        checkpoint: 'Kekuatan Sambungan',
        status: 'pending'
      },
      {
        checkpoint: 'Kualitas Finishing',
        status: 'pending'
      }
    ],
    attachments: [
      {
        name: 'Foto Progress 1.jpg',
        type: 'image',
        url: '/attachments/progress1.jpg'
      },
      {
        name: 'Spesifikasi Teknis.pdf',
        type: 'document',
        url: '/attachments/spec.pdf'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'pass':
        return <CheckCircle className="h-4 w-4" />;
      case 'fail':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{productionDetail.productName}</h1>
          <p className="text-gray-600">Work Order: {productionDetail.workOrder}</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="production">Proses Produksi</TabsTrigger>
          <TabsTrigger value="quality">Quality Check</TabsTrigger>
          <TabsTrigger value="attachments">Lampiran</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spesifikasi Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-700">Material</p>
                  <p>{productionDetail.specifications.material}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Dimensi</p>
                  <p>{productionDetail.specifications.dimensions}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Finishing</p>
                  <p>{productionDetail.specifications.finish}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Grade Kualitas</p>
                  <p>{productionDetail.specifications.quality}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tahapan Produksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productionDetail.productionSteps.map((step, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{step.step}</p>
                        <p className="text-sm text-gray-600">Operator: {step.operator}</p>
                        {step.completedAt && (
                          <p className="text-xs text-gray-500">Selesai: {step.completedAt}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(step.status)}>
                      {step.status === 'completed' ? 'Selesai' :
                       step.status === 'in_progress' ? 'Sedang Dikerjakan' : 'Menunggu'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Checkpoint Kualitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productionDetail.qualityChecks.map((check, index) => (
                  <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <p className="font-medium">{check.checkpoint}</p>
                        {check.notes && (
                          <p className="text-sm text-gray-600 mt-1">{check.notes}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(check.status)}>
                      {check.status === 'pass' ? 'Lulus' :
                       check.status === 'fail' ? 'Tidak Lulus' : 'Menunggu'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lampiran & Dokumentasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {productionDetail.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    {attachment.type === 'image' ? (
                      <Image className="h-8 w-8 text-blue-600" />
                    ) : (
                      <FileText className="h-8 w-8 text-red-600" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{attachment.name}</p>
                      <p className="text-sm text-gray-600">
                        {attachment.type === 'image' ? 'Gambar' : 'Dokumen'}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Lihat
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
