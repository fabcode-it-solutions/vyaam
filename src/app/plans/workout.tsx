import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { ArrowIcon, IconButton, SendIcon, SlidersIcon, Pill, Button, Text } from '@/components/ui';
import { ExerciseRow, WeekDaySelector, WorkoutFocusCard, type Exercise, type WeekDay } from '@/components/plans';
import { getWorkoutDay, getWorkoutWeek, logExercise, type WorkoutDay, type WorkoutWeek } from '@/lib/api/endpoints/workoutPlan';
import { ApiError } from '@/lib/api/errors';
import {
  currentWeekDates,
  dayOfMonthFromDateString,
  dayOfWeekFromDate,
  todayDateString,
  weekdayLabel,
} from '@/lib/date/week';
import { Spacing, useTheme } from '@/theme';

const WEEK_DATES = currentWeekDates();
const TODAY_INDEX = dayOfWeekFromDate();

function exercisesFor(day: WorkoutDay): Exercise[] {
  return day.exercises.map((exercise) => ({
    id: exercise.id,
    name: exercise.name,
    sets: exercise.sets,
    reps: exercise.reps,
    completed: exercise.completed,
  }));
}

/**
 * Plans/Workout View — Figma node 50:38
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=50-38).
 * Backed by GET /plans/workout — ?weekOf= for the week strip's rest-day
 * dots, ?date= for the selected day's full exercise list.
 */
