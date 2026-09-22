import { Redirect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { GeneratingScreen } from '@/components/intake/GeneratingScreen';
import { Button, Text } from '@/components/ui';
import { getDietPlan } from '@/lib/api/endpoints/dietPlan';
import { getWorkoutDay } from '@/lib/api/endpoints/workoutPlan';
import { ApiError } from '@/lib/api/errors';
import { getHomeRouteForRole } from '@/lib/navigation/roleHome';
import { useSessionStore } from '@/store/useSessionStore';
import { Spacing } from '@/theme';

type PlanCheck =
  | { status: 'checking' }
  | { status: 'error' }
  | { status: 'done'; hasDietPlan: boolean; hasWorkoutPlan: boolean };

/** A plan endpoint 404s ("Complete the X intake first") when no plan exists yet — that's a real answer, not a failure. */
function planExists(error: unknown) {
  if (error instanceof ApiError && error.statusCode === 404) return false;
  throw error;
}

/**
 * Routing gate — not a screen itself. Sends the user to the first
 * incomplete step of onboarding/auth, or to the main app once every step is
 * done. Each step's screen advances session state and lands back here
 * (or straight at the next route) to be re-evaluated.
 *
 * Once auth/onboarding is complete, whether the diet/workout intake wizards
 * still need to run is decided by asking the backend for the plans
 * themselves (GET /plans/diet, GET /plans/workout) rather than a local flag —
 * a plan generated in an earlier session (or from another device) must still
 * skip straight to Home.
 */
export default function Index() {
  const {
    hasOnboarded,
    accessToken,
    hasSelectedRole,
    hasCompletedProfile,
    locationConsent,
    notificationConsent,
    trainerVerificationStatus,
    trainerVerificationDocsSubmitted,
    user,
    completeOnboarding,
    setRoleSelected,
    setLocationConsent,
    setNotificationConsent,
  } = useSessionStore();

  /**
   * Location/notification consent and the AI diet/workout intake are all
   * customer-only concerns (Phase 1 scope per CLAUDE.md) — a trainer has no
   * "find trainers near you" or plan-generation flow of their own.
   *
   * `user.activeRole` only ever reads 'trainer' once an admin has actually
   * approved verification (role.service.ts on the backend deliberately keeps
   * it 'customer' until then) — someone mid-verification is neither a real
   * trainer nor a real customer, so they're routed by
   * `trainerVerificationStatus` into the trainer verification flow instead
   * of either home.
   */
  const isTrainer = user?.activeRole === 'trainer';
  const isTrainerTrack = isTrainer || trainerVerificationStatus === 'pending' || trainerVerificationStatus === 'rejected';

  const onboardingComplete =
    hasOnboarded &&
    !!accessToken &&
    hasSelectedRole &&
    hasCompletedProfile &&
    (isTrainerTrack || (locationConsent !== null && notificationConsent !== null));

  const [planCheck, setPlanCheck] = useState<PlanCheck>({ status: 'checking' });

  const runPlanCheck = useCallback(() => {
    Promise.all([
      getDietPlan()
        .then(() => true)
        .catch(planExists),
      getWorkoutDay()
        .then(() => true)
        .catch(planExists),
    ]).then(
      ([hasDietPlan, hasWorkoutPlan]) => setPlanCheck({ status: 'done', hasDietPlan, hasWorkoutPlan }),
      () => setPlanCheck({ status: 'error' }),
    );
  }, []);

  const retryPlanCheck = useCallback(() => {
    setPlanCheck({ status: 'checking' });
    runPlanCheck();
  }, [runPlanCheck]);

  useEffect(() => {
    if (onboardingComplete && !isTrainerTrack) runPlanCheck();
  }, [onboardingComplete, isTrainerTrack, runPlanCheck]);

  /**
   * TRAINER MODULE TEMPORARILY DISABLED (customer-only launch, product
   * direction 2026-09-03) — do not delete, just skip. The role-select,
   * location-permission and notification-permission screens are no longer
   * shown; the routing gates for them below are commented out rather than
   * removed so this is easy to reverse later. Every account is auto-fulfilled
   * straight into the customer track here instead: the backend already
   * defaults a new user's `activeRole` to 'customer' (see role.service.ts),
   * so no API call is needed to "select" it. Consent flags are set to
   * `false` rather than faked as granted — no OS permission prompt actually
   * ran, so the app just proceeds without location/notification access
   * rather than pretending the user opted in.
   */
  useEffect(() => {
    if (!accessToken) return;
    if (!hasOnboarded) completeOnboarding();
    if (!hasSelectedRole) setRoleSelected();
    if (locationConsent === null) setLocationConsent(false);
    if (notificationConsent === null) setNotificationConsent(false);
  }, [
    accessToken,
    hasOnboarded,
    hasSelectedRole,
    locationConsent,
    notificationConsent,
    completeOnboarding,
    setRoleSelected,
    setLocationConsent,
    setNotificationConsent,
  ]);

  // Dev navigator sitemap — uncomment to jump directly to any screen during development.
  // if (__DEV__) return <Redirect href="/__dev_nav" />;

  // Intro slides skipped (product direction 2026-09-04) — go straight to phone
  // login. Screen and hasOnboarded/completeOnboarding kept, not deleted, so
  // this is easy to reverse later.
  // if (!hasOnboarded) return <Redirect href="/onboarding" />;
  if (!accessToken) return <Redirect href="/auth/phone" />;
  // Trainer module disabled — role-select screen skipped, see comment above.
  // if (!hasSelectedRole) return <Redirect href="/auth/role-select" />;
  if (!hasCompletedProfile) return <Redirect href="/auth/profile-setup" />;

  if (trainerVerificationStatus === 'rejected') return <Redirect href="/trainer/verification-rejected" />;
  if (trainerVerificationStatus === 'pending') {
    return (
      <Redirect href={trainerVerificationDocsSubmitted ? '/trainer/verification-pending' : '/trainer/verification-intro'} />
    );
  }
  if (isTrainer) return <Redirect href={getHomeRouteForRole(user?.activeRole)} />;

  // Location/notification permission primers disabled — see comment above.
  // if (locationConsent === null) return <Redirect href="/auth/location-permission" />;
  // if (notificationConsent === null) return <Redirect href="/auth/notification-permission" />;

  if (planCheck.status === 'error') {
    return (
      <Screen>
        <View style={styles.errorBody}>
          <Text variant="h4" style={styles.textCenter}>
            Couldn’t reach Vyaam
          </Text>
          <Text variant="bodySecondary" color="textSecondary" style={styles.textCenter}>
            Check your connection and try again.
          </Text>
          <Button label="Try again" size="medium" onPress={retryPlanCheck} style={styles.retryButton} />
        </View>
      </Screen>
    );
  }

  if (planCheck.status === 'checking') {
    return <GeneratingScreen heading="Getting things ready…" description="Just a moment." isComplete={false} />;
  }

  if (!planCheck.hasDietPlan) return <Redirect href="/intake/diet-intro" />;
  if (!planCheck.hasWorkoutPlan) return <Redirect href="/intake/workout-intro" />;
  return <Redirect href={getHomeRouteForRole(user?.activeRole)} />;
}

const styles = StyleSheet.create({
  errorBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
  },
  textCenter: {
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.s3,
  },
});
