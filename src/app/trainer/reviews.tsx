import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReviewCard, ReviewSummaryCard, type RatingBreakdownRow, type TrainerReview } from '@/components/trainer';
import { BackButton, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * Trainer Reviews — full list opened from a trainer's profile. Average,
 * breakdown, and reviews below are illustrative; needs the real
 * reviews endpoint (Style A pagination), keyed off the `id` route param,
 * rather than a static list.
 */

const AVERAGE_RATING = 4.8;
const TOTAL_REVIEWS = 63;

const BREAKDOWN: RatingBreakdownRow[] = [
  { stars: 5, percent: 86 },
  { stars: 4, percent: 32 },
  { stars: 3, percent: 4 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

const REVIEWS: TrainerReview[] = [
  {
    id: 'review-1',
    name: 'Meera Iyer',
    initials: 'MI',
    rating: 5,
    timeAgo: '2 weeks ago',
    text: "Anjali is incredibly patient. I could barely touch my toes when we started and now I can hold a full forward fold. She never pushes too hard.",
  },
  {
    id: 'review-2',
    name: 'Sanjay Rao',
    initials: 'SR',
    rating: 5,
    timeAgo: '1 month ago',
    text: 'Best decision for my back pain. Sessions are calm and she actually explains why each pose helps.',
  },
  {
    id: 'review-3',
    name: 'Divya Nair',
    initials: 'DN',
    rating: 4,
    timeAgo: '2 months ago',
    text: 'Great trainer, sometimes runs a few minutes late but always makes up the full session time.',
  },
];

export default function TrainerReviewsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  useLocalSearchParams<{ id?: string }>();

  const renderItem = useCallback(({ item }: ListRenderItemInfo<TrainerReview>) => <ReviewCard review={item} />, []);
  const keyExtractor = useCallback((item: TrainerReview) => item.id, []);

  const ListHeader = (
    <View style={styles.headerCard}>
      <ReviewSummaryCard average={AVERAGE_RATING} totalReviews={TOTAL_REVIEWS} breakdown={BREAKDOWN} />
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">Reviews</Text>
      </View>

      <FlatList
        data={REVIEWS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s4,
  },
  headerCard: {
    paddingBottom: Spacing.s3,
  },
  listContent: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s6,
    gap: Spacing.s3,
  },
});
