import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, StarRating, Text } from '@/components/ui';
import { Spacing, tabularNums } from '@/theme';

export type TrainerRatingSummaryCardProps = {
  average: number;
  totalReviews: number;
  totalClients: number;
};

/**
 * Trainer/Reviews Received's header card — average + stars on one line,
 * review/client counts below. Simpler than ReviewSummaryCard's average +
 * per-star breakdown-bars layout, so it's its own component rather than an
 * awkward variant of that one.
 */
export const TrainerRatingSummaryCard = memo(function TrainerRatingSummaryCard({
  average,
  totalReviews,
  totalClients,
}: TrainerRatingSummaryCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <Text variant="h1" style={tabularNums}>
          {average.toFixed(1)}
        </Text>
        <StarRating rating={average} size={16} />
      </View>
      <Text variant="caption" color="textSecondary">
        {totalReviews} reviews · {totalClients} clients
      </Text>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    gap: Spacing.s2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
});
