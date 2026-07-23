'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GNB } from '@/components/layout/GNB';
import { FigmaImage } from '@/components/ui/FigmaImage';
import { Modal } from '@/components/ui/Modal';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import { figmaAssets } from '@/lib/figma-assets';
import { getUserStatsCache, setUserStatsCache } from '@/lib/screen-cache';
import type { UserStats } from '@/types';

const MINI_BAR_HEIGHTS = [7, 14.5, 7, 21.5, 28.5, 21.5, 35.5, 28.5, 43, 35.5, 52, 35.5];

/** Figma 시안 2: 마이페이지 개편 (431:1198) */
export default function MyPage() {
  const router = useRouter();
  const { signOut, getToken, session } = useAuth();
  const { loading: authLoading } = useRequireAuth();
  const [stats, setStats] = useState<UserStats | null>(() => getUserStatsCache());
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    const token = getToken();
    if (!token) return;
    api
      .getUserStats(token)
      .then((data) => {
        setUserStatsCache(data);
        setStats(data);
      })
      .catch(console.error);
  }, [authLoading, getToken]);

  async function handleLogout() {
    await signOut();
    router.replace('/');
  }

  if (authLoading) return null;

  const displayName = session?.user.email?.split('@')[0] ?? '사용자';

  return (
    <div className="flex min-h-dvh flex-col bg-white pb-20">
      <header className="border-b border-[#ddd2ba] px-[17px] pb-4 pt-5">
        <h1 className="text-[19px] font-black text-foreground">{displayName}</h1>
      </header>

      <div
        className="relative mx-3.5 mt-4 h-[82px] overflow-hidden rounded-[16px]"
        style={{
          backgroundImage:
            'linear-gradient(125.54deg, rgba(245, 220, 205, 0.74) 1.89%, rgba(236, 108, 108, 0.74) 94.1%)',
        }}
      >
        <FigmaImage
          src={figmaAssets.myAvatar}
          alt=""
          width={47}
          height={47}
          className="absolute left-[18px] top-[18px] h-[47px] w-[47px] object-contain"
        />
        <p className="absolute left-[72px] top-1/2 w-[228px] -translate-y-1/2 text-[11px] font-bold leading-[16px] text-white">
          <span className="block whitespace-nowrap">작은 기록도 모이면 분명한 변화가 돼요.</span>
          <span className="block whitespace-nowrap">지금까지 잘 이어오고 있어요.</span>
        </p>
        <div className="absolute bottom-[14px] right-4 flex h-[52px] items-end gap-[3px] opacity-50">
          {MINI_BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="w-[9px] rounded-t-[3px]"
              style={{
                height: `${h}px`,
                backgroundColor:
                  i >= MINI_BAR_HEIGHTS.length - 3
                    ? 'rgba(255,255,255,0.75)'
                    : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>
      </div>

      <section className="mt-4 px-3.5">
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.6px] text-olive">
          전체 기록
        </p>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => router.push('/report')}
            className="relative flex h-[179px] min-h-[120px] flex-1 flex-col overflow-hidden rounded-[16px] bg-[#ed6e6e] p-4 text-left"
          >
            <FigmaImage
              src={figmaAssets.myFlame}
              alt=""
              width={123}
              height={123}
              className="pointer-events-none absolute right-0 top-0 h-[123px] w-[123px] object-contain opacity-[0.38]"
            />
            <p className="relative mt-auto text-[12.4px] font-bold leading-[17px] text-white">
              발견된 역량
            </p>
            <p className="relative text-white">
              <span className="text-[52px] font-bold leading-[52px]">{stats?.totalTags ?? 0}</span>
              <span className="ml-1 text-[14px] font-bold">개</span>
            </p>
          </button>

          <div className="flex w-[120px] flex-col gap-2">
            <button
              type="button"
              onClick={() => router.push('/report')}
              className="flex h-[75px] flex-col rounded-[12px] border border-[#e6e6e6] bg-white p-2.5 text-left shadow-[0_2px_4.3px_rgba(160,160,160,0.2)]"
            >
              <p className="text-[9.5px] font-bold leading-[12.35px] text-olive">기록</p>
              <p className="mt-auto">
                <span className="text-[22px] font-bold leading-[22px] text-[#ed6e6e]">
                  {stats?.totalRecords ?? 0}
                </span>
                <span className="ml-0.5 text-[10px] font-bold text-olive">개</span>
              </p>
            </button>
            <button
              type="button"
              onClick={() => router.push('/report')}
              className="flex h-[94px] flex-col rounded-[12px] border border-[#e6e6e6] bg-white p-3 text-left shadow-[0_2px_4.3px_rgba(160,160,160,0.2)]"
            >
              <p className="text-[9.5px] font-bold leading-[12.35px] text-olive">경험 쌓기</p>
              <p className="text-[9px] text-olive">기록된 일자</p>
              <p className="mt-auto">
                <span className="text-[22px] font-bold leading-[22px] text-[#ed6e6e]">
                  {stats?.recordDays ?? 0}
                </span>
                <span className="ml-0.5 text-[10px] font-bold text-olive">일</span>
              </p>
            </button>
          </div>
        </div>
      </section>

      <div className="mt-8 px-[17px]">
        <button
          type="button"
          onClick={() => router.push('/my/records')}
          className="flex w-full items-center justify-between py-3"
        >
          <span className="text-[12.5px] font-bold text-foreground">전체 기록 보관함</span>
          <span className="text-[24px] leading-none text-olive">›</span>
        </button>

        <div className="my-1 h-px bg-[#f1f1f1]" />

        <button
          type="button"
          onClick={() => router.push('/my/competencies')}
          className="flex w-full items-center justify-between py-3"
        >
          <span className="text-[12.5px] font-bold text-foreground">역량 태그 모음집</span>
          <span className="text-[24px] leading-none text-olive">›</span>
        </button>

        <div className="my-1 h-px bg-[#f1f1f1]" />

        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="py-3 text-left text-[12.5px] font-bold text-[#ed6e6e]"
        >
          로그아웃
        </button>
      </div>

      <GNB />

      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        confirmLabel="네"
        cancelLabel="아니오"
        actionsLayout="row"
        primaryAction="cancel"
        onConfirm={handleLogout}
        onCancel={() => setLogoutOpen(false)}
      >
        <div className="flex flex-col items-center gap-3">
          <FigmaImage
            src={figmaAssets.sadBean}
            alt=""
            width={72}
            height={72}
            className="h-[72px] w-[72px] object-contain"
          />
          <p>정말 로그아웃 하시겠어요?</p>
        </div>
      </Modal>
    </div>
  );
}
