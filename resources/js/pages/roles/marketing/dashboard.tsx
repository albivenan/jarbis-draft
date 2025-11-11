import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Mail,
  Share2,
  TrendingUp,
  Target,
  BarChart2,
  Calendar,
  Phone,
  MessageCircle
} from 'lucide-react';

interface DashboardProps {
  roleInfo?: {
    name: string;
    description: string;
  };
}

export default function Dashboard({ roleInfo }: DashboardProps) {
  const stats = [
    {
      title: 'Total Pelanggan',
      value: '1,247',
      unit: 'pelanggan',
      icon: Users,
      trend: '+15% bulan ini',
      color: 'text-blue-600'
    },
    {
      title: 'Lead Baru',
      value: '89',
      unit: 'lead',
      icon: Target,
      trend: '+23% minggu ini',
      color: 'text-green-600'
    },
    {
      title: 'Kampanye Aktif',
      value: '12',
      unit: 'kampanye',
      icon: Share2,
      trend: '8 email, 4 sosmed',
      color: 'text-purple-600'
    },
    {
      title: 'Conversion Rate',
      value: '18.5',
      unit: '%',
      icon: TrendingUp,
      trend: '+2.3% dari target',
      color: 'text-orange-600'
    }
  ];

  const recentLeads = [
    {
      id: 1,
      company: 'PT Konstruksi Jaya',
      contact: 'Budi Hartono',
      phone: '0812-3456-7890',
      product: 'Rangka Besi Custom',
      value: 'Rp 450.000.000',
      status: 'hot',
      source: 'Website'
    },
    {
      id: 2,
      company: 'CV Furniture Modern',
      contact: 'Siti Aminah',
      phone: '0821-9876-5432',
      product: 'Kayu Jati Premium',
      value: 'Rp 280.000.000',
      status: 'warm',
      source: 'Referral'
    },
    {
      id: 3,
      company: 'PT Properti Indah',
      contact: 'Ahmad Fauzi',
      phone: '0856-1234-5678',
      product: 'Pagar Besi Minimalis',
      value: 'Rp 125.000.000',
      status: 'cold',
      source: 'Social Media'
    }
  ];

  const campaignPerformance = [
    {
      name: 'Email Newsletter Januari',
      type: 'email',
      sent: 2500,
      opened: 875,
      clicked: 156,
      converted: 23,
      roi: '245%'
    },
    {
      name: 'Instagram Ads - Furniture',
      type: 'social',
      reach: 15000,
      engagement: 1200,
      clicks: 340,
      converted: 18,
      roi: '180%'
    },
    {
      name: 'Facebook Ads - Konstruksi',
      type: 'social',
      reach: 12000,
      engagement: 950,
      clicks: 280,
      converted: 15,
      roi: '165%'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'lead',
      message: 'Lead baru dari PT Konstruksi Jaya - Rp 450M',
      time: '15 menit lalu',
      status: 'new'
    },
    {
      id: 2,
      type: 'campaign',
      message: 'Kampanye email newsletter berhasil dikirim ke 2,500 kontak',
      time: '1 jam lalu',
      status: 'completed'
    },
    {
      id: 3,
      type: 'meeting',
      message: 'Meeting dengan CV Furniture Modern dijadwalkan',
      time: '2 jam lalu',
      status: 'scheduled'
    },
    {
      id: 4,
      type: 'conversion',
      message: 'PT ABC berhasil closing - Rp 320M',
      time: '3 jam lalu',
      status: 'success'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Dashboard Marketing"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/marketing' }
      ]}
    >
      <Head title="Dashboard Marketing" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Share2 className="h-8 w-8 text-purple-600" />
              Dashboard Marketing
            </h1>
            <p className="text-gray-600 mt-1">{roleInfo?.description || 'Mengelola pemasaran dan hubungan pelanggan'}</p>
          </div>
          <Badge variant="outline" className="text-purple-700 border-purple-300">
            Marketing Department
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <span className="text-sm text-gray-500">{stat.unit}</span>
                    </div>
                    <p className={`text-sm ${stat.color} font-medium`}>
                      {stat.trend}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Leads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Lead Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{lead.company}</h4>
                        <p className="text-sm text-gray-600">{lead.contact}</p>
                      </div>
                      <Badge 
                        variant={
                          lead.status === 'hot' ? 'destructive' : 
                          lead.status === 'warm' ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {lead.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                      <div>
                        <p className="text-gray-600">Produk</p>
                        <p className="font-medium">{lead.product}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Nilai</p>
                        <p className="font-medium text-green-600">{lead.value}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>📞 {lead.phone}</span>
                      <span>Sumber: {lead.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Campaign Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-blue-600" />
                Performa Kampanye
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignPerformance.map((campaign, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                      <div className="flex items-center gap-1">
                        {campaign.type === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                        {campaign.type === 'social' && <Share2 className="h-4 w-4 text-purple-600" />}
                        <Badge variant="outline" className="text-xs">
                          ROI: {campaign.roi}
                        </Badge>
                      </div>
                    </div>
                    {campaign.type === 'email' ? (
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="text-center">
                          <p className="text-gray-600">Sent</p>
                          <p className="font-semibold">{campaign.sent}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Opened</p>
                          <p className="font-semibold">{campaign.opened}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Clicked</p>
                          <p className="font-semibold">{campaign.clicked}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Converted</p>
                          <p className="font-semibold text-green-600">{campaign.converted}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="text-center">
                          <p className="text-gray-600">Reach</p>
                          <p className="font-semibold">{campaign.reach}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Engagement</p>
                          <p className="font-semibold">{campaign.engagement}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Clicks</p>
                          <p className="font-semibold">{campaign.clicks}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Converted</p>
                          <p className="font-semibold text-green-600">{campaign.converted}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className={`p-1 rounded-full ${
                    activity.status === 'new' ? 'bg-green-100' :
                    activity.status === 'completed' ? 'bg-blue-100' :
                    activity.status === 'scheduled' ? 'bg-orange-100' :
                    activity.status === 'success' ? 'bg-purple-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'lead' && <Target className="h-4 w-4 text-green-600" />}
                    {activity.type === 'campaign' && <Mail className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'meeting' && <Calendar className="h-4 w-4 text-orange-600" />}
                    {activity.type === 'conversion' && <TrendingUp className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors cursor-pointer">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-blue-900">CRM</p>
                <p className="text-sm text-blue-600">Kelola data pelanggan</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors cursor-pointer">
                <Mail className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-purple-900">Email Marketing</p>
                <p className="text-sm text-purple-600">Buat kampanye email</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors cursor-pointer">
                <Share2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-900">Media Sosial</p>
                <p className="text-sm text-green-600">Kelola konten sosmed</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition-colors cursor-pointer">
                <BarChart2 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="font-medium text-orange-900">Analitik</p>
                <p className="text-sm text-orange-600">Lihat laporan marketing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}