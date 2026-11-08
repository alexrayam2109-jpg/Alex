import React, { useState } from 'react';
import {
  Check,
  X,
  Clock,
  MinusCircle,
  Plus,
  Trash2,
  Camera,
  Save,
  ArrowLeft,
  Sparkles,
  Wrench,
  Trees,
  MapPin,
  Calendar,
  User,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import {
  InspectionRecord,
  InspectionTask,
  ChecklistCategory,
  TaskStatus,
  PhotoAttachment,
} from '../types';
import { LOCATIONS, ZONE3_BUILDINGS, ZONE3_VILLAS, getLocationName } from '../data/locations';
import { getTemplatesByCategory } from '../data/checklistTemplates';
import { PhotoCaptureModal } from './PhotoCaptureModal';

interface Props {
  initialLocationId?: string;
  initialCategory?: ChecklistCategory;
  onSaveRecord: (record: InspectionRecord) => void;
  onCancel: () => void;
}

export const InspectionForm: React.FC<Props> = ({
  initialLocationId = 'z1-fm',
  initialCategory = 'Cleaning' as ChecklistCategory,
  onSaveRecord,
  onCancel,
}) => {
  const [category, setCategory] = useState<ChecklistCategory>(initialCategory);
  const [locationId, setLocationId] = useState<string>(initialLocationId);
  const [subLocation, setSubLocation] = useState<string>('');
  const [inspectorName, setInspectorName] = useState<string>('Alex Mercer');
  const [inspectorId, setInspectorId] = useState<string>('EMP-4091');
  const [inspectionDate, setInspectionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [auditTitle, setAuditTitle] = useState<string>(
    `${category} Site Inspection - ${getLocationName(locationId)}`
  );

  // Task Items State
  const [tasks, setTasks] = useState<InspectionTask[]>(() => {
    const templates = getTemplatesByCategory(initialCategory);
    return templates.map((tmpl) => ({
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category: initialCategory,
      title: tmpl.title,
      description: tmpl.description,
      status: 'OK' as TaskStatus,
      remarks: '',
      photos: [],
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }));
  });

  // Photo modal control
  const [photoModalOpen, setPhotoModalOpen] = useState<boolean>(false);
  const [activeTaskIdForPhoto, setActiveTaskIdForPhoto] = useState<string | null>(null);

  // Load standard template items for selected category
  const loadCategoryTemplates = (cat: ChecklistCategory) => {
    setCategory(cat);
    const templates = getTemplatesByCategory(cat);
    const newTasks: InspectionTask[] = templates.map((tmpl) => ({
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category: cat,
      title: tmpl.title,
      description: tmpl.description,
      status: 'OK' as TaskStatus,
      remarks: '',
      photos: [],
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }));
    setTasks(newTasks);
    setAuditTitle(`${cat} Site Audit - ${getLocationName(locationId)}`);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status,
              lastUpdated: new Date().toISOString(),
            }
          : t
      )
    );
  };

  const updateTaskRemarks = (taskId: string, remarks: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, remarks } : t))
    );
  };

  const handleAddPhotoToTask = (photo: PhotoAttachment) => {
    if (!activeTaskIdForPhoto) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === activeTaskIdForPhoto
          ? { ...t, photos: [...t.photos, photo], lastUpdated: new Date().toISOString() }
          : t
      )
    );
  };

  const removePhotoFromTask = (taskId: string, photoId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, photos: t.photos.filter((p) => p.id !== photoId) }
          : t
      )
    );
  };

  const addCustomTaskItem = () => {
    const title = prompt('Enter custom inspection item title:');
    if (!title?.trim()) return;

    const newTask: InspectionTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category,
      title: title.trim(),
      description: 'Custom added task item',
      status: 'OK',
      remarks: '',
      photos: [],
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const removeTaskItem = (taskId: string) => {
    if (tasks.length <= 1) {
      alert('Must have at least one checklist item.');
      return;
    }
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!auditTitle.trim()) {
      alert('Please enter an inspection title.');
      return;
    }

    const hasNotOk = tasks.some((t) => t.status === 'Not OK');
    const hasPending = tasks.some((t) => t.status === 'Pending');
    const overallStatus = hasNotOk ? 'Fail' : hasPending ? 'In Progress' : 'Pass';

    const refNo = `CHK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const record: InspectionRecord = {
      id: `rec-${Date.now()}`,
      referenceNo: refNo,
      title: auditTitle.trim(),
      category,
      locationId,
      locationName: getLocationName(locationId),
      subLocation: subLocation.trim() || undefined,
      inspectorName: inspectorName.trim() || 'Unassigned Inspector',
      inspectorId: inspectorId.trim() || undefined,
      inspectionDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks,
      overallStatus,
    };

    onSaveRecord(record);
  };

  const currentLocationConfig = LOCATIONS.find((l) => l.id === locationId);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-xs flex items-center space-x-2 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-full border border-sky-200">
          New Audit Entry
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Configuration Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Create Site Inspection Audit
              </h1>
              <p className="text-xs text-slate-500">
                Log task statuses, photos, and timestamps across site locations
              </p>
            </div>

            {/* Category Selectors */}
            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => loadCategoryTemplates('Cleaning')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                  category === 'Cleaning'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cleaning</span>
              </button>

              <button
                type="button"
                onClick={() => loadCategoryTemplates('MEP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                  category === 'MEP'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>MEP</span>
              </button>

              <button
                type="button"
                onClick={() => loadCategoryTemplates('Landscape')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                  category === 'Landscape'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Trees className="w-3.5 h-3.5" />
                <span>Landscape</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Audit Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Audit Session Title
              </label>
              <input
                type="text"
                required
                value={auditTitle}
                onChange={(e) => setAuditTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>

            {/* Location Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>Site Location (Categorized Zone)</span>
              </label>
              <select
                value={locationId}
                onChange={(e) => {
                  setLocationId(e.target.value);
                  setSubLocation('');
                  setAuditTitle(`${category} Audit - ${getLocationName(e.target.value)}`);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none cursor-pointer"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-Location Selector (Zone 3 A&B special options or custom text) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Sub-Location / Building / Villa ID
              </label>
              {currentLocationConfig?.subType === 'buildings_and_villas' ? (
                <div className="flex gap-2">
                  <select
                    value={subLocation}
                    onChange={(e) => setSubLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  >
                    <option value="">Select Building (1-21) or Villa (1-43)...</option>
                    <optgroup label="Zone 3 Buildings (1 - 21)">
                      {ZONE3_BUILDINGS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Zone 3 Villas (1 - 43)">
                      {ZONE3_VILLAS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="e.g. Ground Floor, Pump Room 2, West Terrace"
                  value={subLocation}
                  onChange={(e) => setSubLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              )}
            </div>

            {/* Inspector Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Inspector / Auditor Name</span>
              </label>
              <input
                type="text"
                required
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Inspection Date</span>
              </label>
              <input
                type="date"
                required
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Task Items Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-sky-600" />
                <span>Audit Task Checklist Items ({tasks.length})</span>
              </h2>
              <p className="text-xs text-slate-500">Set status: OK, Not OK, Pending, N/A with photos & timestamps</p>
            </div>

            <button
              type="button"
              onClick={addCustomTaskItem}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Task</span>
            </button>
          </div>

          <div className="space-y-4">
            {tasks.map((task, idx) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition ${
                  task.status === 'OK'
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : task.status === 'Not OK'
                    ? 'border-rose-200 bg-rose-50/20'
                    : task.status === 'Pending'
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-slate-200 bg-slate-50/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Task Description */}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{task.title}</h4>
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-500 pl-8">{task.description}</p>
                    )}
                  </div>

                  {/* Status Toggle Buttons (OK, Not OK, Pending, N/A) */}
                  <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 self-start">
                    <button
                      type="button"
                      onClick={() => updateTaskStatus(task.id, 'OK')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center space-x-1 transition ${
                        task.status === 'OK'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>OK</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateTaskStatus(task.id, 'Not OK')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center space-x-1 transition ${
                        task.status === 'Not OK'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Not OK</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateTaskStatus(task.id, 'Pending')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center space-x-1 transition ${
                        task.status === 'Pending'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateTaskStatus(task.id, 'N/A')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center space-x-1 transition ${
                        task.status === 'N/A'
                          ? 'bg-slate-700 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <MinusCircle className="w-3.5 h-3.5" />
                      <span>N/A</span>
                    </button>
                  </div>
                </div>

                {/* Timestamp & Controls Row */}
                <div className="mt-3 pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-slate-100/80 pt-3">
                  <div className="text-slate-500 flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Timestamp: <strong>{new Date(task.lastUpdated).toLocaleTimeString()}</strong> (
                      {new Date(task.lastUpdated).toLocaleDateString()})
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTaskIdForPhoto(task.id);
                        setPhotoModalOpen(true);
                      }}
                      className="px-3 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 font-bold rounded-lg flex items-center space-x-1 transition"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>+ Attach Photo ({task.photos.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => removeTaskItem(task.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                      title="Remove task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Remarks & Photo Proofs */}
                <div className="mt-3 pl-8 space-y-3">
                  <input
                    type="text"
                    placeholder="Inspector remarks / findings / defect details..."
                    value={task.remarks || ''}
                    onChange={(e) => updateTaskRemarks(task.id, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  />

                  {/* Photos Grid */}
                  {task.photos.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-1">
                      {task.photos.map((pho) => (
                        <div
                          key={pho.id}
                          className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 w-28 h-20 shadow-xs"
                        >
                          <img
                            src={pho.dataUrl}
                            alt={pho.fileName}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhotoFromTask(task.id, pho.id)}
                            className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {pho.caption && (
                            <div className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] text-white px-1.5 py-0.5 truncate">
                              {pho.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-sky-500/20 transition flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Inspection Audit</span>
          </button>
        </div>
      </form>

      {/* Camera/Upload Photo Modal */}
      <PhotoCaptureModal
        isOpen={photoModalOpen}
        onClose={() => {
          setPhotoModalOpen(false);
          setActiveTaskIdForPhoto(null);
        }}
        onAddPhoto={handleAddPhotoToTask}
      />
    </div>
  );
};
