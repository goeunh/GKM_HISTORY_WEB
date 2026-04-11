import React, { useState } from 'react';
import { TimelineItem, HistoryType } from '../types/history';
import { X, Save, Loader2, Sparkles, Zap, ShieldCheck, Scale } from 'lucide-react';

interface TimelineFormProps {
  item: Partial<TimelineItem> | null;
  onSave: (item: Partial<TimelineItem>) => Promise<void>;
  onClose: () => void;
}

export default function TimelineForm({ item, onSave, onClose }: TimelineFormProps) {
  const [formData, setFormData] = useState<Partial<TimelineItem>>(item || {
    type: 'WORLD',
    year: '',
    title: '',
    summary: '',
    hypothesis: '',
    evidence: '',
    conclusion: '',
    impact: '',
    fact_check: '',
    critical_opinion: '',
    sort_year: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
      <div className="glass-card w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border-slate-200 dark:border-slate-800">
        <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {item?.id ? 'Edit Research' : 'Add New Research'}
            </h3>
          </div>
          <button onClick={onClose} className="p-3 bg-white dark:bg-slate-800 hover:bg-brand hover:text-white rounded-2xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Category</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as HistoryType})}
                className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                required
              >
                <option value="WORLD">World History</option>
                <option value="KOREA">Korean History</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Year / Period</label>
              <input 
                type="text" 
                value={formData.year}
                onChange={e => setFormData({...formData, year: e.target.value})}
                placeholder="e.g. 1894"
                className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Sort Year (Number, B.C. is negative)</label>
              <input 
                type="number" 
                value={formData.sort_year}
                onChange={e => setFormData({...formData, sort_year: parseInt(e.target.value) || 0})}
                className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Research Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand/20 outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Summary</label>
            <textarea 
              value={formData.summary}
              onChange={e => setFormData({...formData, summary: e.target.value})}
              className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand/20 outline-none transition-all h-24"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 bg-brand/5 rounded-[32px] border border-brand/10">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-brand uppercase tracking-widest">Hypothesis</label>
              <textarea 
                value={formData.hypothesis}
                onChange={e => setFormData({...formData, hypothesis: e.target.value})}
                className="w-full p-3 bg-white dark:bg-slate-800 border border-brand/20 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-brand uppercase tracking-widest">Evidence Analysis</label>
              <textarea 
                value={formData.evidence}
                onChange={e => setFormData({...formData, evidence: e.target.value})}
                className="w-full p-3 bg-white dark:bg-slate-800 border border-brand/20 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-amber-500 uppercase tracking-widest">Core Impact</label>
              <textarea 
                value={formData.impact}
                onChange={e => setFormData({...formData, impact: e.target.value})}
                className="w-full p-3 bg-white dark:bg-slate-800 border border-amber-500/20 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-brand uppercase tracking-widest">Conclusion</label>
              <textarea 
                value={formData.conclusion}
                onChange={e => setFormData({...formData, conclusion: e.target.value})}
                className="w-full p-3 bg-white dark:bg-slate-800 border border-brand/20 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-blue-500 uppercase tracking-widest">Fact Check</label>
              <textarea 
                value={formData.fact_check}
                onChange={e => setFormData({...formData, fact_check: e.target.value})}
                className="w-full p-3 bg-white dark:bg-slate-800 border border-blue-500/20 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-purple-500 uppercase tracking-widest">Critical Opinion</label>
              <textarea 
                value={formData.critical_opinion}
                onChange={e => setFormData({...formData, critical_opinion: e.target.value})}
                className="w-full p-3 bg-white dark:bg-slate-800 border border-purple-500/20 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-[20px] font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Research
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
