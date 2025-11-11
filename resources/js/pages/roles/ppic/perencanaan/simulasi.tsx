import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Target, Play, BarChart2, Clock, AlertTriangle } from 'lucide-react';

interface SimulationResults {
  totalOrders: number;
  scheduledOrders: number;
  delayedOrders: number;
  averageDelay: number;
  capacityUtilization: number;
  recommendations: string[];
}

export default function SimulasiJadwal() {
  const [simulationParams, setSimulationParams] = useState({
    startDate: '',
    endDate: '',
    capacity: 'normal',
    priority: 'deadline'
  });

  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);

  const handleRunSimulation = () => {
    // Simulate running the scheduling simulation
    setSimulationResults({
      totalOrders: 24,
      scheduledOrders: 20,
      delayedOrders: 4,
      averageDelay: 2.5,
      capacityUtilization: 85,
      recommendations: [
        'Tambah 1 shift untuk divisi Besi pada minggu ke-3',
        'Prioritaskan SO-2025-001 karena deadline ketat',
        'Pertimbangkan outsourcing untuk 2 pesanan kayu'
      ]
    });
  };

  return (
    <AuthenticatedLayout
      title="Simulasi Jadwal"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/ppic' },
        { title: 'Perencanaan Produksi', href: '#' },
        { title: 'Simulasi Jadwal', href: '/roles/ppic/perencanaan/simulasi' }
      ]}
    >
      <Head title="Simulasi Jadwal - PPIC" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="h-8 w-8 text-purple-600" />
              Simulasi Jadwal Produksi
            </h1>
            <p className="text-gray-600 mt-1">Simulasikan berbagai skenario penjadwalan untuk optimasi produksi</p>
          </div>
        </div>

        {/* Simulation Parameters */}
        <Card>
          <CardHeader>
            <CardTitle>Parameter Simulasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="startDate">Tanggal Mulai</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={simulationParams.startDate}
                  onChange={(e) => setSimulationParams({ ...simulationParams, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Tanggal Selesai</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={simulationParams.endDate}
                  onChange={(e) => setSimulationParams({ ...simulationParams, endDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="capacity">Kapasitas Produksi</Label>
                <Select value={simulationParams.capacity} onValueChange={(value) => setSimulationParams({ ...simulationParams, capacity: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Rendah (70%)</SelectItem>
                    <SelectItem value="normal">Normal (100%)</SelectItem>
                    <SelectItem value="high">Tinggi (120%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Prioritas</Label>
                <Select value={simulationParams.priority} onValueChange={(value) => setSimulationParams({ ...simulationParams, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="priority">Prioritas Customer</SelectItem>
                    <SelectItem value="profit">Margin Keuntungan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={handleRunSimulation} className="bg-purple-600 hover:bg-purple-700">
                <Play className="w-4 h-4 mr-2" />
                Jalankan Simulasi
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Simulation Results */}
        {simulationResults && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Pesanan</p>
                      <p className="text-2xl font-bold text-gray-900">{simulationResults.totalOrders}</p>
                    </div>
                    <BarChart2 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Terjadwal</p>
                      <p className="text-2xl font-bold text-green-600">{simulationResults.scheduledOrders}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Terlambat</p>
                      <p className="text-2xl font-bold text-red-600">{simulationResults.delayedOrders}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Utilisasi Kapasitas</p>
                      <p className="text-2xl font-bold text-purple-600">{simulationResults.capacityUtilization}%</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Rekomendasi Optimasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {simulationResults.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-blue-900">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
