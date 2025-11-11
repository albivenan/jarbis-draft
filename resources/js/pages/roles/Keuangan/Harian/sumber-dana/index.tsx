import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PlusCircle, MinusCircle, Repeat, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { useSumberDanaData } from './hooks/useSumberDanaData';
import SumberDanaAnalisaTab from './components/SumberDanaAnalisaTab';
import SumberDanaRiwayatTab from './components/SumberDanaRiwayatTab';

import ComplexDateFilterModal from '@/components/complex-date-filter-modal';
import { SumberDana } from './hooks/useSumberDanaData';
import { TambahModalAwalModal } from './components/TambahModalAwalModal';

// Modals for actions (placeholder for now)
const PemasukanModal = ({ isOpen, onClose, onSubmit, sumberDana, selectedSourceId }: { isOpen: boolean; onClose: () => void; onSubmit: (sourceId: number, amount: number, description: string) => void; sumberDana: SumberDana[]; selectedSourceId: number | null }) => {
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');
    const [sourceId, setSourceId] = useState<number | null>(selectedSourceId);

    React.useEffect(() => {
        setSourceId(selectedSourceId);
    }, [selectedSourceId]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Tambah Pemasukan</h2>
                <select value={sourceId || ''} onChange={(e) => setSourceId(Number(e.target.value))} className="border p-2 rounded w-full mb-2">
                    <option value="" disabled>Pilih Sumber Dana</option>
                    {sumberDana.map(sd => (
                        <option key={sd.id} value={sd.id}>{sd.name}</option>
                    ))}
                </select>
                {sourceId && (
                    <p className="text-sm text-muted-foreground mb-2">Saldo saat ini: {formatCurrency(sumberDana.find(sd => sd.id === sourceId)?.balance || 0)}</p>
                )}
                <input type="number" placeholder="Jumlah" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="border p-2 rounded w-full mb-2" />
                <input type="text" placeholder="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded w-full mb-4" />
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    <Button onClick={() => sourceId && onSubmit(sourceId, amount, description)} disabled={!sourceId}>Tambah</Button>
                </div>
            </div>
        </div>
    );
};

const PengeluaranModal = ({ isOpen, onClose, onSubmit, sumberDana, selectedSourceId }: { isOpen: boolean; onClose: () => void; onSubmit: (sourceId: number, amount: number, description: string) => void; sumberDana: SumberDana[]; selectedSourceId: number | null }) => {
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');
    const [sourceId, setSourceId] = useState<number | null>(selectedSourceId);

    React.useEffect(() => {
        setSourceId(selectedSourceId);
    }, [selectedSourceId]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Tambah Pengeluaran</h2>
                <select value={sourceId || ''} onChange={(e) => setSourceId(Number(e.target.value))} className="border p-2 rounded w-full mb-2">
                    <option value="" disabled>Pilih Sumber Dana</option>
                    {sumberDana.map(sd => (
                        <option key={sd.id} value={sd.id}>{sd.name}</option>
                    ))}
                </select>
                <input type="number" placeholder="Jumlah" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="border p-2 rounded w-full mb-2" />
                <input type="text" placeholder="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded w-full mb-4" />
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    <Button onClick={() => sourceId && onSubmit(sourceId, amount, description)} disabled={!sourceId}>Tambah</Button>
                </div>
            </div>
        </div>
    );
};

