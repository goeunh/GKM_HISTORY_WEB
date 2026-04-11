/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getSupabase, uploadImage, signOut, setAdminPassword } from './lib/supabase';
import { TimelineItem, ResearcherProfile } from './types/history';
import Hero from './components/Hero';
import WorldHistoryTimeline from './components/WorldHistoryTimeline';
import KoreanHistoryTimeline from './components/KoreanHistoryTimeline';
import AcademicTools from './components/AcademicTools';
import TimelineForm from './components/TimelineForm';
import Navbar from './components/Layout/Navbar';
import ProjectRoadmap from './components/ProjectRoadmap';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Plus, Edit2, Trash2, LogOut, Loader2, Upload, User, BookOpen, FileText, Archive } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import AdminLoginModal from './components/AdminLoginModal';

/// 샘플 데이터 (Supabase 연결 전 초기 렌더링용)
const SAMPLE_PROFILE: ResearcherProfile = {
  name: "김역사",
  school: "대한고등학교 3학년 (심화 프로젝트 팀)",
  keywords: ["비판적 역사 읽기", "사료 비판", "미디어 비평", "역사 왜곡 메커니즘"],
  avatar_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000"
};

const SAMPLE_TIMELINES: TimelineItem[] = [
  // 1. 선사 및 고대 형성기 (Prehistoric & Ancient)
  {
    id: 'ancient-world',
    type: 'WORLD',
    year: 'B.C. 35C ~ A.D. 5C (B.C. 3500 ~ A.D. 476)',
    title: '4대 문명의 발흥과 유라시아 네트워크의 형성',
    summary: '메소포타미아, 이집트, 인더스, 황하 문명의 탄생과 초기 국가 체제의 성립 과정 분석.',
    hypothesis: '초기 문명들은 강 유역의 지리적 이점을 활용하여 잉여 생산물을 축적하고, 이를 바탕으로 계급 사회와 문자를 발명했다.',
    evidence: '함무라비 법전, 이집트 피라미드 비문, 갑골문자 등 초기 기록 유산 분석.',
    impact: '정착 생활과 농경의 시작은 인류의 사고방식을 자연 순응형에서 자연 지배형으로 전환시키는 결정적 계기가 됨.',
    fact_check: '4대 문명설은 20세기 초 동양학자들에 의해 체계화되었으나, 최근 고고학은 이들 외에도 중남미, 중앙아시아 등 다발적인 문명 발생을 증명함.',
    critical_opinion: '문명의 발생을 특정 강 유역으로만 한정 짓는 것은 초기 인류의 광범위한 이동성과 적응 능력을 과소평가할 위험이 있음.',
    sort_year: -3500,
    conclusion: '문명 간의 초기 교류는 기술 전파뿐만 아니라 인류 공통의 보편적 가치관 형성의 토대가 되었음을 확인.',
    created_at: new Date().toISOString()
  },
  {
    id: 'ancient-korea',
    type: 'KOREA',
    year: 'B.C. 24C ~ A.D. 7C (B.C. 2333 ~ A.D. 668)',
    title: '고조선의 성립과 고구려의 독자적 천하관',
    summary: '단군조선의 건국과 삼국 시대의 발흥을 통해 나타난 한반도 초기 국가들의 정체성 탐구.',
    hypothesis: '고구려는 중국 왕조의 지방 정권이 아니라, 스스로를 "천하의 중심"으로 인식한 독자적 제국이었다.',
    evidence: '광개토대왕릉비의 "영락(永樂)" 연호 사용과 "사해(發海)" 인식, 덕흥리 고분 벽화의 관직 체계 분석.',
    impact: '고구려의 강력한 군사력과 독자적 세계관은 이후 한반도 국가들이 중국 중심 질서 속에서도 자주성을 유지하는 심리적 보루가 됨.',
    fact_check: '고조선의 건국 연대는 신화적 요소가 포함되어 있으나, 비파형 동검과 고인돌의 분포는 당시 만주와 한반도에 독자적 문화권이 존재했음을 실증함.',
    critical_opinion: '고구려를 현대적 의미의 "제국"으로만 해석하는 것은 당시 동아시아의 복잡한 조공-책봉 관계와 다원적 외교 질서를 단순화할 우려가 있음.',
    sort_year: -2333,
    conclusion: '중국의 동북공정 논리는 고구려의 독자적 연호와 외교권을 무시한 정치적 해석임을 입증.',
    created_at: new Date().toISOString()
  },
  // 2. 중세 및 통합기 (Medieval)
  {
    id: 'medieval-world',
    type: 'WORLD',
    year: '10C ~ 14C (962 ~ 1368)',
    title: '팍스 몽골리카와 유라시아 통합 네트워크',
    summary: '몽골 제국의 발흥이 가져온 동서양 기술(화약, 인쇄술) 및 문화의 폭발적 교류 현상 분석.',
    hypothesis: '몽골의 "세계 제국" 개념은 지역적 경계를 허물었으나, 동시에 피지배 민족의 정체성 말살이라는 왜곡을 낳았다.',
    evidence: '원나라 시기 기록된 서구 여행기들과 이슬람 천문학의 동방 전래 경로 데이터.',
    impact: '동서양의 직접적 접촉은 유럽의 르네상스를 자극하고, 대항해 시대를 여는 기술적·지적 토대를 마련함.',
    fact_check: '몽골의 정복 전쟁은 막대한 인명 피해를 동반했으나, "역참제"를 통한 안전한 교역로 확보는 인류 최초의 글로벌 경제권을 형성함.',
    critical_opinion: '유라시아 통합의 긍정적 측면만 강조할 경우, 정복 과정에서의 문화 파괴와 흑사병 확산과 같은 부정적 여파를 간과할 수 있음.',
    sort_year: 962,
    conclusion: '중세 글로벌 네트워크는 서구 중심의 근대화 이전에도 이미 고도의 통합을 이루었음을 재조명.',
    created_at: new Date().toISOString()
  },
  {
    id: 'medieval-korea',
    type: 'KOREA',
    year: '10C ~ 14C (918 ~ 1392)',
    title: '고려의 대몽 항전과 부마국 체제의 실상',
    summary: '30년에 걸친 고려의 대몽 항전과 이후 원 간섭기 속에서 유지된 국가 주권의 실체 분석.',
    hypothesis: '고려는 원의 단순 속국이 아니라, "부마국"이라는 특수한 지위를 통해 종묘사직과 독자적 문화를 보존했다.',
    evidence: '고려양(高麗樣)의 원나라 유행과 고려의 독자적 관제 유지 기록, 강화도 천도 시기의 항전 기록.',
    impact: '외압 속에서도 굴복하지 않는 저항 정신은 이후 임진왜란과 구한말 의병 투쟁으로 이어지는 민족적 DNA로 정착됨.',
    fact_check: '원 간섭기 고려는 왕실 칭호가 격하되는 등 주권의 제약이 컸으나, 원의 직할령이 되지 않고 국가의 실체를 유지한 드문 사례임.',
    critical_opinion: '부마국 체제를 "자주성 수호"로만 미화하는 것은 당시 민중들이 겪었던 공녀 공출과 과도한 수탈의 고통을 외면할 위험이 있음.',
    sort_year: 918,
    conclusion: '식민 사관의 "타율성론"을 극복하고, 고려의 능동적인 생존 전략과 자주성을 재평가함.',
    created_at: new Date().toISOString()
  },
  // 3. 근세 및 전환기 (Early Modern)
  {
    id: 'early-modern-world',
    type: 'WORLD',
    year: '15C ~ 18C (1453 ~ 1789)',
    title: '대항해 시대와 오리엔탈리즘의 형성',
    summary: '유럽의 신항로 개척과 해상 제국 건설 과정에서 형성된 서구 중심적 세계관 분석.',
    hypothesis: '서구의 "위대한 분기" 이론은 아시아의 내재적 발전 가능성을 의도적으로 저평가하는 프레임을 형성했다.',
    evidence: '17-18세기 유럽 지식인들의 아시아 기록물에 나타난 편견과 실제 아시아 무역량 데이터 대조.',
    impact: '서구 중심의 지식 체계는 비서구권 국가들에게 "근대화 = 서구화"라는 강박적 인식을 심어주는 결과를 초래함.',
    fact_check: '18세기까지 중국과 인도의 GDP 합계는 전 세계의 절반 이상을 차지했으며, 서구의 역전은 산업혁명 이후에야 본격화됨.',
    critical_opinion: '오리엔탈리즘 비판이 자칫 아시아의 전근대적 모순이나 내부적 한계를 정당화하는 논리로 악용되어서는 안 됨.',
    sort_year: 1453,
    conclusion: '근대화는 서구의 전유물이 아니며, 다중심적인 세계 경제 체제가 존재했음을 확인.',
    created_at: new Date().toISOString()
  },
  {
    id: 'early-modern-korea',
    type: 'KOREA',
    year: '15C ~ 18C (1392 ~ 1876)',
    title: '조선 후기 내재적 발전론과 실학의 근대성',
    summary: '임진왜란 이후 조선 사회의 변화와 실학자들의 개혁안을 통한 자생적 근대화 가능성 탐구.',
    hypothesis: '조선은 정체된 사회가 아니라, 농업 혁명과 상업 발달을 통해 스스로 근대로 이행하고 있었다.',
    evidence: '대동법 실시 이후의 시장 경제 활성화 지표와 박제가, 정약용 등의 이용후생(利用厚生) 사상 분석.',
    impact: '실학적 사고는 비록 당대에 정책으로 전면 채택되지는 못했으나, 개항기 개화 사상의 지적 뿌리가 됨.',
    fact_check: '조선 후기 모내기법의 보급과 광작의 출현은 농업 생산성을 비약적으로 높였으며, 이는 신분제의 동요와 서민 문화 발달의 경제적 기반이 됨.',
    critical_opinion: '자생적 근대화론에만 집착할 경우, 당시 조선이 직면했던 성리학적 명분론의 한계와 국제 정세에 대한 어두운 안목을 비판적으로 보기 어려움.',
    sort_year: 1392,
    conclusion: '일제가 주장한 "정체성론"은 조선의 역동적인 사회 변화를 은폐하기 위한 허구임을 입증.',
    created_at: new Date().toISOString()
  },
  // 4. 근대 및 제국주의기 (Modern)
  {
    id: 'modern-world',
    type: 'WORLD',
    year: '19C 말 ~ 20C 초 (1870 ~ 1914)',
    title: '제국주의와 사회진화론의 왜곡된 논리',
    summary: '산업혁명 이후 열강의 식민지 쟁탈전과 이를 정당화하기 위한 인종주의적 사관 분석.',
    hypothesis: '사회진화론은 강자의 지배를 자연 법칙으로 묘사하여 피식민지의 역사를 "정체된 과거"로 규정했다.',
    evidence: '제국주의 열강의 교과서 서술 방식과 식민지 통치 보고서의 왜곡된 통계 자료 분석.',
    impact: '왜곡된 우생학과 인종주의는 20세기 두 차례의 세계 대전과 홀로코스트라는 인류사적 비극의 씨앗이 됨.',
    fact_check: '사회진화론은 다윈의 생물학적 진화론을 사회에 무리하게 적용한 유사 과학이며, 실제로는 약탈적 식민 지배를 위한 정치적 도구였음.',
    critical_opinion: '제국주의 비판이 서구 문명이 가져온 근대적 제도(법률, 교육 등)의 복합적인 영향을 전면 부정하는 극단으로 흘러서는 안 됨.',
    sort_year: 1870,
    conclusion: '근대성은 특정 문명의 전유물이 아니라, 전 지구적 저항과 상호작용의 산물임을 입증.',
    created_at: new Date().toISOString()
  },
  {
    id: 'modern-korea',
    type: 'KOREA',
    year: '19C 말 ~ 20C 초 (1876 ~ 1945)',
    title: '식민 사관의 해체와 독립 운동의 세계사적 가치',
    summary: '일제가 주입한 정체성·타율성·당파성론을 비판하고, 3·1 운동의 글로벌 영향력 분석.',
    hypothesis: '한국의 독립 운동은 단순한 민족 해방을 넘어, 아시아 전역의 반제국주의 운동에 영감을 주었다.',
    evidence: '중국 5·4 운동 및 인도 비폭력 운동 지도자들의 기록에 나타난 3·1 운동의 영향력.',
    impact: '한국의 저항은 제국주의 질서에 균열을 내고, 피압박 민족들에게 "자결주의"의 실천적 모델을 제시함.',
    fact_check: '일제는 식민 지배가 한국의 근대화를 도왔다고 주장(식민지 근대화론)하나, 이는 수탈을 위한 기반 시설 확충이었을 뿐 한국인의 주체적 성장은 철저히 억압됨.',
    critical_opinion: '독립 운동의 성과를 지나치게 민족주의적 관점에서만 서술할 경우, 당시 국제 정세의 역학 관계와 연합군의 승리가 미친 영향을 과소평가할 수 있음.',
    sort_year: 1876,
    conclusion: '한국 근대사는 피동적 수혜의 역사가 아니라, 세계 시민 사회의 가치를 선구적으로 실천한 역사임.',
    created_at: new Date().toISOString()
  },
  // 5. 현대 및 디지털 시대 (Contemporary)
  {
    id: 'contemporary-world',
    type: 'WORLD',
    year: '20C 중반 ~ 현재 (1945 ~ Present)',
    title: '냉전 체제와 디지털 시대의 역사 주권',
    summary: '진영 논리에 따른 현대사 왜곡과 정보화 시대에 나타나는 새로운 형태의 역사 수정주의 분석.',
    hypothesis: '디지털 플랫폼을 통한 가짜 뉴스와 역사 왜곡은 국가 간 갈등을 증폭시키는 새로운 무기가 되고 있다.',
    evidence: '온라인 백과사전 및 SNS에서의 역사 정보 조작 사례와 알고리즘 편향성 데이터.',
    impact: '역사 정보의 오염은 집단적 기억을 왜곡시켜 합리적 토론을 불가능하게 하고, 극단적 혐오 정서를 유발함.',
    fact_check: '디지털 아카이브의 확산은 역사 정보의 접근성을 높였으나, 동시에 확인되지 않은 정보가 "집단 지성"의 이름으로 정당화되는 부작용을 낳음.',
    critical_opinion: '역사 주권 수호가 자칫 국가주의적 검열이나 타국에 대한 배타적 감정으로 변질되지 않도록 보편적 인권과 평화의 관점을 견지해야 함.',
    sort_year: 1945,
    conclusion: '객관적 사료 비판 역량이 디지털 시민의 핵심 소양임을 강조하며 대응 방안 제시.',
    created_at: new Date().toISOString()
  },
  {
    id: 'contemporary-korea',
    type: 'KOREA',
    year: '20C 중반 ~ 현재 (1945 ~ Present)',
    title: '일본 교과서 검정 및 독도 영유권 주장 비판',
    summary: '주변국의 역사 왜곡 시도에 대한 논리적 구조 분석과 한국의 문화적 영향력을 활용한 대응 전략.',
    hypothesis: '역사 왜곡은 단순한 과거의 문제가 아니라, 미래의 영토권과 국가 위상을 결정짓는 현재 진행형 과제다.',
    evidence: '일본 교과서의 강제 동원 서술 변화 추이와 국제법적 근거 자료, K-컬처를 통한 올바른 역사 전파 사례.',
    impact: '올바른 역사 인식의 확산은 한일 관계의 진정한 회복뿐만 아니라 동아시아 평화 공동체 구축의 선결 조건임.',
    fact_check: '독도는 역사적, 지리적, 국제법적으로 명백한 한국 영토이며, 일본의 주장은 1905년 시마네현 고시 등 제국주의 침탈 과정의 논리를 답습하고 있음.',
    critical_opinion: '감정적 대응보다는 국제 사회가 공감할 수 있는 논리적 사료 발굴과 보편적 평화의 가치를 담은 역사 교육이 병행되어야 함.',
    sort_year: 1946,
    conclusion: '문화적 소프트 파워와 학술적 논리를 결합하여 글로벌 사회에 진실된 역사를 확산해야 함.',
    created_at: new Date().toISOString()
  }
];

