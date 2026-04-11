import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, CheckCircle2, ArrowRight, BookOpen, Search, FileText, Presentation, Sparkles, Clock, Target, Loader2, ChevronDown, ChevronUp, Plus, Edit2, Trash2 } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { RoadmapSession } from '../types/history';
import RoadmapForm from './RoadmapForm';

// 아이콘 매핑 객체
const ICON_MAP: Record<string, any> = {
  Search, BookOpen, FileText, ArrowRight, CheckCircle2, Presentation, Calendar, Clock, Target
};

interface ProjectRoadmapProps {
  isAdmin?: boolean;
}

export default function ProjectRoadmap({ isAdmin }: ProjectRoadmapProps) {
  const [sessions, setSessions] = useState<RoadmapSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(1); // 첫 번째 차시 기본 확장
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Partial<RoadmapSession> | undefined>();

  const fetchRoadmap = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .order('session_order', { ascending: true });
      
      if (error) throw error;
      if (data) {
        setSessions(data);
        if (data.length > 0 && (expandedId === 1 || expandedId === null)) {
          setExpandedId(data[0].id);
        }
      }
    } catch (err) {
      console.error("로드맵 로딩 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleSave = async (formData: Partial<RoadmapSession>) => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      if (formData.id) {
        const { error } = await supabase
          .from('roadmaps')
          .update(formData)
          .eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('roadmaps')
          .insert([formData]);
        if (error) throw error;
      }
      await fetchRoadmap();
    } catch (err) {
      console.error("로드맵 저장 중 오류:", err);
      alert("저장에 실패했습니다.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('roadmaps')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchRoadmap();
    } catch (err) {
      console.error("로드맵 삭제 중 오류:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  const toggleSession = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="py-32 flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <section id="roadmap" className="py-32 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            탐구 여정
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            연간 탐구 로드맵
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg italic">
            "사료, 문학, 그리고 현대 미디어를 통해 역사 왜곡의 메커니즘을 해체하는 10차시의 비판적 여정"
          </p>
          
          {isAdmin && (
            <div className="pt-4 flex justify-center">
              <button 
                onClick={() => {
                  setEditingSession(undefined);
                  setIsFormOpen(true);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> 연간 탐구 로드맵 추가
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {sessions.map((session, index) => {
            const IconComponent = ICON_MAP[session.icon_name] || Search;
            const isExpanded = expandedId === session.id;
            
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`glass-card rounded-[24px] overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-300 ${isExpanded ? 'ring-2 ring-brand/20 shadow-xl' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                <button
                  onClick={() => toggleSession(session.id)}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 shrink-0 ${session.color_class} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          차시-{session.session_order.toString().padStart(2, '0')}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span className="text-xs font-bold text-brand">{session.date_label}</span>
                      </div>
                      <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-brand transition-colors">
                        {session.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-brand' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-8 md:px-8 md:pb-10 ml-0 md:ml-18">
                        <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 space-y-6">
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                            {session.description}
                          </p>
                          
                          {isAdmin && (
                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-white/5">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingSession(session);
                                  setIsFormOpen(true);
                                }}
                                className="p-2 text-slate-400 hover:text-brand transition-colors"
                                title="수정"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(session.id);
                                }}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                title="삭제"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <RoadmapForm 
            item={editingSession}
            onSave={handleSave}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
