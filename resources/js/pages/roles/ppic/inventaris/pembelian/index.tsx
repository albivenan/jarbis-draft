import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Clock, CheckCircle, ShoppingCart, Package, Truck, XCircle, Calendar as CalendarIconLucide, Search, Filter, RotateCcw } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

// --- TYPES ---
interface PurchaseRequestItem {
  id: number;
  nama_item: string;
  jumlah: number;
  satuan: string;
  status_item: string;
}

interface PurchaseRequest {
  id: number;
  nomor_batch: string;
  waktu_batch: string;
  dibuat_oleh: { name: string };
  status_batch: 'Pending' | 'Diajukan' | 'Disetujui' | 'Ditolak';
  items: PurchaseRequestItem[];
  total_harga_batch: number;
  diajukan_pada?: string | null; // New field
  direspon_pada?: string | null; // New field
  dibayar_pada?: string | null; // New field
}

interface PageProps {
    purchaseRequests: {
        data: PurchaseRequest[];
        links: any[];
        meta: any;
    };
    filters: {
        date?: string;
        search?: string;
        status?: string;
    };
    auth: any;
    errors: any;
    ziggy: any;
    flash: any;
    [key: string]: any;
}

// --- HELPER FUNCTIONS ---
const getStatusInfo = (status: string): { text: string; className: string; icon: React.ElementType } => {
  switch (status) {
    case 'Pending': return { text: 'Menunggu Persetujuan', className: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock };
    case 'Diajukan': return { text: 'Diajukan Keuangan', className: 'bg-blue-100 text-blue-800 border-blue-300', icon: CheckCircle };
    case 'Disetujui': return { text: 'Disetujui & Dibayar', className: 'bg-green-100 text-green-800 border-green-300', icon: Package };
    case 'Ditolak': return { text: 'Ditolak Keuangan', className: 'bg-red-100 text-red-800 border-red-300', icon: XCircle };
    default: return { text: status, className: 'bg-gray-100 text-gray-800 border-gray-300', icon: FileText };
  }
};

const getItemStatusInfo = (status: string): { text: string; className: string } => {
  switch (status) {
    case 'Pending': return { text: 'Pending', className: 'bg-gray-100 text-gray-700' };
    case 'Diterima': return { text: 'Diterima', className: 'bg-blue-100 text-blue-700' };
    case 'Ditolak': return { text: 'Ditolak', className: 'bg-red-100 text-red-700' };
    case 'Diterima & Dibayar': return { text: 'Diterima & Dibayar', className: 'bg-green-100 text-green-700' };
    default: return { text: status, className: 'bg-gray-100 text-gray-700' };
  }
};

// --- MAIN COMPONENT ---
export default function PermintaanPembelian() {
    const { purchaseRequests, filters } = usePage<PageProps>().props;

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        filters.date ? parseISO(filters.date) : new Date() // Default to current date
    );
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Effect to apply filters
    useEffect(() => {
        const queryParams = new URLSearchParams();
        if (selectedDate) {
            queryParams.append('date', format(selectedDate, 'yyyy-MM-dd'));
        }
        if (searchTerm) {
            queryParams.append('search', searchTerm);
        }
        if (selectedStatus !== 'all') {
            queryParams.append('status', selectedStatus);
        }

        router.get(route('ppic.inventaris.pembelian.index'), Object.fromEntries(queryParams.entries()), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [selectedDate, searchTerm, selectedStatus]);

    const handleResetFilters = () => {
        setSelectedDate(undefined);
        setSearchTerm('');
        setSelectedStatus('all');
    };

    const summaryStats = useMemo(() => {
        const allRequests = purchaseRequests.data;
        return {
            pending: allRequests.filter(pr => pr.status_batch === 'Pending').length,
            processing: allRequests.filter(pr => pr.status_batch === 'Diajukan').length,
            completed: allRequests.filter(pr => pr.status_batch === 'Disetujui').length,
        };
    }, [purchaseRequests.data]);

  return (
    <AuthenticatedLayout
      title="Permintaan Pembelian"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/ppic' },
        { title: 'Manajemen Inventaris', href: '#' },
        { title: 'Permintaan Pembelian', href: route('ppic.inventaris.pembelian.index') }
      ]}
    >
      <Head title="Permintaan Pembelian - PPIC" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Permintaan Pembelian
            </h1>
            <p className="text-gray-600 mt-1">Buat dan lacak status permintaan pembelian material.</p>
          </div>
          <Link href={route('ppic.inventaris.pembelian.create')}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Buat Permintaan Baru
              </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Menunggu Persetujuan</p>
                  <p className="text-2xl font-bold text-yellow-600">{summaryStats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sedang Diproses</p>
                  <p className="text-2xl font-bold text-blue-600">{summaryStats.processing}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Selesai</p>
                  <p className="text-2xl font-bold text-green-600">{summaryStats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Permintaan Pembelian</CardTitle>
            <p className="text-sm text-gray-500">Klik pada setiap permintaan untuk melihat detail item.</p>
            <div className="flex flex-wrap items-center gap-4 mt-4">
                <Input
                    placeholder="Cari nama material..."
                    className="max-w-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[200px] justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIconLucide className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                setSelectedDate(date);
                                setIsCalendarOpen(false);
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="Pending">Menunggu Persetujuan</SelectItem>
                        <SelectItem value="Diajukan">Diajukan Keuangan</SelectItem>
                        <SelectItem value="Disetujui">Disetujui & Dibayar</SelectItem>
                        <SelectItem value="Ditolak">Ditolak Keuangan</SelectItem>
                    </SelectContent>
                </Select>
                {(selectedDate || searchTerm || selectedStatus !== 'all') && (
                    <Button variant="outline" onClick={handleResetFilters}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Reset Filter
                    </Button>
                )}
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {purchaseRequests.data.map((request) => {
                const statusInfo = getStatusInfo(request.status_batch);
                const StatusIcon = statusInfo.icon;

                return (
                  <AccordionItem value={request.nomor_batch} key={request.id}>
                    <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-lg">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4 text-left">
                          <StatusIcon className={`h-6 w-6 ${statusInfo.className.split(' ')[1]}`} />
                          <div>
                            <h4 className="font-bold text-base text-gray-800">{request.nomor_batch}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(request.waktu_batch).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pr-4">
                           <span className="text-sm font-semibold text-gray-700">
                             Rp {request.total_harga_batch.toLocaleString('id-ID')}
                           </span>
                           <Badge className={`${statusInfo.className} border`}>{statusInfo.text}</Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-gray-50/50 border-b border-t">
                      <div className="p-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]">No</TableHead>
                              <TableHead>Nama Material</TableHead>
                              <TableHead>Jumlah</TableHead>
                              <TableHead>Satuan</TableHead>
                              <TableHead>Status Item</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {request.items.map((item, index) => {
                              const itemStatusInfo = getItemStatusInfo(item.status_item);
                              return (
                                <TableRow key={item.id}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell className="font-medium">{item.nama_item}</TableCell>
                                  <TableCell>{item.jumlah}</TableCell>
                                  <TableCell>{item.satuan}</TableCell>
                                  <TableCell>
                                    <Badge variant="secondary" className={itemStatusInfo.className}>
                                      {itemStatusInfo.text}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
