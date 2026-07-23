'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ScreenHeader } from '@/components/ui/BackButton';
import { RecordDetailCard } from '@/components/record/RecordDetailCard';
import { CompetencyTagExplainModal } from '@/components/record/CompetencyTagExplainModal';
import { FigmaImage } from '@/components/ui/FigmaImage';
import { Modal } from '@/components/ui/Modal';
import { ErrorModal } from '@/components/ui/ErrorModal';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuth } from '@/hooks/useAuth';
import { api, ApiError } from '@/lib/api-client';
import { figmaAssets } from '@/lib/figma-assets';
import { invalidateRecordCaches } from '@/lib/screen-cache';
import type { Record } from '@/types';

function DetailContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const from = searchParams.get('from');
  const { getToken } = useAuth();
  useRequireAuth();
  const [record, setRecord] = useState<Record | null>(null);
  const [explainOpen, setExplainOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadRecord = useCallback(async () => {
    const token = getToken();
    if (!token || !id) return;
    try {
      const data = await api.getRecord(token, id);
      setRecord(data);
    } catch (e) {
      console.error(e);
    }
  }, [id, getToken]);

  useEffect(() => {
    loadRecord();
  }, [loadRecord]);

  function landingPath() {
    if (from === 'home') return '/home';
    if (from === 'report') return '/report';
    if (from === 'my-records') return '/my/records';
    return '/my/records';
  }

  function handleBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.replace(landingPath());
  }

  async function handleDelete() {
    const token = getToken();
    if (!token || !id) return;
    setDeleting(true);
    setError(null);
    try {
      await api.deleteRecord(token, id);
      invalidateRecordCaches();
      setDeleteOpen(false);
      router.replace(landingPath());
    } catch (e) {
      console.error(e);
      setDeleting(false);
      // TypeError/네트워크는 api-client가 전역 모달을 띄움 — 중복 ErrorModal 생략
      if (!(e instanceof ApiError && e.status === 0)) {
        setError(e instanceof Error ? e : new Error('삭제에 실패했어요. 다시 시도해주세요.'));
      }
    }
  }

  if (!record) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const hasTags = (record.tags?.length ?? 0) > 0;

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <ScreenHeader
        title="기록 상세"
        onBack={handleBack}
        right={
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            disabled={deleting}
            className="flex h-8 w-8 items-center justify-center disabled:opacity-50"
            aria-label="기록 삭제"
          >
            <FigmaImage
              src={figmaAssets.trash}
              alt=""
              width={22}
              height={22}
              className="h-[22px] w-[22px] object-contain"
            />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-3.5 py-4 pb-10">
        <RecordDetailCard record={record} />
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

      <CompetencyTagExplainModal
        open={explainOpen}
        tags={record.tags ?? []}
        onClose={() => setExplainOpen(false)}
      />

      <Modal
        open={deleteOpen}
        onClose={() => {
          if (!deleting) setDeleteOpen(false);
        }}
        confirmLabel="네"
        cancelLabel="아니오"
        actionsLayout="row"
        closeOnConfirm={false}
        confirmLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      >
        <div className="flex flex-col items-center gap-5 pt-2">
          <FigmaImage
            src={figmaAssets.sadBean}
            alt=""
            width={72}
            height={72}
            className="h-[72px] w-[72px] object-contain"
          />
          <p className="text-[16px] font-bold leading-[22px] text-foreground">
            정말 삭제 하시겠어요?
          </p>
        </div>
      </Modal>

      <ErrorModal
        error={error}
        onClose={() => setError(null)}
        onRetry={() => {
          setError(null);
          setDeleteOpen(true);
        }}
      />
    </div>
  );
}

export default function RecordDetailPage() {
  return (
    <Suspense>
      <DetailContent />
    </Suspense>
  );
}
