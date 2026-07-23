'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FigmaImage } from '@/components/ui/FigmaImage';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isAfter,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  parseISO,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '@/components/ui/Button';
import { GNB } from '@/components/layout/GNB';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';
import { figmaAssets } from '@/lib/figma-assets';
import { loadHomeNavState, saveHomeNavState } from '@/lib/nav-state';
import {
  getCalendarMonthCache,
  getHomeRecordsCache,
  setCalendarMonthCache,
  setHomeRecordsCache,
} from '@/lib/screen-cache';
import { ExperienceRecordCard } from '@/components/record/ExperienceRecordCard';
import type { Record } from '@/types';
import { cn } from '@/lib/utils';

const SWIPE_THRESHOLD = 50;

function parseStoredDate(value: string | undefined, fallback: Date) {
  if (!value) return fallback;
  try {
    const d = parseISO(value);
    return Number.isNaN(d.getTime()) ? fallback : d;
  } catch {
    return fallback;
  }
}

export default function HomePage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { loading: authLoading } = useRequireAuth();
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMonth, setViewMonth] = useState(new Date());
  const [viewWeekStart, setViewWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 0 }),
  );
  const [expanded, setExpanded] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [records, setRecords] = useState<Record[]>([]);
  const [markedDates, setMarkedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const saved = loadHomeNavState();
    if (saved) {
      const selected = parseStoredDate(saved.selectedDate, new Date());
      setSelectedDate(selected);
      setViewMonth(parseStoredDate(saved.viewMonth, selected));
      setViewWeekStart(
        parseStoredDate(
          saved.viewWeekStart,
          startOfWeek(selected, { weekStartsOn: 0 }),
        ),
      );
      setExpanded(saved.expanded ?? false);

      const cached = getHomeRecordsCache(formatDate(selected));
      if (cached) setRecords(cached);

      const monthKey = format(parseStoredDate(saved.viewMonth, selected), 'yyyy-MM');
      const monthCached = getCalendarMonthCache(monthKey);
      if (monthCached) setMarkedDates(new Set(monthCached));
    } else {
      const cached = getHomeRecordsCache(formatDate(new Date()));
      if (cached) setRecords(cached);
      const monthCached = getCalendarMonthCache(format(new Date(), 'yyyy-MM'));
      if (monthCached) setMarkedDates(new Set(monthCached));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveHomeNavState({
      selectedDate: formatDate(selectedDate),
      viewMonth: formatDate(viewMonth),
      viewWeekStart: formatDate(viewWeekStart),
      expanded,
    });
  }, [hydrated, selectedDate, viewMonth, viewWeekStart, expanded]);

  // 선택일 기록: 캐시 있으면 즉시 표시, 없으면 스피너 → 백그라운드 갱신
  useEffect(() => {
    if (authLoading || !hydrated) return;
    const token = getToken();
    if (!token) return;

    const dateStr = formatDate(selectedDate);
    const cached = getHomeRecordsCache(dateStr);
    if (cached) {
      setRecords(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }

    let cancelled = false;
    api
      .getRecordsByDate(token, dateStr)
      .then((dayRecords) => {
        if (cancelled) return;
        const list = dayRecords as Record[];
        setHomeRecordsCache(dateStr, list);
        setRecords(list);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, hydrated, getToken, selectedDate]);

  // 캘린더 점: 캐시 우선, 없으면 백그라운드 fetch (스피너 없음)
  useEffect(() => {
    if (authLoading || !hydrated) return;
    const token = getToken();
    if (!token) return;

    const monthKey = format(viewMonth, 'yyyy-MM');
    const cached = getCalendarMonthCache(monthKey);
    if (cached) {
      setMarkedDates((prev) => {
        const next = new Set(prev);
        for (const d of cached) next.add(d);
        return next;
      });
      return;
    }

    let cancelled = false;
    const from = formatDate(startOfMonth(viewMonth));
    const to = formatDate(endOfMonth(viewMonth));
    api
      .getCalendarDates(token, from, to)
      .then((dates) => {
        if (cancelled) return;
        const list = dates as string[];
        setCalendarMonthCache(monthKey, list);
        setMarkedDates((prev) => {
          const next = new Set(prev);
          for (const d of list) next.add(d);
          return next;
        });
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [authLoading, hydrated, getToken, viewMonth]);

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const weekDays = eachDayOfInterval({
    start: viewWeekStart,
    end: endOfWeek(viewWeekStart, { weekStartsOn: 0 }),
  });

  const displayDays = expanded ? weekDays : days;

  function goPrev() {
    if (expanded) {
      const prev = subWeeks(viewWeekStart, 1);
      setViewWeekStart(prev);
      setViewMonth(prev);
    } else {
      setViewMonth(subMonths(viewMonth, 1));
    }
  }

  function goNext() {
    if (expanded) {
      const next = addWeeks(viewWeekStart, 1);
      setViewWeekStart(next);
      setViewMonth(next);
    } else {
      setViewMonth(addMonths(viewMonth, 1));
    }
  }

  function handleSelectDate(day: Date) {
    setSelectedDate(day);
    setViewWeekStart(startOfWeek(day, { weekStartsOn: 0 }));
    if (!isSameMonth(day, viewMonth)) {
      setViewMonth(day);
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta > 0) {
      goPrev();
    } else {
      goNext();
    }
  }

  const isSelectedToday = isSameDay(selectedDate, today);
  const recordsTitle = isSelectedToday
    ? '오늘의 기록'
    : `${format(selectedDate, 'M월 d일', { locale: ko })}의 기록`;

  if (authLoading) return null;

  return (
    <div className="flex min-h-dvh flex-col bg-white pb-20">
      <header className="px-3.5 pt-3">
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label={expanded ? '주간 캘린더' : '월간 캘린더'}
        >
          <div className="px-3 pt-3">
            <div className="mb-2 flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center"
                  aria-label={expanded ? '이전 주' : '이전 달'}
                  onClick={goPrev}
                >
                  <FigmaImage
                    src={figmaAssets.calendarPrev}
                    alt=""
                    width={6}
                    height={11}
                    className="h-[11px] w-[6px] object-contain"
                  />
                </button>
                <span className="min-w-[88px] text-center text-[12.5px] font-bold text-foreground">
                  {format(viewMonth, 'yyyy년 M월', { locale: ko })}
                </span>
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center"
                  aria-label={expanded ? '다음 주' : '다음 달'}
                  onClick={goNext}
                >
                  <FigmaImage
                    src={figmaAssets.calendarNext}
                    alt=""
                    width={6}
                    height={11}
                    className="h-[11px] w-[6px] object-contain"
                  />
                </button>
              </div>
              <span className="text-[10px] font-medium text-primary">
                과거의 경험도 기록할 수 있어요
              </span>
            </div>

            {/* 월간: 요일 헤더 고정 / 주간(접기): 요일을 날짜 셀 안에 넣어 세로 타원 강조 */}
            {!expanded && (
              <div className="grid grid-cols-7 gap-0 text-center text-[9px] font-bold text-olive">
                {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                  <span key={d} className={cn('py-1', d === '일' && 'text-primary')}>
                    {d}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-7 gap-0">
              {displayDays.map((day) => {
                const dateStr = formatDate(day);
                const isToday = isSameDay(day, today);
                const isSelected = isSameDay(day, selectedDate);
                const isFuture = isAfter(day, today) && !isSameDay(day, today);
                const hasRecord = markedDates.has(dateStr);
                const inMonth = isSameMonth(day, viewMonth);
                const weekday = ['일', '월', '화', '수', '목', '금', '토'][day.getDay()];
                const dayColor = cn(
                  // 오늘만 키컬러, 선택일은 하이라이트만 (글자색 유지)
                  !inMonth && !expanded && 'text-[#d1cbcb]',
                  (inMonth || expanded) && isToday && 'text-primary',
                  (inMonth || expanded) && !isToday && 'text-foreground',
                );

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={isFuture}
                    aria-label={`${format(day, 'M월 d일', { locale: ko })}${hasRecord ? ', 기록 있음' : ''}${isToday ? ', 오늘' : ''}`}
                    aria-pressed={isSelected}
                    onClick={() => {
                      if (!isFuture) handleSelectDate(day);
                    }}
                    className={cn(
                      'relative flex items-center justify-center',
                      expanded ? 'h-[62px]' : 'h-11',
                      isFuture && 'opacity-30',
                    )}
                  >
                    {/* 주간(접기): 요일+날짜를 감싸는 세로 타원 */}
                    {expanded && isSelected && (
                      <span
                        className="absolute left-1/2 top-1/2 h-[56px] w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f8d9da]"
                        aria-hidden
                      />
                    )}

                    <span
                      className={cn(
                        'relative z-10 flex flex-col items-center',
                        expanded ? 'gap-0.5' : '',
                      )}
                    >
                      {expanded && (
                        <span
                          className={cn(
                            'text-[9px] font-bold text-olive',
                            (weekday === '일' || isToday) && 'text-primary',
                          )}
                        >
                          {weekday}
                        </span>
                      )}
                      <span
                        className={cn(
                          'relative flex h-9 w-9 items-center justify-center text-[14px] font-bold',
                          dayColor,
                        )}
                      >
                        {/* 월간: 날짜만 원형 하이라이트 */}
                        {!expanded && isSelected && (
                          <span
                            className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f8d9da]"
                            aria-hidden
                          />
                        )}
                        <span className="relative z-10">{format(day, 'd')}</span>
                      </span>
                    </span>

                    {hasRecord && (
                      <FigmaImage
                        src={figmaAssets.calendarDot}
                        alt=""
                        width={6}
                        height={6}
                        className={cn(
                          'absolute left-1/2 z-10 -translate-x-1/2',
                          expanded ? 'bottom-1.5' : 'bottom-1',
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="mt-1 flex w-full items-center justify-center py-1"
              aria-label={expanded ? '월간 보기로 접기' : '주간 보기로 펼치기'}
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
            >
              <FigmaImage
                src={expanded ? figmaAssets.calendarExpand : figmaAssets.calendarCollapse}
                alt=""
                width={14}
                height={8}
                className="h-2 w-3.5 object-contain"
              />
            </button>
          </div>

          <section className="border-t border-[#f1f1f1] px-3.5 pb-4 pt-3">
            <h2 className="mb-4 text-[16px] font-bold tracking-[0.475px] text-foreground">
              {recordsTitle} <span className="text-primary">{records.length}</span>
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <p className="text-[16px] font-bold text-foreground">앗, 아직 기록이 없어요</p>
                <Button
                  fullWidth
                  className="mt-6 h-12 rounded-[11px]"
                  onClick={() => router.push(`/record/category?date=${formatDate(selectedDate)}`)}
                >
                  기록 추가하기
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((record) => (
                  <ExperienceRecordCard
                    key={record.id}
                    record={record}
                    onClick={() => router.push(`/records/${record.id}?from=home`)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </header>

      {records.length > 0 && (
        <button
          type="button"
          onClick={() => router.push(`/record/category?date=${formatDate(selectedDate)}`)}
          className="fixed bottom-[88px] right-[calc(50%-160px)] z-30 flex h-[42px] items-center gap-1 rounded-full bg-primary px-4 shadow-[0_4px_12px_rgba(236,108,108,0.4)]"
          aria-label="기록하기"
        >
          <span className="text-[22px] font-bold leading-none text-white">+</span>
          <span className="text-[15px] font-bold text-white">기록</span>
        </button>
      )}

      <GNB />
    </div>
  );
}
