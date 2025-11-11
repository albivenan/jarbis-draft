import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import AttendanceCalendar from './AttendanceCalendar';

interface AttendanceStats {
  totalDays: number;
  present: number;
  sick: number;
  leave: number;
  absent: number;
  percentage: number;
  avgCheckIn: string;
  avgCheckOut: string;
  lateCount: number;
  earlyLeaveCount: number;
}

interface AttendanceHistoryCardProps {
  title: string;
  period: string;
  stats: AttendanceStats;
  employeeId: string;
  employeeName: string;
  isCurrentMonth?: boolean;
}

const AttendanceHistoryCard: React.FC<AttendanceHistoryCardProps> = ({
  title,
  period,
  stats,
  employeeId,
  employeeName,
  isCurrentMonth = false
}) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'present': return 'text-green-600';
      case 'sick': return 'text-yellow-600';
      case 'leave': return 'text-blue-600';
      case 'absent': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 95) return 'text-green-600';
    if (percentage >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {isCurrentMonth && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Berlangsung
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{period}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Persentase Kehadiran */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getPercentageColor(stats.percentage)}`}>
            {stats.percentage}%
          </div>
          <p className="text-sm text-muted-foreground">Tingkat Kehadiran</p>
        </div>

        {/* Statistik Detail */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Hari</span>
            <span className="font-medium">{stats.totalDays}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${getStatusColor('present')}`}>Hadir</span>
            <span className="font-medium">{stats.present}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${getStatusColor('sick')}`}>Sakit</span>
            <span className="font-medium">{stats.sick}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${getStatusColor('leave')}`}>Izin</span>
            <span className="font-medium">{stats.leave}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${getStatusColor('absent')}`}>Alpa</span>
            <span className="font-medium">{stats.absent}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Terlambat</span>
            <span className="font-medium text-orange-600">{stats.lateCount}</span>
          </div>
        </div>

        {/* Rata-rata Jam Kerja */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Rata-rata Check In
            </span>
            <span className="font-medium">{stats.avgCheckIn}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Rata-rata Check Out
            </span>
            <span className="font-medium">{stats.avgCheckOut}</span>
          </div>
        </div>

        {/* Indikator Performa */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pulang Cepat</span>
            <div className="flex items-center">
              <span className="font-medium mr-1">{stats.earlyLeaveCount}</span>
              {stats.earlyLeaveCount > 0 ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500" />
              )}
            </div>
          </div>
        </div>

        {/* Tombol Lihat Detail */}
        {isCurrentMonth && (
          <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-4">
                <Eye className="h-4 w-4 mr-2" />
                Lihat Detail Riwayat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
              <DialogHeader className="sr-only">
                <DialogTitle>Detail Riwayat Absensi</DialogTitle>
              </DialogHeader>
              <div className="p-2">
                <AttendanceCalendar 
                  employeeId={employeeId} 
                  employeeName={employeeName} 
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceHistoryCard;