import { memo, useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { CheckIcon, ChevronIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
};

export type ExerciseRowProps = {
  exercise: Exercise;
  onPress: (exercise: Exercise) => void;
  /** Tapping the status circle toggles completed state directly, without opening detail. */
  onToggleComplete: (exercise: Exercise) => void;
  /** True while this row's toggle request is in flight — shows a spinner in the status circle. */
  toggling?: boolean;
  /** Future days can be previewed but not logged — the circle stays tappable (for the explanation) but renders muted. */
  locked?: boolean;
};

/**
 * One row of "Exercises" on Plans/Workout View (Figma node 50:89). The status
 * circle and the rest of the row are separate touch targets (siblings, not
 * nested Pressables), matching MealRow's pattern — tapping the circle
 * marks the exercise complete/incomplete in place, tapping the row body
 * opens the exercise detail screen.
 */
export const ExerciseRow = memo(function ExerciseRow({
  exercise,
  onPress,
  onToggleComplete,
  toggling = false,
  locked = false,
}: ExerciseRowProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(exercise), [onPress, exercise]);
  const handleToggle = useCallback(() => onToggleComplete(exercise), [onToggleComplete, exercise]);

  return (
    <View style={[styles.row, { backgroundColor: colors.surface, borderRadius: Radius.media }]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: exercise.completed, disabled: toggling }}
        accessibilityLabel={
          locked
            ? `${exercise.name} can be logged once that day arrives`
            : `Mark ${exercise.name} as ${exercise.completed ? 'not complete' : 'complete'}`
        }
        onPress={handleToggle}
        disabled={toggling}
        hitSlop={8}
        style={[
          styles.statusCircle,
          exercise.completed
            ? { backgroundColor: colors.brand }
            : { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
          locked && styles.statusCircleLocked,
        ]}>
        {toggling ? (
          <ActivityIndicator size="small" color={exercise.completed ? colors.onBrand : colors.textMuted} />
        ) : (
          exercise.completed && <CheckIcon size={14} color={colors.onBrand} />
        )}
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${exercise.name}, ${exercise.sets} sets by ${exercise.reps} reps${exercise.completed ? ', completed' : ''}`}
        onPress={handlePress}
        style={styles.body}>
        <View style={styles.bodyText}>
          <Text variant="h5" numberOfLines={1}>
            {exercise.name}
          </Text>
          <Text variant="caption" color="textMuted" numberOfLines={1}>
            {exercise.sets} sets × {exercise.reps} reps
          </Text>
        </View>

        <ChevronIcon size={18} color={colors.textMuted} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.s3,
    gap: Spacing.s3,
  },
  statusCircle: {
    width: 26,
    height: 26,
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
});
