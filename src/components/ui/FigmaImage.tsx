import { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface FigmaImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  fill?: boolean;
  priority?: boolean;
}

/** 로컬 Figma 에셋용 — SVG·PNG 모두 정상 표시 (next/image 최적화 우회) */
export function FigmaImage({
  src,
  alt = '',
  width,
  height,
  className,
  style,
  fill,
  priority,
}: FigmaImageProps) {
  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn('absolute inset-0 h-full w-full', className)}
        style={style}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
