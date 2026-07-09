import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  filled?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ className, label, filled, ...props }, ref) => (
    <div className="flex flex-col gap-[5px]">
      <label className="pb-0.5 pt-px text-[11px] font-bold text-olive">{label}</label>
      <input
        ref={ref}
        className={cn(
          'w-full rounded-[10px] px-3 py-2.5 text-[12px] outline-none transition-colors',
          filled
            ? 'border border-primary bg-white text-foreground'
            : 'border border-transparent bg-[#f1f1f1] text-[#757575] placeholder:text-[#757575] focus:border-primary focus:bg-white focus:text-foreground',
          className,
        )}
        {...props}
      />
    </div>
  ),
);
FormField.displayName = 'FormField';
