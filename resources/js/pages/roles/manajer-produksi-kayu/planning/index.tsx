import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TreePine, Calendar, Target, Users, Plus } from 'lucide-react';

export default function Planning() {
  const weeklyTargets = [
    {
      week: 'Minggu 1',
      target: 150,
      achieved: 142,
      percentage: 95
    },
    {
      week: 'Minggu 2',
      target: 160,
      achieved: 156,
      percentage: 98
    },
    {
      week: 'Minggu 3',
      target: 155,
      achieved: 148,
      percentage: 95
    },
    {
      week: 'Minggu 4',
      target: 170,
      achieved: 0,
      percentage: 0
    }
  ];

  const productionSchedule = [
    {
      id: 1,
      product: 'Meja Kayu Jati',
      quantity: 20,
      startDate: '2025-09-30',
      endDate: '2025-10-05',
      team: 'Tim A',
      status: 'active'
    },
    {
      id: 2,
      product: 'Lemari Kayu Mahoni',
      quantity: 15,
      startDate: '2025-10-01',
      endDate: '2025-10-08',
      team: 'Tim B',
      status: 'scheduled'
    },
    {
      id: 3,
      product: 'Kursi Kayu Meranti',
      quantity: 30,
      startDate: '2025-10-03',
      endDate: '2025-10-10',
      team: 'Tim C',
      status: 'scheduled'
    }
  ];

  return (
    <AuthenticatedLayout>
      <Head title="Perencanaan Produksi Kayu" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TreePine className="h-8 w-8 text-green-600" />
              Perencanaan Produksi Kayu
            </h1>
            <p className="text-gray-600 mt-1">Kelola jadwal dan target produksi lini kayu</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tambah Jadwal
          </Button>
        </div>

        {/* Weekly Targets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Target Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {weeklyTargets.map((week, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900">{week.week}</h4>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Target: {week.target} unit</span>
                      <span>Tercapai: {week.achieved} unit</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          week.percentage >= 95 ? 'bg-green-600' :
                          week.percentage >= 80 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${week.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{week.percentage}% tercapai</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Production Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Jadwal Produksi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productionSchedule.map((schedule) => (
                <div key={schedule.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{schedule.product}</h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {schedule.quantity} unit | Tim: {schedule.team}
                        </p>
                        <p className="text-sm text-gray-500">
                          {schedule.startDate} - {schedule.endDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          schedule.status === 'active' ? 'default' :
                          schedule.status === 'scheduled' ? 'secondary' :
                          'outline'
                        }>
                          {schedule.status === 'active' ? 'Sedang Berjalan' :
                           schedule.status === 'scheduled' ? 'Terjadwal' :
                           'Selesai'}
                        </Badge>
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