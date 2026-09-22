import { router } from 'expo-router';
import { useEffect } from 'react';

import { GeneratingScreen } from '@/components/intake/GeneratingScreen';
import { GenerationFailedScreen } from '@/components/intake/GenerationFailedScreen';
import { usePlanGenerationJob } from '@/hooks/usePlanGenerationJob';
import { useIntakeStore } from '@/store/useIntakeStore';

/**
 * Intake/Generating — Figma node 67:118
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=67-118).
 * Polls GET /plans/intake/jobs/:jobId for the diet-plan generation job
 * queued by Intake/Food Restrictions.
 */
export default function IntakeGeneratingScreen() {
  const jobId = useIntakeStore((s) => s.dietJobId);
  const { result, error } = usePlanGenerationJob(jobId);

  useEffect(() => {
    if (result?.status === 'ready') {
      router.replace('/intake/plan-ready');
    }
  }, [result]);

  if (error || result?.status === 'failed') {
    return (
      <GenerationFailedScreen
        message={error ?? result?.error ?? 'Something went wrong generating your plan.'}
        onRetry={() => router.replace('/intake/food-restrictions')}
        onBack={() => router.replace('/intake/diet-intro')}
      />
    );
  }

  return (
    <GeneratingScreen
      heading="Building your plan…"
      description="Matching your answers to real meals."
      isComplete={result?.status === 'ready'}
    />
  );
}
