'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { FigmaImage } from '@/components/ui/FigmaImage';
import { useAuth } from '@/hooks/useAuth';
import { getPostAuthPath } from '@/lib/auth-utils';
import { figmaAssets } from '@/lib/figma-assets';
import { getDevSession, isDevAuth } from '@/lib/supabase/client';
import { AnalyticsEvent, capture } from '@/lib/analytics';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInOAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const devMode = isDevAuth();
  const canSubmit = devMode || (email.trim().length > 0 && password.length > 0);

  async function redirectAfterAuth(token: string | null) {
    if (!token) return;
    const path = await getPostAuthPath(token);
    router.push(path);
  }

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      const token = await signIn(email, password);
      if (token) capture(AnalyticsEvent.UserLoggedIn, { method: 'password' });
      await redirectAfterAuth(token);
    } catch (e) {
      setError(e instanceof Error ? e.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: 'kakao' | 'google') {
    setLoading(true);
    try {
      await signInOAuth(provider);
      capture(AnalyticsEvent.UserLoggedIn, { method: provider });
      if (isDevAuth()) {
        const session = getDevSession();
        if (session) {
          await redirectAfterAuth(session.access_token);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '소셜 로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white px-3 pb-8">
      <header className="flex flex-col items-start px-2 pt-11 text-left">
        <FigmaImage
          src={figmaAssets.loginLogo}
          alt="콩팟 로고"
          width={71}
          height={71}
          className="h-[71px] w-[71px] object-contain"
          priority
        />
        <div className="mt-3 flex flex-col gap-0.5">
          <p className="text-[18px] font-bold leading-[26px] text-foreground">경험이 쌓일수록</p>
          <p className="text-[18px] font-bold leading-[26px]">
            <span className="text-[#ed6e6e]">나를 더 잘 아는</span>
            <span className="text-foreground"> 커리어 파트너</span>
          </p>
        </div>
      </header>

      <div className="mt-5 flex flex-col gap-3">
        <FormField
          label="아이디"
          type="email"
          autoComplete="email"
          value={email}
          filled={email.length > 0}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          placeholder="8자 이상 입력 (특수문자 포함)"
          value={password}
          filled={password.length > 0}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-[14px] text-primary">{error}</p>}
        {devMode && (
          <p className="text-[13px] text-olive">개발 모드: 입력 없이 로그인 가능</p>
        )}

        <Button
          fullWidth
          className="mt-2 h-12 bg-[#ed6e6e] text-[16px] text-white hover:bg-[#ed6e6e]/90"
          disabled={!canSubmit}
          loading={loading}
          onClick={handleLogin}
        >
          로그인
        </Button>
      </div>

      <div className="my-[19px] h-px w-full bg-[#e5e5e5]" />

      <div className="flex flex-col gap-2">
        <Button
          variant="kakao"
          fullWidth
          className="h-12 text-[15px]"
          disabled={loading}
          onClick={() => handleOAuth('kakao')}
        >
          카카오로 계속하기
        </Button>
        <Button
          variant="google"
          fullWidth
          className="h-12 text-[15px]"
          disabled={loading}
          onClick={() => handleOAuth('google')}
        >
          Google로 계속하기
        </Button>
      </div>
    </div>
  );
}
