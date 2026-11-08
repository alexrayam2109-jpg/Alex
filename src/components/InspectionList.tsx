import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Building2,
  Trash2,
  Printer,
  ChevronRight,
  PlusCircle,
  Camera,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Wrench,
  Trees,
} from 'lucide-react';
import { InspectionRecord, ReportFilter } from '../types';
import { LOCATIONS } from '../data/locations';
import { filterRecords, triggerPrintReport } from '../lib/exportUtils';

interface Props {
  records: InspectionRecord[];
  onViewRecord: (record: InspectionRecord) => void;
  onDeleteRecord: (id: string) => void;
  onNewInspection: () => void;
  selectedLocationFilter: string;
  setSelectedLocationFilter: (loc: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const InspectionList: React.FC<Props> = ({
  records,
  onViewRecord,
  onDeleteRecord,
  onNewInspection,
  selectedLocationFilter,
  setSelectedLocationFilter,
  searchQuery,
  setSearchQuery,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const currentFilters: ReportFilter = {
    locationId: selectedLocationFilter,
    category: categoryFilter,
    status: statusFilter,
    startDate,
    endDate,
    searchQuery,
  };

  const filtered = filterRecords(records, currentFilters);

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Inspection Records & Audit History
          </h1>
          <p className="text-xs text-slate-500">
            Filtered site inspection entries ({filtered.length} of {records.length} total)
          </p>
        </div>

        <button
          onClick={onNewInspection}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-sky-500/20 transition flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Inspection Audit</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="relative sm:col-span-2">
            <input
              type="text"
              placeholder="Search reference #, location, title, inspector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={selectedLocationFilter}
              onChange={(e) => setSelectedLocationFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">All Site Locations (Zone 1 - Zone 8)</option>
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">All Categories (Cleaning, MEP, Landscape)</option>
              <option value="Cleaning">Cleaning</option>
              <option value="MEP">MEP</option>
              <option value="Landscape">Landscape</option>
            </select>
          </div>

          {/* Task Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">All Statuses (OK, Not OK, Pending, N/A)</option>
              <option value="OK">OK (Pass)</option>
              <option value="Not OK">Not OK (Defect)</option>
              <option value="Pending">Pending</option>
              <option value="N/A">N/A</option>
            </select>
          </div>
        </div>

        {/* Date Range Inputs */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-600 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Date Filter:</span>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none"
            />
          </div>

          {(startDate || endDate || categoryFilter !== 'ALL' || statusFilter !== 'ALL' || selectedLocationFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setCategoryFilter('ALL');
                setStatusFilter('ALL');
                setSelectedLocationFilter('ALL');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Inspections Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No inspection records found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No audit sessions match your current filter settings. Try clearing your search query or changing date ranges.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((rec) => {
              const totalTaskCount = rec.tasks.length;
              const okCount = rec.tasks.filter((t) => t.status === 'OK').length;
              const notOkCount = rec.tasks.filter((t) => t.status === 'Not OK').length;
              const pendingCount = rec.tasks.filter((t) => t.status === 'Pending').length;
              const photoTotal = rec.tasks.reduce((acc, t) => acc + t.photos.length, 0);

              return (
                <div
                  key={rec.id}
                  className="p-5 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-slate-900 text-white font-mono text-[11px] font-bold rounded-md">
                        {rec.referenceNo}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full flex items-center space-x-1 ${
                          rec.category === 'Cleaning'
                            ? 'bg-blue-100 text-blue-800'
                            : rec.category === 'MEP'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {rec.category === 'Cleaning' ? (
                          <Sparkles className="w-3 h-3" />
                        ) : rec.category === 'MEP' ? (
                          <Wrench className="w-3 h-3" />
                        ) : (
                          <Trees className="w-3 h-3" />
                        )}
                        <span>{rec.category}</span>
                      </span>

                      <h3
                        onClick={() => onViewRecord(rec)}
                        className="font-bold text-slate-900 text-base hover:text-sky-600 cursor-pointer"
                      >
                        {rec.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span className="flex items-center space-x-1 font-semibold text-slate-800">
                        <Building2 className="w-3.5 h-3.5 text-sky-600" />
                        <span>{rec.locationName}</span>
                        {rec.subLocation && <span className="text-slate-500">({rec.subLocation})</span>}
                      </span>
                      <span>•</span>
                      <span>Inspector: <strong>{rec.inspectorName}</strong></span>
                      <span>•</span>
                      <span>Date: <strong>{rec.inspectionDate}</strong></span>
                    </div>

                    {/* Task status badges breakdown */}
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="text-xs text-slate-500 font-medium">Tasks ({totalTaskCount}):</span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[11px] rounded-md border border-emerald-200">
                        {okCount} OK
                      </span>
                      {notOkCount > 0 && (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold text-[11px] rounded-md border border-rose-200">
                          {notOkCount} Not OK
                        </span>
                      )}
                      {pendingCount > 0 && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold text-[11px] rounded-md border border-amber-200">
                          {pendingCount} Pending
                        </span>
                      )}
                      {photoTotal > 0 && (
                        <span className="px-2 py-0.5 bg-sky-50 text-sky-700 font-bold text-[11px] rounded-md border border-sky-200 flex items-center space-x-1">
                          <Camera className="w-3 h-3" />
                          <span>{photoTotal} Photos</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Print */}
                  <div className="flex items-center space-x-2 self-end md:self-auto">
                    <button
                      onClick={() => triggerPrintReport([rec], currentFilters)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                      title="Print / Save PDF Report for this session"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete inspection audit ${rec.referenceNo}?`)) {
                          onDeleteRecord(rec.id);
                        }
                      }}
                      className="p-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-xl transition"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onViewRecord(rec)}
                      className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs rounded-xl flex items-center space-x-1 transition"
                    >
                      <span>View Audit</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
