import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Sparkles,
  Wrench,
  Trees,
  Building2,
  PlusCircle,
  FileSpreadsheet,
  ArrowUpRight,
  Camera,
  MapPin,
} from 'lucide-react';
import { InspectionRecord, ChecklistCategory } from '../types';
import { LOCATIONS } from '../data/locations';

interface Props {
  records: InspectionRecord[];
  onNewInspection: (locationId?: string, category?: ChecklistCategory) => void;
  onViewRecord: (record: InspectionRecord) => void;
  onViewReports: () => void;
  selectedLocationFilter: string;
}

export const Dashboard: React.FC<Props> = ({
  records,
  onNewInspection,
  onViewRecord,
  onViewReports,
  selectedLocationFilter,
}) => {
  // Apply location filter if active
  const filteredRecords =
    selectedLocationFilter === 'ALL'
      ? records
      : records.filter((r) => r.locationId === selectedLocationFilter);

  // Compute Task KPIs
  let totalTasks = 0;
  let okCount = 0;
  let notOkCount = 0;
  let pendingCount = 0;
  let naCount = 0;
  let photoCount = 0;

  const categoryStats: Record<ChecklistCategory, { total: number; ok: number; notOk: number; pending: number }> = {
    Cleaning: { total: 0, ok: 0, notOk: 0, pending: 0 },
    MEP: { total: 0, ok: 0, notOk: 0, pending: 0 },
    Landscape: { total: 0, ok: 0, notOk: 0, pending: 0 },
  };

  filteredRecords.forEach((rec) => {
    rec.tasks.forEach((task) => {
      totalTasks++;
      if (task.status === 'OK') okCount++;
      if (task.status === 'Not OK') notOkCount++;
      if (task.status === 'Pending') pendingCount++;
      if (task.status === 'N/A') naCount++;
      photoCount += task.photos.length;

      if (categoryStats[task.category]) {
        categoryStats[task.category].total++;
        if (task.status === 'OK') categoryStats[task.category].ok++;
        if (task.status === 'Not OK') categoryStats[task.category].notOk++;
        if (task.status === 'Pending') categoryStats[task.category].pending++;
      }
    });
  });

  const okPercentage = totalTasks ? Math.round((okCount / totalTasks) * 100) : 0;
  const notOkPercentage = totalTasks ? Math.round((notOkCount / totalTasks) * 100) : 0;
  const pendingPercentage = totalTasks ? Math.round((pendingCount / totalTasks) * 100) : 0;

  return (
    <div className="space-[#111827] space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Site Quality & Safety Compliance Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Check list Executive Dashboard
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Real-time inspection tracking across 8 Site Zones including Zone 3 A&B (21 Buildings & 43 Villas). Category audits for Cleaning, MEP, and Landscape with mandatory photo evidence and timestamp logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNewInspection()}
              className="px-5 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-sky-500/25 transition flex items-center space-x-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Start New Audit</span>
            </button>

            <button
              onClick={onViewReports}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition flex items-center space-x-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-sky-400" />
              <span>Export PDF / CSV Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Tasks */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Tasks Checked</span>
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">{totalTasks}</div>
          <p className="text-xs text-slate-500 mt-1">Across {filteredRecords.length} inspection sessions</p>
        </div>

        {/* OK / Pass */}
        <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
            <span>OK (Passed)</span>
            <div className="p-2 bg-emerald-500 text-white rounded-lg shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-950">{okCount}</span>
            <span className="text-sm font-bold text-emerald-700">({okPercentage}%)</span>
          </div>
          <p className="text-xs text-emerald-800/80 mt-1">Verified compliant tasks</p>
        </div>

        {/* Not OK / Defect */}
        <div className="bg-rose-50/60 rounded-2xl p-5 border border-rose-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-rose-800 text-xs font-bold">
            <span>Not OK (Defects)</span>
            <div className="p-2 bg-rose-500 text-white rounded-lg shadow-xs">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-rose-950">{notOkCount}</span>
            <span className="text-sm font-bold text-rose-700">({notOkPercentage}%)</span>
          </div>
          <p className="text-xs text-rose-800/80 mt-1">Requires corrective action</p>
        </div>

        {/* Pending */}
        <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
            <span>Pending Action</span>
            <div className="p-2 bg-amber-500 text-white rounded-lg shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-amber-950">{pendingCount}</span>
            <span className="text-sm font-bold text-amber-700">({pendingPercentage}%)</span>
          </div>
          <p className="text-xs text-amber-800/80 mt-1">Followup scheduled</p>
        </div>

        {/* Attached Photos */}
        <div className="bg-sky-50/60 rounded-2xl p-5 border border-sky-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-sky-800 text-xs font-bold">
            <span>Photo Proofs</span>
            <div className="p-2 bg-sky-500 text-white rounded-lg shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-sky-950">{photoCount}</div>
          <p className="text-xs text-sky-800/80 mt-1">Timestamped evidence photos</p>
        </div>
      </div>

      {/* Category Breakdown: Cleaning, MEP, Landscape */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cleaning */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Cleaning Checklist</h3>
                <p className="text-xs text-slate-500">Janitorial & Sanitation Audits</p>
              </div>
            </div>
            <button
              onClick={() => onNewInspection(undefined, 'Cleaning')}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Start Cleaning Audit"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Audited Tasks: {categoryStats.Cleaning.total}</span>
              <span className="text-emerald-600 font-bold">
                {categoryStats.Cleaning.total
                  ? Math.round((categoryStats.Cleaning.ok / categoryStats.Cleaning.total) * 100)
                  : 0}
                % OK
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{
                  width: `${
                    categoryStats.Cleaning.total
                      ? (categoryStats.Cleaning.ok / categoryStats.Cleaning.total) * 100
                      : 0
                  }%`,
                }}
                className="bg-emerald-500 h-full"
              />
              <div
                style={{
                  width: `${
                    categoryStats.Cleaning.total
                      ? (categoryStats.Cleaning.notOk / categoryStats.Cleaning.total) * 100
                      : 0
                  }%`,
                }}
                className="bg-rose-500 h-full"
              />
              <div
                style={{
                  width: `${
                    categoryStats.Cleaning.total
                      ? (categoryStats.Cleaning.pending / categoryStats.Cleaning.total) * 100
                      : 0
                  }%`,
                }}
                className="bg-amber-500 h-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="bg-emerald-50 p-2 rounded-lg text-emerald-800 font-bold">
                {categoryStats.Cleaning.ok} OK
              </div>
              <div className="bg-rose-50 p-2 rounded-lg text-rose-800 font-bold">
                {categoryStats.Cleaning.notOk} Not OK
              </div>
              <div className="bg-amber-50 p-2 rounded-lg text-amber-800 font-bold">
                {categoryStats.Cleaning.pending} Pending
              </div>
            </div>
          </div>
        </div>

        {/* MEP */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">MEP Checklist</h3>
                <p className="text-xs text-slate-500">Mechanical, Electrical, Plumbing</p>
              </div>
            </div>
            <button
              onClick={() => onNewInspection(undefined, 'MEP')}
              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
              title="Start MEP Audit"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Audited Tasks: {categoryStats.MEP.total}</span>
              <span className="text-emerald-600 font-bold">
                {categoryStats.MEP.total
                  ? Math.round((categoryStats.MEP.ok / categoryStats.MEP.total) * 100)
                  : 0}
                % OK
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{
                  width: `${
                    categoryStats.MEP.total
                      ? (categoryStats.MEP.ok / categoryStats.MEP.total) * 100
                      : 0
                  }%`,
                }}
                className="bg-emerald-500 h-full"
              />
              <div
                style={{
                  width: `${
                    categoryStats.MEP.total
                      ? (categoryStats.MEP.notOk / categoryStats.MEP.total) * 100
                      : 0
                  }%`,
                }}
                className="bg-rose-500 h-full"
              />
              <div
                style={{
                  width: `${
                    categoryStats.MEP.total
                      ? (categoryStats.MEP.pending / categoryStats.MEP.total) * 100
                      : 0
                  }%`,
                }}
                className="bg-amber-500 h-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="bg-emerald-50 p-2 rounded-lg text-emerald-800 font-bold">
                {categoryStats.MEP.ok} OK
              </div>
              <div className="bg-rose-50 p-2 rounded-lg text-rose-800 font-bold">
                {categoryStats.MEP.notOk} Not OK
              </div>
              <div className="bg-amber-50 p-2 rounded-lg text-amber-800 font-bold">
                {categoryStats.MEP.pending} Pending
              </div>
            </div>
          </div>
        </div>

        {/* Landscape */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl font-bold">
                <Trees className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Landscape Checklist</h3>
                <p className="text-xs text-slate-500">Turf, Irrigation & Pool Audits</p>
              </div>
            </div>
            <button
              onClick={() => onNewInspection(undefined, 'Landscape')}
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
              title="Start Landscape Audit"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Audited Tasks: {categoryStats.Landscape.total}</span>
              <span className="text-emerald-600 font-bold">
                {categoryStats.Landscape.total
                  ? Math.round((categoryStats.Landscape.ok / categoryStats.Landscape.total) * 100)
                  : 0}
                % OK
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{
                  width: `${
                    categoryStats.Landscape.total
                      ? (categoryStats.Landscape.ok / categoryStats.Landscape.total) * 100
                      : 0
                  }%`,
                }}
                className="bg-emerald-500 h-full"
              />
              <div
                style={{
                  width: `${
                    categoryStats.Landscape.total
                      ? (categoryStats.Landscape.notOk / categoryStats.Landscape.total) * 100
                      : 0
                  }%`,
                }}
                className="bg-rose-500 h-full"
              />
              <div
                style={{
                  width: `${
                    categoryStats.Landscape.total
                      ? (categoryStats.Landscape.pending / categoryStats.Landscape.total) * 100
                      : 0
                  }%`,
                }}
                className="bg-amber-500 h-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="bg-emerald-50 p-2 rounded-lg text-emerald-800 font-bold">
                {categoryStats.Landscape.ok} OK
              </div>
              <div className="bg-rose-50 p-2 rounded-lg text-rose-800 font-bold">
                {categoryStats.Landscape.notOk} Not OK
              </div>
              <div className="bg-amber-50 p-2 rounded-lg text-amber-800 font-bold">
                {categoryStats.Landscape.pending} Pending
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categorized Site Locations Grid (The 8 requested locations) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-sky-600" />
              <span>Site Location Audit Matrix</span>
            </h2>
            <p className="text-xs text-slate-500">
              Specific zone status for all 8 site locations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LOCATIONS.map((loc) => {
            const locInspections = records.filter((r) => r.locationId === loc.id);
            let locTotal = 0;
            let locOk = 0;
            let locNotOk = 0;

            locInspections.forEach((r) => {
              r.tasks.forEach((t) => {
                locTotal++;
                if (t.status === 'OK') locOk++;
                if (t.status === 'Not OK') locNotOk++;
              });
            });

            return (
              <div
                key={loc.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-sky-300 transition shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                      {loc.code}
                    </span>
                    {locNotOk > 0 ? (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{locNotOk} Defect{locNotOk > 1 ? 's' : ''}</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        {locTotal > 0 ? 'Clear' : 'No Data'}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{loc.name}</h4>
                  {loc.buildingCount && loc.villaCount && (
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Includes 21 Buildings & 43 Villas
                    </p>
                  )}

                  <div className="mt-3 text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Recent Audits:</span>
                      <span className="font-semibold text-slate-800">{locInspections.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tasks Checked:</span>
                      <span className="font-semibold text-slate-800">{locTotal}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onNewInspection(loc.id)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center space-x-1"
                  >
                    <span>Audit This Zone</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Inspection Records List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Inspection Logs</h3>
            <p className="text-xs text-slate-500">Latest recorded site audits with timestamps</p>
          </div>
          <button
            onClick={onViewReports}
            className="text-xs font-semibold text-sky-600 hover:text-sky-800 hover:underline"
          >
            View All Reports →
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredRecords.slice(0, 5).map((rec) => {
            const hasNotOk = rec.tasks.some((t) => t.status === 'Not OK');
            const photoTotal = rec.tasks.reduce((acc, t) => acc + t.photos.length, 0);

            return (
              <div
                key={rec.id}
                onClick={() => onViewRecord(rec)}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-3 rounded-xl cursor-pointer transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{rec.title}</span>
                    <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 rounded-md">
                      {rec.referenceNo}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        rec.category === 'Cleaning'
                          ? 'bg-blue-100 text-blue-800'
                          : rec.category === 'MEP'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {rec.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rec.locationName} {rec.subLocation ? `(${rec.subLocation})` : ''}</span>
                    </span>
                    <span>•</span>
                    <span>Inspector: {rec.inspectorName}</span>
                    <span>•</span>
                    <span>Date: {rec.inspectionDate}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-auto">
                  {photoTotal > 0 && (
                    <span className="px-2.5 py-1 bg-sky-50 text-sky-700 text-xs font-semibold rounded-lg border border-sky-100 flex items-center space-x-1">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{photoTotal} Photo{photoTotal > 1 ? 's' : ''}</span>
                    </span>
                  )}

                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      hasNotOk
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {hasNotOk ? 'Defects Found' : 'Pass (OK)'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
