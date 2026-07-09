export type RecordStatus = 'SAVED_ANALYZED' | 'SAVED_UNANALYZED' | 'EMPTY';

export interface CompetencyTag {
  id: string;
  code: string;
  name: string;
  category: string;
}

export interface RecordTag {
  id: string;
  evidenceText: string;
  evidenceStart?: number;
  evidenceEnd?: number;
  tag: CompetencyTag;
}

export interface RecordMessage {
  id?: string;
  role: 'bot' | 'user';
  content: string;
  sort_order?: number;
  sortOrder?: number;
}

export interface Record {
  id: string;
  user_id: string;
  record_date: string;
  category: string;
  emotion_level: number;
  status: RecordStatus;
  summary: string | null;
  created_at: string;
  messages?: RecordMessage[];
  tags?: RecordTag[];
}

export interface ReportSummary {
  radar: Array<{ category: string; label: string; count: number }>;
  bar: Array<{ code: string; name: string; count: number }>;
  totalRecords: number;
}

export interface UserStats {
  totalRecords: number;
  recordDays: number;
  totalTags: number;
}

export interface Insight {
  category: string;
  categoryLabel: string;
  comment: string;
}
