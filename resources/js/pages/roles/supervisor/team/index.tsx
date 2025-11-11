import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TreePine, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function TeamManagement() {
  const teamMembers = [
    {
      id: 1,
      name: 'Ahmad Fauzi',
      position: 'Fabrikasi Kayu',
      status: 'active',
      shift: '07:00 - 15:00',
      progress: 85,
      currentTask: 'Fabrikasi meja kayu jati',
      attendance: 22,
      performance: 'excellent'
    },
    {
      id: 2,
      name: 'Budi Santoso',
      position: 'Amplas',
      status: 'active',
      shift: '07:00 - 15:00',
      progress: 92,
      currentTask: 'Amplas permukaan lemari',
      attendance: 22,
      performance: 'excellent'
    },
    {
      id: 3,
      name: 'Candra Wijaya',
      position: 'Finishing',
      status: 'break',
      shift: '07:00 - 15:00',
      progress: 78,
      currentTask: 'Finishing kursi kayu',
      attendance: 21,
      performance: 'good'
    },
    {
      id: 4,
      name: 'Dedi Kurniawan',
      position: 'Fabrikasi Kayu',
      status: 'active',
      shift: '07:00 - 15:00',
      progress: 88,
      currentTask: 'Assembly rak kayu',
      attendance: 22,
      performance: 'excellent'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'break': return 'bg-yellow-500';
      case 'absent': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'excellent': return <Badge className="bg-green-600">Excellent</Badge>;
      case 'good': return <Badge variant="secondary">Good</Badge>;
      case 'average': return <Badge variant="outline">Average</Badge>;
      default: return <Badge variant="outline">-</Badge>;
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Manajemen Tim Kayu" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TreePine className="h-8 w-8 text-green-600" />
              Manajemen Tim Kayu
            </h1>
            <p className="text-gray-600 mt-1">Kelola dan monitor tim produksi kayu</p>
          </div>
        </div>

        {/* Team Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tim</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hadir Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sedang Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">10</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Istirahat</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Anggota Tim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(member.status)}`}></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2">
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.position}</p>
                        <p className="text-xs text-gray-500">Shift: {member.shift}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-900">Task Saat Ini</p>
                        <p className="text-sm text-gray-600">{member.currentTask}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-900">Progress</p>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${member.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{member.progress}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-900">Kehadiran</p>
                        <p className="text-sm text-gray-600">{member.attendance}/22 hari</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Performa</p>
                          {getPerformanceBadge(member.performance)}
                        </div>
                        <Button variant="outline" size="sm">
                          Detail
                        </Button>
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
