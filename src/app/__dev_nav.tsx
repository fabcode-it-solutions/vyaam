import { router } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

const ROUTES = [
  { label: 'Onboarding', href: '/onboarding' },
  { label: 'Auth / Phone', href: '/auth/phone' },
  { label: 'Auth / OTP', href: '/auth/otp' },
  { label: 'Auth / Role Select', href: '/auth/role-select' },
  { label: 'Auth / Profile Setup', href: '/auth/profile-setup' },
  { label: 'Auth / Location Permission', href: '/auth/location-permission' },
  { label: 'Auth / Notification Permission', href: '/auth/notification-permission' },
  { label: 'Home', href: '/home' },
  { label: 'Customer / Home', href: '/customer/home' },
  { label: 'Search', href: '/search' },
  { label: 'Notifications', href: '/notifications' },
  { label: 'Profile / My Profile', href: '/profile/myprofile' },
  { label: 'Intake / Goal', href: '/intake/goal' },
  { label: 'Intake / Experience Level', href: '/intake/experience-level' },
  { label: 'Intake / Equipment', href: '/intake/equipment' },
  { label: 'Intake / Training Location', href: '/intake/training-location' },
  { label: 'Intake / Pain', href: '/intake/pain' },
  { label: 'Intake / Safety Checklist', href: '/intake/safety-checklist' },
  { label: 'Intake / Workout Intro', href: '/intake/workout-intro' },
  { label: 'Intake / Workout Generating', href: '/intake/workout-generating' },
  { label: 'Intake / Workout Plan Ready', href: '/intake/workout-plan-ready' },
  { label: 'Intake / Diet Intro', href: '/intake/diet-intro' },
  { label: 'Intake / Diet Type', href: '/intake/diet-type' },
  { label: 'Intake / Food Restrictions', href: '/intake/food-restrictions' },
  { label: 'Intake / Generating', href: '/intake/generating' },
  { label: 'Intake / Plan Ready', href: '/intake/plan-ready' },
  { label: 'Plans / Workout', href: '/plans/workout' },
  { label: 'Diet / Plan', href: '/diet/plan' },
  { label: 'Diet / Share with Trainer', href: '/diet/share-with-trainer' },
  { label: 'Logs / Hub', href: '/logs/hub' },
  { label: 'Logs / Log Weight', href: '/logs/log-weight' },
  { label: 'Logs / Log Water', href: '/logs/log-water' },
  { label: 'Logs / Log Workout', href: '/logs/log-workout' },
  { label: 'Logs / Log Meal', href: '/logs/log-meal' },
  { label: 'Logs / Log Sleep', href: '/logs/log-sleep' },
  { label: 'Logs / Progress Photo', href: '/logs/progress-photo' },
  { label: 'Logs / Progress Charts', href: '/logs/progress-charts' },
  { label: 'Logs / Streaks & Achievements', href: '/logs/streaks-achievements' },
  { label: 'Calculators / Hub', href: '/calculators/hub' },
  { label: 'Calculators / BMI', href: '/calculators/bmi' },
  { label: 'Calculators / BMR & TDEE', href: '/calculators/bmr-tdee' },
  { label: 'Calculators / Body Fat', href: '/calculators/body-fat' },
  { label: 'Calculators / 1RM', href: '/calculators/1rm' },
  { label: 'Calculators / Ideal Weight', href: '/calculators/ideal-weight' },
  { label: 'Calculators / Macro Split', href: '/calculators/macro-split' },
  { label: 'Calculators / Protein Target', href: '/calculators/protein-target' },
  { label: 'Calculators / Water Intake', href: '/calculators/water-intake' },
  { label: 'Discover / Trainer List', href: '/discover/trainer-list' },
  { label: 'Discover / Map Search', href: '/discover/map-search' },
  { label: 'Discover / Filter Sheet', href: '/discover/filter-sheet' },
  { label: 'Trainer / Profile', href: '/trainer/profile' },
  { label: 'Trainer / Reviews', href: '/trainer/reviews' },
  { label: 'Trainer / Verification Intro', href: '/trainer/verification-intro' },
  { label: 'Trainer / Upload ID', href: '/trainer/upload-id' },
  { label: 'Trainer / Upload Certifications', href: '/trainer/upload-certifications' },
  { label: 'Trainer / Selfie Liveness', href: '/trainer/selfie-liveness' },
  { label: 'Trainer / Verification Pending', href: '/trainer/verification-pending' },
  { label: 'Trainer / Verification Rejected', href: '/trainer/verification-rejected' },
  { label: 'Trainer / Profile Setup', href: '/trainer/profile-setup' },
  { label: 'Trainer / Home', href: '/trainer/trainer-home' },
  { label: 'Trainer / Leads List', href: '/trainer/leads-list' },
  { label: 'Trainer / Leads Map', href: '/trainer/leads-map' },
  { label: 'Trainer / Saved Search Settings', href: '/trainer/saved-search-settings' },
  { label: 'Trainer / Request Detail', href: '/trainer/request-detail' },
  { label: 'Trainer / Place Bid', href: '/trainer/place-bid' },
  { label: 'Trainer / My Bids', href: '/trainer/my-bids' },
  { label: 'Trainer / Client List', href: '/trainer/client-list' },
  { label: 'Trainer / Client Detail', href: '/trainer/client-detail' },
  { label: 'Trainer / Client Plan Editor', href: '/trainer/client-plan-editor' },
  { label: 'Trainer / Session Scheduling', href: '/trainer/session-scheduling' },
  { label: 'Trainer / Earnings & Payouts', href: '/trainer/earnings-payouts' },
  { label: 'Trainer / Reviews Received', href: '/trainer/reviews-received' },
  { label: 'Trainer / Bid Credits', href: '/trainer/bid-credits' },
  { label: 'Requests / My Requests', href: '/requests/my-requests' },
  { label: 'Requests / Create Step 1', href: '/requests/create-step-1' },
  { label: 'Requests / Create Step 2', href: '/requests/create-step-2' },
  { label: 'Requests / Create Step 3', href: '/requests/create-step-3' },
  { label: 'Requests / Create Step 4', href: '/requests/create-step-4' },
] as const;

export default function DevNav() {
  const { colors } = useTheme();
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text variant="h2" style={styles.title}>Dev Navigator</Text>
      {ROUTES.map(({ label, href }) => (
        <TouchableOpacity
          key={href}
          style={[styles.row, { borderColor: colors.border, backgroundColor: colors.surface }]}
          onPress={() => router.push(href as never)}
        >
          <Text variant="body">{label}</Text>
          <Text variant="body" color="textSecondary"> →</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.s4, gap: Spacing.s2 },
  title: { marginBottom: Spacing.s4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.s4,
    borderRadius: 10,
    borderWidth: 1,
  },
});
