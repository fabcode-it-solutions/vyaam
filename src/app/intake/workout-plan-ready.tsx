import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { GeneratingScreen } from '@/components/intake/GeneratingScreen';
import { PlanReadyScreen } from '@/components/intake/PlanReadyScreen';
import { getWorkoutWeek } from '@/lib/api/endpoints/workoutPlan';
import { mondayOf } from '@/lib/date/week';
import { formatEnumLabel } from '@/lib/format/enumLabel';
import { getHomeRouteForRole, resetToHome } from '@/lib/navigation/roleHome';
import { useIntakeStore } from '@/store/useIntakeStore';
import { useSessionStore } from '@/store/useSessionStore';

function equipmentSummary(equipment: string[] | undefined): string {
  const list = (equipment ?? []).filter((item) => item !== 'none_bodyweight');
  if (list.length === 0) return 'Bodyweight only';
  const formatted = list.slice(0, 2).map(formatEnumLabel);
  return list.length > 2 ? `${formatted.join(' & ')} & more` : formatted.join(' & ');
}

/**
 * Intake/Workout Plan Ready — Figma node 114:387
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=114-387).
 * The workout-plan-view endpoints don't return daysPerWeek or the original
 * intake answers directly, so the summary combines the just-generated
 * week's actual training-day count (GET /plans/workout?weekOf=) with the
 * equipment/pain answers still held in the intake draft from this session.
 */
export default function IntakeWorkoutPlanReadyScreen() {
  const activeRole = useSessionStore((s) => s.user?.activeRole);
  const workoutDraft = useIntakeStore((s) => s.workout);
  const [daysPerWeek, setDaysPerWeek] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getWorkoutWeek(mondayOf()).then(
      (week) => {
        if (!cancelled) setDaysPerWeek(week.days.filter((day) => !day.isRestDay).length);
      },
      () => {
        if (!cancelled) setDaysPerWeek(0);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (daysPerWeek === null) {
    return <GeneratingScreen heading="Loading your plan…" description="Almost there." isComplete={false} />;
  }

  const painAreas = Array.from(new Set((workoutDraft.painPoints ?? []).map((p) => formatEnumLabel(p.bodyPart))));
  const summary = `${daysPerWeek} days / week · ${equipmentSummary(workoutDraft.equipment)}`;
  const caption =
    painAreas.length > 0
      ? `Adjusted around ${painAreas.join(', ')}. Review with a trainer before starting.`
      : 'AI-generated workout guidance, not medical advice. Review with a trainer before starting.';

  return (
    <PlanReadyScreen
      heading="Your workout plan is ready!"
      summary={summary}
      caption={caption}
      onViewPlan={() => {
        // Clear the whole workout-intake wizard chain first — otherwise
        // "back" from the plan screen would pop into a stale intake step
        // instead of Home (see resetToHome).
        resetToHome(getHomeRouteForRole(activeRole));
        router.push('/plans/workout');
      }}
      onGhostPress={() =>
        router.push({ pathname: '/diet/share-with-trainer', params: { planType: 'workout' } })
      }
      continueLabel="Go to Home"
      onContinue={() => resetToHome(getHomeRouteForRole(activeRole))}
    />
  );
}
