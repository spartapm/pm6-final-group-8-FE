'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { FigmaImage } from '@/components/ui/FigmaImage';
import { BackButton } from '@/components/ui/BackButton';
import { getEmotionImage } from '@/lib/constants/categories';
import { figmaAssets } from '@/lib/figma-assets';
import { useRecordDraft } from '@/hooks/useRecordDraft';
import { useRequireAuth } from '@/hooks/useRequireAuth';

/** Figma 시안 2: 감정 체크 유형 1~5 (343:1559 ~ 343:1662) */
export default function EmotionPage() {
  const router = useRouter();
  const { emotionLevel, setEmotionLevel, category } = useRecordDraft();
  useRequireAuth();

  useEffect(() => {
    if (!category) router.replace('/record/category');
  }, [category, router]);

  if (!category) return null;

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="flex h-[50px] shrink-0 items-center pl-[22px]">
        <BackButton
          onClick={() => router.back()}
          className="h-auto w-auto text-[22px] font-normal text-olive"
        />
      </header>

      <div className="flex flex-1 flex-col px-[21px] pb-24 pt-2">
        <p className="text-center text-[11px] font-black text-[#464545]/80">기록 시작 전</p>
        <h1 className="mt-2 text-center text-[17px] font-black leading-[23.8px] text-[#464545]">
          당시 <span className="text-[20px] text-primary">기분</span>이 어땠나요?
        </h1>
        <p className="mt-1 text-center text-[11px] text-[#464545]/75">솔직하게 알려주세요.</p>

        <div className="mt-10 flex flex-1 flex-col items-center justify-center">
          <FigmaImage
            src={getEmotionImage(emotionLevel)}
            alt=""
            width={89}
            height={89}
            className="h-[89px] w-[89px] object-contain"
          />

          <div className="relative mt-12 w-full">
            <FigmaImage
              src={figmaAssets.emotionSliderSad}
              alt=""
              width={25}
              height={25}
              className="absolute bottom-[18px] left-0 h-[25px] w-[25px] object-contain"
            />
            <FigmaImage
              src={figmaAssets.emotionSliderHappy}
              alt=""
              width={27}
              height={27}
              className="absolute bottom-[16px] right-0 h-[27px] w-[27px] object-contain"
            />

            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={emotionLevel}
              onChange={(e) => setEmotionLevel(Number(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded bg-[#e7e7e7] accent-[#f1aeaf] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#f1aeaf] [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
              style={{
                background: `linear-gradient(to right, #f1aeaf 0%, #f1aeaf ${((emotionLevel - 1) / 4) * 100}%, #e7e7e7 ${((emotionLevel - 1) / 4) * 100}%, #e7e7e7 100%)`,
              }}
            />

            <div className="mt-3 flex justify-between text-[9px] text-[#5c5c5c]/60">
              <span>힘들어요</span>
              <span>좋아요</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[375px] -translate-x-1/2 bg-white px-[22px] py-4">
        <Button fullWidth className="h-12" onClick={() => router.push('/record/chat')}>
          기록 시작하기
        </Button>
      </div>
    </div>
  );
}
