'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ScreenHeader } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { RecordDetailCard } from '@/components/record/RecordDetailCard';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
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
  const [retryLoading, setRetryLoading] = useState(false);
  const [retryError, setRetryError] = useState('');

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

  async function handleRetryAnalysis() {
    const token = getToken();
    if (!token || !id) return;
    setRetryLoading(true);
    setRetryError('');
    try {
      const updated = await api.retryAnalysis(token, id);
      setRecord(updated);
    } catch (e) {
      setRetryError(e instanceof Error ? e.message : '분석 재시도에 실패했습니다.');
    } finally {
      setRetryLoading(false);
    }
  }

  if (!record) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  function handleBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    const fallback =
      from === 'home' ? '/home' : from === 'report' ? '/report' : '/my/records';
    router.replace(fallback);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <ScreenHeader title="기록 상세" onBack={handleBack} />

      <div className="flex-1 overflow-y-auto px-3.5 py-4">
        <RecordDetailCard record={record} />

        {record.status === 'SAVED_UNANALYZED' && (
          <div className="mt-4">
            {retryError && <p className="mb-2 text-center text-[14px] text-primary">{retryError}</p>}
            <Button
              fullWidth
              className="h-12"
              loading={retryLoading}
              onClick={handleRetryAnalysis}
            >
              분석 다시 시도
            </Button>
          </div>
        )}
      </div>
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
