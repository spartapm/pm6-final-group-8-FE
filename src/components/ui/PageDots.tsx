import { cn } from '@/lib/utils';

export function PageDots({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'h-1.5 rounded-full transition-all',
            i === active ? 'w-5 bg-primary' : 'w-1.5 bg-[#d1cbcb]',
          )}
        />
      ))}
    </div>
  );
}
