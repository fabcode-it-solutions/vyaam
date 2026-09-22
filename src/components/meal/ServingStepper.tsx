import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MinusIcon, PlusIcon, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type ServingStepperProps = {
  servings: number;
  /** Omit when the weight-per-serving isn't known (e.g. an AI-generated meal with no gram data) to hide the "· Xg" suffix rather than show a fabricated number. */
  gramsPerServing?: number;
  min?: number;
  max?: number;
  onChange: (servings: number) => void;
};

/** Serving-quantity row above the calorie card on Meal Detail (Figma node 152:494). */
export const ServingStepper = memo(function ServingStepper({
  servings,
  gramsPerServing,
  min = 1,
  max = 10,
  onChange,
}: ServingStepperProps) {
  const { colors } = useTheme();

  const decrement = useCallback(() => {
    if (servings > min) onChange(servings - 1);
  }, [servings, min, onChange]);
  const increment = useCallback(() => {
    if (servings < max) onChange(servings + 1);
  }, [servings, max, onChange]);

  const canDecrement = servings > min;
  const canIncrement = servings < max;

  return (
    <View style={[styles.row, { backgroundColor: colors.surface, borderRadius: Radius.media }]}>
      <Text variant="h5" style={tabularNums}>
        {servings} serving{servings === 1 ? '' : 's'}
        {gramsPerServing !== undefined ? ` · ${gramsPerServing * servings}g` : ''}
      </Text>

      <View style={styles.stepper}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Decrease servings"
          disabled={!canDecrement}
          onPress={decrement}
          style={[styles.button, { backgroundColor: colors.border }, !canDecrement && styles.disabled]}>
          <MinusIcon color={colors.textPrimary} />
        </Pressable>
        <Text variant="h5" style={[styles.count, tabularNums]}>
          {servings}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Increase servings"
          disabled={!canIncrement}
          onPress={increment}
          style={[styles.button, { backgroundColor: colors.brand }, !canIncrement && styles.disabled]}>
          <PlusIcon color={colors.onBrand} />
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.s4,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  count: {
    width: 20,
    textAlign: 'center',
  },
});
