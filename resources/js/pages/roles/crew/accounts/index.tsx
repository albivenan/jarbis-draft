import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Landmark as Bank, Smartphone as SmartphoneIcon, Check, ChevronRight, Info, X } from 'lucide-react';
import AccountForm from './AccountForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Kelola Rekening', href: '/employee/accounts' },
];

type AccountType = 'bank' | 'ewallet';

interface Account {
  id: string;
  type: AccountType;
  name: string;
  accountNumber: string;
  accountName: string;
  isPrimary: boolean;
  status: 'active' | 'inactive';
}

const AccountRow: React.FC<{
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  onSetPrimary: (id: string) => void;
  onStatusToggle: (id: string) => void;
}> = ({
  account,
  onEdit,
  onDelete,
  onSetPrimary,
  onStatusToggle,
}) => (
  <TableRow>
    <TableCell>
      <div className="flex items-center">
        {account.type === 'bank' ? (
          <Bank className="h-5 w-5 mr-2 text-blue-500" />
        ) : (
          <SmartphoneIcon className="h-5 w-5 mr-2 text-green-500" />
        )}
        <div>
          <div className="font-medium">{account.name}</div>
          <div className="text-sm text-muted-foreground">
            {account.type === 'bank' ? 'Bank' : 'E-Wallet'}
          </div>
        </div>
      </div>
    </TableCell>
    <TableCell>
      <div className="font-mono">{account.accountNumber}</div>
      <div className="text-sm text-muted-foreground">{account.accountName}</div>
    </TableCell>
    <TableCell>
      <Badge 
        variant={account.status === 'active' ? 'default' : 'secondary'}
        className="cursor-pointer"
        onClick={() => onStatusToggle(account.id)}
      >
        {account.status === 'active' ? 'Aktif' : 'Nonaktif'}
      </Badge>
    </TableCell>
    <TableCell>
      {account.isPrimary ? (
        <div className="flex items-center text-green-600 dark:text-green-400">
          <Check className="h-4 w-4 mr-1" />
          <span className="text-sm">Utama</span>
        </div>
      ) : (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onSetPrimary(account.id)}
          disabled={account.status === 'inactive'}
        >
          Jadikan Utama
        </Button>
      )}
    </TableCell>
    <TableCell className="text-right">
      <div className="flex justify-end space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onEdit(account)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-red-500 hover:text-red-700"
          onClick={() => onDelete(account.id)}
          disabled={account.isPrimary}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

