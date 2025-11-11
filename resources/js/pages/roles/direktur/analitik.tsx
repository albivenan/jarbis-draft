import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart2, 
  TrendingUp, 
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Activity,
  PieChart
} from 'lucide-react';

export default function AnalitikBisnis() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const businessMetrics = {
    revenue: {
      current: 2850000000,
      growth: 12.5,
      trend: 'up',
      forecast: 3200000000
    },
    customers: {
      total: 245,
      new: 28,
      retention: 87.5,
      churn: 12.5
    },
    production: {
      efficiency: 92.3,
      capacity: 85.7,
      quality: 96.8,
      onTime: 94.2
    },
    financial: {
      profitMargin: 26.3,
      roi: 18.7,
      cashFlow: 850000000,
      expenses: 2100000000
    }
  };

  const departmentPerformance = [
    { 
      department: 'Produksi Besi', 
      efficiency: 94.5, 
      revenue: 1200000000, 
      growth: 15.2,
      status: 'excellent'
    },
    { 
      department: 'Produksi Kayu', 
      efficiency: 91.8, 
      revenue: 980000000, 
      growth: 8.7,
      status: 'good'
    },
    { 
      department: 'Marketing', 
      efficiency: 88.3, 
      revenue: 450000000, 
      growth: 22.1,
      status: 'excellent'
    },
    { 
      department: 'PPIC', 
      efficiency: 89.7, 
      revenue: 0, 
      growth: 5.3,
      status: 'good'
    },
    { 
      department: 'QC', 
      efficiency: 96.2, 
      revenue: 0, 
      growth: 3.8,
      status: 'excellent'
    }
  ];

  const keyInsights = [
    {
      type: 'opportunity',
      title: 'Peluang Ekspansi Produksi Besi',
      description: 'Demand meningkat 35% dalam 3 bulan terakhir. Kapasitas produksi dapat ditingkatkan.',
      impact: 'high',
      action: 'Pertimbangkan investasi mesin baru'
    },
    {
      type: 'warning',
      title: 'Efisiensi Produksi Kayu Menurun',
      description: 'Efisiensi turun 2.3% bulan ini. Perlu evaluasi proses dan training.',
      impact: 'medium',
      action: 'Review SOP dan training crew'
    },
    {
      type: 'success',
      title: 'Customer Retention Meningkat',
      description: 'Retention rate naik menjadi 87.5%, tertinggi dalam 2 tahun.',
      impact: 'high',
      action: 'Pertahankan strategi customer service'
    },
    {
      type: 'info',
      title: 'Tren Digitalisasi Positif',
      description: 'Adopsi sistem digital meningkatkan efisiensi operasional 12%.',
      impact: 'medium',
      action: 'Lanjutkan program digitalisasi'
    }
  ];

  const predictiveAnalytics = {
    nextMonth: {
      revenue: 3100000000,
      orders: 175,
      growth: 8.8
    },
    nextQuarter: {
      revenue: 9500000000,
      orders: 520,
      growth: 11.2
    },
    risks: [
      { risk: 'Material shortage', probability: 25, impact: 'medium' },
      { risk: 'Seasonal demand drop', probability: 40, impact: 'low' },
      { risk: 'Competition increase', probability: 60, impact: 'medium' }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'info': return <Activity className="h-5 w-5 text-blue-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'border-l-green-500 bg-green-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <AuthenticatedLayout
      title="Analitik Bisnis"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/direktur' },
        { title: 'Laporan Strategis', href: '#' },
        { title: 'Analitik Bisnis', href: '/roles/direktur/analitik' }
      ]}
    >
      <Head title="Analitik Bisnis - Direktur" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart2 className="h-8 w-8 text-purple-600" />
              Analitik Bisnis
            </h1>
            <p className="text-gray-600 mt-1">Insights mendalam dan prediksi bisnis berbasis data</p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="1month">1 Bulan</option>
              <option value="3months">3 Bulan</option>
              <option value="6months">6 Bulan</option>
              <option value="1year">1 Tahun</option>
            </select>
            <Button variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              Real-time
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
                  <p className="text-2xl font-bold text-gray-900">{businessMetrics.revenue.growth}%</p>
                  <p className="text-sm text-green-600">Forecast: {formatCurrency(businessMetrics.revenue.forecast)}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Customer Retention</p>
                  <p className="text-2xl font-bold text-gray-900">{businessMetrics.customers.retention}%</p>
                  <p className="text-sm text-blue-600">{businessMetrics.customers.new} new customers</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Production Efficiency</p>
                  <p className="text-2xl font-bold text-gray-900">{businessMetrics.production.efficiency}%</p>
                  <p className="text-sm text-purple-600">Quality: {businessMetrics.production.quality}%</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                  <p className="text-2xl font-bold text-gray-900">{businessMetrics.financial.profitMargin}%</p>
                  <p className="text-sm text-orange-600">ROI: {businessMetrics.financial.roi}%</p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
            <TabsTrigger value="insights">Key Insights</TabsTrigger>
            <TabsTrigger value="predictions">Predictive Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5" />
                  Performance per Departemen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentPerformance.map((dept, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">{dept.department}</h4>
                          <Badge className={getStatusColor(dept.status)}>
                            {dept.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Growth: {dept.growth}%</p>
                          {dept.revenue > 0 && (
                            <p className="font-medium">{formatCurrency(dept.revenue)}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Efficiency</span>
                          <span>{dept.efficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${dept.efficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* Key Business Insights */}
            <div className="grid gap-4">
              {keyInsights.map((insight, index) => (
                <Card key={index} className={`border-l-4 ${getInsightColor(insight.type)}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                          <Badge className={`${insight.impact === 'high' ? 'bg-red-100 text-red-800' : 
                                           insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                           'bg-green-100 text-green-800'}`}>
                            {insight.impact.toUpperCase()} IMPACT
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-3">{insight.description}</p>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Recommended Action: {insight.action}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            {/* Predictive Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Prediksi Performa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Bulan Depan</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Revenue:</span>
                          <span className="font-semibold text-blue-900">
                            {formatCurrency(predictiveAnalytics.nextMonth.revenue)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Orders:</span>
                          <span className="font-semibold text-blue-900">
                            {predictiveAnalytics.nextMonth.orders}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Growth:</span>
                          <span className="font-semibold text-green-600">
                            +{predictiveAnalytics.nextMonth.growth}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Quarter Depan</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-green-700">Revenue:</span>
                          <span className="font-semibold text-green-900">
                            {formatCurrency(predictiveAnalytics.nextQuarter.revenue)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Orders:</span>
                          <span className="font-semibold text-green-900">
                            {predictiveAnalytics.nextQuarter.orders}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Growth:</span>
                          <span className="font-semibold text-green-600">
                            +{predictiveAnalytics.nextQuarter.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {predictiveAnalytics.risks.map((risk, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{risk.risk}</h5>
                          <Badge className={`${risk.impact === 'high' ? 'bg-red-100 text-red-800' : 
                                           risk.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                           'bg-green-100 text-green-800'}`}>
                            {risk.impact.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Probability</span>
                            <span>{risk.probability}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${risk.probability > 50 ? 'bg-red-500' : 
                                         risk.probability > 25 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${risk.probability}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
