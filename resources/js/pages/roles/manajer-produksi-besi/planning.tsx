import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Target,
  Users,
  Clock,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Wrench
} from 'lucide-react';

interface PlanningProps {
  roleInfo?: {
    name: string;
    description: string;
  };
}

export default function Planning({ roleInfo }: PlanningProps) {
  const currentWeekTargets = {
    totalTarget: 100,
    completed: 68,
    inProgress: 22,
    pending: 10,
    weekProgress: 68
  };

  const weeklySchedule = [
    {
      day: 'Senin',
      date: '2024-12-09',
      shifts: [
        {
          shift: 'Pagi (07:00-15:00)',
          team: 'Tim Welding A',
          target: 8,
          product: 'Rangka Besi',
          status: 'completed',
          actual: 9
        },
        {
          shift: 'Siang (15:00-23:00)',
          team: 'Tim Welding B',
          target: 6,
          product: 'Pagar Besi',
          status: 'completed',
          actual: 6
        }
      ]
    },
    {
      day: 'Selasa',
      date: '2024-12-10',
      shifts: [
        {
          shift: 'Pagi (07:00-15:00)',
          team: 'Tim Welding A',
          target: 10,
          product: 'Kanopi Besi',
          status: 'in-progress',
          actual: 7
        },
        {
          shift: 'Siang (15:00-23:00)',
          team: 'Tim Welding C',
          target: 8,
          product: 'Railing Tangga',
          status: 'in-progress',
          actual: 5
        }
      ]
    },
    {
      day: 'Rabu',
      date: '2024-12-11',
      shifts: [
        {
          shift: 'Pagi (07:00-15:00)',
          team: 'Tim Welding B',
          target: 12,
          product: 'Rangka Besi',
          status: 'scheduled',
          actual: 0
        },
        {
          shift: 'Siang (15:00-23:00)',
          team: 'Tim Welding A',
          target: 8,
          product: 'Pagar Ornamen',
          status: 'scheduled',
          actual: 0
        }
      ]
    }
  ];

  const monthlyTargets = [
    {
      product: 'Rangka Besi',
      monthlyTarget: 200,
      completed: 145,
      remaining: 55,
      progress: 72.5,
      deadline: '2024-12-31'
    },
    {
      product: 'Pagar Besi',
      monthlyTarget: 150,
      completed: 98,
      remaining: 52,
      progress: 65.3,
      deadline: '2024-12-31'
    },
    {
      product: 'Kanopi Besi',
      monthlyTarget: 80,
      completed: 62,
      remaining: 18,
      progress: 77.5,
      deadline: '2024-12-31'
    },
    {
      product: 'Railing Tangga',
      monthlyTarget: 60,
      completed: 48,
      remaining: 12,
      progress: 80,
      deadline: '2024-12-31'
    }
  ];

  const teamCapacity = [
    {
      team: 'Tim Welding A',
      members: 5,
      capacity: '8-10 unit/hari',
      currentLoad: 85,
      status: 'optimal',
      specialization: 'Rangka & Struktur'
    },
    {
      team: 'Tim Welding B',
      members: 4,
      capacity: '6-8 unit/hari',
      currentLoad: 75,
      status: 'available',
      specialization: 'Pagar & Ornamen'
    },
    {
      team: 'Tim Welding C',
      members: 3,
      capacity: '4-6 unit/hari',
      currentLoad: 90,
      status: 'busy',
      specialization: 'Railing & Detail'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Selesai</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">Berlangsung</Badge>;
      case 'scheduled':
        return <Badge variant="outline">Terjadwal</Badge>;
      case 'delayed':
        return <Badge variant="destructive">Terlambat</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTeamStatusBadge = (status: string) => {
    switch (status) {
      case 'optimal':
        return <Badge className="bg-green-100 text-green-800">Optimal</Badge>;
      case 'available':
        return <Badge className="bg-blue-100 text-blue-800">Tersedia</Badge>;
      case 'busy':
        return <Badge className="bg-orange-100 text-orange-800">Sibuk</Badge>;
      case 'overload':
        return <Badge variant="destructive">Overload</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Perencanaan Produksi Besi" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-purple-600" />
              Perencanaan Produksi Besi
            </h1>
            <p className="text-gray-600 mt-1">Kelola jadwal dan target produksi lini besi</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Jadwal
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Target
            </Button>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Target Minggu</p>
                  <p className="text-xl font-bold">{currentWeekTargets.totalTarget}</p>
                  <p className="text-xs text-gray-500">Unit</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Selesai</p>
                  <p className="text-xl font-bold text-green-700">{currentWeekTargets.completed}</p>
                  <p className="text-xs text-green-600">Unit</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Dalam Proses</p>
                  <p className="text-xl font-bold text-blue-700">{currentWeekTargets.inProgress}</p>
                  <p className="text-xs text-blue-600">Unit</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-orange-700">{currentWeekTargets.pending}</p>
                  <p className="text-xs text-orange-600">Unit</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-xl font-bold">{currentWeekTargets.weekProgress}%</p>
                  <p className="text-xs text-gray-600">Minggu ini</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Jadwal Produksi Mingguan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklySchedule.map((day, dayIndex) => (
                  <div key={dayIndex} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{day.day}</h4>
                      <span className="text-sm text-gray-500">{day.date}</span>
                    </div>
                    <div className="space-y-2">
                      {day.shifts.map((shift, shiftIndex) => (
                        <div key={shiftIndex} className="bg-gray-50 rounded p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-sm">{shift.shift}</p>
                              <p className="text-xs text-gray-600">{shift.team}</p>
                            </div>
                            {getStatusBadge(shift.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div>
                              <p>Produk: {shift.product}</p>
                              <p>Target: {shift.target} unit</p>
                            </div>
                            <div>
                              <p>Aktual: {shift.actual} unit</p>
                              <p className={shift.actual >= shift.target ? 'text-green-600' : 'text-orange-600'}>
                                {shift.status === 'completed' ? 
                                  (shift.actual >= shift.target ? 'Target Tercapai' : 'Kurang Target') :
                                  shift.status === 'in-progress' ? 'Sedang Berjalan' : 'Belum Dimulai'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Capacity */}
          <Card>
            <CardHeader>
              <CardTitle>Kapasitas Tim</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamCapacity.map((team, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{team.team}</h4>
                        <p className="text-sm text-gray-600">{team.specialization}</p>
                      </div>
                      {getTeamStatusBadge(team.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Anggota: {team.members} orang</p>
                        <p className="text-gray-600">Kapasitas: {team.capacity}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Beban Kerja:</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                team.currentLoad >= 90 ? 'bg-red-500' :
                                team.currentLoad >= 80 ? 'bg-orange-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${team.currentLoad}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{team.currentLoad}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Targets */}
        <Card>
          <CardHeader>
            <CardTitle>Target Bulanan (Desember 2024)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Produk</th>
                    <th className="text-left p-2">Target Bulan</th>
                    <th className="text-left p-2">Selesai</th>
                    <th className="text-left p-2">Sisa</th>
                    <th className="text-left p-2">Progress</th>
                    <th className="text-left p-2">Deadline</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyTargets.map((target, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{target.product}</td>
                      <td className="p-2">{target.monthlyTarget} unit</td>
                      <td className="p-2 text-green-700 font-medium">{target.completed}</td>
                      <td className="p-2 text-orange-700">{target.remaining}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
                            <div 
                              className={`h-2 rounded-full ${
                                target.progress >= 80 ? 'bg-green-500' :
                                target.progress >= 60 ? 'bg-blue-500' :
                                'bg-orange-500'
                              }`}
                              style={{ width: `${target.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium min-w-[40px]">{target.progress}%</span>
                        </div>
                      </td>
                      <td className="p-2 text-xs">{target.deadline}</td>
                      <td className="p-2">
                        <Badge variant={target.progress >= 80 ? "default" : target.progress >= 60 ? "secondary" : "destructive"}>
                          {target.progress >= 80 ? 'On Track' : 
                           target.progress >= 60 ? 'Perlu Perhatian' : 'Berisiko'}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}