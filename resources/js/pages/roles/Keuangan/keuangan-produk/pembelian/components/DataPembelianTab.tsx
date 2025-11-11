import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Package, Calendar as CalendarIconLucide, CheckCircle, XCircle, ShieldX } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// --- TYPE DEFINITIONS ---

interface User {
    id: number;
    name: string;
}

interface SumberDana {
    id: number;
    name: string;
    saldo: number;
}

interface PurchaseItem {
    id: number;
    nama_item: string;
    jumlah: number;
    satuan: string;
    harga_satuan: number;
    total_harga_item: number;
    status_item: 'Pending' | 'Diterima' | 'Ditolak' | 'Diterima & Dibayar';
}

interface PurchaseBatch {
    id: number;
    nomor_batch: string;
    waktu_batch: string;
    status_batch: 'Pending' | 'Diajukan' | 'Disetujui' | 'Ditolak';
    status_pembayaran: 'Belum Dibayar' | 'Sudah Dibayar' | 'Pembayaran Ditolak';
    total_harga_batch: number;
    catatan?: string;
    dibuat_oleh: User;
    disetujui_oleh?: User;
    sumber_dana?: SumberDana;
    items: PurchaseItem[];
}

interface DataPembelianTabProps {
    batches: PurchaseBatch[];
    sumberDanas: SumberDana[];
    formatCurrency: (amount: number) => string;
    onItemStatusChange: (itemId: number, newStatus: 'Diterima' | 'Ditolak') => void;
    onSubmitBatch: (batchId: number) => void;
    onRejectBatch: (batchId: number) => void;
    onProcessPayment: (batchId: number, sumberDanaId: number) => void;
}

// --- PAYMENT SECTION COMPONENT ---

