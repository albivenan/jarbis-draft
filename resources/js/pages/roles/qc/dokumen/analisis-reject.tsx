import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, TrendingDown, AlertTriangle, Download, BarChart3 } from 'lucide-react';

interface RejectAnalysis {
  id: string;
  period: string;
  productCategory: string;
  totalInspected: number;
  totalRejected: number;
  rejectRate: number;
  topDefects: Array<{
    defectType: string;
    count: number;
    percentage: number;
  }>;
  trend: 'up' | 'down' | 'stable';
}

export default function AnalisisReject() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');

  const rejectAnalyses: RejectAnalysis[] = [
    {
      id: '1',
      period: 'Januari 2024',
      productCategory: 'Meja Kayu',
      totalInspected: 150,
      totalRejected: 12,
      rejectRate: 8.0,
      trend: 'down',
      topDefects: [
        { defectType: 'Cacat Finishing', count: 5, percentage: 41.7 },
        { defectType: 'Dimensi Tidak Sesuai', count: 4, percentage: 33.3 },
        { defectType: 'Sambungan Lemah', count: 3, percentage: 25.0 }
      ]
    },
    {
      id: '2',
      period: 'Januari 2024',
      productCategory: 'Kursi Kayu',
      totalInspected: 200,
      totalRejected: 25,
      rejectRate: 12.5,
      trend: 'up',
      topDefects: [
        { defectType: 'Stabilitas Kurang', count: 10, percentage: 40.0 },
        { defectType: 'Cacat Pelapis', count: 8, percentage: 32.0 },
        { defectType: 'Finishing Tidak Rata', count: 7, percentage: 28.0 }
      ]
    },
    {
      id: '3',
      period: 'Januari 2024',
      productCategory: 'Lemari Pakaian',
      totalInspected: 80,
      totalRejected: 6,
      rejectRate: 7.5,
      trend: 'stable',
      topDefects: [
        { defectType: 'Pintu Tidak Lancar', count: 3, percentage: 50.0 },
        { defectType: 'Handle Rusak', count: 2, percentage: 33.3 },
        { defectType: 'Engsel Lemah', count: 1, percentage: 16.7 }
      ]
    },
    {
      id: '4',
      period: 'Januari 2024',
      productCategory: 'Rak Buku',
      totalInspected: 120,
      totalRejected: 8,
      rejectRate: 6.7,
      trend: 'down',
      topDefects: [
        { defectType: 'Kekuatan Kurang', count: 4, percentage: 50.0 },
        { defectType: 'Dimensi Tidak Sesuai', count: 3, percentage: 37.5 },
        { defectType: 'Cacat Kayu', count: 1, percentage: 12.5 }
      ]
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-600" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-600';
      case 'down': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'up': return 'Meningkat';
      case 'down': return 'Menurun';
      default: return 'Stabil';
    }
  };

  const getRateColor = (rate: number) => {
    if (rate < 5) return 'text-green-600';
    if (rate < 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredAnalyses = rejectAnalyses.filter(analysis => {
    const matchesSearch = analysis.productCategory.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalInspected = rejectAnalyses.reduce((sum, a) => sum + a.totalInspected, 0);
  const totalRejected = rejectAnalyses.reduce((sum, a) => sum + a.totalRejected, 0);
  const overallRejectRate = ((totalRejected / totalInspected) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analisis Reject</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Lihat Grafik
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalInspected}</div>
              <div className="text-sm text-gray-600">Total Inspeksi</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{totalRejected}</div>
              <div className="text-sm text-gray-600">Total Reject</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getRateColor(parseFloat(overallRejectRate))}`}>
                {overallRejectRate}%
              </div>
              <div className="text-sm text-gray-600">Reject Rate</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{rejectAnalyses.length}</div>
              <div className="text-sm text-gray-600">Kategori Produk</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari berdasarkan kategori produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
              <option value="quarter">Kuartal Ini</option>
              <option value="year">Tahun Ini</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Analysis List */}
      <div className="grid gap-4">
        {filteredAnalyses.map((analysis) => (
          <Card key={analysis.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{analysis.productCategory}</h3>
                    <p className="text-sm text-gray-600">{analysis.period}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getRateColor(analysis.rejectRate)}`}>
                      {analysis.rejectRate.toFixed(1)}%
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${getTrendColor(analysis.trend)}`}>
                      {getTrendIcon(analysis.trend)}
                      <span>{getTrendText(analysis.trend)}</span>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Inspeksi</p>
                    <p className="font-semibold text-lg">{analysis.totalInspected}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Reject</p>
                    <p className="font-semibold text-lg text-red-600">{analysis.totalRejected}</p>
                  </div>
                </div>

                {/* Top Defects */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Top Defects
                  </h4>
                  <div className="space-y-2">
                    {analysis.topDefects.map((defect, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{defect.defectType}</span>
                            <span className="text-sm text-gray-600">
                              {defect.count} ({defect.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${defect.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAnalyses.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Tidak ada data analisis yang sesuai dengan filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
