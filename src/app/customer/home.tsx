import { Redirect, router, Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CalculatorsRow,
  CategoryChips,
  DietPlanCard,
  HomeHeader,
  HomeSearchBar,
  HomeTabBar,
  NearbyTrainerRow,
  NEARBY_TRAINER_ROW_HEIGHT,
  PromoCard,
  TopRatedTrainerCard,
  TOP_RATED_CARD_WIDTH,
  TwoTabBar,
  WeeklyProgressChart,
  WorkoutPlanCard,
  type CategoryChip,
  type HomeTab,
  type NearbyTrainer,
  type PromoCardData,
  type TopRatedTrainer,
} from '@/components/home';
import { LogoMark, PieChartIcon, Text } from '@/components/ui';
import { getDietPlan, type DietPlanForDate } from '@/lib/api/endpoints/dietPlan';
import { ApiError } from '@/lib/api/errors';
import { regeneratePlan, type PlanType, type RegenerateScope } from '@/lib/api/endpoints/plan';
import { getProgressSummary, type ProgressSummary } from '@/lib/api/endpoints/progress';
import { getWorkoutDay, getWorkoutWeek, type WorkoutDay, type WorkoutWeekDay } from '@/lib/api/endpoints/workoutPlan';
import { mondayOf, toDateString } from '@/lib/date/week';
import { getHomeRouteForRole } from '@/lib/navigation/roleHome';
import { useSessionStore } from '@/store/useSessionStore';
import { Spacing, useTheme } from '@/theme';

/** `assertWeeklyPlanQuota` (vyaam-backend) only gates against a plan type's
 * previous SUCCESSFUL generation, so the app can't know the exact cooldown
 * until it tries — this just turns the 429 into a friendly retry date. */
function formatRetryAfter(retryAfterSeconds: number | undefined): string {
  if (!retryAfterSeconds || retryAfterSeconds <= 0) return 'again shortly';
  const days = Math.ceil(retryAfterSeconds / 86_400);
  if (days <= 1) return 'again tomorrow';
  return `again in ${days} days`;
}

const img1 = require('../../../assets/images/image1.png');
const img2 = require('../../../assets/images/image2.png');
const img3 = require('../../../assets/images/image3.png');
const toprated = require('../../../assets/images/toprated.png');
const available1 = require('../../../assets/images/available1.png');
const available2 = require('../../../assets/images/available2.png');

const CATEGORIES: CategoryChip[] = [
  { key: 'all', label: 'All' },
  { key: 'nearYou', label: 'Near you' },
  { key: 'topRated', label: 'Top rated' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'gym', label: 'Gym' },
];

const PROMOS: PromoCardData[] = [
  {
    id: 'promo-1',
    tag: 'Sale',
    title: '20% off your first 3 sessions',
    trainerName: 'Rahul Verma',
    specialty: 'Strength coach',
    rating: 4.7,
    distanceKm: 2.1,
    ctaLabel: 'View offer',
    photoUri: img1,
  },
  {
    id: 'promo-2',
    tag: 'New batch',
    title: '6 AM park batch starting Monday',
    trainerName: 'Aarushi Rao',
    specialty: 'Yoga trainer',
    rating: 4.9,
    distanceKm: 3.4,
    ctaLabel: 'Join batch',
    photoUri: img2,
  },
  {
    id: 'promo-3',
    tag: 'Free session',
    title: 'Try a free 30-min yoga session',
    trainerName: 'Meera Iyer',
    specialty: 'Yoga trainer',
    rating: 4.8,
    distanceKm: 1.8,
    ctaLabel: 'Book free session',
    photoUri: img3,
  },
];

const TOP_RATED: TopRatedTrainer[] = [
  { id: 'top-1', name: 'Anjali Kaushik', specialty: 'Yoga', rating: 4.8, distanceKm: 2.3, verified: true, photoUri: toprated },
  { id: 'top-2', name: 'Rohit Sharma', specialty: 'Strength', rating: 4.8, distanceKm: 2.3, verified: true, photoUri: toprated },
  { id: 'top-3', name: 'Fatima Sheikh', specialty: 'Yoga', rating: 4.9, distanceKm: 1.2, verified: true, photoUri: toprated },
  { id: 'top-4', name: 'Karan Mehta', specialty: 'Gym', rating: 4.7, distanceKm: 0.8, verified: true, photoUri: toprated },
];

