import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Users,
  Package,
  Target,
  Calendar,
  Download,
  Eye,
  DollarSign,
  ShoppingCart,
  Award
} from 'lucide-react';

interface SalesData {
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  newCustomers: number;
  returningCustomers: number;
  conversionRate: number;
  topProduct: string;
  topCustomer: string;
}

interface ProductSales {
  productName: string;
  category: 'besi' | 'kayu';
  quantity: number;
  revenue: number;
  growth: number;
  marketShare: number;
}

interface CustomerSegment {
  segment: string;
  customers: number;
  revenue: number;
  percentage: number;
  avgOrderValue: number;
  frequency: number;
}

export default function LaporanPenjualan() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [selectedView, setSelectedView] = useState<'overview' | 'products' | 'customers'>('overview');

  const salesData: SalesData[] = [
    {
      period: '2024-01',
      totalSales: 8500000000,
      totalOrders: 145,
      averageOrderValue: 58620689,
      newCustomers: 23,
      returningCustomers: 67,
      conversionRate: 68.5,
      topProduct: 'H-Beam Steel 400x200',
      topCustomer: 'PT Konstruksi Megah'
    },
    {
      period: '2023-12',
      totalSales: 7800000000,
      totalOrders: 132,
      averageOrderValue: 59090909,
      newCustomers: 19,
      returningCustomers: 58,
      conversionRate: 65.2,
      topProduct: 'Kayu Jati Grade A',
      topCustomer: 'CV Furniture Jaya'
    }
  ];

  const productSales: ProductSales[] = [
    {
      productName: 'H-Beam Steel 400x200',
      category: 'besi',
      quantity: 850,
      revenue: 2100000000,
      growth: 15.8,
      marketShare: 24.7
    },
    {
      productName: 'Kayu Jati Grade A',
      category: 'kayu',
      quantity: 1200,
      revenue: 1800000000,
      growth: 12.3,
      marketShare: 21.2
    },
    {
      productName: 'Steel Plate 20mm',
      category: 'besi',
      quantity: 650,
      revenue: 1500000000,
      growth: 8.9,
      marketShare: 17.6
    },
    {
      productName: 'Kayu Mahoni Premium',
      category: 'kayu',
      quantity: 800,
      revenue: 1200000000,
      growth: 22.1,
      marketShare: 14.1
    },
    {
      productName: 'Angle Bar 50x50',
      category: 'besi',
      quantity: 2000,
      revenue: 950000000,
      growth: -3.2,
      marketShare: 11.2
    },
    {
      productName: 'Kayu Pine Grade B',
      category: 'kayu',
      quantity: 1500,
      revenue: 950000000,
      growth: 18.7,
      marketShare: 11.2
    }
  ];

  const customerSegments: CustomerSegment[] = [
    {
      segment: 'Enterprise (>1B)',
      customers: 12,
      revenue: 4250000000,
      percentage: 50.0,
      avgOrderValue: 354166667,
      frequency: 8.5
    },
    {
      segment: 'Corporate (500M-1B)',
      customers: 28,
      revenue: 2550000000,
      percentage: 30.0,
      avgOrderValue: 91071429,
      frequency: 5.2
    },
    {
      segment: 'SME (100M-500M)',
      customers: 45,
      revenue: 1275000000,
      percentage: 15.0,
      avgOrderValue: 28333333,
      frequency: 3.8
    },
    {
      segment: 'Small (<100M)',
      customers: 67,
      revenue: 425000000,
      percentage: 5.0,
      avgOrderValue: 6343284,
      frequency: 2.1
    }
  ];

  const currentData = salesData[0];
  const previousData = salesData[1];

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

  const salesGrowth = calculateGrowth(currentData.totalSales, previousData.totalSales);
  const ordersGrowth = calculateGrowth(currentData.totalOrders, previousData.totalOrders);
  const aovGrowth = calculateGrowth(currentData.averageOrderValue, previousData.averageOrderValue);
  const customerGrowth = calculateGrowth(
    currentData.newCustomers + currentData.returningCustomers,
    previousData.newCustomers + previousData.returningCustomers
  );

  const getCategoryColor = (category: 'besi' | 'kayu') => {
    return category === 'besi' ? 'bg-gray-100 text-gray-800' : 'bg-amber-100 text-amber-800';
  };

  const getCategoryText = (category: 'besi' | 'kayu') => {
    return category === 'besi' ? 'Besi' : 'Kayu';
  };

  return (
    <AuthenticatedLayout
      title="Laporan Penjualan"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/direktur' },
        { title: 'Laporan Strategis', href: '#' },
        { title: 'Laporan Penjualan', href: '/roles/direktur/laporan/penjualan' }
      ]}
    >
      <Head title="Laporan Penjualan - Direktur" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              Laporan Penjualan
            </h1>
            <p className="text-gray-600 mt-1">Analisis performa penjualan dan tren pasar</p>
          </div>
          <div className="flex gap-3">
            <div className="flex border rounded-lg">
              <button
                onClick={() => setSelectedView('overview')}
                className={`px-4 py-2 text-sm font-medium ${
                  selectedView === 'overview' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedView('products')}
                className={`px-4 py-2 text-sm font-medium ${
                  selectedView === 'products' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setSelectedView('customers')}
                className={`px-4 py-2 text-sm font-medium ${
                  selectedView === 'customers' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Customers
              </button>
            </div>
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

        {selectedView === 'overview' && (
          <>
            {/* Key Sales Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Sales</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentData.totalSales)}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {salesGrowth > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${salesGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(salesGrowth)}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{currentData.totalOrders}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {ordersGrowth > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${ordersGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(ordersGrowth)}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentData.averageOrderValue)}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {aovGrowth > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${aovGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(aovGrowth)}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{currentData.conversionRate}%</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-sm text-gray-600">
                          {currentData.newCustomers + currentData.returningCustomers} customers
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-orange-100">
                      <Target className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Customer Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-900">New Customers</p>
                        <p className="text-sm text-green-700">First-time buyers</p>
                      </div>
                      <p className="text-2xl font-bold text-green-900">{currentData.newCustomers}</p>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">Returning Customers</p>
                        <p className="text-sm text-blue-700">Repeat buyers</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">{currentData.returningCustomers}</p>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Customer Retention</span>
                        <span>{((currentData.returningCustomers / (currentData.newCustomers + currentData.returningCustomers)) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(currentData.returningCustomers / (currentData.newCustomers + currentData.returningCustomers)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <p className="font-medium text-gray-900">Top Product</p>
                      </div>
                      <p className="text-lg font-semibold text-blue-600">{currentData.topProduct}</p>
                      <p className="text-sm text-gray-600">Best selling product this month</p>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <p className="font-medium text-gray-900">Top Customer</p>
                      </div>
                      <p className="text-lg font-semibold text-green-600">{currentData.topCustomer}</p>
                      <p className="text-sm text-gray-600">Highest revenue contributor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {selectedView === 'products' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Sales Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Product Name</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Quantity</th>
                      <th className="text-left py-3 px-4">Revenue</th>
                      <th className="text-left py-3 px-4">Growth</th>
                      <th className="text-left py-3 px-4">Market Share</th>
                      <th className="text-left py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productSales.map((product, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{product.productName}</td>
                        <td className="py-3 px-4">
                          <Badge className={getCategoryColor(product.category)}>
                            {getCategoryText(product.category)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{product.quantity.toLocaleString()}</td>
                        <td className="py-3 px-4 font-medium">{formatCurrency(product.revenue)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {product.growth > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className={`text-sm ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatPercentage(product.growth)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{product.marketShare}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${product.marketShare}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Detail
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedView === 'customers' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Segmentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {customerSegments.map((segment, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{segment.segment}</h3>
                        <p className="text-sm text-gray-600">{segment.customers} customers</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {segment.percentage}% of revenue
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Revenue</p>
                        <p className="font-semibold text-lg">{formatCurrency(segment.revenue)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Order Value</p>
                        <p className="font-semibold text-lg">{formatCurrency(segment.avgOrderValue)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Purchase Frequency</p>
                        <p className="font-semibold text-lg">{segment.frequency}x/year</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" 
                          style={{ width: `${segment.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}