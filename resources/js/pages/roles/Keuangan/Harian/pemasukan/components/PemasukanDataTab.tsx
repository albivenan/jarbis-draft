import { Link } from '@inertiajs/react';
import React from 'react';
import { format, parseISO, differenceInHours } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { JENIS_PEMASUKAN, STATUS_PEMASUKAN } from '@/pages/roles/Keuangan/Harian/pemasukan/utils/constants';
import { formatCurrency } from '@/pages/roles/Keuangan/Harian/pemasukan/utils/formatters';
import { Pemasukan } from '@/pages/roles/Keuangan/Harian/pemasukan/hooks/usePemasukanData';
import { cn } from '@/lib/utils';


interface PemasukanDataTabProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedDate: Date | undefined;
    setSelectedDate: (date: Date | undefined) => void;
    filteredData: Pemasukan[];
    totalPemasukan: number;
    // handleEditClick: (pemasukan: Pemasukan) => void; // Removed
    handleDeleteClick: (id: number) => void;
}

const PemasukanDataTab: React.FC<PemasukanDataTabProps> = ({
    searchTerm,
    setSearchTerm,
    selectedDate,
    setSelectedDate,
    filteredData,
    totalPemasukan,
    // handleEditClick, // Removed
    handleDeleteClick,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Riwayat Pemasukan</CardTitle>
                <CardDescription>Daftar transaksi pemasukan berdasarkan tanggal yang dipilih.</CardDescription>
                <div className="flex items-center gap-4 pt-4">
                    <Input
                        placeholder="Cari deskripsi..."
                        className="max-w-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !selectedDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="border-t mt-4 pt-4">
                    <h3 className="text-lg font-semibold">Total Pemasukan (Hari Terpilih)</h3>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPemasukan)}</p>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">No.</TableHead>
                            <TableHead>Invoice/Bukti</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Jenis</TableHead>
                            <TableHead>Sumber Dana</TableHead> {/* Added */}
                            <TableHead>Status</TableHead>
                            <TableHead>Catatan</TableHead>
                            <TableHead>Jumlah</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => {
                                const isEditable = differenceInHours(new Date(), parseISO(item.created_at)) < 24;
                                                                return (<TableRow key={item.id}>
                                                                        <TableCell>{index + 1}</TableCell>
                                                                        <TableCell>
                                                                            {item.invoice_path ? (
                                                                                <a href={item.invoice_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                                                    Lihat Invoice
                                                                                </a>
                                                                            ) : (
                                                                                <span className="text-muted-foreground">Tidak Ada</span>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>{item.description}</TableCell>
                                                                        <TableCell>{item.jenis_pemasukan}</TableCell>
                                                                        <TableCell>{item.sumber_dana?.nama_sumber || '-'}</TableCell> {/* Added */}
                                                                        <TableCell>
                                                                            <Badge variant={item.status === STATUS_PEMASUKAN.FINAL ? 'default' : 'secondary'}>
                                                                                {item.status}
                                                                            </Badge>
                                                                        </TableCell>
                                                                        <TableCell>{item.catatan}</TableCell>
                                                                        <TableCell>{formatCurrency(item.amount)}</TableCell>
                                                                        <TableCell className="text-right">
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                                                        <span className="sr-only">Buka menu</span>
                                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end">
                                                                                    <DropdownMenuItem asChild>
                                                                                        <Link href={route('keuangan.harian.pemasukan.edit', item.id)}>
                                                                                            <Pencil className="mr-2 h-4 w-4" />
                                                                                            <span>Edit</span>
                                                                                        </Link>
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem disabled={!isEditable} onClick={() => handleDeleteClick(item.id)} className="text-red-600">
                                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                                        <span>Hapus</span>
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </TableCell>
                                                                    </TableRow>);
                            })
                        ) : (
                            <TableRow><TableCell colSpan={9} className="h-24 text-center"> {/* Changed from 8 to 9 */}
                                    Tidak ada data untuk tanggal ini.
                                </TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default PemasukanDataTab;