const TransferModal = ({ isOpen, onClose, onSubmit, sumberDana }: { isOpen: boolean; onClose: () => void; onSubmit: (from: number, to: number, amount: number, description: string) => void; sumberDana: SumberDana[] }) => {
    const [fromSource, setFromSource] = useState<number | null>(null);
    const [toSource, setToSource] = useState<number | null>(null);
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');

    React.useEffect(() => {
        if (sumberDana.length > 0) {
            setFromSource(sumberDana[0].id);
            if (sumberDana.length > 1) {
                setToSource(sumberDana[1].id);
            } else {
                setToSource(sumberDana[0].id); // Fallback if only one source
            }
        }
    }, [sumberDana]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Transfer Dana</h2>
                <select value={fromSource || ''} onChange={(e) => setFromSource(Number(e.target.value))} className="border p-2 rounded w-full mb-2">
                    <option value="" disabled>Dari Sumber Dana</option>
                    {sumberDana.map(sd => (
                        <option key={sd.id} value={sd.id}>{sd.name}</option>
                    ))}
                </select>
                <select value={toSource || ''} onChange={(e) => setToSource(Number(e.target.value))} className="border p-2 rounded w-full mb-2">
                    <option value="" disabled>Ke Sumber Dana</option>
                    {sumberDana.map(sd => (
                        <option key={sd.id} value={sd.id}>{sd.name}</option>
                    ))}
                </select>
                <input type="number" placeholder="Jumlah" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="border p-2 rounded w-full mb-2" />
                <input type="text" placeholder="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded w-full mb-4" />
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    <Button onClick={() => fromSource !== null && toSource !== null && onSubmit(fromSource, toSource, amount, description)} disabled={fromSource === toSource || fromSource === null || toSource === null}>Transfer</Button>
                </div>
            </div>
        </div>
    );
};

