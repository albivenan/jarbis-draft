import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface FinancialData {
  period: string;
  revenue: number;
  expenses: number;
  grossProfit: number;
  netProfit: number;
  operatingExpenses: number;
  cashFlow: number;
  assets: number;
  liabilities: number;
  equity: number;
}

interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export default function LaporanKeuangan() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [selectedView, setSelectedView] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  const financialData: FinancialData[] = [
    {
      period: '2024-01',
      revenue: 8500000000,
      expenses: 6200000000,
      grossProfit: 2300000000,
      netProfit: 1850000000,
      operatingExpenses: 1100000000,
      cashFlow: 2100000000,
      assets: 45000000000,
      liabilities: 18000000000,
      equity: 27000000000
    },
    {
      period: '2023-12',
      revenue: 7800000000,
      expenses: 5900000000,
      grossProfit: 1900000000,
      netProfit: 1650000000,
      operatingExpenses: 1050000000,
      cashFlow: 1800000000,
      assets: 43500000000,
      liabilities: 17500000000,
      equity: 26000000000
    },
    {
      period: '2023-11',
      revenue: 7200000000,
      expenses: 5400000000,
      grossProfit: 1800000000,
      netProfit: 1520000000,
      operatingExpenses: 980000000,
      cashFlow: 1650000000,
      assets: 42000000000,
      liabilities: 17000000000,
      equity: 25000000000
    }
  ];

  const expenseCategories: ExpenseCategory[] = [
    {
      category: 'Bahan Baku',
      amount: 3200000000,
      percentage: 51.6,
      trend: 'up',
      trendPercentage: 8.5
    },
    {
      category: 'Gaji & Tunjangan',
      amount: 1800000000,
      percentage: 29.0,
      trend: 'stable',
      trendPercentage: 2.1
    },
    {
      category: 'Operasional',
      amount: 650000000,
      percentage: 10.5,
      trend: 'down',
      trendPercentage: -3.2
    },
    {
      category: 'Marketing',
      amount: 350000000,
      percentage: 5.6,
      trend: 'up',
      trendPercentage: 15.8
    },
    {
      category: 'Maintenance',
      amount: 200000000,
      percentage: 3.2,
      trend: 'stable',
      trendPercentage: 1.5
    }
  ];

  const currentData = financialData[0];
  const previousData = financialData[1];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
    }
  };

  const revenueGrowth = calculateGrowth(currentData.revenue, previousData.revenue);
  const profitGrowth = calculateGrowth(currentData.netProfit, previousData.netProfit);
  const expenseGrowth = calculateGrowth(currentData.expenses, previousData.expenses);
  const cashFlowGrowth = calculateGrowth(currentData.cashFlow, previousData.cashFlow);

  const profitMargin = (currentData.netProfit / currentData.revenue) * 100;
  const roa = (currentData.netProfit / currentData.assets) * 100;
  const roe = (currentData.netProfit / currentData.equity) * 100;
  const debtRatio = (currentData.liabilities / currentData.assets) * 100;

  return (
    <AuthenticatedLayout
      title="Laporan Keuangan"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/direktur' },
        { title: 'Laporan Strategis', href: '#' },
        { title: 'Laporan Keuangan', href: '/roles/direktur/laporan/keuangan' }
      ]}
    >
      <Head title="Laporan Keuangan - Direktur" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              Laporan Keuangan
            </h1>
            <p className="text-gray-600 mt-1">Analisis komprehensif kinerja keuangan perusahaan</p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value as 'monthly' | 'quarterly' | 'yearly')}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="monthly">Bulanan</option>
              <option value="quarterly">Kuartalan</option>
              <option value="yearly">Tahunan</option>
            </select>
            <input
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentData.revenue)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {revenueGrowth > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(revenueGrowth)}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Profit</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentData.netProfit)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {profitGrowth > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${profitGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(profitGrowth)}
                    </span>
                  </div>
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
                  <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentData.expenses)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {expenseGrowth > 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-600" />
                    )}
                    <span className={`text-sm ${expenseGrowth > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatPercentage(expenseGrowth)}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cash Flow</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentData.cashFlow)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {cashFlowGrowth > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${cashFlowGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(cashFlowGrowth)}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Ratios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                <p className="text-3xl font-bold text-green-600">{profitMargin.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">Net Profit / Revenue</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">ROA</p>
                <p className="text-3xl font-bold text-blue-600">{roa.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">Return on Assets</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">ROE</p>
                <p className="text-3xl font-bold text-purple-600">{roe.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">Return on Equity</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Debt Ratio</p>
                <p className="text-3xl font-bold text-orange-600">{debtRatio.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">Liabilities / Assets</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Balance Sheet Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Balance Sheet Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">Total Assets</p>
                    <p className="text-sm text-blue-700">Current + Non-current</p>
                  </div>
                  <p className="text-lg font-bold text-blue-900">{formatCurrency(currentData.assets)}</p>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-900">Total Liabilities</p>
                    <p className="text-sm text-red-700">Short + Long term</p>
                  </div>
                  <p className="text-lg font-bold text-red-900">{formatCurrency(currentData.liabilities)}</p>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900">Total Equity</p>
                    <p className="text-sm text-green-700">Shareholders' equity</p>
                  </div>
                  <p className="text-lg font-bold text-green-900">{formatCurrency(currentData.equity)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expenseCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">{category.category}</p>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(category.trend)}
                          <span className={`text-sm ${getTrendColor(category.trend)}`}>
                            {formatPercentage(category.trendPercentage)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">{formatCurrency(category.amount)}</p>
                        <p className="text-sm font-medium text-gray-900">{category.percentage}%</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Health Indicators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Financial Health Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {profitMargin > 15 ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : profitMargin > 10 ? (
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">Profitability</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {profitMargin > 15 ? 'Excellent' : profitMargin > 10 ? 'Good' : 'Needs Improvement'}
                </p>
                <p className="text-lg font-bold mt-2">{profitMargin.toFixed(1)}%</p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {debtRatio < 40 ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : debtRatio < 60 ? (
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">Leverage</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {debtRatio < 40 ? 'Conservative' : debtRatio < 60 ? 'Moderate' : 'High Risk'}
                </p>
                <p className="text-lg font-bold mt-2">{debtRatio.toFixed(1)}%</p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {currentData.cashFlow > 0 ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">Liquidity</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {currentData.cashFlow > 0 ? 'Positive Cash Flow' : 'Negative Cash Flow'}
                </p>
                <p className="text-lg font-bold mt-2">{formatCurrency(currentData.cashFlow)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}