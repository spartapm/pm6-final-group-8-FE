const ONBOARDING_KEY = 'kongpot_onboarding_last_shown';
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export function shouldShowOnboarding(): boolean {
  if (typeof window === 'undefined') return false;
  const raw = localStorage.getItem(ONBOARDING_KEY);
  if (!raw) return true;
  const lastShown = Number(raw);
  if (Number.isNaN(lastShown)) return true;
  return Date.now() - lastShown >= TWENTY_FOUR_HOURS_MS;
}

export function markOnboardingShown(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ONBOARDING_KEY, String(Date.now()));
}
