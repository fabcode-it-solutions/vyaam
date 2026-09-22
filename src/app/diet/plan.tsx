import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { ArrowIcon, Button, IconButton, Pill, SendIcon, SlidersIcon, Text } from '@/components/ui';
import { CalorieSummaryCard, MealRow, type Meal } from '@/components/diet';
import { WeekDaySelector, type WeekDay } from '@/components/plans';
import { getDietPlan, logMeal, type DietPlanForDate } from '@/lib/api/endpoints/dietPlan';
import { ApiError } from '@/lib/api/errors';
import {
  currentWeekDates,
  dayOfMonthFromDateString,
  dayOfWeekFromDate,
  todayDateString,
  weekdayLabel,
} from '@/lib/date/week';
import { formatEnumLabel } from '@/lib/format/enumLabel';
import { Spacing, useTheme } from '@/theme';

const WEEK_DATES = currentWeekDates();
const WEEK_DAYS: WeekDay[] = WEEK_DATES.map((date, index) => ({
  label: weekdayLabel(index),
  date: dayOfMonthFromDateString(date),
}));
const TODAY_INDEX = dayOfWeekFromDate();

const FULL_WEEKDAY_LABELS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

/** The dark hero card's eyebrow — only says "TODAY" when that's actually the selected day. */
function calorieEyebrowLabel(selectedDate: string): string {
  const today = todayDateString();
  if (selectedDate === today) return 'TODAY · CALORIES';

  const diffDays = Math.round(
    (new Date(`${selectedDate}T00:00:00Z`).getTime() - new Date(`${today}T00:00:00Z`).getTime()) / 86_400_000,
  );
  if (diffDays === 1) return 'TOMORROW · CALORIES';
  if (diffDays === -1) return 'YESTERDAY · CALORIES';

  return `${FULL_WEEKDAY_LABELS[dayOfWeekFromDate(new Date(`${selectedDate}T00:00:00Z`))]} · CALORIES`;
}

function mealsFor(plan: DietPlanForDate): Meal[] {
  // `calories` is the per-serving figure (every diet-plan meal has
  // baseServings 1 — see dietPlan.service.ts submitDietIntake); `servings`
  // reflects whatever the user last logged for this date.
  return plan.meals.map((meal) => ({
    id: meal.id,
    title: formatEnumLabel(meal.type),
    description: meal.name,
    kcal: Math.round(meal.calories * meal.servings),
    logged: meal.eaten,
  }));
}

/**
 * Plans/Diet View — Figma node 70:120
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=70-120).
 * Backed by GET /plans/diet — the plan is a single repeating daily template
 * (vyaam-backend dietPlan.service.ts), so the week strip changes which
 * date's logged progress is shown, not the meal list itself.
 */
