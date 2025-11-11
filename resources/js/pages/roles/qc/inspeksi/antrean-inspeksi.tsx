import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

interface InspectionItem {
  id: string;
  workOrder: string;
  productName: string;
  quantity: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  requestDate: string;
  supervisor: string;
}

export default function AntreanInspeksi() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const inspectionQueue: InspectionItem[] = [
    {
      id: 'INS-001',
      workOrder: 'WO-KY-2024-001',
      productName: 'Meja Kayu Jati',
      quantity: 50,
      priority: 'high',
      status: 'pending',
      requestDate: '2024-01-15',
      supervisor: 'Budi Santoso'
    },
    {
      id: 'INS-002',
      workOrder: 'WO-KY-2024-002',
      productName: 'Kursi Minimalis',
      quantity: 100,
      priority: 'medium',
      status: 'in_progress',
      requestDate: '2024-01-14',
      supervisor: 'Sari Dewi'
    },
    {
      id: 'INS-003',
      workOrder: 'WO-KY-2024-003',
      productName: 'Lemari Pakaian',
      quantity: 25,
      priority: 'low',
      status: 'completed',
      requestDate: '2024-01-13',
      supervisor: 'Ahmad Yusuf'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <Eye className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  const filteredItems = inspectionQueue.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.workOrder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Antrean Inspeksi QC Kayu</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari berdasarkan nama produk atau work order..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="in_progress">Sedang Inspeksi</option>
              <option value="completed">Selesai</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Inspection Queue */}
      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{item.productName}</h3>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority === 'high' ? 'Tinggi' : 
                       item.priority === 'medium' ? 'Sedang' : 'Rendah'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Work Order:</span> {item.workOrder}</p>
                    <p><span className="font-medium">Jumlah:</span> {item.quantity} unit</p>
                    <p><span className="font-medium">Supervisor:</span> {item.supervisor}</p>
                    <p><span className="font-medium">Tanggal Request:</span> {item.requestDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm">
                    {getStatusIcon(item.status)}
                    <span>
                      {item.status === 'pending' ? 'Menunggu' :
                       item.status === 'in_progress' ? 'Sedang Inspeksi' : 'Selesai'}
                    </span>
                  </div>
                  <Button 
                    size="sm"
                    disabled={item.status === 'completed'}
                  >
                    {item.status === 'pending' ? 'Mulai Inspeksi' : 
                     item.status === 'in_progress' ? 'Lanjutkan' : 'Lihat Detail'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Tidak ada item inspeksi yang sesuai dengan filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
