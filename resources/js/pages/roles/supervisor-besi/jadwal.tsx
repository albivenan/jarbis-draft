import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  User,
  Briefcase
} from 'lucide-react';

export default function Jadwal() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const scheduleEvents = [
    {
      id: 'SCH-001',
      title: 'Shift Pagi - Supervisi Produksi',
      type: 'work_shift',
      startTime: '2025-01-06 07:00',
      endTime: '2025-01-06 15:00',
      location: 'Workshop Besi Area A',
      description: 'Supervisi produksi H-beam dan monitoring kualitas',
      crew: ['Ahmad Santoso', 'Budi Prasetyo', 'Eko Susanto'],
      workOrders: ['WO-BSI-001', 'WO-BSI-002'],
      status: 'scheduled',
      priority: 'high'
    },
    {
      id: 'SCH-002',
      title: 'Meeting Koordinasi Produksi',
      type: 'meeting',
      startTime: '2025-01-06 09:00',
      endTime: '2025-01-06 10:00',
      location: 'Ruang Meeting Produksi',
      description: 'Koordinasi dengan Manajer Produksi terkait target mingguan',
      attendees: ['Manajer Produksi Besi', 'Supervisor Besi A', 'PPIC'],
      status: 'scheduled',
      priority: 'medium'
    },
    {
      id: 'SCH-003',
      title: 'Inspeksi Keselamatan Kerja',
      type: 'inspection',
      startTime: '2025-01-06 13:00',
      endTime: '2025-01-06 14:00',
      location: 'Seluruh Area Workshop Besi',
      description: 'Inspeksi rutin keselamatan kerja dan penggunaan APD',
      checklist: ['APD lengkap', 'Kondisi mesin', 'Housekeeping', 'Emergency equipment'],
      status: 'scheduled',
      priority: 'high'
    },
    {
      id: 'SCH-004',
      title: 'Training Crew Baru',
      type: 'training',
      startTime: '2025-01-07 08:00',
      endTime: '2025-01-07 12:00',
      location: 'Training Room & Workshop',
      description: 'Pelatihan teknik pengelasan untuk crew baru',
      trainees: ['Eko Susanto', 'Fajar Nugroho'],
      topics: ['Basic welding', 'Safety procedures', 'Quality standards'],
      status: 'scheduled',
      priority: 'medium'
    },
    {
      id: 'SCH-005',
      title: 'Evaluasi Kinerja Bulanan',
      type: 'evaluation',
      startTime: '2025-01-07 14:00',
      endTime: '2025-01-07 16:00',
      location: 'Ruang Supervisor',
      description: 'Evaluasi kinerja crew untuk periode Januari 2025',
      evaluees: ['Ahmad Santoso', 'Budi Prasetyo', 'Candra Wijaya'],
      status: 'scheduled',
      priority: 'medium'
    },
    {
      id: 'SCH-006',
      title: 'Shift Sore - Supervisi Produksi',
      type: 'work_shift',
      startTime: '2025-01-08 15:00',
      endTime: '2025-01-08 23:00',
      location: 'Workshop Besi Area B',
      description: 'Supervisi shift sore untuk mengejar target produksi',
      crew: ['Dedi Kurniawan', 'Eko Susanto'],
      workOrders: ['WO-BSI-003'],
      status: 'scheduled',
      priority: 'high'
    },
    {
      id: 'SCH-007',
      title: 'Audit Internal QMS',
      type: 'audit',
      startTime: '2025-01-09 10:00',
      endTime: '2025-01-09 15:00',
      location: 'Workshop Besi & Dokumentasi',
      description: 'Audit internal sistem manajemen mutu ISO 9001',
      auditors: ['Internal Auditor', 'QC Manager'],
      areas: ['Production process', 'Documentation', 'Training records'],
      status: 'scheduled',
      priority: 'high'
    },
    {
      id: 'SCH-008',
      title: 'Maintenance Preventif Mesin',
      type: 'maintenance',
      startTime: '2025-01-10 06:00',
      endTime: '2025-01-10 08:00',
      location: 'Workshop Besi - Mesin Las',
      description: 'Maintenance rutin mesin las dan cutting torch',
      technicians: ['Maintenance Team', 'Supervisor Besi'],
      equipment: ['Welding machine SMAW', 'Cutting torch', 'Grinder'],
      status: 'scheduled',
      priority: 'medium'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'work_shift': return 'bg-blue-100 text-blue-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      case 'inspection': return 'bg-red-100 text-red-800';
      case 'training': return 'bg-green-100 text-green-800';
      case 'evaluation': return 'bg-yellow-100 text-yellow-800';
      case 'audit': return 'bg-orange-100 text-orange-800';
      case 'maintenance': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'work_shift': return 'Shift Kerja';
      case 'meeting': return 'Meeting';
      case 'inspection': return 'Inspeksi';
      case 'training': return 'Training';
      case 'evaluation': return 'Evaluasi';
      case 'audit': return 'Audit';
      case 'maintenance': return 'Maintenance';
      default: return type;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('id-ID', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const todayEvents = scheduleEvents.filter(event => 
    new Date(event.startTime).toDateString() === new Date().toDateString()
  );

  const upcomingEvents = scheduleEvents.filter(event => 
    new Date(event.startTime) > new Date() && 
    new Date(event.startTime).toDateString() !== new Date().toDateString()
  ).slice(0, 5);

  const stats = [
    {
      title: 'Jadwal Hari Ini',
      value: todayEvents.length.toString(),
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Shift Kerja',
      value: scheduleEvents.filter(e => e.type === 'work_shift').length.toString(),
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Meeting/Training',
      value: scheduleEvents.filter(e => ['meeting', 'training'].includes(e.type)).length.toString(),
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Inspeksi/Audit',
      value: scheduleEvents.filter(e => ['inspection', 'audit'].includes(e.type)).length.toString(),
      icon: CheckCircle,
      color: 'text-orange-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Jadwal Kerja"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/supervisor-besi' },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Jadwal', href: '/roles/supervisor-besi/jadwal' }
      ]}
    >
      <Head title="Jadwal Kerja - Supervisor Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              Jadwal Kerja Saya
            </h1>
            <p className="text-gray-600 mt-1">Kelola dan pantau jadwal kerja, meeting, dan aktivitas supervisi</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Jadwal
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-full bg-gray-100">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Jadwal Hari Ini</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayEvents.length > 0 ? (
                    todayEvents.map((event) => (
                      <div key={event.id} className={`border-l-4 ${getPriorityColor(event.priority)} bg-gray-50 p-4 rounded-r-lg`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{event.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </span>
                            </div>
                          </div>
                          <Badge className={getEventTypeColor(event.type)}>
                            {getEventTypeLabel(event.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{event.description}</p>
                        
                        {event.crew && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Crew: {event.crew.join(', ')}</span>
                          </div>
                        )}
                        
                        {event.workOrders && (
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <Briefcase className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">WO: {event.workOrders.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Tidak ada jadwal untuk hari ini</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Jadwal Mendatang</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-sm text-gray-900 line-clamp-2">{event.title}</h5>
                        <Badge className={getEventTypeColor(event.type)} size="sm">
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(event.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {upcomingEvents.length === 0 && (
                    <div className="text-center py-6">
                      <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Tidak ada jadwal mendatang</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Atur Shift Kerja
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Jadwalkan Inspeksi
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Training Crew
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Weekly Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Mingguan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day, index) => {
                const dayEvents = scheduleEvents.filter(event => {
                  const eventDate = new Date(event.startTime);
                  const dayOfWeek = eventDate.getDay();
                  return dayOfWeek === (index + 1) % 7;
                });

                return (
                  <div key={day} className="border rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-2">{day}</h4>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className="text-xs p-2 rounded bg-gray-100">
                          <p className="font-medium line-clamp-1">{event.title}</p>
                          <p className="text-gray-600">{formatTime(event.startTime)}</p>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">+{dayEvents.length - 3} lainnya</p>
                      )}
                      {dayEvents.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-2">Tidak ada jadwal</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}