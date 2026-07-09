'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FigmaImage } from '@/components/ui/FigmaImage';
import { useAuth } from '@/hooks/useAuth';
import { figmaAssets } from '@/lib/figma-assets';
import { shouldShowOnboarding } from '@/lib/onboarding-storage';

const SPLASH_MS = 1500;

export default function SplashPage() {
  const router = useRouter();
  const { session, loading } = useAuth();
  const sessionRef = useRef(session);
  const loadingRef = useRef(loading);

  sessionRef.current = session;
  loadingRef.current = loading;

  useEffect(() => {
    let cancelled = false;

    async function navigateAfterSplash() {
      await new Promise((resolve) => setTimeout(resolve, SPLASH_MS));

      while (loadingRef.current && !cancelled) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      if (cancelled) return;

      if (shouldShowOnboarding()) {
        router.replace('/onboarding');
      } else if (sessionRef.current) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    }

    navigateAfterSplash();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#fbf8f9] px-[15px]">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6 h-[113px] w-[113px]">
          <FigmaImage src={figmaAssets.logo} alt="콩팟 로고" fill className="object-contain" priority />
        </div>
        <h1 className="text-[38px] font-bold tracking-[0.57px] text-primary">콩팟</h1>
        <p className="mt-1 text-[20px] font-bold tracking-[0.57px] text-foreground">심은대로 거둔다</p>
      </div>
    </div>
  );
}
