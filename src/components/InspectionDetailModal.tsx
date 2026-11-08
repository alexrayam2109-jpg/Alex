import React, { useState } from 'react';
import {
  X,
  Printer,
  Calendar,
  Building2,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  MinusCircle,
  Camera,
  MapPin,
  Sparkles,
  Wrench,
  Trees,
  FileCode,
} from 'lucide-react';
import { InspectionRecord, TaskStatus } from '../types';
import { triggerPrintReport, exportToHTML } from '../lib/exportUtils';

interface Props {
  record: InspectionRecord | null;
  onClose: () => void;
  onTaskStatusChange: (recordId: string, taskId: string, newStatus: TaskStatus) => void;
}

export const InspectionDetailModal: React.FC<Props> = ({
  record,
  onClose,
  onTaskStatusChange,
}) => {
  const [activePhotoUrl, setActivePhotoUrl] = useState<string | null>(null);

  if (!record) return null;

  const totalTasks = record.tasks.length;
  const okCount = record.tasks.filter((t) => t.status === 'OK').length;
  const notOkCount = record.tasks.filter((t) => t.status === 'Not OK').length;
  const pendingCount = record.tasks.filter((t) => t.status === 'Pending').length;
  const naCount = record.tasks.filter((t) => t.status === 'N/A').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-900 text-white">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-sky-500 text-slate-950 font-mono text-xs font-extrabold rounded-md">
                {record.referenceNo}
              </span>
              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                  record.category === 'Cleaning'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : record.category === 'MEP'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {record.category}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">{record.title}</h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                exportToHTML([record], {
                  locationId: 'ALL',
                  category: 'ALL',
                  status: 'ALL',
                  startDate: '',
                  endDate: '',
                  searchQuery: '',
                })
              }
              className="px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-semibold rounded-lg border border-sky-500/30 flex items-center space-x-1.5 transition"
              title="Download standalone HTML report"
            >
              <FileCode className="w-4 h-4" />
              <span>Export HTML</span>
            </button>
            <button
              onClick={() =>
                triggerPrintReport([record], {
                  locationId: 'ALL',
                  category: 'ALL',
                  status: 'ALL',
                  startDate: '',
                  endDate: '',
                  searchQuery: '',
                })
              }
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center space-x-1.5 transition"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">
                Site Location & Area
              </span>
              <span className="font-bold text-slate-900 text-sm flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>{record.locationName}</span>
              </span>
              {record.subLocation && (
                <span className="text-slate-600 font-medium block mt-0.5">
                  Sub-location: {record.subLocation}
                </span>
              )}
            </div>

            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">
                Inspector & Staff ID
              </span>
              <span className="font-bold text-slate-900 text-sm flex items-center space-x-1 mt-0.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>{record.inspectorName}</span>
              </span>
              {record.inspectorId && (
                <span className="text-slate-500 block mt-0.5">ID: {record.inspectorId}</span>
              )}
            </div>

            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">
                Audit Date & Time
              </span>
              <span className="font-bold text-slate-900 text-sm flex items-center space-x-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{record.inspectionDate}</span>
              </span>
              <span className="text-slate-500 block mt-0.5">
                Logged: {new Date(record.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Quick KPI summary pill row */}
          <div className="grid grid-cols-4 gap-3 text-center text-xs font-bold">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl">
              <div className="text-lg font-extrabold">{okCount}</div>
              <div className="text-[10px] uppercase">OK / Passed</div>
            </div>

            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-xl">
              <div className="text-lg font-extrabold">{notOkCount}</div>
              <div className="text-[10px] uppercase">Not OK (Defect)</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-xl">
              <div className="text-lg font-extrabold">{pendingCount}</div>
              <div className="text-[10px] uppercase">Pending</div>
            </div>

            <div className="bg-slate-100 border border-slate-200 text-slate-700 p-2.5 rounded-xl">
              <div className="text-lg font-extrabold">{naCount}</div>
              <div className="text-[10px] uppercase">N/A</div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Detailed Task Entries ({totalTasks})
            </h3>

            <div className="space-y-3">
              {record.tasks.map((task, idx) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{task.title}</h4>
                      </div>
                      {task.description && (
                        <p className="text-xs text-slate-500 pl-7">{task.description}</p>
                      )}
                    </div>

                    {/* Quick status selector */}
                    <div className="flex items-center space-x-1 self-start sm:self-auto">
                      {(['OK', 'Not OK', 'Pending', 'N/A'] as TaskStatus[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => onTaskStatusChange(record.id, task.id, st)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            task.status === st
                              ? st === 'OK'
                                ? 'bg-emerald-600 text-white'
                                : st === 'Not OK'
                                ? 'bg-rose-600 text-white'
                                : st === 'Pending'
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-700 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Remarks & Photo Proofs */}
                  <div className="pl-7 space-y-2 text-xs">
                    {task.remarks && (
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700">
                        <strong>Inspector Remarks:</strong> {task.remarks}
                      </div>
                    )}

                    <div className="text-slate-400 text-[11px] flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Timestamp: {new Date(task.timestamp).toLocaleString()}</span>
                    </div>

                    {/* Photos */}
                    {task.photos.length > 0 && (
                      <div className="pt-1">
                        <span className="font-semibold text-slate-700 text-[11px] block mb-1">
                          Attached Photos ({task.photos.length}):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {task.photos.map((pho) => (
                            <div
                              key={pho.id}
                              onClick={() => setActivePhotoUrl(pho.dataUrl)}
                              className="relative rounded-lg overflow-hidden border border-slate-200 bg-black w-24 h-18 cursor-pointer group shadow-xs hover:border-sky-500 transition"
                            >
                              <img
                                src={pho.dataUrl}
                                alt={pho.fileName}
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                                <Camera className="w-4 h-4" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* High-res Image Preview Overlay */}
      {activePhotoUrl && (
        <div
          onClick={() => setActivePhotoUrl(null)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl w-full max-h-[90vh] flex items-center justify-center">
            <img
              src={activePhotoUrl}
              alt="High res photo evidence"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-slate-800"
            />
            <button
              onClick={() => setActivePhotoUrl(null)}
              className="absolute top-4 right-4 p-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
