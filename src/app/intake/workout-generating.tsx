import { router } from 'expo-router';
import { useEffect } from 'react';

import { GeneratingScreen } from '@/components/intake/GeneratingScreen';
import { GenerationFailedScreen } from '@/components/intake/GenerationFailedScreen';
import { usePlanGenerationJob } from '@/hooks/usePlanGenerationJob';
import { useIntakeStore } from '@/store/useIntakeStore';

/**
 * Intake/Workout Generating — Figma node 114:376
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=114-376).
 * Polls GET /plans/intake/jobs/:jobId (same job contract as Intake/Generating)
 * for the workout-plan generation job queued by Intake/Experience Level.
 */
export default function IntakeWorkoutGeneratingScreen() {
  const jobId = useIntakeStore((s) => s.workoutJobId);
  const { result, error } = usePlanGenerationJob(jobId);

  useEffect(() => {
    if (result?.status === 'ready') {
      router.replace('/intake/workout-plan-ready');
    }
  }, [result]);

  if (error || result?.status === 'failed') {
    return (
      <GenerationFailedScreen
        message={error ?? result?.error ?? 'Something went wrong generating your plan.'}
        onRetry={() => router.replace('/intake/experience-level')}
        onBack={() => router.replace('/intake/workout-intro')}
      />
    );
  }

  return (
    <GeneratingScreen
      heading="Building your plan…"
      description="Working around your equipment and any pain points."
      isComplete={result?.status === 'ready'}
    />
  );
}
