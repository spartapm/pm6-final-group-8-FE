import type { Metadata, Viewport } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { MobileShell } from '@/components/layout/MobileShell';
import { NetworkProvider } from '@/components/layout/NetworkProvider';
import { AuthProvider } from '@/hooks/useAuth';

const noto = Noto_Sans_KR({
  variable: '--font-noto',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: '콩팟 - 심은대로 거둔다',
  description: '경험을 커리어 자산으로',
};

// 모바일(iOS Safari)에서 16px 미만 입력창 포커스 시 자동 확대 방지
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${noto.variable} h-full antialiased`}>
      <body className="min-h-dvh">
        <AuthProvider>
          <NetworkProvider>
            <MobileShell>{children}</MobileShell>
          </NetworkProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
