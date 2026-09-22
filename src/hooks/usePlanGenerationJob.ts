import { useEffect, useState } from 'react';

import { getPlanJobStatus, type PlanGenerationJobResult } from '@/lib/api/endpoints/dietPlan';

const POLL_INTERVAL_MS = 1500;

/**
 * Polls GET /plans/intake/jobs/:jobId (shared by diet and workout generation)
 * until the job leaves queued/processing. Used by both Intake/Generating
 * screens — same job-status contract, only the copy differs per screen.
 */
export function usePlanGenerationJob(jobId: string | null) {
  const [result, setResult] = useState<PlanGenerationJobResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setResult(null);
    setError(null);

    if (!jobId) {
      setError('Missing generation job. Please restart from the beginning.');
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      try {
        const job = await getPlanJobStatus(jobId);
        if (cancelled) return;
        setResult(job);
        if (job.status === 'queued' || job.status === 'processing') {
          timer = setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch {
        if (!cancelled) setError('Could not check plan status. Check your connection and try again.');
      }
    };

    void poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [jobId]);

  return { result, error };
}
