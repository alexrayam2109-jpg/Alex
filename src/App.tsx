import React, { useState, useEffect } from 'react';
import { InspectionRecord, ChecklistCategory, TaskStatus } from './types';
import { loadInspectionsFromStorage, saveInspectionsToStorage } from './lib/storage';
import { Navbar, ViewTab } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { InspectionList } from './components/InspectionList';
import { InspectionForm } from './components/InspectionForm';
import { InspectionDetailModal } from './components/InspectionDetailModal';
import { ReportExportModal } from './components/ReportExportModal';
import { TemplateManager } from './components/TemplateManager';

export default function App() {
  const [records, setRecords] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // View state
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form initialization overrides
  const [formLocationId, setFormLocationId] = useState<string>('z1-fm');
  const [formCategory, setFormCategory] = useState<ChecklistCategory>('Cleaning');

  // Modals
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<InspectionRecord | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);

  // Load records from IndexedDB on startup
  useEffect(() => {
    async function initData() {
      const data = await loadInspectionsFromStorage();
      setRecords(data);
      setLoading(false);
    }
    initData();
  }, []);

  // Sync records to storage whenever updated
  const handleUpdateRecords = (newRecords: InspectionRecord[]) => {
    setRecords(newRecords);
    saveInspectionsToStorage(newRecords);
  };

  const handleSaveRecord = (newRecord: InspectionRecord) => {
    const updated = [newRecord, ...records];
    handleUpdateRecords(updated);
    setActiveTab('inspections');
  };

  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    handleUpdateRecords(updated);
    if (selectedRecordForDetail?.id === id) {
      setSelectedRecordForDetail(null);
    }
  };

  const handleTaskStatusChange = (recordId: string, taskId: string, newStatus: TaskStatus) => {
    const updated = records.map((rec) => {
      if (rec.id !== recordId) return rec;

      const updatedTasks = rec.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, lastUpdated: new Date().toISOString() }
          : task
      );

      const hasNotOk = updatedTasks.some((t) => t.status === 'Not OK');
      const hasPending = updatedTasks.some((t) => t.status === 'Pending');
      const overallStatus = hasNotOk ? ('Fail' as const) : hasPending ? ('In Progress' as const) : ('Pass' as const);

      const updatedRecord = {
        ...rec,
        tasks: updatedTasks,
        overallStatus,
        updatedAt: new Date().toISOString(),
      };

      if (selectedRecordForDetail?.id === recordId) {
        setSelectedRecordForDetail(updatedRecord);
      }

      return updatedRecord;
    });

    handleUpdateRecords(updated);
  };

  const handleStartNewInspection = (locationId?: string, category?: ChecklistCategory) => {
    if (locationId) setFormLocationId(locationId);
    if (category) setFormCategory(category);
    setActiveTab('new-inspection');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-semibold">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-300">Loading Check list Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedLocationFilter={selectedLocationFilter}
        setSelectedLocationFilter={setSelectedLocationFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalRecordsCount={records.length}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            records={records}
            onNewInspection={handleStartNewInspection}
            onViewRecord={(rec) => setSelectedRecordForDetail(rec)}
            onViewReports={() => setReportModalOpen(true)}
            selectedLocationFilter={selectedLocationFilter}
          />
        )}

        {activeTab === 'inspections' && (
          <InspectionList
            records={records}
            onViewRecord={(rec) => setSelectedRecordForDetail(rec)}
            onDeleteRecord={handleDeleteRecord}
            onNewInspection={() => handleStartNewInspection()}
            selectedLocationFilter={selectedLocationFilter}
            setSelectedLocationFilter={setSelectedLocationFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === 'new-inspection' && (
          <InspectionForm
            initialLocationId={formLocationId}
            initialCategory={formCategory}
            onSaveRecord={handleSaveRecord}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6 pb-12">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Export Inspection Reports</h1>
                <p className="text-xs text-slate-500">
                  Generate PDF printable reports, CSV data spreadsheets, or JSON backups
                </p>
              </div>
              <button
                onClick={() => setReportModalOpen(true)}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Open Report Generator Tool
              </button>
            </div>

            <InspectionList
              records={records}
              onViewRecord={(rec) => setSelectedRecordForDetail(rec)}
              onDeleteRecord={handleDeleteRecord}
              onNewInspection={() => handleStartNewInspection()}
              selectedLocationFilter={selectedLocationFilter}
              setSelectedLocationFilter={setSelectedLocationFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        )}

        {activeTab === 'templates' && <TemplateManager />}
      </main>

      {/* Modal Views */}
      {selectedRecordForDetail && (
        <InspectionDetailModal
          record={selectedRecordForDetail}
          onClose={() => setSelectedRecordForDetail(null)}
          onTaskStatusChange={handleTaskStatusChange}
        />
      )}

      {reportModalOpen && (
        <ReportExportModal
          records={records}
          initialLocationId={selectedLocationFilter}
          onClose={() => setReportModalOpen(false)}
        />
      )}
    </div>
  );
}
