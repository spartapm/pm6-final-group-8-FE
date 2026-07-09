'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
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
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GNB } from '@/components/layout/GNB';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';
import { CATEGORY_LABELS } from '@/lib/constants/categories';
import { figmaAssets } from '@/lib/figma-assets';
import type { Record } from '@/types';
import { cn } from '@/lib/utils';

const SWIPE_THRESHOLD = 50;

export default function HomePage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { loading: authLoading } = useRequireAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMonth, setViewMonth] = useState(new Date());
  const [expanded, setExpanded] = useState(false);
  const [records, setRecords] = useState<Record[]>([]);
  const [markedDates, setMarkedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const today = new Date();

  const loadData = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const dateStr = formatDate(selectedDate);
      const from = formatDate(startOfMonth(viewMonth));
      const to = formatDate(endOfMonth(viewMonth));
      const [dayRecords, dates] = await Promise.all([
        api.getRecordsByDate(token, dateStr) as Promise<Record[]>,
        api.getCalendarDates(token, from, to) as Promise<string[]>,
      ]);
      setRecords(dayRecords);
      setMarkedDates(new Set(dates));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [getToken, selectedDate, viewMonth]);

  useEffect(() => {
    if (!authLoading) loadData();
  }, [authLoading, loadData]);

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(selectedDate, { weekStartsOn: 0 }),
  });

  const displayDays = expanded ? weekDays : days;

  function goPrev() {
    if (expanded) {
      const prev = subWeeks(selectedDate, 1);
      setSelectedDate(prev);
      setViewMonth(prev);
    } else {
      setViewMonth(subMonths(viewMonth, 1));
    }
  }

  function goNext() {
    if (expanded) {
      const next = addWeeks(selectedDate, 1);
      setSelectedDate(next);
      setViewMonth(next);
    } else {
      setViewMonth(addMonths(viewMonth, 1));
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

            <div className="grid grid-cols-7 gap-0 text-center text-[9px] font-bold text-olive">
              {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                <span key={d} className={cn('py-1', d === '일' && 'text-primary')}>
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0">
              {displayDays.map((day) => {
                const dateStr = formatDate(day);
                const isToday = isSameDay(day, today);
                const isSelected = isSameDay(day, selectedDate);
                const isFuture = isAfter(day, today) && !isSameDay(day, today);
                const isSunday = day.getDay() === 0;
                const hasRecord = markedDates.has(dateStr);
                const inMonth = isSameMonth(day, viewMonth);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={isFuture}
                    aria-label={`${format(day, 'M월 d일', { locale: ko })}${hasRecord ? ', 기록 있음' : ''}${isToday ? ', 오늘' : ''}`}
                    aria-pressed={isSelected}
                    onClick={() => {
                      if (!isFuture) setSelectedDate(day);
                    }}
                    className={cn(
                      'relative flex h-11 items-center justify-center',
                      isFuture && 'opacity-30',
                    )}
                  >
                    <span
                      className={cn(
                        'relative flex h-9 w-9 items-center justify-center text-[14px] font-bold',
                        !inMonth && !expanded && 'text-[#d1cbcb]',
                        !isSelected && isToday && 'text-primary',
                        !isSelected && !isToday && inMonth && isSunday && 'text-primary',
                        !isSelected && !isToday && inMonth && !isSunday && 'text-foreground',
                        isSelected && 'text-primary',
                      )}
                    >
                      {isSelected && (
                        <span
                          className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 translate-y-[calc(-50%+3px)] rounded-full bg-[#f8d9da]"
                          aria-hidden
                        />
                      )}
                      <span className="relative z-10">{format(day, 'd')}</span>
                    </span>
                    {hasRecord && (
                      <FigmaImage
                        src={figmaAssets.calendarDot}
                        alt=""
                        width={6}
                        height={6}
                        className="absolute bottom-1 left-1/2 -translate-x-1/2"
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
              오늘의 기록 <span className="text-primary">{records.length}</span>
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
                  <button
                    key={record.id}
                    type="button"
                    onClick={() => router.push(`/records/${record.id}?from=home`)}
                    className="relative w-full rounded-[14px] bg-[#f1f1f1] p-3.5 text-left"
                  >
                    <div className="mb-2 flex flex-wrap items-start gap-1.5 pr-16">
                      {record.tags && record.tags.length > 0
                        ? record.tags.slice(0, 2).map((t) => (
                            <Badge key={t.id} variant="tag">#{t.tag.name}</Badge>
                          ))
                        : null}
                    </div>
                    <Badge
                      variant={record.status === 'SAVED_ANALYZED' ? 'success' : 'warning'}
                      className="absolute right-3.5 top-3.5"
                    >
                      {record.status === 'SAVED_ANALYZED' ? '분석 완료' : '분석 미완료'}
                    </Badge>
                    <p className="text-[16px] font-black text-foreground">
                      {CATEGORY_LABELS[record.category]}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[14px] leading-[21px] text-[#5e574a]">
                      {record.summary ? `"${record.summary}"` : '기록이 저장되었습니다.'}
                    </p>
                  </button>
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
