import { router } from 'expo-router';

import { getMe } from '@/lib/api/endpoints/me';
import { useSessionStore, type SessionUser } from '@/store/useSessionStore';

type AuthResult = {
  user: SessionUser;
  isNewUser: boolean;
  accessToken: string;
  refreshToken: string;
};

/**
 * Shared tail end of every sign-in path (Google/Apple/phone OTP).
 *
 * `summarize()` on the backend only ever returns `{id, fullName, activeRole}`
 * on the auth response itself, so a *returning* user's local `hasSelectedRole`
 * /`hasCompletedProfile` flags — reset by `logout()` so a different account on
 * the same device doesn't inherit them — have nothing to rehydrate from
 * unless we go fetch the real profile via GET /me. `gender` is only ever set
 * by the profile-setup screen and has no default, so its presence is what
 * tells us this account already ran that step (rather than string-matching
 * the backend's 'New User' placeholder, or trusting `roles` — every account
 * is created with `roles: ['customer']` already, so that array can't
 * distinguish "explicitly chosen" from "defaulted").
 */
export async function completeAuthFlow({ user, isNewUser, accessToken, refreshToken }: AuthResult) {
  const {
    setSession,
    setUser,
    setRoleSelected,
    setProfileCompleted,
    setTrainerVerificationStatus,
    completeOnboarding,
  } = useSessionStore.getState();
  setSession({ accessToken, refreshToken }, user);

  if (!isNewUser) {
    try {
      const me = await getMe();
      setUser({ id: me.id, fullName: me.fullName, activeRole: me.activeRole });
      setTrainerVerificationStatus(me.trainerVerificationStatus);
      if (me.gender) {
        setRoleSelected();
        setProfileCompleted();
      }
    } catch {
      // Best-effort — if this fails, the routing gate falls back to
      // whatever local flags this device already had.
    }
  } else {
    // New users skip the intro carousel and land straight on profile
    // setup — the "/" gate below sends them there once hasOnboarded is set,
    // since hasCompletedProfile is still false for a brand-new account.
    completeOnboarding();
  }

  router.replace('/');
}
