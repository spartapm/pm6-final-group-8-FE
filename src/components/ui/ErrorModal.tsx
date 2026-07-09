'use client';

import { useEffect } from 'react';
import { ApiError } from '@/lib/api-client';
import { Modal } from '@/components/ui/Modal';

interface ErrorModalProps {
  error: Error | null;
  onClose: () => void;
  onRetry?: () => void;
}

export function ErrorModal({ error, onClose, onRetry }: ErrorModalProps) {
  useEffect(() => {
    if (error) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [error]);

  if (!error) return null;

  const isTimeout = error instanceof ApiError && error.status === 408;
  const message = error.message;

  return (
    <Modal
      open={!!error}
      onClose={onClose}
      confirmLabel="확인했어요"
      onConfirm={onRetry}
    >
      {isTimeout ? (
        <>
          응답이 지연되고 있어요.
          <br />
          잠시 후 다시 시도해주세요.
        </>
      ) : (
        <>
          {message.includes('연결') ? message : `연결이 원활하지 않아요. 네트워크 상태를 확인하고 다시 시도해주세요.`}
        </>
      )}
    </Modal>
  );
}
