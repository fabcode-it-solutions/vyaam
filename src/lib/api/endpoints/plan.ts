import { apiRequest } from '../client';

export type PlanType = 'diet' | 'workout';
export type RegenerateScope = 'full' | 'remaining_days';

/** POST /plans/regenerate — 202, queues a fresh generation job (same shape as the intake submit jobs). */
export function regeneratePlan(planType: PlanType, scope: RegenerateScope) {
  return apiRequest<{ jobId: string }>('/plans/regenerate', { method: 'POST', body: { planType, scope } });
}

export type SharePlanInput =
  | { planType: PlanType; method: 'trainer'; trainerId: string }
  | { planType: PlanType; method: 'email'; email: string };

/** POST /plans/share */
export function sharePlan(input: SharePlanInput) {
  return apiRequest<null>('/plans/share', { method: 'POST', body: input });
}
