'use client';

import { useEffect, useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isAfter,
  isBefore,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '@/components/ui/Button';
import { MobileOverlay } from '@/components/layout/MobileOverlay';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  open: boolean;
  from: Date;
  to: Date;
  onConfirm: (from: Date, to: Date) => void;
  onCancel: () => void;
}

function normalizeRange(start: Date, end: Date | null) {
  if (!end) return { start, end: start };
  return isBefore(start, end) || isSameDay(start, end)
    ? { start, end }
    : { start: end, end: start };
}

function isBetween(day: Date, start: Date, end: Date) {
  return (
    (isSameDay(day, start) || isAfter(day, start)) &&
    (isSameDay(day, end) || isBefore(day, end))
  );
}

export function DateRangePicker({ open, from, to, onConfirm, onCancel }: DateRangePickerProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(to);
  const [draftStart, setDraftStart] = useState<Date | null>(from);
  const [draftEnd, setDraftEnd] = useState<Date | null>(to);

  useEffect(() => {
    if (!open) return;
    setDraftStart(from);
    setDraftEnd(to);
    setViewMonth(to);
  }, [open, from, to]);

  if (!open) return null;

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const { start: rangeStart, end: rangeEnd } = normalizeRange(
    draftStart ?? from,
    draftEnd,
  );
  const hasCompleteRange = draftStart && draftEnd;
  const isSingleDay = hasCompleteRange && isSameDay(rangeStart, rangeEnd);

  const displayFrom = draftStart ?? from;
  const displayTo = draftEnd ?? draftStart ?? to;

  function handleDayClick(day: Date) {
    if (isAfter(day, today) && !isSameDay(day, today)) return;

    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(day);
      setDraftEnd(null);
      return;
    }

    if (isBefore(day, draftStart)) {
      setDraftEnd(draftStart);
      setDraftStart(day);
      return;
    }

    setDraftEnd(day);
  }

  function handleConfirm() {
    if (!draftStart) return;
    const { start, end } = normalizeRange(draftStart, draftEnd);
    onConfirm(start, end);
  }

  return (
    <MobileOverlay backdrop className="items-center justify-center px-4">
      <div className="w-full overflow-hidden rounded-xl bg-white shadow-[0_4px_8.1px_rgba(0,0,0,0.2)]">
        <div className="px-4 pt-4">
          <p className="text-[12px] font-bold text-foreground">기간선택</p>
          <div className="mt-2 flex items-center rounded-[10px] border border-[#e0e0e0] bg-white px-3 py-2.5">
            <span className="flex-1 text-[13px] font-medium text-foreground">
              {format(displayFrom, 'yyyy-MM-dd')} - {format(displayTo, 'yyyy-MM-dd')}
            </span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0 text-olive"
              aria-hidden
            >
              <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="mt-3 bg-[#f7f7f7] px-4 py-2">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center text-[14px] text-foreground"
              onClick={() => setViewMonth(subMonths(viewMonth, 1))}
              aria-label="이전 달"
            >
              ‹
            </button>
            <div className="flex items-center gap-1 text-[13px] font-bold text-foreground">
              <span>{format(viewMonth, 'yyyy년', { locale: ko })}</span>
              <span className="text-olive">▾</span>
              <span className="ml-1">{format(viewMonth, 'M월', { locale: ko })}</span>
              <span className="text-olive">▾</span>
            </div>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center text-[14px] text-foreground"
              onClick={() => setViewMonth(addMonths(viewMonth, 1))}
              aria-label="다음 달"
            >
              ›
            </button>
          </div>
        </div>

        <div className="px-4 pb-4 pt-2">
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-olive">
            {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
              <span key={d} className="py-1.5">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day) => {
              const inMonth = isSameMonth(day, viewMonth);
              const isFuture = isAfter(day, today) && !isSameDay(day, today);
              const inRange = draftStart && isBetween(day, rangeStart, rangeEnd);
              const isStart = draftStart && isSameDay(day, rangeStart);
              const isEnd = draftEnd && isSameDay(day, rangeEnd);
              const isMiddle = Boolean(inRange && !isStart && !isEnd);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={isFuture}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    'relative flex h-10 items-center justify-center p-0 disabled:opacity-30',
                    !inMonth && 'text-[#d1cbcb]',
                  )}
                >
                  {isMiddle && (
                    <span className="absolute inset-y-1.5 inset-x-0 bg-[#f8d9da]/80" />
                  )}
                  {isStart && hasCompleteRange && !isSingleDay && (
                    <span className="absolute inset-y-1.5 left-1/2 right-0 bg-[#f8d9da]/80" />
                  )}
                  {isEnd && hasCompleteRange && !isSingleDay && (
                    <span className="absolute inset-y-1.5 left-0 right-1/2 bg-[#f8d9da]/80" />
                  )}

                  <span
                    className={cn(
                      'relative z-10 flex h-8 w-full items-center justify-center text-[13px] font-bold',
                      isStart &&
                        hasCompleteRange &&
                        !isSingleDay &&
                        'rounded-l-full bg-primary text-white',
                      isEnd &&
                        hasCompleteRange &&
                        !isSingleDay &&
                        'rounded-r-full bg-primary text-white',
                      (isStart && (!hasCompleteRange || isSingleDay)) &&
                        'mx-auto h-8 w-8 rounded-full bg-primary text-white',
                      isMiddle && 'text-primary',
                      !isStart &&
                        !isEnd &&
                        !isMiddle &&
                        inMonth &&
                        !isFuture &&
                        'text-foreground',
                      isSameDay(day, today) &&
                        !isStart &&
                        !isEnd &&
                        !isMiddle &&
                        'text-primary',
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-2 text-center text-[11px] text-olive">
            {draftStart && !draftEnd
              ? '종료일을 선택해 주세요'
              : '시작일과 종료일을 선택해 주세요'}
          </p>

          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              className="h-11 border-[#d9d9d9] text-[14px]"
              onClick={onCancel}
            >
              취소
            </Button>
            <Button
              type="button"
              fullWidth
              className="h-11 text-[14px]"
              disabled={!draftStart}
              onClick={handleConfirm}
            >
              확인
            </Button>
          </div>
        </div>
      </div>
    </MobileOverlay>
  );
}
