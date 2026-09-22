import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { PlanExerciseEditRow, type PlanExercise } from '@/components/trainer';
import { BackButton, Badge, Button, Input, SparkleIcon, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * Trainer/Client Plan Editor — opened from Client Detail's "Edit and sign
 * off this plan" button. Day/exercises below are illustrative (matches
 * Figma's "Priya" example); needs the real plan endpoint, keyed off the
 * `id` route param, rather than static data, and tapping an exercise's
 * pencil should open a real edit form once one exists.
 */
const DAY_LABEL = 'Monday · Upper body';

const EXERCISES: PlanExercise[] = [
  { id: 'ex-1', name: 'Barbell bench press', sets: 4, reps: 8 },
  { id: 'ex-2', name: 'Incline dumbbell press', sets: 3, reps: 10 },
  { id: 'ex-3', name: 'Overhead shoulder press', sets: 3, reps: 10 },
  { id: 'ex-4', name: 'Cable tricep pushdown', sets: 3, reps: 12 },
];

const DEFAULT_NOTE =
  "Swapped incline press for a lighter angle given your shoulder — let me know how it feels.";

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

export default function TrainerClientPlanEditorScreen() {
  const { colors } = useTheme();
  const { name } = useLocalSearchParams<{ id?: string; name?: string }>();
  const clientFirstName = (name || 'Priya').split(' ')[0];
  const [note, setNote] = useState(DEFAULT_NOTE);

  const handleEditExercise = useCallback((exercise: PlanExercise) => comingSoon(`Editing ${exercise.name}`), []);
  const handleSignOff = useCallback(() => comingSoon('Signing off and sending this plan'), []);

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Edit {clientFirstName}’s plan</Text>
        </View>

        <Badge
          label="AI-generated · Not yet signed off"
          variant="promo"
          leading={<SparkleIcon size={14} color={colors.accentDeep} />}
        />

        <Text variant="h5" style={styles.dayLabel}>
          {DAY_LABEL}
        </Text>

        <View style={styles.exercises}>
          {EXERCISES.map((exercise) => (
            <PlanExerciseEditRow key={exercise.id} exercise={exercise} onEdit={handleEditExercise} />
          ))}
        </View>

        <Text variant="caption" color="textSecondary" style={styles.noteLabel}>
          Note to {clientFirstName} (optional)
        </Text>
        <Input hideLabel label={`Note to ${clientFirstName}`} value={note} onChangeText={setNote} multiline />

        <Button
          label={`Sign off and send to ${clientFirstName}`}
          size="large"
          fullWidth
          onPress={handleSignOff}
          style={styles.submitButton}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s5,
  },
  dayLabel: {
    marginTop: Spacing.s5,
    marginBottom: Spacing.s3,
  },
  exercises: {
    gap: Spacing.s3,
    marginBottom: Spacing.s6,
  },
  noteLabel: {
    marginBottom: Spacing.s2,
  },
  submitButton: {
    marginTop: Spacing.s6,
  },
});
