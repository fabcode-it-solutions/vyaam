import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button, CheckIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type PlanReadyScreenProps = {
  heading: string;
  summary: string;
  caption: string;
  onViewPlan: () => void;
  /** Ghost CTA below the primary/continue buttons. Defaults to "Share with a trainer". */
  ghostLabel?: string;
  onGhostPress: () => void;
  /** Optional next-step CTA, e.g. diet plan-ready continuing on to the workout intake. Omit to hide. */
  continueLabel?: string;
  onContinue?: () => void;
};

/**
 * Shared shell for the "plan is ready" intake screens (Figma "Intake/Plan
 * Ready" node 67:129 and "Intake/Workout Plan Ready" node 114:387) — tinted
 * check icon, centered heading/summary/caption, primary + ghost CTA. Both
 * plan flows use the exact same layout, only copy/destinations differ.
 */
export const PlanReadyScreen = memo(function PlanReadyScreen({
  heading,
  summary,
  caption,
  onViewPlan,
  ghostLabel = 'Share via email',
  onGhostPress,
  continueLabel,
  onContinue,
}: PlanReadyScreenProps) {
  const { colors } = useTheme();

  return (
    <Screen>
      <View style={styles.body}>
        <View style={[styles.iconCircle, { backgroundColor: colors.verifiedTint }]}>
          <CheckIcon size={40} color={colors.verified} />
        </View>

        <View style={styles.copy}>
          <Text variant="h2" style={styles.textCenter}>
            {heading}
          </Text>
          <Text variant="bodySecondary" color="textSecondary" style={styles.textCenter}>
            {summary}
          </Text>
          <Text variant="caption" color="textMuted" style={styles.textCenter}>
            {caption}
          </Text>
        </View>
      </View>

      <Button label="View my plan" size="large" fullWidth onPress={onViewPlan} style={styles.primaryButton} />
      {continueLabel && onContinue && (
        <Button
          label={continueLabel}
          variant="secondary"
          size="medium"
          fullWidth
          onPress={onContinue}
          style={styles.continueButton}
        />
      )}
      <Button
        label={ghostLabel}
        variant="ghost"
        size="small"
        onPress={onGhostPress}
        style={styles.ghostButton}
      />
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
  continueButton: {
    marginBottom: Spacing.s2,
  },
  ghostButton: {
    alignSelf: 'center',
    marginBottom: Spacing.s4,
  },
});
