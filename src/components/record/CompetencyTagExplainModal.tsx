'use client';

import { FigmaImage } from '@/components/ui/FigmaImage';
import { figmaAssets } from '@/lib/figma-assets';
import {
  COMPETENCY_TAG_BY_CODE,
  getCompetencyTagDefinition,
} from '@/lib/constants/competency-tags';
import type { RecordTag } from '@/types';

interface CompetencyTagExplainModalProps {
  open: boolean;
  tags: RecordTag[];
  onClose: () => void;
}

export function CompetencyTagExplainModal({
  open,
  tags,
  onClose,
}: CompetencyTagExplainModalProps) {
  if (!open) return null;

  const unique = Array.from(
    new Map(
      tags
        .filter((t) => t.tag?.code || t.tag?.name)
        .map((t) => [t.tag.code || t.tag.name, t]),
    ).values(),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="competency-tag-explain-title"
        className="relative w-full max-w-[300px] overflow-hidden rounded-[20px] bg-white px-6 pb-20 pt-7 shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-[#5a5a5a]"
          aria-label="닫기"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2
          id="competency-tag-explain-title"
          className="pr-6 text-center text-[18px] font-black leading-[24px] text-primary"
        >
          나의 역량 태그 설명
        </h2>

        <div className="mt-6 max-h-[50vh] space-y-5 overflow-y-auto pb-4">
          {unique.map((t) => {
            const code = t.tag.code;
            const name = COMPETENCY_TAG_BY_CODE[code]?.name ?? t.tag.name;
            const definition =
              getCompetencyTagDefinition(code) || '역량에 대한 설명이 준비되어 있어요.';
            return (
              <div key={t.id}>
                <p className="text-[15px] font-bold leading-[22px] text-primary"># {name}</p>
                <p className="mt-1.5 text-[14px] font-bold leading-[21px] text-foreground">
                  {definition}
                </p>
              </div>
            );
          })}
        </div>

        <FigmaImage
          src={figmaAssets.logo}
          alt=""
          width={56}
          height={56}
          className="pointer-events-none absolute bottom-4 right-3 h-14 w-14 object-contain"
        />
      </div>
    </div>
  );
}
