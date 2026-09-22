import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, PencilIcon, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

export type PlanExercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
};

export type PlanExerciseEditRowProps = {
  exercise: PlanExercise;
  onEdit: (exercise: PlanExercise) => void;
};

/** One exercise row on Trainer/Client Plan Editor — bare edit-pencil affordance, distinct from ExerciseRow's view-detail chevron. */
export const PlanExerciseEditRow = memo(function PlanExerciseEditRow({ exercise, onEdit }: PlanExerciseEditRowProps) {
  const { colors } = useTheme();
  const handleEdit = useCallback(() => onEdit(exercise), [onEdit, exercise]);

  return (
    <Card style={styles.card}>
      <View style={styles.body}>
        <Text variant="h5" numberOfLines={1}>
          {exercise.name}
        </Text>
        <Text variant="caption" color="textMuted">
          {exercise.sets} sets × {exercise.reps} reps
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Edit ${exercise.name}`}
        hitSlop={10}
        onPress={handleEdit}>
        <PencilIcon size={16} color={colors.textMuted} />
      </Pressable>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  body: {
    flex: 1,
    gap: 2,
  },
});
