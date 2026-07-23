import type { Record, ReportSummary, UserStats } from '@/types';

/**
 * GNB 탭 전환 시 페이지 remount 대비 인메모리 캐시.
 * 스피너 없이 즉시 렌더하고, 백그라운드에서 갱신한다.
 */

const homeRecordsByDate = new Map<string, Record[]>();
const calendarDatesByMonth = new Map<string, string[]>();
const reportSummaryByRange = new Map<string, ReportSummary>();
let userStats: UserStats | null = null;
let allRecords: Record[] | null = null;

export function getHomeRecordsCache(date: string): Record[] | undefined {
  return homeRecordsByDate.get(date);
}

export function setHomeRecordsCache(date: string, records: Record[]) {
  homeRecordsByDate.set(date, records);
}

export function getCalendarMonthCache(monthKey: string): string[] | undefined {
  return calendarDatesByMonth.get(monthKey);
}

export function setCalendarMonthCache(monthKey: string, dates: string[]) {
  calendarDatesByMonth.set(monthKey, dates);
}

export function getReportSummaryCache(from: string, to: string): ReportSummary | undefined {
  return reportSummaryByRange.get(`${from}_${to}`);
}

export function setReportSummaryCache(from: string, to: string, summary: ReportSummary) {
  reportSummaryByRange.set(`${from}_${to}`, summary);
}

export function getUserStatsCache(): UserStats | null {
  return userStats;
}

export function setUserStatsCache(stats: UserStats) {
  userStats = stats;
}

export function getAllRecordsCache(): Record[] | null {
  return allRecords;
}

export function setAllRecordsCache(records: Record[]) {
  allRecords = records;
}

/** 기록 생성/삭제 후 관련 캐시 무효화 */
export function invalidateRecordCaches() {
  homeRecordsByDate.clear();
  calendarDatesByMonth.clear();
  reportSummaryByRange.clear();
  userStats = null;
  allRecords = null;
}
