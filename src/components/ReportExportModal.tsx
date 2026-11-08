import React, { useState, useMemo } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  MinusCircle,
  Filter,
  Camera,
  MapPin,
  Sparkles,
  FileCode,
  Eye,
  Code,
  Copy,
  Check,
} from 'lucide-react';
import { InspectionRecord, ReportFilter } from '../types';
import { LOCATIONS, getLocationName } from '../data/locations';
import {
  filterRecords,
  exportToCSV,
  exportToJSON,
  triggerPrintReport,
  exportToHTML,
  generateReportHTML,
} from '../lib/exportUtils';

interface Props {
  records: InspectionRecord[];
  initialLocationId?: string;
  onClose: () => void;
}

export const ReportExportModal: React.FC<Props> = ({
  records,
  initialLocationId = 'ALL',
  onClose,
}) => {
  const [locationId, setLocationId] = useState<string>(initialLocationId);
  const [category, setCategory] = useState<string>('ALL');
  const [status, setStatus] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // HTML Report Modal & View Mode
  const [showHtmlPreview, setShowHtmlPreview] = useState<boolean>(false);
  const [htmlTab, setHtmlTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState<boolean>(false);

  const currentFilters: ReportFilter = {
    locationId,
    category,
    status,
    startDate,
    endDate,
    searchQuery,
  };

  const filtered = filterRecords(records, currentFilters);

  const generatedHtml = useMemo(() => {
    return generateReportHTML(records, currentFilters);
  }, [records, currentFilters]);

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(generatedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Calculate live breakdown stats
  let totalTasks = 0;
  let okCount = 0;
  let notOkCount = 0;
  let pendingCount = 0;
  let naCount = 0;
  let totalPhotos = 0;

  filtered.forEach((rec) => {
    rec.tasks.forEach((t) => {
      if (status !== 'ALL' && t.status !== status) return;
      totalTasks++;
      if (t.status === 'OK') okCount++;
      if (t.status === 'Not OK') notOkCount++;
      if (t.status === 'Pending') pendingCount++;
      if (t.status === 'N/A') naCount++;
      totalPhotos += t.photos.length;
    });
  });

  const okPct = totalTasks ? Math.round((okCount / totalTasks) * 100) : 0;
  const notOkPct = totalTasks ? Math.round((notOkCount / totalTasks) * 100) : 0;
  const pendingPct = totalTasks ? Math.round((pendingCount / totalTasks) * 100) : 0;
  const naPct = totalTasks ? Math.round((naCount / totalTasks) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full my-6 overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-sky-500 text-slate-950 rounded-xl font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Generate Audit Report</h2>
              <p className="text-xs text-slate-400">
                Categorized by site location, date range, category, status & photo proofs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
          >
            Close
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Filters Configuration Box */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <Filter className="w-4 h-4 text-sky-600" />
                <span>Configure Categorized Report Filters</span>
              </span>

              {(locationId !== 'ALL' || category !== 'ALL' || status !== 'ALL' || startDate || endDate) && (
                <button
                  onClick={() => {
                    setLocationId('ALL');
                    setCategory('ALL');
                    setStatus('ALL');
                    setStartDate('');
                    setEndDate('');
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-sky-600 hover:text-sky-800"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Site Location Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  <span>Site Location</span>
                </label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none cursor-pointer"
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
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Checklist Scope
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none cursor-pointer"
                >
                  <option value="ALL">All Categories (Cleaning, MEP, Landscape)</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="MEP">MEP</option>
                  <option value="Landscape">Landscape</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Task Status Filter
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none cursor-pointer"
                >
                  <option value="ALL">All Task Statuses</option>
                  <option value="OK">OK (Pass)</option>
                  <option value="Not OK">Not OK (Defect)</option>
                  <option value="Pending">Pending Action</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Keyword Search
                </label>
                <input
                  type="text"
                  placeholder="Task title, inspector, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Start Date</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>End Date</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Live Executive KPI Summary Preview */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
              Filtered Executive Summary Statistics
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="bg-slate-100 border border-slate-200 p-3 rounded-xl">
                <div className="text-2xl font-extrabold text-slate-900">{totalTasks}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">Total Audit Tasks</div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-900">
                <div className="text-2xl font-extrabold text-emerald-700">{okCount}</div>
                <div className="text-[11px] font-bold text-emerald-600">{okPct}%</div>
                <div className="text-[10px] font-bold uppercase mt-0.5">OK (Passed)</div>
              </div>

              <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-900">
                <div className="text-2xl font-extrabold text-rose-700">{notOkCount}</div>
                <div className="text-[11px] font-bold text-rose-600">{notOkPct}%</div>
                <div className="text-[10px] font-bold uppercase mt-0.5">Not OK (Defect)</div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900">
                <div className="text-2xl font-extrabold text-amber-700">{pendingCount}</div>
                <div className="text-[11px] font-bold text-amber-600">{pendingPct}%</div>
                <div className="text-[10px] font-bold uppercase mt-0.5">Pending Action</div>
              </div>

              <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl text-sky-900 col-span-2 sm:col-span-1">
                <div className="text-2xl font-extrabold text-sky-700">{totalPhotos}</div>
                <div className="text-[10px] font-bold text-sky-600 uppercase mt-1">Photos Attached</div>
              </div>
            </div>
          </div>

          {/* Export Buttons Action Panel */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-sky-500/20 text-sky-400 font-mono text-[10px] uppercase font-bold rounded">
                    HTML • PDF • CSV • JSON
                  </span>
                  <h3 className="text-base font-extrabold text-white">Export &amp; Share Options</h3>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Download standalone self-contained HTML documents, printable audit reports, or raw spreadsheets
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* HTML Export Button */}
                <button
                  type="button"
                  onClick={() => exportToHTML(records, currentFilters)}
                  className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center space-x-2"
                >
                  <FileCode className="w-4 h-4" />
                  <span>Download HTML (.html)</span>
                </button>

                {/* Preview HTML Modal Button */}
                <button
                  type="button"
                  onClick={() => setShowHtmlPreview(true)}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 font-bold text-xs rounded-xl transition flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview HTML</span>
                </button>

                {/* Print PDF Button */}
                <button
                  type="button"
                  onClick={() => triggerPrintReport(records, currentFilters)}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition flex items-center space-x-2"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Print / PDF</span>
                </button>

                {/* CSV Export Button */}
                <button
                  type="button"
                  onClick={() => exportToCSV(records, currentFilters)}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition flex items-center space-x-2"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>CSV</span>
                </button>

                {/* JSON Backup Button */}
                <button
                  type="button"
                  onClick={() => exportToJSON(records)}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 font-semibold text-xs rounded-xl transition"
                >
                  JSON
                </button>
              </div>
            </div>
          </div>

          {/* Report Preview Breakdown List */}
          <div className="space-y-3 pt-2">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Matched Inspection Sessions ({filtered.length})
            </h4>

            <div className="space-y-3">
              {filtered.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white text-xs space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">
                      {rec.referenceNo} - {rec.title}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded">
                      {rec.category}
                    </span>
                  </div>

                  <div className="text-slate-500 flex flex-wrap gap-4">
                    <span>📍 <strong>Location:</strong> {rec.locationName} {rec.subLocation ? `(${rec.subLocation})` : ''}</span>
                    <span>📅 <strong>Date:</strong> {rec.inspectionDate}</span>
                    <span>👤 <strong>Inspector:</strong> {rec.inspectorName}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">
                      Tasks: <strong>{rec.tasks.length}</strong> items checked
                    </span>
                    <span
                      className={`font-bold ${
                        rec.overallStatus === 'Pass'
                          ? 'text-emerald-600'
                          : rec.overallStatus === 'Fail'
                          ? 'text-rose-600'
                          : 'text-amber-600'
                      }`}
                    >
                      Status: {rec.overallStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HTML Report Interactive Viewer Overlay Modal */}
      {showHtmlPreview && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-slate-950 text-white border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Standalone HTML Audit Report</h3>
                  <p className="text-xs text-slate-400">
                    Self-contained HTML with styling, KPIs, status pills &amp; photos
                  </p>
                </div>
              </div>

              {/* View Switcher & Action buttons */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setHtmlTab('preview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                      htmlTab === 'preview'
                        ? 'bg-sky-500 text-slate-950 shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visual HTML</span>
                  </button>
                  <button
                    onClick={() => setHtmlTab('code')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                      htmlTab === 'code'
                        ? 'bg-sky-500 text-slate-950 shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>HTML Code</span>
                  </button>
                </div>

                <button
                  onClick={handleCopyHtml}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition"
                  title="Copy full HTML source"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied HTML!' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={() => exportToHTML(records, currentFilters)}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .html</span>
                </button>

                <button
                  onClick={() => triggerPrintReport(records, currentFilters)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1 transition"
                  title="Print"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setShowHtmlPreview(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 text-xs font-bold rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 bg-slate-100 overflow-hidden relative">
              {htmlTab === 'preview' ? (
                <iframe
                  title="HTML Report Visual Preview"
                  srcDoc={generatedHtml}
                  className="w-full h-full border-0 bg-white"
                />
              ) : (
                <div className="h-full flex flex-col p-4 bg-slate-900 text-slate-200 font-mono text-xs overflow-auto">
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                    <span>Full HTML Source ({generatedHtml.length} characters)</span>
                    <button
                      onClick={handleCopyHtml}
                      className="text-sky-400 hover:text-sky-300 font-semibold"
                    >
                      {copied ? '✓ Copied to clipboard' : 'Click to copy all'}
                    </button>
                  </div>
                  <pre className="flex-1 overflow-auto whitespace-pre font-mono text-[11px] leading-relaxed text-sky-100 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <code>{generatedHtml}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
