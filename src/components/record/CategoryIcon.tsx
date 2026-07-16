'use client';

import { FigmaImage } from '@/components/ui/FigmaImage';
import { cn } from '@/lib/utils';

interface CategoryIconProps {
  src: string;
  selected?: boolean;
  className?: string;
}

/** 카테고리 버튼 아이콘 — default #8A8170, selected 흰색 */
export function CategoryIcon({ src, selected = false, className }: CategoryIconProps) {
  return (
    <FigmaImage
      src={src}
      alt=""
      width={30}
      height={30}
      className={cn(
        'h-[30px] w-[30px] shrink-0 object-contain',
        selected && 'brightness-0 invert',
        className,
      )}
    />
  );
}
