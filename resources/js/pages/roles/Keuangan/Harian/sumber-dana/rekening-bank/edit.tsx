import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RekeningBank {
    id: number;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
}

interface EditRekeningBankPageProps {
    rekeningBank: RekeningBank;
}

export default function EditRekeningBankPage({ rekeningBank }: EditRekeningBankPageProps) {
  const { data, setData, put, processing, errors } = useForm({
    bankName: rekeningBank.bankName || '',
    accountNumber: rekeningBank.accountNumber || '',
    accountHolderName: rekeningBank.accountHolderName || '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    put(route('manajer-keuangan.harian.rekening-bank.update', rekeningBank.id));
  }

  return (
    <AuthenticatedLayout>
      <Head title="Edit Rekening Bank - Keuangan" />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Rekening Bank</h1>
          <p className="text-gray-600 mt-1">Perbarui detail rekening bank.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Formulir Rekening Bank</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="bankName">Nama Bank</Label>
                <Input
                  id="bankName"
                  value={data.bankName}
                  onChange={(e) => setData('bankName', e.target.value)}
                />
                {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
              </div>
              <div>
                <Label htmlFor="accountNumber">Nomor Rekening</Label>
                <Input
                  id="accountNumber"
                  value={data.accountNumber}
                  onChange={(e) => setData('accountNumber', e.target.value)}
                />
                {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
              </div>
              <div>
                <Label htmlFor="accountHolderName">Atas Nama</Label>
                <Input
                  id="accountHolderName"
                  value={data.accountHolderName}
                  onChange={(e) => setData('accountHolderName', e.target.value)}
                />
                {errors.accountHolderName && <p className="text-red-500 text-xs mt-1">{errors.accountHolderName}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                  <Link href={route('manajer-keuangan.harian.rekening-bank.index')}>Batal</Link>
                </Button>
                <Button type="submit" disabled={processing}>Simpan</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