const NEARBY: NearbyTrainer[] = [
  { id: 'nearby-1', name: 'Karan Mehta', category: 'Gym', mode: 'At home', distanceKm: 0.8, verified: true, photoUri: available1 },
  { id: 'nearby-2', name: 'Fatima Sheikh', category: 'Yoga', mode: 'Online', distanceKm: 1.2, verified: true, photoUri: available2 },
];

const NEARBY_SEPARATOR = Spacing.s3;
const TOP_RATED_SEPARATOR = Spacing.s3;

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn't available yet.`);
}

export default function CustomerHomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState('all');
  const activeRole = useSessionStore((s) => s.user?.activeRole);

  const [dietPlanLoading, setDietPlanLoading] = useState(true);
  const [dietPlan, setDietPlan] = useState<DietPlanForDate | null>(null);
  const [workoutLoading, setWorkoutLoading] = useState(true);
  const [workoutDay, setWorkoutDay] = useState<WorkoutDay | null>(null);
  const [tomorrowWorkout, setTomorrowWorkout] = useState<WorkoutWeekDay | null>(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [regeneratingDiet, setRegeneratingDiet] = useState(false);
  const [regeneratingWorkout, setRegeneratingWorkout] = useState(false);

  // Refetch on focus, not just on mount — so returning from meal/exercise
  // logging (e.g. Diet plan > meal detail > Mark as eaten > back) shows the
  // updated calories/next-meal/streaks immediately, with no manual refresh.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function loadDietPlan() {
        setDietPlanLoading(true);
        try {
          const plan = await getDietPlan();
          if (!cancelled) setDietPlan(plan);
        } catch {
          // A 404 ("complete the diet intake first") or a transient network
          // blip both just mean "nothing to show yet" for this summary card.
          if (!cancelled) setDietPlan(null);
        } finally {
          if (!cancelled) setDietPlanLoading(false);
        }
      }

      async function loadWorkoutDay() {
        setWorkoutLoading(true);
        try {
          const day = await getWorkoutDay();
          if (!cancelled) setWorkoutDay(day);
        } catch {
          if (!cancelled) setWorkoutDay(null);
        } finally {
          if (!cancelled) setWorkoutLoading(false);
        }
      }

      async function loadTomorrowWorkout() {
        try {
          const week = await getWorkoutWeek(mondayOf());
          const tomorrow = new Date();
          tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
          const tomorrowDate = toDateString(tomorrow);
          // Crosses into next week's Monday for a Sunday "today" — a second
          // week fetch for that edge case isn't worth it for a Home preview line.
          if (!cancelled) setTomorrowWorkout(week.days.find((d) => d.date === tomorrowDate) ?? null);
        } catch {
          if (!cancelled) setTomorrowWorkout(null);
        }
      }

      async function loadProgress() {
        setProgressLoading(true);
        try {
          const summary = await getProgressSummary(7);
          if (!cancelled) setProgress(summary);
        } catch {
          if (!cancelled) setProgress(null);
        } finally {
          if (!cancelled) setProgressLoading(false);
        }
      }

      loadDietPlan();
      loadWorkoutDay();
      loadTomorrowWorkout();
      loadProgress();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const handleViewDietPlan = useCallback(() => router.push('/diet/plan'), []);
  const handleGenerateDietPlan = useCallback(() => router.push('/intake/diet-intro'), []);
  const handleViewWorkoutPlan = useCallback(() => router.push('/plans/workout'), []);
  const handleGenerateWorkoutPlan = useCallback(() => router.push('/intake/workout-intro'), []);

  // Shared by both regenerate confirmations below — POST /plans/regenerate
  // queues a fresh job the same way intake submission does, so we route into
  // the same generating-screen pattern rather than blocking Home on the poll.
  const runRegenerate = useCallback(
    async (planType: PlanType, scope: RegenerateScope, setPending: (pending: boolean) => void) => {
      setPending(true);
      try {
        const { jobId } = await regeneratePlan(planType, scope);
        router.push({ pathname: '/plans/regenerating', params: { jobId, planType } });
      } catch (err) {
        if (err instanceof ApiError && err.code === 'RATE_LIMITED') {
          Alert.alert(
            'Already up to date',
            `You can only regenerate your ${planType} plan once a week, so this one is ready to go ${formatRetryAfter(err.retryAfterSeconds)}.`,
          );
        } else {
          Alert.alert(
            'Could not regenerate plan',
            err instanceof ApiError ? err.message : 'Something went wrong. Try again.',
          );
        }
      } finally {
        setPending(false);
      }
    },
    [],
  );

  const handleRegenerateDietPlan = useCallback(() => {
    Alert.alert(
      'Regenerate diet plan?',
      'This builds a fresh plan from your latest intake answers and replaces the one you have now.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Regenerate', onPress: () => runRegenerate('diet', 'full', setRegeneratingDiet) },
      ],
    );
  }, [runRegenerate]);

  const handleRegenerateWorkoutPlan = useCallback(() => {
    Alert.alert('Regenerate workout plan?', 'Choose how much of your current plan to rebuild.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Keep past days',
        onPress: () => runRegenerate('workout', 'remaining_days', setRegeneratingWorkout),
      },
      { text: 'Rebuild full plan', onPress: () => runRegenerate('workout', 'full', setRegeneratingWorkout) },
    ]);
  }, [runRegenerate]);

  const handleNavigateTab = useCallback((tab: HomeTab) => {
    if (tab === 'home') return;
    if (tab === 'me') {
      // `push`, not `replace` — Home stays underneath in the stack so
      // "back" from Me (hardware back, the header back button, or tapping
      // Home in the tab bar again) returns to this exact Home screen
      // instead of whatever screen preceded it before the tab switch.
      // Paired with `animation: 'none'` on both Stack.Screen options below
      // so the push still reads as a flat tab switch, not a sliding page.
      router.push('/profile/myprofile');
      return;
    }
   if (tab === 'discover') { router.push('/discover/trainer-list'); return; }
    comingSoon('Community');
  }, []);

  const handleQuickAction = useCallback(() => comingSoon('This'), []);
  const handleOpenSearch = useCallback(() => router.push('/search'), []);
  const handleOpenNotifications = useCallback(() => router.push('/notifications'), []);
  const handlePromoPress = useCallback((promo: PromoCardData) => comingSoon(promo.title), []);
  const handleTrainerPress = useCallback((trainer: TopRatedTrainer | NearbyTrainer) => comingSoon(trainer.name), []);

  const renderNearbyItem = useCallback(
    ({ item }: ListRenderItemInfo<NearbyTrainer>) => <NearbyTrainerRow trainer={item} onPress={handleTrainerPress} />,
    [handleTrainerPress],
  );
  const keyExtractor = useCallback((item: NearbyTrainer) => item.id, []);
  const getItemLayout = useCallback(
    (_data: ArrayLike<NearbyTrainer> | null | undefined, index: number) => ({
      length: NEARBY_TRAINER_ROW_HEIGHT,
      offset: (NEARBY_TRAINER_ROW_HEIGHT + NEARBY_SEPARATOR) * index,
      index,
    }),
    [],
  );

  const renderTopRatedItem = useCallback(
    ({ item }: ListRenderItemInfo<TopRatedTrainer>) => (
      <TopRatedTrainerCard trainer={item} onPress={handleTrainerPress} />
    ),
    [handleTrainerPress],
  );
  const topRatedKeyExtractor = useCallback((item: TopRatedTrainer) => item.id, []);
  const getTopRatedItemLayout = useCallback(
    (_data: ArrayLike<TopRatedTrainer> | null | undefined, index: number) => ({
      length: TOP_RATED_CARD_WIDTH,
      offset: (TOP_RATED_CARD_WIDTH + TOP_RATED_SEPARATOR) * index,
      index,
    }),
    [],
  );

  if (activeRole && activeRole !== 'customer') {
    return <Redirect href={getHomeRouteForRole(activeRole)} />;
  }

  const ListHeader = (
    <View style={styles.header}>
      {/*
        Location selector + notifications bell, and the trainer/discover
        search bar — commented out, not deleted, per product direction
        (2026-09-03): Home should only show "Your plans" and "Calculators"
        for now. Restore alongside the marketplace section below when
        Discover ships on Home again.

      <HomeHeader
        locationLabel="Hisar, Haryana"
        hasUnreadNotifications
        onNotificationsPress={handleOpenNotifications}
      />

      <HomeSearchBar placeholder="Search trainers, yoga, gym..." onPress={handleOpenSearch} />
      */}

      <View style={styles.logoRow}>
        <LogoMark size={44} tile />
        <Text variant="h3" style={styles.wordmark}>
          VYAAM
        </Text>
      </View>

      <Text variant="h3" style={styles.sectionTitle}>
        Your plans
      </Text>
      <View style={styles.plansColumn}>
        <DietPlanCard
          loading={dietPlanLoading}
          plan={dietPlan}
          onView={handleViewDietPlan}
          onGenerate={handleGenerateDietPlan}
          onRegenerate={handleRegenerateDietPlan}
          regenerating={regeneratingDiet}
        />
        <WorkoutPlanCard
          loading={workoutLoading}
          day={workoutDay}
          tomorrow={tomorrowWorkout}
          onView={handleViewWorkoutPlan}
          onGenerate={handleGenerateWorkoutPlan}
          onRegenerate={handleRegenerateWorkoutPlan}
          regenerating={regeneratingWorkout}
        />
      </View>

      <WeeklyProgressChart
        loading={progressLoading}
        days={progress?.days ?? []}
        dietStreakDays={progress?.dietStreakDays ?? 0}
        workoutStreakDays={progress?.workoutStreakDays ?? 0}
      />

      <CalculatorsRow />

      {/*
        Marketplace/Discover static-data sections — commented out, not
        deleted, per product direction (2026-09-03): Home should only show
        "Your plans" and "Calculators" for now. Restore this block (and swap
        the empty `data={[]}` below back to `data={NEARBY}`) when the
        Discover/marketplace feed is ready to ship on Home again.

      <CategoryChips options={CATEGORIES} selectedKey={category} onSelect={setCategory} />

      <View style={styles.promoSection}>
        {PROMOS.map((promo) => (
          <PromoCard key={promo.id} promo={promo} onPress={handlePromoPress} />
        ))}
      </View>

      <Text variant="h4" style={styles.sectionTitle}>
        Top rated near you
      </Text>
      <FlatList
        data={TOP_RATED}
        renderItem={renderTopRatedItem}
        keyExtractor={topRatedKeyExtractor}
        getItemLayout={getTopRatedItemLayout}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={TopRatedSeparator}
        contentContainerStyle={styles.topRatedContent}
      />

      <Text variant="h4" style={styles.sectionTitle}>
        Available within 10 km
      </Text>
      */}
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* No slide-in animation — Home/Me should read as tabs, not pages. */}
      <Stack.Screen options={{ animation: 'none' }} />
      <FlatList
        // Nearby-trainers data disabled along with the rest of the
        // marketplace section above — was `data={NEARBY}`.
        data={[]}
        renderItem={renderNearbyItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      {/*
        Full Home/Discover/Community/Me tab bar (with raised quick-action
        button) — commented out, not deleted, per product direction
        (2026-09-03): only Home and Me are live for now. Restore alongside
        the Discover/Community sections above when they ship.

      <HomeTabBar active="home" onNavigate={handleNavigateTab} onQuickAction={handleQuickAction} />
      */}
      <TwoTabBar active="home" onNavigate={handleNavigateTab} />
    </View>
  );
}

function ItemSeparator() {
  return <View style={{ height: NEARBY_SEPARATOR }} />;
}

function TopRatedSeparator() {
  return <View style={{ width: TOP_RATED_SEPARATOR }} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s6,
  },
  header: {
    gap: Spacing.s4,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s2,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.s2,
    marginBottom: Spacing.s1,
  },
  wordmark: {
    // Brand lockup treatment (Figma node 24:13) — letter-spacing only, the
    // wordmark text is already typed in caps.
    letterSpacing: 0.7,
  },
  plansColumn: {
    gap: Spacing.s3,
  },
  promoSection: {
    gap: Spacing.s3,
  },
  sectionTitle: {
    marginTop: Spacing.s2,
  },
  topRatedContent: {
    paddingRight: Spacing.s4,
  },
});
