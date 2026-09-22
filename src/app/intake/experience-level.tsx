import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Text } from '@/components/ui';
import { IntakeProgressBar } from '@/components/intake/IntakeProgressBar';
import { OptionRow } from '@/components/intake/OptionRow';
import { ApiError } from '@/lib/api/errors';
import { submitWorkoutIntake, type ExperienceLevel, type WorkoutIntakeInput } from '@/lib/api/endpoints/workoutPlan';
import { useIntakeStore } from '@/store/useIntakeStore';
import { Spacing } from '@/theme';

const LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'never_trained', label: 'Never trained' },
  { value: 'under_6_months', label: 'Under 6 months' },
  { value: 'six_months_to_2_years', label: '6 months to 2 years' },
  { value: 'two_years_or_more', label: '2 years or more' },
  { value: 'competitive_athlete', label: 'Competitive athlete' },
];

// 4 of 5 — see Intake/Training Location for the step count this is measured against.
const STEP_PROGRESS = 4 / 5;

/**
 * Intake/Experience Level — Figma node 114:349
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=114-349).
 * Final data-entry step of the workout intake — submits the accumulated
 * draft from every prior screen to POST /plans/intake/workout.
 */
export default function IntakeExperienceLevelScreen() {
  const draft = useIntakeStore((s) => s.workout);
  const setWorkoutAnswers = useIntakeStore((s) => s.setWorkoutAnswers);
  const setWorkoutJobId = useIntakeStore((s) => s.setWorkoutJobId);

  const [selected, setSelected] = useState<ExperienceLevel | null>(draft.experienceLevel ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!selected || !draft.trainingLocation) {
      router.replace('/intake/training-location');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const input: WorkoutIntakeInput = {
        trainingLocation: draft.trainingLocation,
        equipment: draft.equipment ?? [],
        painPoints: draft.painPoints ?? [],
        experienceLevel: selected,
      };
      setWorkoutAnswers({ experienceLevel: selected });
      const { jobId } = await submitWorkoutIntake(input);
      setWorkoutJobId(jobId);
      router.push('/intake/workout-generating');
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not start plan generation. Check your connection and try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <BackButton onPress={() => router.back()} style={styles.backButton} />

      <IntakeProgressBar progress={STEP_PROGRESS} />

      <View style={styles.header}>
        <Text variant="h2">How experienced are you?</Text>
        <Text variant="bodySecondary" color="textSecondary">
          So the plan starts at the right intensity.
        </Text>
      </View>

      <View style={styles.options}>
        {LEVELS.map((level) => (
          <OptionRow
            key={level.value}
            label={level.label}
            selected={selected === level.value}
            onPress={() => setSelected(level.value)}
          />
        ))}
      </View>

      {error && (
        <Text variant="caption" color="danger" style={styles.error}>
          {error}
        </Text>
      )}

      <Button
        label="Continue"
        size="large"
        fullWidth
        disabled={!selected}
        loading={submitting}
        onPress={handleContinue}
        style={styles.footer}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: Spacing.s2,
    marginBottom: Spacing.s6,
  },
  header: {
    gap: Spacing.s3,
    marginBottom: Spacing.s6,
  },
  options: {
    gap: Spacing.s2,
  },
  error: {
    marginTop: Spacing.s2,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: Spacing.s4,
  },
});
