import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ComplexDateFilterModal from '@/components/complex-date-filter-modal';

import PengeluaranHeader from './components/PengeluaranHeader';
import PengeluaranEditModal from './components/PengeluaranEditModal';
import PengeluaranDataTab from './components/PengeluaranDataTab';
import PengeluaranAnalisaTab from './components/PengeluaranAnalisaTab';

import { usePengeluaranData } from './hooks/usePengeluaranData';

export default function Pengeluaran({ pengeluaran: initialPengeluaran }: { pengeluaran: any[] }) {
    const {
        pengeluaranData, setPengeluaranData,
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
        editingPengeluaran, setEditingPengeluaran,
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
        totalPengeluaran,
        analysisData,
    } = usePengeluaranData(initialPengeluaran);








    

        return (
            <AuthenticatedLayout>
                <Head title="Pengeluaran Harian - Keuangan" />

                <ComplexDateFilterModal isOpen={isFilterModalOpen} onClose={() => setFilterModalOpen(false)} onApply={handleApplyFilter} />

                <PengeluaranEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    editingPengeluaran={editingPengeluaran}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    onSave={handleSaveEdit}
                />

                <PengeluaranHeader createRoute={route('keuangan.harian.pengeluaran.create')} />

                <div className="space-y-6">
                    <Tabs defaultValue="data">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="data">Data Pengeluaran</TabsTrigger>
                            <TabsTrigger value="analisa">Analisa Pengeluaran</TabsTrigger>
                        </TabsList>

                        <TabsContent value="data">
                            <PengeluaranDataTab
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                filteredData={filteredData}
                                totalPengeluaran={totalPengeluaran}
                                handleDeleteClick={handleDeleteClick}
                                handleEditClick={handleEditClick}
                            />
                        </TabsContent>

                        <TabsContent value="analisa">
                            <PengeluaranAnalisaTab
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
