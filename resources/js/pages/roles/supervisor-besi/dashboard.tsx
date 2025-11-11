import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wrench,
  ClipboardList,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target
} from 'lucide-react';

interface DashboardProps {
  roleInfo?: {
    name: string;
    description: string;
  };
}

export default function Dashboard({ roleInfo }: DashboardProps) {
  const stats = [
    {
      title: 'Tugas Hari Ini',
      value: '8',
      unit: 'tugas',
      icon: ClipboardList,
      trend: '6 selesai, 2 progress',
      color: 'text-blue-600'
    },
    {
      title: 'Crew Saya',
      value: '12',
      unit: 'orang',
      icon: Users,
      trend: '100% hadir',
      color: 'text-green-600'
    },
    {
      title: 'Progress Harian',
      value: '85',
      unit: '%',
      icon: TrendingUp,
      trend: 'Target 80%',
      color: 'text-purple-600'
    },
    {
      title: 'Quality Score',
      value: '94',
      unit: '%',
      icon: CheckCircle,
      trend: 'Excellent',
      color: 'text-orange-600'
    }
  ];

  const myTasks = [
    {
      id: 'TASK-BS-001',
      title: 'Fabrikasi Rangka Besi 10x12m',
      workOrder: 'WO-BS-001',
      quantity: 25,
      progress: 80,
      deadline: '2024-01-20',
      status: 'in-progress',
      priority: 'high'
    },
    {
      id: 'TASK-BS-002',
      title: 'Pagar Besi Minimalis Custom',
      workOrder: 'WO-BS-002',
      quantity: 15,
      progress: 45,
      deadline: '2024-01-25',
      status: 'in-progress',
      priority: 'medium'
    },
    {
      id: 'TASK-BS-003',
      title: 'Rework - Perbaikan Welding',
      workOrder: 'WO-BS-001-RW',
      quantity: 5,
      progress: 100,
      deadline: '2024-01-18',
      status: 'completed',
      priority: 'urgent'
    }
  ];

  const crewPerformance = [
    {
      name: 'Ahmad Welder',
      position: 'Welder Senior',
      todayTasks: 4,
      completed: 4,
      quality: 96,
      efficiency: 110
    },
    {
      name: 'Budi Cutter',
      position: 'Metal Cutter',
      todayTasks: 6,
      completed: 5,
      quality: 92,
      efficiency: 95
    },
    {
      name: 'Candra Finisher',
      position: 'Finishing Specialist',
      todayTasks: 3,
      completed: 3,
      quality: 98,
      efficiency: 105
    }
  ];

  return (
    <AuthenticatedLayout
      title="Dashboard Supervisor Besi"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/supervisor-besi' }
      ]}
    >
      <Head title="Dashboard Supervisor Besi" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Wrench className="h-8 w-8 text-gray-600" />
              Dashboard Supervisor Besi
            </h1>
            <p className="text-gray-600 mt-1">{roleInfo?.description || 'Mengawasi dan mengelola operasional produksi besi'}</p>
          </div>
          <Badge variant="outline" className="text-gray-700 border-gray-300">
            Supervisor Besi
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <span className="text-sm text-gray-500">{stat.unit}</span>
                    </div>
                    <p className={`text-sm ${stat.color} font-medium`}>
                      {stat.trend}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-gray-100">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                Tugas Saya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myTasks.map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-600">{task.workOrder}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge 
                          variant={
                            task.priority === 'urgent' ? 'destructive' : 
                            task.priority === 'high' ? 'default' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {task.priority.toUpperCase()}
                        </Badge>
                        <Badge 
                          variant={task.status === 'completed' ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Quantity</p>
                        <p className="font-medium">{task.quantity} unit</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Deadline</p>
                        <p className="font-medium">{task.deadline}</p>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            task.progress === 100 ? 'bg-green-600' :
                            task.progress >= 80 ? 'bg-blue-600' : 
                            task.progress >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Crew Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Kinerja Crew
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {crewPerformance.map((member, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.position}</p>
                      </div>
                      <Badge 
                        variant={member.efficiency >= 100 ? 'default' : member.efficiency >= 90 ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {member.efficiency}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-gray-600">Tasks</p>
                        <p className="font-semibold">{member.completed}/{member.todayTasks}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Quality</p>
                        <p className="font-semibold text-green-600">{member.quality}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Efficiency</p>
                        <p className="font-semibold text-blue-600">{member.efficiency}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors cursor-pointer">
                <ClipboardList className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-blue-900">Tugas Saya</p>
                <p className="text-sm text-blue-600">Lihat daftar tugas</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors cursor-pointer">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-900">Lapor Progress</p>
                <p className="text-sm text-green-600">Update progress kerja</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors cursor-pointer">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-purple-900">Penilaian Crew</p>
                <p className="text-sm text-purple-600">Evaluasi kinerja crew</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition-colors cursor-pointer">
                <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="font-medium text-orange-900">Lapor Kendala</p>
                <p className="text-sm text-orange-600">Report masalah</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}