'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ScreenHeader } from '@/components/ui/BackButton';
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
