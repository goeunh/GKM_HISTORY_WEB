import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Loader2, Calendar, Type, AlignLeft, Layout, Palette, Sparkles } from 'lucide-react';
import { RoadmapSession } from '../types/history';

interface RoadmapFormProps {
  item?: Partial<RoadmapSession>;
  onSave: (item: Partial<RoadmapSession>) => Promise<void>;
  onClose: () => void;
}

const ICON_OPTIONS = [
  'Search', 'BookOpen', 'FileText', 'ArrowRight', 'CheckCircle2', 'Presentation', 'Calendar', 'Clock', 'Target'
];

const COLOR_OPTIONS = [
  { label: 'Indigo', value: 'bg-indigo-500' },
  { label: 'Amber', value: 'bg-amber-500' },
  { label: 'Emerald', value: 'bg-emerald-500' },
  { label: 'Rose', value: 'bg-rose-500' },
  { label: 'Sky', value: 'bg-sky-500' },
  { label: 'Violet', value: 'bg-violet-500' },
];

export default function RoadmapForm({ item, onSave, onClose }: RoadmapFormProps) {
  const [formData, setFormData] = useState<Partial<RoadmapSession>>({
    session_order: 1,
    date_label: '',
    title: '',
    description: '',
    icon_name: 'Search',
    color_class: 'bg-indigo-500',
    ...item
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("로드맵 저장 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10"
      >
        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {item?.id ? '로드맵 수정' : '새 로드맵 추가'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">탐구 여정의 차시 정보를 입력하세요.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Layout className="w-4 h-4 text-brand" /> 차시 순서
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.session_order}
                onChange={e => setFormData({ ...formData, session_order: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-brand" /> 시기 (예: 3월 초)
              </label>
              <input
                type="text"
                required
                placeholder="시기 입력"
                value={formData.date_label}
                onChange={e => setFormData({ ...formData, date_label: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <Type className="w-4 h-4 text-brand" /> 주제 (Title)
            </label>
            <input
              type="text"
              required
              placeholder="차시 주제 입력"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <AlignLeft className="w-4 h-4 text-brand" /> 상세 설명
            </label>
            <textarea
              required
              rows={4}
              placeholder="탐구 내용 및 활동 상세 설명"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-brand" /> 아이콘 선택
              </label>
              <select
                value={formData.icon_name}
                onChange={e => setFormData({ ...formData, icon_name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none transition-all"
              >
                {ICON_OPTIONS.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Palette className="w-4 h-4 text-brand" /> 테마 색상
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color_class: color.value })}
                    className={`w-8 h-8 rounded-full ${color.value} transition-all ${formData.color_class === color.value ? 'ring-4 ring-brand/30 scale-110' : 'opacity-60 hover:opacity-100'}`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] px-6 py-4 bg-brand text-white rounded-2xl font-bold hover:bg-brand-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {item?.id ? '수정 사항 저장' : '로드맵 등록'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
