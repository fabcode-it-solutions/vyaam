import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { CarbsIcon, FatIcon, ProteinIcon, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type CalorieSummaryCardProps = {
  consumedKcal: number;
  targetKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  /** Overrides the "TODAY" eyebrow — pass a day label when viewing a date other than today. */
  eyebrowLabel?: string;
};

/**
 * Calorie + macro summary — Diet Plan hero card (Figma node 70:158). Solid
 * ink card is the one dark surface on this screen; the progress bar fill
 * uses `accentDeep` per the guide (saffron reserved for "energy moments",
 * never a large text block, but fine as a slim progress fill).
 */
export const CalorieSummaryCard = memo(function CalorieSummaryCard({
  consumedKcal,
  targetKcal,
  proteinG,
  carbsG,
  fatG,
  eyebrowLabel = 'TODAY · CALORIES',
}: CalorieSummaryCardProps) {
  const { colors } = useTheme();
  const progress = useMemo(
    () => Math.min(1, targetKcal > 0 ? consumedKcal / targetKcal : 0),
    [consumedKcal, targetKcal],
  );

  return (
    <View style={[styles.card, { backgroundColor: colors.brand, borderRadius: Radius.card }]}>
      <Text variant="caption" style={[styles.eyebrow, { color: 'rgba(255,255,255,0.55)' }]}>
        {eyebrowLabel}
      </Text>
      <Text variant="h2" color="onBrand" style={[styles.total, tabularNums]}>
        {consumedKcal.toLocaleString()} / {targetKcal.toLocaleString()} kcal
      </Text>

      <View style={[styles.track, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
        <View style={[styles.fill, { backgroundColor: colors.accentDeep, width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.macros}>
        <Macro icon={<ProteinIcon />} label={`${proteinG}g Protein`} />
        <Macro icon={<CarbsIcon />} label={`${carbsG}g Carbs`} />
        <Macro icon={<FatIcon />} label={`${fatG}g Fat`} />
      </View>
    </View>
  );
});

const Macro = memo(function Macro({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={styles.macro}>
      {icon}
      <Text variant="caption" style={{ color: 'rgba(255,255,255,0.75)' }}>
        {label}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: Spacing.s6,
  },
  eyebrow: {
    marginBottom: Spacing.s2,
  },
  total: {
    marginBottom: Spacing.s5,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
  },
  macros: {
    flexDirection: 'row',
    marginTop: Spacing.s5,
    gap: Spacing.s6,
  },
  macro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
  },
});
