import type { ActiveRole, SessionUser } from '@/store/useSessionStore';

import { apiRequest } from '../client';

type AuthResult = {
  user: SessionUser;
  isNewUser: boolean;
  accessToken: string;
  refreshToken: string;
};

/** POST /auth/phone-otp — exchanges a Firebase phone-auth ID token for a Vyaam session. */
export function continueWithPhoneOtp(idToken: string) {
  return apiRequest<AuthResult>('/auth/phone-otp', { method: 'POST', body: { idToken }, auth: false });
}

export function continueWithGoogle(idToken: string) {
  return apiRequest<AuthResult>('/auth/google', { method: 'POST', body: { idToken }, auth: false });
}

export function continueWithApple(idToken: string, fullName?: string) {
  return apiRequest<AuthResult>('/auth/apple', {
    method: 'POST',
    body: { idToken, fullName },
    auth: false,
  });
}

export function refreshTokens(refreshToken: string) {
  return apiRequest<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
    auth: false,
  });
}

export function logout(refreshToken: string) {
  return apiRequest<null>('/auth/logout', { method: 'POST', body: { refreshToken }, auth: false });
}

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export function completeProfile(input: { name: string; gender: Gender; avatarUrl?: string }) {
  return apiRequest<SessionUser>('/auth/profile', { method: 'POST', body: input });
}

/**
 * POST /auth/role — sets the account's role for the first time only.
 *
 * Known backend bug (src/services/auth.service.ts `setInitialRole`): every
 * user is created with `roles: ['customer']` by the Mongoose schema default,
 * but this endpoint 409s whenever `roles.length > 0` — so it always 409s,
 * even for a brand-new user who has never explicitly chosen a role. Callers
 * should treat a CONFLICT here as "role is already customer server-side",
 * not as a real failure, until the backend fixes the guard.
 */
export function setInitialRole(role: ActiveRole) {
  return apiRequest<SessionUser>('/auth/role', { method: 'POST', body: { role } });
}

export function setLocationConsent(granted: boolean) {
  return apiRequest<null>('/auth/consent/location', { method: 'PATCH', body: { granted } });
}

export function setNotificationConsent(granted: boolean) {
  return apiRequest<null>('/auth/consent/notifications', { method: 'PATCH', body: { granted } });
}
