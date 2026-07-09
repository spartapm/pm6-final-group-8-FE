'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { FigmaImage } from '@/components/ui/FigmaImage';
import { CategoryIcon } from '@/components/record/CategoryIcon';
import { EXPERIENCE_CATEGORIES } from '@/lib/constants/categories';
import { figmaAssets } from '@/lib/figma-assets';
import { useRecordDraft } from '@/hooks/useRecordDraft';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { cn } from '@/lib/utils';
import type { ExperienceCategoryId } from '@/lib/constants/categories';

/** Figma: 최종 디자인 시안 2 → 경험 카테고리 선택 (343:1372 + 423:886, 423:884, 423:885) */
function CategoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const { setCategory, setRecordDate } = useRecordDraft();
  const [selected, setSelected] = useState<ExperienceCategoryId | null>(null);
  useRequireAuth();

  useEffect(() => {
    if (date) setRecordDate(date);
  }, [date, setRecordDate]);

  return (
    <div className="flex min-h-dvh flex-col bg-[#fbf8f9]">
      <header className="flex h-[50px] shrink-0 items-center bg-[#fbf8f9] pl-[22px]">
        <BackButton
          onClick={() => router.push('/home')}
          className="h-auto w-auto text-[22px] font-normal text-olive"
        />
      </header>

      <div className="flex flex-1 flex-col px-[6px] pb-28">
        {/* Figma 423:886: 북마크 y≈132 (헤더 아래 79px) */}
        <div className="mt-[79px] flex justify-center">
          <FigmaImage
            src={figmaAssets.categoryBookmark}
            alt=""
            width={119}
            height={119}
            className="h-[119px] w-[119px] object-contain"
          />
        </div>

        {/* Figma 423:884, 423:885: 북마크 아래 13px → 오늘의 기록 → 경험의 유형… */}
        <div className="mt-[13px] flex flex-col items-center gap-[9px] px-6 text-center">
          <p className="text-[21px] font-bold leading-[33px] text-foreground">오늘의 기록</p>
          <p className="text-[18px] font-bold leading-[33px] text-foreground">
            경험의
            <span className="text-primary"> 유형</span>
            을 선택해주세요
          </p>
        </div>

        {/* Figma 438:1164: 텍스트 아래 16px, 그리드 y≈349 */}
        <div className="mt-4 grid grid-cols-3 gap-x-[11px] gap-y-3.5">
          {EXPERIENCE_CATEGORIES.map((cat) => {
            const isSelected = selected === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelected(cat.id)}
                className={cn(
                  'flex h-[89px] flex-col items-center justify-center rounded-[16px] px-1.5 py-3 transition-all',
                  isSelected
                    ? 'bg-primary shadow-[0_4px_6.6px_rgba(0,0,0,0.17)]'
                    : 'bg-white shadow-[0_4px_6.6px_rgba(0,0,0,0.17)]',
                )}
              >
                <CategoryIcon src={cat.icon} selected={isSelected} />
                <span
                  className={cn(
                    'mt-2 text-center text-[14px] font-bold leading-[21px] tracking-[-0.308px]',
                    isSelected ? 'text-white' : 'text-olive',
                  )}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[375px] -translate-x-1/2 bg-[#fbf8f9] px-[22px] py-4">
        <Button
          fullWidth
          className="h-12"
          disabled={!selected}
          onClick={() => {
            if (selected) {
              setCategory(selected);
              router.push('/record/emotion');
            }
          }}
        >
          계속하기
        </Button>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense>
      <CategoryContent />
    </Suspense>
  );
}
