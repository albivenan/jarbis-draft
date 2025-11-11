import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Smartphone as SmartphoneIcon } from 'lucide-react';

type AccountType = 'bank' | 'ewallet';

interface AccountFormData {
  type?: AccountType;
  name: string;
  accountNumber: string;
  accountName: string;
  isPrimary: boolean;
}

interface AccountFormProps {
  initialData?: AccountFormData;
  onCancel: () => void;
  onSubmit: (data: Omit<AccountFormData, 'type'> & { type: AccountType }) => void;
}

const bankOptions = [
  { value: 'BCA', label: 'BCA' },
  { value: 'Mandiri', label: 'Mandiri' },
  { value: 'BNI', label: 'BNI' },
  { value: 'BRI', label: 'BRI' },
  { value: 'CIMB Niaga', label: 'CIMB Niaga' },
];

const ewalletOptions = [
  { value: 'OVO', label: 'OVO' },
  { value: 'GoPay', label: 'GoPay' },
  { value: 'Dana', label: 'Dana' },
  { value: 'ShopeePay', label: 'ShopeePay' },
  { value: 'LinkAja', label: 'LinkAja' },
];

export default function AccountForm({ initialData, onCancel, onSubmit }: AccountFormProps) {
  const [type, setType] = useState<AccountType>(initialData?.type || 'bank');
  
  const { data, setData, processing, errors } = useForm<Omit<AccountFormData, 'type'>>({
    name: initialData?.name || '',
    accountNumber: initialData?.accountNumber || '',
    accountName: initialData?.accountName || '',
    isPrimary: initialData?.isPrimary || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...data,
      type: type,
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Rekening' : 'Tambah Rekening Baru'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipe Akun</Label>
              <Select 
                value={type} 
                onValueChange={(value: AccountType) => setType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe akun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">
                    <div className="flex items-center">
                      <Landmark className="h-4 w-4 mr-2" />
                      Bank
                    </div>
                  </SelectItem>
                  <SelectItem value="ewallet">
                    <div className="flex items-center">
                      <SmartphoneIcon className="h-4 w-4 mr-2" />
                      E-Wallet
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                {type === 'bank' ? 'Nama Bank' : 'Nama E-Wallet'}
              </Label>
              <Select 
                value={data.name}
                onValueChange={(value) => setData('name', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Pilih ${type === 'bank' ? 'bank' : 'e-wallet'}`} />
                </SelectTrigger>
                <SelectContent>
                  {(type === 'bank' ? bankOptions : ewalletOptions).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">
                {type === 'bank' ? 'Nomor Rekening' : 'Nomor HP/ID'}
              </Label>
              <Input
                id="accountNumber"
                type={type === 'bank' ? 'text' : 'tel'}
                value={data.accountNumber}
                onChange={(e) => setData('accountNumber', e.target.value)}
                placeholder={type === 'bank' ? 'Contoh: 1234567890' : 'Contoh: 081234567890'}
              />
              {errors.accountNumber && <p className="text-sm text-red-500">{errors.accountNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountName">Nama Pemilik</Label>
              <Input
                id="accountName"
                value={data.accountName}
                onChange={(e) => setData('accountName', e.target.value)}
                placeholder="Nama sesuai rekening"
              />
              {errors.accountName && <p className="text-sm text-red-500">{errors.accountName}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              id="isPrimary"
              checked={data.isPrimary}
              onChange={(e) => setData('isPrimary', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="isPrimary" className="text-sm font-medium">
              Jadikan sebagai akun utama untuk pembayaran gaji
            </Label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Batal
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
