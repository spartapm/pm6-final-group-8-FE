import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'muted' | 'success' | 'warning' | 'tag';
  className?: string;
}

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold',
        variant === 'primary' && 'bg-primary text-white',
        variant === 'tag' && 'bg-primary text-white',
        variant === 'muted' && 'bg-neutral-100 text-neutral-500',
        variant === 'success' && 'bg-transparent text-primary text-[14px] font-normal',
        variant === 'warning' && 'bg-transparent text-olive text-[14px] font-normal',
        className,
      )}
    >
      {children}
    </span>
  );
}
