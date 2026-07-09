'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  isDevAuth,
  DEV_DEFAULT_EMAIL,
  createClient,
  getDevSession,
  setDevSession,
  clearDevSession,
  type DevSession,
} from '@/lib/supabase/client';

interface AuthContextValue {
  session: DevSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signInOAuth: (provider: 'kakao' | 'google') => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DevSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (isDevAuth()) {
        setSession(getDevSession());
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession({
          user: { id: data.session.user.id, email: data.session.user.email ?? '' },
          access_token: data.session.access_token,
        });
      }
      setLoading(false);
      supabase.auth.onAuthStateChange((_event, s) => {
        if (s) {
          setSession({
            user: { id: s.user.id, email: s.user.email ?? '' },
            access_token: s.access_token,
          });
        } else {
          setSession(null);
        }
      });
    }
    init();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (isDevAuth()) {
      const s = setDevSession(email.trim() || DEV_DEFAULT_EMAIL);
      setSession(s);
      return s.access_token;
    }
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw new Error('아이디 또는 비밀번호가 잘못되었습니다. 입력하신 내용을 다시 확인해 주세요');
    if (data.session) {
      setSession({
        user: { id: data.session.user.id, email: data.session.user.email ?? '' },
        access_token: data.session.access_token,
      });
      return data.session.access_token;
    }
    return null;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    if (isDevAuth()) {
      const s = setDevSession(email.trim() || DEV_DEFAULT_EMAIL);
      setSession(s);
      return s.access_token;
    }
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
    if (error) throw new Error(error.message || '회원가입에 실패했습니다. 입력하신 내용을 다시 확인해 주세요');
    if (data.session) {
      setSession({
        user: { id: data.session.user.id, email: data.session.user.email ?? '' },
        access_token: data.session.access_token,
      });
      return data.session.access_token;
    }
    if (data.user) {
      throw new Error('가입 확인 메일을 보냈어요. 이메일 인증 후 로그인해주세요.');
    }
    return null;
  }, []);

  const signInOAuth = useCallback(async (provider: 'kakao' | 'google') => {
    if (isDevAuth()) {
      const s = setDevSession(`${provider}@kongpot.local`);
      setSession(s);
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    if (isDevAuth()) {
      clearDevSession();
      setSession(null);
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  const getToken = useCallback(() => session?.access_token ?? null, [session]);

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signUp, signInOAuth, signOut, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
