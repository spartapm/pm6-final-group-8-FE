'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FigmaImage } from '@/components/ui/FigmaImage';
import { cn } from '@/lib/utils';
import { figmaAssets } from '@/lib/figma-assets';

const tabs = [
  { href: '/home', label: '홈', icon: figmaAssets.gnbHome },
  { href: '/report', label: '리포트', icon: figmaAssets.gnbReport },
  { href: '/my', label: '마이', icon: figmaAssets.gnbMy },
];

export function GNB() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 flex h-[68px] w-full max-w-[375px] -translate-x-1/2 border-t border-chat bg-white px-2">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 pt-1"
          >
            <FigmaImage
              src={tab.icon}
              alt=""
              width={20}
              height={20}
              className={cn('h-5 w-5 object-contain', !active && 'opacity-45')}
              style={
                active
                  ? undefined
                  : { filter: 'grayscale(1) brightness(0.85)' }
              }
            />
            <span
              className={cn(
                'text-[9.5px]',
                active ? 'font-black text-primary' : 'font-bold text-olive',
              )}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
