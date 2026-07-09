'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileOverlayProps {
  children: ReactNode;
  className?: string;
  backdrop?: boolean;
}

/** MobileShell(375px) 안에서만 덮는 오버레이 */
export function MobileOverlay({ children, className, backdrop }: MobileOverlayProps) {
  return (
    <div
      className={cn(
        'fixed inset-y-0 left-1/2 z-50 flex w-full max-w-[375px] -translate-x-1/2 flex-col',
        backdrop && 'bg-black/40',
        className,
      )}
    >
      {children}
    </div>
  );
}
