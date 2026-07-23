'use client';

import { useRef, useEffect } from 'react';
import { FigmaImage } from '@/components/ui/FigmaImage';
import { figmaAssets } from '@/lib/figma-assets';
import { cn } from '@/lib/utils';

/** Figma 시안 2: 경험 기록 대화 (343:1277) */
interface ChatBubbleProps {
  role: 'bot' | 'user';
  content: string;
  hint?: string;
  showAvatar?: boolean;
}

export function ChatBubble({ role, content, hint, showAvatar = true }: ChatBubbleProps) {
  if (role === 'user') {
    return (
      <div className="flex justify-end pl-10">
        <div className="max-w-[78%] rounded-bl-[14px] rounded-br-[3px] rounded-tl-[14px] rounded-tr-[14px] bg-primary px-4 py-2.5 text-[14px] leading-[17.25px] text-white">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-1.5 pr-8">
      {showAvatar ? (
        <FigmaImage
          src={figmaAssets.botAvatar}
          alt=""
          width={25}
          height={22}
          className="mb-0.5 h-[22px] w-[25px] shrink-0 object-contain"
        />
      ) : (
        <span className="w-[25px] shrink-0" aria-hidden />
      )}
      <div className="max-w-[78%] rounded-bl-[3px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[14px] bg-[#f1f1f1] px-4 py-3">
        <p className="whitespace-pre-line text-[14px] font-medium leading-[20px] text-foreground">
          {content}
        </p>
        {hint ? (
          <p className="mt-1 whitespace-pre-line text-[12px] font-normal leading-[18px] text-olive">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}

interface ExtraQuestionBubbleProps {
  content: string;
  hint?: string;
  onSkip: () => void;
  onMore: () => void;
}

export function ExtraQuestionBubble({ content, hint, onSkip, onMore }: ExtraQuestionBubbleProps) {
  return (
    <div className="flex items-end gap-1.5 pr-8">
      <FigmaImage
        src={figmaAssets.botAvatar}
        alt=""
        width={25}
        height={22}
        className="mb-0.5 h-[22px] w-[25px] shrink-0 object-contain"
      />
      <div className="max-w-[78%] rounded-bl-[3px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[14px] bg-[#f1f1f1] px-4 py-3">
        <p className="whitespace-pre-line text-[14px] font-medium leading-[20px] text-foreground">
          {content}
        </p>
        {hint ? (
          <p className="mt-1.5 whitespace-pre-line text-[12px] font-normal leading-[18px] text-olive">
            {hint}
          </p>
        ) : null}
        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={onMore}
            className="h-10 w-full rounded-[14px] bg-[#564444] text-[13px] font-bold text-white shadow-[0px_4px_5.2px_rgba(0,0,0,0.3)]"
          >
            내용 추가하기
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="h-10 w-full rounded-[14px] border border-[#c8c8c8] bg-white text-[13px] font-bold text-foreground"
          >
            저장하고 결과 보기
          </button>
        </div>
      </div>
    </div>
  );
}

interface TypingBubbleProps {
  className?: string;
}

export function TypingBubble({ className }: TypingBubbleProps) {
  return (
    <div className={cn('flex items-end gap-1.5 pr-8', className)}>
      <FigmaImage
        src={figmaAssets.botAvatar}
        alt=""
        width={25}
        height={22}
        className="mb-0.5 h-[22px] w-[25px] shrink-0 object-contain"
      />
      <div className="rounded-bl-[3px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[14px] bg-[#f1f1f1] px-4 py-3 text-[36px] leading-[15px] text-foreground">
        …
      </div>
    </div>
  );
}

interface ChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string) => void;
  disabled?: boolean;
  sendDisabled?: boolean;
  placeholder?: string;
}

export function ChatInputBar({
  value,
  onChange,
  onSend,
  disabled,
  sendDisabled,
  placeholder = '한 줄도 좋지만 자세히 쓰면 분석이 더 잘돼요.',
}: ChatInputBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldRefocusRef = useRef(false);

  function getInputText() {
    return (inputRef.current?.value ?? value).slice(0, 500).trim();
  }

  const cannotSend = disabled || sendDisabled || !value.trim();

  function handleSend() {
    if (disabled || sendDisabled) return;
    const text = getInputText();
    if (!text) return;

    shouldRefocusRef.current = true;
    onChange('');
    onSend(text);
    inputRef.current?.focus();
  }

  useEffect(() => {
    if (shouldRefocusRef.current && !disabled && !sendDisabled) {
      shouldRefocusRef.current = false;
      inputRef.current?.focus();
    }
  }, [disabled, sendDisabled, value]);

  return (
    <div className="bg-white px-3.5 py-3">
      <div className="relative flex h-12 items-center rounded-[26px] bg-white px-4 shadow-[0_4px_6.25px_rgba(170,170,170,0.8)]">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, 500))}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent pr-10 text-[11.5px] leading-[17.25px] outline-none placeholder:text-olive"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          type="button"
          disabled={cannotSend}
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleSend}
          className="absolute right-2 flex h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-primary text-[9.4px] text-white disabled:opacity-40"
          aria-label="전송"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
