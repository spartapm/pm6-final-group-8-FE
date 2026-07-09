'use client';

import { useCallback, useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import {
  clearFailedRequest,
  getPendingRetry,
  markAutoRetried,
  NETWORK_ERROR_EVENT,
  shouldAutoRetry,
} from '@/lib/network-retry';

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const runRetry = useCallback(async () => {
    const retry = getPendingRetry();
    if (!retry) {
      setOpen(false);
      return;
    }
    setRetrying(true);
    try {
      await retry();
      clearFailedRequest();
      setOpen(false);
    } catch {
      setOpen(true);
    } finally {
      setRetrying(false);
    }
  }, []);

  useEffect(() => {
    function handleOffline() {
      setOpen(true);
    }

    async function handleOnline() {
      if (shouldAutoRetry()) {
        markAutoRetried();
        await runRetry();
      } else if (!getPendingRetry()) {
        setOpen(false);
      }
    }

    function handleNetworkError() {
      setOpen(true);
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setOpen(true);
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    window.addEventListener(NETWORK_ERROR_EVENT, handleNetworkError);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener(NETWORK_ERROR_EVENT, handleNetworkError);
    };
  }, [runRetry]);

  return (
    <>
      {children}
      <Modal
        open={open}
        onClose={() => !retrying && setOpen(false)}
        confirmLabel={retrying ? '재시도 중...' : '확인했어요'}
        onConfirm={retrying ? undefined : runRetry}
      >
        연결이 원활하지 않아요.
        <br />
        네트워크 상태를 확인하고 다시 시도해주세요.
      </Modal>
    </>
  );
}
