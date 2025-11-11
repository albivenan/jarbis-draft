import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wrench,
  ClipboardList,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
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
      value: '5',
      unit: 'tugas',
      icon: ClipboardList,
      trend: '3 selesai, 2 progress',
      color: 'text-blue-600'
    },
    {
      title: 'Target Harian',
      value: '12',
      unit: 'unit',
      icon: Target,
      trend: '8 unit selesai',
      color: 'text-green-600'
    },
    {
      title: 'Efisiensi Saya',
      value: '95',
      unit: '%',
      icon: TrendingUp,
      trend: 'Target 90%',
      color: 'text-purple-600'
    },
    {
      title: 'Quality Score',
      value: '92',
      unit: '%',
      icon: CheckCircle,
      trend: 'Good performance',
      color: 'text-orange-600'
    }
  ];

  const myTasks = [
    {
      id: 'TASK-ST-001',
      title: 'Welding Rangka Besi Batch 1',
      workOrder: 'WO-BS-001',
      quantity: 5,
      completed: 5,
      deadline: '17:00',
      status: 'completed',
      priority: 'high',
      supervisor: 'Ahmad Supervisor'
    },
    {
      id: 'TASK-ST-002',
      title: 'Cutting Besi Profil 40x40',
      workOrder: 'WO-BS-002',
      quantity: 20,
      completed: 12,
      deadline: '16:30',
      status: 'in-progress',
      priority: 'medium',
      supervisor: 'Ahmad Supervisor'
    },
    {
      id: 'TASK-ST-003',
      title: 'Grinding & Finishing Pagar',
      workOrder: 'WO-BS-003',
      quantity: 8,
      completed: 0,
      deadline: '18:00',
      status: 'pending',
      priority: 'low',
      supervisor: 'Ahmad Supervisor'
    }
  ];

  const qcFeedback = [
    {
      id: 'QC-FB-001',
      product: 'Rangka Besi Batch 1',
      result: 'passed',
      score: 95,
      feedback: 'Kualitas welding sangat baik, dimensi sesuai spesifikasi',
      inspector: 'QC Besi',
      timestamp: '14:30'
    },
    {
      id: 'QC-FB-002',
      product: 'Pagar Minimalis Batch 2',
      result: 'rework',
      score: 78,
      feedback: 'Finishing pada bagian sudut perlu diperbaiki',
      inspector: 'QC Besi',
      timestamp: '13:15'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Dashboard Staf Produksi Besi"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/staf-produksi-besi' }
      ]}
    >
      <Head title="Dashboard Staf Produksi Besi" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Wrench className="h-8 w-8 text-gray-600" />
              Dashboard Staf Produksi Besi
            </h1>
            <p className="text-gray-600 mt-1">{roleInfo?.description || 'Operator produksi divisi besi dan logam'}</p>
          </div>
          <Badge variant="outline" className="text-gray-700 border-gray-300">
            Staf Produksi Besi
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
                Tugas Saya Hari Ini
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
                            task.priority === 'high' ? 'default' : 
                            task.priority === 'medium' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {task.priority.toUpperCase()}
                        </Badge>
                        <Badge 
                          variant={
                            task.status === 'completed' ? 'default' : 
                            task.status === 'in-progress' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                      <div>
                        <p className="text-gray-600">Progress</p>
                        <p className="font-medium">{task.completed}/{task.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Deadline</p>
                        <p className="font-medium">{task.deadline}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Supervisor</p>
                        <p className="font-medium text-xs">{task.supervisor}</p>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            task.status === 'completed' ? 'bg-green-600' :
                            task.status === 'in-progress' ? 'bg-blue-600' : 'bg-gray-400'
                          }`}
                          style={{ width: `${(task.completed / task.quantity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* QC Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Umpan Balik QC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qcFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{feedback.product}</h4>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={feedback.result === 'passed' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {feedback.result === 'passed' ? 'PASSED' : 'REWORK'}
                        </Badge>
                        <span className="text-sm font-semibold text-blue-600">{feedback.score}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{feedback.feedback}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Inspector: {feedback.inspector}</span>
                      <span>{feedback.timestamp}</span>
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
                <p className="font-medium text-blue-900">Lihat Tugas</p>
                <p className="text-sm text-blue-600">Daftar tugas harian</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors cursor-pointer">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-900">Update Progress</p>
                <p className="text-sm text-green-600">Lapor kemajuan kerja</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors cursor-pointer">
                <ClipboardList className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-purple-900">Work Instruction</p>
                <p className="text-sm text-purple-600">Baca instruksi kerja</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition-colors cursor-pointer">
                <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="font-medium text-orange-900">Lapor Masalah</p>
                <p className="text-sm text-orange-600">Report kendala</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}