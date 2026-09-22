import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { ArrowIcon, Badge, Button, IconButton, PlayIcon, Text, WarningTriangleIcon } from '@/components/ui';
import { InstructionSteps } from '@/components/meal';
import { ExerciseStatsCard, TipBanner } from '@/components/plans';
import {
  getExerciseDetail,
  logExercise,
  substituteExercise,
  type SubstituteReason,
  type WorkoutExerciseDetail,
} from '@/lib/api/endpoints/workoutPlan';
import { ApiError } from '@/lib/api/errors';
import { todayDateString } from '@/lib/date/week';
import { Radius, Spacing, useTheme } from '@/theme';

const HERO_HEIGHT = 295;

const SUBSTITUTE_REASONS: { value: SubstituteReason; label: string }[] = [
  { value: 'pain', label: 'It hurts / I have pain here' },
  { value: 'no_equipment', label: "I don't have the equipment" },
  { value: 'dislike', label: "I just don't like it" },
];

/**
 * Plans/Exercise Detail — Figma node 154:483
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=154-483).
 * Backed by GET /plans/workout/exercises/:exerciseId?date= (overlays that
 * date's logged completion, seeding per-set ticking which is otherwise
 * illustrative) and PATCH .../log — `date` arrives from the plan list's week
 * strip so a past/future day logs against the right date instead of always
 * writing today's, matching the diet meal detail screen's pattern.
 */
