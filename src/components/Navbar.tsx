import React from 'react';
import { ClipboardCheck, LayoutDashboard, PlusCircle, FileText, Settings, Building2, Search } from 'lucide-react';
import { LOCATIONS } from '../data/locations';

export type ViewTab = 'dashboard' | 'inspections' | 'new-inspection' | 'reports' | 'templates';

interface Props {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  selectedLocationFilter: string;
  setSelectedLocationFilter: (loc: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  totalRecordsCount: number;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  selectedLocationFilter,
  setSelectedLocationFilter,
  searchQuery,
  setSearchQuery,
  totalRecordsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/20">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">Check list</span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full">
                  v2.4 Audit
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Cleaning • MEP • Landscape Audit Manager
              </p>
            </div>
          </div>

          {/* Quick Location Filter Dropdown */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
            <Building2 className="w-4 h-4 text-sky-400" />
            <span className="text-slate-400 font-medium">Site:</span>
            <select
              value={selectedLocationFilter}
              onChange={(e) => setSelectedLocationFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">All Locations (Zone 1 - Zone 8)</option>
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-slate-900 text-slate-200">
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search bar */}
          <div className="relative hidden lg:block w-64">
            <input
              type="text"
              placeholder="Search tasks, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-500 transition placeholder:text-slate-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>

          {/* New Inspection Action Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('new-inspection')}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-md hover:shadow-sky-500/20 transition flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Audit Checklist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-950/60 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 overflow-x-auto py-1.5 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center space-x-2 transition ${
              activeTab === 'dashboard'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('inspections')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center space-x-2 transition ${
              activeTab === 'inspections'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Inspections History ({totalRecordsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center space-x-2 transition ${
              activeTab === 'reports'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Export Reports (PDF/CSV)</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center space-x-2 transition ${
              activeTab === 'templates'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Checklist Templates</span>
          </button>
        </div>
      </div>
    </header>
  );
};
