'use client';

import { CATEGORY_LABELS } from '@/lib/constants/categories';
import { parseQaPairs, highlightEvidence } from '@/lib/record-utils';
import type { Record } from '@/types';
import { cn } from '@/lib/utils';

/** Figma 시안 2: 기록 완료/상세 카드 (543:1006, 343:1452) */
interface RecordDetailCardProps {
  record: Record;
  className?: string;
}

export function RecordDetailCard({ record, className }: RecordDetailCardProps) {
  const pairs = parseQaPairs(record.messages ?? []);
  const tags = record.tags ?? [];
  const analyzed = record.status === 'SAVED_ANALYZED';

  return (
    <div className={cn('rounded-[14px] bg-[#f1f1f1] px-4 py-4', className)}>
      {analyzed ? (
        <p className="mb-4 text-center text-[18px] font-black uppercase tracking-[0.57px] text-foreground">
          AI 분석 완료
        </p>
      ) : record.status === 'SAVED_UNANALYZED' ? (
        <div className="mb-4 text-center">
          <p className="text-[14px] font-bold text-olive">분석 미완료</p>
          <p className="mt-1 text-[12px] text-[#acacac]">
            적절한 역량 태그를 찾을 수 없었어요.
          </p>
        </div>
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

export function RecordListCard({ record, onClick, className }: RecordListCardProps) {
  const analyzed = record.status === 'SAVED_ANALYZED';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative w-full rounded-[14px] bg-[#f1f1f1] p-4 text-left',
        className,
      )}
    >
      {analyzed && (
        <span className="absolute right-3.5 top-3.5 text-[10px] font-bold text-primary">
          AI 분석 완료
        </span>
      )}
      {!analyzed && record.status === 'SAVED_UNANALYZED' && (
        <span className="absolute right-3.5 top-3.5 text-[10px] font-bold text-olive">
          분석 미완료
        </span>
      )}

      <p className="pr-20 text-[15px] font-black uppercase tracking-[0.57px] text-primary">
        {CATEGORY_LABELS[record.category]}
      </p>
      <p className="mt-1 text-[12px] text-olive">{record.record_date}</p>

      {record.tags && record.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {record.tags.map((t) => (
            <span key={t.id} className="text-[10px] font-bold text-primary">
              #{t.tag.name}
            </span>
          ))}
        </div>
      )}

      {record.summary && (
        <p className="mt-2 line-clamp-2 text-[12px] font-medium leading-[17.25px] text-[#818181]">
          {record.summary}
        </p>
      )}
    </button>
  );
}
