type RetryFn = () => Promise<unknown>;

let pendingRetry: RetryFn | null = null;
let autoRetried = false;

export function registerFailedRequest(retry: RetryFn) {
  pendingRetry = retry;
  autoRetried = false;
}

export function clearFailedRequest() {
  pendingRetry = null;
  autoRetried = false;
}

export function getPendingRetry() {
  return pendingRetry;
}

export function markAutoRetried() {
  autoRetried = true;
}

export function shouldAutoRetry() {
  return pendingRetry !== null && !autoRetried;
}

export const NETWORK_ERROR_EVENT = 'kongpot:network-error';

export function notifyNetworkError() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(NETWORK_ERROR_EVENT));
  }
}
