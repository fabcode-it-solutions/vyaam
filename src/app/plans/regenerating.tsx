import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { GeneratingScreen } from '@/components/intake/GeneratingScreen';
import { GenerationFailedScreen } from '@/components/intake/GenerationFailedScreen';
import { usePlanGenerationJob } from '@/hooks/usePlanGenerationJob';
import type { PlanType } from '@/lib/api/endpoints/plan';

/**
 * Plans/Regenerating — polls GET /plans/intake/jobs/:jobId (same job contract
 * as the Intake/Generating screens) for a regeneration queued from a Home
 * plan card. Unlike the intake flow this isn't a multi-step wizard, so both
 * success and failure just return to Home rather than advancing/rewinding a
 * step — the updated (or still-previous) plan is picked up there on focus.
 */
export default function PlansRegeneratingScreen() {
  const { jobId, planType } = useLocalSearchParams<{ jobId?: string; planType?: PlanType }>();
  const { result, error } = usePlanGenerationJob(jobId ?? null);

  useEffect(() => {
    if (result?.status === 'ready') {
      router.back();
    }
  }, [result]);

  if (error || result?.status === 'failed') {
    return (
      <GenerationFailedScreen
        message={error ?? result?.error ?? 'Something went wrong regenerating your plan. Your previous plan is unaffected.'}
        onRetry={() => router.back()}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <GeneratingScreen
      heading="Rebuilding your plan…"
      description={
        planType === 'workout'
          ? 'Working around your equipment and any pain points.'
          : 'Refreshing your meals based on your latest details.'
      }
      isComplete={result?.status === 'ready'}
    />
  );
}
