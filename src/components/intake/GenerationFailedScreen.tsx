import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button, Text, WarningTriangleIcon } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type GenerationFailedScreenProps = {
  message: string;
  onRetry: () => void;
  onBack: () => void;
};

/**
 * Shared shell for a failed/interrupted plan-generation job — same layout
 * convention as GeneratingScreen and PlanReadyScreen (tinted icon, centered
 * copy, primary + ghost CTA), shown when the polled job comes back `failed`
 * or the job id/network is unavailable.
 */
export const GenerationFailedScreen = memo(function GenerationFailedScreen({
  message,
  onRetry,
  onBack,
}: GenerationFailedScreenProps) {
  const { colors } = useTheme();

  return (
    <Screen>
      <View style={styles.body}>
        <View style={[styles.iconCircle, { backgroundColor: colors.dangerTint }]}>
          <WarningTriangleIcon size={40} color={colors.danger} />
        </View>

        <View style={styles.copy}>
          <Text variant="h2" style={styles.textCenter}>
            Couldn’t build your plan
          </Text>
          <Text variant="bodySecondary" color="textSecondary" style={styles.textCenter}>
            {message}
          </Text>
        </View>
      </View>

      <Button label="Try again" size="large" fullWidth onPress={onRetry} style={styles.primaryButton} />
      <Button label="Back to start" variant="ghost" size="small" onPress={onBack} style={styles.ghostButton} />
    </Screen>
  );
});

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 112,
    height: 112,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.s8,
  },
  copy: {
    alignItems: 'center',
    gap: Spacing.s3,
    maxWidth: 313,
  },
  textCenter: {
    textAlign: 'center',
  },
  primaryButton: {
    marginBottom: Spacing.s2,
  },
  ghostButton: {
    alignSelf: 'center',
    marginBottom: Spacing.s4,
  },
});
