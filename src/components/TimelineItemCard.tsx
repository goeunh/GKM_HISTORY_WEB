import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TimelineItem } from '../types/history';
import { ChevronDown, Edit2, Trash2, BookOpen, Lightbulb, CheckCircle, Sparkles, Zap, ShieldCheck, Scale, History, Globe } from 'lucide-react';

interface TimelineItemCardProps {
  key?: string | number;
  item: TimelineItem;
  isAdmin?: boolean;
  onEdit?: (item: TimelineItem) => void;
  onDelete?: (id: string) => void;
  index: number;
  initialX?: number;
}

export default function TimelineItemCard({ 
  item, 
  isAdmin, 
  onEdit, 
  onDelete, 
  index,
  initialX = -20
}: TimelineItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative pl-8 md:pl-12 pb-12 last:pb-0 group/timeline">
      {/* Timeline Line */}
      <div className="absolute left-[11px] md:left-[15px] top-0 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-800/50 group-last/timeline:h-3" />
      
      {/* Timeline Dot */}
      <motion.div 
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        className={`absolute left-0 top-3 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-white dark:border-slate-950 z-10 transition-all duration-500 flex items-center justify-center ${
          isExpanded 
            ? 'bg-brand shadow-[0_0_25px_rgba(79,70,229,0.5)] scale-125' 
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 group-hover/timeline:border-brand group-hover/timeline:scale-110 shadow-md'
        }`}
      >
        {/* Inner Core for better visibility */}
        <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-500 ${
          isExpanded ? 'bg-white scale-110' : 'bg-slate-300 dark:bg-slate-600 group-hover/timeline:bg-brand'
        }`} />
        
        {/* Pulse Effect */}
        <div className={`absolute inset-0 rounded-full animate-ping bg-brand/20 transition-opacity duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover/timeline:opacity-100'}`} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: initialX }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05, duration: 0.5 }}
        viewport={{ once: true }}
        className={`group relative glass-card rounded-[32px] transition-all duration-500 border-slate-200 dark:border-slate-800 overflow-hidden ${
          isExpanded 
            ? 'ring-1 ring-brand/30 shadow-2xl shadow-brand/10 translate-x-1' 
            : 'hover:shadow-xl hover:shadow-brand/5 hover:-translate-y-1'
        }`}
      >
        {/* Header / Summary View */}
        <div 
          className="p-6 md:p-8 cursor-pointer relative overflow-hidden"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Background Accent for Expanded State */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent pointer-events-none"
              />
            )}
          </AnimatePresence>

          <div className="flex justify-between items-start gap-6 relative z-10">
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 ${
                  item.type === 'KOREA' 
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' 
                    : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
                }`}>
                  {item.type === 'KOREA' ? <History className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                  {item.type} History
                </div>
                
                <span className={`font-mono font-bold text-sm md:text-base tracking-tight transition-colors duration-300 ${isExpanded ? 'text-brand' : 'text-slate-500 dark:text-slate-400'}`}>
                  {item.year}
                </span>

                {isExpanded && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1 px-2.5 py-1 bg-brand text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-brand/20"
                  >
                    <Sparkles className="w-3 h-3" />
                    In-Depth Analysis
                  </motion.span>
                )}
              </div>

              <h4 className={`text-2xl md:text-3xl font-extrabold leading-tight transition-all duration-300 ${
                isExpanded 
                  ? 'text-slate-900 dark:text-white' 
                  : 'text-slate-800 dark:text-slate-200 group-hover:text-brand'
              }`}>
                {item.title}
              </h4>

              {!isExpanded && (
                <p className="text-base text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed max-w-3xl font-medium">
                  {item.summary}
                </p>
              )}
            </div>

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm flex-shrink-0 ${
              isExpanded 
                ? 'bg-brand text-white rotate-180 shadow-brand/30' 
                : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 group-hover:border-brand/30 group-hover:text-brand'
            }`}>
              <ChevronDown className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-6 md:px-8 pb-10 space-y-10 border-t border-slate-100 dark:border-slate-800/50 pt-10 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-950">
                <div className="space-y-10">
                  {/* Summary for Expanded State */}
                  <div className="space-y-3">
                    <h5 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Research Overview</h5>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {item.summary}
                    </p>
                  </div>

                  {/* Info Bento */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="glass-card p-6 rounded-[28px] border-slate-200/60 dark:border-slate-800/60 space-y-4 hover:border-brand/30 transition-colors group/card">
                      <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center group-hover/card:scale-110 transition-transform">
                        <Lightbulb className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Hypothesis</h5>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                          {item.hypothesis}
                        </p>
                      </div>
                    </div>

                    <div className="glass-card p-6 rounded-[28px] border-slate-200/60 dark:border-slate-800/60 space-y-4 hover:border-amber-500/30 transition-colors group/card">
                      <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center group-hover/card:scale-110 transition-transform">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Core Impact</h5>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                          {item.impact}
                        </p>
                      </div>
                    </div>

                    <div className="glass-card p-6 rounded-[28px] border-slate-200/60 dark:border-slate-800/60 space-y-4 hover:border-green-500/30 transition-colors group/card">
                      <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center group-hover/card:scale-110 transition-transform">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Conclusion</h5>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                          {item.conclusion}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="glass-card p-7 rounded-[32px] border-blue-500/20 bg-blue-500/[0.02] space-y-4 relative overflow-hidden group/fact">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                      <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center relative z-10">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div className="space-y-2 relative z-10">
                        <h5 className="font-extrabold text-blue-600 dark:text-blue-400 text-sm uppercase tracking-wider">Fact Check</h5>
                        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed italic font-medium">
                          {item.fact_check}
                        </p>
                      </div>
                    </div>

                    <div className="glass-card p-7 rounded-[32px] border-purple-500/20 bg-purple-500/[0.02] space-y-4 relative overflow-hidden group/opinion">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                      <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center relative z-10">
                        <Scale className="w-6 h-6" />
                      </div>
                      <div className="space-y-2 relative z-10">
                        <h5 className="font-extrabold text-purple-600 dark:text-purple-400 text-sm uppercase tracking-wider">Critical Opinion</h5>
                        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          {item.critical_opinion}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-8 rounded-[32px] border-slate-200 dark:border-slate-800/60 space-y-6 relative group/source">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <h5 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">Source Evidence Analysis</h5>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-brand rounded-full opacity-50" />
                      <p className="pl-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-serif italic">
                        "{item.evidence}"
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center pt-6">
                  <button 
                    onClick={() => setIsExpanded(false)}
                    className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] hover:bg-brand hover:text-white transition-all duration-300"
                  >
                    <ChevronDown className="w-4 h-4 rotate-180 group-hover:-translate-y-0.5 transition-transform" />
                    Collapse Analysis
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Actions */}
        {isAdmin && (
          <div className={`absolute top-4 right-14 flex gap-2 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit?.(item); }}
              className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete?.(item.id); }}
              className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