export default function DietPlanScreen() {
  const { colors } = useTheme();
  const [selectedDay, setSelectedDay] = useState(TODAY_INDEX);
  const [plan, setPlan] = useState<DietPlanForDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingMealId, setTogglingMealId] = useState<string | null>(null);

  const selectedDate = WEEK_DATES[selectedDay];

  // Refetch on focus, not just when the selected date changes — so coming
  // back from a meal's detail screen after Mark as eaten/uneaten shows the
  // updated calorie total and logged state right away.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      setError(null);
      getDietPlan(selectedDate).then(
        (result) => {
          if (cancelled) return;
          setPlan(result);
          setLoading(false);
        },
        (err) => {
          if (cancelled) return;
          setPlan(null);
          setLoading(false);
          setError(
            err instanceof ApiError ? err.message : 'Could not load your diet plan. Check your connection and try again.',
          );
        },
      );
      return () => {
        cancelled = true;
      };
    }, [selectedDate]),
  );

  const meals = useMemo(() => (plan ? mealsFor(plan) : []), [plan]);
  const eyebrowLabel = useMemo(() => calorieEyebrowLabel(selectedDate), [selectedDate]);

  const handleFilters = useCallback(() => {
    Alert.alert('Coming soon', 'Filtering the diet plan isn’t available yet.');
  }, []);

  const handleShare = useCallback(() => {
    router.push({ pathname: '/diet/share-with-trainer', params: { planType: 'diet' } });
  }, []);

  const handleWorkoutTabPress = useCallback(() => router.push('/plans/workout'), []);
  const handleDietTabPress = useCallback(() => {}, []);

  const handleMealPress = useCallback(
    (meal: Meal) => {
      router.push({ pathname: '/diet/meal/[mealId]', params: { mealId: meal.id, date: selectedDate } });
    },
    [selectedDate],
  );

  // A future day can be previewed but not logged — there's nothing to have
  // eaten yet. Today and past days stay editable (past ones so a missed log
  // can still be corrected).
  const isFutureDate = selectedDate > todayDateString();

  // Ticking the status circle logs/unlogs the meal in place — the plan state
  // is patched from the response rather than refetched, so the calorie total
  // and check update immediately with no extra round trip.
  const handleToggleMealLogged = useCallback(
    async (meal: Meal) => {
      if (selectedDate > todayDateString()) {
        Alert.alert("Can't log in advance", 'You can mark a meal as eaten once that day arrives.');
        return;
      }
      setTogglingMealId(meal.id);
      try {
        const result = await logMeal(meal.id, { eaten: !meal.logged, date: selectedDate });
        setPlan((prev) => {
          if (!prev) return prev;
          const updatedMeals = prev.meals.map((m) =>
            m.id === meal.id ? { ...m, eaten: result.eaten, servings: result.servings } : m,
          );
          const caloriesConsumed = updatedMeals
            .filter((m) => m.eaten)
            .reduce((sum, m) => sum + m.calories * m.servings, 0);
          return { ...prev, meals: updatedMeals, caloriesConsumed: Math.round(caloriesConsumed) };
        });
      } catch (err) {
        Alert.alert(
          'Could not update meal',
          err instanceof ApiError ? err.message : 'Something went wrong. Try again.',
        );
      } finally {
        setTogglingMealId(null);
      }
    },
    [selectedDate],
  );

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
            Your diet plan
          </Text>
          <IconButton
            accessibilityLabel="Share diet plan"
            variant="surface"
            icon={<SendIcon color={colors.textPrimary} />}
            onPress={handleShare}
          />
          {/* <IconButton
            accessibilityLabel="Filter diet plan"
            variant="surface"
            icon={<SlidersIcon color={colors.textPrimary} />}
            onPress={handleFilters}
          /> */}
        </View>

        <View style={styles.tabs}>
          <Pill label="Workout" selected={false} onPress={handleWorkoutTabPress} />
          <Pill label="Diet" selected onPress={handleDietTabPress} />
        </View>

        <View style={styles.weekStrip}>
          <WeekDaySelector days={WEEK_DAYS} selectedIndex={selectedDay} onSelect={setSelectedDay} />
        </View>

        {error && !plan ? (
          <View style={styles.emptyState}>
            <Text variant="h4" style={styles.textCenter}>
              No diet plan yet
            </Text>
            <Text variant="bodySecondary" color="textSecondary" style={styles.textCenter}>
              {error}
            </Text>
            <Button
              label="Start diet intake"
              size="medium"
              onPress={() => router.push('/intake/diet-intro')}
              style={styles.emptyStateButton}
            />
          </View>
        ) : plan && !loading ? (
          <>
            <CalorieSummaryCard
              consumedKcal={plan.caloriesConsumed}
              targetKcal={plan.dailyCalorieTarget}
              proteinG={plan.macroTargets.proteinG}
              carbsG={plan.macroTargets.carbsG}
              fatG={plan.macroTargets.fatG}
              eyebrowLabel={eyebrowLabel}
            />

            <Text variant="h4" style={styles.sectionTitle}>
              {isFutureDate ? 'Meal plan preview' : 'Today’s meals'}
            </Text>
            {isFutureDate && (
              <Text variant="caption" color="textMuted" style={styles.previewHint}>
                You can mark meals eaten once this day arrives.
              </Text>
            )}

            <View style={styles.meals}>
              {meals.map((meal) => (
                <MealRow
                  key={meal.id}
                  meal={meal}
                  onPress={handleMealPress}
                  onToggleLogged={handleToggleMealLogged}
                  toggling={togglingMealId === meal.id}
                  locked={isFutureDate}
                />
              ))}
            </View>
          </>
        ) : (
          <Text variant="bodySecondary" color="textSecondary" style={styles.loadingText}>
            Loading your plan…
          </Text>
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
    paddingBottom: Spacing.s8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
    marginTop: Spacing.s3,
    marginBottom: Spacing.s6,
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
  meals: {
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
