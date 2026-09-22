import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type MacroCalorieCardProps = {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  /** Overrides the "CALORIES" header, e.g. "High protein split · 2,130 kcal" on the Macro Split calculator. */
  label?: string;
  /** Hide the big kcal figure when the label line already states the total (e.g. Macro Split calculator). */
  showKcalValue?: boolean;
};

const KCAL_PER_GRAM = { protein: 4, carbs: 4, fat: 9 };

/**
 * Calorie total + macro-proportion bar on Meal Detail (Figma node 152:504),
 * reused on the Macro Split calculator with a custom label. Segment widths
 * are computed from each macro's actual calorie contribution (protein/carbs
 * ×4, fat ×9), not fixed pixel widths lifted from one frame.
 */
export const MacroCalorieCard = memo(function MacroCalorieCard({
  kcal,
  proteinG,
  carbsG,
  fatG,
  label = 'CALORIES',
  showKcalValue = true,
}: MacroCalorieCardProps) {
  const { colors } = useTheme();

  const shares = useMemo(() => {
    const proteinKcal = proteinG * KCAL_PER_GRAM.protein;
    const carbsKcal = carbsG * KCAL_PER_GRAM.carbs;
    const fatKcal = fatG * KCAL_PER_GRAM.fat;
    const total = proteinKcal + carbsKcal + fatKcal;
    if (total <= 0) return { protein: 0, carbs: 0, fat: 0 };
    return {
      protein: proteinKcal / total,
      carbs: carbsKcal / total,
      fat: fatKcal / total,
    };
  }, [proteinG, carbsG, fatG]);

  return (
    <View style={[styles.card, { backgroundColor: colors.brand, borderRadius: Radius.card }]}>
      <Text variant="caption" style={[styles.label, { color: 'rgba(255,255,255,0.75)' }]}>
        {label}
      </Text>
      {showKcalValue && (
        <Text variant="h1" color="onBrand" style={[styles.kcal, tabularNums]}>
          {kcal} kcal
        </Text>
      )}

      <View style={[styles.bar, !showKcalValue && styles.barSpaced]}>
        <View style={[styles.segment, styles.segmentLeft, { backgroundColor: colors.accentDeep, flex: shares.protein }]} />
        <View style={[styles.segment, { backgroundColor: colors.onBrand, flex: shares.carbs }]} />
        <View
          style={[
            styles.segment,
            styles.segmentRight,
            { backgroundColor: colors.onBrand, opacity: 0.35, flex: shares.fat },
          ]}
        />
      </View>

      <View style={styles.legend}>
        <Macro color={colors.accentDeep} label={`Protein · ${proteinG}g`} />
        <Macro color={colors.onBrand} label={`Carbs · ${carbsG}g`} />
        <Macro color={colors.onBrand} dimmed label={`Fat · ${fatG}g`} />
      </View>
    </View>
  );
});

const Macro = memo(function Macro({
  color,
  dimmed = false,
  label,
}: {
  color: string;
  dimmed?: boolean;
  label: string;
}) {
  return (
    <View style={styles.macro}>
      <View style={[styles.dot, { backgroundColor: color, opacity: dimmed ? 0.4 : 1 }]} />
      <Text variant="caption" color="onBrand">
        {label}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: Spacing.s6,
  },
  label: {
    textTransform: 'uppercase',
  },
  kcal: {
    marginTop: Spacing.s2,
    marginBottom: Spacing.s5,
  },
  bar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barSpaced: {
    marginTop: Spacing.s4,
  },
  segment: {
    height: 10,
  },
  segmentLeft: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  segmentRight: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.s4,
  },
  macro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
