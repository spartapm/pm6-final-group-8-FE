import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-neutral-200 px-4 py-3.5 text-[15px] outline-none transition-colors',
        'placeholder:text-neutral-400 focus:border-primary',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
