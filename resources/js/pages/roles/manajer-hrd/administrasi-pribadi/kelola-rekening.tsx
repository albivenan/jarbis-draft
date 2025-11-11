import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Building,
  CheckCircle,
  AlertCircle,
  Star,
  Copy,
  Shield,
  Clock
} from 'lucide-react';

interface BankAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  accountType: 'checking' | 'savings';
  isPrimary: boolean;
  isActive: boolean;
  balance?: number;
  lastTransaction?: string;
  addedDate: string;
  verificationStatus: 'verified' | 'pending' | 'failed';
}

interface PaymentMethod {
  id: string;
  type: 'bank' | 'ewallet' | 'crypto';
  provider: string;
  accountId: string;
  accountName: string;
  isActive: boolean;
  addedDate: string;
}

export default function KelolaRekeningManajerHRD() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBalance, setShowBalance] = useState<{[key: string]: boolean}>({});
  const [selectedTab, setSelectedTab] = useState<'bank' | 'payment' | 'history'>('bank');
  
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    accountType: 'savings'
  });

  const bankAccounts: BankAccount[] = [
    {
      id: 'BA-001',
      bankName: 'Bank Central Asia (BCA)',
      bankCode: '014',
      accountNumber: '1234567890',
      accountName: 'Ahmad Yusuf',
      accountType: 'savings',
      isPrimary: true,
      isActive: true,
      balance: 45750000,
      lastTransaction: '2024-01-15 14:30',
      addedDate: '2022-03-15',
      verificationStatus: 'verified'
    },
    {
      id: 'BA-002',
      bankName: 'Bank Mandiri',
      bankCode: '008',
      accountNumber: '9876543210',
      accountName: 'Ahmad Yusuf',
      accountType: 'checking',
      isPrimary: false,
      isActive: true,
      balance: 12500000,
      lastTransaction: '2024-01-10 09:15',
      addedDate: '2023-06-20',
      verificationStatus: 'verified'
    },
    {
      id: 'BA-003',
      bankName: 'Bank Negara Indonesia (BNI)',
      bankCode: '009',
      accountNumber: '5555666677',
      accountName: 'Ahmad Yusuf',
      accountType: 'savings',
      isPrimary: false,
      isActive: false,
      addedDate: '2023-12-01',
      verificationStatus: 'pending'
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'PM-001',
      type: 'ewallet',
      provider: 'GoPay',
      accountId: '081234567890',
      accountName: 'Ahmad Yusuf',
      isActive: true,
      addedDate: '2023-08-15'
    },
    {
      id: 'PM-002',
      type: 'ewallet',
      provider: 'OVO',
      accountId: '081234567890',
      accountName: 'Ahmad Yusuf',
      isActive: true,
      addedDate: '2023-09-10'
    },
    {
      id: 'PM-003',
      type: 'ewallet',
      provider: 'DANA',
      accountId: '081234567890',
      accountName: 'Ahmad Yusuf',
      isActive: false,
      addedDate: '2023-11-05'
    }
  ];

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'savings': return 'Tabungan';
      case 'checking': return 'Giro';
      default: return type;
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return accountNumber.substring(0, 4) + '*'.repeat(accountNumber.length - 8) + accountNumber.substring(accountNumber.length - 4);
  };

  const toggleBalanceVisibility = (accountId: string) => {
    setShowBalance(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding new bank account:', formData);
    setShowAddForm(false);
    setFormData({
      bankName: '',
      accountNumber: '',
      accountName: '',
      accountType: 'savings'
    });
  };

  const setPrimaryAccount = (accountId: string) => {
    console.log('Setting primary account:', accountId);
  };

  const totalBalance = bankAccounts
    .filter(acc => acc.isActive && acc.balance)
    .reduce((sum, acc) => sum + (acc.balance || 0), 0);

  const activeAccounts = bankAccounts.filter(acc => acc.isActive).length;
  const verifiedAccounts = bankAccounts.filter(acc => acc.verificationStatus === 'verified').length;

  return (
    <AuthenticatedLayout
      title="Kelola Rekening"
      breadcrumbs={[
        { title: 'Dashboard', href: '/roles/manajer-hrd' },
        { title: 'Administrasi Pribadi', href: '#' },
        { title: 'Kelola Rekening', href: '/roles/manajer-hrd/administrasi-pribadi/kelola-rekening' }
      ]}
    >
      <Head title="Kelola Rekening - Manajer HRD" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-8 w-8 text-blue-600" />
              Kelola Rekening
            </h1>
            <p className="text-gray-600 mt-1">Kelola rekening bank dan metode pembayaran</p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Rekening
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Saldo</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rekening Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">{activeAccounts}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terverifikasi</p>
                  <p className="text-2xl font-bold text-gray-900">{verifiedAccounts}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">E-Wallet</p>
                  <p className="text-2xl font-bold text-gray-900">{paymentMethods.filter(pm => pm.isActive).length}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setSelectedTab('bank')}
            className={`px-6 py-3 font-medium ${
              selectedTab === 'bank' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rekening Bank ({bankAccounts.length})
          </button>
          <button
            onClick={() => setSelectedTab('payment')}
            className={`px-6 py-3 font-medium ${
              selectedTab === 'payment' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            E-Wallet ({paymentMethods.length})
          </button>
          <button
            onClick={() => setSelectedTab('history')}
            className={`px-6 py-3 font-medium ${
              selectedTab === 'history' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Riwayat Transaksi
          </button>
        </div>

        {selectedTab === 'bank' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bankAccounts.map((account) => (
              <Card key={account.id} className={`${account.isPrimary ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{account.bankName}</h3>
                        <p className="text-sm text-gray-600">{getAccountTypeLabel(account.accountType)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {account.isPrimary && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Primary
                        </Badge>
                      )}
                      <Badge className={getVerificationColor(account.verificationStatus)}>
                        <div className="flex items-center gap-1">
                          {getVerificationIcon(account.verificationStatus)}
                          <span className="capitalize">{account.verificationStatus}</span>
                        </div>
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Nomor Rekening</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{maskAccountNumber(account.accountNumber)}</span>
                        <button
                          onClick={() => copyToClipboard(account.accountNumber)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Nama Pemilik</span>
                      <span className="font-medium">{account.accountName}</span>
                    </div>

                    {account.balance && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Saldo</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-600">
                            {showBalance[account.id] ? formatCurrency(account.balance) : '••••••••'}
                          </span>
                          <button
                            onClick={() => toggleBalanceVisibility(account.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showBalance[account.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {account.lastTransaction && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Transaksi Terakhir</span>
                        <span className="text-sm text-gray-500">
                          {new Date(account.lastTransaction).toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status</span>
                      <Badge className={account.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {account.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    {!account.isPrimary && account.isActive && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPrimaryAccount(account.id)}
                        className="flex-1"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Set Primary
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'payment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{method.provider}</h3>
                      <p className="text-sm text-gray-600 capitalize">{method.type}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Account ID</span>
                      <span className="font-mono">{method.accountId}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Nama</span>
                      <span className="font-medium">{method.accountName}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status</span>
                      <Badge className={method.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {method.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Ditambahkan</span>
                      <span className="text-sm text-gray-500">
                        {new Date(method.addedDate).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'history' && (
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Riwayat Transaksi</h3>
                <p className="text-gray-600">Fitur riwayat transaksi akan segera tersedia</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Account Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tambah Rekening Bank</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Bank</label>
                  <select
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Pilih Bank</option>
                    <option value="Bank Central Asia (BCA)">Bank Central Asia (BCA)</option>
                    <option value="Bank Mandiri">Bank Mandiri</option>
                    <option value="Bank Negara Indonesia (BNI)">Bank Negara Indonesia (BNI)</option>
                    <option value="Bank Rakyat Indonesia (BRI)">Bank Rakyat Indonesia (BRI)</option>
                    <option value="Bank CIMB Niaga">Bank CIMB Niaga</option>
                    <option value="Bank Danamon">Bank Danamon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Rekening</label>
                  <Input
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                    placeholder="Masukkan nomor rekening"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pemilik</label>
                  <Input
                    value={formData.accountName}
                    onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                    placeholder="Nama sesuai rekening"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Rekening</label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({...formData, accountType: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="savings">Tabungan</option>
                    <option value="checking">Giro</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1">
                    Tambah
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}