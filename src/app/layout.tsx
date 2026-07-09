import type { Metadata } from 'next';
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
