import React, { useState } from 'react';
import { Sparkles, Wrench, Trees, Plus, Trash2, Check, Settings, Info } from 'lucide-react';
import { TemplateItem, ChecklistCategory } from '../types';
import { DEFAULT_TEMPLATES } from '../data/checklistTemplates';

export const TemplateManager: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ChecklistCategory>('Cleaning');
  const [templates, setTemplates] = useState<TemplateItem[]>(DEFAULT_TEMPLATES);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const currentCategoryItems = templates.filter((t) => t.category === activeCategory);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: TemplateItem = {
      id: `tmpl-${Date.now()}`,
      category: activeCategory,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Standard audit task',
    };

    setTemplates((prev) => [...prev, newItem]);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteItem = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <Settings className="w-5 h-5 text-sky-600" />
          <span>Checklist Preset Templates</span>
        </h1>
        <p className="text-xs text-slate-500">
          Standard inspection item templates pre-populated for Cleaning, MEP, and Landscape
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveCategory('Cleaning')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
            activeCategory === 'Cleaning'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Cleaning Checklist ({templates.filter((t) => t.category === 'Cleaning').length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('MEP')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
            activeCategory === 'MEP'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>MEP Checklist ({templates.filter((t) => t.category === 'MEP').length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('Landscape')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
            activeCategory === 'Landscape'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Trees className="w-4 h-4" />
          <span>Landscape Checklist ({templates.filter((t) => t.category === 'Landscape').length})</span>
        </button>
      </div>

      {/* Add Template Item Form */}
      <form onSubmit={handleAddItem} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Add New Standard {activeCategory} Item</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            required
            placeholder="Item title (e.g. Inspect HVAC FCU Air Filter)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-sky-500 outline-none"
          />

          <input
            type="text"
            placeholder="Task description / inspection standard details..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Template Item</span>
        </button>
      </form>

      {/* Existing Items List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-700">
          Standard {activeCategory} Inspection Items ({currentCategoryItems.length})
        </div>

        <div className="divide-y divide-slate-100">
          {currentCategoryItems.map((item, idx) => (
            <div key={item.id} className="p-4 flex items-start justify-between gap-3 hover:bg-slate-50/80 transition">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                </div>
                <p className="text-xs text-slate-500 pl-7">{item.description}</p>
              </div>

              <button
                onClick={() => handleDeleteItem(item.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                title="Remove Template"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
