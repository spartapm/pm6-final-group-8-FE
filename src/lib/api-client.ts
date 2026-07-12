import type { UserStats, Record, ReportSummary, Insight } from '@/types';
import {
  clearFailedRequest,
  notifyNetworkError,
  registerFailedRequest,
} from '@/lib/network-retry';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string; timeout?: number } = {},
): Promise<T> {
  const { token, timeout = 10000, ...fetchOptions } = options;

  const execute = async (): Promise<T> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(`${API_URL}${path}`, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          ...(fetchOptions.body ? { 'Content-Type': 'application/json' } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...fetchOptions.headers,
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new ApiError((body as { error?: string }).error ?? res.statusText, res.status);
      }

      clearFailedRequest();
      return res.json() as Promise<T>;
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    return await execute();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('응답이 지연되고 있어요. 잠시 후 다시 시도해주세요.', 408);
    }
    if (err instanceof TypeError) {
      registerFailedRequest(execute);
      notifyNetworkError();
      throw new ApiError('연결이 원활하지 않아요. 네트워크 상태를 확인하고 다시 시도해주세요.', 0);
    }
    throw err;
  }
}

export const api = {
  createRecord: (token: string, data: unknown) =>
    request<Record>('/records', { method: 'POST', body: JSON.stringify(data), token }),

  getRecordsByDate: (token: string, date: string) =>
    request<Record[]>(`/records?date=${date}`, { token }),

  getAllRecords: (token: string) => request<Record[]>('/records?all=true', { token }),

  getRecord: (token: string, id: string) => request<Record>(`/records/${id}`, { token }),

  getCalendarDates: (token: string, from: string, to: string) =>
    request<string[]>(`/records/calendar?from=${from}&to=${to}`, { token }),

  getReportSummary: (token: string, from: string, to: string) =>
    request<ReportSummary>(`/reports/summary?from=${from}&to=${to}`, { token }),

  getCompetencyRecords: (token: string, category: string, from: string, to: string) =>
    request<Record[]>(`/reports/competency/${category}?from=${from}&to=${to}`, { token }),

  generateInsights: (token: string, from: string, to: string) =>
    request<{ periodDays: number; insights: Insight[] }>('/reports/insights', {
      method: 'POST',
      body: JSON.stringify({ from, to }),
      token,
      timeout: 15000,
    }),

  getUserStats: (token: string) => request<UserStats>('/reports/stats', { token }),

  getProfile: (token: string) =>
    request<{ policy_accepted_at: string | null }>('/profiles/me', { token }),

  acceptPolicy: (token: string) =>
    request('/profiles/accept-policy', { method: 'POST', token }),
};
