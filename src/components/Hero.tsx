import { motion } from 'motion/react';
import { ResearcherProfile } from '../types/history';
import { Sparkles, GraduationCap, Target } from 'lucide-react';

interface HeroProps {
  profile: ResearcherProfile;
}

export default function Hero({ profile }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-brand/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-brand-light/10 blur-[120px] rounded-full" />

      <div className="flex flex-col lg:flex-row items-center gap-16">
        {/* Left: Avatar & Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative lg:w-1/3"
        >
          <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-[40px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border-8 border-white dark:border-slate-800 rotate-3 hover:rotate-0 transition-transform duration-500 group">
            <img 
              key={profile.avatar_url}
              src={profile.avatar_url || "https://picsum.photos/seed/researcher/400/400"} 
              alt="Researcher Avatar" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://picsum.photos/seed/researcher/400/400";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
        </motion.div>

        {/* Right: Main Info */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-xs font-bold mb-6 tracking-wide uppercase">
            <Target className="w-3.5 h-3.5" />
            디지털 역사 포트폴리오 2026
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1] text-white">
            역사의 <span className="text-brand">진실</span>을 마주하다
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 font-medium max-w-2xl">
            {profile.name} <span className="text-slate-300 dark:text-slate-700 mx-2">|</span> 
            <span className="text-white"> {profile.school}</span>
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
            {profile.keywords?.map((keyword, idx) => (
              <span 
                key={idx} 
                className="px-4 py-2 glass-card rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-brand/50 transition-colors"
              >
                #{keyword}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <a href="#timeline" className="btn-primary w-full sm:w-auto text-center">연구 성과 보기</a>
            <a href="#methodology" className="px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all w-full sm:w-auto flex items-center justify-center gap-2">
              <GraduationCap className="w-5 h-5" />
              학술 프로필
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
