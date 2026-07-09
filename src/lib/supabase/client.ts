import { createBrowserClient } from '@supabase/ssr';

export const DEV_DEFAULT_EMAIL = 'developer@kongpot.local';

export function isDevAuth() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return !url || url.includes('your-project');
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

const DEV_USER_KEY = 'kongpot_dev_user';
const DEV_TOKEN_KEY = 'kongpot_dev_token';

export interface DevSession {
  user: { id: string; email: string };
  access_token: string;
}

export function createDevToken(userId: string, email: string): string {
  const json = JSON.stringify({ sub: userId, email });
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function getDevSession(): DevSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(DEV_USER_KEY);
  const token = localStorage.getItem(DEV_TOKEN_KEY);
  if (!raw || !token) return null;
  return { user: JSON.parse(raw), access_token: token };
}

export function setDevSession(email: string) {
  const id = `dev-${email.replace(/[^a-z0-9]/gi, '-')}`;
  const user = { id, email };
  const token = createDevToken(id, email);
  localStorage.setItem(DEV_USER_KEY, JSON.stringify(user));
  localStorage.setItem(DEV_TOKEN_KEY, token);
  return { user, access_token: token };
}

export function clearDevSession() {
  localStorage.removeItem(DEV_USER_KEY);
  localStorage.removeItem(DEV_TOKEN_KEY);
}