export default function SumberDanaPage() {
    const { 
        sumberDana, 
        filteredTransactions, // Keep for AnalisaTab if still used there
        chartDataTunai, 
        chartDataRekening, 
        startDate, 
        setStartDate, 
        endDate, 
        setEndDate, 
        selectedTransactionType, 
        setSelectedTransactionType, 
        selectedSourceFilter, 
        setSelectedSourceFilter, 
        analysisPeriod, 
        setAnalysisPeriod, 
        isAnyFilterActive, 
        handleResetFilter, 
        handlePemasukan, 
        handlePengeluaran, 
        handleTransfer,
        isFilterModalOpen,
        setFilterModalOpen,
        dateFilter,
        handleApplyFilter,
        loading, 
        error,   
        // New exports for history tab
        selectedSumberDanaId,
        setSelectedSumberDanaId,
        paginatedHistory,
        historyLoading,
        historyError,
        fetchPaginatedTransactions,
    } = useSumberDanaData();

    const [isPemasukanModalOpen, setIsPemasukanModalOpen] = useState(false);
    const [isPengeluaranModalOpen, setIsPengeluaranModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isTambahModalAwalModalOpen, setIsTambahModalAwalModalOpen] = useState(false); // Added
    const [selectedSourceForAction, setSelectedSourceForAction] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState('analisa');

    const handlePemasukanClick = (sourceId: number, isInitialBalance: boolean) => {
        setSelectedSourceForAction(sourceId);
        if (isInitialBalance) {
            setIsTambahModalAwalModalOpen(true);
        } else {
            setIsPemasukanModalOpen(true);
        }
    };

    const handlePengeluaranClick = (sourceId: number) => {
        setSelectedSourceForAction(sourceId);
        setIsPengeluaranModalOpen(true);
    };

    const handleTransferClick = () => {
        setIsTransferModalOpen(true);
    };

    const handleTambahModalAwalSubmit = (sourceId: number, amount: number) => {
        handlePemasukan(sourceId, amount, 'Modal Awal'); // Use a specific description
        setIsTambahModalAwalModalOpen(false);
    };

    const handlePemasukanSubmit = (sourceId: number, amount: number, description: string) => {
        handlePemasukan(sourceId, amount, description);
        setIsPemasukanModalOpen(false);
    };

    const handlePengeluaranSubmit = (sourceId: number, amount: number, description: string) => {
        handlePengeluaran(sourceId, amount, description);
        setIsPengeluaranModalOpen(false);
    };

    const handleTransferSubmit = (from: number, to: number, amount: number, description: string) => {
        handleTransfer(from, to, amount, description);
        setIsTransferModalOpen(false);
    };

    const getChangeColor = (current: number, yesterday: number) => {
        if (current > yesterday) return 'text-green-500';
        if (current < yesterday) return 'text-red-500';
        return 'text-gray-500';
    };

    const getChangeArrow = (current: number, yesterday: number) => {
        if (current > yesterday) return <ArrowUp className="h-3 w-3 inline ml-1" />;
        if (current < yesterday) return <ArrowDown className="h-3 w-3 inline ml-1" />;
        return <Minus className="h-3 w-3 inline ml-1" />;
    };


    return (
        <AuthenticatedLayout>
            <Head title="Sumber Dana - Keuangan" />

            <PemasukanModal isOpen={isPemasukanModalOpen} onClose={() => setIsPemasukanModalOpen(false)} onSubmit={handlePemasukanSubmit} sumberDana={sumberDana} selectedSourceId={selectedSourceForAction} />
            <PengeluaranModal isOpen={isPengeluaranModalOpen} onClose={() => setIsPengeluaranModalOpen(false)} onSubmit={handlePengeluaranSubmit} sumberDana={sumberDana} selectedSourceId={selectedSourceForAction} />
            <TransferModal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} onSubmit={handleTransferSubmit} sumberDana={sumberDana} />
            <ComplexDateFilterModal isOpen={isFilterModalOpen} onClose={() => setFilterModalOpen(false)} onApply={handleApplyFilter} />
            <TambahModalAwalModal
                isOpen={isTambahModalAwalModalOpen}
                onClose={() => setIsTambahModalAwalModalOpen(false)}
                onSubmit={handleTambahModalAwalSubmit}
                selectedSourceId={selectedSourceForAction}
                sourceName={sumberDana.find(sd => sd.id === selectedSourceForAction)?.name || ''}
            />

            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Manajemen Sumber Dana</h1>
                <p className="text-gray-600 mt-1">Kelola dan pantau saldo serta riwayat transaksi kas dan rekening bank perusahaan.</p>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        <Card className="col-span-full h-[150px] flex items-center justify-center">
                            <CardContent>
                                <p className="text-lg text-gray-500">Memuat saldo...</p>
                            </CardContent>
                        </Card>
                    ) : error ? (
                        <Card className="col-span-full h-[150px] flex items-center justify-center">
                            <CardContent>
                                <p className="text-lg text-red-500">Error: {error}</p>
                            </CardContent>
                        </Card>
                    ) : (
                        sumberDana.map((sumber) => (
                            <Card 
                                key={sumber.id} 
                                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                                onClick={() => {
                                    setSelectedSumberDanaId(sumber.id);
                                    setActiveTab('riwayat');
                                }}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{sumber.name}</CardTitle>
                                    {sumber.icon && <sumber.icon className="h-4 w-4 text-muted-foreground" />}
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <div className="text-2xl font-bold">{formatCurrency(sumber.balance)}</div>
                                        {/* Calculate yesterday's balance for comparison */}
                                        {(() => {
                                            const balanceYesterday = sumber.balance - sumber.totalPemasukan + sumber.totalPengeluaran + sumber.totalPemasukanYesterday - sumber.totalPengeluaranYesterday; // Approximation
                                            const balanceChange = sumber.balance - balanceYesterday;
                                            const balanceChangePercentage = balanceYesterday !== 0 ? (balanceChange / balanceYesterday) * 100 : 0;

                                            if (balanceChangePercentage === 0) {
                                                return <span className="text-sm text-gray-500 flex items-center"><Minus className="h-3 w-3 inline mr-1" /> 0.00%</span>;
                                            }

                                            const colorClass = balanceChangePercentage > 0 ? 'text-green-500' : 'text-red-500';
                                            const ArrowIcon = balanceChangePercentage > 0 ? ArrowUp : ArrowDown;

                                            return (
                                                <span className={`text-sm flex items-center ${colorClass}`}>
                                                    <ArrowIcon className="h-3 w-3 inline mr-1" /> {Math.abs(balanceChangePercentage).toFixed(2)}%
                                                </span>
                                            );
                                        })()}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Saldo saat ini</p>
                                    {sumber.lastUpdated && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Terakhir diperbarui: {format(parseISO(sumber.lastUpdated), 'yyyy MMM dd HH:mm:ss', { locale: id })}
                                        </p>
                                    )}

                                    <div className="mt-4 space-y-1">
                                        <div className="flex text-sm text-black">
                                            <span>Pemasukan:</span>
                                            <span className='ml-2 text-green-500'>{formatCurrency(sumber.totalPemasukan)}</span>
                                        </div>
                                        <div className="flex text-sm text-black">
                                            <span>Pengeluaran:</span>
                                            <span className='ml-2 text-red-500'>{formatCurrency(sumber.totalPengeluaran)}</span>
                                        </div>
                                    </div>
                                    {/* Laba */}
                                    {(() => {
                                        const labaToday = sumber.totalPemasukan - sumber.totalPengeluaran;
                                        const labaYesterday = sumber.totalPemasukanYesterday - sumber.totalPengeluaranYesterday;

                                        const colorClass = labaToday > 0 ? 'text-green-600' : labaToday < 0 ? 'text-red-600' : 'text-gray-600';

                                        let percentageDisplay = '';
                                        let arrowIcon = <Minus className="h-3 w-3 inline mr-1" />;

                                        if (labaYesterday === 0) {
                                            if (labaToday > 0) {
                                                percentageDisplay = 'New Profit';
                                                arrowIcon = <ArrowUp className="h-3 w-3 inline mr-1" />;
                                            } else if (labaToday < 0) {
                                                percentageDisplay = 'New Loss';
                                                arrowIcon = <ArrowDown className="h-3 w-3 inline mr-1" />;
                                            }
                                        } else {
                                            const percentageChange = ((labaToday - labaYesterday) / labaYesterday) * 100;
                                            if (percentageChange > 0) {
                                                arrowIcon = <ArrowUp className="h-3 w-3 inline mr-1" />;
                                            } else if (percentageChange < 0) {
                                                arrowIcon = <ArrowDown className="h-3 w-3 inline mr-1" />;
                                            }
                                            percentageDisplay = `${Math.abs(percentageChange).toFixed(2)}%`;
                                        }

                                        return (
                                            <div className="flex text-sm text-black mt-2">
                                                <span>Laba:</span>
                                                <span className={`ml-2 font-semibold ${colorClass}`}>
                                                    {formatCurrency(labaToday)}
                                                    
                                                </span>
                                                {labaToday !== 0 && percentageDisplay && ( // Only show percentage if today's Laba is not zero and there's a percentage to display
                                                        <span className={`ml-2 text-xs flex items-center ${colorClass}`}>
                                                            {arrowIcon} {percentageDisplay}
                                                        </span>
                                                    )}
                                            </div>
                                        );
                                    })()}

                                    <div className="flex gap-2 mt-4">
                                        {sumber.tipe_sumber === 'Tunai' && sumber.balance === 0 && (
                                            <Button variant="outline" size="sm" onClick={() => handlePemasukanClick(sumber.id, true)}>
                                                <PlusCircle className="h-4 w-4 mr-2" /> Tambah Modal Awal
                                            </Button>
                                        )}
                                        {sumber.tipe_sumber === 'Bank' && (
                                            <Link href={route('manajer-keuangan.harian.rekening-bank.index')}>
                                                <Button variant="outline" size="sm">
                                                    Detail Rekening
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-fit grid-cols-2">
                        <TabsTrigger value="analisa">Analisa Sumber Dana</TabsTrigger>
                        <TabsTrigger value="riwayat">Riwayat Sumber Dana</TabsTrigger>
                    </TabsList>
                    <TabsContent value="analisa" className="mt-4">
                        <SumberDanaAnalisaTab
                            sumberDana={sumberDana}
                            chartDataTunai={chartDataTunai}
                            chartDataRekening={chartDataRekening}
                            isFilterModalOpen={isFilterModalOpen}
                            setFilterModalOpen={setFilterModalOpen}
                            dateFilter={dateFilter}
                            analysisPeriod={analysisPeriod}
                            setAnalysisPeriod={setAnalysisPeriod}
                            isAnyFilterActive={isAnyFilterActive}
                            handleResetFilter={handleResetFilter}
                            loading={loading}
                            error={error}
                        />
                    </TabsContent>
                    <TabsContent value="riwayat" className="mt-4">
                        <SumberDanaRiwayatTab
                            selectedSumberDanaId={selectedSumberDanaId}
                            setSelectedSumberDanaId={setSelectedSumberDanaId}
                            paginatedHistory={paginatedHistory}
                            historyLoading={historyLoading}
                            historyError={historyError}
                                                        fetchPaginatedTransactions={fetchPaginatedTransactions}
                                                        selectedTransactionType={selectedTransactionType}
                                                        setSelectedTransactionType={setSelectedTransactionType}
                                                    />
                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}