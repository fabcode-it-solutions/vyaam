import { memo, useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { CheckIcon, ChevronIcon, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type Meal = {
  id: string;
  title: string;
  description: string;
  kcal: number;
  logged: boolean;
};

export type MealRowProps = {
  meal: Meal;
  onPress: (meal: Meal) => void;
  /** Tapping the status circle toggles logged state directly, without opening detail. */
  onToggleLogged: (meal: Meal) => void;
  /** True while this row's toggle request is in flight — shows a spinner in the status circle. */
  toggling?: boolean;
  /** Future days can be previewed but not logged — the circle stays tappable (for the explanation) but renders muted. */
  locked?: boolean;
};

/**
 * One row of "Today's meals" on Diet Plan (Figma node 70:182). The status
 * circle and the rest of the row are separate touch targets (siblings, not
 * nested Pressables) — tapping the circle logs/unlogs the meal in place,
 * tapping the row body opens the meal detail screen.
 */
export const MealRow = memo(function MealRow({
  meal,
  onPress,
  onToggleLogged,
  toggling = false,
  locked = false,
}: MealRowProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(meal), [onPress, meal]);
  const handleToggle = useCallback(() => onToggleLogged(meal), [onToggleLogged, meal]);

  return (
    <View style={[styles.row, { backgroundColor: colors.surface, borderRadius: Radius.media }]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: meal.logged, disabled: toggling }}
        accessibilityLabel={
          locked
            ? `${meal.title} can be logged once that day arrives`
            : `Mark ${meal.title} as ${meal.logged ? 'not eaten' : 'eaten'}`
        }
        onPress={handleToggle}
        disabled={toggling}
        hitSlop={8}
        style={[
          styles.statusCircle,
          meal.logged
            ? { backgroundColor: colors.brand }
            : { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
          locked && styles.statusCircleLocked,
        ]}>
        {toggling ? (
          <ActivityIndicator size="small" color={meal.logged ? colors.onBrand : colors.textMuted} />
        ) : (
          meal.logged && <CheckIcon size={14} color={colors.onBrand} />
        )}
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${meal.title}, ${meal.description}, ${meal.kcal} kcal${meal.logged ? ', logged' : ''}`}
        onPress={handlePress}
        style={styles.body}>
        <View style={styles.bodyText}>
          <Text variant="h5" numberOfLines={1}>
            {meal.title}
          </Text>
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {meal.description}
          </Text>
        </View>

        <Text variant="caption" color="textMuted" style={[styles.kcal, tabularNums]}>
          {meal.kcal} kcal
        </Text>
        <ChevronIcon color={colors.textMuted} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.s4,
    gap: Spacing.s3,
  },
  statusCircle: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCircleLocked: {
    opacity: 0.4,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  bodyText: {
    flex: 1,
    gap: 2,
  },
  kcal: {
    marginRight: Spacing.s1,
  },
});