const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000000';

export default function App() {
  const [profile, setProfile] = useState<ResearcherProfile>(SAMPLE_PROFILE);
  const [timelines, setTimelines] = useState<TimelineItem[]>(SAMPLE_TIMELINES);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  // 관리자 모드 상태 (초기값 false)
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<TimelineItem> | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // 스크롤 감시
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Supabase 데이터 페칭
  useEffect(() => {
    async function fetchData() {
      try {
        console.log("데이터 페칭 시작... (AdminMode:", isAdminMode, ")");
        const supabase = getSupabase();
        if (!supabase) {
          console.error("Supabase 클라이언트가 초기화되지 않았습니다.");
          setIsConnected(false);
          return;
        }

        // 0. 테이블 상태 확인
        const { error: healthError } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (healthError) {
          console.error("DB 연결 또는 테이블 접근 오류:", healthError);
          if (healthError.code === '42P01') {
            const msg = "'profiles' 테이블이 존재하지 않습니다. SQL Editor에서 테이블을 생성해주세요.";
            console.warn(msg);
            if (isAdminMode) alert(msg);
          }
        }

        // 1. 타임라인 데이터 가져오기
        const { data: timelineData, error: tError } = await supabase
          .from('timelines')
          .select('*')
          .order('sort_year', { ascending: true });
        
        if (tError) {
          console.error("타임라인 로딩 에러:", tError);
        } else if (timelineData && timelineData.length > 0) {
          setTimelines(timelineData);
          setIsConnected(true);
        }

        // 2. 프로필 데이터 가져오기 (다양한 방법으로 시도)
        console.log("프로필 데이터 로딩 시도...");
        
        // 시도 1: 고정 ID로 가져오기
        let { data: profileData, error: pError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', DEFAULT_USER_ID)
          .maybeSingle();

        // 시도 2: ID로 실패하면 가장 최근 데이터 가져오기
        if (!profileData && !pError) {
          const { data: latestData, error: latestError } = await supabase
            .from('profiles')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(1);
          
          if (latestData && latestData.length > 0) {
            profileData = latestData[0];
          }
          pError = latestError;
        }

        // 시도 3: 정렬 없이 아무 데이터나 가져오기 (컬럼 부재 대비)
        if (!profileData && !pError) {
          const { data: anyData, error: anyError } = await supabase
            .from('profiles')
            .select('*')
            .limit(1);
          
          if (anyData && anyData.length > 0) {
            profileData = anyData[0];
          }
          pError = anyError;
        }

        if (pError) {
          console.error("프로필 로딩 최종 에러:", pError);
        }

        if (profileData) {
          console.log("DB 프로필 로드 성공:", profileData);
          // DB 필드와 ResearcherProfile 타입 맞추기
          setProfile({
            name: profileData.name || SAMPLE_PROFILE.name,
            school: profileData.school || SAMPLE_PROFILE.school,
            keywords: Array.isArray(profileData.keywords) ? profileData.keywords : SAMPLE_PROFILE.keywords,
            avatar_url: profileData.avatar_url || SAMPLE_PROFILE.avatar_url
          });
          setIsConnected(true);
        } else {
          console.log("DB에 프로필 데이터가 없습니다. 샘플 데이터를 유지합니다.");
        }
      } catch (err: any) {
        console.error("Supabase 연동 확인 중 예외:", err);
        setIsConnected(false);
      }
    }

    fetchData();
  }, [isAdminMode]); // 관리자 모드 변경 시 다시 페칭 (헤더 적용된 클라이언트 사용)

  // 로그아웃 처리
  const handleSignOut = () => {
    setAdminPassword(null);
    setIsAdminMode(false);
    alert("로그아웃 되었습니다.");
  };

  // 프로필 저장 함수
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminMode) {
      alert("관리자 모드에서만 저장할 수 있습니다. 먼저 관리자로 로그인해주세요.");
      return;
    }
    
    setIsSavingProfile(true);
    console.log("프로필 저장 시도 중...", profile);
    
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error("Supabase 클라이언트가 초기화되지 않았습니다.");
      }

      // 저장할 데이터 준비
      const payload = { 
        id: DEFAULT_USER_ID, 
        name: profile.name || '',
        school: profile.school || '',
        keywords: Array.isArray(profile.keywords) ? profile.keywords : [],
        avatar_url: profile.avatar_url || '',
        updated_at: new Date().toISOString()
      };

      console.log("Supabase Upsert 실행:", payload);

      // 1. 먼저 해당 ID의 데이터가 있는지 확인 (디버깅용)
      const { data: existingData } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', DEFAULT_USER_ID)
        .maybeSingle();
      
      console.log("기존 데이터 존재 여부:", !!existingData);

      // 2. Upsert 실행
      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select();
      
      if (error) {
        console.error("Supabase 프로필 저장 실패 상세 에러:", error);
        let errorMsg = `저장 실패: ${error.message}`;
        
        if (error.code === '42P01') {
          errorMsg = "profiles 테이블이 데이터베이스에 존재하지 않습니다. SQL Editor에서 테이블 생성 스크립트를 실행했는지 확인해주세요.";
        } else if (error.code === '42703') {
          errorMsg = "테이블 구조(컬럼)가 일치하지 않습니다. id, name, school, keywords, avatar_url 컬럼이 모두 있는지 확인해주세요.";
        } else if (error.message.includes('row-level security')) {
          errorMsg = "RLS 보안 정책 위반입니다. 관리자 비밀번호가 올바른지, SQL Editor에서 정책(Policy)을 정상적으로 설정했는지 확인해주세요.";
        } else if (error.code === '23505') {
          errorMsg = "고유 키 제약 조건 위반입니다. (중복 데이터)";
        }
        
        alert(`${errorMsg}\n\n[에러 정보]\n코드: ${error.code}\n상세: ${error.details || '없음'}\n힌트: ${error.hint || '없음'}`);
      } else {
        console.log("프로필 저장 성공 결과:", data);
        if (data && data.length > 0) {
          const saved = data[0];
          setProfile({
            name: saved.name || profile.name,
            school: saved.school || profile.school,
            keywords: Array.isArray(saved.keywords) ? saved.keywords : profile.keywords,
            avatar_url: saved.avatar_url || profile.avatar_url
          });
        }
        alert("프로필 정보가 성공적으로 저장되었습니다.");
        setIsEditingProfile(false);
      }
    } catch (err: any) {
      console.error("프로필 저장 중 예외 발생:", err);
      alert(`시스템 오류: ${err.message || '알 수 없는 오류가 발생했습니다.'}`);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 아바타 변경 함수
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (!isAdminMode) {
      alert("관리자 권한이 필요합니다.");
      return;
    }
    
    const file = e.target.files[0];
    
    // 로컬 미리보기 생성 (업로드 실패 시에도 UI 반영을 위해)
    const localUrl = URL.createObjectURL(file);
    setProfile(prev => ({ ...prev, avatar_url: localUrl }));

    const supabase = getSupabase();
    if (!supabase) {
      console.warn("Supabase가 연결되지 않아 로컬 미리보기만 적용됩니다.");
      return;
    }

    try {
      const url = await uploadImage('avatars', file);
      if (url) {
        // 업로드 성공 시 Supabase URL로 업데이트
        setProfile(prev => ({ ...prev, avatar_url: url }));
        console.log("이미지 업로드 성공:", url);
      } else {
        console.warn("Supabase 이미지 업로드 실패, 로컬 미리보기 유지");
      }
    } catch (err) {
      console.error("이미지 업로드 중 예외 발생:", err);
    }
  };

  // 타임라인 저장 함수
  const handleSaveTimeline = async (item: Partial<TimelineItem>) => {
    if (!isAdminMode) {
      alert("관리자 권한이 필요합니다.");
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      alert("Supabase 클라이언트가 초기화되지 않았습니다.");
      return;
    }

    try {
      // ID가 temp-로 시작하면 신규 생성이므로 ID 제거 (DB에서 생성하도록)
      const isNew = !item.id || item.id.startsWith('temp-');
      const saveItem = { ...item };
      if (isNew) delete saveItem.id;

      const { data, error } = await supabase
        .from('timelines')
        .upsert({
          ...saveItem,
          user_id: DEFAULT_USER_ID
        })
        .select();
      
      if (error) {
        console.error("Supabase 타임라인 저장 실패:", error);
        alert(`타임라인 저장 실패: ${error.message}`);
      } else {
        console.log("타임라인 저장 성공:", data);
        // 성공 시 전체 데이터 다시 불러오기
        const { data: allData } = await supabase.from('timelines').select('*').order('year', { ascending: true });
        if (allData) setTimelines(allData);
        setIsConnected(true);
        alert("탐구 데이터가 저장되었습니다.");
      }
    } catch (err: any) {
      console.error("타임라인 저장 중 예외 발생:", err);
      alert(`시스템 오류: ${err.message || '알 수 없는 오류가 발생했습니다.'}`);
    }
  };

  // 타임라인 삭제 함수
  const handleDeleteTimeline = async (id: string) => {
    if (!isAdminMode) {
      alert("관리자 권한이 필요합니다.");
      return;
    }

    if (id.startsWith('temp-')) {
      setTimelines(prev => prev.filter(t => t.id !== id));
      return;
    }

    if (!confirm("정말로 이 탐구 데이터를 삭제하시겠습니까?")) return;

    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { error } = await supabase.from('timelines').delete().eq('id', id);
      if (error) {
        console.error("Supabase 타임라인 삭제 실패:", error);
        alert(`삭제 실패: ${error.message}`);
      } else {
        setTimelines(prev => prev.filter(t => t.id !== id));
        alert("삭제되었습니다.");
      }
    } catch (err: any) {
      console.error("타임라인 삭제 중 예외 발생:", err);
      alert(`시스템 오류: ${err.message || '알 수 없는 오류가 발생했습니다.'}`);
    }
  };

  // 테마 적용 (다크 모드 강제)
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const worldItems = timelines.filter(item => item.type === 'WORLD');
  const koreaItems = timelines.filter(item => item.type === 'KOREA');

  return (
    <div className="dark min-h-screen selection:bg-brand/30 transition-colors duration-500">
      <Navbar onAdminClick={() => setShowAdminLogin(true)} />
      
      {/* 관리자 모드 바 */}
      {isAdminMode && (
        <div className="sticky top-0 z-[100] bg-brand text-white px-6 py-3 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-3 font-bold">
            <Settings className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Archive Admin Mode</span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsEditingProfile(true)}
              className="px-4 py-1 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors"
            >
              Edit Profile
            </button>
            <button 
              onClick={handleSignOut}
              className="px-4 py-1 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-bold transition-colors flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}

      <main className="relative">
        {/* 프로필 수정 모달 */}
        {isEditingProfile && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="glass-card w-full max-w-md rounded-[32px] p-8">
              <h3 className="text-2xl font-bold mb-6">Edit Researcher Profile</h3>
              <form onSubmit={handleSaveProfile} className="p-8 space-y-6">
                <div className="flex justify-center mb-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[32px] overflow-hidden border-4 border-brand shadow-2xl shadow-brand/20">
                      <img 
                        key={profile.avatar_url}
                        src={profile.avatar_url} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                        alt="Avatar Preview"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://picsum.photos/seed/researcher/400/400";
                        }}
                      />
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 rounded-[32px] cursor-pointer transition-all duration-300 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase">Change</span>
                      </div>
                      <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase mb-1.5 tracking-[0.2em] ml-1">Researcher Name</label>
                    <input 
                      type="text" 
                      value={profile.name} 
                      onChange={e => setProfile({...profile, name: e.target.value})} 
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-brand/20 outline-none transition-all" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase mb-1.5 tracking-[0.2em] ml-1">Affiliation</label>
                    <input 
                      type="text" 
                      value={profile.school} 
                      onChange={e => setProfile({...profile, school: e.target.value})} 
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-brand/20 outline-none transition-all" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase mb-1.5 tracking-[0.2em] ml-1">Keywords (Comma separated)</label>
                    <input 
                      type="text" 
                      value={(profile.keywords || []).join(', ')} 
                      onChange={e => setProfile({...profile, keywords: e.target.value.split(',').map(s => s.trim())})} 
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-brand/20 outline-none transition-all" 
                      placeholder="e.g. History, Research, Analysis"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsEditingProfile(false)} 
                    className="flex-1 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSavingProfile} 
                    className="btn-primary flex-1 flex items-center justify-center gap-2 py-4"
                  >
                    {isSavingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Hero profile={profile} />

        <div className="max-w-7xl mx-auto px-6 py-20 space-y-32">
          {/* Methodology Section (Bento Style) */}
          <section id="methodology" className="space-y-12 scroll-mt-32">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">연구 <span className="text-brand">방법론</span></h2>
              <p className="text-lg text-slate-500 dark:text-slate-400">
                사료 비판과 현대 담론 분석을 결합한 다차원적 역사 분석 접근법을 지향합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-2 glass-card p-8 rounded-[32px] space-y-6"
              >
                <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold">사료 비판 (Source Criticism)</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                  텍스트 생산자에 따라 역사적 사실이 어떻게 다르게 해석되는지 분석합니다. 
                  <strong>비판적 담론 분석(CDA)</strong>을 적용하여 현대 미디어가 집단 기억을 구성하는 방식을 식별합니다.
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  {["파친코", "광장", "군함도", "암살"].map((item) => (
                    <span key={item} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="glass-card p-8 rounded-[32px] bg-brand text-white border-none"
              >
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold mb-4">핵심 발견</h3>
                <div className="space-y-6">
                  {[
                    { t: "의도적 삭제", d: "정치적 목적을 위한 주요 사실의 누락" },
                    { t: "프레임 설정", d: "특정 이데올로기에 국한된 맥락 제한" },
                    { t: "정서적 과잉", d: "사실보다 민족주의적 감정 강조" }
                  ].map((item, i) => (
                    <div key={i} className="border-l-2 border-white/30 pl-4">
                      <div className="font-bold text-lg">{item.t}</div>
                      <div className="text-sm text-white/70">{item.d}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Timeline Section */}
          <section id="timeline" className="space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">연구 <span className="text-brand">타임라인</span></h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl">
                  글로벌 및 지역적 맥락에서 역사적 왜곡 사례를 연대순으로 분석합니다.
                </p>
              </div>
              {isAdminMode && (
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setEditingItem({ type: 'WORLD' })}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> 연구 타임라인 추가
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div id="world-timeline" className="space-y-12 scroll-mt-32">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">세계사 (World History)</h3>
                </div>
                <WorldHistoryTimeline 
                  items={worldItems} 
                  isAdmin={isAdminMode}
                  onEdit={setEditingItem}
                  onDelete={handleDeleteTimeline}
                />
              </div>

              <div id="korea-timeline" className="space-y-12 scroll-mt-32">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
                    <Archive className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">한국사 (Korean History)</h3>
                </div>
                <KoreanHistoryTimeline 
                  items={koreaItems} 
                  isAdmin={isAdminMode}
                  onEdit={setEditingItem}
                  onDelete={handleDeleteTimeline}
                />
              </div>
            </div>
          </section>

          {/* Roadmap Section */}
          <ProjectRoadmap isAdmin={isAdminMode} />

          {/* Tools Section */}
          <section id="tools">
            <AcademicTools />
          </section>
        </div>
      </main>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 p-4 bg-brand text-white rounded-2xl shadow-2xl z-40 hover:bg-brand-dark transition-all flex items-center justify-center"
            title="맨 위로 가기"
          >
            <Plus className="w-6 h-6 rotate-45" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Admin Button */}
      {!isAdminMode && (
        <button 
          onClick={() => setShowAdminLogin(true)}
          className="fixed bottom-8 left-8 p-4 rounded-2xl shadow-2xl transition-all opacity-40 hover:opacity-100 z-40 glass-card group"
          title="Admin Login"
        >
          <Settings className="w-6 h-6 transition-transform duration-700 group-hover:rotate-180 text-slate-500" />
        </button>
      )}

      {/* Modals */}
      {showAdminLogin && (
        <AdminLoginModal 
          onClose={() => setShowAdminLogin(false)} 
          onSuccess={() => {
            setShowAdminLogin(false);
            setIsAdminMode(true);
          }} 
        />
      )}
      
      {editingItem && (
        <TimelineForm 
          item={editingItem} 
          onSave={handleSaveTimeline} 
          onClose={() => setEditingItem(null)} 
        />
      )}

      <footer className="py-20 px-6 border-t border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
        
        <div className="max-w-3xl mx-auto space-y-8">
          <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
            "역사를 잊은 민족에게 미래는 없다. <br/> 사료는 과거와 현재를 잇는 대화의 창이다."
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <span>Digital History Archive</span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand" />
            <span>Portfolio 2026</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold uppercase tracking-tighter">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
            {isConnected ? 'Database Connected' : 'Sample Data Mode'}
          </div>
        </div>
      </footer>
    </div>
  );
}
