import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ClockIcon, PlayIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type WorkoutFocusCardProps = {
  eyebrow: string;
  title: string;
  durationLabel: string;
  onStartWorkout: () => void;
};

/** Today's-focus hero card on Plans/Workout View (Figma node 50:76). */
export const WorkoutFocusCard = memo(function WorkoutFocusCard({
  eyebrow,
  title,
  durationLabel,
  onStartWorkout,
}: WorkoutFocusCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.brand, borderRadius: Radius.card }]}>
      <Text variant="caption" style={{ color: 'rgba(255,255,255,0.55)' }}>
        {eyebrow}
      </Text>
      <Text variant="h4" color="onBrand" style={styles.title}>
        {title}
      </Text>

      <View style={styles.footer}>
        <View style={styles.duration}>
          <ClockIcon color={colors.onBrand} />
          <Text variant="bodySecondary" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {durationLabel}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Start workout"
          onPress={onStartWorkout}
          style={[styles.startButton, { backgroundColor: colors.accent, borderRadius: Radius.full }]}>
          <PlayIcon color={colors.onAccent} />
          <Text variant="caption" color="onAccent">
            Start workout
          </Text>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: Spacing.s6,
  },
  title: {
    marginTop: Spacing.s3,
    marginBottom: Spacing.s5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
    paddingHorizontal: Spacing.s5,
    paddingVertical: Spacing.s3,
  },
});
