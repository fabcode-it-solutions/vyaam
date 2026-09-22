import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/Screen';
import { ArrowIcon, Button, ForkKnifeIcon, IconButton, Text } from '@/components/ui';
import { IngredientList, InstructionSteps, MacroCalorieCard, ServingStepper } from '@/components/meal';
import { getMealDetail, logMeal, type DietMealDetail } from '@/lib/api/endpoints/dietPlan';
import { ApiError } from '@/lib/api/errors';
import { todayDateString } from '@/lib/date/week';
import { formatEnumLabel } from '@/lib/format/enumLabel';
import { Spacing, useTheme } from '@/theme';

const HERO_HEIGHT = 260;

/**
 * Plans/Meal Detail — Figma node 152:482
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=152-482).
 * Backed by GET /plans/diet/meals/:mealId (overlays the given/today's logged
 * eaten/servings) and PATCH .../log — the mark-eaten action toggles both
 * ways, matching whatever the fetched state was. `date` arrives from the
 * plan list's week strip so a future day previews correctly instead of
 * silently showing/logging today's state.
 */
export default function MealDetailScreen() {
  const { mealId, date } = useLocalSearchParams<{ mealId: string; date?: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [meal, setMeal] = useState<DietMealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState(1);
  const [logging, setLogging] = useState(false);
  const [eaten, setEaten] = useState(false);

  const isFutureDate = !!date && date > todayDateString();

  useEffect(() => {
    if (!mealId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getMealDetail(mealId, date).then(
      (result) => {
        if (cancelled) return;
        setMeal(result);
        setServings(result.servings || result.baseServings || 1);
        setEaten(result.eaten);
        setLoading(false);
      },
      () => {
        if (!cancelled) setLoading(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [mealId, date]);

  const scaled = useMemo(() => {
    if (!meal) return null;
    const ratio = servings / (meal.baseServings || 1);
    return {
      kcal: Math.round(meal.calories * ratio),
      proteinG: Math.round(meal.macros.proteinG * ratio),
      carbsG: Math.round(meal.macros.carbsG * ratio),
      fatG: Math.round(meal.macros.fatG * ratio),
    };
  }, [meal, servings]);

  const handleToggleEaten = useCallback(async () => {
    if (!meal) return;
    if (isFutureDate) {
      Alert.alert("Can't log in advance", 'You can mark a meal as eaten once that day arrives.');
      return;
    }
    const nextEaten = !eaten;
    setLogging(true);
    try {
      const result = await logMeal(meal.id, { eaten: nextEaten, servings, date });
      setEaten(result.eaten);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not log this meal. Try again.';
      Alert.alert('Could not log meal', message);
    } finally {
      setLogging(false);
    }
  }, [meal, eaten, servings, date, isFutureDate]);

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
            Loading meal…
          </Text>
        </View>
      </Screen>
    );
  }

  if (!meal || !scaled) {
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
            Meal details aren’t ready yet
          </Text>
          <Text variant="bodySecondary" color="textSecondary" style={styles.textCenter}>
            This meal doesn’t have a full recipe breakdown in the plan yet.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen padded={false} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: colors.border }]}>
          <ForkKnifeIcon size={40} color={colors.textMuted} />
        </View>
        <IconButton
          accessibilityLabel="Go back"
          icon={<ArrowIcon direction="left" size={18} color={colors.textPrimary} />}
          onPress={() => router.back()}
          style={[styles.heroBack, { top: insets.top + 12 }]}
        />

        <View style={styles.content}>
          <Text variant="h2">{meal.name}</Text>
          <Text variant="caption" color="textMuted" style={styles.subtitle}>
            {formatEnumLabel(meal.type)}
          </Text>

          <ServingStepper servings={servings} onChange={setServings} />

          <View style={styles.section}>
            <MacroCalorieCard kcal={scaled.kcal} proteinG={scaled.proteinG} carbsG={scaled.carbsG} fatG={scaled.fatG} />
          </View>

          <Text variant="h4" style={styles.sectionTitle}>
            Ingredients
          </Text>
          <IngredientList ingredients={meal.ingredients} />

          <Text variant="h4" style={styles.sectionTitle}>
            How to make it
          </Text>
          <InstructionSteps steps={meal.steps} />

          {isFutureDate && (
            <Text variant="caption" color="textMuted" style={styles.futureHint}>
              You can mark this meal eaten once that day arrives.
            </Text>
          )}
          <Button
            label={isFutureDate ? 'Not available yet' : eaten ? 'Mark as uneaten' : 'Mark as eaten'}
            variant={eaten && !isFutureDate ? 'secondary' : 'primary'}
            size="large"
            fullWidth
            loading={logging}
            disabled={isFutureDate}
            onPress={handleToggleEaten}
            style={styles.markEaten}
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
  heroBack: {
    position: 'absolute',
    left: Spacing.s6,
  },
  content: {
    paddingHorizontal: Spacing.s6,
    marginTop: Spacing.s5,
  },
  subtitle: {
    marginTop: Spacing.s2,
    marginBottom: Spacing.s5,
  },
  section: {
    marginTop: Spacing.s5,
  },
  sectionTitle: {
    marginTop: Spacing.s6,
    marginBottom: Spacing.s4,
  },
  markEaten: {
    marginTop: Spacing.s2,
  },
  futureHint: {
    marginTop: Spacing.s8,
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
