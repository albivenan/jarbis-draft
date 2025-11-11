import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TreePine, ClipboardCheck, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function QualityControl() {
  const qcStats = [
    {
      title: 'Pass Rate Hari Ini',
      value: '89%',
      status: 'good'
    },
    {
      title: 'Items Inspeksi',
      value: '18',
      status: 'normal'
    },
    {
      title: 'Reject Rate',
      value: '11%',
      status: 'warning'
    }
  ];

  const qcResults = [
    {
      id: 1,
      product: 'Meja Kayu Jati',
      batch: 'MKJ-001',
      inspector: 'QC Team A',
      result: 'pass',
      score: 96,
      time: '2 jam lalu'
    },
    {
      id: 2,
      product: 'Lemari Kayu Mahoni',
      batch: 'LKM-003',
      inspector: 'QC Team B',
      result: 'reject',
      score: 72,
      time: '3 jam lalu',
      issue: 'Finishing tidak rata'
    }
  ];

  return (
    <AuthenticatedLayout>
      <Head title="Quality Control Kayu" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TreePine className="h-8 w-8 text-green-600" />
              Quality Control Kayu
            </h1>
            <p className="text-gray-600 mt-1">Monitor kualitas produk kayu</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {qcStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <ClipboardCheck className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hasil QC Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qcResults.map((result) => (
                <div key={result.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className={`p-2 rounded-full ${
                    result.result === 'pass' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {result.result === 'pass' ? 
                      <CheckCircle className="h-5 w-5 text-green-600" /> :
                      <XCircle className="h-5 w-5 text-red-600" />
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{result.product}</p>
                        <p className="text-sm text-gray-600">Batch: {result.batch} | Inspector: {result.inspector}</p>
                        {result.issue && (
                          <p className="text-sm text-red-600">Issue: {result.issue}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          result.result === 'pass' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {result.score}%
                        </p>
                        <p className="text-xs text-gray-500">{result.time}</p>
                      </div>
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