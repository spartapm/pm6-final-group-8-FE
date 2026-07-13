import posthog from 'posthog-js';

export const AnalyticsEvent = {
  UserLoggedIn: 'user_logged_in',
  RecordCreated: 'record_created',
  InsightRequested: 'insight_requested',
} as const;

export type AnalyticsEventName =
  (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

/** PostHog 초기화 전이거나 키 미설정이면 no-op */
export function capture(
  event: AnalyticsEventName,
  props?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return;
  if (!posthog.__loaded) return;
  posthog.capture(event, props);
}
