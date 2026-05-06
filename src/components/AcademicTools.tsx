import { Search, ExternalLink, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface AcademicToolsProps {}

export default function AcademicTools() {
  const externalLinks = [
    { name: '국사편찬위원회', url: 'http://history.go.kr/', desc: '한국사 관련 사료 및 데이터베이스 통합 검색 서비스입니다.' },
    { name: 'Google Scholar', url: 'https://scholar.google.co.kr/', desc: '학술 논문 및 연구 자료 검색을 위한 도구입니다.' },
    { name: '한국학중앙연구원', url: 'https://www.aks.ac.kr/', desc: '한국학 관련 전문 연구 자료 및 백과사전을 제공합니다.' },
    { name: 'DBpia', url: 'https://www.dbpia.co.kr/', desc: '국내 학술지 및 논문 데이터베이스입니다.' },
    { name: 'RISS', url: 'http://www.riss.kr/', desc: '학술연구정보서비스로 학위논문 및 학술지 검색이 가능합니다.' }
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Info Section */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                연구 지원 리소스
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
                학술 <br/> <span className="text-brand">지원</span> 도구
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-300 leading-relaxed">
                심층적인 탐구를 위해 검증된 학술 도구와 역사 데이터베이스를 활용합니다. 
                본 프로젝트는 국사편찬위원회 및 주요 학술 서비스의 데이터를 바탕으로 합니다.
              </p>
            </div>
          </div>

          {/* Right: Tools Grid */}
          <div className="lg:col-span-8 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {externalLinks.map((link, i) => (
                <motion.a 
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-8 glass-card rounded-[32px] hover:shadow-2xl hover:shadow-brand/10 transition-all flex flex-col justify-between h-full border-slate-200 dark:border-slate-800"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all duration-500">
                        <Search className="w-6 h-6" />
                      </div>
                      <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-brand transition-colors" />
                    </div>
                    <h4 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-brand transition-colors">{link.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed">{link.desc}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-[32px] space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">활용된 연구 방법론</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  '브레인스토밍', '그룹 토의', '연구 설계', '문헌 검토', '비판적 읽기', 
                  '서사 분석', '비교 분석', 'CDA 프레임 적용', '현장 조사', '교차 검증', 
                  '심층 사례 연구', '비판적 담론 분석 (CDA)', '미디어 비평', '학술적 글쓰기', 
                  '논증 구조화', '데이터 시각화', '성찰적 글쓰기'
                ].map((method) => (
                  <span 
                    key={method}
                    className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-brand hover:text-white hover:border-brand transition-all cursor-default backdrop-blur-sm"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
