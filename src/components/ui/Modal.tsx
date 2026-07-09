'use client';

import { ReactNode } from 'react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
  cancelLabel?: string;
  onCancel?: () => void;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  confirmLabel = '확인했어요',
  onConfirm,
  cancelLabel,
  onCancel,
  className,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className={cn(
          'w-full max-w-[320px] rounded-2xl bg-white p-6 shadow-xl',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="mb-3 text-center text-[18px] font-bold">{title}</h3>}
        <div className="mb-6 text-center text-[15px] text-neutral-700">{children}</div>
        <div className="flex flex-col gap-2">
          <Button
            fullWidth
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
          {cancelLabel && (
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                onCancel?.();
                onClose();
              }}
            >
              {cancelLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
