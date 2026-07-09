'use client';

import { ReactNode, useRef, useState } from 'react';
import { FigmaImage } from '@/components/ui/FigmaImage';
import { PageDots } from '@/components/ui/PageDots';

export interface OnboardingSlide {
  title: string;
  desc: ReactNode;
  image: string;
  width: number;
  height: number;
}

interface OnboardingCarouselProps {
  slides: OnboardingSlide[];
  index: number;
  onIndexChange: (index: number) => void;
}

const SWIPE_THRESHOLD = 50;

export function OnboardingCarousel({ slides, index, onIndexChange }: OnboardingCarouselProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const indexRef = useRef(index);

  indexRef.current = index;

  function beginDrag(clientX: number) {
    startXRef.current = clientX;
    isDraggingRef.current = true;
    dragOffsetRef.current = 0;
    setIsDragging(true);
    setDragOffset(0);
  }

  function moveDrag(clientX: number) {
    if (!isDraggingRef.current) return;

    const diff = clientX - startXRef.current;
    const currentIndex = indexRef.current;
    const atStart = currentIndex === 0 && diff > 0;
    const atEnd = currentIndex === slides.length - 1 && diff < 0;
    const offset = atStart || atEnd ? diff * 0.3 : diff;

    dragOffsetRef.current = offset;
    setDragOffset(offset);
  }

  function endDrag() {
    if (!isDraggingRef.current) return;

    const offset = dragOffsetRef.current;
    const currentIndex = indexRef.current;

    if (offset < -SWIPE_THRESHOLD && currentIndex < slides.length - 1) {
      onIndexChange(currentIndex + 1);
    } else if (offset > SWIPE_THRESHOLD && currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }

    isDraggingRef.current = false;
    dragOffsetRef.current = 0;
    setIsDragging(false);
    setDragOffset(0);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    beginDrag(e.clientX);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;
    moveDrag(e.clientX);
  }

  function handlePointerUp() {
    endDrag();
  }

  function handlePointerCancel() {
    endDrag();
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div
        className="flex-1 touch-pan-y overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={handlePointerUp}
      >
        <div
          className="flex h-full w-full select-none"
          style={{
            transform: `translateX(calc(-${index * 100}% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : 'transform 300ms ease-out',
          }}
        >
          {slides.map((slide) => (
            <div
              key={slide.title}
              className="flex min-w-full flex-[0_0_100%] flex-col items-center px-3"
            >
              <div
                className="relative mb-10 mt-8"
                style={{ width: slide.width, height: slide.height }}
              >
                <FigmaImage src={slide.image} alt="" fill className="object-contain" priority />
              </div>
              <h2 className="text-center text-[28px] font-black text-foreground">{slide.title}</h2>
              <p className="mt-4 text-center text-[14px] leading-[18.4px] text-olive">{slide.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <PageDots total={slides.length} active={index} />
      </div>
    </div>
  );
}