export default function PlansWorkoutViewScreen() {
  const { colors } = useTheme();
  const [selectedDay, setSelectedDay] = useState(TODAY_INDEX);
  const [week, setWeek] = useState<WorkoutWeek | null>(null);
  const [day, setDay] = useState<WorkoutDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingExerciseId, setTogglingExerciseId] = useState<string | null>(null);

  const selectedDate = WEEK_DATES[selectedDay];
  const isFutureDate = selectedDate > todayDateString();

  useEffect(() => {
    let cancelled = false;
    void getWorkoutWeek(WEEK_DATES[0]).then(
      (result) => {
        if (!cancelled) setWeek(result);
      },
      () => {
        // Non-fatal — the week strip just falls back to plain date tiles with no rest-day dots.
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  // Refetch on focus, not just when the selected date changes — so coming
  // back from an exercise's detail screen after Mark set complete/incomplete
  // shows the updated exercise list and focus card right away.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      setError(null);
      getWorkoutDay(selectedDate).then(
        (result) => {
          if (cancelled) return;
          setDay(result);
          setLoading(false);
        },
        (err) => {
          if (cancelled) return;
          setDay(null);
          setLoading(false);
          setError(
            err instanceof ApiError
              ? err.message
              : 'Could not load your workout plan. Check your connection and try again.',
          );
        },
      );
      return () => {
        cancelled = true;
      };
    }, [selectedDate]),
  );

  const weekDays: WeekDay[] = useMemo(
    () =>
      WEEK_DATES.map((date, index) => ({
        label: weekdayLabel(index),
        date: dayOfMonthFromDateString(date),
        hasEvent: week ? !week.days.find((d) => d.date === date)?.isRestDay : undefined,
      })),
    [week],
  );

  const exercises = useMemo(() => (day ? exercisesFor(day) : []), [day]);

  const handleFilters = useCallback(() => {
    Alert.alert('Coming soon', 'Filtering the workout plan isn’t available yet.');
  }, []);

  const handleShare = useCallback(() => {
    router.push({ pathname: '/diet/share-with-trainer', params: { planType: 'workout' } });
  }, []);

  const goToExercise = useCallback(
    (exercise: Exercise) => {
      router.push({
        pathname: '/plans/exercise/[exerciseId]',
        params: { exerciseId: exercise.id, date: selectedDate },
      });
    },
    [selectedDate],
  );

  const handleStartWorkout = useCallback(() => {
    if (exercises.length > 0) goToExercise(exercises[0]);
  }, [exercises, goToExercise]);

  // Ticking the status circle logs/unlogs the exercise in place — the day
  // state is patched from the response rather than refetched, so the check
  // updates immediately with no extra round trip (mirrors MealRow on Diet Plan).
  const handleToggleExerciseComplete = useCallback(
    async (exercise: Exercise) => {
      if (isFutureDate) {
        Alert.alert("Can't log in advance", 'You can mark an exercise complete once that day arrives.');
        return;
      }
      setTogglingExerciseId(exercise.id);
      try {
        const result = await logExercise(exercise.id, { completed: !exercise.completed, date: selectedDate });
        setDay((prev) =>
          prev
            ? {
                ...prev,
                exercises: prev.exercises.map((e) => (e.id === exercise.id ? { ...e, completed: result.completed } : e)),
              }
            : prev,
        );
      } catch (err) {
        Alert.alert(
          'Could not update exercise',
          err instanceof ApiError ? err.message : 'Something went wrong. Try again.',
        );
      } finally {
        setTogglingExerciseId(null);
      }
    },
    [selectedDate, isFutureDate],
  );

  const handleWorkoutTabPress = useCallback(() => {}, []);
  const handleDietTabPress = useCallback(() => router.push('/diet/plan'), []);

  const focus = day
    ? {
        eyebrow: `${weekdayLabel(day.dayOfWeek).toUpperCase()} · ${(day.focusArea ?? 'WORKOUT').toUpperCase()}`,
        title: day.title ?? `${exercises.length} exercises`,
        durationLabel: day.durationMinutes ? `${day.durationMinutes} min` : '—',
      }
    : null;

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <IconButton
            accessibilityLabel="Go back"
            icon={<ArrowIcon direction="left" size={18} color={colors.textPrimary} />}
            onPress={() => router.back()}
          />
          <Text variant="h2" numberOfLines={1} style={styles.title}>
            Your workout plan
          </Text>
          <IconButton
            accessibilityLabel="Share workout plan"
            variant="surface"
            icon={<SendIcon color={colors.textPrimary} />}
            onPress={handleShare}
          />
          {/* <IconButton
            accessibilityLabel="Filter plan"
            variant="surface"
            icon={<SlidersIcon color={colors.textPrimary} />}
            onPress={handleFilters}
          /> */}
        </View>

        <View style={styles.tabs}>
          <Pill label="Workout" selected onPress={handleWorkoutTabPress} />
          <Pill label="Diet" selected={false} onPress={handleDietTabPress} />
        </View>

        <View style={styles.weekStrip}>
          <WeekDaySelector days={weekDays} selectedIndex={selectedDay} onSelect={setSelectedDay} />
        </View>

        {error && !day ? (
          <View style={styles.emptyState}>
            <Text variant="h4" style={styles.textCenter}>
              No workout plan yet
            </Text>
            <Text variant="bodySecondary" color="textSecondary" style={styles.textCenter}>
              {error}
            </Text>
            <Button
              label="Start workout intake"
              size="medium"
              onPress={() => router.push('/intake/workout-intro')}
              style={styles.emptyStateButton}
            />
          </View>
        ) : loading || !day || !focus ? (
          <Text variant="bodySecondary" color="textSecondary" style={styles.loadingText}>
            Loading your plan…
          </Text>
        ) : day.isRestDay ? (
          <View style={styles.emptyState}>
            <Text variant="h4" style={styles.textCenter}>
              Rest day
            </Text>
            <Text variant="bodySecondary" color="textSecondary" style={styles.textCenter}>
              No exercises scheduled — recovery is part of the plan too.
            </Text>
          </View>
        ) : (
          <>
            <WorkoutFocusCard {...focus} onStartWorkout={handleStartWorkout} />

            <Text variant="h5" style={styles.sectionTitle}>
              Exercises
            </Text>
            {isFutureDate && (
              <Text variant="caption" color="textMuted" style={styles.previewHint}>
                You can mark exercises complete once this day arrives.
              </Text>
            )}

            <View style={styles.exercises}>
              {exercises.map((exercise) => (
                <ExerciseRow
                  key={exercise.id}
                  exercise={exercise}
                  onPress={goToExercise}
                  onToggleComplete={handleToggleExerciseComplete}
                  toggling={togglingExerciseId === exercise.id}
                  locked={isFutureDate}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.s6,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
    marginBottom: Spacing.s5,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    gap: Spacing.s2,
    marginBottom: Spacing.s6,
  },
  weekStrip: {
    marginBottom: Spacing.s6,
  },
  sectionTitle: {
    marginTop: Spacing.s6,
    marginBottom: Spacing.s4,
  },
  previewHint: {
    marginTop: -Spacing.s2,
    marginBottom: Spacing.s3,
  },
  exercises: {
    gap: Spacing.s3,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: Spacing.s8,
  },
  emptyState: {
    alignItems: 'center',
    gap: Spacing.s3,
    marginTop: Spacing.s8,
    paddingHorizontal: Spacing.s4,
  },
  emptyStateButton: {
    marginTop: Spacing.s3,
  },
  textCenter: {
    textAlign: 'center',
  },
});
