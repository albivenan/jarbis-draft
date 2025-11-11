import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ComplexDateFilterModal from '@/components/complex-date-filter-modal';

import PemasukanHeader from './components/PemasukanHeader';
import PemasukanEditModal from './components/PemasukanEditModal';
import PemasukanDataTab from './components/PemasukanDataTab';
import PemasukanAnalisaTab from './components/PemasukanAnalisaTab';




















import { usePemasukanData } from './hooks/usePemasukanData';

export default function Pemasukan({ pemasukan: initialPemasukan }: { pemasukan: any[] }) {
    const {
        pemasukanData, setPemasukanData,
        isFilterModalOpen, setFilterModalOpen,
        dateFilter, setDateFilter,
        selectedDate, setSelectedDate,
        searchTerm, setSearchTerm,
        hiddenKeys, setHiddenKeys,
        analysisJenisFilter, setAnalysisJenisFilter,
        analysisPeriod, setAnalysisPeriod,
        isDateSelectedByUser, setIsDateSelectedByUser,
        isCalendarOpen, setIsCalendarOpen,
        showArea, setShowArea,
        isEditModalOpen, setEditModalOpen,
        editingPemasukan, setEditingPemasukan,
        formValues, setFormValues,
        handleApplyFilter,
        handleResetFilter,
        handleDateSelect,
        isAnyFilterActive,
        handleLegendClick,
        handleEditClick,
        handleSaveEdit,
        handleDeleteClick,
        filteredData,
        totalPemasukan,
        analysisData,
    } = usePemasukanData(initialPemasukan);








    

        return (
            <AuthenticatedLayout>
                <Head title="Pemasukan Harian - Keuangan" />

                <ComplexDateFilterModal isOpen={isFilterModalOpen} onClose={() => setFilterModalOpen(false)} onApply={handleApplyFilter} />

                <PemasukanEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    editingPemasukan={editingPemasukan}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    onSave={handleSaveEdit}
                />

                <PemasukanHeader createRoute={route('manajer-keuangan.harian.pemasukan.create')} />

                <div className="space-y-6">
                    <Tabs defaultValue="data">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="data">Data Pemasukan</TabsTrigger>
                            <TabsTrigger value="analisa">Analisa Pemasukan</TabsTrigger>
                        </TabsList>

                        <TabsContent value="data">
                            <PemasukanDataTab
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                filteredData={filteredData}
                                totalPemasukan={totalPemasukan}
                                handleDeleteClick={handleDeleteClick}
                            />
                        </TabsContent>

                        <TabsContent value="analisa">
                            <PemasukanAnalisaTab
                                analysisData={analysisData}
                                isFilterModalOpen={isFilterModalOpen}
                                setFilterModalOpen={setFilterModalOpen}
                                dateFilter={dateFilter}
                                setDateFilter={setDateFilter}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                analysisJenisFilter={analysisJenisFilter}
                                setAnalysisJenisFilter={setAnalysisJenisFilter}
                                analysisPeriod={analysisPeriod}
                                setAnalysisPeriod={setAnalysisPeriod}
                                isDateSelectedByUser={isDateSelectedByUser}
                                setIsDateSelectedByUser={setIsDateSelectedByUser}
                                isCalendarOpen={isCalendarOpen}
                                setIsCalendarOpen={setIsCalendarOpen}
                                showArea={showArea}
                                setShowArea={setShowArea}
                                handleApplyFilter={handleApplyFilter}
                                handleResetFilter={handleResetFilter}
                                handleDateSelect={handleDateSelect}
                                isAnyFilterActive={isAnyFilterActive}
                                hiddenKeys={hiddenKeys}
                                handleLegendClick={handleLegendClick}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </AuthenticatedLayout>
        );
}
