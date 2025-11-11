import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';

const ManajerOperasionalDashboard = () => {
  return (
    <AuthenticatedLayout>
      <Head title="Manajer Operasional Dashboard" />
      
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manajer Operasional Dashboard</h1>
          <p className="text-gray-600">Kelola operasional dan koordinasi antar departemen</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Total Employees */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Karyawan</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">
                +5 dari bulan lalu
              </p>
            </CardContent>
          </Card>

          {/* Operational Efficiency */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efisiensi Operasional</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                +3% dari minggu lalu
              </p>
            </CardContent>
          </Card>

          {/* Pending Issues */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Issues Pending</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                -2 dari kemarin
              </p>
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                Bulan ini
              </p>
            </CardContent>
          </Card>

          {/* Average Response Time */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3h</div>
              <p className="text-xs text-muted-foreground">
                -0.5h dari target
              </p>
            </CardContent>
          </Card>

          {/* Department Performance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dept Performance</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">
                Overall rating
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Department Overview */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-sm">HRD</h3>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <p className="text-xs text-muted-foreground">Performance</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-sm">Finance</h3>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-blue-600">88%</div>
                    <p className="text-xs text-muted-foreground">Performance</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-sm">Production</h3>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-orange-600">91%</div>
                    <p className="text-xs text-muted-foreground">Performance</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-sm">Marketing</h3>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-purple-600">89%</div>
                    <p className="text-xs text-muted-foreground">Performance</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Operational Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Monthly performance review completed</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cross-department meeting scheduled</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Process improvement initiative launched</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ManajerOperasionalDashboard;