'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react';
import { useAuth } from '@/hooks/useAuth';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

let initialized = false;

/** 로그인 유저 계정(user.id) 기준 identify, 로그아웃 시 reset */
function PostHogIdentify() {
  const { session } = useAuth();
  const client = usePostHog();
  const prevUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!client) return;
    const uid = session?.user?.id ?? null;
    if (uid && uid !== prevUserId.current) {
      client.identify(uid, { email: session?.user?.email });
      prevUserId.current = uid;
    } else if (!uid && prevUserId.current) {
      client.reset();
      prevUserId.current = null;
    }
  }, [session, client]);

  return null;
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY || initialized) return;
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      ui_host: 'https://us.posthog.com',
      autocapture: true,
      capture_pageview: 'history_change',
      capture_pageleave: true,
    });
    initialized = true;
  }, []);

  // 키 미설정 시 PostHog 없이 그대로 렌더 (no-op)
  if (!POSTHOG_KEY) return <>{children}</>;

  return (
    <PHProvider client={posthog}>
      <PostHogIdentify />
      {children}
    </PHProvider>
  );
}