const AccountManagement: React.FC = () => {
  // Dummy data
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      type: 'bank',
      name: 'BCA',
      accountNumber: '1234567890',
      accountName: 'John Doe',
      isPrimary: true,
      status: 'active'
    },
    {
      id: '2',
      type: 'bank',
      name: 'Mandiri',
      accountNumber: '9876543210',
      accountName: 'John Doe',
      isPrimary: false,
      status: 'active'
    },
    {
      id: '3',
      type: 'ewallet',
      name: 'OVO',
      accountNumber: '081234567890',
      accountName: 'John Doe',
      isPrimary: false,
      status: 'inactive'
    }
  ]);

  const handleSetPrimary = (id: string) => {
    setAccounts(accounts.map(account => ({
      ...account,
      isPrimary: account.id === id
    })));
  };

  const handleDelete = (id: string) => {
    if (accounts.find(acc => acc.id === id)?.isPrimary) {
      alert('Tidak dapat menghapus akun utama. Harap atur akun lain sebagai utama terlebih dahulu.');
      return;
    }
    if (window.confirm('Apakah Anda yakin ingin menghapus akun ini?')) {
      setAccounts(accounts.filter(account => account.id !== id));
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleStatusToggle = (id: string) => {
    setAccounts(accounts.map(account => 
      account.id === id 
        ? { 
            ...account, 
            status: account.status === 'active' ? 'inactive' : 'active' 
          } 
        : account
    ));
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowForm(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingAccount) {
      // Update existing account
      setAccounts(accounts.map(account => 
        account.id === editingAccount.id 
          ? { ...account, ...data, type: data.type || account.type }
          : data.isPrimary ? { ...account, isPrimary: false } : account
      ));
    } else {
      // Add new account
      const newAccount: Account = {
        id: Date.now().toString(),
        ...data,
        status: 'active',
      };
      setAccounts([
        ...accounts.map(account => 
          data.isPrimary ? { ...account, isPrimary: false } : account
        ),
        newAccount
      ]);
    }
    setShowForm(false);
  };

  // Calculate statistics
  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter(a => a.status === 'active').length;
  const primaryAccount = accounts.find(a => a.isPrimary);
  const bankAccounts = accounts.filter(a => a.type === 'bank');
  const ewalletAccounts = accounts.filter(a => a.type === 'ewallet');

  // Dummy data for salary slips
  const salarySlips = [
    { id: 1, month: 'Januari 2024', status: 'paid', amount: 5000000 },
    { id: 2, month: 'Februari 2024', status: 'paid', amount: 5000000 },
    { id: 3, month: 'Maret 2024', status: 'paid', amount: 5000000 },
  ];

  const totalSalarySlips = salarySlips.length;
  const totalEarnings = salarySlips.reduce((sum, slip) => sum + slip.amount, 0);

  return (
    <AuthenticatedLayout>
      <Head title="Kelola Rekening" />
      <div className="container mx-auto px-4 py-6 space-y-6">
        

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Daftar Rekening</h1>
              <p className="text-sm text-muted-foreground">
                Kelola akun bank dan e-wallet untuk pembayaran gaji
              </p>
            </div>
            <Button onClick={handleAddAccount} disabled={showForm}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Rekening
            </Button>
        </div>

        {/* Header Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Primary Account Card */}
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Rekening Utama
              </CardTitle>
            </CardHeader>
            <CardContent>
              {primaryAccount ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      {primaryAccount.type === 'bank' ? (
                        <Bank className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                      ) : (
                        <SmartphoneIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{primaryAccount.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {primaryAccount.accountNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={primaryAccount.status === 'active' ? 'default' : 'secondary'}>
                      {primaryAccount.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-2">Belum ada rekening utama</p>
                  <Button size="sm" onClick={handleAddAccount}>
                    Tambah Rekening Utama
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Salary Slips Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Ringkasan Slip Gaji
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Slip Gaji</p>
                  <p className="text-2xl font-bold">{totalSalarySlips}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                  <p className="text-2xl font-bold text-green-600">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(totalEarnings)}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="/employee/payroll/history">
                  Lihat Semua Slip Gaji <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="bank">Bank</TabsTrigger>
            <TabsTrigger value="ewallet">E-Wallet</TabsTrigger>
            <TabsTrigger value="inactive" className="hidden sm:flex">Nonaktif</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Daftar Semua Rekening</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span>{activeAccounts} Aktif</span>
                    </div>
                    <span>•</span>
                    <span>Total: {totalAccounts} Akun</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Nama Bank/E-Wallet</TableHead>
                      <TableHead>Nomor Rekening</TableHead>
                      <TableHead>Nama Pemilik</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Utama</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>
                          <div className="flex items-center">
                            {account.type === 'bank' ? (
                              <Bank className="h-5 w-5 mr-2 text-blue-500" />
                            ) : (
                              <SmartphoneIcon className="h-5 w-5 mr-2 text-green-500" />
                            )}
                            {account.type === 'bank' ? 'Bank' : 'E-Wallet'}
                          </div>
                        </TableCell>
                        <TableCell>{account.name}</TableCell>
                        <TableCell>{account.accountNumber}</TableCell>
                        <TableCell>{account.accountName}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={account.status === 'active' ? 'default' : 'secondary'}
                            className="cursor-pointer"
                            onClick={() => handleStatusToggle(account.id)}
                          >
                            {account.status === 'active' ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {account.isPrimary ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleSetPrimary(account.id)}
                            >
                              Jadikan Utama
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditAccount(account)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDelete(account.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {showForm && (
              <AccountForm
                initialData={editingAccount || undefined}
                onCancel={() => setShowForm(false)}
                onSubmit={handleFormSubmit}
              />
            )}
          </TabsContent>
        </Tabs>

    
      </div>
    </div>
    </AuthenticatedLayout>
  );
};

export default AccountManagement;

