import { memo, type ReactNode } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type IntroScreenProps = {
  icon: ReactNode;
  heading: string;
  description: string;
  caption?: string;
  ctaLabel: string;
  onPressCta: () => void;
  /** Optional header-right slot, e.g. a dev-nav shortcut during development. */
  topRightAction?: ReactNode;
};

/**
 * Shared shell for the intake intro screens (Figma "Intake/Diet Intro" node
 * 58:51 and "Intake/Workout Intro" node 109:334) — back nav, tinted icon
 * circle, centered heading/description/caption, full-width CTA. Both plan
 * flows use the exact same layout, only the icon/copy/tint differ.
 */
export const IntroScreen = memo(function IntroScreen({
  icon,
  heading,
  description,
  caption,
  ctaLabel,
  onPressCta,
  topRightAction,
}: IntroScreenProps) {
  const { colors } = useTheme();

  return (
    <Screen padded={false}>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <BackButton onPress={() => router.back()} />
          {topRightAction}
        </View>

        <View style={styles.body}>
          <View style={[styles.iconCircle, { backgroundColor: colors.accentTint }]}>{icon}</View>
          <View style={styles.copy}>
            <Text variant="h2" style={styles.heading}>
              {heading}
            </Text>
            <Text variant="bodySecondary" color="textSecondary" style={styles.description}>
              {description}
            </Text>
            {caption && (
              <Text variant="caption" color="textMuted">
                {caption}
              </Text>
            )}
          </View>
        </View>

        <Button label={ctaLabel} size="large" fullWidth onPress={onPressCta} style={styles.button} />
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Spacing.s6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.s3,
  },
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
  },
  heading: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: 297,
  },
  button: {
    marginBottom: Spacing.s8,
  },
});
