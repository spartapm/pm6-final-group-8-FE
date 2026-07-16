'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/ui/BackButton';
import { RecordListCard } from '@/components/record/RecordDetailCard';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import { EXPERIENCE_CATEGORIES } from '@/lib/constants/categories';
import type { Record } from '@/types';
import { cn } from '@/lib/utils';

type CategoryFilter = 'all' | (typeof EXPERIENCE_CATEGORIES)[number]['id'];

const FILTER_OPTIONS: Array<{ id: CategoryFilter; label: string }> = [
  { id: 'all', label: '전체' },
  ...EXPERIENCE_CATEGORIES.map((c) => ({ id: c.id as CategoryFilter, label: c.label })),
];

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M1.5 3.5h11M3.5 7h7M5.5 10.5h3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AllRecordsPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { loading: authLoading } = useRequireAuth();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    const token = getToken();
    if (!token) return;
    api
      .getAllRecords(token)
      .then((r) => setRecords(r as Record[]))
      .finally(() => setLoading(false));
  }, [authLoading, getToken]);

  useEffect(() => {
    if (!filterOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [filterOpen]);

  const filtered = useMemo(() => {
    const list =
      filter === 'all'
        ? records
        : records.filter((r) => {
            if (filter === 'resume') return r.category === 'resume' || r.category === 'job_prep';
            if (filter === 'other') return r.category === 'other' || r.category === 'daily';
            return r.category === filter;
          });
    return [...list].sort((a, b) => {
      const byDate = b.record_date.localeCompare(a.record_date);
      if (byDate !== 0) return byDate;
      return b.created_at.localeCompare(a.created_at);
    });
  }, [records, filter]);

  const filterLabel = FILTER_OPTIONS.find((o) => o.id === filter)?.label ?? '전체';

  if (authLoading) return null;

  return (
    <div className="flex min-h-dvh flex-col bg-[#fbf8f9]">
      <ScreenHeader title="전체 기록" onBack={() => router.push('/my')} />

      <div className="relative flex justify-end px-3.5 pb-3 pt-1" ref={filterRef}>
        <button
          type="button"
          onClick={() => setFilterOpen((v) => !v)}
          className="relative flex h-[34px] items-center gap-1.5 rounded-[10px] bg-white px-3 text-[13px] font-bold text-primary shadow-[0_2px_6px_rgba(0,0,0,0.1)]"
          aria-expanded={filterOpen}
          aria-haspopup="listbox"
        >
          <FilterIcon className="text-primary" />
          <span>{filterLabel}</span>
        </button>

        {filterOpen && (
          <div
            role="listbox"
            className="absolute right-3.5 top-[42px] z-20 w-[min(280px,calc(100vw-28px))] rounded-[16px] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
          >
            <div className="flex flex-col gap-3.5">
              {FILTER_OPTIONS.map((opt) => {
                const selected = filter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setFilter(opt.id);
                      setFilterOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <span
                      className={cn(
                        'text-[14px] leading-[20px]',
                        selected
                          ? 'font-bold text-foreground'
                          : 'font-medium text-[#b0b0b0]',
                      )}
                    >
                      {opt.label}
                    </span>
                    <span
                      className={cn(
                        'h-5 w-5 shrink-0 rounded-full',
                        selected
                          ? 'border-[3px] border-primary'
                          : 'border border-[#e5e5e5]',
                      )}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 px-3.5 pb-8">
        {loading ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[15px] text-olive">아직 작성한 기록이 없어요.</p>
            <Button className="mt-4" onClick={() => router.push('/home')}>
              홈으로 이동
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((record) => (
              <RecordListCard
                key={record.id}
                record={record}
                onClick={() => router.push(`/records/${record.id}?from=my-records`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
