'use client';

import { ReactNode, useState } from 'react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void | Promise<void>;
  cancelLabel?: string;
  onCancel?: () => void;
  /** stack: 세로(기본) / row: 네·아니오 가로 배치 */
  actionsLayout?: 'stack' | 'row';
  /**
   * row 레이아웃에서 강조색(primary)을 어느 버튼에 둘지.
   * logout 시안: cancel(아니오)=primary, confirm(네)=gray
   */
  primaryAction?: 'confirm' | 'cancel';
  /** true면 onConfirm 완료 후에만 닫음 (async 지원) */
  closeOnConfirm?: boolean;
  confirmLoading?: boolean;
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
  primaryAction = 'confirm',
  closeOnConfirm = true,
  confirmLoading,
  className,
}: ModalProps) {
  const [pending, setPending] = useState(false);
  if (!open) return null;

  const isRow = actionsLayout === 'row' && Boolean(cancelLabel);
  const loading = confirmLoading ?? pending;
  const cancelIsPrimary = isRow && primaryAction === 'cancel';

  async function handleConfirm() {
    if (loading) return;
    try {
      setPending(true);
      await onConfirm?.();
      if (closeOnConfirm) onClose();
    } finally {
      setPending(false);
    }
  }

  const confirmButton = (
    <Button
      fullWidth
      loading={loading}
      variant={cancelIsPrimary ? 'secondary' : 'primary'}
      className={cn(
        isRow && 'h-11 flex-1 py-0 text-[15px]',
        cancelIsPrimary &&
          isRow &&
          'border-0 bg-[#d9d9d9] text-[#5a5a5a] hover:bg-[#cfcfcf]',
      )}
      onClick={() => {
        void handleConfirm();
      }}
    >
      {confirmLabel}
    </Button>
  );

  const cancelButton = cancelLabel ? (
    <Button
      variant={cancelIsPrimary ? 'primary' : isRow ? 'secondary' : 'ghost'}
      fullWidth
      disabled={loading}
      className={cn(
        isRow && 'h-11 flex-1 py-0 text-[15px]',
        !cancelIsPrimary &&
          isRow &&
          'border-0 bg-[#d9d9d9] text-[#5a5a5a] hover:bg-[#cfcfcf]',
      )}
      onClick={() => {
        onCancel?.();
        onClose();
      }}
    >
      {cancelLabel}
    </Button>
  ) : null;

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
          {isRow && cancelIsPrimary ? (
            <>
              {cancelButton}
              {confirmButton}
            </>
          ) : (
            <>
              {confirmButton}
              {cancelButton}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
