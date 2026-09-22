import { apiRequest } from '../client';

export type ProgressDay = {
  date: string;
  dietAdherencePct: number | null;
  workoutCompletedPct: number | null;
  isRestDay: boolean;
};

export type ProgressSummary = {
  days: ProgressDay[];
  dietStreakDays: number;
  workoutStreakDays: number;
};

/** GET /plans/progress/summary?days= — trailing daily adherence + streaks (1-30 days, default 7). */
export function getProgressSummary(days = 7) {
  return apiRequest<ProgressSummary>(`/plans/progress/summary?days=${days}`);
}
