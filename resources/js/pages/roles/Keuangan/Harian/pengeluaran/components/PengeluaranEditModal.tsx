import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { JENIS_PENGELUARAN, jenisPengeluaranValues, JenisPengeluaran, STATUS_PENGELUARAN } from '../utils/constants';
import { Pengeluaran, FormValues } from '../hooks/usePengeluaranData';

interface PengeluaranEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingPengeluaran: Pengeluaran | null;
    formValues: FormValues;
    setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
    onSave: () => void;
}

export default function PengeluaranEditModal({
    isOpen,
    onClose,
    editingPengeluaran,
    formValues,
    setFormValues,
    onSave,
}: PengeluaranEditModalProps) {
    const isEdit = !!editingPengeluaran;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Input
                            id="description"
                            value={formValues.description}
                            onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount">Jumlah</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={formValues.amount}
                            onChange={(e) => setFormValues({ ...formValues, amount: Number(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="jenis_pengeluaran">Jenis Pengeluaran</Label>
                        <Select
                            value={formValues.jenis_pengeluaran}
                            onValueChange={(value: JenisPengeluaran) => setFormValues({ ...formValues, jenis_pengeluaran: value })}
                        >
                            <SelectTrigger id="jenis_pengeluaran">
                                <SelectValue placeholder="Pilih jenis pengeluaran" />
                            </SelectTrigger>
                            <SelectContent>
                                {jenisPengeluaranValues.map(jenis => (
                                    <SelectItem key={jenis} value={jenis}>{jenis}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="catatan">Catatan</Label>
                        <Textarea
                            id="catatan"
                            value={formValues.catatan || ''}
                            onChange={(e) => setFormValues({ ...formValues, catatan: e.target.value })}
                            placeholder="Catatan tambahan (opsional)"
                        />
                    </div>
                    {isEdit && <p className="text-sm text-muted-foreground">Anda hanya bisa mengedit data dalam 24 jam setelah input.</p>}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                    </DialogClose>
                    <Button onClick={onSave}>Simpan Perubahan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
