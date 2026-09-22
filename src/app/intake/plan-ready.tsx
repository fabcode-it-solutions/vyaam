import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { GeneratingScreen } from '@/components/intake/GeneratingScreen';
import { PlanReadyScreen } from '@/components/intake/PlanReadyScreen';
import { getDietPlan, type DietPlanForDate } from '@/lib/api/endpoints/dietPlan';
import { formatEnumLabel } from '@/lib/format/enumLabel';
import { resetToHome } from '@/lib/navigation/roleHome';

function summaryFor(plan: DietPlanForDate) {
  const kcal = `${plan.dailyCalorieTarget.toLocaleString()} kcal/day`;
  const protein = `${plan.macroTargets.proteinG}g protein`;
  const cuisine = formatEnumLabel(plan.regionalCuisine);
  return `${kcal} · ${protein} · ${cuisine}`;
}

/**
 * Intake/Plan Ready — Figma node 67:129
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=67-129).
 * Fetches the plan the Generating screen just waited on, via GET /plans/diet.
 */
export default function IntakePlanReadyScreen() {
  const [plan, setPlan] = useState<DietPlanForDate | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getDietPlan().then(
      (result) => {
        if (!cancelled) setPlan(result);
      },
      () => {
        // The plan was just generated successfully (Generating screen only
        // gets here on job status "ready") — a fetch failure here is a
        // transient network blip, not a real absence of a plan.
        if (!cancelled) setPlan(null);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (!plan) {
    return <GeneratingScreen heading="Loading your plan…" description="Almost there." isComplete={false} />;
  }

  return (
    <PlanReadyScreen
      heading="Your diet plan is ready!"
      summary={summaryFor(plan)}
      caption={plan.disclaimer}
      onViewPlan={() => {
        // Clear the whole diet-intake wizard chain first — otherwise "back"
        // from the plan screen would pop into a stale intake step instead
        // of Home (see resetToHome).
        resetToHome();
        router.push('/diet/plan');
      }}
      ghostLabel="Go to Home"
      onGhostPress={() => resetToHome()}
      continueLabel="Set up my workout plan"
      onContinue={() => router.push('/intake/workout-intro')}
    />
  );
}
