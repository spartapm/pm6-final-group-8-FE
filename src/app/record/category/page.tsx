'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { CategoryIcon } from '@/components/record/CategoryIcon';
import { EXPERIENCE_CATEGORIES } from '@/lib/constants/categories';
import { useRecordDraft } from '@/hooks/useRecordDraft';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { cn } from '@/lib/utils';
import type { ExperienceCategoryId } from '@/lib/constants/categories';

/** Figma: 경험 카테고리 선택 화면 (1018:1379) — 세로 리스트 */
function CategoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const { setCategory, setRecordDate, reset } = useRecordDraft();
  const [selected, setSelected] = useState<ExperienceCategoryId | null>(null);
  useRequireAuth();

  // C008: 새 기록 시작 시 이전 세션 드래프트 초기화
  useEffect(() => {
    reset();
    if (date) setRecordDate(date);
    else setRecordDate(new Date().toISOString().slice(0, 10));
  }, [date, reset, setRecordDate]);

  return (
    <div className="flex min-h-dvh flex-col bg-[#fbf8f9]">
      <header className="relative flex h-[50px] shrink-0 items-center justify-center bg-[#fbf8f9]">
        <BackButton
          onClick={() => router.push('/home')}
          className="absolute left-[22px] h-auto w-auto text-[22px] font-normal text-olive"
        />
        <h1 className="text-[21px] font-bold leading-[33px] text-foreground">오늘의 기록</h1>
      </header>

      <div className="flex flex-1 flex-col px-[22px] pb-28 pt-2">
        <p className="mb-5 text-center text-[18px] font-bold leading-[33px] text-foreground">
          경험의
          <span className="text-primary"> 유형</span>
          을 선택해주세요
        </p>

        <div className="flex flex-col gap-[15px]">
          {EXPERIENCE_CATEGORIES.map((cat) => {
            const isSelected = selected === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelected(cat.id)}
                className={cn(
                  'flex h-[50px] w-full items-center gap-3 rounded-[11px] px-3 text-left transition-colors',
                  isSelected
                    ? 'bg-primary'
                    : 'border border-[#c0c0c0] bg-[#fbf8f9]',
                )}
              >
                <CategoryIcon src={cat.icon} selected={isSelected} />
                <span
                  className={cn(
                    'text-[16px] font-medium',
                    isSelected ? 'text-white' : 'text-foreground',
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
          className="h-12 rounded-[11px]"
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
