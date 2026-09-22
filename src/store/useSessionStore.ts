import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Global, cross-screen auth/session state — the Zustand half of the state
 * split CLAUDE.md calls for (Context is reserved for theme only).
 *
 * Shapes here match the real backend (see backend/postman/Vyaam-Backend.postman_collection.json
 * and src/services/auth.service.ts `summarize()`), not the older API spec doc — the two have
 * drifted (field names, the /auth/otp/* endpoints don't exist, etc).
 */

export type ActiveRole = 'customer' | 'trainer' | 'admin';

export type TrainerVerificationStatus = 'unverified' | 'pending' | 'approved' | 'rejected';

export type SessionUser = {
  id: string;
  fullName: string;
  activeRole: ActiveRole;
};

type SessionState = {
  hasOnboarded: boolean;
  /** The number an OTP was last sent to — kept for display/resend, independent of auth state. */
  phone: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  user: SessionUser | null;
  /**
   * Explicit flags rather than inferring from `user` — the backend defaults
   * every new user to `activeRole: 'customer'` / `fullName: 'New User'`, so
   * those fields can't reliably signal "the user actually completed this
   * step" on their own.
   */
  hasSelectedRole: boolean;
  hasCompletedProfile: boolean;
  locationConsent: boolean | null;
  notificationConsent: boolean | null;
  /**
   * Real backend state from POST /me/switch-role or GET /me — a first-ever
   * switch to 'trainer' starts verification server-side and deliberately
   * keeps `user.activeRole` at 'customer' until an admin approves it (see
   * role.service.ts), so this is what the routing gate uses to tell "on the
   * trainer track, awaiting review" apart from "just a customer".
   */
  trainerVerificationStatus: TrainerVerificationStatus | null;
  /**
   * Local-only — there's no backend endpoint yet to actually upload/submit
   * verification documents (ID, certifications, selfie), so this just
   * tracks "the on-device capture flow was completed" for routing purposes:
   * it tells the gate at src/app/index.tsx to send a pending trainer to the
   * "under review" screen instead of back into the capture flow every time
   * the app reopens. Not synced with or verified against the backend.
   */
  trainerVerificationDocsSubmitted: boolean;

  completeOnboarding: () => void;
  setPhone: (phone: string) => void;
  /** Call once POST /auth/phone-otp (or /auth/google, /auth/apple) succeeds. */
  setSession: (tokens: { accessToken: string; refreshToken: string }, user: SessionUser) => void;
  /** Call after POST /auth/refresh rotates the pair. */
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  setUser: (user: SessionUser) => void;
  setRoleSelected: () => void;
  setProfileCompleted: () => void;
  setLocationConsent: (granted: boolean) => void;
  setNotificationConsent: (granted: boolean) => void;
  setTrainerVerificationStatus: (status: TrainerVerificationStatus | null) => void;
  setTrainerVerificationDocsSubmitted: (submitted: boolean) => void;
  /** Clears auth state but keeps hasOnboarded — a returning user shouldn't see the intro slides again. */
  logout: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      phone: null,
      accessToken: null,
      refreshToken: null,
      user: null,
      hasSelectedRole: false,
      hasCompletedProfile: false,
      locationConsent: null,
      notificationConsent: null,
      trainerVerificationStatus: null,
      trainerVerificationDocsSubmitted: false,

      completeOnboarding: () => set({ hasOnboarded: true }),
      setPhone: (phone) => set({ phone }),
      setSession: (tokens, user) => set({ ...tokens, user }),
      setTokens: (tokens) => set(tokens),
      setUser: (user) => set({ user }),
      setRoleSelected: () => set({ hasSelectedRole: true }),
      setProfileCompleted: () => set({ hasCompletedProfile: true }),
      setLocationConsent: (granted) => set({ locationConsent: granted }),
      setNotificationConsent: (granted) => set({ notificationConsent: granted }),
      setTrainerVerificationStatus: (status) => set({ trainerVerificationStatus: status }),
      setTrainerVerificationDocsSubmitted: (submitted) => set({ trainerVerificationDocsSubmitted: submitted }),
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          hasSelectedRole: false,
          hasCompletedProfile: false,
          locationConsent: null,
          notificationConsent: null,
          trainerVerificationStatus: null,
          trainerVerificationDocsSubmitted: false,
        }),
    }),
    {
      name: 'vyaam.session',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
