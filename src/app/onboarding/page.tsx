'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingCarousel } from '@/components/onboarding/OnboardingCarousel';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { figmaAssets } from '@/lib/figma-assets';
import { markOnboardingShown } from '@/lib/onboarding-storage';

const slides = [
  {
    title: '매일 기록',
    desc: (
      <>
        오늘 있었던 경험을 대화하듯 간단하게 기록해요.
        <br />
        3분이면 충분합니다.
      </>
    ),
    image: figmaAssets.onboardingNotebook,
    width: 160,
    height: 159,
  },
  {
    title: '역량으로 전환',
    desc: (
      <>
        기록이 쌓이면 AI가 협업력·문제해결력 같은
        <br />
        역량 언어로 분석해줘요.
      </>
    ),
    image: figmaAssets.onboardingStars,
    width: 140,
    height: 167,
  },
  {
    title: '자소서에 바로 활용',
    desc: (
      <>
        분석된 역량과 근거 기록을
        <br />
        자소서, 면접 답변에 바로 쓸 수 있어요.
      </>
    ),
    image: figmaAssets.onboardingDocs,
    width: 160,
    height: 142,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { session } = useAuth();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    markOnboardingShown();
  }, []);

  function handleStart() {
    router.push(session ? '/home' : '/login');
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#fbf8f9] px-3 pb-8 pt-16">
      <OnboardingCarousel slides={slides} index={index} onIndexChange={setIndex} />
      <Button fullWidth className="mt-6 h-12" onClick={handleStart}>
        시작하기
      </Button>
    </div>
  );
}
