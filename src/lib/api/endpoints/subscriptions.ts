import { apiRequest } from '../client';

export type SubscriptionPlan = 'free' | 'premium' | 'trainer_credits' | 'trainer_pro';
export type SubscriptionStatus = 'active' | 'trialing' | 'canceled' | 'past_due';

export type BillingHistoryItem = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  issuedAt: string | null;
};

export type Subscription = {
  accountType: 'customer' | 'trainer';
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  billingHistory: BillingHistoryItem[];
};

export function getSubscription() {
  return apiRequest<Subscription>('/me/subscription');
}

/**
 * Pricing/plan IDs aren't finalized yet (see CLAUDE.md) — planId must be a
 * real Razorpay plan_id, not an internal id, so there's nothing safe to pass
 * here until product finalizes pricing. Kept for when that lands.
 */
export function upgradeSubscription(planId: string) {
  return apiRequest<{ checkoutUrl: string; subscriptionId: string }>('/me/subscription/upgrade', {
    method: 'POST',
    body: { planId },
  });
}

export function cancelSubscription() {
  return apiRequest<{ cancelAtPeriodEnd: boolean }>('/me/subscription/cancel', { method: 'POST' });
}
