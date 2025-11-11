import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
  Building,
  Phone,
  Video,
  FileText,
  Send,
  Crown,
  Target,
  Briefcase,
  Coffee,
  Search,
  Filter
} from 'lucide-react';

export default function MeetingManagement() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedView, setSelectedView] = useState<'calendar' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    type: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    participants: '',
    agenda: '',
    description: '',
    priority: 'medium'
  });

  const meetingTypes = [
    { value: 'board', label: 'Board Meeting', icon: Crown },
    { value: 'client', label: 'Client Meeting', icon: Briefcase },
    { value: 'internal', label: 'Internal Meeting', icon: Users },
    { value: 'strategic', label: 'Strategic Planning', icon: Target },
    { value: 'review', label: 'Performance Review', icon: CheckCircle },
    { value: 'project', label: 'Project Meeting', icon: Building }
  ];

  const meetings = [
    {
      id: 'MTG-001',
      title: 'Board Meeting - Q4 Review & 2025 Planning',
      type: 'board',
      date: '2025-01-07',
      startTime: '09:00',
      endTime: '11:00',
      location: 'Ruang Direksi Lantai 5',
      participants: [
        'Board of Directors',
        'Direktur Utama',
        'Manajer HRD',
        'Manajer Keuangan',
        'Manajer Produksi'
      ],
      agenda: 'Review kinerja Q4 2024, Planning strategis 2025, Budget approval',
      description: 'Meeting rutin board untuk evaluasi kinerja dan perencanaan strategis tahun depan',
      status: 'scheduled',
      priority: 'high',
      createdAt: '2025-01-05',
      meetingNotes: '',
      actionItems: [],
      attachments: ['Q4_Report.pdf', '2025_Strategic_Plan.pptx']
    },
    {
      id: 'MTG-002',
      title: 'Client Meeting - PT Konstruksi Megah Project',
      type: 'client',
      date: '2025-01-07',
      startTime: '14:00',
      endTime: '15:30',
      location: 'Meeting Room A',
      participants: [
        'Direktur',
        'Manajer Marketing',
        'Manajer Produksi Besi',
        'Ir. Bambang Sutrisno (Client)',
        'Tim Teknis PT Konstruksi Megah'
      ],
      agenda: 'Diskusi project H-Beam 750M, Timeline delivery, Technical specifications',
      description: 'Meeting dengan klien besar untuk project konstruksi senilai 750M',
      status: 'scheduled',
      priority: 'high',
      createdAt: '2025-01-06',
      meetingNotes: '',
      actionItems: [],
      attachments: ['Project_Proposal.pdf', 'Technical_Specs.docx']
    },
    {
      id: 'MTG-003',
      title: 'Weekly Management Review',
      type: 'internal',
      date: '2025-01-07',
      startTime: '16:00',
      endTime: '17:00',
      location: 'Ruang Meeting Utama',
      participants: [
        'Direktur',
        'Manajer HRD',
        'Manajer Keuangan',
        'Manajer Produksi Besi',
        'Manajer Produksi Kayu',
        'Manajer PPIC',
        'Manajer Marketing'
      ],
      agenda: 'Review progress mingguan, Issue escalation, Resource allocation',
      description: 'Meeting rutin mingguan untuk koordinasi antar departemen',
      status: 'scheduled',
      priority: 'medium',
      createdAt: '2025-01-06',
      meetingNotes: '',
      actionItems: [],
      attachments: []
    },
    {
      id: 'MTG-004',
      title: 'Strategic Planning Session - Digital Transformation',
      type: 'strategic',
      date: '2025-01-08',
      startTime: '09:00',
      endTime: '12:00',
      location: 'Executive Conference Room',
      participants: [
        'Direktur',
        'IT Manager',
        'All Department Managers',
        'External Consultant'
      ],
      agenda: 'Digital transformation roadmap, System integration planning, Budget allocation',
      description: 'Session perencanaan transformasi digital untuk meningkatkan efisiensi operasional',
      status: 'scheduled',
      priority: 'high',
      createdAt: '2025-01-05',
      meetingNotes: '',
      actionItems: [],
      attachments: ['Digital_Roadmap.pdf']
    },
    {
      id: 'MTG-005',
      title: 'Investor Relations Meeting',
      type: 'client',
      date: '2025-01-09',
      startTime: '10:00',
      endTime: '11:30',
      location: 'VIP Meeting Room',
      participants: [
        'Direktur',
        'Manajer Keuangan',
        'Investor Representatives',
        'Financial Advisor'
      ],
      agenda: 'Financial performance presentation, Investment opportunities, Future projections',
      description: 'Quarterly meeting dengan investor untuk update kinerja dan rencana ekspansi',
      status: 'scheduled',
      priority: 'high',
      createdAt: '2025-01-04',
      meetingNotes: '',
      actionItems: [],
      attachments: ['Financial_Report_Q4.pdf', 'Investment_Proposal.pptx']
    },
    {
      id: 'MTG-006',
      title: 'Production Efficiency Review',
      type: 'review',
      date: '2025-01-06',
      startTime: '13:00',
      endTime: '14:30',
      location: 'Production Meeting Room',
      participants: [
        'Direktur',
        'Manajer Produksi Besi',
        'Manajer Produksi Kayu',
        'Supervisor Teams',
        'QC Managers'
      ],
      agenda: 'Production KPI review, Quality metrics, Process improvement initiatives',
      description: 'Review bulanan untuk evaluasi efisiensi produksi dan kualitas',
      status: 'completed',
      priority: 'medium',
      createdAt: '2025-01-03',
      meetingNotes: 'Discussed production targets achievement 98%. Identified bottlenecks in QC process. Action items assigned.',
      actionItems: [
        'Implement new QC checklist - Due: Jan 15',
        'Training for new crew members - Due: Jan 20',
        'Equipment maintenance schedule review - Due: Jan 10'
      ],
      attachments: ['Production_KPI_Dec.xlsx']
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'board': return 'bg-purple-100 text-purple-800';
      case 'client': return 'bg-blue-100 text-blue-800';
      case 'internal': return 'bg-green-100 text-green-800';
      case 'strategic': return 'bg-orange-100 text-orange-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'project': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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

  const getTypeIcon = (type: string) => {
    const typeObj = meetingTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : Users;
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.agenda.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || selectedType === 'all' || meeting.type === selectedType;
    const matchesStatus = !selectedStatus || selectedStatus === 'all' || meeting.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const todaysMeetings = meetings.filter(meeting => meeting.date === '2025-01-07');
  const upcomingMeetings = meetings.filter(meeting => new Date(meeting.date) > new Date('2025-01-07'));
  const completedMeetings = meetings.filter(meeting => meeting.status === 'completed');

  const handleAddMeeting = () => {
    if (!newMeeting.title || !newMeeting.type || !newMeeting.date) {
      alert('Mohon lengkapi field yang diperlukan');
      return;
    }

    console.log('Adding new meeting:', newMeeting);
    alert('Meeting berhasil dijadwalkan!');
    
    // Reset form
    setNewMeeting({
      title: '',
      type: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      participants: '',
      agenda: '',
      description: '',
      priority: 'medium'
    });
    setShowAddForm(false);
  };

  const stats = [
    {
      title: 'Meeting Hari Ini',
      value: todaysMeetings.length.toString(),
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Meeting Mendatang',
      value: upcomingMeetings.length.toString(),
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Meeting Selesai',
      value: completedMeetings.length.toString(),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Total Meeting',
      value: meetings.length.toString(),
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Meeting Management"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/direktur' },
        { title: 'Meeting Management', href: '/roles/direktur/meeting-management' }
      ]}
    >
      <Head title="Meeting Management - Direktur" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-purple-600" />
              Meeting Management
            </h1>
            <p className="text-gray-600 mt-1">Kelola jadwal meeting, agenda, dan follow-up actions</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setSelectedView(selectedView === 'list' ? 'calendar' : 'list')}
              variant="outline"
            >
              {selectedView === 'list' ? <Calendar className="w-4 h-4 mr-2" /> : <Users className="w-4 h-4 mr-2" />}
              {selectedView === 'list' ? 'Calendar View' : 'List View'}
            </Button>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Jadwalkan Meeting
            </Button>
          </div>
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

        {/* Add Meeting Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Jadwalkan Meeting Baru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Judul Meeting <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                    placeholder="Masukkan judul meeting"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Jenis Meeting <span className="text-red-500">*</span>
                  </label>
                  <Select value={newMeeting.type} onValueChange={(value) => setNewMeeting({...newMeeting, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis meeting" />
                    </SelectTrigger>
                    <SelectContent>
                      {meetingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Waktu Mulai
                  </label>
                  <Input
                    type="time"
                    value={newMeeting.startTime}
                    onChange={(e) => setNewMeeting({...newMeeting, startTime: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Waktu Selesai
                  </label>
                  <Input
                    type="time"
                    value={newMeeting.endTime}
                    onChange={(e) => setNewMeeting({...newMeeting, endTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Lokasi
                  </label>
                  <Input
                    value={newMeeting.location}
                    onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})}
                    placeholder="Ruang meeting atau lokasi"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Prioritas
                  </label>
                  <Select value={newMeeting.priority} onValueChange={(value) => setNewMeeting({...newMeeting, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih prioritas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Participants
                </label>
                <Textarea
                  value={newMeeting.participants}
                  onChange={(e) => setNewMeeting({...newMeeting, participants: e.target.value})}
                  placeholder="Daftar peserta meeting (pisahkan dengan koma)"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Agenda
                </label>
                <Textarea
                  value={newMeeting.agenda}
                  onChange={(e) => setNewMeeting({...newMeeting, agenda: e.target.value})}
                  placeholder="Agenda dan topik yang akan dibahas"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Deskripsi
                </label>
                <Textarea
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                  placeholder="Deskripsi detail meeting"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleAddMeeting}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!newMeeting.title || !newMeeting.type || !newMeeting.date}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Jadwalkan Meeting
                </Button>
                <Button 
                  onClick={() => setShowAddForm(false)}
                  variant="outline"
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Pencarian
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari meeting atau agenda..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Jenis Meeting
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua jenis</SelectItem>
                    {meetingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meetings List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Meeting ({filteredMeetings.length} meeting)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMeetings.map((meeting) => {
                const TypeIcon = getTypeIcon(meeting.type);
                return (
                  <div key={meeting.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <TypeIcon className="w-5 h-5 text-gray-600" />
                          <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                          <Badge className={getTypeColor(meeting.type)}>
                            {meetingTypes.find(t => t.value === meeting.type)?.label}
                          </Badge>
                          <Badge className={getStatusColor(meeting.status)}>
                            {meeting.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getPriorityColor(meeting.priority)}>
                            {meeting.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-1">
                            <p className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {meeting.date} | {meeting.startTime} - {meeting.endTime}
                            </p>
                            <p className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {meeting.location}
                            </p>
                            <p className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {meeting.participants.length} participants
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-700 font-medium mb-1">Agenda:</p>
                            <p className="text-gray-600">{meeting.agenda}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {meeting.status === 'scheduled' && (
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Video className="w-4 h-4 mr-2" />
                            Join
                          </Button>
                        )}
                      </div>
                    </div>

                    {meeting.status === 'completed' && meeting.meetingNotes && (
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <h4 className="font-medium text-green-900 mb-2">Meeting Notes:</h4>
                        <p className="text-green-800 text-sm">{meeting.meetingNotes}</p>
                      </div>
                    )}

                    {meeting.actionItems && meeting.actionItems.length > 0 && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <h4 className="font-medium text-blue-900 mb-2">Action Items:</h4>
                        <ul className="text-blue-800 text-sm space-y-1">
                          {meeting.actionItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {meeting.attachments && meeting.attachments.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        <span>Attachments: {meeting.attachments.join(', ')}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredMeetings.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Tidak ada meeting yang sesuai dengan filter</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
