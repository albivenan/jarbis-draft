import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Building,
  User,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Download,
  History
} from 'lucide-react';

export default function Rekening() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAccountNumbers, setShowAccountNumbers] = useState<{[key: string]: boolean}>({});
  const [newAccount, setNewAccount] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    accountType: '',
    isPrimary: false
  });

  const bankAccounts = [
    {
      id: 'ACC-001',
      bankName: 'Bank Central Asia (BCA)',
      bankCode: 'BCA',
      accountNumber: '1234567890',
      accountName: 'Ahmad Supervisor',
      accountType: 'Tabungan',
      isPrimary: true,
      isActive: true,
      addedDate: '2020-01-15',
      lastUsed: '2025-01-05',
      purpose: 'Gaji Utama',
      balance: 25750000, // This would normally come from bank API
      monthlyTransactions: 8
    },
    {
      id: 'ACC-002',
      bankName: 'Bank Mandiri',
      bankCode: 'MANDIRI',
      accountNumber: '9876543210',
      accountName: 'Ahmad Supervisor',
      accountType: 'Tabungan',
      isPrimary: false,
      isActive: true,
      addedDate: '2022-03-10',
      lastUsed: '2024-12-20',
      purpose: 'Tabungan Pribadi',
      balance: 15200000,
      monthlyTransactions: 3
    },
    {
      id: 'ACC-003',
      bankName: 'Bank Rakyat Indonesia (BRI)',
      bankCode: 'BRI',
      accountNumber: '5555666677',
      accountName: 'Ahmad Supervisor',
      accountType: 'Giro',
      isPrimary: false,
      isActive: false,
      addedDate: '2021-08-22',
      lastUsed: '2023-11-15',
      purpose: 'Bisnis Sampingan',
      balance: 850000,
      monthlyTransactions: 0
    }
  ];

  const bankOptions = [
    { value: 'BCA', label: 'Bank Central Asia (BCA)' },
    { value: 'MANDIRI', label: 'Bank Mandiri' },
    { value: 'BRI', label: 'Bank Rakyat Indonesia (BRI)' },
    { value: 'BNI', label: 'Bank Negara Indonesia (BNI)' },
    { value: 'CIMB', label: 'CIMB Niaga' },
    { value: 'DANAMON', label: 'Bank Danamon' },
    { value: 'PERMATA', label: 'Bank Permata' },
    { value: 'OCBC', label: 'OCBC NISP' }
  ];

  const accountTypeOptions = [
    { value: 'tabungan', label: 'Tabungan' },
    { value: 'giro', label: 'Giro' },
    { value: 'deposito', label: 'Deposito' }
  ];

  const recentTransactions = [
    {
      id: 'TRX-001',
      date: '2025-01-05',
      type: 'credit',
      description: 'Gaji Januari 2025',
      amount: 11015000,
      accountId: 'ACC-001',
      bankName: 'BCA'
    },
    {
      id: 'TRX-002',
      date: '2025-01-03',
      type: 'debit',
      description: 'Transfer ke Tabungan',
      amount: 2000000,
      accountId: 'ACC-001',
      bankName: 'BCA'
    },
    {
      id: 'TRX-003',
      date: '2025-01-03',
      type: 'credit',
      description: 'Transfer dari BCA',
      amount: 2000000,
      accountId: 'ACC-002',
      bankName: 'Mandiri'
    },
    {
      id: 'TRX-004',
      date: '2024-12-31',
      type: 'credit',
      description: 'Gaji Desember 2024 + THR',
      amount: 13215000,
      accountId: 'ACC-001',
      bankName: 'BCA'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return '**** **** ' + accountNumber.slice(-4);
  };

  const toggleAccountVisibility = (accountId: string) => {
    setShowAccountNumbers(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const copyAccountNumber = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    alert('Nomor rekening berhasil disalin!');
  };

  const handleAddAccount = () => {
    if (!newAccount.bankName || !newAccount.accountNumber || !newAccount.accountName) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    console.log('Adding new account:', newAccount);
    alert('Rekening baru berhasil ditambahkan!');
    
    // Reset form
    setNewAccount({
      bankName: '',
      accountNumber: '',
      accountName: '',
      accountType: '',
      isPrimary: false
    });
    setShowAddForm(false);
  };

  const handleSetPrimary = (accountId: string) => {
    console.log('Setting primary account:', accountId);
    alert('Rekening utama berhasil diubah!');
  };

  const handleDeactivateAccount = (accountId: string) => {
    if (confirm('Apakah Anda yakin ingin menonaktifkan rekening ini?')) {
      console.log('Deactivating account:', accountId);
      alert('Rekening berhasil dinonaktifkan!');
    }
  };

  const totalBalance = bankAccounts
    .filter(acc => acc.isActive)
    .reduce((sum, acc) => sum + acc.balance, 0);

  const activeAccounts = bankAccounts.filter(acc => acc.isActive).length;
  const primaryAccount = bankAccounts.find(acc => acc.isPrimary);

  const stats = [
    {
      title: 'Total Saldo',
      value: formatCurrency(totalBalance),
      icon: CreditCard,
      color: 'text-green-600'
    },
    {
      title: 'Rekening Aktif',
      value: activeAccounts.toString(),
      icon: Building,
      color: 'text-blue-600'
    },
    {
      title: 'Rekening Utama',
      value: primaryAccount?.bankCode || 'Tidak Ada',
      icon: Shield,
      color: 'text-purple-600'
    },
    {
      title: 'Transaksi Bulan Ini',
      value: bankAccounts.reduce((sum, acc) => sum + acc.monthlyTransactions, 0).toString(),
      icon: History,
      color: 'text-orange-600'
    }
  ];

  return (
    <AuthenticatedLayout
      title="Kelola Rekening"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/supervisor-besi' },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Kelola Rekening', href: '/roles/supervisor-besi/rekening' }
      ]}
    >
      <Head title="Kelola Rekening - Supervisor Besi" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-8 w-8 text-blue-600" />
              Kelola Rekening Bank
            </h1>
            <p className="text-gray-600 mt-1">Kelola rekening bank untuk pembayaran gaji dan transaksi lainnya</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Rekening
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-full bg-gray-100">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Account Form */}
          {showAddForm && (
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tambah Rekening Baru</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Bank <span className="text-red-500">*</span>
                      </label>
                      <Select value={newAccount.bankName} onValueChange={(value) => setNewAccount({...newAccount, bankName: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {bankOptions.map((bank) => (
                            <SelectItem key={bank.value} value={bank.value}>
                              {bank.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Jenis Rekening <span className="text-red-500">*</span>
                      </label>
                      <Select value={newAccount.accountType} onValueChange={(value) => setNewAccount({...newAccount, accountType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis rekening" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountTypeOptions.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Nomor Rekening <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={newAccount.accountNumber}
                      onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                      placeholder="Masukkan nomor rekening"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Nama Pemilik Rekening <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={newAccount.accountName}
                      onChange={(e) => setNewAccount({...newAccount, accountName: e.target.value})}
                      placeholder="Nama sesuai rekening bank"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPrimary"
                      checked={newAccount.isPrimary}
                      onChange={(e) => setNewAccount({...newAccount, isPrimary: e.target.checked})}
                      className="rounded"
                    />
                    <label htmlFor="isPrimary" className="text-sm text-gray-700">
                      Jadikan sebagai rekening utama untuk gaji
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleAddAccount}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!newAccount.bankName || !newAccount.accountNumber || !newAccount.accountName}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Rekening
                    </Button>
                    <Button 
                      onClick={() => setShowAddForm(false)}
                      variant="outline"
                    >
                      Batal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Bank Accounts List */}
          <div className={showAddForm ? 'lg:col-span-1' : 'lg:col-span-2'}>
            <Card>
              <CardHeader>
                <CardTitle>Daftar Rekening Bank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bankAccounts.map((account) => (
                    <div key={account.id} className={`border rounded-lg p-4 ${account.isPrimary ? 'border-blue-500 bg-blue-50' : ''}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{account.bankName}</h4>
                            {account.isPrimary && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <Shield className="w-3 h-3 mr-1" />
                                Utama
                              </Badge>
                            )}
                            <Badge className={account.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {account.isActive ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{account.accountType} • {account.purpose}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {!account.isPrimary && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeactivateAccount(account.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Nomor Rekening:</span>
                            <span className="font-mono text-sm">
                              {showAccountNumbers[account.id] ? account.accountNumber : maskAccountNumber(account.accountNumber)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAccountVisibility(account.id)}
                              className="h-6 w-6 p-0"
                            >
                              {showAccountNumbers[account.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyAccountNumber(account.accountNumber)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Nama Pemilik:</span>
                          <span className="text-sm font-medium">{account.accountName}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Saldo:</span>
                          <span className="text-sm font-semibold text-green-600">{formatCurrency(account.balance)}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Ditambahkan: {account.addedDate}</span>
                          <span>Terakhir digunakan: {account.lastUsed}</span>
                        </div>

                        {!account.isPrimary && account.isActive && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetPrimary(account.id)}
                            className="w-full"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Jadikan Rekening Utama
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <div className={showAddForm ? 'lg:col-span-3' : 'lg:col-span-1'}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Transaksi Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>{transaction.bankName}</span>
                          <span>•</span>
                          <span>{transaction.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold text-sm ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <History className="w-4 h-4 mr-2" />
                  Lihat Semua Transaksi
                </Button>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-5 w-5" />
                  Keamanan Rekening
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-700 space-y-2">
                  <p>• Jangan bagikan informasi rekening kepada orang lain</p>
                  <p>• Pastikan data rekening yang dimasukkan benar</p>
                  <p>• Laporkan segera jika ada transaksi mencurigakan</p>
                  <p>• Rekening utama akan digunakan untuk pembayaran gaji</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Panduan Keamanan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}