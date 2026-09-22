import { router } from 'expo-router';
import { memo, useCallback } from 'react';
import type { ComponentType } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Card,
  DropletIcon,
  DumbbellIcon,
  FlameIcon,
  PercentIcon,
  PieChartIcon,
  PulseIcon,
  RulerIcon,
  TargetIcon,
  Text,
} from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

type CalculatorIconProps = { size?: number; color?: string };
type QuickCalculator = { id: string; title: string; subtitle: string; icon: ComponentType<CalculatorIconProps>; route: string };

/** Same 8 calculators as /calculators/hub — shown in full on Home per product direction, "See all" still opens the hub. */
const CALCULATORS: QuickCalculator[] = [
  { id: 'bmi', title: 'BMI', subtitle: 'Body mass index', icon: RulerIcon, route: '/calculators/bmi' },
  { id: 'bmr-tdee', title: 'BMR/TDEE', subtitle: 'Resting energy burn', icon: FlameIcon, route: '/calculators/bmr-tdee' },
  { id: 'protein-target', title: 'Protein Target', subtitle: 'Daily protein needs', icon: PulseIcon, route: '/calculators/protein-target' },
  { id: 'body-fat', title: 'Body Fat', subtitle: 'Navy & skinfold methods', icon: PercentIcon, route: '/calculators/body-fat' },
  { id: 'macro-split', title: 'Macro Split', subtitle: 'Protein, carbs, fat', icon: PieChartIcon, route: '/calculators/macro-split' },
  { id: 'ideal-weight', title: 'Ideal Weight', subtitle: 'Healthy weight range', icon: TargetIcon, route: '/calculators/ideal-weight' },
  { id: '1rm', title: '1RM', subtitle: 'One-rep max estimate', icon: DumbbellIcon, route: '/calculators/1rm' },
  { id: 'water', title: 'Water', subtitle: 'Daily water target', icon: DropletIcon, route: '/calculators/water-intake' },
];

function chunkPairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return rows;
}

const CALCULATOR_ROWS = chunkPairs(CALCULATORS);

export const CalculatorsRow = memo(function CalculatorsRow() {
  const handleSeeAll = useCallback(() => router.push('/calculators/hub'), []);
  const handlePress = useCallback(
    (route: string) => router.push(route as Parameters<typeof router.push>[0]),
    [],
  );

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text variant="h3">Calculators</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="See all calculators"
          onPress={handleSeeAll}
          hitSlop={8}>
          <Text variant="caption" color="accentDeep">
            See all
          </Text>
        </Pressable>
      </View>
      <View style={styles.grid}>
        {CALCULATOR_ROWS.map((row, index) => (
          <View key={index} style={styles.row}>
            {row.map((calculator) => (
              <CalculatorCard key={calculator.id} calculator={calculator} onPress={handlePress} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
});

const CalculatorCard = memo(function CalculatorCard({
  calculator,
  onPress,
}: {
  calculator: QuickCalculator;
  onPress: (route: string) => void;
}) {
  const { colors } = useTheme();
  const Icon = calculator.icon;
  const handlePress = useCallback(() => onPress(calculator.route), [onPress, calculator.route]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={calculator.title}
      onPress={handlePress}
      style={styles.cardWrap}>
      <Card style={styles.card}>
        <View style={[styles.iconCircle, { backgroundColor: colors.border }]}>
          <Icon size={20} color={colors.textPrimary} />
        </View>
        <Text variant="h5" numberOfLines={1}>
          {calculator.title}
        </Text>
        <Text variant="caption" color="textSecondary" numberOfLines={1}>
          {calculator.subtitle}
        </Text>
      </Card>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  section: {
    gap: Spacing.s3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  grid: {
    gap: Spacing.s3,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.s3,
  },
  cardWrap: {
    flex: 1,
  },
  card: {
    alignItems: 'flex-start',
    gap: 2,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.s2,
  },
});
