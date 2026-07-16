'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { FigmaImage } from '@/components/ui/FigmaImage';
import { RecordDetailCard } from '@/components/record/RecordDetailCard';
import { CompetencyTagExplainModal } from '@/components/record/CompetencyTagExplainModal';
import { figmaAssets } from '@/lib/figma-assets';
import { useRecordDraft } from '@/hooks/useRecordDraft';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import type { Record } from '@/types';

/** Figma 시안 2: 기록 완료 (343:1408) */
function CompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { getToken } = useAuth();
  const { reset } = useRecordDraft();
  useRequireAuth();
  const [record, setRecord] = useState<Record | null>(null);
  const [explainOpen, setExplainOpen] = useState(false);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    if (!id) return;
    const token = getToken();
    if (!token) return;
    api.getRecord(token, id).then(setRecord).catch(console.error);
  }, [id, getToken]);

  if (!record) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const hasTags = (record.tags?.length ?? 0) > 0;

  return (
    <div className="flex min-h-dvh flex-col bg-white px-4 pb-6 pt-8">
      <div className="flex flex-col items-center">
        <FigmaImage src={figmaAssets.checkBox} alt="" width={24} height={24} className="h-6 w-6" />
        <h1 className="mt-3 text-center tracking-[-0.18px] text-[#464545]">
          <span className="text-[22px] font-black text-primary">기록</span>
          <span className="text-[18px] font-black"> 완료!</span>
        </h1>
        {record.status === 'SAVED_UNANALYZED' && (
          <p className="mt-2 text-center text-[20px] font-bold leading-[28px] text-olive">
            적절한 역량 태그를 찾을 수 없었어요.
          </p>
        )}
      </div>

      <div className="mt-6 flex-1 overflow-y-auto">
        <RecordDetailCard record={record} hideUnanalyzedBanner />
        {hasTags && (
          <button
            type="button"
            onClick={() => setExplainOpen(true)}
            className="mt-3 text-left text-[14px] font-bold text-primary"
          >
            → 나의 역량 태그 설명
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <Button
          variant="secondary"
          fullWidth
          className="h-12"
          onClick={() => router.push('/record/category')}
        >
          새로운 기록 시작하기
        </Button>
        <Button fullWidth className="h-12" onClick={() => router.push('/home')}>
          홈으로 돌아가기
        </Button>
      </div>

      <CompetencyTagExplainModal
        open={explainOpen}
        tags={record.tags ?? []}
        onClose={() => setExplainOpen(false)}
      />
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense>
      <CompleteContent />
    </Suspense>
  );
}
