'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScreenHeader } from '@/components/ui/BackButton';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { COMPETENCY_CATEGORIES } from '@/lib/constants/categories';
import { COMPETENCY_TAG_GROUPS } from '@/lib/constants/competency-tags';
import { cn } from '@/lib/utils';

type TabId = 'all' | (typeof COMPETENCY_CATEGORIES)[number]['id'];

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'all', label: '전체' },
  ...COMPETENCY_CATEGORIES.map((c) => ({ id: c.id as TabId, label: c.label })),
];

export default function CompetenciesPage() {
  const router = useRouter();
  useRequireAuth();
  const [tab, setTab] = useState<TabId>('all');

  const groups = useMemo(() => {
    if (tab === 'all') return COMPETENCY_TAG_GROUPS;
    return COMPETENCY_TAG_GROUPS.filter((g) => g.category === tab);
  }, [tab]);

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <ScreenHeader title="역량 태그 모음집" onBack={() => router.push('/my')} />

      <div className="border-b border-[#e9ecef]">
        <div className="flex overflow-x-auto px-1 scrollbar-none">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'shrink-0 border-b-2 px-4 pb-3 pt-2.5 text-[14px] whitespace-nowrap',
                  active
                    ? 'border-primary font-semibold text-primary'
                    : 'border-transparent font-medium text-[#868e96]',
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 pb-10">
        {groups.map((group) => (
          <section key={group.category} className="rounded-[14px] bg-[#f1f1f1] px-3.5 py-3.5">
            <h2 className="mb-3 text-[16px] font-black text-foreground">{group.label}</h2>
            <ul className="space-y-3.5">
              {group.tags.map((tag) => (
                <li key={tag.code}>
                  <p className="text-[14px] font-bold text-primary">#{tag.name}</p>
                  <p className="mt-1 text-[13px] leading-[21px] text-[#5e574a]">{tag.definition}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
