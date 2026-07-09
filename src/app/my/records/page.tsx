'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/ui/BackButton';
import { RecordListCard } from '@/components/record/RecordDetailCard';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import type { Record } from '@/types';

export default function AllRecordsPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { loading: authLoading } = useRequireAuth();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    const token = getToken();
    if (!token) return;
    api
      .getAllRecords(token)
      .then((r) => setRecords(r as Record[]))
      .finally(() => setLoading(false));
  }, [authLoading, getToken]);

  if (authLoading) return null;

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <ScreenHeader title="전체 기록" onBack={() => router.push('/my')} />

      <div className="flex-1 px-3.5 py-4">
        {loading ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[15px] text-olive">아직 작성한 기록이 없어요.</p>
            <Button className="mt-4" onClick={() => router.push('/home')}>
              홈으로 이동
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <RecordListCard
                key={record.id}
                record={record}
                onClick={() => router.push(`/records/${record.id}?from=my-records`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
