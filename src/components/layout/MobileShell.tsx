'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileShellProps {
  children: ReactNode;
  className?: string;
}

export function MobileShell({ children, className }: MobileShellProps) {
  return (
    <div className="min-h-dvh bg-neutral-100">
      <div
        className={cn(
          'relative mx-auto w-full max-w-[375px] min-h-dvh bg-[#fbf8f9] shadow-sm md:shadow-md overflow-x-hidden',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