export default function ExerciseDetailScreen() {
  const { exerciseId, date } = useLocalSearchParams<{ exerciseId: string; date?: string }>();
  const { colors } = useTheme();

  const [exercise, setExercise] = useState<WorkoutExerciseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedSets, setCompletedSets] = useState(0);
  const [substituting, setSubstituting] = useState(false);
  const [logging, setLogging] = useState(false);

  const isFutureDate = !!date && date > todayDateString();

  useEffect(() => {
    if (!exerciseId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getExerciseDetail(exerciseId, date).then(
      (result) => {
        if (cancelled) return;
        setExercise(result);
        setCompletedSets(result.completed ? result.sets : 0);
        setLoading(false);
      },
      () => {
        if (!cancelled) setLoading(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [exerciseId, date]);

  const handlePreview = useCallback(() => {
    Alert.alert('Coming soon', 'A demo video for this exercise isn’t available yet.');
  }, []);

  const runSubstitute = useCallback(
    async (reason: SubstituteReason) => {
      if (!exercise) return;
      setSubstituting(true);
      try {
        const replacement = await substituteExercise(exercise.id, reason);
        setExercise(replacement);
        setCompletedSets(replacement.completed ? replacement.sets : 0);
      } catch (err) {
        Alert.alert(
          'Could not substitute',
          err instanceof ApiError ? err.message : 'Something went wrong. Try again.',
        );
      } finally {
        setSubstituting(false);
      }
    },
    [exercise],
  );

  const handleSubstitute = useCallback(() => {
    Alert.alert(
      'Why swap this exercise?',
      undefined,
      [
        ...SUBSTITUTE_REASONS.map((reason) => ({ text: reason.label, onPress: () => runSubstitute(reason.value) })),
        { text: 'Cancel', style: 'cancel' as const },
      ],
    );
  }, [runSubstitute]);

  const handleMarkSetComplete = useCallback(async () => {
    if (!exercise) return;
    if (isFutureDate) {
      Alert.alert("Can't log in advance", 'You can mark this exercise complete once that day arrives.');
      return;
    }
    const next = Math.min(exercise.sets, completedSets + 1);
    setCompletedSets(next);
    if (next < exercise.sets) return;

    setLogging(true);
    try {
      await logExercise(exercise.id, { completed: true, date });
    } catch (err) {
      Alert.alert(
        'Could not log exercise',
        err instanceof ApiError ? err.message : 'Something went wrong. Try again.',
      );
      setCompletedSets(next - 1);
    } finally {
      setLogging(false);
    }
  }, [exercise, completedSets, date, isFutureDate]);

  const handleMarkIncomplete = useCallback(async () => {
    if (!exercise) return;
    const previous = completedSets;
    setCompletedSets(0);
    setLogging(true);
    try {
      await logExercise(exercise.id, { completed: false, date });
    } catch (err) {
      Alert.alert(
        'Could not update exercise',
        err instanceof ApiError ? err.message : 'Something went wrong. Try again.',
      );
      setCompletedSets(previous);
    } finally {
      setLogging(false);
    }
  }, [exercise, completedSets, date]);

  if (loading) {
    return (
      <Screen>
        <IconButton
          accessibilityLabel="Go back"
          icon={<ArrowIcon direction="left" size={18} color={colors.textPrimary} />}
          onPress={() => router.back()}
          style={styles.missingBack}
        />
        <View style={styles.missingBody}>
          <Text variant="bodySecondary" color="textSecondary">
            Loading exercise…
          </Text>
        </View>
      </Screen>
    );
  }

  if (!exercise) {
    return (
      <Screen>
        <IconButton
          accessibilityLabel="Go back"
          icon={<ArrowIcon direction="left" size={18} color={colors.textPrimary} />}
          onPress={() => router.back()}
          style={styles.missingBack}
        />
        <View style={styles.missingBody}>
          <Text variant="h4" style={styles.textCenter}>
            Exercise details aren’t ready yet
          </Text>
          <Text variant="bodySecondary" color="textSecondary" style={styles.textCenter}>
            This exercise doesn’t have a full breakdown in the plan yet.
          </Text>
        </View>
      </Screen>
    );
  }

  const allSetsComplete = completedSets >= exercise.sets;

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* <View style={[styles.hero, { backgroundColor: colors.border }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Preview exercise demo"
            onPress={handlePreview}
            style={styles.previewButton}>
            <PlayIcon size={26} color={colors.brand} />
          </Pressable>
        </View> */}
        <IconButton
          accessibilityLabel="Go back"
          icon={<ArrowIcon direction="left" size={18} color={colors.textPrimary} />}
          onPress={() => router.back()}
          style={styles.back}
        />

        <View style={styles.content}>
          <Text variant="h2">{exercise.name}</Text>
          <Badge variant="promo" label={exercise.muscleGroups.join(' · ')} />

          <ExerciseStatsCard
            sets={exercise.sets}
            reps={exercise.reps}
            weightLabel={exercise.weightKg ? `${exercise.weightKg} kg` : 'Bodyweight'}
          />

          <Text variant="h4" style={styles.sectionTitle}>
            How to do it
          </Text>
          <InstructionSteps steps={exercise.instructions} />

          {exercise.safetyTip && <TipBanner icon={<WarningTriangleIcon />}>{exercise.safetyTip}</TipBanner>}

          {isFutureDate && (
            <Text variant="caption" color="textMuted" style={styles.futureHint}>
              You can mark this exercise complete once that day arrives.
            </Text>
          )}

          {/* <Button
            label="Substitute this exercise"
            variant="secondary"
            size="large"
            fullWidth
            loading={substituting}
            onPress={handleSubstitute}
          /> */}
          <Button
            label={
              isFutureDate
                ? 'Not available yet'
                : allSetsComplete
                  ? 'Mark as incomplete'
                  : `Mark set complete (${completedSets}/${exercise.sets})`
            }
            variant={allSetsComplete && !isFutureDate ? 'secondary' : 'primary'}
            size="large"
            fullWidth
            loading={logging}
            disabled={isFutureDate}
            onPress={allSetsComplete ? handleMarkIncomplete : handleMarkSetComplete}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.s8,
  },
  hero: {
    height: HERO_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewButton: {
    width: 64,
    height: 64,
    borderRadius: Radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  back: {
    marginTop: Spacing.s3,
    marginLeft: Spacing.s6,
  },
  content: {
    paddingHorizontal: Spacing.s6,
    paddingTop: Spacing.s5,
    gap: Spacing.s4,
  },
  sectionTitle: {
    marginTop: Spacing.s2,
  },
  futureHint: {
    textAlign: 'center',
  },
  missingBack: {
    marginTop: Spacing.s3,
  },
  missingBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s6,
  },
  textCenter: {
    textAlign: 'center',
  },
});
