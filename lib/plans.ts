// Edit prices here for the onboarding screen. (The landing page prices are in components/LandingMarkup.tsx: search for [PRICE].)
export type PlanId = 'growth' | 'pro' | 'biz';
export type Period = 'monthly' | 'quarterly' | 'annual';
export type AccountType = 'verified' | 'new';

export const PERIODS: { id: Period; label: string; name: string }[] = [
  { id: 'monthly', label: 'Monthly', name: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly · save 10%', name: 'Quarterly' },
  { id: 'annual', label: 'Annual · save 20%', name: 'Yearly' },
];

export const PLANS: { id: PlanId; name: string; blurb: string; badge?: string; features: string[]; price: Record<Period, string> }[] = [
  { id: 'growth', name: 'Growth', blurb: 'For small teams starting out.', features: ['3 users included', 'Unlimited broadcasts', 'Shared team inbox'], price: { monthly: '[PRICE]', quarterly: '[PRICE]', annual: '[PRICE]' } },
  { id: 'pro', name: 'Pro', blurb: 'For teams turning chats into revenue.', badge: 'Best value', features: ['5 users included', 'AI agent with 2,000 credits', 'Click-to-chat ads'], price: { monthly: '[PRICE]', quarterly: '[PRICE]', annual: '[PRICE]' } },
  { id: 'biz', name: 'Business', blurb: 'For multi-number teams at scale.', features: ['Multiple numbers', 'Unlimited AI agents', 'Dedicated success manager'], price: { monthly: '[PRICE]', quarterly: '[PRICE]', annual: '[PRICE]' } },
];

/** Amount due today for the order summary and Pay button. */
export function totalFor(plan: PlanId, period: Period): string {
  void plan; void period;
  return '[TOTAL]';
}

export const ACCOUNT_TYPES: { id: AccountType; title: string; sub: string; icon: string; tone: string; eta: string; short: string }[] = [
  { id: 'verified', title: 'Verified business account', sub: 'Activated the same day after payment.', icon: 'zap', tone: 'var(--ok)', eta: 'Activated the same day', short: 'Verified business' },
  { id: 'new', title: 'New or unverified account', sub: 'May take 1–2 days to onboard. Not sure? Pick this one.', icon: 'clock', tone: 'var(--accent2)', eta: 'Onboarding in 1–2 days', short: 'New or unverified' },
];
