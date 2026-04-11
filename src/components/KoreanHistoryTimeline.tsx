import React, { useState } from 'react';
import { TimelineItem } from '../types/history';
import { Search, Archive } from 'lucide-react';
import TimelineItemCard from './TimelineItemCard';

interface KoreanHistoryTimelineProps {
  items: TimelineItem[];
  isAdmin?: boolean;
  onEdit?: (item: TimelineItem) => void;
  onDelete?: (id: string) => void;
}

export default function KoreanHistoryTimeline({ items, isAdmin, onEdit, onDelete }: KoreanHistoryTimelineProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const year = (item.year || '').toString().toLowerCase();
    const title = (item.title || '').toString().toLowerCase();
    const summary = (item.summary || '').toString().toLowerCase();

    return year.includes(searchLower) || title.includes(searchLower) || summary.includes(searchLower);
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center">
            <Archive className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold">미시적 분석 (Micro Analysis)</h3>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-300" />
          <input
            type="text"
            placeholder="연도 또는 키워드 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all backdrop-blur-md"
          />
        </div>
      </div>

      <div className="flex flex-col">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, idx) => (
            <TimelineItemCard 
              key={item.id}
              item={item}
              index={idx}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
              initialX={20}
            />
          ))
        ) : (
          <div className="py-12 text-center text-slate-400 dark:text-slate-300 italic glass-card rounded-[24px]">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
