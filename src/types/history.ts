export type HistoryType = 'WORLD' | 'KOREA';

export interface TimelineItem {
  id: string;
  type: HistoryType;
  year: string;
  title: string;
  summary: string;
  hypothesis: string; // 가설
  evidence: string;   // 사료/증거
  conclusion: string; // 결론
  impact: string;     // 핵심 영향 및 시사점
  fact_check: string; // 사실 체크 (Fact Check)
  critical_opinion: string; // 비판적 의견 (Critical Opinion)
  sort_year: number;  // 정렬용 연도 (B.C.는 음수)
  image_url?: string;
  created_at: string;
}

export interface ResearcherProfile {
  name: string;
  school: string;
  keywords: string[];
  avatar_url: string;
}

export interface RoadmapSession {
  id: number;
  session_order: number;
  date_label: string;
  title: string;
  description: string;
  icon_name: string;
  color_class: string;
}
