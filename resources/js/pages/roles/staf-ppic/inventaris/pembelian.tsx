import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle, AlertTriangle, Eye } from 'lucide-react';

export default function PermintaanPembelian() {
  const purchaseRequests = [
    {
      id: 'PR-2025-001',
      material: 'Besi Beton 12mm',
      quantity: 100,
      unit: 'batang',
      urgency: 'high',
      requestDate: '2025-01-03',
      status: 'pending',
      estimatedCost: 15000000
    },
    {
      id: 'PR-2025-002',
      material: 'Kayu Jati Grade A',
      quantity: 7,
      unit: 'm³',
      urgency: 'critical',
      requestDate: '2025-01-03',
      status: 'approved',
      estimatedCost: 35000000
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AuthenticatedLayout
      title="Permintaan Pembelian"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-ppic' },
        { title: 'Manajemen Inventaris', href: '#' },
        { title: 'Permintaan Pembelian', href: '/roles/staf-ppic/inventaris/pembelian' }
      ]}
    >
      <Head title="Permintaan Pembelian - PPIC" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Permintaan Pembelian
            </h1>
            <p className="text-gray-600 mt-1">Lihat status permintaan pembelian material</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Menunggu Persetujuan</p>
                  <p className="text-2xl font-bold text-yellow-600">3</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disetujui</p>
                  <p className="text-2xl font-bold text-green-600">8</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Urgent</p>
                  <p className="text-2xl font-bold text-red-600">2</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Permintaan Pembelian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {purchaseRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{request.id}</h4>
                      <p className="text-sm text-gray-600">{request.material}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Quantity</p>
                      <p className="font-medium">{request.quantity} {request.unit}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tanggal Request</p>
                      <p className="font-medium">{request.requestDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Estimasi Biaya</p>
                      <p className="font-medium">Rp {request.estimatedCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}