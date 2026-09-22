import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { TrainerCertificationList } from '@/components/trainer';
import { BackButton, Card, ClockIcon, Text } from '@/components/ui';
import { getHomeRouteForRole } from '@/lib/navigation/roleHome';
import { useSessionStore } from '@/store/useSessionStore';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Trainer/Verification "Under review" — waiting screen shown after the
 * upload-id / upload-certifications / selfie-liveness steps are all
 * submitted. No CTA here since there's nothing to act on until review
 * finishes server-side; needs the real verification-status endpoint rather
 * than this fixed all-submitted checklist.
 */
const SUBMITTED_STEPS = ['Government ID', 'Certifications', 'Selfie verification'];

export default function TrainerVerificationPendingScreen() {
  const { colors } = useTheme();
  const activeRole = useSessionStore((s) => s.user?.activeRole);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(getHomeRouteForRole(activeRole));
    }
  };

  return (
    <Screen padded={false}>
      <View style={styles.content}>
        <BackButton onPress={handleBack} style={styles.backButton} />

        <View style={styles.body}>
          <View style={[styles.iconCircle, { backgroundColor: colors.accentTint }]}>
            <ClockIcon size={36} color={colors.accentDeep} />
          </View>
          <Text variant="h1" style={styles.heading}>
            Under review
          </Text>
          <Text variant="bodySecondary" color="textSecondary" style={styles.description}>
            We’re checking your documents. This usually takes under 24 hours — we’ll notify you the moment it’s
            done.
          </Text>
        </View>

        <Card style={styles.checklistCard}>
          <TrainerCertificationList certifications={SUBMITTED_STEPS} />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Spacing.s6,
  },
  backButton: {
    marginTop: Spacing.s3,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.s6,
  },
  heading: {
    textAlign: 'center',
    marginBottom: Spacing.s3,
  },
  description: {
    textAlign: 'center',
    maxWidth: 280,
  },
  checklistCard: {
    marginBottom: Spacing.s8,
  },
});
