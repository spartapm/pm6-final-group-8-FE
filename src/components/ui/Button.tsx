import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { FigmaImage } from '@/components/ui/FigmaImage';
import { figmaAssets } from '@/lib/figma-assets';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'kakao' | 'google';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', loading, fullWidth, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-[11px] px-4 py-3 text-[16px] font-bold transition-colors disabled:opacity-50',
          fullWidth && 'w-full',
          variant === 'primary' && 'bg-primary text-[#f8f3f4] hover:bg-primary/90',
          variant === 'secondary' && 'border border-primary text-primary bg-white hover:bg-primary/5',
          variant === 'ghost' && 'text-neutral-600 hover:bg-neutral-50',
          variant === 'kakao' && 'bg-[#ffe54e] text-foreground hover:bg-[#ffe54e]/90',
          variant === 'google' && 'border border-[#d9d9d9] bg-white text-foreground hover:bg-neutral-50',
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <>
            {variant === 'kakao' && (
              <FigmaImage src={figmaAssets.kakaoIcon} alt="" width={27} height={22} className="shrink-0" />
            )}
            {variant === 'google' && (
              <FigmaImage src={figmaAssets.googleIcon} alt="" width={26} height={20} className="shrink-0" />
            )}
            {children}
          </>
        )}
      </button>
    );
  },
);
Button.displayName = 'Button';
