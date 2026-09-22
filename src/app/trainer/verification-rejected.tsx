import { router } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Card, Text, WarningTriangleIcon } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Trainer/Verification "We couldn't verify your ID" — rejection state shown
 * when the review step fails. Reason and tips below are illustrative;
 * needs the real verification-status endpoint rather than fixed copy, and
 * "Resubmit ID" should route back into upload-id once that step accepts a
 * resubmission flag.
 */
const REASON = "The back of your ID was blurry and the address wasn't readable.";

const PHOTO_TIPS = [
  'Use good, even lighting — avoid glare',
  'Make sure all four corners are in frame',
  'Hold the camera steady before capturing',
];

export default function TrainerVerificationRejectedScreen() {
  const { colors } = useTheme();

  const handleResubmit = () => {
    Alert.alert('Coming soon', 'Resubmitting your ID isn’t wired up yet.');
  };

  return (
    <Screen padded={false}>
      <View style={styles.content}>
        <BackButton onPress={() => router.back()} style={styles.backButton} />

        <View style={[styles.iconCircle, { backgroundColor: colors.dangerTint }]}>
          <WarningTriangleIcon size={28} color={colors.danger} />
        </View>

        <Text variant="h1" style={styles.heading}>
          We couldn’t verify your ID
        </Text>

        <Card style={styles.reasonCard}>
          <Text variant="h6" color="textMuted">
            Reason
          </Text>
          <Text variant="bodySecondary">{REASON}</Text>
        </Card>

        <Text variant="h5" style={styles.tipsHeading}>
          For a better photo:
        </Text>
        <View style={styles.tips}>
          {PHOTO_TIPS.map((tip) => (
            <View key={tip} style={styles.tipRow}>
              <View style={[styles.bullet, { backgroundColor: colors.textSecondary }]} />
              <Text variant="bodySecondary" color="textSecondary" style={styles.tipText}>
                {tip}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.spacer} />

        <Button label="Resubmit ID" size="large" fullWidth onPress={handleResubmit} style={styles.button} />
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
    marginBottom: Spacing.s6,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.s5,
  },
  heading: {
    marginBottom: Spacing.s5,
  },
  reasonCard: {
    gap: Spacing.s2,
    marginBottom: Spacing.s6,
  },
  tipsHeading: {
    marginBottom: Spacing.s3,
  },
  tips: {
    gap: Spacing.s2,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.s2,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    marginTop: 9,
  },
  tipText: {
    flex: 1,
  },
  spacer: {
    flex: 1,
    minHeight: Spacing.s6,
  },
  button: {
    marginBottom: Spacing.s6,
  },
});
