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
  /** stack: 세로(기본) / row: 네·아니오 가로 배치 */
  actionsLayout?: 'stack' | 'row';
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
  actionsLayout = 'stack',
  className,
}: ModalProps) {
  if (!open) return null;

  const isRow = actionsLayout === 'row' && Boolean(cancelLabel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className={cn(
          'w-full max-w-[300px] rounded-[20px] bg-white px-5 pb-5 pt-8 shadow-[0_8px_28px_rgba(0,0,0,0.18)]',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="mb-3 text-center text-[18px] font-bold">{title}</h3>}
        <div className="mb-6 text-center text-[15px] font-bold text-foreground">{children}</div>
        <div className={cn(isRow ? 'flex gap-2.5' : 'flex flex-col gap-2')}>
          <Button
            fullWidth
            className={cn(isRow && 'h-11 flex-1 py-0 text-[15px]')}
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
          {cancelLabel && (
            <Button
              variant={isRow ? 'secondary' : 'ghost'}
              fullWidth
              className={cn(
                isRow &&
                  'h-11 flex-1 border-0 bg-[#d9d9d9] py-0 text-[15px] text-[#5a5a5a] hover:bg-[#cfcfcf]',
              )}
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
