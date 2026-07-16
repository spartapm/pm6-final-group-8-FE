'use client';

import { CATEGORY_LABELS } from '@/lib/constants/categories';
import { parseQaPairs, highlightEvidence } from '@/lib/record-utils';
import type { Record } from '@/types';
import { cn } from '@/lib/utils';

/** Figma 시안 2: 기록 완료/상세 카드 (543:1006, 343:1452) */
interface RecordDetailCardProps {
  record: Record;
  className?: string;
  /** 완료 화면에서 미분석 문구를 카드 밖(제목 아래)에 둘 때 */
  hideUnanalyzedBanner?: boolean;
}

export function RecordDetailCard({
  record,
  className,
  hideUnanalyzedBanner = false,
}: RecordDetailCardProps) {
  const pairs = parseQaPairs(record.messages ?? []);
  const tags = record.tags ?? [];
  const analyzed = record.status === 'SAVED_ANALYZED';

  return (
    <div className={cn('rounded-[14px] bg-[#f1f1f1] px-4 py-4', className)}>
      {analyzed ? (
        <p className="mb-4 text-center text-[18px] font-black uppercase tracking-[0.57px] text-foreground">
          AI 분석 완료
        </p>
      ) : record.status === 'SAVED_UNANALYZED' && !hideUnanalyzedBanner ? (
        <p className="mb-4 text-center text-[14px] font-bold text-olive">분석 미완료</p>
      ) : null}

      <div className="mb-4 flex items-start justify-between gap-2">
        <p className="text-[15px] font-black uppercase tracking-[0.57px] text-primary">
          {CATEGORY_LABELS[record.category]}
        </p>
        <span className="text-[12px] text-olive">{record.record_date}</span>
      </div>

      <div className="space-y-5">
        {pairs.map((pair, i) => {
          const pairTags = tags.filter((t) => t.evidenceText && pair.answer.includes(t.evidenceText));
          const hl = pairTags[0]?.evidenceText
            ? highlightEvidence(pair.answer, pairTags[0].evidenceText)
            : null;

          return (
            <div key={i}>
              <p className="text-[12px] font-bold text-foreground">Q. {pair.question}</p>
              <p className="mt-1.5 text-[12px] font-medium leading-[17.25px] text-[#818181]">
                {typeof hl === 'object' && hl ? (
                  <>
                    {hl.before}
                    <span className="bg-[rgba(255,136,136,0.36)] px-0.5">{hl.evidence}</span>
                    {hl.after}
                  </>
                ) : (
                  pair.answer || '없음'
                )}
              </p>
              {pairTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {pairTags.map((t) => (
                    <span key={t.id} className="text-[10px] font-bold text-primary">
                      #{t.tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {record.status === 'EMPTY' && pairs.length === 0 && (
        <p className="text-center text-[12px] text-[#acacac]">쉬어간 날도 기록이에요.</p>
      )}
    </div>
  );
}

interface RecordListCardProps {
  record: Record;
  onClick: () => void;
  className?: string;
}

/** 전체 기록 목록 카드 — 태그 / 분석상태 / 활동 / 날짜 / AI 요약 */
export function RecordListCard({ record, onClick, className }: RecordListCardProps) {
  const analyzed = record.status === 'SAVED_ANALYZED';
  const tagNames = (record.tags ?? [])
    .map((t) => t.tag?.name)
    .filter((name): name is string => Boolean(name))
    .slice(0, 2);
  const summaryText =
    record.summary?.trim() || (analyzed ? '' : '기록이 저장되었습니다.');

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-[14px] bg-[#f1f1f1] px-3.5 py-3.5 text-left',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-h-[15px] flex-wrap gap-x-2 gap-y-1">
          {tagNames.map((name) => (
            <span key={name} className="text-[11px] font-bold leading-[15px] text-primary">
              #{name}
            </span>
          ))}
        </div>
        {analyzed ? (
          <span className="shrink-0 text-[12px] font-medium leading-[15px] text-primary">
            분석 완료
          </span>
        ) : (
          <span className="shrink-0 text-[12px] font-medium leading-[15px] text-olive">
            분석 미완료
          </span>
        )}
      </div>

      <p className="mt-2 text-[16px] font-black leading-[22px] text-foreground">
        {CATEGORY_LABELS[record.category] ?? record.category}
      </p>
      <p className="mt-1 text-[12px] font-medium leading-[15px] text-olive">{record.record_date}</p>

      {summaryText ? (
        <p className="mt-2 whitespace-pre-wrap text-[14px] font-medium leading-[21px] text-[#5e574a]">
          “{summaryText}”
        </p>
      ) : null}
    </button>
  );
}
