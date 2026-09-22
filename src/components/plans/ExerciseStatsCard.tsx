import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type ExerciseStatsCardProps = {
  sets: number;
  reps: number;
  weightLabel: string;
};

/** Sets/reps/weight stat row on Plans/Exercise Detail (Figma node 154:495). */
export const ExerciseStatsCard = memo(function ExerciseStatsCard({ sets, reps, weightLabel }: ExerciseStatsCardProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.brand, borderRadius: Radius.card }]}>
      <Stat label="SETS" value={String(sets)} />
      <Stat label="REPS" value={String(reps)} />
      <Stat label="WEIGHT" value={weightLabel} />
    </View>
  );
});

const Stat = memo(function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="caption" style={styles.statLabel}>
        {label}
      </Text>
      <Text variant="h4" color="onBrand" style={tabularNums}>
        {value}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingVertical: Spacing.s5,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.s2,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
  },
});
