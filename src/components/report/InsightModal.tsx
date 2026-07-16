'use client';

import { Button } from '@/components/ui/Button';
import { MobileOverlay } from '@/components/layout/MobileOverlay';
import type { Insight } from '@/types';

interface InsightModalProps {
  open: boolean;
  periodDays: number;
  insights: Insight[];
  onClose: () => void;
}

export function InsightModal({ open, periodDays, insights, onClose }: InsightModalProps) {
  if (!open) return null;

  return (
    <MobileOverlay className="min-h-dvh bg-white">
      <header className="relative flex h-[50px] shrink-0 items-center justify-center px-3.5">
        <h1 className="text-[20px] font-black text-foreground">인사이트</h1>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3.5 flex h-7 w-7 items-center justify-center text-[22px] font-normal leading-none text-olive"
          aria-label="닫기"
        >
          ×
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-3.5 pb-4">
        <h2 className="text-[22px] font-black leading-[32px] text-foreground">
          <span className="text-primary">{periodDays}일 간</span>의 경험을
          <br />
          분석 했어요
        </h2>

        <div className="mt-5 rounded-[14px] bg-[#f8d9da]/50 px-4 py-4">
          <p className="text-[13px] font-bold text-primary">인사이트</p>

          <div className="mt-4 space-y-5">
            {insights.map((ins) => (
              <div key={ins.category}>
                <p className="text-[15px] font-bold text-foreground">{ins.categoryLabel}</p>
                <p className="mt-2 text-[13px] leading-5 text-foreground">{ins.comment}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[11px] leading-4 text-[#c4a0a0]">
            AI 분석 결과는 절대적인 판단이 아니에요.
            <br />
            작성한 기록을 바탕으로 한 참고 자료로만 활용해 주세요.
          </p>
        </div>
      </div>

      <div className="shrink-0 px-3.5 pb-6 pt-2">
        <Button
          fullWidth
          onClick={onClose}
          className="h-12 rounded-[11px] py-0 text-[15px] font-bold shadow-[0_4px_8.1px_rgba(0,0,0,0.2)]"
        >
          확인했어요
        </Button>
      </div>
    </MobileOverlay>
  );
}