const PaymentSection = ({ batch, sumberDanas, formatCurrency, onProcessPayment }: {
    batch: PurchaseBatch;
    sumberDanas: SumberDana[];
    formatCurrency: (amount: number) => string;
    onProcessPayment: (batchId: number, sumberDanaId: number) => void;
}) => {
    const [selectedDanaId, setSelectedDanaId] = useState<number | null>(null);

    const totalAcceptedPrice = batch.items
        .filter(item => item.status_item === 'Diterima')
        .reduce((sum, item) => sum + item.total_harga_item, 0);

    return (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <h4 className="font-semibold mb-2">Proses Pembayaran Batch</h4>
            <div className="flex flex-col space-y-4 mb-4">
                <p className="text-sm font-medium">Pilih Sumber Dana:</p>
                <RadioGroup
                    onValueChange={(value) => setSelectedDanaId(Number(value))}
                    className="flex flex-wrap gap-4"
                >
                    {sumberDanas.map((sd) => {
                        const isSelected = selectedDanaId === sd.id;
                        const estimatedSaldo = isSelected ? sd.saldo - totalAcceptedPrice : sd.saldo;
                        const isInsufficient = isSelected && estimatedSaldo < 0;

                        return (
                            <div key={sd.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={sd.id.toString()} id={`sumber-dana-${sd.id}-${batch.id}`} />
                                <Label htmlFor={`sumber-dana-${sd.id}-${batch.id}`} className="flex flex-col">
                                    <span>{sd.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        Saldo: {formatCurrency(sd.saldo)}
                                    </span>
                                    {isSelected && (
                                        <span className={cn("text-xs", isInsufficient ? "text-red-500" : "text-green-600")}>
                                            Estimasi Sisa: {formatCurrency(estimatedSaldo)}
                                        </span>
                                    )}
                                </Label>
                            </div>
                        );
                    })}
                </RadioGroup>
                <div className="text-sm text-muted-foreground mt-2">
                    <p>Total Harga Item Diterima: <span className='font-bold'>{formatCurrency(totalAcceptedPrice)}</span></p>
                </div>
            </div>
            <div className="flex space-x-2">
                <Button
                    variant="default"
                    onClick={() => selectedDanaId && onProcessPayment(batch.id, selectedDanaId)}
                    disabled={!selectedDanaId || batch.status_pembayaran === 'Sudah Dibayar'}
                >
                    <CheckCircle className="mr-2 h-4 w-4" /> Bayar & Setujui Batch
                </Button>
            </div>
        </div>
    );
};


// --- MAIN TAB COMPONENT ---

export default function DataPembelianTab({
    batches,
    sumberDanas,
    formatCurrency,
    onItemStatusChange,
    onSubmitBatch,
    onRejectBatch,
    onProcessPayment,
}: DataPembelianTabProps) {

    return (
        <div className="space-y-6 mt-4">
            {batches.length > 0 ? (
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {batches.map((batch: PurchaseBatch) => {
                        const isPendingReview = batch.status_batch === 'Pending';
                        const isReadyForPayment = batch.status_batch === 'Diajukan';
                        const isCompleted = ['Disetujui', 'Ditolak'].includes(batch.status_batch);
                        const canSubmit = isPendingReview && batch.items.some(item => item.status_item === 'Diterima');

                        return (
                            <Card key={batch.id} className="overflow-hidden">
                                <AccordionItem value={`batch-${batch.id}`} className="border-b-0">
                                    <AccordionTrigger className="p-4 hover:bg-gray-50">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-4 text-left">
                                                <Package className="h-6 w-6 text-muted-foreground" />
                                                <div>
                                                    <h4 className="font-bold text-base text-gray-800">{batch.nomor_batch}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {format(new Date(batch.waktu_batch), 'dd MMMM yyyy', { locale: id })} oleh {batch.dibuat_oleh.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 pr-4">
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {formatCurrency(batch.total_harga_batch)}
                                                </span>
                                                <Badge variant={
                                                    batch.status_batch === 'Disetujui' ? 'default' :
                                                    batch.status_batch === 'Diajukan' ? 'secondary' :
                                                    batch.status_batch === 'Pending' ? 'outline' :
                                                    'destructive'
                                                }>
                                                    {batch.status_batch}
                                                </Badge>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="bg-gray-50/50 border-t">
                                        <div className="p-4">
                                            {isPendingReview && (
                                                <div className="mb-4 flex justify-end gap-2">
                                                    <Button variant="destructive" size="sm" onClick={() => onRejectBatch(batch.id)}>
                                                        <ShieldX className="mr-2 h-4 w-4" /> Tolak Seluruh Batch
                                                    </Button>
                                                    <Button onClick={() => onSubmitBatch(batch.id)} disabled={!canSubmit}>
                                                        Finalisasi & Ajukan Batch
                                                    </Button>
                                                </div>
                                            )}

                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Nama Barang</TableHead>
                                                        <TableHead>Jumlah</TableHead>
                                                        <TableHead>Harga Satuan</TableHead>
                                                        <TableHead>Harga Total</TableHead>
                                                        {isPendingReview && <TableHead className="w-[150px]">Aksi</TableHead>}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {batch.items.map((item: PurchaseItem) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell>
                                                                <Badge variant={
                                                                    item.status_item === 'Diterima' || item.status_item === 'Diterima & Dibayar' ? 'default' :
                                                                    item.status_item === 'Pending' ? 'secondary' :
                                                                    'destructive'
                                                                }>
                                                                    {item.status_item}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>{item.nama_item}</TableCell>
                                                            <TableCell>{item.jumlah} {item.satuan}</TableCell>
                                                            <TableCell>{formatCurrency(item.harga_satuan)}</TableCell>
                                                            <TableCell>{formatCurrency(item.total_harga_item)}</TableCell>
                                                            {isPendingReview && (
                                                                <TableCell>
                                                                    <div className="flex gap-2">
                                                                        <Button
                                                                            variant="default"
                                                                            size="sm"
                                                                            onClick={() => onItemStatusChange(item.id, 'Diterima')}
                                                                            disabled={item.status_item === 'Diterima'}
                                                                        >
                                                                            <CheckCircle className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="destructive"
                                                                            size="sm"
                                                                            onClick={() => onItemStatusChange(item.id, 'Ditolak')}
                                                                            disabled={item.status_item === 'Ditolak'}
                                                                        >
                                                                            <XCircle className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            )}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>

                                            {isReadyForPayment && (
                                                <PaymentSection
                                                    batch={batch}
                                                    sumberDanas={sumberDanas}
                                                    formatCurrency={formatCurrency}
                                                    onProcessPayment={onProcessPayment}
                                                />
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Card>
                        );
                    })}
                </Accordion>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    Tidak ada permintaan pembelian bahan baku yang perlu ditinjau.
                </div>
            )}
        </div>
    );
}
