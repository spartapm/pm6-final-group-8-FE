'use client';

import { CATEGORY_LABELS } from '@/lib/constants/categories';
import { cn } from '@/lib/utils';

export interface ExperienceRecordCardData {
  id: string;
  category: string;
  record_date: string;
  summary?: string | null;
  tags?: Array<{
    id?: string;
    tag: { name: string; category?: string } | null;
  }>;
}

interface ExperienceRecordCardProps {
  record: ExperienceRecordCardData;
  onClick: () => void;
  /** 역량 대분류 화면처럼 해당 카테고리 태그를 우선 노출 */
  preferTagCategory?: string | null;
  className?: string;
}

/**
 * 홈 / 분석 기록 공통 경험 기록 카드
 * 활동+날짜 → 역량 태그(최대 2, 없으면 공백) → AI 요약 전체
 */
export function ExperienceRecordCard({
  record,
  onClick,
  preferTagCategory,
  className,
}: ExperienceRecordCardProps) {
  const matched = (record.tags ?? []).filter(
    (t) => t.tag?.name && (!preferTagCategory || t.tag.category === preferTagCategory),
  );
  const fallback = (record.tags ?? []).filter((t) => t.tag?.name);
  const tags = (matched.length > 0 ? matched : fallback).slice(0, 2);
  const summaryText = record.summary?.trim() || '기록이 저장되었습니다.';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-[14px] bg-[#f1f1f1] px-3.5 py-3.5 text-left',
        className,
      )}
    >
      {/* 활동 카테고리 + 날짜 */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-[16px] font-black leading-[22px] text-foreground">
          {CATEGORY_LABELS[record.category] ?? record.category}
        </p>
        <span className="shrink-0 pt-0.5 text-[12px] font-medium leading-[15px] text-olive">
          {record.record_date}
        </span>
      </div>

      {/* 역량 태그 최대 2개 (없으면 공백 유지) */}
      <div className="mt-1.5 flex min-h-[15px] flex-wrap gap-x-2 gap-y-1">
        {tags.map((t, i) => (
          <span
            key={t.id ?? `${t.tag!.name}-${i}`}
            className="text-[11px] font-bold leading-[15px] text-primary"
          >
            #{t.tag!.name}
          </span>
        ))}
      </div>

      {/* AI 요약 전체 노출 */}
      <p className="mt-1.5 whitespace-pre-wrap break-words text-[14px] font-medium leading-[21px] text-[#5e574a]">
        &ldquo;{summaryText}&rdquo;
      </p>
    </button>
  );
}
