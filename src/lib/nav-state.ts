/** sessionStorage keys for preserving UI state across detail navigation */

const HOME_KEY = 'kongpot:home-nav';
const REPORT_DETAIL_KEY = 'kongpot:report-detail';
const MY_RECORDS_FILTER_KEY = 'kongpot:my-records-filter';

export interface HomeNavState {
  selectedDate: string; // yyyy-MM-dd
  viewMonth: string; // yyyy-MM-dd (any day in month)
  expanded: boolean;
  viewWeekStart?: string; // yyyy-MM-dd
}

export interface ReportDetailState {
  category: string;
  label: string;
}

function readJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / private mode
  }
}

export function saveHomeNavState(state: HomeNavState) {
  writeJson(HOME_KEY, state);
}

export function loadHomeNavState(): HomeNavState | null {
  return readJson<HomeNavState>(HOME_KEY);
}

export function saveReportDetailState(state: ReportDetailState) {
  writeJson(REPORT_DETAIL_KEY, state);
}

export function loadReportDetailState(): ReportDetailState | null {
  return readJson<ReportDetailState>(REPORT_DETAIL_KEY);
}

export function clearReportDetailState() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(REPORT_DETAIL_KEY);
}

export function saveMyRecordsFilter(filter: string) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(MY_RECORDS_FILTER_KEY, filter);
  } catch {
    // ignore
  }
}

export function loadMyRecordsFilter(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(MY_RECORDS_FILTER_KEY);
    if (!raw) return null;
    // 이전 JSON.stringify 저장값 호환 (예: "\"work\"")
    if (raw.startsWith('"') && raw.endsWith('"')) {
      try {
        const parsed = JSON.parse(raw);
        return typeof parsed === 'string' ? parsed : raw;
      } catch {
        return raw;
      }
    }
    return raw;
  } catch {
    return null;
  }
}
