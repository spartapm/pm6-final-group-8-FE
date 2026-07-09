'use client';

import { cn } from '@/lib/utils';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export function BackButton({ onClick, className }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-7 w-7 items-center justify-center text-[14px] font-bold text-foreground',
        className,
      )}
      aria-label="뒤로 가기"
    >
      ←
    </button>
  );
}

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
  className?: string;
}

export function ScreenHeader({ title, onBack, right, className }: ScreenHeaderProps) {
  return (
    <header
      className={cn(
        'relative flex h-[50px] items-center justify-center bg-white px-3.5',
        className,
      )}
    >
      <BackButton onClick={onBack} className="absolute left-3.5 text-[20px] font-normal text-olive" />
      <h1 className="text-[20px] font-black text-foreground">{title}</h1>
      {right ? <div className="absolute right-3.5">{right}</div> : null}
    </header>
  );
}
