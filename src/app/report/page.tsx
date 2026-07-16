'use client';

import { useEffect, useState, useMemo } from 'react';
import { subDays, format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { GNB } from '@/components/layout/GNB';
import { MobileOverlay } from '@/components/layout/MobileOverlay';
import { ScreenHeader } from '@/components/ui/BackButton';
import { CompetencyRadarChart } from '@/components/charts/CompetencyCharts';
import { DateRangePicker } from '@/components/report/DateRangePicker';
import { InsightModal } from '@/components/report/InsightModal';
import { ErrorModal } from '@/components/ui/ErrorModal';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import { AnalyticsEvent, capture } from '@/lib/analytics';
import { COMPETENCY_CATEGORIES, CATEGORY_LABELS } from '@/lib/constants/categories';
import type { ReportSummary, Insight } from '@/types';
import { cn } from '@/lib/utils';

type Period = '1w' | '1m' | '3m' | 'custom';

function getPresetDateRange(period: Exclude<Period, 'custom'>): { from: string; to: string } {
  const to = new Date();
  const days = period === '1w' ? 6 : period === '1m' ? 29 : 89;
  const from = subDays(to, days);
  return {
    from: format(from, 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
  };
}

function getDefaultCustomRange(): { from: Date; to: Date } {
  const to = new Date();
  const from = subDays(to, 6);
  return { from, to };
}

const PERIOD_LABELS: Record<Period, string> = {
  '1w': '1주',
  '1m': '1개월',
  '3m': '3개월',
  custom: '직접설정',
};

export default function ReportPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { loading: authLoading } = useRequireAuth();
  const [period, setPeriod] = useState<Period>('1w');
  const defaultCustom = getDefaultCustomRange();
  const [customFrom, setCustomFrom] = useState<Date>(defaultCustom.from);
  const [customTo, setCustomTo] = useState<Date>(defaultCustom.to);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightOpen, setInsightOpen] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [periodDays, setPeriodDays] = useState(7);
  const [insightLoading, setInsightLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [detailCategory, setDetailCategory] = useState<string | null>(null);
  const [detailLabel, setDetailLabel] = useState('');
  const [detailRecords, setDetailRecords] = useState<
    Array<{
      id: string;
      summary: string | null;
      record_date: string;
      created_at?: string;
      category: string;
      status?: string;
      tags?: Array<{
        evidenceText?: string;
        tag: { name: string; code?: string; category?: string } | null;
      }>;
    }>
  >([]);

  const dateRange = useMemo(() => {
    if (period === 'custom') {
      return {
        from: format(customFrom, 'yyyy-MM-dd'),
        to: format(customTo, 'yyyy-MM-dd'),
      };
    }
    return getPresetDateRange(period);
  }, [period, customFrom, customTo]);

  const maxCompetencyCount = useMemo(() => {
    if (!summary?.radar.length) return 1;
    return Math.max(...summary.radar.map((r) => r.count), 1);
  }, [summary]);

  useEffect(() => {
    if (authLoading) return;
    const token = getToken();
    if (!token) return;

    const { from, to } = dateRange;
    setLoading(true);
    api
      .getReportSummary(token, from, to)
      .then(setSummary)
      .catch((e) => setError(e instanceof Error ? e : new Error('로드 실패')))
      .finally(() => setLoading(false));
  }, [authLoading, getToken, dateRange]);

  function handlePeriodSelect(p: Period) {
    if (p === 'custom') {
      setPeriod('custom');
      setCalendarOpen(true);
    } else {
      setPeriod(p);
    }
  }

  function handleDateRangeConfirm(from: Date, to: Date) {
    setCustomFrom(from);
    setCustomTo(to);
    setPeriod('custom');
    setCalendarOpen(false);
  }

  async function handleInsight() {
    const token = getToken();
    const tagTotal = summary?.radar.reduce((sum, r) => sum + r.count, 0) ?? 0;
    if (!token || !summary || tagTotal === 0) return;
    setInsightLoading(true);
    setError(null);
    try {
      const { from, to } = dateRange;
      capture(AnalyticsEvent.InsightRequested, {
        from,
        to,
        totalRecords: summary.totalRecords,
      });
      const result = (await api.generateInsights(token, from, to)) as {
        periodDays: number;
        insights: Insight[];
      };
      setInsights(result.insights);
      setPeriodDays(result.periodDays);
      setInsightOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('인사이트 생성 실패'));
    } finally {
      setInsightLoading(false);
    }
  }

  async function openDetail(category: string, label: string) {
    const token = getToken();
    if (!token) return;
    const { from, to } = dateRange;
    const records = (await api.getCompetencyRecords(token, category, from, to)) as Array<{
      id: string;
      summary: string | null;
      record_date: string;
      created_at?: string;
      category: string;
      status?: string;
      tags?: Array<{
        evidenceText?: string;
        tag: { name: string; code?: string; category?: string } | null;
      }>;
    }>;
    // 최신 날짜 순 → 같은 날짜면 최신 등록 순
    const sorted = [...records].sort((a, b) => {
      const byDate = b.record_date.localeCompare(a.record_date);
      if (byDate !== 0) return byDate;
      return (b.created_at ?? '').localeCompare(a.created_at ?? '');
    });
    setDetailCategory(category);
    setDetailLabel(label);
    setDetailRecords(sorted);
  }

  if (authLoading) return null;

  const canInsight =
    (summary?.radar.reduce((sum, r) => sum + r.count, 0) ?? 0) > 0;

  return (
    <div className="flex min-h-dvh flex-col bg-white pb-[116px]">
      <header className="px-3.5 pt-6">
        <h1 className="text-center text-[20px] font-black text-foreground">역량 리포트</h1>

        <div className="mt-4 rounded-xl bg-white px-3 py-3 shadow-[0_4px_8.1px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {(['1w', '1m', '3m', 'custom'] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePeriodSelect(p)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-[13px] font-bold transition-colors',
                  period === p ? 'bg-primary text-white' : 'bg-[#f1f1f1] text-olive',
                )}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>

          <div className="my-3 h-px bg-[#e8e8e8]" />

          <p
            className={cn(
              'text-center text-[13px] font-medium text-foreground',
              period === 'custom' && 'cursor-pointer',
            )}
            onClick={() => period === 'custom' && setCalendarOpen(true)}
            onKeyDown={(e) => {
              if (period === 'custom' && (e.key === 'Enter' || e.key === ' ')) {
                setCalendarOpen(true);
              }
            }}
            role={period === 'custom' ? 'button' : undefined}
            tabIndex={period === 'custom' ? 0 : undefined}
          >
            {dateRange.from} - {dateRange.to}
          </p>
        </div>
      </header>

      <section className="mt-6 px-3.5">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <CompetencyRadarChart
              data={
                summary?.radar.map((r) => ({ label: r.label, count: r.count })) ??
                COMPETENCY_CATEGORIES.map((c) => ({ label: c.label, count: 0 }))
              }
            />

            <div className="mt-6 space-y-5">
              {COMPETENCY_CATEGORIES.map((cat) => {
                const item = summary?.radar.find((r) => r.category === cat.id);
                const count = item?.count ?? 0;
                const barWidth = maxCompetencyCount > 0 ? (count / maxCompetencyCount) * 100 : 0;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => openDetail(cat.id, cat.label)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold text-foreground">{cat.label}</span>
                      <span className="text-[12px] text-olive">
                        {count}개 기록에서 발견 <span className="text-[#c4bdb3]">›</span>
                      </span>
                    </div>
                    <div className="mt-2 h-[5px] w-full overflow-hidden rounded-full bg-[#f1f1f1]">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </section>

      <div className="fixed bottom-[68px] left-1/2 z-40 w-full max-w-[375px] -translate-x-1/2 bg-white">
        <Button
          fullWidth
          disabled={!canInsight}
          loading={insightLoading}
          onClick={handleInsight}
          className="h-12 rounded-none py-0 text-[15px] font-bold"
        >
          인사이트 받기
        </Button>
      </div>

      <GNB />

      <DateRangePicker
        open={calendarOpen}
        from={customFrom}
        to={customTo}
        onConfirm={handleDateRangeConfirm}
        onCancel={() => setCalendarOpen(false)}
      />

      <InsightModal
        open={insightOpen}
        periodDays={periodDays}
        insights={insights}
        onClose={() => setInsightOpen(false)}
      />

      {detailCategory && (
        <MobileOverlay className="min-h-dvh bg-white">
          <ScreenHeader title="분석 기록" onBack={() => setDetailCategory(null)} />
          <div className="flex-1 overflow-y-auto px-3.5 py-4 pb-24">
            <h2 className="text-[20px] font-bold leading-[28px] text-foreground">
              &ldquo;{detailLabel}&rdquo;은
              <br />
              이렇게 도출됐어요
            </h2>
            <p className="mt-2 text-[13px] text-olive">
              아래 기록들에서 공통적으로 &ldquo;{detailLabel}&rdquo; 관련 행동이 확인됐어요.
            </p>

            {detailRecords.length === 0 ? (
              <p className="mt-20 text-center text-[15px] text-olive">
                아직 분석할 기록이 없어요
              </p>
            ) : (
              <div className="mt-6 space-y-3">
                {detailRecords.map((r) => {
                  // 현재 보고 있는 역량 대분류 태그를 우선, 기록당 최대 2개
                  const matched = (r.tags ?? []).filter(
                    (t) => t.tag?.name && (!detailCategory || t.tag.category === detailCategory),
                  );
                  const fallback = (r.tags ?? []).filter((t) => t.tag?.name);
                  const tagNames = (matched.length > 0 ? matched : fallback)
                    .map((t) => t.tag!.name)
                    .slice(0, 2);

                  return (
                    <button
                      key={r.id}
                      type="button"
                      className="w-full rounded-[14px] bg-[#f1f1f1] px-3.5 py-3.5 text-left"
                      onClick={() => router.push(`/records/${r.id}?from=report`)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-h-[15px] flex-wrap gap-x-2 gap-y-1">
                          {tagNames.map((name) => (
                            <span
                              key={name}
                              className="text-[11px] font-bold leading-[15px] text-primary"
                            >
                              #{name}
                            </span>
                          ))}
                        </div>
                        <span className="shrink-0 text-[12px] font-medium leading-[15px] text-primary">
                          분석 완료
                        </span>
                      </div>

                      <p className="mt-2 text-[16px] font-black leading-[22px] text-foreground">
                        {CATEGORY_LABELS[r.category] ?? r.category}
                      </p>
                      <p className="mt-1 text-[12px] font-medium leading-[15px] text-olive">
                        {r.record_date}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-[14px] font-medium leading-[21px] text-[#5e574a]">
                        {r.summary?.trim()
                          ? `“${r.summary.trim()}”`
                          : '“기록이 저장되었습니다.”'}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="shrink-0 px-3.5 py-4">
            <Button fullWidth onClick={() => setDetailCategory(null)}>
              확인했어요
            </Button>
          </div>
        </MobileOverlay>
      )}

      <ErrorModal error={error} onClose={() => setError(null)} onRetry={handleInsight} />
    </div>
  );
}
