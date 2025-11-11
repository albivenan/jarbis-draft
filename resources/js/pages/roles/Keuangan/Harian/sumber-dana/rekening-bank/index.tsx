import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react'; // Added useForm
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { useToast } from '@/hooks/use-toast';

interface RekeningBank {
    id: number;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    isConnected: boolean;
    balance: number;
    sumberDanaId: number;
    isMainAccount: boolean; // Added
}

interface RekeningBankPageProps {
    sumberDanaUrl: string;
    rekeningBank: RekeningBank[];
}

export default function RekeningBankPage({sumberDanaUrl, rekeningBank = []}: RekeningBankPageProps) {
  const { post } = useForm(); // Initialize useForm for post requests
  const { toast } = useToast(); // Initialize useToast

  const handleSetMainAccount = (sumberDanaId: number) => {
    post(route('keuangan.harian.rekening-bank.set-main', sumberDanaId), {
      onSuccess: () => {
        toast({
          title: "Berhasil!",
          description: "Rekening bank berhasil dijadikan utama dan saldo disimulasikan.",
        });
      },
      onError: (errors) => {
        toast({
          title: "Gagal!",
          description: errors.message || "Terjadi kesalahan saat mengatur rekening utama.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Rekening Bank - Keuangan" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <Link href={sumberDanaUrl}>
                <Button variant="outline">Kembali</Button>
            </Link>
            <Link href={route('keuangan.harian.rekening-bank.create')}>
              <Button>Tambah Rekening Bank</Button>
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rekeningBank.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{account.bankName}</span>
                  <div className="flex items-center gap-2">
                    {account.isMainAccount && (
                      <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Utama</span>
                    )}
                    {account.isConnected && (
                      <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Terkoneksi</span>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-700">
                    {account.isMainAccount && ( // Only show balance for main account
                        <div className="text-2xl font-bold mb-2">Saldo: {formatCurrency(account.balance)}</div>
                    )}
                  <p><strong>Nomor Rekening:</strong> {account.accountNumber}</p>
                  <p><strong>Atas Nama:</strong> {account.accountHolderName}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={route('keuangan.harian.rekening-bank.edit', account.sumberDanaId)}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  {!account.isMainAccount && ( // Show "Jadikan Utama" button if not main account
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSetMainAccount(account.sumberDanaId)}
                    >
                      Jadikan Utama
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" onClick={() => alert('Fitur Hapus belum diimplementasikan.')}>
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
