import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  AlertCircle,
  CheckCircle,
  Video,
  Phone,
  FileText
} from 'lucide-react';

interface ScheduleEvent {
  id: string;
  title: string;
  type: 'meeting' | 'interview' | 'training' | 'review' | 'other';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  attendees: string[];
  description: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  isRecurring: boolean;
  meetingType: 'offline' | 'online' | 'hybrid';
  priority: 'low' | 'medium' | 'high';
}

export default function JadwalManajerHRD() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  const scheduleEvents: ScheduleEvent[] = [
    {
      id: 'SCH-001',
      title: 'Interview Kandidat Supervisor QC',
      type: 'interview',
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '10:00',
      location: 'Ruang Meeting HRD',
      attendees: ['Direktur', 'Manajer QC'],
      description: 'Wawancara final untuk posisi Supervisor Quality Control departemen Besi',
      status: 'scheduled',
      isRecurring: false,
      meetingType: 'offline',
      priority: 'high'
    },
    {
      id: 'SCH-002',
      title: 'Review Kinerja Bulanan Tim HRD',
      type: 'review',
      date: '2024-01-15',
      startTime: '13:30',
      endTime: '15:00',
      location: 'Ruang Rapat Utama',
      attendees: ['Staf HRD', 'Admin HRD'],
      description: 'Evaluasi pencapaian target dan planning bulan depan',
      status: 'scheduled',
      isRecurring: true,
      meetingType: 'offline',
      priority: 'medium'
    },
    {
      id: 'SCH-003',
      title: 'Training Safety & K3 untuk Karyawan Baru',
      type: 'training',
      date: '2024-01-16',
      startTime: '08:00',
      endTime: '12:00',
      location: 'Aula Pelatihan',
      attendees: ['15 Karyawan Baru', 'Trainer K3'],
      description: 'Pelatihan wajib keselamatan kerja untuk batch karyawan baru bulan Januari',
      status: 'scheduled',
      isRecurring: false,
      meetingType: 'offline',
      priority: 'high'
    },
    {
      id: 'SCH-004',
      title: 'Meeting Koordinasi dengan Manajer Produksi',
      type: 'meeting',
      date: '2024-01-16',
      startTime: '14:00',
      endTime: '15:30',
      location: 'Microsoft Teams',
      attendees: ['Manajer Produksi Besi', 'Manajer Produksi Kayu'],
      description: 'Diskusi kebutuhan SDM untuk proyek Q1 2024',
      status: 'scheduled',
      isRecurring: false,
      meetingType: 'online',
      priority: 'medium'
    },
    {
      id: 'SCH-005',
      title: 'Presentasi Laporan HRD ke Direksi',
      type: 'meeting',
      date: '2024-01-17',
      startTime: '10:00',
      endTime: '11:30',
      location: 'Ruang Direksi',
      attendees: ['Direktur', 'Wakil Direktur'],
      description: 'Presentasi laporan bulanan HRD dan rencana strategis Q1',
      status: 'scheduled',
      isRecurring: true,
      meetingType: 'offline',
      priority: 'high'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-purple-100 text-purple-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'online': return <Video className="h-4 w-4" />;
      case 'hybrid': return <Phone className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const todayEvents = scheduleEvents.filter(event => event.date === selectedDate);
  const upcomingEvents = scheduleEvents.filter(event => new Date(event.date) > new Date(selectedDate));

  return (
    <AuthenticatedLayout
      title="Jadwal Pribadi"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/hrd' },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Jadwal', href: '/roles/hrd/administrasi-pribadi/jadwal' }
      ]}
    >
      <Head title="Jadwal Pribadi - Manajer HRD" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              Jadwal Pribadi
            </h1>
            <p className="text-gray-600 mt-1">Kelola jadwal dan agenda harian Anda</p>
          </div>
          <div className="flex gap-3">
            <div className="flex border rounded-lg">
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'day' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Hari
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'week' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Minggu
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'month' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Bulan
              </button>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Jadwal
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar & Date Picker */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Kalender</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Ringkasan Jadwal</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Hari ini</span>
                      <Badge variant="outline">{todayEvents.length} agenda</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Mendatang</span>
                      <Badge variant="outline">{upcomingEvents.length} agenda</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Prioritas Tinggi</span>
                      <Badge className="bg-red-100 text-red-800">
                        {scheduleEvents.filter(e => e.priority === 'high').length}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Legend</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Meeting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Interview</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded"></div>
                      <span>Training</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span>Review</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Jadwal {new Date(selectedDate).toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Tidak ada jadwal untuk hari ini</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayEvents.map((event) => (
                      <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(event.status)}
                              <h3 className="font-semibold text-gray-900">{event.title}</h3>
                              <Badge className={getTypeColor(event.type)}>
                                {event.type}
                              </Badge>
                              <Badge className={getPriorityColor(event.priority)}>
                                {event.priority}
                              </Badge>
                              {event.isRecurring && (
                                <Badge variant="outline">Recurring</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{event.startTime} - {event.endTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {getMeetingTypeIcon(event.meetingType)}
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{event.attendees.length} peserta</span>
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm">{event.description}</p>
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">Peserta: {event.attendees.join(', ')}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Jadwal Mendatang</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingEvents.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{event.title}</h4>
                            <Badge className={getTypeColor(event.type)} size="sm">
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString('id-ID')} • {event.startTime} - {event.endTime}
                          </p>
                        </div>
                        <Badge className={getPriorityColor(event.priority)} size="sm">
                          {event.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
