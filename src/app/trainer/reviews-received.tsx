import { router } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReviewCard, TrainerRatingSummaryCard, type TrainerReview } from '@/components/trainer';
import { BackButton, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * Trainer/Reviews Received — a trainer's own reviews, seen from Trainer
 * Home/profile. Average, counts, and reviews below are illustrative; needs
 * the real reviews endpoint (Style A pagination) rather than a static list.
 */
const AVERAGE_RATING = 4.8;
const TOTAL_REVIEWS = 63;
const TOTAL_CLIENTS = 47;

const REVIEWS: TrainerReview[] = [
  {
    id: 'review-1',
    name: 'Meera Iyer',
    initials: 'MI',
    rating: 5,
    timeAgo: '2 weeks ago',
    text: 'Incredibly patient. I could barely touch my toes when we started.',
  },
  {
    id: 'review-2',
    name: 'Sanjay Rao',
    initials: 'SR',
    rating: 5,
    timeAgo: '1 month ago',
    text: 'Best decision for my back pain. Sessions are calm and well explained.',
  },
];

export default function TrainerReviewsReceivedScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(({ item }: ListRenderItemInfo<TrainerReview>) => <ReviewCard review={item} />, []);
  const keyExtractor = useCallback((item: TrainerReview) => item.id, []);

  const ListHeader = (
    <View style={styles.headerCard}>
      <TrainerRatingSummaryCard average={AVERAGE_RATING} totalReviews={TOTAL_REVIEWS} totalClients={TOTAL_CLIENTS} />
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
