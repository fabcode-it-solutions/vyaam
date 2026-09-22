import { useSessionStore } from '@/store/useSessionStore';

import { API_BASE_URL } from './config';
import { ApiError, NetworkError } from './errors';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  /** Defaults to true. Set false for endpoints marked Public in the API spec (e.g. /auth/*-otp, /help/articles). */
  auth?: boolean;
  /** Internal — set on the retry attempt after a refresh, to avoid an infinite 401 loop. */
  _isRetry?: boolean;
};

async function parseBody(response: Response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new NetworkError(`Non-JSON response (${response.status}) from ${response.url}`);
  }
}

/** Single-flight lock so N concurrent 401s trigger one refresh call, not N. */
let refreshPromise: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  const { refreshToken, setTokens, logout } = useSessionStore.getState();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const json = await parseBody(response);
    if (!response.ok) throw new Error('refresh failed');
    setTokens({ accessToken: json.data.accessToken, refreshToken: json.data.refreshToken });
    return true;
  } catch {
    logout();
    return false;
  }
}

/**
 * Central request helper — every screen goes through this rather than
 * calling fetch() directly, so auth headers, the {data}/{error} envelope,
 * and 401-triggered refresh are handled in exactly one place
 * (CLAUDE.md: "handle the standard error envelope centrally").
 */
export async function apiRequest<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, _isRetry = false } = options;
  const { accessToken } = useSessionStore.getState();

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new NetworkError(e instanceof Error ? e.message : 'Network request failed');
  }

  const json = await parseBody(response);

  if (response.status === 401 && auth && !_isRetry) {
    const refreshed = await (refreshPromise ??= refreshSession().finally(() => {
      refreshPromise = null;
    }));
    if (refreshed) {
      return apiRequest<T>(path, { ...options, _isRetry: true });
    }
  }

  if (!response.ok) {
    const errorBody = json?.error;
    throw new ApiError(
      response.status,
      errorBody?.code ?? 'UNKNOWN',
      errorBody?.message ?? `Request failed with status ${response.status}`,
      errorBody?.field,
      errorBody?.retryAfterSeconds,
    );
  }

  return (json?.data ?? null) as T;
}
