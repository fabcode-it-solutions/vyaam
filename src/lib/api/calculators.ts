import { useEffect, useMemo, useState } from 'react';

import { apiRequest } from './client';

/** Public calculator endpoints are intentionally unauthenticated and stateless. */
export function useCalculatorResult<T>(path: string, body: unknown, enabled: boolean) {
  const requestKey = useMemo(() => JSON.stringify(body), [body]);
  const requestBody = useMemo(() => JSON.parse(requestKey), [requestKey]);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!enabled) {
      setData(null);
      setError(null);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    setError(null);
    void apiRequest<T>(path, { method: 'POST', body: requestBody, auth: false })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) {
          setData(null);
          setError('Could not calculate right now. Check your connection and try again.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [path, requestBody, enabled]);

  return { data, error, loading };
}
