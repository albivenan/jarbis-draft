import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/formatters';
import { AlertCircle } from 'lucide-react';

interface TambahModalAwalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (sourceId: number, amount: number) => void;
    selectedSourceId: number | null;
    sourceName: string;
}

export const TambahModalAwalModal = ({ isOpen, onClose, onSubmit, selectedSourceId, sourceName }: TambahModalAwalModalProps) => {
    const [amount, setAmount] = useState<string>('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (selectedSourceId !== null && amount) {
            // Strip all non-numeric characters except for a potential comma decimal separator
            const cleanedAmount = amount.replace(/[^0-9,]/g, '');
            const numericAmount = parseFloat(cleanedAmount.replace(',', '.'));

            if (!isNaN(numericAmount) && numericAmount > 0) {
                onSubmit(selectedSourceId, numericAmount);
                setAmount(''); // Reset amount after submission
            } else {
                alert('Jumlah modal awal tidak valid.');
            }
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Keep only digits and the first comma
        let cleanedValue = value.replace(/[^0-9,]/g, '');
        const firstComma = cleanedValue.indexOf(',');
        if (firstComma !== -1) {
            const afterComma = cleanedValue.substring(firstComma + 1).replace(/,/g, '');
            cleanedValue = cleanedValue.substring(0, firstComma + 1) + afterComma;
        }
        setAmount(cleanedValue);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Tambah Modal Awal {sourceName}</h2>
                <div className="flex items-center text-sm text-yellow-600 mb-4">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <p>Input modal awal hanya dilakukan satu kali untuk sumber dana ini.</p>
                </div>
                <div className="mb-4">
                    <Label htmlFor="amount">Jumlah Modal Awal (Rupiah)</Label>
                    <Input
                        id="amount"
                        type="text" // Use text to handle custom formatting
                        placeholder="Contoh: 1.000.000,00"
                        value={amount}
                        onChange={handleAmountChange}
                        onBlur={() => {
                            // Format on blur
                            const numericValue = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
                            if (!isNaN(numericValue)) {
                                setAmount(formatCurrency(numericValue));
                            }
                        }}
                        className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Format: 1.000.000,00</p>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    <Button onClick={handleSubmit} disabled={!amount || selectedSourceId === null}>Tambah Modal</Button>
                </div>
            </div>
        </div>
    );
};
