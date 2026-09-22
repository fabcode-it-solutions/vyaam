/**
 * Monday-first week helpers matching the backend's own convention exactly
 * (vyaam-backend src/services/workoutPlan.service.ts `dayOfWeekFromDate` /
 * `mondayOfWeek`: dayOfWeek 0 = Monday .. 6 = Sunday) — needed on the client
 * to build the week strips for Plans/Diet View and Plans/Workout View.
 */

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayDateString(): string {
  return toDateString(new Date());
}

/** 0 = Monday .. 6 = Sunday, for a given date (defaults to today). */
export function dayOfWeekFromDate(date: Date = new Date()): number {
  const jsDay = date.getUTCDay(); // 0 = Sunday .. 6 = Saturday
  return (jsDay + 6) % 7;
}

/** The 7 ISO date strings (Mon..Sun) of the week containing `date`. */
export function currentWeekDates(date: Date = new Date()): string[] {
  const monday = new Date(date);
  monday.setUTCHours(0, 0, 0, 0);
  monday.setUTCDate(monday.getUTCDate() - dayOfWeekFromDate(date));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setUTCDate(d.getUTCDate() + i);
    return toDateString(d);
  });
}

export function mondayOf(date: Date = new Date()): string {
  return currentWeekDates(date)[0];
}

export function weekdayLabel(index: number): string {
  return WEEKDAY_LABELS[index];
}

export function dayOfMonthFromDateString(dateStr: string): number {
  return Number(dateStr.slice(8, 10));
}
