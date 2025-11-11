import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Calendar, 
  Search, 
  Download, 
  Mail,
  FileText,
  Eye,
  X,
  Loader2
} from 'lucide-react';

interface Employee {
  id_karyawan: string; // Assuming string for consistency with NIK
  nik_perusahaan: string;
  nama_lengkap: string;
  departemen: string;
  jabatan: string;
  lastSalary: number;
  lastPaymentDate: string;
}

interface SalarySlip {
  employeeId: string;
  employeeName: string;
  nik: string;
  department: string;
  position: string;
  period: string;
  gajiPokok: number;
  tunjanganTransport: number;
  tunjanganMakan: number;
  tunjanganLembur: number;
  potonganTerlambat: number;
  potonganAlpa: number;
  potonganBPJS: number;
  totalTunjangan: number;
  totalPotongan: number;
  totalGaji: number;
  paymentDate: string;
  paymentMethod: string;
}

export default function RiwayatPenggajianPage() {
  const [selectedPeriod, setSelectedPeriod] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedSalarySlip, setSelectedSalarySlip] = useState<SalarySlip | null>(null);
  const [isSlipLoading, setIsSlipLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const departments = ['all', 'Produksi Kayu', 'Produksi Besi', 'QC', 'PPIC', 'HRD', 'Keuangan'];
  const positions = ['all', 'Crew Besi', 'Crew Kayu', 'Supervisor', 'QC Inspector', 'Staff', 'Manager'];

  const handleViewSlip = async (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsSlipLoading(true);
    setShowSlipModal(true); // Open modal immediately with loading state
    try {
      const response = await fetch(route('api.hrd.payroll.slip', { employeeId: employee.id_karyawan, period: selectedPeriod }));
      const result = await response.json();
      if (result.success) {
        setSelectedSalarySlip(result.data);
      } else {
        console.error('Failed to fetch salary slip:', result.message);
        setSelectedSalarySlip(null);
      }
    } catch (error) {
      console.error('Error fetching salary slip:', error);
      setSelectedSalarySlip(null);
    } finally {
      setIsSlipLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedSalarySlip) return;
    try {
      const response = await fetch(route('api.hrd.payroll.download-slip', { employeeId: selectedSalarySlip.employeeId, period: selectedSalarySlip.period }));
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `slip_gaji_${selectedSalarySlip.employeeName}_${selectedSalarySlip.period}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        // Optionally, show a success toast
      } else {
        // Handle error, e.g., show a toast
        console.error('Failed to download PDF:', response.statusText);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handleEmailSlip = async () => {
    if (!selectedSalarySlip) return;
    try {
      const response = await fetch(route('api.hrd.payroll.email-slip'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content },
        body: JSON.stringify({ employeeId: selectedSalarySlip.employeeId, period: selectedSalarySlip.period }),
      });
      const result = await response.json();
      if (result.success) {
        // Optionally, show a success toast
        console.log('Email sent successfully:', result.message);
      } else {
        // Handle error, e.g., show a toast
        console.error('Failed to send email:', result.message);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const filteredEmployees = employees; // Now 'employees' is already filtered by the backend

  return (
    <AuthenticatedLayout
      title="Riwayat Penggajian"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-hrd' },
        { title: 'Manajemen Penggajian', href: '#' },
        { title: 'Riwayat Penggajian', href: '/roles/manajer-hrd/penggajian/riwayat' }
      ]}
    >
      <Head title="Riwayat Penggajian - Manajer HRD" />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Riwayat Penggajian</h1>
          <p className="text-muted-foreground">
            Lihat riwayat penggajian karyawan dan slip gaji
          </p>
        </div>

        {/* Period Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <label className="text-sm font-medium">Periode:</label>
                <input
                  type="month"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari berdasarkan nama, NIK, atau ID karyawan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Pilih Departemen" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept: string) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === 'all' ? 'Semua Departemen' : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Pilih Jabatan" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos: string) => (
                    <SelectItem key={pos} value={pos}>
                      {pos === 'all' ? 'Semua Jabatan' : pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employee List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Daftar Karyawan - {new Date(selectedPeriod + '-01').toLocaleDateString('id-ID', {
                month: 'long',
                year: 'numeric'
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">NIK Perusahaan</th>
                    <th className="text-left p-3 font-semibold">Nama</th>
                    <th className="text-left p-3 font-semibold">Departemen</th>
                    <th className="text-left p-3 font-semibold">Jabatan</th>
                    <th className="text-right p-3 font-semibold">Gaji Terakhir</th>
                    <th className="text-center p-3 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        Memuat data...
                      </td>
                    </tr>
                  ) : filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee: Employee) => (
                      <tr 
                        key={employee.id_karyawan} 
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleViewSlip(employee)}
                      >
                        <td className="p-3 font-mono text-sm">{employee.nik_perusahaan}</td>
                        <td className="p-3 font-medium">{employee.nama_lengkap}</td>
                        <td className="p-3">{employee.departemen}</td>
                        <td className="p-3">{employee.jabatan}</td>
                        <td className="p-3 text-right font-semibold">
                          Rp {employee.lastSalary.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewSlip(employee);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Lihat Slip
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        Tidak ada data penggajian untuk periode yang dipilih
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>Klik pada baris karyawan untuk melihat slip gaji lengkap</p>
            </div>
          </CardContent>
        </Card>

        {/* Slip Gaji Modal */}
        <SlipGajiModal
          open={showSlipModal}
          onClose={() => {
            setShowSlipModal(false);
            setSelectedSalarySlip(null); // Clear selected slip on close
          }}
          salarySlip={selectedSalarySlip}
          isLoading={isSlipLoading}
          onDownload={handleDownloadPDF}
          onEmail={handleEmailSlip}
        />
      </div>
    </AuthenticatedLayout>
  );
}

// Slip Gaji Modal Component
interface SlipGajiModalProps {
  open: boolean;
  onClose: () => void;
  salarySlip: SalarySlip | null;
  isLoading: boolean;
  onDownload: () => void;
  onEmail: () => void;
}

function SlipGajiModal({ open, onClose, salarySlip, isLoading, onDownload, onEmail }: SlipGajiModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Slip Gaji Karyawan
          </DialogTitle>
          <DialogDescription>
            {isLoading ? 'Memuat slip gaji...' : salarySlip ? `Detail slip gaji untuk periode ${new Date(salarySlip.period + '-01').toLocaleDateString('id-ID', {
              month: 'long',
              year: 'numeric'
            })}` : 'Slip gaji tidak ditemukan.'}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="ml-2 text-gray-600">Memuat slip gaji...</p>
          </div>
        ) : salarySlip ? (
          <div className="space-y-6">
            {/* Employee Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nama Karyawan</p>
                  <p className="font-semibold">{salarySlip.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ID Karyawan</p>
                  <p className="font-mono font-semibold">{salarySlip.employeeId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">NIK</p>
                  <p className="font-mono">{salarySlip.nik}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jabatan</p>
                  <p>{salarySlip.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Departemen</p>
                  <p>{salarySlip.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tanggal Pembayaran</p>
                  <p>{new Date(salarySlip.paymentDate).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            </div>

            {/* Salary Details */}
            <div className="space-y-4">
              {/* Gaji Pokok */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Gaji Pokok</h4>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Gaji Pokok</span>
                  <span className="font-semibold">
                    Rp {salarySlip.gajiPokok.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Tunjangan */}
              <div>
                <h4 className="font-semibold mb-3 text-green-700">Tunjangan</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span>Tunjangan Transport</span>
                    <span className="font-semibold text-green-700">
                      Rp {salarySlip.tunjanganTransport.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span>Tunjangan Makan</span>
                    <span className="font-semibold text-green-700">
                      Rp {salarySlip.tunjanganMakan.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span>Tunjangan Lembur</span>
                    <span className="font-semibold text-green-700">
                      Rp {salarySlip.tunjanganLembur.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg border border-green-300">
                    <span className="font-medium">Total Tunjangan</span>
                    <span className="font-bold text-green-700">
                      Rp {salarySlip.totalTunjangan.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Potongan */}
              <div>
                <h4 className="font-semibold mb-3 text-red-700">Potongan</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span>Potongan Terlambat</span>
                    <span className="font-semibold text-red-700">
                      Rp {salarySlip.potonganTerlambat.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span>Potongan Alpa</span>
                    <span className="font-semibold text-red-700">
                      Rp {salarySlip.potonganAlpa.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span>Potongan BPJS</span>
                    <span className="font-semibold text-red-700">
                      Rp {salarySlip.potonganBPJS.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-100 rounded-lg border border-red-300">
                    <span className="font-medium">Total Potongan</span>
                    <span className="font-bold text-red-700">
                      Rp {salarySlip.totalPotongan.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Gaji */}
              <div className="flex justify-between items-center p-4 bg-blue-100 rounded-lg border-2 border-blue-300">
                <span className="text-lg font-bold text-blue-900">Total Gaji Bersih</span>
                <span className="text-2xl font-bold text-blue-900">
                  Rp {salarySlip.totalGaji.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>Metode Pembayaran:</strong> {salarySlip.paymentMethod}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Tanggal Pembayaran:</strong> {new Date(salarySlip.paymentDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={onDownload} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={onEmail} variant="outline" className="flex-1">
                <Mail className="h-4 w-4 mr-2" />
                Kirim via Email
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-48 text-gray-500">
            <X className="h-6 w-6 mr-2" />
            Slip gaji tidak dapat dimuat.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
